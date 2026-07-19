import axios from 'axios';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/utils/prisma';

// Initialize Resend Client
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Debug log for environment variables
console.log('Loaded Environment Variables:', {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? 'CONFIGURED' : 'MISSING',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'CONFIGURED' : 'MISSING',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
});

// Helper function to send a message via Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
};

// HTML email template
const generateEmailTemplate = (name, email, phone, subject, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Helper function to send an email via Resend
async function sendResendEmail(payload) {
  const { name, email, phone, subject, message: userMessage } = payload;
  
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const toEmail = process.env.RESEND_TO_EMAIL;
  
  if (!process.env.RESEND_API_KEY) {
    console.error('Resend Error: RESEND_API_KEY is not configured.');
    return false;
  }
  
  if (!toEmail) {
    console.error('Resend Error: RESEND_TO_EMAIL is not configured.');
    return false;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Message From ${name}: ${subject}`,
      html: generateEmailTemplate(name, email, phone, subject, userMessage),
    });
    
    if (error) {
      console.error('Resend Error Response:', error);
      return false;
    }
    
    console.log('Resend Success Response:', data);
    return true;
  } catch (error) {
    console.error('Error while sending email via Resend:', error.message || error);
    return false;
  }
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, phone, subject, message: userMessage } = payload || {};

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedSubject = subject?.trim();
    const trimmedMessage = userMessage?.trim();

    // Basic input validation
    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, subject, and message are required.',
      }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address.',
      }, { status: 400 });
    }

    // 1. Save to Supabase via Prisma
    try {
      await prisma.contact.create({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          phone: phone?.trim() || null,
          subject: trimmedSubject,
          message: trimmedMessage,
          status: 'Pending',
        },
      });
    } catch (dbError) {
      console.error('Database Save Error:', dbError.message || dbError);
      return NextResponse.json({
        success: false,
        message: 'Failed to save contact query to database.',
      }, { status: 500 });
    }

    // 2. Try sending notification messages if configured
    const resendConfigured = !!process.env.RESEND_API_KEY && !!process.env.RESEND_TO_EMAIL;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;
    const telegramConfigured = token && chat_id;

    if (!resendConfigured && !telegramConfigured) {
      return NextResponse.json({
        success: true,
        message: 'Message saved successfully in database.',
      }, { status: 200 });
    }

    // Send Telegram message only if configured
    let telegramSuccess = false;
    if (telegramConfigured) {
      const message = `New message from ${trimmedName}\n\nEmail: ${trimmedEmail}\n${phone ? `Phone: ${phone}\n` : ''}Subject: ${trimmedSubject}\n\nMessage:\n\n${trimmedMessage}\n\n`;
      telegramSuccess = await sendTelegramMessage(token, chat_id, message);
    }

    // Send email (primary channel)
    let emailSuccess = false;
    if (resendConfigured) {
      emailSuccess = await sendResendEmail({
        name: trimmedName,
        email: trimmedEmail,
        phone: phone?.trim(),
        subject: trimmedSubject,
        message: trimmedMessage,
      });
    }

    let responseMessage = 'Message saved successfully';
    if (emailSuccess && telegramSuccess) {
      responseMessage += ' and sent via email and Telegram.';
    } else if (emailSuccess) {
      responseMessage += ' and sent via email.';
    } else if (telegramSuccess) {
      responseMessage += ' and sent via Telegram.';
    } else {
      responseMessage += ' but notification channels failed.';
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
    }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
};