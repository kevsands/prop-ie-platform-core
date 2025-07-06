/**
 * Reservation Service
 * Handles property reservations, bookings, and transaction management
 * Integrates with payment system and property management
 */

import { PaymentType, PaymentStatus } from '@/lib/payment-config';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed', 
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  CONVERTED = 'converted' // Converted to full purchase
}

export enum ReservationType {
  TEMPORARY_HOLD = 'temporary_hold', // Short-term interest
  PAID_RESERVATION = 'paid_reservation', // Paid reservation fee
  DEPOSIT_BOOKING = 'deposit_booking', // Full deposit paid
  CONTRACT_EXCHANGE = 'contract_exchange' // Legal contract signed
}

export interface Reservation {
  id: string;
  propertyId: string;
  unitId?: string;
  developmentId: string;
  userId: string;
  
  // Reservation Details
  reservationType: ReservationType;
  status: ReservationStatus;
  reservationNumber: string; // Human-readable reference
  
  // Financial Information
  totalPropertyPrice: number;
  reservationFeeAmount: number;
  depositAmount?: number;
  amountPaid: number;
  outstandingAmount: number;
  
  // Dates and Timing
  createdAt: Date;
  expiresAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  extendedAt?: Date;
  
  // Personal Details
  buyerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  };
  
  // Property Details (snapshot at time of reservation)
  propertySnapshot: {
    title: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    htbEligible: boolean;
    developmentName: string;
  };
  
  // Payment and Transaction History
  transactions: ReservationTransaction[];
  
  // Additional Information
  appointmentDate?: Date;
  salesAgentId?: string;
  solicitorDetails?: {
    name: string;
    firm: string;
    email: string;
    phone: string;
  };
  
  // Terms and Conditions
  termsAcceptedAt: Date;
  termsVersion: string;
  
  // Journey Integration
  journeyId?: string;
  journeyStage?: string;
  
  // Metadata
  metadata: Record<string, any>;
  notes: string[];
}

export interface ReservationTransaction {
  id: string;
  reservationId: string;
  paymentIntentId: string;
  paymentType: PaymentType;
  amount: number;
  status: PaymentStatus;
  processedAt: Date;
  paymentMethod: string;
  transactionReference: string;
  metadata: Record<string, any>;
}

export interface CreateReservationRequest {
  propertyId: string;
  unitId?: string;
  developmentId: string;
  reservationType: ReservationType;
  paymentType: PaymentType;
  amount: number;
  buyerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  appointmentDate?: Date;
  journeyId?: string;
  paymentIntentId: string;
  metadata?: Record<string, any>;
}

export interface ReservationSearchFilters {
  status?: ReservationStatus[];
  reservationType?: ReservationType[];
  developmentId?: string;
  userId?: string;
  salesAgentId?: string;
  expiringWithinDays?: number;
  createdAfter?: Date;
  createdBefore?: Date;
}

export class ReservationService {
  /**
   * Create a new property reservation
   */
  static async createReservation(request: CreateReservationRequest): Promise<Reservation> {
    const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const reservationNumber = this.generateReservationNumber();
    
    // Calculate expiry date based on reservation type
    const expiryDate = this.calculateExpiryDate(request.reservationType);
    
    try {
      // Get property details for snapshot
      const propertySnapshot = await this.getPropertySnapshot(request.propertyId);
      
      // Create reservation record
      const reservation: Reservation = {
        id: reservationId,
        propertyId: request.propertyId,
        unitId: request.unitId,
        developmentId: request.developmentId,
        userId: this.getCurrentUserId(), // Get from auth context
        reservationType: request.reservationType,
        status: ReservationStatus.PENDING,
        reservationNumber,
        totalPropertyPrice: propertySnapshot.price,
        reservationFeeAmount: request.amount,
        amountPaid: 0, // Will be updated when payment confirms
        outstandingAmount: request.amount,
        createdAt: new Date(),
        expiresAt: expiryDate,
        buyerDetails: request.buyerDetails,
        propertySnapshot,
        transactions: [],
        appointmentDate: request.appointmentDate,
        termsAcceptedAt: new Date(),
        termsVersion: '1.0',
        journeyId: request.journeyId,
        metadata: request.metadata || {},
        notes: []
      };
      
      // Store reservation in database
      await this.saveReservation(reservation);
      
      // Create initial transaction record
      const transaction: ReservationTransaction = {
        id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        reservationId,
        paymentIntentId: request.paymentIntentId,
        paymentType: request.paymentType,
        amount: request.amount,
        status: PaymentStatus.PENDING,
        processedAt: new Date(),
        paymentMethod: 'pending',
        transactionReference: request.paymentIntentId,
        metadata: {}
      };
      
      reservation.transactions.push(transaction);
      
      // Send confirmation email
      await this.sendReservationConfirmationEmail(reservation);
      
      // Schedule expiry reminder
      await this.scheduleExpiryReminder(reservation);
      
      // Update property availability if needed
      await this.updatePropertyAvailability(request.propertyId, 'reserved');
      
      return reservation;
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw new Error('Failed to create reservation');
    }
  }
  
