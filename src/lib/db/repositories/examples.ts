/**
 * Examples of using the Prisma repositories
 * These examples show how to use the repositories in different scenarios
 */

import { getRepository, createTransactionContext } from './index';
import { prisma } from '../index';

/**
 * Example of getting a user by email
 */
export async function findUserByEmail(email: string) {
  const userRepository = getRepository('user');
  
  try {
    const user = await userRepository.findByEmail(email);
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Example of adding a user with permissions
 */
export async function createUserWithPermissions(userData: any, permissions: Array<{ resource: string, action: string }>) {
  // Use a transaction to ensure all operations succeed or fail together
  return prisma.$transaction(async (tx) => {
    // Create repositories with the transaction context
    const userRepository = getRepository('user');
    
    // Create the user
    const user = await userRepository.create(userData);
    
    // Add permissions
    for (const permission of permissions) {
      await userRepository.addPermission(
        user.id, 
        permission.resource, 
        permission.action
      );
    }
    
    // Return the user with permissions
    return await userRepository.findWithPermissions(user.id);
  });
}

/**
 * Example of creating a development with units
 */
export async function createDevelopmentWithUnits(developmentData: any, unitsData: any[]) {
  // Use a transaction context that provides all repositories
  const tx = await createTransactionContext();
  
  try {
    // Create the development
    const development = await tx.developments.create(developmentData);
    
    // Create units with the development ID
    const units = [];
    for (const unitData of unitsData) {
      unitData.developmentId = development.id;
      const unit = await tx.units.create(unitData);
      units.push(unit);
    }
    
    // Return the development with units
    return { development, units };
  } catch (error) {
    console.error('Error creating development with units:', error);
    throw error;
  }
}

/**
 * Example of finding developments with filters and pagination
 */
export async function findDevelopments(params: any = {}) {
  const developmentRepository = getRepository('development');
  
  try {
    const { status, skip, take, orderBy } = params;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }
    
    const developments = await developmentRepository.findAll({
      where,
      skip: skip || 0,
      take: take || 10,
      orderBy: orderBy || { created: 'desc' }
    });
    
    return developments;
  } catch (error) {
    console.error('Error finding developments:', error);
    throw error;
  }
}

/**
 * Example of finding units by development with full details
 */
export async function findUnitsByDevelopment(developmentId: string) {
  const unitRepository = getRepository('unit');
  
  try {
    // Find units for the development
    const units = await unitRepository.findByDevelopmentId(developmentId);
    
    // Get full details for each unit including rooms and customization options
    const unitsWithDetails = await Promise.all(
      units.map(unit => unitRepository.findWithFullDetails(unit.id))
    );
    
    return unitsWithDetails;
  } catch (error) {
    console.error('Error finding units by development:', error);
    throw error;
  }
}

/**
 * Example of working with documents
 */
export async function addDocumentToUnit(unitId: string, documentData: any) {
  const documentRepository = getRepository('document');
  
  try {
    // Set the unit ID in the document data
    documentData.unitId = unitId;
    
    // Create the document
    const document = await documentRepository.create(documentData);
    
    return document;
  } catch (error) {
    console.error('Error adding document to unit:', error);
    throw error;
  }
}

/**
 * Example of using the financial repository
 */
export async function calculateDevelopmentFinancials(developmentId: string) {
  const financialRepository = getRepository('financial');
  
  try {
    // Get the finance record for the development
    const finance = await financialRepository.findByDevelopmentId(developmentId);
    
    if (!finance) {
      throw new Error('No financial record found for this development');
    }
    
    // Calculate financial summary
    const summary = await financialRepository.calculateFinancialSummary(finance.id);
    
    return summary;
  } catch (error) {
    console.error('Error calculating development financials:', error);
    throw error;
  }
}