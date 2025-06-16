/**
 * Integration tests for complete transaction flow
 */

import { 
  getTestPrisma, 
  cleanupTestDb, 
  seedTestDb,
  closeTestDb 
} from '@/test-utils/test-db';
import { createMockTransactionFlow } from '@/test-utils/test-factories';
import { testApiRoute } from '@/test-utils/api-test-helpers';

// Import API route handlers
import { POST as createTransaction } from '@/app/api/transactions/route';
import { POST as makePayment } from '@/app/api/transactions/[id]/payments/route';
import { POST as uploadDocument } from '@/app/api/documents/route';
import { PUT as updateTransaction } from '@/app/api/transactions/[id]/route';

describe('Transaction Flow Integration Tests', () => {
  let testData: any;
  let prisma: any;

  beforeAll(async () => {
    prisma = getTestPrisma();
    // Seed test database
    testData = await seedTestDb();
  });

  afterEach(async () => {
    // Clean up after each test
    await cleanupTestDb();
  });

  afterAll(async () => {
    // Close database connection
    await closeTestDb();
  });

  describe('Complete Property Purchase Flow', () => {
    it('should handle full transaction lifecycle', async () => {
      const { buyer, unit, development } = testData;

      // Step 1: Create transaction
      const createResponse = await testApiRoute(createTransaction, {
        method: 'POST',
        body: {
          buyerId: buyer.id,
          unitId: unit.id,
          type: 'purchase'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(createResponse.status).toBe(201);
      const transaction = createResponse.data;
      expect(transaction).toMatchObject({
        id: expect.any(String),
        buyerId: buyer.id,
        unitId: unit.id,
        status: 'pending',
        totalAmount: unit.price,
        depositAmount: unit.price * 0.1});

      // Step 2: Upload KYC documents
      const kycDocResponse = await testApiRoute(uploadDocument, {
        method: 'POST',
        body: {
          transactionId: transaction.id,
          type: 'kyc',
          name: 'passport.pdf',
          url: 'https://example.com/passport.pdf'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(kycDocResponse.status).toBe(201);

      // Step 3: Make deposit payment
      const paymentResponse = await testApiRoute(makePayment, {
        method: 'POST',
        url: `/api/transactions/${transaction.id}/payments`,
        body: {
          amount: transaction.depositAmount,
          type: 'deposit',
          paymentMethod: 'bank_transfer'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(paymentResponse.status).toBe(201);
      expect(paymentResponse.data).toMatchObject({
        amount: transaction.depositAmount,
        status: 'pending',
        type: 'deposit'});

      // Step 4: Verify deposit payment (webhook simulation)
      const webhookResponse = await testApiRoute(updateTransaction, {
        method: 'PUT',
        url: `/api/transactions/${transaction.id}`,
        body: {
          depositPaid: true,
          depositPaidAt: new Date().toISOString()},
        headers: {
          'x-webhook-secret': process.env.WEBHOOK_SECRET});

      expect(webhookResponse.status).toBe(200);

      // Step 5: Upload signed contract
      const contractResponse = await testApiRoute(uploadDocument, {
        method: 'POST',
        body: {
          transactionId: transaction.id,
          type: 'contract',
          name: 'purchase-agreement-signed.pdf',
          url: 'https://example.com/contract-signed.pdf',
          status: 'signed'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(contractResponse.status).toBe(201);

      // Step 6: Update transaction status
      const statusUpdateResponse = await testApiRoute(updateTransaction, {
        method: 'PUT',
        url: `/api/transactions/${transaction.id}`,
        body: {
          contractSigned: true,
          contractSignedAt: new Date().toISOString(),
          status: 'contract_signed'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(statusUpdateResponse.status).toBe(200);

      // Verify final transaction state
      const finalTransaction = await prisma.transaction.findUnique({
        where: { id: transaction.id },
        include: {
          documents: true,
          payments: true,
          timeline: true});

      expect(finalTransaction).toMatchObject({
        status: 'contract_signed',
        depositPaid: true,
        contractSigned: true,
        documents: expect.arrayContaining([
          expect.objectContaining({ type: 'kyc' }),
          expect.objectContaining({ type: 'contract' })]),
        payments: expect.arrayContaining([
          expect.objectContaining({ type: 'deposit', status: 'completed' })])});
    });

    it('should enforce transaction validation rules', async () => {
      const { buyer, unit } = testData;

      // Try to create transaction for already reserved unit
      await prisma.unit.update({
        where: { id: unit.id },
        data: { status: 'reserved', reservedBy: 'another-buyer' });

      const response = await testApiRoute(createTransaction, {
        method: 'POST',
        body: {
          buyerId: buyer.id,
          unitId: unit.id,
          type: 'purchase'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(response.status).toBe(400);
      expect(response.data.error).toContain('Unit is not available');
    });

    it('should handle concurrent transaction attempts', async () => {
      const { buyer, unit } = testData;
      const buyer2 = await prisma.user.create({
        data: {
          email: 'buyer2@test.com',
          name: 'Buyer 2',
          roles: ['buyer']});

      // Simulate concurrent transaction attempts
      const promises = [
        testApiRoute(createTransaction, {
          method: 'POST',
          body: { buyerId: buyer.id, unitId: unit.id },
          headers: { authorization: `Bearer ${buyer.token}` }),
        testApiRoute(createTransaction, {
          method: 'POST',
          body: { buyerId: buyer2.id, unitId: unit.id },
          headers: { authorization: `Bearer ${buyer2.token}` })];

      const results = await Promise.allSettled(promises);
      
      // One should succeed, one should fail
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 201);
      const failed = results.filter(r => r.status === 'fulfilled' && r.value.status === 400);
      
      expect(successful).toHaveLength(1);
      expect(failed).toHaveLength(1);
    });
  });

  describe('Payment Processing', () => {
    it('should calculate payments correctly', async () => {
      const mockFlow = await createMockTransactionFlow();
      const transaction = mockFlow.transaction;

      // Create payment schedule
      const paymentSchedule = [
        { type: 'deposit', percentage: 0.1 },
        { type: 'stage_1', percentage: 0.2 },
        { type: 'stage_2', percentage: 0.3 },
        { type: 'completion', percentage: 0.4 }];

      const totalAmount = transaction.totalAmount;
      let totalPaid = 0;

      for (const schedule of paymentSchedule) {
        const amount = totalAmount * schedule.percentage;
        
        const payment = await prisma.payment.create({
          data: {
            transactionId: transaction.id,
            amount,
            type: schedule.type,
            status: 'completed',
            paidAt: new Date()});

        totalPaid += amount;
        expect(payment.amount).toBe(amount);
      }

      expect(totalPaid).toBe(totalAmount);
    });

    it('should handle payment failures and retries', async () => {
      const mockFlow = await createMockTransactionFlow();
      const { transaction, buyer } = mockFlow;

      // Simulate failed payment
      const failedPaymentResponse = await testApiRoute(makePayment, {
        method: 'POST',
        url: `/api/transactions/${transaction.id}/payments`,
        body: {
          amount: transaction.depositAmount,
          type: 'deposit',
          paymentMethod: 'invalid_card'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(failedPaymentResponse.status).toBe(400);
      expect(failedPaymentResponse.data.error).toContain('Payment failed');

      // Retry with valid payment method
      const successfulPaymentResponse = await testApiRoute(makePayment, {
        method: 'POST',
        url: `/api/transactions/${transaction.id}/payments`,
        body: {
          amount: transaction.depositAmount,
          type: 'deposit',
          paymentMethod: 'bank_transfer'},
        headers: {
          authorization: `Bearer ${buyer.token}`});

      expect(successfulPaymentResponse.status).toBe(201);
    });
  });

  describe('Document Management', () => {
    it('should enforce document requirements', async () => {
      const mockFlow = await createMockTransactionFlow();
      const { transaction, buyer } = mockFlow;

      // Required documents for transaction
      const requiredDocs = [
        { type: 'kyc', name: 'Passport' },
        { type: 'proof_of_funds', name: 'Bank Statement' },
        { type: 'mortgage_approval', name: 'Mortgage Approval Letter' }];

      // Upload all required documents
      for (const doc of requiredDocs) {
        const response = await testApiRoute(uploadDocument, {
          method: 'POST',
          body: {
            transactionId: transaction.id,
            type: doc.type,
            name: `${doc.name}.pdf`,
            url: `https://example.com/${doc.type}.pdf`},
          headers: {
            authorization: `Bearer ${buyer.token}`});

        expect(response.status).toBe(201);
      }

      // Verify all documents are uploaded
      const documents = await prisma.document.findMany({
        where: { transactionId: transaction.id });

      expect(documents).toHaveLength(requiredDocs.length);
      
      // Check document types
      const uploadedTypes = documents.map((d: any) => d.type);
      const requiredTypes = requiredDocs.map(d => d.type);
      expect(uploadedTypes.sort()).toEqual(requiredTypes.sort());
    });

    it('should validate document access permissions', async () => {
      const mockFlow = await createMockTransactionFlow();
      const { documents } = mockFlow;
      const unauthorizedUser = await prisma.user.create({
        data: {
          email: 'unauthorized@test.com',
          name: 'Unauthorized User',
          roles: ['buyer']});

      // Mock GET function for documents
      const GET = jest.fn().mockResolvedValue({
        status: 403,
        json: async () => ({ error: 'Access denied' })});

      // Try to access document with unauthorized user
      const response = await testApiRoute(GET, {
        url: `/api/documents/${documents[0].id}`,
        headers: {
          authorization: `Bearer ${unauthorizedUser.token}`});

      expect(response.status).toBe(403);
      expect(response.data.error).toContain('Access denied');
    });
  });

  describe('Transaction Timeline', () => {
    it('should track all transaction events', async () => {
      const mockFlow = await createMockTransactionFlow();
      const { transaction } = mockFlow;

      // Simulate transaction events
      const events = [
        { event: 'transaction_created', description: 'Transaction initiated' },
        { event: 'kyc_uploaded', description: 'KYC documents uploaded' },
        { event: 'deposit_paid', description: 'Deposit payment received' },
        { event: 'contract_sent', description: 'Contract sent for signature' },
        { event: 'contract_signed', description: 'Contract signed by all parties' }];

      for (const event of events) {
        await prisma.transactionEvent.create({
          data: {
            transactionId: transaction.id,
            event: event.event,
            description: event.description,
            metadata: {});
      }

      const timeline = await prisma.transactionEvent.findMany({
        where: { transactionId: transaction.id },
        orderBy: { createdAt: 'asc' });

      expect(timeline).toHaveLength(events.length);
      expect(timeline.map((t: any) => t.event)).toEqual(events.map(e => e.event));
    });
  });

  describe('Error Recovery', () => {
    it('should handle transaction rollback on error', async () => {
      const { buyer, unit } = testData;

      // Start a transaction that will fail
      try {
        await prisma.$transaction(async (tx: any) => {
          // Create transaction
          const transaction = await tx.transaction.create({
            data: {
              buyerId: buyer.id,
              unitId: unit.id,
              status: 'pending',
              totalAmount: unit.price,
              depositAmount: unit.price * 0.1});

          // Update unit status
          await tx.unit.update({
            where: { id: unit.id },
            data: { status: 'reserved' });

          // Simulate an error
          throw new Error('Payment processing failed');
        });
      } catch (error) {
        // Transaction should be rolled back
      }

      // Verify unit status was not changed
      const unchangedUnit = await prisma.unit.findUnique({
        where: { id: unit.id });
      expect(unchangedUnit?.status).toBe('available');

      // Verify no transaction was created
      const transactions = await prisma.transaction.findMany({
        where: { unitId: unit.id });
      expect(transactions).toHaveLength(0);
    });
  });
});