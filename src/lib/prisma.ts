/**
 * Prisma Client Global Instance
 * Singleton pattern to avoid multiple connections in development
 */

import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient with development logging
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Use a global variable to store the client in development
declare global {
   
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Create or reuse the client
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Store the client in global in development
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;
export { prisma };