  /**
   * Confirm reservation payment
   */
  static async confirmReservationPayment(
    reservationId: string, 
    paymentIntentId: string,
    paymentMethod: string,
    transactionReference: string
  ): Promise<Reservation> {
    try {
      const reservation = await this.getReservationById(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      // Find the corresponding transaction
      const transaction = reservation.transactions.find(t => t.paymentIntentId === paymentIntentId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      
      // Update transaction status
      transaction.status = PaymentStatus.COMPLETED;
      transaction.paymentMethod = paymentMethod;
      transaction.transactionReference = transactionReference;
      
      // Update reservation financial details
      reservation.amountPaid += transaction.amount;
      reservation.outstandingAmount -= transaction.amount;
      reservation.status = ReservationStatus.CONFIRMED;
      reservation.confirmedAt = new Date();
      
      // Save updated reservation
      await this.saveReservation(reservation);
      
      // Send payment confirmation email
      await this.sendPaymentConfirmationEmail(reservation, transaction);
      
      // Schedule appointment if requested
      if (reservation.appointmentDate) {
        await this.scheduleAppointment(reservation);
      }
      
      // Update journey progress if integrated
      if (reservation.journeyId) {
        await this.updateJourneyProgress(reservation.journeyId, 'RESERVATION');
      }
      
      return reservation;
      
    } catch (error) {
      console.error('Error confirming reservation payment:', error);
      throw new Error('Failed to confirm reservation payment');
    }
  }
  
  /**
   * Get reservation by ID
   */
  static async getReservationById(reservationId: string): Promise<Reservation | null> {
    try {
      // In production, this would fetch from database
      // For now, using mock data structure
      const reservations = await this.getAllReservations();
      return reservations.find(r => r.id === reservationId) || null;
    } catch (error) {
      console.error('Error getting reservation:', error);
      return null;
    }
  }
  
  /**
   * Search reservations with filters
   */
  static async searchReservations(filters: ReservationSearchFilters): Promise<Reservation[]> {
    try {
      let reservations = await this.getAllReservations();
      
      // Apply filters
      if (filters.status) {
        reservations = reservations.filter(r => filters.status!.includes(r.status));
      }
      
      if (filters.reservationType) {
        reservations = reservations.filter(r => filters.reservationType!.includes(r.reservationType));
      }
      
      if (filters.developmentId) {
        reservations = reservations.filter(r => r.developmentId === filters.developmentId);
      }
      
      if (filters.userId) {
        reservations = reservations.filter(r => r.userId === filters.userId);
      }
      
      if (filters.expiringWithinDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithinDays);
        reservations = reservations.filter(r => r.expiresAt <= cutoffDate);
      }
      
      return reservations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    } catch (error) {
      console.error('Error searching reservations:', error);
      return [];
    }
  }
  
  /**
   * Extend reservation expiry
   */
  static async extendReservation(reservationId: string, additionalDays: number): Promise<Reservation> {
    try {
      const reservation = await this.getReservationById(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new Error('Can only extend confirmed reservations');
      }
      
      // Extend expiry date
      const newExpiryDate = new Date(reservation.expiresAt);
      newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);
      
      reservation.expiresAt = newExpiryDate;
      reservation.extendedAt = new Date();
      reservation.notes.push(`Reservation extended by ${additionalDays} days until ${newExpiryDate.toDateString()}`);
      
      // Save updated reservation
      await this.saveReservation(reservation);
      
      // Send extension confirmation
      await this.sendReservationExtensionEmail(reservation, additionalDays);
      
      return reservation;
      
    } catch (error) {
      console.error('Error extending reservation:', error);
      throw new Error('Failed to extend reservation');
    }
  }
  
