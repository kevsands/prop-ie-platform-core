import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/auth-server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const deletionRequestSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  reason: z.string().optional(),
  confirmDeletion: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm the deletion' }),
  }),
});

/**
 * GDPR Right to Erasure (Right to be Forgotten) Endpoint
 * Allows users to delete their account and all associated data
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request
    const body = await request.json();
    const { password, reason, confirmDeletion } = deletionRequestSchema.parse(body);

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, email: true },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 403 }
      );
    }

    // Check for active transactions or legal holds
    const activeTransactions = await prisma.transaction.count({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id },
        ],
        status: {
          in: ['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW'],
        },
      },
    });

    if (activeTransactions> 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete account with active transactions',
          details: 'Please complete or cancel all active transactions first',
        },
        { status: 400 }
      );
    }

    // Log deletion request for compliance
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DATA_DELETION_REQUEST',
        resourceType: 'USER_ACCOUNT',
        resourceId: session.user.id,
        details: JSON.stringify({ 
          reason, 
          timestamp: new Date().toISOString(),
          email: user.email,
        }),
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
      },
    });

    // Perform data deletion
    await deleteUserData(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been deleted',
      notice: 'This action is irreversible. Some data may be retained for legal compliance.',
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

/**
 * Delete or anonymize all user data
 */
async function deleteUserData(userId: string) {
  // Use a transaction to ensure all deletions succeed or none do
  await prisma.$transaction(async (tx: any) => {
    // 1. Anonymize data that must be retained for legal/financial reasons
    await tx.transaction.updateMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
        status: 'COMPLETED',
      },
      data: {
        // Anonymize but keep for financial records
        buyerId: userId === userId ? 'DELETED_USER' : undefined,
        sellerId: userId === userId ? 'DELETED_USER' : undefined,
      },
    });

    // 2. Delete personal documents
    await tx.document.deleteMany({
      where: { uploadedById: userId },
    });

    // 3. Delete communications
    await tx.communication.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    });

    // 4. Delete property viewings
    await tx.propertyViewing.deleteMany({
      where: { userId },
    });

    // 5. Delete search history
    await tx.searchHistory.deleteMany({
      where: { userId },
    });

    // 6. Delete saved properties
    await tx.savedProperty.deleteMany({
      where: { userId },
    });

    // 7. Delete notifications
    await tx.notification.deleteMany({
      where: { userId },
    });

    // 8. Delete consent records
    await tx.consentRecord.deleteMany({
      where: { userId },
    });

    // 9. Delete bank details
    await tx.bankDetails.deleteMany({
      where: { userId },
    });

    // 10. Delete addresses
    await tx.address.deleteMany({
      where: { userId },
    });

    // 11. Anonymize audit logs (keep for security but remove PII)
    await tx.auditLog.updateMany({
      where: { userId },
      data: {
        userId: 'DELETED_USER',
        ipAddress: 'ANONYMIZED',
      },
    });

    // 12. Finally, delete the user account
    await tx.user.delete({
      where: { id: userId },
    });
  });

  // Additional cleanup tasks
  // TODO: Delete files from S3
  // TODO: Remove from mailing lists
  // TODO: Clear cache entries
}

/**
 * GET endpoint to check if user can delete their account
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for blockers
    const [activeTransactionspendingPayments] = await Promise.all([
      prisma.transaction.count({
        where: {
          OR: [
            { buyerId: session.user.id },
            { sellerId: session.user.id },
          ],
          status: {
            in: ['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW'],
          },
        },
      }),
      prisma.payment.count({
        where: {
          userId: session.user.id,
          status: 'PENDING',
        },
      }),
    ]);

    const canDelete = activeTransactions === 0 && pendingPayments === 0;
    const blockers = [];

    if (activeTransactions> 0) {
      blockers.push(`${activeTransactions} active transaction(s)`);
    }
    if (pendingPayments> 0) {
      blockers.push(`${pendingPayments} pending payment(s)`);
    }

    return NextResponse.json({
      canDelete,
      blockers,
      message: canDelete 
        ? 'Your account can be deleted'
        : 'Please resolve the following before deleting your account',
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to check deletion eligibility' },
      { status: 500 }
    );
  }
}