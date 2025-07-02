import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user with KYC verification details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        kycStatus: true,
        lastActive: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get KYC verification record
    const kycVerification = await prisma.kYCVerification.findUnique({
      where: { userId },
      include: {
        idFrontImage: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            uploadDate: true,
            status: true
          }
        },
        idBackImage: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            uploadDate: true,
            status: true
          }
        },
        selfieImage: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            uploadDate: true,
            status: true
          }
        },
        addressProofImage: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            uploadDate: true,
            status: true
          }
        },
        verificationHistory: {
          orderBy: { created: 'desc' },
          take: 10,
          select: {
            id: true,
            previousStatus: true,
            newStatus: true,
            changedBy: true,
            changeReason: true,
            changeNotes: true,
            created: true
          }
        }
      }
    });

    // Get compliance checks
    const complianceChecks = kycVerification ? await prisma.kYCComplianceCheck.findMany({
      where: { verificationId: kycVerification.id },
      orderBy: { requestedAt: 'desc' },
      select: {
        id: true,
        checkType: true,
        checkProvider: true,
        status: true,
        result: true,
        confidence: true,
        riskLevel: true,
        flags: true,
        riskFactors: true,
        requestedAt: true,
        completedAt: true
      }
    }) : [];

    // Get all KYC documents for legacy compatibility
    const legacyDocuments = await prisma.document.findMany({
      where: {
        User_UserKycDocuments: {
          some: { id: userId }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
        category: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        uploadDate: true,
        tags: true,
        metadata: true
      },
      orderBy: { uploadDate: 'desc' }
    });

    // Calculate overall verification progress and status
    const verification = calculateVerificationStatus(kycVerification, complianceChecks);
    
    // Prepare documents summary
    const documents = {
      total: legacyDocuments.length,
      byCategory: {
        identity: legacyDocuments.filter(doc => doc.category === 'kyc_identity'),
        address: legacyDocuments.filter(doc => doc.category === 'kyc_address'),
        financial: legacyDocuments.filter(doc => doc.category === 'kyc_financial')
      },
      recent: legacyDocuments.slice(0, 5),
      enhanced: {
        idFront: kycVerification?.idFrontImage,
        idBack: kycVerification?.idBackImage,
        selfie: kycVerification?.selfieImage,
        addressProof: kycVerification?.addressProofImage
      }
    };

    // Determine next steps
    const nextSteps = determineNextSteps(kycVerification, verification);

    // Calculate risk assessment
    const riskAssessment = calculateRiskAssessment(kycVerification, complianceChecks);

    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        kycStatus: user.kycStatus,
        lastActive: user.lastActive
      },
      verification: {
        id: kycVerification?.id,
        status: kycVerification?.status || 'NOT_STARTED',
        progress: kycVerification?.progress || 0,
        completedSteps: verification.completedSteps,
        totalSteps: verification.totalSteps,
        nextSteps: nextSteps,
        submittedAt: kycVerification?.submittedAt,
        reviewedAt: kycVerification?.reviewedAt,
        reviewedBy: kycVerification?.reviewedBy,
        reviewNotes: kycVerification?.reviewNotes,
        riskScore: kycVerification?.riskScore,
        complianceFlags: kycVerification?.complianceFlags || []
      },
      documents,
      formData: kycVerification ? {
        fullName: kycVerification.fullName,
        dateOfBirth: kycVerification.dateOfBirth,
        nationality: kycVerification.nationality,
        ppsNumber: maskSensitiveData(kycVerification.ppsNumber),
        idType: kycVerification.idType,
        idNumber: maskSensitiveData(kycVerification.idNumber),
        idExpiryDate: kycVerification.idExpiryDate,
        address: {
          line1: kycVerification.addressLine1,
          line2: kycVerification.addressLine2,
          city: kycVerification.city,
          county: kycVerification.county,
          eircode: kycVerification.eircode
        },
        addressProofType: kycVerification.addressProofType,
        sourceOfFunds: kycVerification.sourceOfFunds,
        isPoliticallyExposed: kycVerification.isPoliticallyExposed,
        isHighRiskCountry: kycVerification.isHighRiskCountry
      } : null,
      complianceChecks: complianceChecks.map(check => ({
        ...check,
        completionTime: check.completedAt && check.requestedAt 
          ? Math.round((check.completedAt.getTime() - check.requestedAt.getTime()) / 1000)
          : null
      })),
      riskAssessment,
      verificationHistory: kycVerification?.verificationHistory || [],
      requiresAction: verification.requiresAction,
      estimatedCompletionTime: calculateEstimatedCompletionTime(verification),
      lastUpdated: kycVerification?.updated || user.lastActive
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching enhanced KYC status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KYC status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { status, reviewNotes, reviewerId, riskScore, complianceFlags } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get current verification record
      const currentVerification = await tx.kYCVerification.findUnique({
        where: { userId }
      });

      if (!currentVerification) {
        throw new Error('KYC verification record not found');
      }

      // Update verification record
      const updatedVerification = await tx.kYCVerification.update({
        where: { userId },
        data: {
          status: status as any,
          reviewedAt: new Date(),
          reviewedBy: reviewerId || 'system',
          reviewNotes,
          riskScore,
          complianceFlags: complianceFlags || currentVerification.complianceFlags,
          updated: new Date()
        }
      });

      // Update user KYC status
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: status as any,
          lastActive: new Date()
        }
      });

      // Create history entry
      await tx.kYCVerificationHistory.create({
        data: {
          id: uuidv4(),
          verificationId: currentVerification.id,
          previousStatus: currentVerification.status,
          newStatus: status as any,
          changedBy: reviewerId || 'system',
          changeReason: 'Manual review update',
          changeNotes: reviewNotes || `Status changed to ${status}`
        }
      });

      return updatedVerification;
    });

    return NextResponse.json({
      success: true,
      message: `KYC status updated to ${status}`,
      data: {
        id: result.id,
        status: result.status,
        reviewedAt: result.reviewedAt,
        reviewedBy: result.reviewedBy,
        riskScore: result.riskScore
      }
    });

  } catch (error) {
    console.error('Error updating enhanced KYC status:', error);
    return NextResponse.json(
      { error: 'Failed to update KYC status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function calculateVerificationStatus(kycVerification: any, complianceChecks: any[]) {
  if (!kycVerification) {
    return {
      completedSteps: 0,
      totalSteps: 4,
      requiresAction: true
    };
  }

  let completedSteps = 0;
  const totalSteps = 4;

  // Check if personal info is complete
  if (kycVerification.fullName && kycVerification.dateOfBirth && 
      kycVerification.nationality && kycVerification.ppsNumber) {
    completedSteps++;
  }

  // Check if identity verification is complete
  if (kycVerification.idFrontImageId && kycVerification.selfieImageId) {
    completedSteps++;
  }

  // Check if address verification is complete
  if (kycVerification.addressProofImageId) {
    completedSteps++;
  }

  // Check if compliance checks are complete
  const allChecksComplete = complianceChecks.length > 0 && 
    complianceChecks.every(check => check.status === 'COMPLETED');
  if (allChecksComplete) {
    completedSteps++;
  }

  return {
    completedSteps,
    totalSteps,
    requiresAction: completedSteps < totalSteps || kycVerification.status === 'NOT_STARTED'
  };
}

function determineNextSteps(kycVerification: any, verification: any) {
  const steps = [];

  if (!kycVerification) {
    return ['Complete KYC verification form with personal information'];
  }

  if (!kycVerification.idFrontImageId) {
    steps.push('Upload front side of identity document');
  }

  if (!kycVerification.selfieImageId) {
    steps.push('Upload selfie with identity document');
  }

  if (!kycVerification.addressProofImageId) {
    steps.push('Upload proof of address document');
  }

  if (kycVerification.status === 'PENDING_REVIEW') {
    steps.push('Await review by compliance team');
  }

  if (steps.length === 0 && kycVerification.status !== 'APPROVED') {
    steps.push('All documents submitted - verification in progress');
  }

  return steps;
}

function calculateRiskAssessment(kycVerification: any, complianceChecks: any[]) {
  if (!kycVerification) {
    return {
      overallRisk: 'UNKNOWN',
      riskFactors: [],
      riskScore: null,
      recommendations: []
    };
  }

  const riskFactors = [];
  let riskScore = kycVerification.riskScore || 0;

  // Add risk factors based on verification data
  if (kycVerification.isPoliticallyExposed) {
    riskFactors.push('Politically Exposed Person (PEP)');
    riskScore += 30;
  }

  if (kycVerification.isHighRiskCountry) {
    riskFactors.push('Connection to high-risk country');
    riskScore += 20;
  }

  // Add risk factors from compliance checks
  complianceChecks.forEach(check => {
    if (check.result === 'REVIEW_REQUIRED') {
      riskFactors.push(`${check.checkType.replace('_', ' ')} requires review`);
      riskScore += 15;
    }
    if (check.flags && check.flags.length > 0) {
      riskFactors.push(...check.flags);
    }
  });

  // Determine overall risk level
  let overallRisk = 'LOW';
  if (riskScore >= 70) overallRisk = 'CRITICAL';
  else if (riskScore >= 50) overallRisk = 'HIGH';
  else if (riskScore >= 30) overallRisk = 'MEDIUM';

  // Generate recommendations
  const recommendations = [];
  if (riskScore > 50) {
    recommendations.push('Enhanced due diligence required');
  }
  if (kycVerification.isPoliticallyExposed) {
    recommendations.push('PEP screening and monitoring required');
  }
  if (riskFactors.length > 0) {
    recommendations.push('Additional documentation may be required');
  }

  return {
    overallRisk,
    riskFactors,
    riskScore: Math.min(riskScore, 100),
    recommendations
  };
}

function calculateEstimatedCompletionTime(verification: any) {
  const hoursRemaining = (verification.totalSteps - verification.completedSteps) * 2;
  return `${hoursRemaining}-${hoursRemaining + 24} hours`;
}

function maskSensitiveData(data: string): string {
  if (!data) return '';
  if (data.length <= 4) return '****';
  return data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2);
}

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}