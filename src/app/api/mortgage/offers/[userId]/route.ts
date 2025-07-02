import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const compareOffersSchema = z.object({
  offerIds: z.array(z.string()).min(2, 'At least 2 offers required for comparison').max(5, 'Maximum 5 offers for comparison'),
  comparisonFactors: z.array(z.enum(['INTEREST_RATE', 'MONTHLY_PAYMENT', 'TOTAL_COST', 'FEES', 'FEATURES', 'FLEXIBILITY'])).optional()
});

const acceptOfferSchema = z.object({
  offerId: z.string().min(1, 'Offer ID is required'),
  acceptanceNotes: z.string().optional(),
  requestedConditions: z.array(z.string()).optional(),
  expectedDrawdownDate: z.string().optional()
});

/**
 * GET /api/mortgage/offers/[userId] - Get comprehensive mortgage offers analysis
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (currentUser.id !== userId && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const includeExpired = searchParams.get('includeExpired') === 'true';
    const lenderName = searchParams.get('lenderName');
    const sortBy = searchParams.get('sortBy') || 'interestRate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build where clause for offers
    const whereClause: any = {
      MortgageApplication: {
        userId
      }
    };

    if (!includeExpired) {
      whereClause.validUntil = {
        gte: new Date()
      };
    }

    if (lenderName) {
      whereClause.lenderName = lenderName;
    }

    // Get all offers with related data
    const offers = await prisma.mortgageOffer.findMany({
      where: whereClause,
      include: {
        MortgageApplication: {
          select: {
            id: true,
            applicationId: true,
            submittedAt: true,
            status: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc'
      }
    });

    // Get market comparison data
    const marketData = await generateMarketComparison(offers);

    // Calculate comprehensive analytics for each offer
    const enhancedOffers = offers.map(offer => {
      const analytics = calculateOfferAnalytics(offer, offers);
      const affordability = calculateAffordabilityMetrics(offer);
      const suitabilityScore = calculateSuitabilityScore(offer, offers);

      return {
        ...offer,
        analytics,
        affordability,
        suitabilityScore,
        timeAgo: calculateTimeAgo(offer.createdAt),
        isExpired: new Date(offer.validUntil) < new Date(),
        daysUntilExpiry: Math.ceil((new Date(offer.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        competitiveness: calculateCompetitiveness(offer, offers),
        pros: generateOfferPros(offer, offers),
        cons: generateOfferCons(offer, offers),
        riskFactors: assessRiskFactors(offer),
        recommendations: generateOfferRecommendations(offer, offers)
      };
    });

    // Generate comparative analysis
    const comparison = generateOfferComparison(enhancedOffers);

    // Generate recommendations
    const recommendations = generateOverallRecommendations(enhancedOffers, marketData);

    return NextResponse.json({
      success: true,
      data: {
        offers: enhancedOffers,
        marketData,
        comparison,
        recommendations,
        summary: {
          total: offers.length,
          active: offers.filter(o => new Date(o.validUntil) >= new Date()).length,
          expired: offers.filter(o => new Date(o.validUntil) < new Date()).length,
          averageRate: calculateAverageRate(offers),
          bestRate: Math.min(...offers.map(o => o.interestRate)),
          worstRate: Math.max(...offers.map(o => o.interestRate)),
          averageMonthlyPayment: calculateAverageMonthlyPayment(offers),
          totalPotentialSavings: calculatePotentialSavings(enhancedOffers),
          lenderCount: new Set(offers.map(o => o.lenderName)).size
        }
      }
    });

  } catch (error) {
    console.error('Error fetching mortgage offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mortgage offers' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/mortgage/offers/[userId] - Compare specific offers
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { action, ...actionData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (currentUser.id !== userId && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'compare':
        return await handleOfferComparison(actionData, currentUser);
      
      case 'accept':
        return await handleOfferAcceptance(actionData, userId, currentUser);
      
      case 'decline':
        return await handleOfferDecline(actionData, userId, currentUser);
      
      case 'request_modification':
        return await handleModificationRequest(actionData, userId, currentUser);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing offer action:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process offer action' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function getCurrentUser(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken?.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        return await userService.getUserById(userId);
      }
    } else {
      return await userService.getCurrentUser();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

function isAdmin(user: any): boolean {
  return user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateTimeAgo(date: Date | string): string {
  const now = new Date();
  const eventDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

function calculateOfferAnalytics(offer: any, allOffers: any[]) {
  const totalCost = offer.monthlyPayment * offer.term * 12;
  const totalInterest = totalCost - offer.maxLoanAmount;
  const effectiveRate = (totalInterest / offer.maxLoanAmount / offer.term) * 100;

  // Calculate position relative to other offers
  const rates = allOffers.map(o => o.interestRate).sort((a, b) => a - b);
  const rateRank = rates.indexOf(offer.interestRate) + 1;
  const ratePercentile = ((rates.length - rateRank + 1) / rates.length) * 100;

  return {
    totalCost: Math.round(totalCost),
    totalInterest: Math.round(totalInterest),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    costPerThousand: Math.round((offer.monthlyPayment / offer.maxLoanAmount) * 1000 * 100) / 100,
    rateRank,
    ratePercentile: Math.round(ratePercentile),
    feesToLoanRatio: offer.fees ? (JSON.parse(offer.fees).arrangementFee || 0) / offer.maxLoanAmount * 100 : 0,
    paymentToIncomeRatio: calculatePaymentToIncomeRatio(offer.monthlyPayment)
  };
}

function calculateAffordabilityMetrics(offer: any) {
  // Simplified affordability calculations - in reality would use user's financial data
  const assumedIncome = offer.monthlyPayment / 0.35; // Assume 35% of income
  const stressTestRate = offer.interestRate + 2.0; // Stress test at +2%
  const stressTestPayment = calculateMonthlyPayment(offer.maxLoanAmount, stressTestRate, offer.term);

  return {
    assumedRequiredIncome: Math.round(assumedIncome),
    paymentRatio: 35, // Assumed
    stressTestPayment: Math.round(stressTestPayment),
    stressTestRatio: Math.round((stressTestPayment / assumedIncome) * 100),
    bufferAmount: Math.round(assumedIncome - offer.monthlyPayment),
    riskLevel: stressTestPayment / assumedIncome > 0.4 ? 'HIGH' : stressTestPayment / assumedIncome > 0.35 ? 'MEDIUM' : 'LOW'
  };
}

function calculateSuitabilityScore(offer: any, allOffers: any[]) {
  let score = 50; // Base score

  // Rate competitiveness (30 points)
  const rates = allOffers.map(o => o.interestRate).sort((a, b) => a - b);
  const rateRank = rates.indexOf(offer.interestRate) + 1;
  const rateScore = ((rates.length - rateRank + 1) / rates.length) * 30;
  score += rateScore;

  // Fees (20 points)
  const fees = offer.fees ? JSON.parse(offer.fees) : {};
  const totalFees = (fees.arrangementFee || 0) + (fees.valuationFee || 0) + (fees.other || 0);
  const feesScore = totalFees < 1000 ? 20 : totalFees < 2000 ? 15 : totalFees < 3000 ? 10 : 5;
  score += feesScore;

  // Features (15 points)
  const features = offer.features ? JSON.parse(offer.features) : [];
  const featuresScore = Math.min(15, features.length * 3);
  score += featuresScore;

  // Decision in principle (10 points)
  if (offer.decisionInPrinciple) {
    score += 10;
  }

  // Lender rating (15 points)
  const ratingScore = offer.rating ? (offer.rating / 5) * 15 : 0;
  score += ratingScore;

  // LTV favorability (10 points)
  const ltvScore = offer.loanToValue < 80 ? 10 : offer.loanToValue < 90 ? 7 : 5;
  score += ltvScore;

  return Math.min(100, Math.max(0, Math.round(score)));
}

function calculateCompetitiveness(offer: any, allOffers: any[]): string {
  const suitabilityScore = calculateSuitabilityScore(offer, allOffers);
  
  if (suitabilityScore >= 85) return 'Excellent';
  if (suitabilityScore >= 70) return 'Very Good';
  if (suitabilityScore >= 55) return 'Good';
  if (suitabilityScore >= 40) return 'Fair';
  return 'Poor';
}

function generateOfferPros(offer: any, allOffers: any[]): string[] {
  const pros = [];
  
  // Rate advantages
  const rates = allOffers.map(o => o.interestRate).sort((a, b) => a - b);
  const rateRank = rates.indexOf(offer.interestRate) + 1;
  if (rateRank <= Math.ceil(allOffers.length * 0.3)) {
    pros.push(`Competitive interest rate (${offer.interestRate}%)`);
  }

  // Low fees
  const fees = offer.fees ? JSON.parse(offer.fees) : {};
  const totalFees = (fees.arrangementFee || 0) + (fees.valuationFee || 0);
  if (totalFees < 1000) {
    pros.push('Low or no arrangement fees');
  }

  // Decision in principle
  if (offer.decisionInPrinciple) {
    pros.push('Decision in principle available');
  }

  // High lender rating
  if (offer.rating >= 4.5) {
    pros.push(`Highly rated lender (${offer.rating}/5)`);
  }

  // Features
  const features = offer.features ? JSON.parse(offer.features) : [];
  if (features.length > 3) {
    pros.push('Comprehensive product features');
  }

  // Flexible terms
  if (offer.term >= 30) {
    pros.push('Flexible loan terms available');
  }

  return pros;
}

function generateOfferCons(offer: any, allOffers: any[]): string[] {
  const cons = [];

  // Rate disadvantages
  const rates = allOffers.map(o => o.interestRate).sort((a, b) => a - b);
  const rateRank = rates.indexOf(offer.interestRate) + 1;
  if (rateRank > Math.ceil(allOffers.length * 0.7)) {
    cons.push('Higher interest rate compared to alternatives');
  }

  // High fees
  const fees = offer.fees ? JSON.parse(offer.fees) : {};
  const totalFees = (fees.arrangementFee || 0) + (fees.valuationFee || 0);
  if (totalFees > 2000) {
    cons.push(`High arrangement fees (€${totalFees.toLocaleString()})`);
  }

  // No decision in principle
  if (!offer.decisionInPrinciple) {
    cons.push('No decision in principle available');
  }

  // Low lender rating
  if (offer.rating < 4.0) {
    cons.push(`Lower lender rating (${offer.rating}/5)`);
  }

  // Limited features
  const features = offer.features ? JSON.parse(offer.features) : [];
  if (features.length < 2) {
    cons.push('Limited product features');
  }

  // Expiring soon
  const daysUntilExpiry = Math.ceil((new Date(offer.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry <= 14) {
    cons.push(`Offer expires soon (${daysUntilExpiry} days)`);
  }

  return cons;
}

function assessRiskFactors(offer: any): string[] {
  const risks = [];

  // Variable rate risk
  if (offer.productName?.toLowerCase().includes('variable')) {
    risks.push('Interest rate may increase over time');
  }

  // High LTV risk
  if (offer.loanToValue > 90) {
    risks.push('High loan-to-value ratio may impact terms');
  }

  // Stress test concerns
  const stressTestRate = offer.interestRate + 2.0;
  const stressTestPayment = calculateMonthlyPayment(offer.maxLoanAmount, stressTestRate, offer.term);
  if (stressTestPayment > offer.monthlyPayment * 1.3) {
    risks.push('Payments may become unaffordable if rates increase');
  }

  // Lender-specific risks
  if (offer.rating < 4.0) {
    risks.push('Lower-rated lender may have service issues');
  }

  return risks;
}

function generateOfferRecommendations(offer: any, allOffers: any[]): string[] {
  const recommendations = [];

  const suitabilityScore = calculateSuitabilityScore(offer, allOffers);
  
  if (suitabilityScore >= 80) {
    recommendations.push('Highly recommended - excellent overall value');
  } else if (suitabilityScore >= 60) {
    recommendations.push('Good option - consider alongside top alternatives');
  } else {
    recommendations.push('Consider carefully - may not be the best available option');
  }

  // Specific recommendations
  const rates = allOffers.map(o => o.interestRate).sort((a, b) => a - b);
  const rateRank = rates.indexOf(offer.interestRate) + 1;
  
  if (rateRank === 1) {
    recommendations.push('Best available interest rate');
  } else if (rateRank <= 3) {
    recommendations.push('Competitive interest rate');
  }

  const fees = offer.fees ? JSON.parse(offer.fees) : {};
  const totalFees = (fees.arrangementFee || 0) + (fees.valuationFee || 0);
  if (totalFees === 0) {
    recommendations.push('No arrangement fees - excellent value');
  }

  if (offer.decisionInPrinciple) {
    recommendations.push('Decision in principle available - faster processing');
  }

  return recommendations;
}

async function generateMarketComparison(offers: any[]) {
  // This would typically fetch external market data
  // For now, we'll generate based on the offers available
  
  const rates = offers.map(o => o.interestRate);
  const monthlyPayments = offers.map(o => o.monthlyPayment);
  
  return {
    averageMarketRate: Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) / 100,
    lowestMarketRate: Math.min(...rates),
    highestMarketRate: Math.max(...rates),
    averageMonthlyPayment: Math.round(monthlyPayments.reduce((a, b) => a + b, 0) / monthlyPayments.length),
    marketTrend: 'stable', // Would be calculated from historical data
    rateRange: {
      excellent: Math.min(...rates),
      good: Math.min(...rates) + 0.3,
      fair: Math.min(...rates) + 0.6,
      poor: Math.max(...rates)
    }
  };
}

function generateOfferComparison(offers: any[]) {
  if (offers.length < 2) return null;

  // Sort offers by suitability score
  const sortedOffers = offers.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  
  return {
    bestOverall: sortedOffers[0],
    lowestRate: offers.reduce((prev, current) => 
      prev.interestRate < current.interestRate ? prev : current
    ),
    lowestMonthlyPayment: offers.reduce((prev, current) => 
      prev.monthlyPayment < current.monthlyPayment ? prev : current
    ),
    lowestTotalCost: offers.reduce((prev, current) => 
      prev.analytics.totalCost < current.analytics.totalCost ? prev : current
    ),
    mostFeatures: offers.reduce((prev, current) => {
      const prevFeatures = prev.features ? JSON.parse(prev.features).length : 0;
      const currentFeatures = current.features ? JSON.parse(current.features).length : 0;
      return prevFeatures > currentFeatures ? prev : current;
    })
  };
}

function generateOverallRecommendations(offers: any[], marketData: any): string[] {
  const recommendations = [];

  if (offers.length === 0) {
    recommendations.push('No offers available - consider improving application or trying additional lenders');
    return recommendations;
  }

  const bestOffer = offers.reduce((prev, current) => 
    prev.suitabilityScore > current.suitabilityScore ? prev : current
  );

  recommendations.push(`Best overall option: ${bestOffer.lenderName} - ${bestOffer.productName}`);

  const lowestRate = Math.min(...offers.map(o => o.interestRate));
  if (lowestRate <= marketData.averageMarketRate - 0.2) {
    recommendations.push('Excellent rate options available - well below market average');
  }

  const rateSpread = Math.max(...offers.map(o => o.interestRate)) - lowestRate;
  if (rateSpread > 0.5) {
    recommendations.push('Significant rate differences between offers - careful comparison recommended');
  }

  const expiringOffers = offers.filter(o => {
    const daysUntilExpiry = Math.ceil((new Date(o.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  });

  if (expiringOffers.length > 0) {
    recommendations.push(`${expiringOffers.length} offers expiring within 30 days - decision needed soon`);
  }

  return recommendations;
}

function calculateAverageRate(offers: any[]): number {
  if (offers.length === 0) return 0;
  const totalRate = offers.reduce((sum, offer) => sum + offer.interestRate, 0);
  return Math.round((totalRate / offers.length) * 100) / 100;
}

function calculateAverageMonthlyPayment(offers: any[]): number {
  if (offers.length === 0) return 0;
  const totalPayment = offers.reduce((sum, offer) => sum + offer.monthlyPayment, 0);
  return Math.round(totalPayment / offers.length);
}

function calculatePotentialSavings(offers: any[]): number {
  if (offers.length < 2) return 0;
  
  const costs = offers.map(o => o.analytics.totalCost);
  const bestCost = Math.min(...costs);
  const worstCost = Math.max(...costs);
  
  return worstCost - bestCost;
}

function calculatePaymentToIncomeRatio(monthlyPayment: number): number {
  // Simplified calculation - would use actual user income
  const assumedIncome = monthlyPayment / 0.35;
  return Math.round((monthlyPayment / assumedIncome) * 100);
}

function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return monthlyPayment;
}

async function handleOfferComparison(data: any, currentUser: any) {
  const validatedData = compareOffersSchema.parse(data);
  
  // Get the offers to compare
  const offers = await prisma.mortgageOffer.findMany({
    where: {
      id: { in: validatedData.offerIds }
    },
    include: {
      MortgageApplication: {
        select: { userId: true }
      }
    }
  });

  // Generate detailed comparison
  const comparison = generateDetailedComparison(offers, validatedData.comparisonFactors);

  return NextResponse.json({
    success: true,
    data: {
      comparison,
      offers: offers.map(offer => ({
        ...offer,
        analytics: calculateOfferAnalytics(offer, offers),
        suitabilityScore: calculateSuitabilityScore(offer, offers)
      }))
    }
  });
}

async function handleOfferAcceptance(data: any, userId: string, currentUser: any) {
  const validatedData = acceptOfferSchema.parse(data);
  
  // Get the offer
  const offer = await prisma.mortgageOffer.findUnique({
    where: { id: validatedData.offerId },
    include: {
      MortgageApplication: true
    }
  });

  if (!offer) {
    return NextResponse.json(
      { error: 'Offer not found' },
      { status: 404 }
    );
  }

  // Update offer status
  await prisma.mortgageOffer.update({
    where: { id: validatedData.offerId },
    data: {
      status: 'accepted',
      acceptedAt: new Date(),
      acceptanceNotes: validatedData.acceptanceNotes
    }
  });

  // Update mortgage tracking
  await prisma.mortgageTracking.upsert({
    where: { userId },
    create: {
      id: generateId(),
      userId,
      status: 'OFFER_ACCEPTED',
      lender: offer.lenderName,
      lenderName: offer.lenderName,
      amount: offer.maxLoanAmount,
      interestRate: offer.interestRate,
      term: offer.term,
      monthlyPayment: offer.monthlyPayment,
      formalOfferDate: new Date(),
      offerExpiryDate: offer.validUntil,
      lastUpdated: new Date()
    },
    update: {
      status: 'OFFER_ACCEPTED',
      lender: offer.lenderName,
      lenderName: offer.lenderName,
      amount: offer.maxLoanAmount,
      interestRate: offer.interestRate,
      term: offer.term,
      monthlyPayment: offer.monthlyPayment,
      formalOfferDate: new Date(),
      offerExpiryDate: offer.validUntil,
      lastUpdated: new Date()
    }
  });

  // Create buyer event
  await prisma.buyerEvent.create({
    data: {
      id: generateId(),
      buyerId: userId,
      eventType: 'MORTGAGE_OFFER_ACCEPTED',
      eventDate: new Date(),
      eventData: {
        offerId: validatedData.offerId,
        lenderName: offer.lenderName,
        interestRate: offer.interestRate,
        amount: offer.maxLoanAmount
      },
      description: `Mortgage offer accepted: ${offer.lenderName} at ${offer.interestRate}%`
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: 'Offer accepted successfully',
      nextSteps: [
        'Complete formal application with lender',
        'Arrange property valuation',
        'Coordinate with solicitor for legal process'
      ]
    }
  });
}

async function handleOfferDecline(data: any, userId: string, currentUser: any) {
  const { offerId, reason } = data;

  if (!offerId) {
    return NextResponse.json(
      { error: 'Offer ID is required' },
      { status: 400 }
    );
  }

  // Update offer status
  await prisma.mortgageOffer.update({
    where: { id: offerId },
    data: {
      status: 'declined',
      declinedAt: new Date(),
      declineReason: reason
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: 'Offer declined successfully'
    }
  });
}

async function handleModificationRequest(data: any, userId: string, currentUser: any) {
  const { offerId, requestedChanges, notes } = data;

  if (!offerId || !requestedChanges) {
    return NextResponse.json(
      { error: 'Offer ID and requested changes are required' },
      { status: 400 }
    );
  }

  // Create modification request record
  const modificationRequest = await prisma.mortgageOfferModification.create({
    data: {
      id: generateId(),
      offerId,
      requestedChanges: JSON.stringify(requestedChanges),
      notes,
      status: 'PENDING',
      requestedBy: currentUser.id,
      requestDate: new Date()
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      modificationRequest,
      message: 'Modification request submitted successfully'
    }
  });
}

function generateDetailedComparison(offers: any[], factors?: string[]) {
  const defaultFactors = ['INTEREST_RATE', 'MONTHLY_PAYMENT', 'TOTAL_COST', 'FEES'];
  const compareFactors = factors || defaultFactors;

  const comparison: any = {
    factors: {},
    summary: {},
    winner: {}
  };

  compareFactors.forEach(factor => {
    switch (factor) {
      case 'INTEREST_RATE':
        const bestRate = offers.reduce((prev, current) => 
          prev.interestRate < current.interestRate ? prev : current
        );
        comparison.factors.interestRate = {
          winner: bestRate.id,
          values: offers.map(o => ({ id: o.id, value: o.interestRate })),
          savings: `Up to ${(Math.max(...offers.map(o => o.interestRate)) - bestRate.interestRate).toFixed(2)}% difference`
        };
        break;

      case 'MONTHLY_PAYMENT':
        const bestPayment = offers.reduce((prev, current) => 
          prev.monthlyPayment < current.monthlyPayment ? prev : current
        );
        comparison.factors.monthlyPayment = {
          winner: bestPayment.id,
          values: offers.map(o => ({ id: o.id, value: o.monthlyPayment })),
          savings: `€${Math.max(...offers.map(o => o.monthlyPayment)) - bestPayment.monthlyPayment} monthly savings`
        };
        break;

      case 'TOTAL_COST':
        const costs = offers.map(o => ({ 
          id: o.id, 
          value: o.monthlyPayment * o.term * 12 
        }));
        const bestCost = costs.reduce((prev, current) => 
          prev.value < current.value ? prev : current
        );
        comparison.factors.totalCost = {
          winner: bestCost.id,
          values: costs,
          savings: `€${Math.max(...costs.map(c => c.value)) - bestCost.value} total savings`
        };
        break;

      case 'FEES':
        const fees = offers.map(o => {
          const feeData = o.fees ? JSON.parse(o.fees) : {};
          const totalFees = (feeData.arrangementFee || 0) + (feeData.valuationFee || 0) + (feeData.other || 0);
          return { id: o.id, value: totalFees };
        });
        const bestFees = fees.reduce((prev, current) => 
          prev.value < current.value ? prev : current
        );
        comparison.factors.fees = {
          winner: bestFees.id,
          values: fees,
          savings: `€${Math.max(...fees.map(f => f.value)) - bestFees.value} in fee savings`
        };
        break;
    }
  });

  return comparison;
}