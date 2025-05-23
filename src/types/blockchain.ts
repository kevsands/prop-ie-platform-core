/**
 * Blockchain Type Definitions
 * Core types for blockchain and tokenization features
 */

export interface BlockchainProperty {
  id: string;
  address: string;
  totalValue: string;
  totalShares: string;
  availableShares: string;
  owner: string;
  verified: boolean;
  createdAt: Date;
  chain: BlockchainNetwork;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
}

export type BlockchainNetwork = 'mainnet' | 'polygon' | 'arbitrum' | 'testnet';

export interface TokenMetadata {
  propertyId: string;
  shares: number;
  purchasePrice: string;
  purchaseDate: Date;
  tokenId: string;
  owner: string;
}

export interface PropertyToken {
  id: string;
  propertyId: string;
  tokenId: string;
  shares: number;
  owner: string;
  metadata: TokenMetadata;
}

export interface SharePurchase {
  propertyId: string;
  shares: number;
  buyer: string;
  price: string;
  transactionHash: string;
  status: TransactionStatus;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface DividendDistribution {
  propertyId: string;
  amount: string;
  totalShares: number;
  dividendPerShare: string;
  recipients: number;
  transactionHash: string;
  distributedAt: Date;
}

export interface BlockchainStats {
  blockNumber: number;
  gasPrice: string;
  network: {
    name: string;
    chainId: string;
  };
}

export interface VerificationDocument {
  type: string;
  url: string;
  hash: string;
  uploadedAt: Date;
  verifiedBy?: string;
}

export interface PropertyVerification {
  propertyId: string;
  verified: boolean;
  verifiedBy: string;
  verifiedAt: Date;
  documents: VerificationDocument[];
  notes?: string;
}

export interface BlockchainEvent {
  event: string;
  propertyId?: string;
  buyer?: string;
  shares?: string;
  tokenId?: string;
  amount?: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
}

export interface UserHoldings {
  userId: string;
  walletAddress: string;
  properties: {
    propertyId: string;
    shares: number;
    percentage: number;
    value: string;
  }[];
  totalValue: string;
}

export interface SmartContractConfig {
  address: string;
  abi: any[];
  network: BlockchainNetwork;
  deployedAt: Date;
  version: string;
}

export interface GasEstimate {
  action: string;
  estimatedGas: string;
  gasPrice: string;
  totalCost: string;
  network: BlockchainNetwork;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'success' | 'failed';
  events: BlockchainEvent[];
}

export interface TokenizationRequest {
  property: {
    id: string;
    address: string;
    type: string;
    bedrooms: number;
    totalValue: number;
  };
  totalShares: number;
  pricePerShare: string;
  chain: BlockchainNetwork;
  metadata?: Record<string, any>\n  );
}

export interface BlockchainError {
  code: string;
  message: string;
  transaction?: string;
  reason?: string;
}

export interface PropertyRoyalty {
  propertyId: string;
  recipient: string;
  percentage: number;
  totalCollected: string;
}

export interface TokenTransfer {
  from: string;
  to: string;
  tokenId: string;
  propertyId: string;
  shares: number;
  transactionHash: string;
  transferDate: Date;
}