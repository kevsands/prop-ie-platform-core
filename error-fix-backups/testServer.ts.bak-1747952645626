// Test Server Setup Utility
import express from 'express';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import websocketService from '@/services/websocketService';

export async function setupTestServer() {
  const app = express();
  app.use(express.json());
  
  // Mock authentication middleware for tests
  app.use((req: NextApiRequest, res: NextApiResponse, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Mock token validation for tests
      req.user = {
        id: 'test-user-123',
        role: 'BUYER',
        email: 'test@example.com'
      };
    }
    next();
  });

  // Add API routes
  app.use('/api/auth', require('@/app/api/auth/route'));
  app.use('/api/transactions', require('@/app/api/transactions/route'));
  app.use('/api/documents', require('@/app/api/documents/route'));
  app.use('/api/payments', require('@/app/api/payments/route'));
  app.use('/api/analytics', require('@/app/api/analytics/route'));
  app.use('/api/notifications', require('@/app/api/notifications/route'));

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize WebSocket for tests
  websocketService.initialize(httpServer);

  // Start server
  await new Promise<void>((resolve) => {
    httpServer.listen(0, () => {
      console.log(`Test server running on port ${httpServer.address().port}`);
      resolve();
    });
  });

  return httpServer;
}

export async function setupTestDatabase() {
  const prisma = new PrismaClient();

  // Clear test database
  await prisma.$executeRaw`TRUNCATE TABLE "Transaction" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Development" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Unit" CASCADE`;

  return prisma;
}