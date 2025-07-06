/**
 * HTB Real PostgreSQL Service
 * 
 * Production implementation of HTB service using real PostgreSQL database
 * via Prisma ORM. Replaces mock implementations with actual database operations
 * while maintaining all business logic and regulatory compliance.
 */

import { postgresService } from '@/lib/database/postgres-service';
import { logger } from '@/lib/security/auditLogger';
import { comprehensiveAuditService } from '@/lib/security/comprehensive-audit-service';
import { v4 as uuidv4 } from 'uuid';
import type { 
  HTBClaim, 
  HTBClaimStatus, 
  HTBDocument, 
  User, 
  Property,
  HTBProcessingStage,
  HTBDocumentType,
  HTBDocumentVerificationStatus,
  PropertyType
} from '@prisma/client';

export interface CreateHTBClaimRequest {
  buyerId: string;
  propertyId: string;
  propertyPrice: number;
  requestedAmount: number;
  propertyAddress: string;
  developerId?: string;
}

export interface HTBClaimWithRelations extends HTBClaim {
  buyer: User;
  property: Property;
  documents: HTBDocument[];
  statusHistory: Array<{
    id: string;
    oldStatus: HTBClaimStatus | null;
    newStatus: HTBClaimStatus;
    changedBy: string;
    changeReason: string | null;
    notes: string | null;
    createdAt: Date;
  }>;
}

export interface CreatePropertyRequest {
  propertyId: string;
  address: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode?: string;
  propertyType: PropertyType;
  propertyCategory: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'DUPLEX';
  currentPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  buildYear?: number;
  buildingEnergyRating?: string;
  developerId?: string;
  isNewBuild?: boolean;
  completionDate?: Date;
}

class HTBRealPostgresService {
  
