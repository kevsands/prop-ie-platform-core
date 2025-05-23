// Test Data Generator
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function generateTestData(prisma: PrismaClient) {
  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Buyer',
      roles: [UserRole.BUYER],
      phone: '+353123456789',
      status: 'ACTIVE'
    }
  });

  const seller = await prisma.user.create({
    data: {
      email: 'seller@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Seller',
      roles: [UserRole.BUYER], // Sellers are also buyers in the system
      phone: '+353987654321',
      status: 'ACTIVE'
    }
  });

  const developer = await prisma.user.create({
    data: {
      email: 'developer@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Developer',
      roles: [UserRole.DEVELOPER],
      organization: 'Test Developments Ltd',
      position: 'Developer',
      status: 'ACTIVE'
    }
  });

  const solicitor = await prisma.user.create({
    data: {
      email: 'solicitor@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Solicitor',
      roles: [UserRole.SOLICITOR],
      organization: 'Test Legal Services',
      position: 'Solicitor',
      status: 'ACTIVE'
    }
  });

  const agent = await prisma.user.create({
    data: {
      email: 'agent@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Agent',
      roles: [UserRole.AGENT],
      organization: 'Test Estate Agency',
      position: 'Estate Agent',
      status: 'ACTIVE'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Admin',
      roles: [UserRole.ADMIN],
      status: 'ACTIVE'
    }
  });

  // Create test development
  const development = await prisma.development.create({
    data: {
      name: 'Test Gardens',
      developer: {
        connect: { id: developer.id }
      },
      location: {
        create: {
          address1: '123 Test Street',
          city: 'Dublin',
          county: 'Dublin',
          country: 'Ireland',
          eircode: 'D01 AB12'
        }
      },
      description: 'A test development for integration tests',
      totalUnits: 100,
      availableUnits: 95,
      status: DevelopmentStatus.SELLING,
      publishedDate: new Date(),
      isPublished: true,
      startDate: new Date(),
      completionDate: new Date(Date.now() + 31536000000), // 1 year from now
      Amenity: {
        createMany: {
          data: [
            { name: 'Parking', description: 'Secure parking' },
            { name: 'Garden', description: 'Communal garden' },
            { name: 'Security', description: '24/7 security' }
          ]
        }
      },
      tags: ['New Build', 'Luxury', 'Dublin']
    }
  });

  // Create test units
  const unit = await prisma.unit.create({
    data: {
      developmentId: development.id,
      unitNumber: '101',
      name: 'Apartment 101',
      type: 'APARTMENT',
      floor: 1,
      bedrooms: 2,
      bathrooms: 2,
      floors: 1,
      parkingSpaces: 1,
      size: 85,
      basePrice: 500000,
      price: 500000,
      status: 'AVAILABLE',
      berRating: 'A2',
      features: ['Balcony', 'Parking Space'],
      primaryImage: 'https://example.com/unit-101.jpg',
      images: ['https://example.com/unit-101-1.jpg', 'https://example.com/unit-101-2.jpg'],
      floorplans: ['https://example.com/floorplan-101.pdf']
    }
  });

  const anotherUnit = await prisma.unit.create({
    data: {
      developmentId: development.id,
      unitNumber: '102',
      name: 'Apartment 102',
      type: 'APARTMENT',
      floor: 1,
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      parkingSpaces: 1,
      size: 105,
      basePrice: 600000,
      price: 600000,
      status: 'AVAILABLE',
      berRating: 'A2',
      features: ['Balcony', 'Parking Space', 'Storage'],
      primaryImage: 'https://example.com/unit-102.jpg',
      images: ['https://example.com/unit-102-1.jpg', 'https://example.com/unit-102-2.jpg'],
      floorplans: ['https://example.com/floorplan-102.pdf']
    }
  });

  // Create test transaction
  const transaction = await prisma.transaction.create({
    data: {
      referenceNumber: `TX-${Date.now()}`,
      unitId: unit.id,
      buyerId: buyer.id,
      developmentId: development.id,
      agentId: agent.id,
      solicitorId: solicitor.id,
      status: 'SALE_AGREED',
      stage: 'CONTRACT_EXCHANGE',
      type: 'PURCHASE',
      agreedPrice: 500000,
      depositPaid: 50000,
      totalPaid: 50000,
      mortgageRequired: true,
      mortgageAmount: 400000,
      mortgageApproved: false,
      helpToBuyUsed: false,
      reservationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
      tags: ['First-Time Buyer', 'Priority']
    }
  });

  // Create transaction events
  await prisma.transactionEvent.createMany({
    data: [
      {
        transactionId: transaction.id,
        eventType: 'STATUS_CHANGE',
        description: 'Transaction created',
        performedBy: agent.id,
        metadata: { previousStatus: null, newStatus: 'ENQUIRY' }
      },
      {
        transactionId: transaction.id,
        eventType: 'OFFER_MADE',
        description: 'Offer made for €500,000',
        performedBy: buyer.id,
        metadata: { offeredPrice: 500000 }
      },
      {
        transactionId: transaction.id,
        eventType: 'OFFER_ACCEPTED',
        description: 'Offer accepted',
        performedBy: developer.id,
        metadata: { acceptedPrice: 500000 }
      },
      {
        transactionId: transaction.id,
        eventType: 'STATUS_CHANGE',
        description: 'Sale agreed at €500,000',
        performedBy: agent.id,
        metadata: { previousStatus: 'OFFER_ACCEPTED', newStatus: 'SALE_AGREED', agreedPrice: 500000 }
      }
    ]
  });

  // Create test documents
  const document = await prisma.document.create({
    data: {
      name: 'Purchase Agreement Draft',
      description: 'Draft purchase agreement for review',
      type: 'CONTRACT',
      status: 'PENDING',
      category: 'LEGAL',
      fileUrl: `https://example.com/documents/${transaction.id}/purchase-agreement-draft.pdf`,
      fileType: 'application/pdf',
      fileSize: 1024 * 50, // 50KB
      uploadedById: solicitor.id,
      uploadedByName: `${solicitor.firstName} ${solicitor.lastName}`,
      version: 1,
      tags: ['Contract', 'Draft'],
      signatureRequired: true,
      developmentId: development.id,
      unitId: unit.id
    }
  });

  // Create test payment
  const payment = await prisma.transactionPayment.create({
    data: {
      transactionId: transaction.id,
      amount: 50000,
      type: 'BOOKING_DEPOSIT',
      method: 'BANK_TRANSFER',
      status: 'COMPLETED',
      reference: `PMT-${Date.now()}`,
      fromAccount: 'XXXX-XXXX-XXXX-1234',
      toAccount: 'XXXX-XXXX-XXXX-5678',
      description: 'Initial booking deposit payment',
      paidDate: new Date(),
      clearedDate: new Date(),
      receiptUrl: `https://example.com/receipts/${transaction.id}/deposit.pdf`
    }
  });

  return {
    buyer,
    seller,
    developer,
    solicitor,
    agent,
    admin,
    development,
    unit,
    anotherUnit,
    transaction,
    document,
    payment
  };
}

