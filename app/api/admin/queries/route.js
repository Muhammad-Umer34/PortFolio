import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { verifyAdmin } from '@/utils/auth';

// Fetch all queries (Sorted by most recent first)
export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin access required.',
      }, { status: 401 });
    }

    const queries = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      queries,
    }, { status: 200 });
  } catch (error) {
    console.error('Queries API GET Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve queries.',
    }, { status: 500 });
  }
}

// Update a query's status
export async function PATCH(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin access required.',
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body || {};

    if (!id || !status) {
      return NextResponse.json({
        success: false,
        message: 'Query ID and status are required.',
      }, { status: 400 });
    }

    const validStatuses = ['Pending', 'Done', 'Completed', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      }, { status: 400 });
    }

    // Check if the contact query exists
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({
        success: false,
        message: 'Contact query not found.',
      }, { status: 444 });
    }

    // Update status
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      query: updatedContact,
      message: `Query status successfully updated to ${status}.`,
    }, { status: 200 });
  } catch (error) {
    console.error('Queries API PATCH Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to update query status.',
    }, { status: 500 });
  }
}
