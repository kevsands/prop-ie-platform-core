/**
 * Blockchain-Based Transaction Verification System for PROP.ie Platform
 * Immutable transaction records, smart contract automation, and cryptographic verification
 * Ensures transparency, security, and trust in property transactions
 */

import { z } from 'zod';
import { logger } from '@/lib/security/auditLogger';
import { createHash, randomBytes, createHmac } from 'crypto';

// Transaction Schema
export const BlockchainTransactionSchema = z.object({
  transactionId: z.string(),
  transactionType: z.enum([
    'property_listing',
    'reservation',
    'deposit_payment',
    'contract_exchange',
    'completion_payment',
    'prop_choice_order',
    'professional_service',
    'title_transfer',
    'mortgage_approval',
    'insurance_binding'
  ]),
  participants: z.array(z.object({
    participantId: z.string(),
    role: z.enum(['buyer', 'seller', 'developer', 'agent', 'solicitor', 'lender', 'insurer']),
    walletAddress: z.string(),
    digitalSignature: z.string().optional(),
    verificationStatus: z.enum(['pending', 'verified', 'rejected'])
  })),
  propertyDetails: z.object({
    propertyId: z.string(),
    address: z.string(),
    folio: z.string().optional(), // Land Registry folio number
    eircode: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    propertyHash: z.string() // Cryptographic hash of property data
  }),
  financialData: z.object({
    amount: z.number(),
    currency: z.string().default('EUR'),
    paymentMethod: z.enum(['bank_transfer', 'cryptocurrency', 'escrow', 'smart_contract']),
    escrowDetails: z.object({
      escrowId: z.string(),
      releaseConditions: z.array(z.string()),
      timelock: z.string().datetime().optional()
    }).optional()
  }),
  legalCompliance: z.object({
    complianceFrameworks: z.array(z.enum(['GDPR', 'AML', 'KYC', 'PCI_DSS', 'Irish_Property_Law'])),
    regulatoryApprovals: z.array(z.string()),
    legalDocuments: z.array(z.object({
      documentId: z.string(),
      documentType: z.string(),
      documentHash: z.string(),
      signedBy: z.array(z.string()),
      timestamp: z.string().datetime()
    }))
  }),
  smartContractData: z.object({
    contractAddress: z.string().optional(),
    contractType: z.enum(['sale', 'rental', 'development', 'prop_choice', 'escrow']),
    conditions: z.array(z.object({
      conditionId: z.string(),
      description: z.string(),
      status: z.enum(['pending', 'met', 'failed']),
      verificationMethod: z.enum(['manual', 'automated', 'oracle']),
      deadline: z.string().datetime().optional()
    })),
    executionStatus: z.enum(['pending', 'executed', 'failed', 'cancelled'])
  }),
  verification: z.object({
    merkleRoot: z.string(),
    cryptographicProof: z.string(),
    consensusAlgorithm: z.enum(['proof_of_authority', 'proof_of_stake', 'practical_byzantine']),
    validatorNodes: z.array(z.string()),
    timestamp: z.string().datetime(),
    blockNumber: z.number().optional(),
    previousBlockHash: z.string().optional()
  }),
  metadata: z.object({
    createdAt: z.string().datetime(),
    createdBy: z.string(),
    version: z.string().default('1.0'),
    networkId: z.string().default('PROP_CHAIN'),
    gasUsed: z.number().optional(),
    confirmations: z.number().default(0)
  })
});