  /**
   * Create a new HTB claim in the database
   */
  async createClaim(request: CreateHTBClaimRequest): Promise<HTBClaim> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        // Generate unique claim ID
        const claimId = `HTB-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;
        
        // Ensure property exists, create if not
        let property = await prisma.property.findUnique({
          where: { propertyId: request.propertyId }
        });

        if (!property) {
          // Create property if it doesn't exist
          property = await prisma.property.create({
            data: {
              propertyId: request.propertyId,
              address: request.propertyAddress,
              addressLine1: request.propertyAddress,
              city: 'Dublin', // Default, would be parsed from address
              county: 'Dublin',
              propertyType: 'NEW',
              propertyCategory: 'HOUSE',
              currentPrice: request.propertyPrice,
              developerId: request.developerId,
              isNewBuild: true
            }
          });
        }

        // Create HTB claim
        const claim = await prisma.hTBClaim.create({
          data: {
            claimId,
            buyerId: request.buyerId,
            propertyId: property.id,
            developerId: request.developerId,
            propertyPrice: request.propertyPrice,
            requestedAmount: request.requestedAmount,
            status: 'INITIATED',
            processingStage: 'INITIAL_ASSESSMENT',
            automationEnabled: true
          }
        });

        // Create initial status history entry
        await prisma.hTBStatusHistory.create({
          data: {
            htbClaimId: claim.id,
            newStatus: 'INITIATED',
            changedBy: 'system',
            changeReason: 'HTB claim created',
            notes: 'Initial HTB claim creation via automation service'
          }
        });

        logger.info('HTB claim created successfully', {
          claimId: claim.claimId,
          buyerId: request.buyerId,
          propertyId: request.propertyId,
          requestedAmount: request.requestedAmount
        });

        return claim;
      },
      {
        operationType: 'CREATE',
        tableName: 'htb_claims',
        description: `Create HTB claim for buyer ${request.buyerId}`,
        userId: request.buyerId
      }
    );
  }

  /**
   * Get HTB claim by ID with all relations
   */
  async getClaimById(claimId: string): Promise<HTBClaimWithRelations | null> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const claim = await prisma.hTBClaim.findUnique({
          where: { claimId },
          include: {
            buyer: true,
            property: true,
            documents: true,
            statusHistory: {
              orderBy: { createdAt: 'desc' }
            }
          }
        });

        return claim as HTBClaimWithRelations | null;
      },
      {
        operationType: 'READ',
        tableName: 'htb_claims',
        description: `Get HTB claim by ID: ${claimId}`
      }
    );
  }

  /**
   * Get all HTB claims for a buyer
   */
  async getBuyerClaims(buyerId: string): Promise<HTBClaimWithRelations[]> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const claims = await prisma.hTBClaim.findMany({
          where: { buyerId },
          include: {
            buyer: true,
            property: true,
            documents: true,
            statusHistory: {
              orderBy: { createdAt: 'desc' },
              take: 5 // Last 5 status updates
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        return claims as HTBClaimWithRelations[];
      },
      {
        operationType: 'READ',
        tableName: 'htb_claims',
        description: `Get HTB claims for buyer: ${buyerId}`,
        userId: buyerId
      }
    );
  }

  /**
   * Update HTB claim status
   */
  async updateClaimStatus(
    claimId: string,
    newStatus: HTBClaimStatus,
    changedBy: string,
    notes?: string,
    changeReason?: string
  ): Promise<HTBClaim> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeTransaction(async (prisma) => {
      // Get current claim
      const currentClaim = await prisma.hTBClaim.findUnique({
        where: { claimId }
      });

      if (!currentClaim) {
        throw new Error(`HTB claim not found: ${claimId}`);
      }

      // Update claim status
      const updatedClaim = await prisma.hTBClaim.update({
        where: { claimId },
        data: {
          status: newStatus,
          updatedAt: new Date()
        }
      });

      // Create status history entry
      await prisma.hTBStatusHistory.create({
        data: {
          htbClaimId: currentClaim.id,
          oldStatus: currentClaim.status,
          newStatus,
          changedBy,
          changeReason: changeReason || `Status updated to ${newStatus}`,
          notes
        }
      });

      // Record audit event
      await comprehensiveAuditService.recordAuditEvent({
        eventType: 'BUSINESS_PROCESS',
        eventCategory: 'TRANSACTION_PROCESSING',
        eventSubcategory: 'htb_status_update',
        actor: {
          actorId: changedBy,
          actorType: changedBy === 'system' ? 'SYSTEM' : 'USER',
          actorName: changedBy === 'system' ? 'HTB Automation System' : 'User'
        },
        target: {
          targetId: claimId,
          targetType: 'RESOURCE',
          targetName: 'HTB Claim',
          resourceType: 'HTB_CLAIM'
        },
        details: {
          action: 'update_status',
          actionDescription: `Updated HTB claim status from ${currentClaim.status} to ${newStatus}`,
          actionParameters: {
            oldStatus: currentClaim.status,
            newStatus,
            changeReason,
            notes
          }
        },
        result: {
          status: 'SUCCESS'
        }
      });

      logger.info('HTB claim status updated', {
        claimId,
        oldStatus: currentClaim.status,
        newStatus,
        changedBy,
        changeReason
      });

      return updatedClaim;
    });
  }

  /**
   * Update HTB claim processing stage
   */
  async updateProcessingStage(
    claimId: string,
    newStage: HTBProcessingStage,
    metadata?: Record<string, any>
  ): Promise<HTBClaim> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const updatedClaim = await prisma.hTBClaim.update({
          where: { claimId },
          data: {
            processingStage: newStage,
            lastProcessedAt: new Date(),
            updatedAt: new Date()
          }
        });

        logger.info('HTB claim processing stage updated', {
          claimId,
          newStage,
          metadata
        });

        return updatedClaim;
      },
      {
        operationType: 'UPDATE',
        tableName: 'htb_claims',
        description: `Update processing stage for HTB claim: ${claimId}`
      }
    );
  }

  /**
   * Add document to HTB claim
   */
  async addDocument(
    claimId: string,
    documentData: {
      documentName: string;
      documentType: HTBDocumentType;
      category: string;
      description?: string;
      fileName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
      fileHash: string;
    }
  ): Promise<HTBDocument> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        // Get HTB claim to validate it exists
        const claim = await prisma.hTBClaim.findUnique({
          where: { claimId }
        });

        if (!claim) {
          throw new Error(`HTB claim not found: ${claimId}`);
        }

        // Create document
        const document = await prisma.hTBDocument.create({
          data: {
            htbClaimId: claim.id,
            documentName: documentData.documentName,
            documentType: documentData.documentType,
            category: documentData.category,
            description: documentData.description,
            fileName: documentData.fileName,
            filePath: documentData.filePath,
            fileSize: documentData.fileSize,
            mimeType: documentData.mimeType,
            fileHash: documentData.fileHash,
            isUploaded: true,
            verificationStatus: 'PENDING'
          }
        });

        logger.info('Document added to HTB claim', {
          claimId,
          documentId: document.id,
          documentType: documentData.documentType,
          fileName: documentData.fileName
        });

        return document;
      },
      {
        operationType: 'CREATE',
        tableName: 'htb_documents',
        description: `Add document to HTB claim: ${claimId}`
      }
    );
  }

  /**
   * Update document verification status
   */
  async updateDocumentVerification(
    documentId: string,
    verificationStatus: HTBDocumentVerificationStatus,
    verifiedBy?: string,
    aiVerificationData?: {
      aiVerificationId: string;
      aiConfidenceScore: number;
      aiExtractedData: any;
    }
  ): Promise<HTBDocument> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const updateData: any = {
          verificationStatus,
          isVerified: verificationStatus === 'VERIFIED',
          updatedAt: new Date()
        };

        if (verificationStatus === 'VERIFIED') {
          updateData.verifiedAt = new Date();
          updateData.verifiedBy = verifiedBy || 'system';
        }

        if (aiVerificationData) {
          updateData.aiVerificationId = aiVerificationData.aiVerificationId;
          updateData.aiConfidenceScore = aiVerificationData.aiConfidenceScore;
          updateData.aiExtractedData = aiVerificationData.aiExtractedData;
        }

        const document = await prisma.hTBDocument.update({
          where: { id: documentId },
          data: updateData
        });

        logger.info('Document verification status updated', {
          documentId,
          verificationStatus,
          verifiedBy,
          aiConfidenceScore: aiVerificationData?.aiConfidenceScore
        });

        return document;
      },
      {
        operationType: 'UPDATE',
        tableName: 'htb_documents',
        description: `Update document verification: ${documentId}`
      }
    );
  }

  /**
   * Get HTB claims by status
   */
  async getClaimsByStatus(status: HTBClaimStatus): Promise<HTBClaimWithRelations[]> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const claims = await prisma.hTBClaim.findMany({
          where: { status },
          include: {
            buyer: true,
            property: true,
            documents: true,
            statusHistory: {
              orderBy: { createdAt: 'desc' },
              take: 3
            }
          },
          orderBy: { updatedAt: 'desc' }
        });

        return claims as HTBClaimWithRelations[];
      },
      {
        operationType: 'READ',
        tableName: 'htb_claims',
        description: `Get HTB claims by status: ${status}`
      }
    );
  }

  /**
   * Get HTB claims requiring processing
   */
  async getClaimsRequiringProcessing(): Promise<HTBClaimWithRelations[]> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const claims = await prisma.hTBClaim.findMany({
          where: {
            automationEnabled: true,
            status: {
              in: ['INITIATED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW']
            }
          },
          include: {
            buyer: true,
            property: true,
            documents: true,
            statusHistory: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          },
          orderBy: { createdAt: 'asc' }
        });

        return claims as HTBClaimWithRelations[];
      },
      {
        operationType: 'READ',
        tableName: 'htb_claims',
        description: 'Get HTB claims requiring processing'
      }
    );
  }

  /**
   * Create or update user
   */
  async createOrUpdateUser(userData: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    ppsNumber?: string;
    dateOfBirth?: Date;
    isFirstTimeBuyer?: boolean;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    county?: string;
    eircode?: string;
  }): Promise<User> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        // Try to find existing user by email
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          // Update existing user
          return await prisma.user.update({
            where: { email: userData.email },
            data: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              ppsNumber: userData.ppsNumber,
              dateOfBirth: userData.dateOfBirth,
              isFirstTimeBuyer: userData.isFirstTimeBuyer ?? existingUser.isFirstTimeBuyer,
              addressLine1: userData.addressLine1,
              addressLine2: userData.addressLine2,
              city: userData.city,
              county: userData.county,
              eircode: userData.eircode,
              updatedAt: new Date()
            }
          });
        } else {
          // Create new user
          return await prisma.user.create({
            data: {
              id: userData.id || uuidv4(),
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              ppsNumber: userData.ppsNumber,
              dateOfBirth: userData.dateOfBirth,
              isFirstTimeBuyer: userData.isFirstTimeBuyer ?? true,
              addressLine1: userData.addressLine1,
              addressLine2: userData.addressLine2,
              city: userData.city,
              county: userData.county,
              eircode: userData.eircode,
              status: 'ACTIVE'
            }
          });
        }
      },
      {
        operationType: existingUser ? 'UPDATE' : 'CREATE',
        tableName: 'users',
        description: `${existingUser ? 'Update' : 'Create'} user: ${userData.email}`,
        userId: userData.id
      }
    );
  }

  /**
   * Create property
   */
  async createProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const property = await prisma.property.create({
          data: {
            propertyId: propertyData.propertyId,
            address: propertyData.address,
            addressLine1: propertyData.addressLine1,
            addressLine2: propertyData.addressLine2,
            city: propertyData.city,
            county: propertyData.county,
            eircode: propertyData.eircode,
            propertyType: propertyData.propertyType,
            propertyCategory: propertyData.propertyCategory,
            currentPrice: propertyData.currentPrice,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            floorArea: propertyData.floorArea,
            buildYear: propertyData.buildYear,
            buildingEnergyRating: propertyData.buildingEnergyRating,
            developerId: propertyData.developerId,
            isNewBuild: propertyData.isNewBuild ?? false,
            completionDate: propertyData.completionDate
          }
        });

        logger.info('Property created', {
          propertyId: property.propertyId,
          address: property.address,
          price: property.currentPrice
        });

        return property;
      },
      {
        operationType: 'CREATE',
        tableName: 'properties',
        description: `Create property: ${propertyData.propertyId}`
      }
    );
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    totalClaims: number;
    activeClaims: number;
    completedClaims: number;
    totalDocuments: number;
    verifiedDocuments: number;
    totalUsers: number;
    totalProperties: number;
  }> {
    const prisma = postgresService.getPrismaClient();
    
    return await postgresService.executeQuery(
      async () => {
        const [
          totalClaims,
          activeClaims,
          completedClaims,
          totalDocuments,
          verifiedDocuments,
          totalUsers,
          totalProperties
        ] = await Promise.all([
          prisma.hTBClaim.count(),
          prisma.hTBClaim.count({
            where: {
              status: {
                in: ['INITIATED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'SUBMITTED', 'APPROVAL_PENDING']
              }
            }
          }),
          prisma.hTBClaim.count({
            where: { status: 'COMPLETED' }
          }),
          prisma.hTBDocument.count(),
          prisma.hTBDocument.count({
            where: { verificationStatus: 'VERIFIED' }
          }),
          prisma.user.count(),
          prisma.property.count()
        ]);

        return {
          totalClaims,
          activeClaims,
          completedClaims,
          totalDocuments,
          verifiedDocuments,
          totalUsers,
          totalProperties
        };
      },
      {
        operationType: 'READ',
        tableName: 'statistics',
        description: 'Get database statistics'
      }
    );
  }
}

// Export singleton instance
export const htbRealPostgresService = new HTBRealPostgresService();
export default htbRealPostgresService;