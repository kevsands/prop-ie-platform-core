// Export all repository implementations
export * from './base-repository';
export * from './user-repository';
export * from './development-repository';
export * from './unit-repository';
export * from './document-repository';
export * from './financial-repository';

// Import repositories for singleton instances
import { UserRepository } from './user-repository';
import { DevelopmentRepository } from './development-repository';
import { UnitRepository } from './unit-repository';
import { DocumentRepository } from './document-repository';
import { FinancialRepository } from './financial-repository';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../index';

// Create singleton instances for each repository type
export const userRepository = new UserRepository();
export const developmentRepository = new DevelopmentRepository();
export const unitRepository = new UnitRepository();
export const documentRepository = new DocumentRepository();
export const financialRepository = new FinancialRepository();

// Repository registry
const repositories = {
  user: UserRepository,
  development: DevelopmentRepository,
  unit: UnitRepository,
  document: DocumentRepository,
  financial: FinancialRepository};

type RepositoryType = keyof typeof repositories;

/**
 * Factory function to get repository instance
 * @param type Repository type to get
 * @returns Repository instance
 */
export function getRepository<T extends RepositoryType>(type: T): InstanceType<typeof repositories[T]> {
  const RepositoryClass = repositories[type];
  return new RepositoryClass() as InstanceType<typeof repositories[T]>\n  );
}

/**
 * Factory function to create a transaction context with all repositories
 * @returns Object with repositories that share the same transaction
 */
export async function createTransactionContext() {
  return prisma.$transaction(async (tx) => {
    return {
      users: new UserRepository(tx),
      developments: new DevelopmentRepository(tx),
      units: new UnitRepository(tx),
      documents: new DocumentRepository(tx),
      financials: new FinancialRepository(tx)};
  });
}

// Export default with all repository instances
export default {
  userRepository,
  developmentRepository,
  unitRepository,
  documentRepository,
  financialRepository
};