export async function cleanupTestData(prisma: PrismaClient, testData: any) {
  // Delete in reverse order of dependencies
  await prisma.transactionPayment.deleteMany({
    where: { transactionId: testData.transaction.id }
  });
  
  await prisma.document.deleteMany({
    where: { 
      OR: [
        { developmentId: testData.development.id },
        { unitId: { in: [testData.unit.id, testData.anotherUnit.id] } }
      ]
    }
  });
  
  await prisma.transactionEvent.deleteMany({
    where: { transactionId: testData.transaction.id }
  });
  
  await prisma.transaction.deleteMany({
    where: { id: testData.transaction.id }
  });
  
  await prisma.unit.deleteMany({
    where: { developmentId: testData.development.id }
  });
  
  // Delete amenities related to the development
  await prisma.amenity.deleteMany({
    where: { developmentId: testData.development.id }
  });
  
  await prisma.development.deleteMany({
    where: { id: testData.development.id }
  });
  
  // Delete any locations created for the development
  await prisma.location.deleteMany({
    where: { developments: { none: {} } }
  });
  
  await prisma.user.deleteMany({
    where: {
      id: {
        in: [
          testData.buyer.id,
          testData.seller.id,
          testData.developer.id,
          testData.solicitor.id,
          testData.agent.id,
          testData.admin.id
        ]
      }
    }
  });
}