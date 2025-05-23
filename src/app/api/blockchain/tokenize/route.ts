/**
 * Blockchain Tokenization API
 * Handles property tokenization requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PropertyTokenizationService } from '@/services/blockchain/property-tokenization';
import { authOptions } from '@/lib/auth-options';
import { z } from 'zod';
import { Logger } from '@/utils/logger';

const logger = new Logger('blockchain-tokenize');

// Validation schema
const TokenizationSchema = z.object({
  propertyId: z.string(),
  totalShares: z.number().min(1),
  pricePerShare: z.string(), // BigInt as string
  chain: z.enum(['mainnet', 'polygon', 'arbitrum', 'testnet']),
  property: z.object({
    address: z.string(),
    type: z.string(),
    bedrooms: z.number(),
    totalValue: z.number()})});

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
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body: any = await request.json();
    const validationResult = TokenizationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { property, totalShares, pricePerShare, chain } = validationResult.data;

    // Check user permissions (only property owners or admins can tokenize)
    const userRole = session.user.role;
    if (userRole !== 'admin' && userRole !== 'developer') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Tokenize the property
    const propertyId = await blockchainService.tokenizeProperty({
      property: property as any,
      totalShares,
      pricePerShare: BigInt(pricePerShare),
      chain});

    // Log the tokenization event
    logger.info('Property tokenized', {
      propertyId,
      chain,
      totalShares,
      userId: session.user.id});

    // Return success response
    return NextResponse.json({
      success: true,
      propertyId,
      chain,
      contractAddress: process.env[`${chain.toUpperCase()}_CONTRACT_ADDRESS`],
      message: 'Property successfully tokenized'});

  } catch (error) {
    logger.error('Tokenization failed:', error);
    return NextResponse.json(
      {
        error: 'Tokenization failed',
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
    if (!session?.user?.id) {
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

    // Get tokenized property details
    const propertyDetails = await blockchainService.getTokenizedProperty(
      propertyId,
      chain
    );

    // Get user's holdings if requested
    let userHoldings = 0;
    if (searchParams.get('includeHoldings') === 'true') {
      // Use user ID as the identifier - the blockchain service should map this to a wallet address
      userHoldings = await blockchainService.getUserHoldings(
        propertyId,
        session.user.id,
        chain
      );
    }

    return NextResponse.json({
      property: propertyDetails,
      userHoldings,
      chain});

  } catch (error) {
    logger.error('Failed to get tokenized property:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve property',
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}