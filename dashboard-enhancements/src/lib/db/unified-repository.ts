/**
 * Unified Repository Pattern
 * 
 * This file provides a unified approach to repositories that works with both SQL and Prisma.
 * It serves as a bridge between the two implementations and allows gradual migration.
 */

import { PrismaClient } from '@prisma/client';
import { prisma } from './index';
import { logger } from '../security/auditLogger';

// Import SQL-based repositories
import {
  userRepository as sqlUserRepository,
  developmentRepository as sqlDevelopmentRepository,
  unitRepository as sqlUnitRepository,
  documentRepository as sqlDocumentRepository,
  financialRepository as sqlFinancialRepository
} from './repositories';

// Import Prisma-based repositories
import { UserRepository as PrismaUserRepository } from './repositories/user-repository';
import { DevelopmentRepository as PrismaDevelopmentRepository } from './repositories/development-repository';
import { UnitRepository as PrismaUnitRepository } from './repositories/unit-repository';
import { DocumentRepository as PrismaDocumentRepository } from './repositories/document-repository';
import { FinancialRepository as PrismaFinancialRepository } from './repositories/financial-repository';

// Environment-based selection
const USE_PRISMA = process.env.USE_PRISMA === 'true';

/**
 * Create singleton instances based on environment configuration
 */
export const repositoryFactory = {
  /**
   * Get the appropriate User repository based on configuration
   */
  getUserRepository() {
    if (USE_PRISMA) {
      logger.info('Using Prisma User Repository');
      return new PrismaUserRepository(prisma);
    } else {
      logger.info('Using SQL User Repository');
      return sqlUserRepository;
    }
  },

  /**
   * Get the appropriate Development repository based on configuration
   */
  getDevelopmentRepository() {
    if (USE_PRISMA) {
      logger.info('Using Prisma Development Repository');
      return new PrismaDevelopmentRepository(prisma);
    } else {
      logger.info('Using SQL Development Repository');
      return sqlDevelopmentRepository;
    }
  },

  /**
   * Get the appropriate Unit repository based on configuration
   */
  getUnitRepository() {
    if (USE_PRISMA) {
      logger.info('Using Prisma Unit Repository');
      return new PrismaUnitRepository(prisma);
    } else {
      logger.info('Using SQL Unit Repository');
      return sqlUnitRepository;
    }
  },

  /**
   * Get the appropriate Document repository based on configuration
   */
  getDocumentRepository() {
    if (USE_PRISMA) {
      logger.info('Using Prisma Document Repository');
      return new PrismaDocumentRepository(prisma);
    } else {
      logger.info('Using SQL Document Repository');
      return sqlDocumentRepository;
    }
  },

  /**
   * Get the appropriate Financial repository based on configuration
   */
  getFinancialRepository() {
    if (USE_PRISMA) {
      logger.info('Using Prisma Financial Repository');
      return new PrismaFinancialRepository(prisma);
    } else {
      logger.info('Using SQL Financial Repository');
      return sqlFinancialRepository;
    }
  }
};

// Create singleton instances
export const userRepository = repositoryFactory.getUserRepository();
export const developmentRepository = repositoryFactory.getDevelopmentRepository();
export const unitRepository = repositoryFactory.getUnitRepository();
export const documentRepository = repositoryFactory.getDocumentRepository();
export const financialRepository = repositoryFactory.getFinancialRepository();

// Export default with all repository instances
export default {
  userRepository,
  developmentRepository,
  unitRepository,
  documentRepository,
  financialRepository
};