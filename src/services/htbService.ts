// src/services/htbService.ts
import { PrismaClient } from '@prisma/client';
import { 
    HTBClaim, 
    HTBDocument, 
    HTBNote, 
    HTBClaimStatus,
    HTBStatusUpdate
} from "@/types/htb";
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';

const prisma = new PrismaClient();

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Helper to broadcast HTB status updates in real-time
const broadcastHTBUpdate = (claim: any, newStatus: string, updatedBy: string = 'system'): void => {
  try {
    const htbUpdateData = {
      applicationId: claim.claimId,
      newStatus,
      buyerId: claim.buyerId,
      propertyId: claim.propertyId,
      updatedBy,
      timestamp: new Date().toISOString(),
      approvedAmount: claim.approvedAmount,
      requestedAmount: claim.requestedAmount,
      propertyPrice: claim.propertyPrice
    };

    // Trigger server-side event for WebSocket broadcasting
    realTimeServerManager.triggerEvent('htb_updated', htbUpdateData);

    // Broadcast to specific buyer
    if (claim.buyerId) {
      realTimeServerManager.broadcastToUsers([claim.buyerId], 'htb_status_change', htbUpdateData);
    }

    // Broadcast to relevant professional roles
    realTimeServerManager.broadcastToRoles(
      ['BUYER_SOLICITOR', 'BUYER_MORTGAGE_BROKER', 'DEVELOPER', 'ADMIN'],
      'htb_status_change',
      htbUpdateData
    );

    console.log(`📡 Broadcasted HTB status update: ${claim.claimId} -> ${newStatus}`);
  } catch (error) {
    console.error('Failed to broadcast HTB update:', error);
  }
};

// Map database HTBClaimStatus enum to application enum
const mapDBStatusToApp = (dbStatus: string): HTBClaimStatus => {
  const statusMap: Record<string, HTBClaimStatus> = {
    'INITIATED': HTBClaimStatus.INITIATED,
    'DOCUMENTS_PENDING': HTBClaimStatus.DOCUMENTS_PENDING,
    'UNDER_REVIEW': HTBClaimStatus.UNDER_REVIEW,
    'SUBMITTED': HTBClaimStatus.SUBMITTED,
    'APPROVAL_PENDING': HTBClaimStatus.APPROVAL_PENDING,
    'APPROVED': HTBClaimStatus.APPROVED,
    'REJECTED': HTBClaimStatus.REJECTED,
    'DISBURSEMENT_READY': HTBClaimStatus.DISBURSEMENT_READY,
    'DISBURSED': HTBClaimStatus.DISBURSED,
    'COMPLETED': HTBClaimStatus.COMPLETED,
    'CANCELLED': HTBClaimStatus.CANCELLED,
    // Legacy status mappings
    'ACCESS_CODE_SUBMITTED': HTBClaimStatus.DOCUMENTS_PENDING,
    'DEVELOPER_PROCESSING': HTBClaimStatus.UNDER_REVIEW,
    'CLAIM_CODE_RECEIVED': HTBClaimStatus.APPROVED,
    'FUNDS_REQUESTED': HTBClaimStatus.DISBURSEMENT_READY,
    'FUNDS_RECEIVED': HTBClaimStatus.DISBURSED,
    'DEPOSIT_APPLIED': HTBClaimStatus.COMPLETED
  };
  return statusMap[dbStatus] || HTBClaimStatus.INITIATED;
};

// Map application status to database enum
const mapAppStatusToDB = (appStatus: HTBClaimStatus): string => {
  const statusMap: Record<HTBClaimStatus, string> = {
    [HTBClaimStatus.INITIATED]: 'INITIATED',
    [HTBClaimStatus.DOCUMENTS_PENDING]: 'DOCUMENTS_PENDING',
    [HTBClaimStatus.UNDER_REVIEW]: 'UNDER_REVIEW',
    [HTBClaimStatus.SUBMITTED]: 'SUBMITTED',
    [HTBClaimStatus.APPROVAL_PENDING]: 'APPROVAL_PENDING',
    [HTBClaimStatus.APPROVED]: 'APPROVED',
    [HTBClaimStatus.REJECTED]: 'REJECTED',
    [HTBClaimStatus.DISBURSEMENT_READY]: 'DISBURSEMENT_READY',
    [HTBClaimStatus.DISBURSED]: 'DISBURSED',
    [HTBClaimStatus.COMPLETED]: 'COMPLETED',
    [HTBClaimStatus.CANCELLED]: 'CANCELLED',
    // Legacy mappings
    [HTBClaimStatus.ACCESS_CODE_SUBMITTED]: 'DOCUMENTS_PENDING',
    [HTBClaimStatus.DEVELOPER_PROCESSING]: 'UNDER_REVIEW',
    [HTBClaimStatus.CLAIM_CODE_RECEIVED]: 'APPROVED',
    [HTBClaimStatus.FUNDS_REQUESTED]: 'DISBURSEMENT_READY',
    [HTBClaimStatus.FUNDS_RECEIVED]: 'DISBURSED',
    [HTBClaimStatus.DEPOSIT_APPLIED]: 'COMPLETED'
  };
  return statusMap[appStatus] || 'INITIATED';
};

