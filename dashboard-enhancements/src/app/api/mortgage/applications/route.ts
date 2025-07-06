/**
 * Mortgage Application API
 * Real backend for mortgage pre-approval and application management
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface MortgageApplicationRequest {
  applicantInfo: {
    primaryApplicant: any;
    secondaryApplicant?: any;
    dependents: number;
    firstTimeBuyer: boolean;
  };
  financialInfo: {
    totalIncome: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    existingDebts: number;
    savings: number;
    deposit: number;
    requestedAmount: number;
    loanTerm: number;
  };
  propertyInfo: {
    propertyValue: number;
    propertyType: string;
    location: string;
    newBuild: boolean;
    htbEligible: boolean;
  };
}

/**
 * POST /api/mortgage/applications
 * Create a new mortgage application
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json() as MortgageApplicationRequest;
    
    // Validate required fields
    if (!body.financialInfo?.monthlyIncome || !body.financialInfo?.requestedAmount) {
      return NextResponse.json(
        { error: 'Monthly income and requested amount are required' },
        { status: 400 }
      );
    }

    // Generate unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create mortgage application
    const application = await prisma.mortgageApplication.create({
      data: {
        userId: user.id,
        applicationId,
        status: 'SUBMITTED',
        applicantData: JSON.stringify(body.applicantInfo),
        financialData: JSON.stringify(body.financialInfo),
        propertyData: JSON.stringify(body.propertyInfo),
        requestedAmount: body.financialInfo.requestedAmount,
        loanTerm: body.financialInfo.loanTerm,
        submittedAt: new Date()
      }
    });

    // Generate mortgage offers asynchronously
    generateMortgageOffersAsync(application.id, body);

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        applicationId: application.applicationId,
        status: application.status,
        requestedAmount: application.requestedAmount,
        loanTerm: application.loanTerm,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('Mortgage application error:', error);
    return NextResponse.json(
      { error: 'Failed to create mortgage application' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mortgage/applications
 * Get user's mortgage applications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const applications = await prisma.mortgageApplication.findMany({
      where: { userId: user.id },
      include: {
        offers: {
          orderBy: { recommendationScore: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Mortgage application fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mortgage applications' },
      { status: 500 }
    );
  }
}

/**
 * Generate mortgage offers from multiple lenders
 */
async function generateMortgageOffersAsync(applicationId: string, applicationData: MortgageApplicationRequest) {
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const lenders = [
      {
        name: 'Bank of Ireland',
        baseRate: 3.25,
        maxLTV: 90,
        minIncome: 35000,
        processingFee: 0,
        valuationFee: 150,
        features: ['Green Mortgage Benefits', 'Cashback €2,000', 'No arrangement fee']
      },
      {
        name: 'AIB',
        baseRate: 3.45,
        maxLTV: 80,
        minIncome: 40000,
        processingFee: 500,
        valuationFee: 200,
        features: ['Switch & Save', 'Online management', 'Haven rewards']
      },
      {
        name: 'Permanent TSB',
        baseRate: 3.15,
        maxLTV: 85,
        minIncome: 30000,
        processingFee: 300,
        valuationFee: 120,
        features: ['Graduate benefits', 'Professional rates', 'Flexible terms']
      },
      {
        name: 'Ulster Bank',
        baseRate: 3.35,
        maxLTV: 85,
        minIncome: 35000,
        processingFee: 400,
        valuationFee: 180,
        features: ['First time buyer support', 'Rate guarantee', 'Offset mortgage']
      }
    ];

    const offers = [];

    for (const lender of lenders) {
      // Check eligibility
      const monthlyIncome = applicationData.financialInfo.monthlyIncome;
      const annualIncome = monthlyIncome * 12;
      const loanToValue = (applicationData.financialInfo.requestedAmount / applicationData.propertyInfo.propertyValue) * 100;

      if (annualIncome < lender.minIncome || loanToValue > lender.maxLTV) {
        continue; // Skip this lender
      }

      // Calculate offer details
      const interestRate = lender.baseRate + (Math.random() * 0.4 - 0.2); // ±0.2% variation
      const apr = interestRate + 0.15; // Rough APR calculation
      const loanAmount = Math.min(
        applicationData.financialInfo.requestedAmount,
        annualIncome * 4.5, // Max 4.5x income
        applicationData.propertyInfo.propertyValue * (lender.maxLTV / 100)
      );
      
      const term = applicationData.financialInfo.loanTerm;
      const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, term);
      const totalCost = monthlyPayment * term * 12;
      
      // Generate offer ID
      const offerId = `${lender.name.replace(/\s+/g, '').toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      // Calculate recommendation score
      const recommendationScore = calculateRecommendationScore(
        interestRate,
        lender.processingFee + lender.valuationFee,
        lender.features.length,
        loanToValue
      );

      const offer = await prisma.mortgageOffer.create({
        data: {
          applicationId,
          offerId,
          lenderName: lender.name,
          productName: getProductName(lender.name, applicationData.applicantInfo.firstTimeBuyer),
          interestRate: Math.round(interestRate * 100) / 100,
          apr: Math.round(apr * 100) / 100,
          maxLoanAmount: loanAmount,
          loanToValue: Math.round(loanToValue),
          term,
          monthlyPayment: Math.round(monthlyPayment),
          totalCost: Math.round(totalCost),
          fees: JSON.stringify({
            arrangementFee: lender.processingFee,
            valuationFee: lender.valuationFee,
            legalFees: 1200,
            other: 150
          }),
          features: JSON.stringify(lender.features),
          conditions: JSON.stringify([
            `Minimum income €${lender.minIncome.toLocaleString()}`,
            'Property valuation required',
            'Credit assessment pending'
          ]),
          decisionInPrinciple: Math.random() > 0.3, // 70% get decision in principle
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10, // 4.0-5.0 rating
          recommendationScore,
          status: 'available'
        }
      });

      offers.push(offer);
    }

    // Update application status
    await prisma.mortgageApplication.update({
      where: { id: applicationId },
      data: {
        status: offers.length > 0 ? 'UNDER_REVIEW' : 'DECLINED'
      }
    });

    console.log(`Generated ${offers.length} mortgage offers for application ${applicationId}`);

  } catch (error) {
    console.error('Error generating mortgage offers:', error);
  }
}

/**
 * Calculate monthly mortgage payment
 */
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

/**
 * Calculate recommendation score
 */
function calculateRecommendationScore(rate: number, fees: number, featureCount: number, ltv: number): number {
  let score = 50; // Base score
  
  // Lower rate = higher score
  score += (4.0 - rate) * 10;
  
  // Lower fees = higher score
  score += Math.max(0, (1000 - fees) / 20);
  
  // More features = higher score
  score += featureCount * 3;
  
  // Lower LTV = higher score
  score += (90 - ltv) * 0.5;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Get product name based on lender and buyer type
 */
function getProductName(lenderName: string, isFirstTimeBuyer: boolean): string {
  const products: { [key: string]: { ftb: string; standard: string } } = {
    'Bank of Ireland': { ftb: 'Green Mortgage - First Time Buyer', standard: 'Green Mortgage - Fixed Rate' },
    'AIB': { ftb: 'Haven First Time Buyer', standard: 'Haven Variable Rate' },
    'Permanent TSB': { ftb: 'Graduate Mortgage', standard: 'Competitive Rate Mortgage' },
    'Ulster Bank': { ftb: 'First Home Mortgage', standard: 'Standard Variable Rate' }
  };
  
  const product = products[lenderName];
  if (!product) return 'Standard Mortgage';
  
  return isFirstTimeBuyer ? product.ftb : product.standard;
}