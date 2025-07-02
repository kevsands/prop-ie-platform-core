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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'kyc', userId);
    await mkdir(uploadsDir, { recursive: true });

    // Helper function to save file
    const saveFile = async (file: File, prefix: string) => {
      if (!file) return null;
      
      const fileExtension = file.name.split('.').pop();
      const fileName = `${prefix}_${Date.now()}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await writeFile(filePath, buffer);
      
      return `/uploads/kyc/${userId}/${fileName}`;
    };

    // Save uploaded files
    const idFrontUrl = await saveFile(idFrontImage, 'id_front');
    const idBackUrl = await saveFile(idBackImage, 'id_back');
    const selfieUrl = await saveFile(selfieImage, 'selfie');
    const addressProofUrl = await saveFile(addressProofImage, 'address_proof');

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user KYC status
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: 'IN_PROGRESS',
          lastActive: new Date(),
          metadata: {
            kyc: {
              fullName,
              dateOfBirth,
              nationality,
              ppsNumber,
              idType,
              idNumber,
              idExpiryDate,
              address: {
                line1: addressLine1,
                line2: addressLine2,
                city,
                county,
                eircode
              },
              addressProofType,
              sourceOfFunds,
              isPoliticallyExposed,
              isHighRiskCountry,
              submittedAt: new Date().toISOString()
            }
          }
        }
      });

      // Create document records for uploaded files
      const documents = [];

      if (idFrontUrl) {
        const doc = await tx.document.create({
          data: {
            id: uuidv4(),
            name: `ID Document Front - ${idType}`,
            description: `Front side of ${idType} for KYC verification`,
            type: 'identity_document',
            status: 'uploaded',
            category: 'kyc_identity',
            fileUrl: idFrontUrl,
            fileType: idFrontImage.type,
            fileSize: idFrontImage.size,
            uploadedById: userId,
            uploadedByName: fullName,
            tags: ['kyc', 'identity', 'front'],
            metadata: {
              idType,
              idNumber: idNumber.substring(0, 4) + '****', // Mask sensitive info
              verificationStep: 'identity'
            }
          }
        });
        documents.push(doc);
      }

      if (idBackUrl) {
        const doc = await tx.document.create({
          data: {
            id: uuidv4(),
            name: `ID Document Back - ${idType}`,
            description: `Back side of ${idType} for KYC verification`,
            type: 'identity_document',
            status: 'uploaded',
            category: 'kyc_identity',
            fileUrl: idBackUrl,
            fileType: idBackImage.type,
            fileSize: idBackImage.size,
            uploadedById: userId,
            uploadedByName: fullName,
            tags: ['kyc', 'identity', 'back'],
            metadata: {
              idType,
              verificationStep: 'identity'
            }
          }
        });
        documents.push(doc);
      }

      if (selfieUrl) {
        const doc = await tx.document.create({
          data: {
            id: uuidv4(),
            name: 'Selfie with ID',
            description: 'Selfie holding ID document for identity verification',
            type: 'selfie_verification',
            status: 'uploaded',
            category: 'kyc_identity',
            fileUrl: selfieUrl,
            fileType: selfieImage.type,
            fileSize: selfieImage.size,
            uploadedById: userId,
            uploadedByName: fullName,
            tags: ['kyc', 'selfie', 'verification'],
            metadata: {
              verificationStep: 'identity',
              biometric: true
            }
          }
        });
        documents.push(doc);
      }

      if (addressProofUrl) {
        const doc = await tx.document.create({
          data: {
            id: uuidv4(),
            name: `Address Proof - ${addressProofType}`,
            description: `${addressProofType} for address verification`,
            type: 'address_proof',
            status: 'uploaded',
            category: 'kyc_address',
            fileUrl: addressProofUrl,
            fileType: addressProofImage.type,
            fileSize: addressProofImage.size,
            uploadedById: userId,
            uploadedByName: fullName,
            tags: ['kyc', 'address', addressProofType],
            metadata: {
              addressProofType,
              address: `${addressLine1}, ${city}, ${county}`,
              verificationStep: 'address'
            }
          }
        });
        documents.push(doc);
      }

      // Link documents to user's KYC documents
      if (documents.length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            Document_UserKycDocuments: {
              connect: documents.map(doc => ({ id: doc.id }))
            }
          }
        });
      }

      return {
        user: await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            kycStatus: true,
            Document_UserKycDocuments: {
              select: {
                id: true,
                name: true,
                type: true,
                status: true,
                uploadDate: true
              }
            }
          }
        }),
        documents
      };
    });

    // Simulate processing workflow (in production, this would trigger background jobs)
    setTimeout(async () => {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { kycStatus: 'PENDING_REVIEW' }
        });
        console.log(`KYC submission for user ${userId} moved to PENDING_REVIEW`);
      } catch (error) {
        console.error('Error updating KYC status:', error);
      }
    }, 5000);

    return NextResponse.json({
      success: true,
      message: 'KYC submission successful',
      data: result
    });

  } catch (error) {
    console.error('KYC submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit KYC verification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}