// Convert database claim to application format
const convertDBClaimToApp = async (dbClaim: any): Promise<HTBClaim> => {
  // Get status history
  const statusHistory = await prisma.hTBStatusHistory.findMany({
    where: { htbClaimId: dbClaim.id },
    orderBy: { createdAt: 'asc' }
  });

  // Get documents
  const documents = await prisma.hTBDocument.findMany({
    where: { htbClaimId: dbClaim.id },
    orderBy: { uploadedAt: 'desc' }
  });

  return {
    id: dbClaim.claimId,
    propertyId: dbClaim.propertyId,
    buyerId: dbClaim.buyerId,
    developerId: dbClaim.developerId || '',
    propertyPrice: Number(dbClaim.propertyPrice),
    
    accessCode: '',
    accessCodeExpiryDate: '',
    claimCode: '',
    claimCodeExpiryDate: '',
    
    requestedAmount: Number(dbClaim.requestedAmount),
    approvedAmount: Number(dbClaim.approvedAmount || 0),
    drawdownAmount: Number(dbClaim.disbursedAmount || 0),
    
    status: mapDBStatusToApp(dbClaim.status),
    applicationDate: dbClaim.applicationDate.toISOString(),
    lastUpdatedDate: dbClaim.updatedAt.toISOString(),
    
    statusHistory: statusHistory.map(sh => ({
      id: sh.id,
      claimId: dbClaim.claimId,
      previousStatus: sh.oldStatus ? mapDBStatusToApp(sh.oldStatus) : null,
      newStatus: mapDBStatusToApp(sh.newStatus),
      updatedBy: sh.changedBy,
      updatedAt: sh.createdAt.toISOString(),
      notes: sh.notes || ''
    })),
    
    documents: documents.map(doc => ({
      id: doc.id,
      claimId: dbClaim.claimId,
      type: doc.documentType.toLowerCase(),
      name: doc.documentName,
      url: doc.filePath,
      uploadedBy: doc.verifiedBy || 'system',
      uploadedAt: doc.uploadedAt.toISOString()
    })),
    
    notes: [] // Notes will be handled separately if needed
  };
};

