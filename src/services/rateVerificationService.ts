export interface RateVerificationRequest {
  itemId: string;
  newRate: number;
  verificationMethod: 'supplier_quote' | 'market_research' | 'historical_data' | 'expert_review';
  verifiedBy: string;
  supplierId?: string;
  notes?: string;
  documents?: File[];
  confidence: 'high' | 'medium' | 'low';
}

export interface RateVerificationResponse {
  success: boolean;
  verificationId: string;
  approvalRequired: boolean;
  estimatedApprovalTime?: string;
  message: string;
}

export interface VerificationApproval {
  verificationId: string;
  approvedBy: string;
  approvalDate: Date;
  status: 'approved' | 'rejected' | 'requires_review';
  comments?: string;
}

export interface MarketRateData {
  itemCategory: string;
  averageRate: number;
  minRate: number;
  maxRate: number;
  sampleSize: number;
  confidence: number;
  lastUpdated: Date;
  sources: string[];
  regionalFactors?: RegionalFactor[];
}

export interface RegionalFactor {
  region: string;
  multiplier: number;
  notes: string;
}

export interface SupplierQuoteRequest {
  itemId: string;
  quantity: number;
  deliveryDate: Date;
  projectLocation: string;
  specifications: string;
  urgency: 'standard' | 'urgent' | 'emergency';
}

export interface SupplierQuoteResponse {
  quoteId: string;
  supplierId: string;
  rate: number;
  validUntil: Date;
  deliveryTime: number; // days
  minimumQuantity?: number;
  conditions: string[];
  alternativeOptions?: AlternativeOption[];
}

export interface AlternativeOption {
  description: string;
  rate: number;
  savings: number;
  tradeOffs: string[];
}

class RateVerificationService {
  private apiBase = '/api/rate-verification';

