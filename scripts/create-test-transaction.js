/**
 * Create test transaction data for testing the payment system
 * This script sets up a transaction with all related entities
 */

const { PrismaClient, TransactionStatus, TransactionStage } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test transaction data...');

  // 1. Create test development if it doesn't exist
  let development = await prisma.development.findFirst({
    where: { name: 'Fitzgerald Gardens' }
  });

  if (!development) {
    console.log('Creating test development...');
    development = await prisma.development.create({
      data: {
        name: 'Fitzgerald Gardens',
        slug: 'fitzgerald-gardens',
        description: 'A luxury development of 2, 3 and 4 bedroom homes in North Dublin',
        location: 'North Dublin',
        address: 'Fitzgerald Gardens, Dublin Road, Swords, Co. Dublin',
        county: 'Dublin',
        eircode: 'K67 X2K3',
        latitude: 53.45782,
        longitude: -6.21847,
        status: 'SELLING',
        totalUnits: 120,
        plannedStartDate: new Date('2024-01-15'),
        actualStartDate: new Date('2024-01-20'),
        expectedCompletion: new Date('2025-06-30'),
        developerId: 'developer-123', // This would be a real user ID in production
        totalProjectValue: 45000000,
        projectedRevenue: 52000000,
        features: JSON.stringify(['Landscaped Gardens', 'Playground', 'EV Charging Points']),
        amenities: JSON.stringify(['Schools Nearby', 'Shopping Center', 'Public Transport']),
        energyRating: 'A2'
      }
    });
    console.log('Development created:', development.id);
  } else {
    console.log('Using existing development:', development.id);
  }

  // 2. Create a test unit if it doesn't exist
  let unit = await prisma.unit.findFirst({
    where: { 
      developmentId: development.id,
      unitNumber: 'A1'
    }
  });

  if (!unit) {
    console.log('Creating test unit...');
    unit = await prisma.unit.create({
      data: {
        developmentId: development.id,
        unitNumber: 'A1',
        unitType: 'SEMI_DETACHED',
        bedrooms: 3,
        bathrooms: 2,
        parkingSpaces: 2,
        hasGarden: true,
        gardenSize: 45,
        internalArea: 120,
        externalArea: 45,
        totalArea: 165,
        listPrice: 375000,
        currentPrice: 375000,
        status: 'AVAILABLE',
        block: 'A',
        orientation: 'South',
        views: JSON.stringify(['Garden', 'Park']),
        specifications: JSON.stringify({
          kitchen: 'Fully fitted kitchen with quartz countertops',
          bathrooms: 'Luxury tiled bathrooms with rain showers',
          flooring: 'Engineered wood flooring throughout'
        })
      }
    });
    console.log('Unit created:', unit.id);
  } else {
    console.log('Using existing unit:', unit.id);
  }

  // 3. Create test buyer if doesn't exist
  let buyer = await prisma.user.findFirst({
    where: { email: 'testbuyer@example.com' }
  });

  if (!buyer) {
    console.log('Creating test buyer...');
    buyer = await prisma.user.create({
      data: {
        email: 'testbuyer@example.com',
        name: 'Test Buyer',
        role: 'BUYER',
        phoneNumber: '+353 87 123 4567',
        address: '10 Test Street, Dublin, Ireland',
        kycStatus: 'VERIFIED',
        preferredLanguage: 'en',
        bankDetails: {
          create: {
            accountName: 'Test Buyer',
            bankName: 'Bank of Ireland',
            iban: 'IE64BOFI90001234567890',
            bic: 'BOFIIE2D'
          }
        },
        buyerProfiles: {
          create: {
            isFirstTimeBuyer: true,
            hasHelpToBuy: true,
            hasApprovedMortgage: true,
            mortgageProvider: 'Bank of Ireland',
            mortgageAmount: 300000,
            depositAmount: 75000,
            preferredLocation: 'North Dublin',
            minBudget: 350000,
            maxBudget: 400000,
            bedrooms: 3,
            propertyType: 'SEMI_DETACHED',
            moveInTimeline: '6 months'
          }
        }
      }
    });
    console.log('Buyer created:', buyer.id);
  } else {
    console.log('Using existing buyer:', buyer.id);
  }

  // 4. Create transaction if doesn't exist
  let transaction = await prisma.transaction.findFirst({
    where: {
      buyerId: buyer.id,
      unitId: unit.id
    }
  });

  if (!transaction) {
    console.log('Creating test transaction...');
    const referenceNumber = `FG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    transaction = await prisma.transaction.create({
      data: {
        referenceNumber,
        buyerId: buyer.id,
        unitId: unit.id,
        developmentId: development.id,
        status: TransactionStatus.RESERVATION_PAID,
        stage: TransactionStage.RESERVATION,
        agreedPrice: unit.currentPrice,
        outstandingBalance: unit.currentPrice,
        mortgageRequired: true,
        helpToBuyUsed: true,
        referralSource: 'Website',
        gdprConsent: true,
        reservationDate: new Date(),
        events: {
          create: [
            {
              eventType: 'STATUS_CHANGE',
              description: 'Transaction created',
              metadata: {
                oldStatus: null,
                newStatus: 'ENQUIRY'
              },
              performedBy: buyer.id
            },
            {
              eventType: 'STATUS_CHANGE',
              description: 'Property viewing scheduled',
              metadata: {
                oldStatus: 'ENQUIRY',
                newStatus: 'VIEWING_SCHEDULED'
              },
              performedBy: buyer.id
            },
            {
              eventType: 'STATUS_CHANGE',
              description: 'Reservation fee paid',
              metadata: {
                oldStatus: 'VIEWING_SCHEDULED',
                newStatus: 'RESERVATION_PAID'
              },
              performedBy: buyer.id
            }
          ]
        },
        payments: {
          create: [
            {
              type: 'BOOKING_DEPOSIT',
              amount: 5000,
              currency: 'EUR',
              status: 'COMPLETED',
              method: 'BANK_TRANSFER',
              reference: `BD-${referenceNumber}`,
              description: 'Booking deposit payment',
              dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              clearedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              receiptNumber: `R-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
            }
          ]
        },
        documents: {
          create: [
            {
              name: 'Reservation Agreement',
              type: 'AGREEMENT',
              category: 'LEGAL',
              status: 'SIGNED',
              fileName: 'reservation-agreement.pdf',
              fileSize: 1024 * 1024, // 1MB
              mimeType: 'application/pdf',
              fileUrl: `/documents/${referenceNumber}/reservation-agreement.pdf`,
              uploadedBy: buyer.id
            },
            {
              name: 'ID Verification',
              type: 'IDENTIFICATION',
              category: 'IDENTIFICATION',
              status: 'APPROVED',
              fileName: 'passport.pdf',
              fileSize: 512 * 1024, // 512KB
              mimeType: 'application/pdf',
              fileUrl: `/documents/${referenceNumber}/passport.pdf`,
              uploadedBy: buyer.id
            }
          ]
        }
      }
    });
    console.log('Transaction created:', transaction.id);

    // Create pending payment for contract deposit
    console.log('Creating pending contract deposit payment...');
    await prisma.transactionPayment.create({
      data: {
        transactionId: transaction.id,
        type: 'CONTRACT_DEPOSIT',
        amount: transaction.agreedPrice * 0.1, // 10% deposit
        currency: 'EUR',
        status: 'PENDING',
        method: 'BANK_TRANSFER',
        reference: `CD-${referenceNumber}`,
        description: 'Contract deposit payment (10%)',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Due in 14 days
      }
    });

    // Create a transaction timeline
    console.log('Creating transaction timeline...');
    await prisma.transactionTimeline.create({
      data: {
        transactionId: transaction.id,
        firstContactDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        propertyViewingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        reservationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    });

    // Create transaction milestones
    console.log('Creating transaction milestones...');
    const milestones = [
      {
        name: 'Initial Enquiry',
        description: 'First contact and expression of interest',
        stage: TransactionStage.INITIAL_ENQUIRY,
        order: 1,
        status: 'COMPLETED',
        actualDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        requiredDocs: [],
        requiredPayments: []
      },
      {
        name: 'Property Viewing',
        description: 'Visit to the property',
        stage: TransactionStage.VIEWING,
        order: 2,
        status: 'COMPLETED',
        actualDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        requiredDocs: [],
        requiredPayments: []
      },
      {
        name: 'Reservation',
        description: 'Property reserved with booking deposit',
        stage: TransactionStage.RESERVATION,
        order: 3,
        status: 'COMPLETED',
        actualDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        requiredDocs: ['RESERVATION_FORM', 'IDENTIFICATION'],
        requiredPayments: ['BOOKING_DEPOSIT']
      },
      {
        name: 'Contract Signing',
        description: 'Review and sign purchase contract',
        stage: TransactionStage.CONTRACT_EXCHANGE,
        order: 4,
        status: 'IN_PROGRESS',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        requiredDocs: ['SALES_CONTRACT'],
        requiredPayments: ['CONTRACT_DEPOSIT']
      },
      {
        name: 'Mortgage Approval',
        description: 'Finalize mortgage and get approval',
        stage: TransactionStage.MORTGAGE_APPLICATION,
        order: 5,
        status: 'PENDING',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        requiredDocs: ['MORTGAGE_APPROVAL'],
        requiredPayments: []
      },
      {
        name: 'Completion',
        description: 'Final payment and ownership transfer',
        stage: TransactionStage.COMPLETION,
        order: 6,
        status: 'PENDING',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        requiredDocs: ['TITLE_DEED'],
        requiredPayments: ['FINAL_PAYMENT']
      }
    ];

    for (const milestone of milestones) {
      await prisma.transactionMilestone.create({
        data: {
          transactionId: transaction.id,
          name: milestone.name,
          description: milestone.description,
          stage: milestone.stage,
          order: milestone.order,
          status: milestone.status,
          actualDate: milestone.actualDate,
          targetDate: milestone.targetDate,
          requiredDocs: milestone.requiredDocs,
          requiredPayments: milestone.requiredPayments
        }
      });
    }
  } else {
    console.log('Using existing transaction:', transaction.id);

    // Ensure we have a pending contract deposit payment
    const contractDeposit = await prisma.transactionPayment.findFirst({
      where: {
        transactionId: transaction.id,
        type: 'CONTRACT_DEPOSIT'
      }
    });

    if (!contractDeposit) {
      console.log('Creating pending contract deposit payment...');
      await prisma.transactionPayment.create({
        data: {
          transactionId: transaction.id,
          type: 'CONTRACT_DEPOSIT',
          amount: transaction.agreedPrice * 0.1, // 10% deposit
          currency: 'EUR',
          status: 'PENDING',
          method: 'BANK_TRANSFER',
          reference: `CD-${transaction.referenceNumber}`,
          description: 'Contract deposit payment (10%)',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Due in 14 days
        }
      });
    }
  }

  console.log('Test transaction setup completed!');
  console.log('Transaction ID:', transaction.id);
  console.log('Buyer Email: testbuyer@example.com');
  console.log('To test the transaction, visit: /buyer/transactions/' + transaction.id);
}

main()
  .catch(e => {
    console.error('Error creating test data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });