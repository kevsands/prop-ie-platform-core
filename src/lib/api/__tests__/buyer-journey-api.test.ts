import { buyerJourneyApi } from '../buyer-journey-api';
import { ErrorFactory } from '@/lib/errors/buyer-journey-errors';
import { unitReservationSchema } from '@/lib/validation/buyer-journey';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()},
  writable: true});

describe('buyerJourneyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUnit', () => {
    it('should fetch a unit by ID', async () => {
      const mockUnit = {
        id: 'unit-123',
        developmentId: 'dev-123',
        type: 'APARTMENT',
        bedrooms: 2,
        status: 'AVAILABLE'};

      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUnit)});

      const result = await buyerJourneyApi.getUnit('unit-123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/units?id=unit-123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'})})
      );

      expect(result).toEqual(mockUnit);
    });

    it('should handle network errors', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(buyerJourneyApi.getUnit('unit-123')).rejects.toThrow('Connection issue');
    });

    it('should handle API errors', async () => {
      // Mock API error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({ error: 'Unit not found' })});

      await expect(buyerJourneyApi.getUnit('unit-123')).rejects.toThrow('Resource not found');
    });
  });

  describe('createReservation', () => {
    const validReservationData = {
      unitId: 'unit-123',
      developmentId: 'dev-123',
      buyerId: 'user-123',
      agreedPrice: 385000,
      mortgageRequired: true,
      helpToBuyUsed: false};

    it('should create a reservation with valid data', async () => {
      const mockTransaction = {
        id: 'transaction-123',
        ...validReservationData,
        status: 'INITIATED',
        createdAt: '2023-01-01T00:00:00Z'};

      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          data: mockTransaction})});

      const result = await buyerJourneyApi.createReservation(validReservationData);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/transactions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'}),
          body: JSON.stringify(validReservationData)})
      );

      expect(result).toEqual(mockTransaction);
    });

    it('should validate input data', async () => {
      const invalidData = {
        unitId: 'unit-123',
        // Missing required fields
      };

      // This should fail validation before even making the API call
      await expect(buyerJourneyApi.createReservation(invalidData as any)).rejects.toThrow();

      // Fetch should not be called because validation failed
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('getKYCStatus', () => {
    it('should fetch the KYC status for a user', async () => {
      const mockStatus = {
        verified: true,
        userId: 'user-123',
        verificationDate: '2023-01-01T00:00:00Z'};

      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockStatus)});

      const result = await buyerJourneyApi.getKYCStatus('user-123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/kyc/status',
        expect.any(Object)
      );

      expect(result).toEqual(mockStatus);
    });

    it('should handle authentication errors', async () => {
      // Mock authentication error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValueOnce({ error: 'Authentication required' })});

      // Mock token refresh attempt that also fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid refresh token' })});

      await expect(buyerJourneyApi.getKYCStatus('user-123')).rejects.toThrow('Unauthorized');
    });
  });

  describe('processDeposit', () => {
    const validPaymentData = {
      transactionId: 'transaction-123',
      amount: 1000,
      paymentMethod: 'credit_card' as const,
      billingDetails: {
        name: 'Test User',
        email: 'test@example.com',
        addressLine1: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'};

    it('should process a deposit payment', async () => {
      const mockPayment = {
        id: 'payment-123',
        transactionId: 'transaction-123',
        amount: 1000,
        status: 'COMPLETED',
        createdAt: '2023-01-01T00:00:00Z'};

      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPayment)});

      const result = await buyerJourneyApi.processDeposit(validPaymentData);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/transactions/${validPaymentData.transactionId}/payments`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(validPaymentData)})
      );

      expect(result).toEqual(mockPayment);
    });

    it('should handle payment processing errors', async () => {
      // Mock payment error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: jest.fn().mockResolvedValueOnce({
          error: 'Payment failed',
          fieldErrors: {
            'billingDetails.cardNumber': ['Invalid card number']})});

      await expect(buyerJourneyApi.processDeposit(validPaymentData)).rejects.toThrow('Validation failed');
    });
  });

  describe('token refresh mechanism', () => {
    const mockUnit = { id: 'unit-123' };

    it('should attempt to refresh token on 401 responses', async () => {
      // Mock token values
      window.localStorage.getItem = jest.fn()
        .mockReturnValueOnce('old-token') // For initial request
        .mockReturnValueOnce('refresh-token') // For refresh attempt
        .mockReturnValueOnce('new-token'); // For retry request

      // First request fails with 401
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValueOnce({ error: 'Token expired' })});

      // Token refresh succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          token: 'new-token',
          refreshToken: 'new-refresh-token'})});

      // Retry with new token succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUnit)});

      const result = await buyerJourneyApi.getUnit('unit-123');

      // Should have made 3 fetch calls
      expect(global.fetch).toHaveBeenCalledTimes(3);

      // First call - original request with old token
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        '/api/units?id=unit-123',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer old-token'})})
      );

      // Second call - token refresh
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        '/api/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: 'refresh-token' })})
      );

      // Third call - retry with new token
      expect(global.fetch).toHaveBeenNthCalledWith(
        3,
        '/api/units?id=unit-123',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer new-token'})})
      );

      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');

      expect(result).toEqual(mockUnit);
    });

    it('should handle failed token refresh', async () => {
      // Mock token values
      window.localStorage.getItem = jest.fn()
        .mockReturnValueOnce('old-token') // For initial request
        .mockReturnValueOnce('refresh-token'); // For refresh attempt

      // First request fails with 401
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValueOnce({ error: 'Token expired' })});

      // Token refresh fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid refresh token' })});

      await expect(buyerJourneyApi.getUnit('unit-123')).rejects.toThrow('Unauthorized');

      // Should have made 2 fetch calls
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Should have cleared invalid tokens
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });
});