  async submitVerification(request: RateVerificationRequest): Promise<RateVerificationResponse> {
    try {
      // Validate request
      if (!this.validateRequest(request)) {
        throw new Error('Invalid verification request');
      }

      // Log verification attempt
      console.log('⚠️ RATE VERIFICATION SUBMISSION ⚠️');
      console.log('Item:', request.itemId);
      console.log('New Rate:', request.newRate);
      console.log('Method:', request.verificationMethod);
      console.log('Verified By:', request.verifiedBy);

      // Simulate API call
      const response = await this.mockApiCall('/submit-verification', request);

      // Determine if approval is required
      const approvalRequired = this.requiresApproval(request);

      return {
        success: true,
        verificationId: `VER-${Date.now()}`,
        approvalRequired,
        estimatedApprovalTime: approvalRequired ? '24-48 hours' : undefined,
        message: approvalRequired 
          ? 'Verification submitted for approval. You will be notified when approved.'
          : 'Rate verification completed successfully.'
      };
    } catch (error) {
      console.error('Rate verification failed:', error);
      return {
        success: false,
        verificationId: '',
        approvalRequired: false,
        message: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  async getMarketData(category: string, region?: string): Promise<MarketRateData | null> {
    try {
      // Mock market data based on category
      const marketData = this.getMockMarketData(categoryregion);
      
      console.log('📊 MARKET DATA RETRIEVED');
      console.log('Category:', category);
      console.log('Average Rate:', marketData.averageRate);
      console.log('Sample Size:', marketData.sampleSize);
      
      return marketData;
    } catch (error) {
      console.error('Failed to retrieve market data:', error);
      return null;
    }
  }

  async requestSupplierQuotes(request: SupplierQuoteRequest): Promise<SupplierQuoteResponse[]> {
    try {
      console.log('📧 SUPPLIER QUOTES REQUESTED');
      console.log('Item:', request.itemId);
      console.log('Quantity:', request.quantity);
      console.log('Urgency:', request.urgency);

      // Simulate supplier responses
      const quotes = await this.mockSupplierQuotes(request);
      
      return quotes;
    } catch (error) {
      console.error('Failed to request supplier quotes:', error);
      return [];
    }
  }

  async validateRateChange(
    currentRate: number, 
    newRate: number, 
    marketData?: MarketRateData
  ): Promise<{
    isValid: boolean;
    confidence: 'high' | 'medium' | 'low';
    warnings: string[];
    recommendations: string[];
  }> {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    const changePercentage = Math.abs((newRate - currentRate) / currentRate) * 100;
    
    // Check for significant rate changes
    if (changePercentage> 20) {
      warnings.push(`Rate change of ${changePercentage.toFixed(1)}% is significant`);
      recommendations.push('Obtain multiple supplier quotes for verification');
    }

    // Compare with market data if available
    if (marketData) {
      const marketDeviation = Math.abs((newRate - marketData.averageRate) / marketData.averageRate) * 100;
      
      if (marketDeviation> 15) {
        warnings.push(`Rate deviates ${marketDeviation.toFixed(1)}% from market average`);
        recommendations.push('Review market conditions and supplier justification');
      }
      
      if (newRate <marketData.minRate || newRate> marketData.maxRate) {
        warnings.push('Rate is outside normal market range');
        recommendations.push('Verify supplier credibility and quote validity');
      }
    }

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'high';
    if (warnings.length> 2) {
      confidence = 'low';
    } else if (warnings.length> 0) {
      confidence = 'medium';
    }

    return {
      isValid: warnings.length === 0 || changePercentage <50, // Reject extreme changes
      confidence,
      warnings,
      recommendations
    };
  }

  async getVerificationHistory(itemId: string): Promise<any[]> {
    // Mock verification history
    return [
      {
        id: '1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        verifiedBy: 'John Smith',
        previousRate: 100,
        newRate: 120,
        method: 'supplier_quote',
        approved: true,
        notes: 'Price increase due to material cost inflation'
      }
    ];
  }

  private validateRequest(request: RateVerificationRequest): boolean {
    if (!request.itemId || !request.newRate || !request.verificationMethod || !request.verifiedBy) {
      return false;
    }
    
    if (request.newRate <= 0) {
      return false;
    }
    
    return true;
  }

  private requiresApproval(request: RateVerificationRequest): boolean {
    // Approval required for significant changes or certain methods
    const currentRate = 100; // Would fetch from database in real implementation
    const changePercentage = Math.abs((request.newRate - currentRate) / currentRate) * 100;
    
    // Require approval for changes> 15% or expert reviews
    return changePercentage> 15 || request.verificationMethod === 'expert_review';
  }

  private async mockApiCall(endpoint: string, data: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate occasional failures (10% failure rate)
    if (Math.random() <0.1) {
      throw new Error('Network error - please try again');
    }
    
    return { success: true, data };
  }

  private getMockMarketData(category: string, region?: string): MarketRateData {
    const baseRates: { [key: string]: number } = {
      'concrete': 120,
      'steel': 850,
      'labor': 35,
      'timber': 450,
      'electrical': 65
    };

    const baseRate = baseRates[category.toLowerCase()] || 100;
    const variation = baseRate * 0.15; // 15% variation

    return {
      itemCategory: category,
      averageRate: baseRate,
      minRate: baseRate - variation,
      maxRate: baseRate + variation,
      sampleSize: Math.floor(Math.random() * 50) + 20,
      confidence: 0.85 + Math.random() * 0.1,
      lastUpdated: new Date(),
      sources: [
        'SCSI Price Guide',
        'Spon\'s Architects\' and Builders\' Price Book',
        'Local Supplier Network',
        'Industry Reports'
      ],
      regionalFactors: region ? [
        { region: 'Dublin', multiplier: 1.15, notes: 'Higher costs due to demand' },
        { region: 'Cork', multiplier: 1.05, notes: 'Moderate premium' },
        { region: 'Rural Areas', multiplier: 0.95, notes: 'Lower labor costs, higher transport' }
      ] : undefined
    };
  }

  private async mockSupplierQuotes(request: SupplierQuoteRequest): Promise<SupplierQuoteResponse[]> {
    const suppliers = [
      { id: 's1', name: 'Premium Supplier', reliability: 0.9, priceMultiplier: 1.1 },
      { id: 's2', name: 'Standard Supplier', reliability: 0.8, priceMultiplier: 1.0 },
      { id: 's3', name: 'Budget Supplier', reliability: 0.7, priceMultiplier: 0.9 }
    ];

    const baseRate = 100; // Would be item-specific in real implementation
    
    return suppliers.map(supplier => ({
      quoteId: `Q-${supplier.id}-${Date.now()}`,
      supplierId: supplier.id,
      rate: baseRate * supplier.priceMultiplier * (0.95 + Math.random() * 0.1),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      deliveryTime: Math.floor(Math.random() * 14) + 7, // 7-21 days
      minimumQuantity: request.quantity> 10 ? Math.floor(request.quantity * 0.1) : undefined,
      conditions: [
        'Payment within 30 days',
        'Delivery to site included',
        'Price subject to material availability'
      ],
      alternativeOptions: Math.random() > 0.5 ? [
        {
          description: 'Alternative specification',
          rate: baseRate * supplier.priceMultiplier * 0.85,
          savings: baseRate * supplier.priceMultiplier * 0.15,
          tradeOffs: ['Lower grade material', 'Longer delivery time']
        }
      ] : undefined
    }));
  }
}

export const rateVerificationService = new RateVerificationService();