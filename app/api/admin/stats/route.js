import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { verifyAdmin } from '@/utils/auth';

export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin access required.',
      }, { status: 401 });
    }

    const [totalContacts, pendingContacts, resolvedContacts, recentContacts] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({
        where: { status: 'Pending' },
      }),
      prisma.contact.count({
        where: {
          status: { in: ['Done', 'Completed', 'Resolved'] },
        },
      }),
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalContacts,
        pendingContacts,
        resolvedContacts,
        recentContacts,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Stats API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve admin stats.',
    }, { status: 500 });
  }
}