  /**
   * Cancel reservation
   */
  static async cancelReservation(reservationId: string, reason: string): Promise<Reservation> {
    try {
      const reservation = await this.getReservationById(reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      
      reservation.status = ReservationStatus.CANCELLED;
      reservation.cancelledAt = new Date();
      reservation.notes.push(`Reservation cancelled: ${reason}`);
      
      // Process refund if applicable
      if (reservation.amountPaid > 0) {
        await this.processReservationRefund(reservation);
      }
      
      // Update property availability
      await this.updatePropertyAvailability(reservation.propertyId, 'available');
      
      // Save updated reservation
      await this.saveReservation(reservation);
      
      // Send cancellation email
      await this.sendReservationCancellationEmail(reservation, reason);
      
      return reservation;
      
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw new Error('Failed to cancel reservation');
    }
  }
  
  /**
   * Process expired reservations
   */
  static async processExpiredReservations(): Promise<void> {
    try {
      const now = new Date();
      const expiredReservations = await this.searchReservations({
        status: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED]
      });
      
      const actuallyExpired = expiredReservations.filter(r => r.expiresAt <= now);
      
      for (const reservation of actuallyExpired) {
        await this.cancelReservation(reservation.id, 'Automatic expiry');
      }
      
      console.log(`Processed ${actuallyExpired.length} expired reservations`);
      
    } catch (error) {
      console.error('Error processing expired reservations:', error);
    }
  }
  
  // Private helper methods
  
  private static generateReservationNumber(): string {
    const prefix = 'RES';
    const year = new Date().getFullYear().toString().slice(-2);
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${sequence}`;
  }
  
  private static calculateExpiryDate(reservationType: ReservationType): Date {
    const now = new Date();
    
    switch (reservationType) {
      case ReservationType.TEMPORARY_HOLD:
        now.setHours(now.getHours() + 24); // 24 hours
        break;
      case ReservationType.PAID_RESERVATION:
        now.setDate(now.getDate() + 14); // 14 days
        break;
      case ReservationType.DEPOSIT_BOOKING:
        now.setDate(now.getDate() + 30); // 30 days
        break;
      case ReservationType.CONTRACT_EXCHANGE:
        now.setDate(now.getDate() + 90); // 90 days
        break;
      default:
        now.setDate(now.getDate() + 14);
    }
    
    return now;
  }
  
  private static async getPropertySnapshot(propertyId: string): Promise<any> {
    // Mock property snapshot - in production would fetch from property service
    return {
      title: 'Modern 3 Bed House',
      location: 'Drogheda, Co. Louth',
      bedrooms: 3,
      bathrooms: 2,
      price: 350000,
      htbEligible: true,
      developmentName: 'Fitzgerald Gardens'
    };
  }
  
  private static getCurrentUserId(): string {
    // Mock user ID - in production would get from auth context
    return 'user-12345';
  }
  
  private static async saveReservation(reservation: Reservation): Promise<void> {
    // Mock save - in production would save to database
    console.log(`Saving reservation ${reservation.id}`);
  }
  
  private static async getAllReservations(): Promise<Reservation[]> {
    // Mock data - in production would fetch from database
    return [];
  }
  
  private static async sendReservationConfirmationEmail(reservation: Reservation): Promise<void> {
    console.log(`Sending confirmation email for reservation ${reservation.id}`);
  }
  
  private static async sendPaymentConfirmationEmail(reservation: Reservation, transaction: ReservationTransaction): Promise<void> {
    console.log(`Sending payment confirmation email for reservation ${reservation.id}`);
  }
  
  private static async sendReservationExtensionEmail(reservation: Reservation, additionalDays: number): Promise<void> {
    console.log(`Sending extension email for reservation ${reservation.id}`);
  }
  
  private static async sendReservationCancellationEmail(reservation: Reservation, reason: string): Promise<void> {
    console.log(`Sending cancellation email for reservation ${reservation.id}`);
  }
  
  private static async scheduleExpiryReminder(reservation: Reservation): Promise<void> {
    console.log(`Scheduling expiry reminder for reservation ${reservation.id}`);
  }
  
  private static async scheduleAppointment(reservation: Reservation): Promise<void> {
    console.log(`Scheduling appointment for reservation ${reservation.id}`);
  }
  
  private static async updatePropertyAvailability(propertyId: string, status: string): Promise<void> {
    console.log(`Updating property ${propertyId} availability to ${status}`);
  }
  
  private static async updateJourneyProgress(journeyId: string, stage: string): Promise<void> {
    console.log(`Updating journey ${journeyId} progress to ${stage}`);
  }
  
  private static async processReservationRefund(reservation: Reservation): Promise<void> {
    console.log(`Processing refund for reservation ${reservation.id}`);
  }
}

export default ReservationService;