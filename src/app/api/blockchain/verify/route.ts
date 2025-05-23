/**
 * Blockchain Property Verification API
 * Handles property verification on the blockchain
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PropertyTokenizationService } from '@/services/blockchain/property-tokenization';
import { authOptions } from '@/lib/auth-options';
import { z } from 'zod';
import { Logger } from '@/utils/logger';

// Type definitions for verification arrays
interface VerificationHistoryEntry {
  timestamp: string;
  action: 'verified' | 'unverified' | 'pending';
  adminId: string;
  adminName?: string;
  notes?: string;
  previousStatus?: boolean;
  newStatus: boolean;
}

interface VerificationDocument {
  type: string;
  url: string;
  hash: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

const logger = new Logger('blockchain-verify');

// Validation schema
const VerificationSchema = z.object({
  propertyId: z.string(),
  verified: z.boolean(),
  chain: z.enum(['mainnet', 'polygon', 'arbitrum', 'testnet']),
  verificationNotes: z.string().optional(),
  DevelopmentDocument: z.array(z.object({
    type: z.string(),
    url: z.string(),
    hash: z.string()})).optional()});

// Initialize blockchain service
const blockchainService = new PropertyTokenizationService({
  rpcUrls: {
    mainnet: process.env.MAINNET_RPC_URL!,
    polygon: process.env.POLYGON_RPC_URL!,
    arbitrum: process.env.ARBITRUM_RPC_URL!,
    testnet: process.env.TESTNET_RPC_URL!},
  contractAddresses: {
    mainnet: process.env.MAINNET_CONTRACT_ADDRESS!,
    polygon: process.env.POLYGON_CONTRACT_ADDRESS!,
    arbitrum: process.env.ARBITRUM_CONTRACT_ADDRESS!,
    testnet: process.env.TESTNET_CONTRACT_ADDRESS!},
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY!,
  infuraKey: process.env.INFURA_KEY,
  alchemyKey: process.env.ALCHEMY_KEY});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin permissions
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Validate request body
    const body: any = await request.json();
    const validationResult = VerificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { propertyId, verified, chain, verificationNotes, DevelopmentDocument } = validationResult.data;

    // Get current property status
    const property = await blockchainService.getTokenizedProperty(propertyIdchain);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if status is changing
    if (property.verified === verified) {
      return NextResponse.json(
        { 
          error: 'No status change',
          currentStatus: verified 
        },
        { status: 400 }
      );
    }

    // Verify the property on blockchain
    await blockchainService.verifyProperty(propertyId, verifiedchain);

    // Log the verification event
    logger.info('Property verification updated', {
      propertyId,
      verified,
      chain,
      previousStatus: property.verified,
      adminId: session.user.id,
      verificationNotes,
      documentsCount: DevelopmentDocument?.length || 0});

    // Store verification documents in database (implementation depends on your DB schema)
    // This would typically involve storing document hashes on-chain or IPFS

    // Return success response
    return NextResponse.json({
      success: true,
      propertyId,
      verified,
      previousStatus: property.verified,
      message: `Property ${verified ? 'verified' : 'unverified'} successfully`,
      timestamp: new Date().toISOString()});

  } catch (error) {
    logger.error('Property verification failed:', error);
    return NextResponse.json(
      {
        error: 'Verification failed',
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const chain = searchParams.get('chain') || 'polygon';

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID required' },
        { status: 400 }
      );
    }

    // Get property verification status
    const property = await blockchainService.getTokenizedProperty(propertyIdchain);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // In production, fetch verification history and documents
    const verificationHistory: VerificationHistoryEntry[] = [];
    const verificationDocuments: VerificationDocument[] = [];

    // Example of how to populate these arrays in production:
    // verificationHistory = await db.verificationHistory.findMany({
    //   where: { propertyId },
    //   orderBy: { timestamp: 'desc' }
    // });
    // verificationDocuments = await db.verificationDocuments.findMany({
    //   where: { propertyId }
    // });

    return NextResponse.json({
      propertyId,
      verified: property.verified,
      verificationStatus: property.verified ? 'verified' : 'pending',
      property: {
        address: property.address,
        owner: property.owner,
        createdAt: property.createdAt},
      verificationHistory,
      DevelopmentDocument: verificationDocuments});

  } catch (error) {
    logger.error('Failed to get verification status:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve verification status',
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}