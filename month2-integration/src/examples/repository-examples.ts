/**
 * Repository Usage Examples
 * 
 * This file provides examples of how to use the repository pattern in this codebase.
 * It demonstrates both SQL-based and Prisma-based repository usage, as well as the
 * unified repository pattern.
 */

// Import repositories from unified module
import {
  userRepository,
  developmentRepository,
  unitRepository,
  documentRepository,
  financialRepository,
  repositoryFactory
} from '../lib/db/unified-repository';

// Import Prisma client for transactions
import { prisma } from '../lib/db';

// Import types
import type { User, Development, Unit, Document } from '../lib/db/types';

/**
 * Basic CRUD Operations Example
 */
export async function basicCrudExample() {
  try {
    // Create a new user
    const newUser = await userRepository.create({
      email: 'example@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'BUYER',
      roles: ['BUYER'],
      status: 'ACTIVE',
      kycStatus: 'NOT_STARTED',
      twoFactorEnabled: false,
      termsAccepted: true,
      marketingConsent: false
    });
    console.log('Created user:', newUser);

    // Find a user by ID
    const user = await userRepository.findById(newUser.id);
    console.log('Found user:', user);

    // Update a user
    const updatedUser = await userRepository.update(newUser.id, {
      firstName: 'Jane',
      lastName: 'Smith'
    });
    console.log('Updated user:', updatedUser);

    // Find a user by email
    const userByEmail = await userRepository.findByEmail('example@test.com');
    console.log('Found user by email:', userByEmail);

    // Delete a user
    const deleteResult = await userRepository.delete(newUser.id);
    console.log('User deleted:', deleteResult);
  } catch (error) {
    console.error('Error in basic CRUD example:', error);
  }
}

/**
 * Development Repository Example
 */
export async function developmentRepositoryExample() {
  try {
    // Create a new development
    const newDevelopment = await developmentRepository.create({
      name: 'Example Development',
      slug: 'example-development',
      developerId: 'dev-123',
      locationId: 'loc-123',
      status: 'PLANNING',
      totalUnits: 10,
      mainImage: 'image.jpg',
      images: ['image1.jpg', 'image2.jpg'],
      description: 'Example development description',
      features: ['Feature 1', 'Feature 2'],
      amenities: ['Amenity 1', 'Amenity 2']
    });
    console.log('Created development:', newDevelopment);

    // Find developments by developer ID
    const developments = await developmentRepository.findByDeveloperId('dev-123');
    console.log('Found developments:', developments);

    // Find developments with filtering
    const filteredDevelopments = await developmentRepository.findByFilters({
      status: 'PLANNING'
    }, 1, 10);
    console.log('Filtered developments:', filteredDevelopments);

    // Get development timelines
    const timelines = await developmentRepository.getTimelines(newDevelopment.id);
    console.log('Development timelines:', timelines);
  } catch (error) {
    console.error('Error in development repository example:', error);
  }
}

/**
 * Unit Repository Example
 */
export async function unitRepositoryExample(developmentId: string) {
  try {
    // Create a new unit
    const newUnit = await unitRepository.create({
      developmentId,
      name: 'Example Unit',
      type: 'APARTMENT',
      status: 'AVAILABLE',
      price: 100000,
      size: 100,
      bedrooms: 2,
      bathrooms: 2,
      images: ['image1.jpg'],
      slug: 'example-unit',
      description: 'Example unit description'
    });
    console.log('Created unit:', newUnit);

    // Find units by development
    const units = await unitRepository.findByDevelopment(developmentId);
    console.log('Found units:', units);

    // Get rooms for a unit
    const rooms = await unitRepository.getRooms(newUnit.id);
    console.log('Unit rooms:', rooms);

    // Get customization options for a unit
    const options = await unitRepository.getCustomizationOptions(newUnit.id);
    console.log('Customization options:', options);
  } catch (error) {
    console.error('Error in unit repository example:', error);
  }
}

/**
 * Document Repository Example
 */
export async function documentRepositoryExample(unitId: string) {
  try {
    // Create a new document
    const newDocument = await documentRepository.create({
      unitId,
      name: 'Example Document',
      type: 'PDF',
      status: 'ACTIVE',
      description: 'Example document description',
      category: 'CONTRACT',
      fileUrl: 'https://example.com/doc.pdf',
      fileType: 'application/pdf',
      fileSize: 1024,
      uploadedById: 'user-123',
      uploadedByName: 'Test User',
      uploadDate: new Date(),
      version: 1
    });
    console.log('Created document:', newDocument);

    // Find documents by unit ID
    const documents = await documentRepository.findByUnitId(unitId);
    console.log('Found documents:', documents);

    // Get document details
    const documentDetails = await documentRepository.findWithDetails(newDocument.id);
    console.log('Document details:', documentDetails);
  } catch (error) {
    console.error('Error in document repository example:', error);
  }
}

/**
 * Financial Repository Example
 */
export async function financialRepositoryExample(developmentId: string) {
  try {
    // Find finance by development ID
    const finance = await financialRepository.findByDevelopmentId(developmentId);
    console.log('Found finance:', finance);

    if (finance) {
      // Calculate financial summary
      const summary = await financialRepository.calculateFinancialSummary(finance.id);
      console.log('Financial summary:', summary);
    }
  } catch (error) {
    console.error('Error in financial repository example:', error);
  }
}

/**
 * Transaction Example
 */
export async function transactionExample() {
  try {
    // Execute a transaction with unified repositories
    const result = await prisma.$transaction(async (tx) => {
      // Create repositories with transaction context
      const userRepo = new (repositoryFactory.getUserRepository().constructor)(tx);
      const devRepo = new (repositoryFactory.getDevelopmentRepository().constructor)(tx);

      // Create a user
      const user = await userRepo.create({
        email: 'transaction@example.com',
        firstName: 'Transaction',
        lastName: 'Test',
        role: 'DEVELOPER',
        roles: ['DEVELOPER'],
        status: 'ACTIVE',
        kycStatus: 'NOT_STARTED',
        twoFactorEnabled: false,
        termsAccepted: true,
        marketingConsent: false
      });

      // Create a development for that user
      const development = await devRepo.create({
        name: 'Transaction Development',
        slug: 'transaction-development',
        developerId: user.id,
        locationId: 'loc-123',
        status: 'PLANNING',
        totalUnits: 10,
        mainImage: 'image.jpg',
        images: ['image1.jpg', 'image2.jpg'],
        description: 'Development created in transaction'
      });

      return { user, development };
    });

    console.log('Transaction result:', result);
  } catch (error) {
    console.error('Error in transaction example:', error);
  }
}

// Example of async/await usage
export async function runAllExamples() {
  const userId = 'user-123';
  const developmentId = 'dev-123';
  const unitId = 'unit-123';

  await basicCrudExample();
  await developmentRepositoryExample();
  await unitRepositoryExample(developmentId);
  await documentRepositoryExample(unitId);
  await financialRepositoryExample(developmentId);
  await transactionExample();
}