// Smart Contract Schema
export const SmartContractSchema = z.object({
  contractId: z.string(),
  contractType: z.enum(['property_sale', 'rental_agreement', 'prop_choice', 'escrow', 'milestone_payment']),
  parties: z.array(z.object({
    partyId: z.string(),
    role: z.string(),
    walletAddress: z.string(),
    digitalIdentity: z.object({
      verified: z.boolean(),
      kycLevel: z.enum(['basic', 'enhanced', 'institutional']),
      verificationProvider: z.string()
    })
  })),
  terms: z.object({
    totalValue: z.number(),
    paymentSchedule: z.array(z.object({
      milestoneId: z.string(),
      description: z.string(),
      amount: z.number(),
      dueDate: z.string().datetime(),
      conditions: z.array(z.string()),
      status: z.enum(['pending', 'due', 'paid', 'overdue'])
    })),
    completionCriteria: z.array(z.string()),
    penalties: z.array(z.object({
      condition: z.string(),
      penalty: z.number(),
      description: z.string()
    })),
    automaticExecution: z.boolean()
  }),
  oracles: z.array(z.object({
    oracleId: z.string(),
    type: z.enum(['price_feed', 'completion_verification', 'legal_compliance', 'weather', 'regulatory']),
    endpoint: z.string(),
    updateFrequency: z.string(),
    lastUpdate: z.string().datetime()
  })),
  status: z.enum(['draft', 'active', 'executed', 'terminated', 'disputed']),
  auditTrail: z.array(z.object({
    action: z.string(),
    timestamp: z.string().datetime(),
    actor: z.string(),
    blockNumber: z.number().optional()
  }))
});

// Block Schema
export const BlockSchema = z.object({
  blockNumber: z.number(),
  blockHash: z.string(),
  previousBlockHash: z.string(),
  merkleRoot: z.string(),
  timestamp: z.string().datetime(),
  nonce: z.number(),
  difficulty: z.number(),
  transactions: z.array(z.string()), // Transaction IDs
  validator: z.string(),
  signature: z.string(),
  gasUsed: z.number(),
  gasLimit: z.number(),
  extraData: z.string().optional()
});

// Cryptographic utilities
class CryptographicUtils {
  static generateHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  static generateMerkleRoot(transactions: string[]): string {
    if (transactions.length === 0) return '';
    if (transactions.length === 1) return this.generateHash(transactions[0]);

    // Build Merkle tree
    let level = transactions.map(tx => this.generateHash(tx));
    
    while (level.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] || left; // Duplicate if odd number
        nextLevel.push(this.generateHash(left + right));
      }
      level = nextLevel;
    }

    return level[0];
  }

  static generateDigitalSignature(data: string, privateKey: string): string {
    return createHmac('sha256', privateKey).update(data).digest('hex');
  }

  static verifySignature(data: string, signature: string, publicKey: string): boolean {
    const expectedSignature = createHmac('sha256', publicKey).update(data).digest('hex');
    return signature === expectedSignature;
  }

  static generateNonce(): number {
    return Math.floor(Math.random() * 1000000);
  }

  static generateWalletAddress(): string {
    return '0x' + randomBytes(20).toString('hex');
  }
}

// Smart Contract Engine
class SmartContractEngine {
  private contracts: Map<string, any> = new Map();
  private oracles: Map<string, any> = new Map();

  // Deploy smart contract
  public deployContract(contractData: any): string {
    const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const contract = {
      ...contractData,
      contractId,
      deployedAt: new Date().toISOString(),
      status: 'active',
      address: CryptographicUtils.generateWalletAddress()
    };

    this.contracts.set(contractId, contract);
    
    logger.info('Smart contract deployed', {
      contractId,
      contractType: contractData.contractType,
      totalValue: contractData.terms.totalValue
    });

    return contractId;
  }

