import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const userId = formData.get('userId') as string;
    const fullName = formData.get('fullName') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const nationality = formData.get('nationality') as string;
    const ppsNumber = formData.get('ppsNumber') as string;
    const idType = formData.get('idType') as string;
    const idNumber = formData.get('idNumber') as string;
    const idExpiryDate = formData.get('idExpiryDate') as string;
    const addressLine1 = formData.get('addressLine1') as string;
    const addressLine2 = formData.get('addressLine2') as string;
    const city = formData.get('city') as string;
    const county = formData.get('county') as string;
    const eircode = formData.get('eircode') as string;
    const addressProofType = formData.get('addressProofType') as string;
    const sourceOfFunds = formData.get('sourceOfFunds') as string;
    const isPoliticallyExposed = formData.get('isPoliticallyExposed') === 'true';
    const isHighRiskCountry = formData.get('isHighRiskCountry') === 'true';
    const termsAccepted = formData.get('termsAccepted') === 'true';

    // Extract files
    const idFrontImage = formData.get('idFrontImage') as File;
    const idBackImage = formData.get('idBackImage') as File;
    const selfieImage = formData.get('selfieImage') as File;
    const addressProofImage = formData.get('addressProofImage') as File;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: 'Terms must be accepted' }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = {
      fullName, dateOfBirth, nationality, ppsNumber, idType, idNumber, idExpiryDate,
      addressLine1, city, county, eircode, addressProofType, sourceOfFunds
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value?.toString().trim()) {
        return NextResponse.json({ 
          error: `${field} is required` 
        }, { status: 400 });
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'kyc', userId);
    await mkdir(uploadsDir, { recursive: true });

    // Helper function to save file and create document record
    const saveFileAndCreateDocument = async (file: File, prefix: string, category: string, type: string) => {
      if (!file) return null;
      
      const fileExtension = file.name.split('.').pop();
      const fileName = `${prefix}_${Date.now()}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await writeFile(filePath, buffer);
      
      // Create document record
      const document = await prisma.document.create({
        data: {
          id: uuidv4(),
          name: `${prefix.replace('_', ' ')} - ${type}`,
          description: `${prefix.replace('_', ' ')} for KYC verification`,
          type: type,
          status: 'uploaded',
          category: category,
          fileUrl: `/uploads/kyc/${userId}/${fileName}`,
          fileType: file.type,
          fileSize: file.size,
          uploadedById: userId,
          uploadedByName: fullName,
          tags: ['kyc', 'verification', prefix],
          metadata: {
            verificationStep: 'identity',
            originalFileName: file.name,
            uploadedAt: new Date().toISOString()
          }
        }
      });

      return document;
    };

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Save uploaded files and create document records
      const idFrontDoc = idFrontImage ? await saveFileAndCreateDocument(
        idFrontImage, 'id_front', 'kyc_identity', 'identity_document'
      ) : null;
      
      const idBackDoc = idBackImage ? await saveFileAndCreateDocument(
        idBackImage, 'id_back', 'kyc_identity', 'identity_document'
      ) : null;
      
      const selfieDoc = selfieImage ? await saveFileAndCreateDocument(
        selfieImage, 'selfie', 'kyc_identity', 'selfie_verification'
      ) : null;
      
      const addressProofDoc = addressProofImage ? await saveFileAndCreateDocument(
        addressProofImage, 'address_proof', 'kyc_address', 'address_proof'
      ) : null;

      // Calculate progress based on uploaded documents
      let progress = 0;
      if (idFrontDoc) progress += 25;
      if (selfieDoc) progress += 25;
      if (addressProofDoc) progress += 25;
      if (fullName && dateOfBirth && nationality && ppsNumber) progress += 25;

      // Create or update KYC verification record
      const existingVerification = await tx.kYCVerification.findUnique({
        where: { userId }
      });

      const kycVerification = existingVerification 
        ? await tx.kYCVerification.update({
            where: { userId },
            data: {
              fullName,
              dateOfBirth: new Date(dateOfBirth),
              nationality,
              ppsNumber,
              idType: idType.toUpperCase() as any,
              idNumber,
              idExpiryDate: new Date(idExpiryDate),
              idFrontImageId: idFrontDoc?.id || existingVerification.idFrontImageId,
              idBackImageId: idBackDoc?.id || existingVerification.idBackImageId,
              selfieImageId: selfieDoc?.id || existingVerification.selfieImageId,
              addressLine1,
              addressLine2: addressLine2 || '',
              city,
              county,
              eircode,
              addressProofType: addressProofType.toUpperCase() as any,
              addressProofImageId: addressProofDoc?.id || existingVerification.addressProofImageId,
              sourceOfFunds: sourceOfFunds.toUpperCase() as any,
              isPoliticallyExposed,
              isHighRiskCountry,
              status: progress >= 75 ? 'PENDING_REVIEW' : 'IN_PROGRESS',
              progress,
              submittedAt: new Date(),
              updated: new Date(),
              metadata: {
                submissionSource: 'web_form',
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                termsAcceptedAt: new Date().toISOString()
              }
            }
          })
        : await tx.kYCVerification.create({
            data: {
              id: uuidv4(),
              userId,
              fullName,
              dateOfBirth: new Date(dateOfBirth),
              nationality,
              ppsNumber,
              idType: idType.toUpperCase() as any,
              idNumber,
              idExpiryDate: new Date(idExpiryDate),
              idFrontImageId: idFrontDoc?.id,
              idBackImageId: idBackDoc?.id,
              selfieImageId: selfieDoc?.id,
              addressLine1,
              addressLine2: addressLine2 || '',
              city,
              county,
              eircode,
              addressProofType: addressProofType.toUpperCase() as any,
              addressProofImageId: addressProofDoc?.id,
              sourceOfFunds: sourceOfFunds.toUpperCase() as any,
              isPoliticallyExposed,
              isHighRiskCountry,
              status: progress >= 75 ? 'PENDING_REVIEW' : 'IN_PROGRESS',
              progress,
              submittedAt: new Date(),
              metadata: {
                submissionSource: 'web_form',
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                termsAcceptedAt: new Date().toISOString()
              }
            }
          });

      // Update user KYC status
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: kycVerification.status,
          lastActive: new Date()
        }
      });

      // Create verification history entry
      await tx.kYCVerificationHistory.create({
        data: {
          id: uuidv4(),
          verificationId: kycVerification.id,
          previousStatus: existingVerification?.status,
          newStatus: kycVerification.status,
          changedBy: userId,
          changeReason: existingVerification ? 'Updated submission' : 'Initial submission',
          changeNotes: `Progress: ${progress}%. Documents uploaded: ${[
            idFrontDoc && 'ID Front',
            idBackDoc && 'ID Back', 
            selfieDoc && 'Selfie',
            addressProofDoc && 'Address Proof'
          ].filter(Boolean).join(', ')}`
        }
      });

      // Link documents to user KYC documents relation
      const documentIds = [idFrontDoc, idBackDoc, selfieDoc, addressProofDoc]
        .filter(Boolean)
        .map(doc => ({ id: doc!.id }));

      if (documentIds.length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            Document_UserKycDocuments: {
              connect: documentIds
            }
          }
        });
      }

      return {
        verification: kycVerification,
        documents: [idFrontDoc, idBackDoc, selfieDoc, addressProofDoc].filter(Boolean),
        progress,
        status: kycVerification.status
      };
    });

    // Trigger compliance checks asynchronously if verification is complete enough
    if (result.progress >= 75) {
      setTimeout(async () => {
        try {
          await triggerComplianceChecks(result.verification.id, userId);
        } catch (error) {
          console.error('Error triggering compliance checks:', error);
        }
      }, 1000);
    }

    return NextResponse.json({
      success: true,
      message: 'KYC verification submitted successfully',
      data: result
    });

  } catch (error) {
    console.error('Enhanced KYC submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit KYC verification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Function to trigger compliance checks
async function triggerComplianceChecks(verificationId: string, userId: string) {
  const checks = [
    {
      id: uuidv4(),
      verificationId,
      checkType: 'IDENTITY_VERIFICATION',
      checkProvider: 'internal',
      status: 'PENDING',
      result: 'PASS', // Simplified for demo
      riskLevel: 'LOW',
      riskFactors: []
    },
    {
      id: uuidv4(),
      verificationId,
      checkType: 'ADDRESS_VERIFICATION',
      checkProvider: 'internal',
      status: 'PENDING',
      result: 'PASS', // Simplified for demo
      riskLevel: 'LOW',
      riskFactors: []
    },
    {
      id: uuidv4(),
      verificationId,
      checkType: 'PEP_SCREENING',
      checkProvider: 'internal',
      status: 'PENDING',
      result: 'PASS', // Simplified for demo
      riskLevel: 'LOW',
      riskFactors: []
    }
  ];

  await prisma.kYCComplianceCheck.createMany({
    data: checks
  });

  console.log(`Triggered ${checks.length} compliance checks for verification ${verificationId}`);
}