// Real HTB service with database integration
export const htbService = {
  // Buyer methods
  createClaim: async (propertyId: string, requestedAmount: number): Promise<HTBClaim> => {
    // Get current user ID (in a real app, this would come from auth context)
    const currentUserId = "current-user";
    
    // Find or create the property
    let property = await prisma.property.findFirst({
      where: { propertyId: propertyId }
    });
    
    if (!property) {
      // Create a basic property record if it doesn't exist
      property = await prisma.property.create({
        data: {
          propertyId,
          address: `Property ${propertyId}`,
          addressLine1: `Address Line 1 for ${propertyId}`,
          city: 'Dublin',
          county: 'Dublin',
          propertyType: 'NEW',
          propertyCategory: 'HOUSE',
          currentPrice: requestedAmount * 10
        }
      });
    }
    
    // Find or create the user
    let user = await prisma.user.findFirst({
      where: { id: currentUserId }
    });
    
    if (!user) {
      // Create a basic user record
      user = await prisma.user.create({
        data: {
          id: currentUserId,
          email: 'buyer@example.com',
          firstName: 'Test',
          lastName: 'Buyer'
        }
      });
    }
    
    // Create the HTB claim
    const claimId = `HTB-${generateId()}`;
    const dbClaim = await prisma.hTBClaim.create({
      data: {
        claimId,
        buyerId: currentUserId,
        propertyId: property.id,
        propertyPrice: requestedAmount * 10,
        requestedAmount,
        status: 'INITIATED'
      }
    });
    
    // Create initial status history entry
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: dbClaim.id,
        newStatus: 'INITIATED',
        changedBy: currentUserId,
        notes: 'Claim initiated'
      }
    });
    
    return convertDBClaimToApp(dbClaim);
  },
  
  getBuyerClaims: async (): Promise<HTBClaim[]> => {
    const currentUserId = "current-user";
    
    const claims = await prisma.hTBClaim.findMany({
      where: { buyerId: currentUserId },
      orderBy: { createdAt: 'desc' }
    });
    
    return Promise.all(claims.map(convertDBClaimToApp));
  },
  
  getClaimById: async (id: string): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    return convertDBClaimToApp(claim);
  },
  
  submitAccessCode: async (id: string, accessCode: string, accessCodeExpiryDate: Date, file?: File): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Update claim status
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: 'DOCUMENTS_PENDING'
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus: 'DOCUMENTS_PENDING',
        changedBy: 'current-user',
        notes: 'Access code submitted'
      }
    });
    
    // Add document if file was uploaded
    if (file) {
      await prisma.hTBDocument.create({
        data: {
          htbClaimId: claim.id,
          documentName: file.name,
          documentType: 'ID_VERIFICATION',
          category: 'verification',
          fileName: file.name,
          filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
          fileHash: generateId()
        }
      });
    }
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  // Developer methods
  getDeveloperClaims: async (filters?: any): Promise<HTBClaim[]> => {
    const currentDeveloperId = "developer-1";
    
    let whereClause: any = {
      developerId: currentDeveloperId
    };
    
    // Apply filters
    if (filters?.status) {
      whereClause.status = mapAppStatusToDB(filters.status);
    }
    
    if (filters?.propertyId) {
      const property = await prisma.property.findFirst({
        where: { propertyId: filters.propertyId }
      });
      if (property) {
        whereClause.propertyId = property.id;
      }
    }
    
    const claims = await prisma.hTBClaim.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return Promise.all(claims.map(convertDBClaimToApp));
  },
  
  processAccessCode: async (id: string, status: "processing" | "rejected", notes?: string): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    const newStatus = status === "processing" ? 'UNDER_REVIEW' : 'REJECTED';
    
    // Update claim status
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: newStatus
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus,
        changedBy: 'developer-1',
        notes: notes || `Access code ${status === "processing" ? "accepted" : "rejected"}`
      }
    });

    // Broadcast real-time HTB status update
    broadcastHTBUpdate(updatedClaim, newStatus, 'developer-1');
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  submitClaimCode: async (
    id: string, 
    claimCode: string, 
    claimCodeExpiryDate: Date, 
    approvedAmount: number,
    file?: File
  ): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Update claim with approval details
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: 'APPROVED',
        approvedAmount
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus: 'APPROVED',
        changedBy: 'developer-1',
        notes: `Claim code received and €${approvedAmount} approved`
      }
    });
    
    // Add document if file was uploaded
    if (file) {
      await prisma.hTBDocument.create({
        data: {
          htbClaimId: claim.id,
          documentName: file.name,
          documentType: 'MORTGAGE_APPROVAL',
          category: 'approval',
          fileName: file.name,
          filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
          fileHash: generateId()
        }
      });
    }

    // Broadcast real-time HTB approval
    broadcastHTBUpdate(updatedClaim, 'APPROVED', 'developer-1');
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  requestFunds: async (id: string, requestDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Update claim status
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: 'DISBURSEMENT_READY'
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus: 'DISBURSEMENT_READY',
        changedBy: 'developer-1',
        notes: notes || `Funds requested on ${requestDate.toLocaleDateString()}`
      }
    });
    
    // Add document if file was uploaded
    if (file) {
      await prisma.hTBDocument.create({
        data: {
          htbClaimId: claim.id,
          documentName: file.name,
          documentType: 'CONTRACTS_SALE',
          category: 'legal',
          fileName: file.name,
          filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
          fileHash: generateId()
        }
      });
    }

    // Broadcast real-time HTB disbursement request
    broadcastHTBUpdate(updatedClaim, 'DISBURSEMENT_READY', 'developer-1');
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  markFundsReceived: async (id: string, receivedAmount: number, receivedDate: Date, file?: File): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Update claim with disbursement details
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: 'DISBURSED',
        disbursedAmount: receivedAmount
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus: 'DISBURSED',
        changedBy: 'developer-1',
        notes: `€${receivedAmount} received on ${receivedDate.toLocaleDateString()}`
      }
    });
    
    // Add document if file was uploaded
    if (file) {
      await prisma.hTBDocument.create({
        data: {
          htbClaimId: claim.id,
          documentName: file.name,
          documentType: 'BANK_STATEMENTS',
          category: 'financial',
          fileName: file.name,
          filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
          fileHash: generateId()
        }
      });
    }

    // Broadcast real-time HTB disbursement completion
    broadcastHTBUpdate(updatedClaim, 'DISBURSED', 'revenue-system');
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  applyDeposit: async (id: string, appliedDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Update claim status to completed
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: 'COMPLETED',
        completionDate: appliedDate
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus: 'COMPLETED',
        changedBy: 'developer-1',
        notes: notes || `HTB amount applied to deposit on ${appliedDate.toLocaleDateString()}`
      }
    });
    
    // Add document if file was uploaded
    if (file) {
      await prisma.hTBDocument.create({
        data: {
          htbClaimId: claim.id,
          documentName: file.name,
          documentType: 'CONTRACTS_SALE',
          category: 'completion',
          fileName: file.name,
          filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
          fileHash: generateId()
        }
      });
    }

    // Broadcast real-time HTB deposit application completion
    broadcastHTBUpdate(updatedClaim, 'COMPLETED', 'property-system');
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  completeClaim: async (id: string, completionDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Update claim status to completed
    const updatedClaim = await prisma.hTBClaim.update({
      where: { id: claim.id },
      data: {
        status: 'COMPLETED',
        completionDate
      }
    });
    
    // Add status history
    await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        oldStatus: claim.status,
        newStatus: 'COMPLETED',
        changedBy: 'developer-1',
        notes: notes || `HTB claim completed on ${completionDate.toLocaleDateString()}`
      }
    });
    
    // Add document if file was uploaded
    if (file) {
      await prisma.hTBDocument.create({
        data: {
          htbClaimId: claim.id,
          documentName: file.name,
          documentType: 'CONTRACTS_SALE',
          category: 'completion',
          fileName: file.name,
          filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
          fileHash: generateId()
        }
      });
    }
    
    return convertDBClaimToApp(updatedClaim);
  },
  
  // Shared methods
  addNote: async (id: string, content: string, isPrivate: boolean = false): Promise<HTBNote> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // For now, we'll store notes in the status history as a simple implementation
    const statusEntry = await prisma.hTBStatusHistory.create({
      data: {
        htbClaimId: claim.id,
        newStatus: claim.status,
        changedBy: 'current-user',
        notes: content
      }
    });
    
    return {
      id: statusEntry.id,
      claimId: claim.claimId,
      content,
      createdBy: 'current-user',
      createdAt: statusEntry.createdAt.toISOString(),
      isPrivate
    };
  },
  
  uploadDocument: async (id: string, file: File, type: string, name?: string): Promise<HTBDocument> => {
    const claim = await prisma.hTBClaim.findFirst({
      where: { claimId: id }
    });
    
    if (!claim) {
      throw new Error("Claim not found");
    }
    
    // Map type to HTBDocumentType enum
    const docTypeMap: Record<string, string> = {
      'access_code': 'ID_VERIFICATION',
      'claim_code': 'MORTGAGE_APPROVAL',
      'funds_request': 'CONTRACTS_SALE',
      'funds_receipt': 'BANK_STATEMENTS',
      'deposit_confirmation': 'CONTRACTS_SALE',
      'other': 'EMPLOYMENT_LETTER'
    };
    
    const document = await prisma.hTBDocument.create({
      data: {
        htbClaimId: claim.id,
        documentName: name || file.name,
        documentType: docTypeMap[type] || 'EMPLOYMENT_LETTER',
        category: 'general',
        fileName: file.name,
        filePath: `/uploads/htb/${claim.claimId}/${file.name}`,
        fileSize: file.size,
        mimeType: file.type,
        fileHash: generateId()
      }
    });
    
    return {
      id: document.id,
      claimId: claim.claimId,
      type,
      name: document.documentName,
      url: document.filePath,
      uploadedBy: 'current-user',
      uploadedAt: document.uploadedAt.toISOString()
    };
  }
};