  // Execute contract conditions
  public async executeContract(contractId: string, triggerEvent: any): Promise<any> {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`);
    }

    if (contract.status !== 'active') {
      throw new Error(`Contract ${contractId} is not active`);
    }

    // Check if conditions are met
    const conditionsMet = await this.evaluateConditions(contract, triggerEvent);
    
    if (conditionsMet.allMet) {
      // Execute contract
      const execution = await this.performExecution(contract, conditionsMet.results);
      
      // Update contract status
      contract.status = 'executed';
      contract.executedAt = new Date().toISOString();
      contract.auditTrail.push({
        action: 'contract_executed',
        timestamp: new Date().toISOString(),
        actor: 'smart_contract_engine',
        details: execution
      });

      this.contracts.set(contractId, contract);

      logger.info('Smart contract executed', {
        contractId,
        executionDetails: execution,
        conditionsMet: conditionsMet.results.length
      });

      return execution;
    }

    return {
      executed: false,
      reason: 'Conditions not met',
      pendingConditions: conditionsMet.pending
    };
  }

  // Evaluate contract conditions
  private async evaluateConditions(contract: any, triggerEvent: any): Promise<any> {
    const results = [];
    const pending = [];

    for (const condition of contract.terms.completionCriteria) {
      const evaluation = await this.evaluateCondition(condition, triggerEvent, contract);
      if (evaluation.met) {
        results.push(evaluation);
      } else {
        pending.push(evaluation);
      }
    }

    return {
      allMet: pending.length === 0,
      results,
      pending
    };
  }

  // Evaluate individual condition
  private async evaluateCondition(condition: string, triggerEvent: any, contract: any): Promise<any> {
    // Simplified condition evaluation logic
    // In production, this would be much more sophisticated
    
    const conditionType = condition.split(':')[0];
    
    switch (conditionType) {
      case 'payment_received':
        return {
          conditionId: condition,
          met: triggerEvent.type === 'payment' && triggerEvent.amount >= contract.terms.totalValue,
          timestamp: new Date().toISOString(),
          evidence: triggerEvent
        };
      
      case 'legal_approval':
        return {
          conditionId: condition,
          met: triggerEvent.type === 'legal_approval' && triggerEvent.approved === true,
          timestamp: new Date().toISOString(),
          evidence: triggerEvent
        };
      
      case 'property_transfer':
        return {
          conditionId: condition,
          met: triggerEvent.type === 'title_transfer' && triggerEvent.registered === true,
          timestamp: new Date().toISOString(),
          evidence: triggerEvent
        };
      
      default:
        return {
          conditionId: condition,
          met: false,
          timestamp: new Date().toISOString(),
          reason: 'Unknown condition type'
        };
    }
  }

  // Perform contract execution
  private async performExecution(contract: any, conditionResults: any[]): Promise<any> {
    const execution = {
      executionId: `exec_${Date.now()}`,
      contractId: contract.contractId,
      executedAt: new Date().toISOString(),
      actions: []
    };

    // Execute payment transfers
    if (contract.contractType === 'property_sale') {
      execution.actions.push({
        type: 'payment_transfer',
        from: contract.parties.find((p: any) => p.role === 'buyer').walletAddress,
        to: contract.parties.find((p: any) => p.role === 'seller').walletAddress,
        amount: contract.terms.totalValue,
        timestamp: new Date().toISOString()
      });
    }

    // Execute property transfer
    execution.actions.push({
      type: 'property_transfer',
      propertyId: contract.propertyId,
      from: contract.parties.find((p: any) => p.role === 'seller').partyId,
      to: contract.parties.find((p: any) => p.role === 'buyer').partyId,
      timestamp: new Date().toISOString()
    });

    // Execute any PROP Choice orders
    if (contract.contractType === 'prop_choice') {
      execution.actions.push({
        type: 'prop_choice_fulfillment',
        orderId: contract.propChoiceOrderId,
        status: 'confirmed',
        timestamp: new Date().toISOString()
      });
    }

    return execution;
  }

  // Get contract status
  public getContract(contractId: string): any {
    return this.contracts.get(contractId);
  }

  // Update oracle data
  public updateOracle(oracleId: string, data: any): void {
    this.oracles.set(oracleId, {
      ...data,
      lastUpdate: new Date().toISOString()
    });
  }
}

// Blockchain Transaction Verification System
export class BlockchainTransactionVerificationSystem {
  private blocks: Map<number, any> = new Map();
  private transactions: Map<string, any> = new Map();
  private pendingTransactions: Map<string, any> = new Map();
  private smartContractEngine: SmartContractEngine;
  private validatorNodes: Set<string> = new Set();
  private currentBlockNumber: number = 0;

  constructor() {
    this.smartContractEngine = new SmartContractEngine();
    this.initializeGenesisBlock();
    this.initializeValidatorNodes();
  }

  // Initialize genesis block
  private initializeGenesisBlock(): void {
    const genesisBlock = {
      blockNumber: 0,
      blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: '2025-01-01T00:00:00.000Z',
      nonce: 0,
      difficulty: 1,
      transactions: [],
      validator: 'genesis',
      signature: 'genesis_signature',
      gasUsed: 0,
      gasLimit: 1000000,
      extraData: 'PROP.ie Blockchain Genesis Block'
    };

    this.blocks.set(0, genesisBlock);
    logger.info('Blockchain initialized with genesis block');
  }

  // Initialize validator nodes
  private initializeValidatorNodes(): void {
    // In production, these would be real validator nodes
    this.validatorNodes.add('validator_prop_ie_primary');
    this.validatorNodes.add('validator_central_bank_ireland');
    this.validatorNodes.add('validator_law_society_ireland');
    this.validatorNodes.add('validator_property_registration_authority');
    this.validatorNodes.add('validator_revenue_commissioners');
  }

  // Submit transaction for verification
  public async submitTransaction(transactionData: any): Promise<string> {
    try {
      // Validate transaction data
      const validatedTransaction = BlockchainTransactionSchema.parse(transactionData);

      // Generate transaction hash
      const transactionHash = CryptographicUtils.generateHash(JSON.stringify(validatedTransaction));
      
      // Create transaction record
      const transaction = {
        ...validatedTransaction,
        transactionHash,
        submittedAt: new Date().toISOString(),
        status: 'pending_verification',
        verificationSteps: []
      };

      // Add to pending transactions
      this.pendingTransactions.set(transactionData.transactionId, transaction);

      // Start verification process
      await this.verifyTransaction(transactionData.transactionId);

      logger.info('Blockchain transaction submitted', {
        transactionId: transactionData.transactionId,
        transactionType: transactionData.transactionType,
        amount: transactionData.financialData.amount
      });

      return transactionHash;

    } catch (error) {
      logger.error('Transaction submission failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transactionData.transactionId
      });
      throw error;
    }
  }

  // Verify transaction
  private async verifyTransaction(transactionId: string): Promise<void> {
    const transaction = this.pendingTransactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    // Step 1: Cryptographic verification
    const cryptoVerification = await this.performCryptographicVerification(transaction);
    transaction.verificationSteps.push(cryptoVerification);

    // Step 2: Participant verification
    const participantVerification = await this.verifyParticipants(transaction);
    transaction.verificationSteps.push(participantVerification);

    // Step 3: Legal compliance verification
    const complianceVerification = await this.verifyLegalCompliance(transaction);
    transaction.verificationSteps.push(complianceVerification);

    // Step 4: Financial verification
    const financialVerification = await this.verifyFinancialData(transaction);
    transaction.verificationSteps.push(financialVerification);

    // Step 5: Property verification
    const propertyVerification = await this.verifyPropertyData(transaction);
    transaction.verificationSteps.push(propertyVerification);

    // Check if all verifications passed
    const allVerificationsPassed = transaction.verificationSteps.every((step: any) => step.status === 'passed');

    if (allVerificationsPassed) {
      transaction.status = 'verified';
      transaction.verifiedAt = new Date().toISOString();
      
      // Move to verified transactions
      this.transactions.set(transactionId, transaction);
      this.pendingTransactions.delete(transactionId);

      // Add to next block
      await this.addToBlock(transaction);

      // Trigger smart contract execution if applicable
      if (transaction.smartContractData.contractAddress) {
        await this.triggerSmartContract(transaction);
      }

    } else {
      transaction.status = 'verification_failed';
      transaction.failedAt = new Date().toISOString();
      
      logger.warn('Transaction verification failed', {
        transactionId,
        failedSteps: transaction.verificationSteps.filter((step: any) => step.status === 'failed')
      });
    }
  }

  // Cryptographic verification
  private async performCryptographicVerification(transaction: any): Promise<any> {
    try {
      // Verify transaction hash
      const expectedHash = CryptographicUtils.generateHash(JSON.stringify(transaction));
      const hashValid = transaction.transactionHash === expectedHash;

      // Verify digital signatures
      const signaturesValid = transaction.participants.every((participant: any) => {
        if (participant.digitalSignature) {
          return CryptographicUtils.verifySignature(
            transaction.transactionId,
            participant.digitalSignature,
            participant.walletAddress
          );
        }
        return true; // If no signature required for this participant
      });

      // Verify property hash
      const propertyDataValid = transaction.propertyDetails.propertyHash === 
        CryptographicUtils.generateHash(JSON.stringify(transaction.propertyDetails));

      const allValid = hashValid && signaturesValid && propertyDataValid;

      return {
        step: 'cryptographic_verification',
        status: allValid ? 'passed' : 'failed',
        details: {
          hashValid,
          signaturesValid,
          propertyDataValid
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        step: 'cryptographic_verification',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verify participants
  private async verifyParticipants(transaction: any): Promise<any> {
    try {
      const verificationResults = await Promise.all(
        transaction.participants.map(async (participant: any) => {
          // In production, this would check against real identity systems
          const kycVerified = await this.checkKYCStatus(participant.participantId);
          const walletVerified = await this.verifyWalletOwnership(participant.walletAddress, participant.participantId);
          const roleValid = this.validateParticipantRole(participant.role, transaction.transactionType);

          return {
            participantId: participant.participantId,
            kycVerified,
            walletVerified,
            roleValid,
            overall: kycVerified && walletVerified && roleValid
          };
        })
      );

      const allVerified = verificationResults.every(result => result.overall);

      return {
        step: 'participant_verification',
        status: allVerified ? 'passed' : 'failed',
        details: verificationResults,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        step: 'participant_verification',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verify legal compliance
  private async verifyLegalCompliance(transaction: any): Promise<any> {
    try {
      const compliance = transaction.legalCompliance;
      
      // Check required frameworks
      const requiredFrameworks = ['GDPR', 'AML', 'Irish_Property_Law'];
      const frameworksCompliant = requiredFrameworks.every(framework => 
        compliance.complianceFrameworks.includes(framework)
      );

      // Verify legal documents
      const documentsVerified = compliance.legalDocuments.every((doc: any) => {
        // In production, verify document signatures and authenticity
        return doc.documentHash && doc.signedBy.length > 0;
      });

      // Check regulatory approvals
      const approvalsValid = compliance.regulatoryApprovals.length > 0;

      const complianceValid = frameworksCompliant && documentsVerified && approvalsValid;

      return {
        step: 'legal_compliance_verification',
        status: complianceValid ? 'passed' : 'failed',
        details: {
          frameworksCompliant,
          documentsVerified,
          approvalsValid,
          documentCount: compliance.legalDocuments.length
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        step: 'legal_compliance_verification',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verify financial data
  private async verifyFinancialData(transaction: any): Promise<any> {
    try {
      const financial = transaction.financialData;
      
      // Verify amount is positive
      const amountValid = financial.amount > 0;

      // Check currency is supported
      const currencyValid = ['EUR', 'USD', 'GBP', 'BTC', 'ETH'].includes(financial.currency);

      // Verify escrow if applicable
      let escrowValid = true;
      if (financial.escrowDetails) {
        escrowValid = await this.verifyEscrowAccount(financial.escrowDetails.escrowId);
      }

      // Check for suspicious amounts (AML compliance)
      const amlCompliant = await this.performAMLCheck(financial.amount, transaction.participants);

      const financialValid = amountValid && currencyValid && escrowValid && amlCompliant;

      return {
        step: 'financial_verification',
        status: financialValid ? 'passed' : 'failed',
        details: {
          amountValid,
          currencyValid,
          escrowValid,
          amlCompliant,
          amount: financial.amount,
          currency: financial.currency
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        step: 'financial_verification',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verify property data
  private async verifyPropertyData(transaction: any): Promise<any> {
    try {
      const property = transaction.propertyDetails;
      
      // Verify property exists in registry
      const propertyExists = await this.checkPropertyRegistry(property.propertyId);

      // Verify address format
      const addressValid = property.address && property.eircode;

      // Verify coordinates
      const coordinatesValid = property.coordinates.latitude && property.coordinates.longitude;

      // Check folio number if provided
      let folioValid = true;
      if (property.folio) {
        folioValid = await this.verifyFolioNumber(property.folio);
      }

      const propertyValid = propertyExists && addressValid && coordinatesValid && folioValid;

      return {
        step: 'property_verification',
        status: propertyValid ? 'passed' : 'failed',
        details: {
          propertyExists,
          addressValid,
          coordinatesValid,
          folioValid,
          propertyId: property.propertyId
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        step: 'property_verification',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Add transaction to block
  private async addToBlock(transaction: any): Promise<void> {
    // Create new block if needed
    const currentBlock = this.getCurrentBlock();
    const blockTransactions = currentBlock?.transactions || [];
    
    // Add transaction to block
    blockTransactions.push(transaction.transactionId);
    
    // If block is full or conditions met, mine new block
    if (blockTransactions.length >= 10 || this.shouldMineBlock()) {
      await this.mineNewBlock(blockTransactions);
    }
  }

  // Mine new block
  private async mineNewBlock(transactionIds: string[]): Promise<void> {
    const previousBlock = this.blocks.get(this.currentBlockNumber);
    const newBlockNumber = this.currentBlockNumber + 1;

    // Calculate merkle root
    const merkleRoot = CryptographicUtils.generateMerkleRoot(transactionIds);

    // Create block
    const newBlock = {
      blockNumber: newBlockNumber,
      blockHash: '',
      previousBlockHash: previousBlock?.blockHash || '0x0',
      merkleRoot,
      timestamp: new Date().toISOString(),
      nonce: CryptographicUtils.generateNonce(),
      difficulty: this.calculateDifficulty(),
      transactions: transactionIds,
      validator: this.selectValidator(),
      signature: '',
      gasUsed: this.calculateGasUsed(transactionIds),
      gasLimit: 1000000,
      extraData: `PROP.ie Block ${newBlockNumber}`
    };

    // Generate block hash
    newBlock.blockHash = CryptographicUtils.generateHash(JSON.stringify(newBlock));
    
    // Sign block
    newBlock.signature = CryptographicUtils.generateDigitalSignature(
      newBlock.blockHash,
      'validator_private_key'
    );

    // Add to blockchain
    this.blocks.set(newBlockNumber, newBlock);
    this.currentBlockNumber = newBlockNumber;

    logger.info('New block mined', {
      blockNumber: newBlockNumber,
      blockHash: newBlock.blockHash,
      transactionCount: transactionIds.length,
      validator: newBlock.validator
    });
  }

  // Helper methods
  private getCurrentBlock(): any {
    return this.blocks.get(this.currentBlockNumber);
  }

  private shouldMineBlock(): boolean {
    // Mine block every 5 minutes or when conditions are met
    const lastBlock = this.getCurrentBlock();
    if (!lastBlock) return true;
    
    const timeSinceLastBlock = Date.now() - new Date(lastBlock.timestamp).getTime();
    return timeSinceLastBlock > 5 * 60 * 1000; // 5 minutes
  }

  private calculateDifficulty(): number {
    // Simplified difficulty calculation
    return Math.max(1, Math.floor(this.currentBlockNumber / 100));
  }

  private selectValidator(): string {
    const validators = Array.from(this.validatorNodes);
    return validators[Math.floor(Math.random() * validators.length)];
  }

  private calculateGasUsed(transactionIds: string[]): number {
    return transactionIds.length * 21000; // Basic gas calculation
  }

  private async checkKYCStatus(participantId: string): Promise<boolean> {
    // In production, check against real KYC systems
    return true; // Mock verification
  }

  private async verifyWalletOwnership(walletAddress: string, participantId: string): Promise<boolean> {
    // In production, verify wallet ownership
    return walletAddress.startsWith('0x'); // Simple format check
  }

  private validateParticipantRole(role: string, transactionType: string): boolean {
    // Validate that participant role is appropriate for transaction type
    const validRoles = {
      'property_listing': ['seller', 'developer', 'agent'],
      'reservation': ['buyer', 'seller', 'agent'],
      'deposit_payment': ['buyer', 'seller', 'solicitor'],
      'contract_exchange': ['buyer', 'seller', 'solicitor'],
      'completion_payment': ['buyer', 'seller', 'solicitor', 'lender']
    };

    return validRoles[transactionType as keyof typeof validRoles]?.includes(role) || false;
  }

  private async verifyEscrowAccount(escrowId: string): Promise<boolean> {
    // In production, verify escrow account exists and is valid
    return escrowId.startsWith('ESC_'); // Simple format check
  }

  private async performAMLCheck(amount: number, participants: any[]): Promise<boolean> {
    // In production, perform real AML checks
    // Flag large transactions for review
    if (amount > 10000) {
      logger.info('Large transaction flagged for AML review', { amount });
    }
    return true; // Mock compliance
  }

  private async checkPropertyRegistry(propertyId: string): Promise<boolean> {
    // In production, check against Property Registration Authority
    return propertyId.startsWith('prop_'); // Simple format check
  }

  private async verifyFolioNumber(folio: string): Promise<boolean> {
    // In production, verify against Land Registry
    return folio.length > 0; // Simple validation
  }

  private async triggerSmartContract(transaction: any): Promise<void> {
    try {
      const result = await this.smartContractEngine.executeContract(
        transaction.smartContractData.contractAddress,
        {
          type: 'transaction_verified',
          transactionId: transaction.transactionId,
          amount: transaction.financialData.amount,
          participants: transaction.participants
        }
      );

      logger.info('Smart contract triggered', {
        transactionId: transaction.transactionId,
        contractAddress: transaction.smartContractData.contractAddress,
        executed: result.executed
      });

    } catch (error) {
      logger.error('Smart contract execution failed', {
        transactionId: transaction.transactionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Public methods for querying blockchain
  public getTransaction(transactionId: string): any {
    return this.transactions.get(transactionId) || this.pendingTransactions.get(transactionId);
  }

  public getBlock(blockNumber: number): any {
    return this.blocks.get(blockNumber);
  }

  public getBlockchainHeight(): number {
    return this.currentBlockNumber;
  }

  public getTransactionHistory(participantId: string): any[] {
    const history = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.participants.some((p: any) => p.participantId === participantId)) {
        history.push({
          transactionId: transaction.transactionId,
          transactionType: transaction.transactionType,
          amount: transaction.financialData.amount,
          timestamp: transaction.verifiedAt,
          status: transaction.status
        });
      }
    }
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getBlockchainStats(): any {
    return {
      totalBlocks: this.currentBlockNumber + 1,
      totalTransactions: this.transactions.size,
      pendingTransactions: this.pendingTransactions.size,
      validatorNodes: this.validatorNodes.size,
      lastBlockTime: this.getCurrentBlock()?.timestamp,
      networkId: 'PROP_CHAIN',
      averageBlockTime: '5 minutes',
      consensusAlgorithm: 'Proof of Authority'
    };
  }

  // Deploy smart contract
  public deploySmartContract(contractData: any): string {
    return this.smartContractEngine.deployContract(contractData);
  }

  // Get smart contract
  public getSmartContract(contractId: string): any {
    return this.smartContractEngine.getContract(contractId);
  }
}

// Export singleton instance
export const blockchainSystem = new BlockchainTransactionVerificationSystem();

// Export utility functions
export const BlockchainUtils = {
  generateWalletAddress: CryptographicUtils.generateWalletAddress,
  generateHash: CryptographicUtils.generateHash,
  generateSignature: CryptographicUtils.generateDigitalSignature,
  verifySignature: CryptographicUtils.verifySignature,

  formatTransactionHash: (hash: string): string => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  },

  formatBlockHash: (hash: string): string => {
    return `${hash.substring(0, 12)}...${hash.substring(hash.length - 12)}`;
  },

  validateTransactionData: (data: any): boolean => {
    try {
      BlockchainTransactionSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  },

  calculateTransactionFee: (transactionType: string, amount: number): number => {
    const baseFee = 0.001; // 0.1% base fee
    const typeFees = {
      'property_listing': 0.0005,
      'reservation': 0.001,
      'deposit_payment': 0.002,
      'contract_exchange': 0.003,
      'completion_payment': 0.002,
      'prop_choice_order': 0.001,
      'professional_service': 0.0015,
      'title_transfer': 0.005,
      'mortgage_approval': 0.001,
      'insurance_binding': 0.001
    };

    const typeMultiplier = typeFees[transactionType as keyof typeof typeFees] || baseFee;
    return Math.max(10, amount * typeMultiplier); // Minimum €10 fee
  }
};