import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/utils/prisma';

const LOCKOUT_MINUTES = 15;
const MAX_ATTEMPTS = 5;

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Helper to check if IP is locked out
async function checkRateLimit(ip) {
  const attempt = await prisma.loginAttempt.findUnique({
    where: { ip },
  });

  if (!attempt) return { allowed: true };

  if (attempt.blockedAt) {
    const blockTime = new Date(attempt.blockedAt).getTime();
    const now = Date.now();
    const diffMinutes = (now - blockTime) / (1000 * 60);

    if (diffMinutes < LOCKOUT_MINUTES) {
      const minutesRemaining = Math.ceil(LOCKOUT_MINUTES - diffMinutes);
      return {
        allowed: false,
        message: `Too many failed login attempts. Please try again in ${minutesRemaining} minutes.`,
      };
    } else {
      // Lockout expired, reset attempts in DB
      await prisma.loginAttempt.update({
        where: { ip },
        data: { attempts: 0, blockedAt: null },
      });
    }
  }

  return { allowed: true };
}

// Helper to record a failed attempt
async function recordFailedAttempt(ip) {
  const attempt = await prisma.loginAttempt.findUnique({
    where: { ip },
  });

  if (!attempt) {
    await prisma.loginAttempt.create({
      data: { ip, attempts: 1 },
    });
    return { attempts: 1, blocked: false };
  }

  const newAttempts = attempt.attempts + 1;
  const data = { attempts: newAttempts };

  if (newAttempts >= MAX_ATTEMPTS) {
    data.blockedAt = new Date();
  }

  await prisma.loginAttempt.update({
    where: { ip },
    data,
  });

  return { attempts: newAttempts, blocked: newAttempts >= MAX_ATTEMPTS };
}

// Helper to reset attempts on successful login
async function resetAttempts(ip) {
  try {
    await prisma.loginAttempt.delete({
      where: { ip },
    });
  } catch (err) {
    // Ignore if record not found
  }
}

// Helper to verify Google reCAPTCHA v3
async function verifyRecaptcha(token, ip) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn('reCAPTCHA secret key is missing. Bypassing check.');
    return true;
  }
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}${ip ? `&remoteip=${ip}` : ''}`,
    });
    const data = await response.json();
    console.log('reCAPTCHA v3 verification result:', data);
    return data.success && data.score >= 0.5; // v3 verification passes if score >= 0.5
  } catch (error) {
    console.error('reCAPTCHA verification exception:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = body || {};

    // Get client IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required.',
      }, { status: 400 });
    }

    if (!recaptchaToken) {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification token is missing.',
      }, { status: 400 });
    }

    // 2. Check Rate Limiting for IP
    const rateLimitCheck = await checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({
        success: false,
        message: rateLimitCheck.message,
      }, { status: 429 });
    }

    // 3. Verify reCAPTCHA token
    const isHuman = await verifyRecaptcha(recaptchaToken, ip);
    if (!isHuman) {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification failed. Please try again or refresh.',
      }, { status: 400 });
    }

    // 4. Authenticate credentials with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      const { attempts, blocked } = await recordFailedAttempt(ip);
      const remaining = MAX_ATTEMPTS - attempts;
      const message = blocked
        ? `Invalid credentials. Too many failed attempts. You have been locked out for ${LOCKOUT_MINUTES} minutes.`
        : `Invalid credentials. You have ${remaining} attempts remaining before lockout.`;

      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    // 5. Verify the user is an Admin in profiles table
    const profile = await prisma.profile.findUnique({
      where: { id: authData.user.id },
    });

    if (!profile || profile.role !== 'Admin') {
      return NextResponse.json({
        success: false,
        message: 'Access denied. You do not have administrator permissions.',
      }, { status: 403 });
    }

    // 6. Reset login attempts on success
    await resetAttempts(ip);

    return NextResponse.json({
      success: true,
      session: authData.session,
    }, { status: 200 });

  } catch (error) {
    console.error('Server login error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred during login.',
    }, { status: 500 });
  }
}
