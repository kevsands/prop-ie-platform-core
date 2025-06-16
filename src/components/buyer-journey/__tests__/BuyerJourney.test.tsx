import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BuyerJourney } from '../BuyerJourney';
import { useAuth } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { buyerJourneyApi } from '@/lib/api/buyer-journey-api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: jest.fn()};
  }));

// Mock auth context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn()}));

// Mock KYC verification component
jest.mock('@/components/kyc/KYCVerification', () => ({
  KYCVerification: jest.fn(({ onComplete }) => (
    <div data-testid="kyc-verification">
      <button onClick={onComplete}>Complete Verification</button>
    </div>
  ))}));

// Mock API
jest.mock('@/lib/api/buyer-journey-api', () => ({
  buyerJourneyApi: {
    getKYCStatus: jest.fn(),
    startKYCVerification: jest.fn(),
    createReservation: jest.fn(),
    processDeposit: jest.fn()},
  buyerJourneyQueryKeys: {
    kycStatus: jest.fn().mockReturnValue(['kyc', 'status']),
    units: jest.fn().mockReturnValue(['units']),
    unit: jest.fn().mockReturnValue(['unit']),
    transaction: jest.fn().mockReturnValue(['transaction']),
    reservations: jest.fn().mockReturnValue(['reservations'])}));

// Mock unit data
const mockUnit = {
  key: 'unit-123',
  name: '2 Bed Apartment',
  price: '€385,000',
  bedrooms: 2,
  bathrooms: 2,
  area: '75 sq.m',
  features: ['Balcony', 'En-suite'],
  available: 4};

describe('BuyerJourney', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false});

    // Reset mocks
    jest.clearAllMocks();

    // Mock unauthenticated user by default
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null});

    // Mock API responses
    (buyerJourneyApi.getKYCStatus as jest.Mock).mockResolvedValue({
      verified: false,
      userId: 'user-123',
      verificationDate: null});

    (buyerJourneyApi.startKYCVerification as jest.Mock).mockResolvedValue({
      verificationId: 'verification-123'});

    (buyerJourneyApi.createReservation as jest.Mock).mockResolvedValue({
      id: 'transaction-123',
      unitId: 'unit-123',
      status: 'INITIATED'});

    (buyerJourneyApi.processDeposit as jest.Mock).mockResolvedValue({
      id: 'payment-123',
      transactionId: 'transaction-123',
      status: 'COMPLETED'});
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BuyerJourney
          developmentId="dev-123"
          unit={mockUnit}
          onComplete={jest.fn()}
        />
      </QueryClientProvider>
    );
  };

  test('shows authentication step when user is not authenticated', () => {
    renderComponent();

    // Should show authentication step
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('shows KYC verification step when user is authenticated but not verified', async () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-123', name: 'Test User' });

    renderComponent();

    // Should transition to KYC step
    await waitFor(() => {
      expect(screen.getByTestId('kyc-verification')).toBeInTheDocument();
    });
  });

  test('transitions through the journey steps correctly', async () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-123', name: 'Test User' });

    renderComponent();

    // Should start at KYC step
    await waitFor(() => {
      expect(screen.getByTestId('kyc-verification')).toBeInTheDocument();
    });

    // Complete KYC
    fireEvent.click(screen.getByText('Complete Verification'));

    // Should move to unit reservation step
    await waitFor(() => {
      expect(screen.getByText('Reserve Your Unit')).toBeInTheDocument();
    });

    // Reserve unit
    fireEvent.click(screen.getByText(/Reserve This Unit/i));

    // Should move to payment step
    await waitFor(() => {
      expect(screen.getByText('Deposit Payment')).toBeInTheDocument();
    });

    // Make payment
    fireEvent.click(screen.getByText(/Pay €1,000 Deposit/i));

    // Should complete the journey
    await waitFor(() => {
      expect(screen.getByText('Reservation Complete!')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-123', name: 'Test User' });

    // Mock API error
    (buyerJourneyApi.createReservation as jest.Mock).mockRejectedValue(new Error('Failed to reserve unit'));

    renderComponent();

    // Complete KYC
    await waitFor(() => {
      expect(screen.getByTestId('kyc-verification')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Complete Verification'));

    // Attempt to reserve unit
    await waitFor(() => {
      expect(screen.getByText('Reserve Your Unit')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Reserve This Unit/i));

    // Should show error state
    await waitFor(() => {
      expect(buyerJourneyApi.createReservation).toHaveBeenCalled();
    });
  });

  test('skips to reservation step when user is already verified', async () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-123', name: 'Test User' });

    // Mock verified KYC status
    (buyerJourneyApi.getKYCStatus as jest.Mock).mockResolvedValue({
      verified: true,
      userId: 'user-123',
      verificationDate: '2023-01-01T00:00:00Z'});

    renderComponent();

    // Should skip to reservation step
    await waitFor(() => {
      expect(screen.getByText('Reserve Your Unit')).toBeInTheDocument();
    });
  });
});