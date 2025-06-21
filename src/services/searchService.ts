/**
 * Advanced Search Service
 * Provides intelligent property search with filtering, sorting, and recommendations
 * Optimized for Kevin Fitzgerald's property platform requirements
 */

export interface SearchFilters {
  // Location filters
  development?: string[];
  location?: string[];
  area?: string[];
  
  // Property specifications
  propertyType?: string[];
  bedrooms?: { min?: number; max?: number };
  bathrooms?: { min?: number; max?: number };
  livingAreas?: { min?: number; max?: number };
  
  // Size and space
  floorArea?: { min?: number; max?: number };
  gardens?: boolean;
  parking?: boolean;
  balcony?: boolean;
  
  // Financial
  priceRange?: { min?: number; max?: number };
  monthlyPayment?: { min?: number; max?: number };
  helpToBuy?: boolean;
  
  // Availability
  availabilityStatus?: string[];
  completionDate?: { from?: Date; to?: Date };
  readyToMove?: boolean;
  
  // Features and amenities
  features?: string[];
  amenities?: string[];
  energyRating?: string[];
  
  // Customization
  customizationOptions?: string[];
  upgrades?: string[];
  
  // Investment criteria
  rentalYield?: { min?: number; max?: number };
  investmentPotential?: string[];
}

export interface SearchSort {
  field: 'price' | 'size' | 'bedrooms' | 'completion' | 'popularity' | 'distance' | 'yield';
  direction: 'asc' | 'desc';
}

export interface SearchResult {
  units: Array<{
    id: string;
    developmentId: string;
    developmentName: string;
    unitNumber: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    livingAreas: number;
    floorArea: number;
    basePrice: number;
    status: string;
    completionDate: Date;
    features: string[];
    images: string[];
    description: string;
    location: {
      address: string;
      area: string;
      county: string;
      coordinates?: { lat: number; lng: number };
    };
    financing: {
      monthlyPayment: number;
      deposit: number;
      helpToBuyEligible: boolean;
    };
    investment: {
      estimatedRentalYield?: number;
      pricePerSqFt: number;
      growthPotential: string;
    };
    searchScore: number;
    matchReasons: string[];
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  aggregations: {
    priceRanges: Array<{ range: string; count: number }>;
    bedroomCounts: Array<{ bedrooms: number; count: number }>;
    propertyTypes: Array<{ type: string; count: number }>;
    developments: Array<{ name: string; count: number }>;
    availabilityStatus: Array<{ status: string; count: number }>;
  };
  suggestions: string[];
  searchTime: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  sort: SearchSort;
  alertsEnabled: boolean;
  lastRun: Date;
  resultsCount: number;
  createdAt: Date;
}

export interface SearchRecommendation {
  reason: string;
  suggestedFilters: Partial<SearchFilters>;
  expectedResults: number;
  priority: 'high' | 'medium' | 'low';
}

export class SearchService {
  /**
   * Execute advanced property search with intelligent filtering
   */
  async search(
    query: string = '',
    filters: SearchFilters = {},
    sort: SearchSort = { field: 'price', direction: 'asc' },
    page: number = 1,
    limit: number = 20,
    userId?: string
  ): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      // Build search query
      const searchQuery = this.buildSearchQuery(query, filters, sort);
      
      // Execute search (in production, this would query the database)
      const units = await this.executeSearch(searchQuery, page, limit);
      
      // Calculate search scores and match reasons
      const scoredUnits = units.map(unit => ({
        ...unit,
        searchScore: this.calculateSearchScore(unit, query, filters),
        matchReasons: this.generateMatchReasons(unit, query, filters)
      }));
      
      // Sort results
      const sortedUnits = this.sortResults(scoredUnits, sort);
      
      // Generate aggregations for filtering UI
      const aggregations = this.generateAggregations(units);
      
      // Generate search suggestions
      const suggestions = this.generateSuggestions(query, filters);
      
      // Track search for analytics
      if (userId) {
        this.trackSearch(userId, query, filters, sortedUnits.length);
      }
      
      const searchTime = Date.now() - startTime;
      
      return {
        units: sortedUnits.slice((page - 1) * limit, page * limit),
        pagination: {
          total: sortedUnits.length,
          page,
          limit,
          totalPages: Math.ceil(sortedUnits.length / limit)
        },
        aggregations,
        suggestions,
        searchTime
      };
      
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
  
  /**
   * Get search recommendations based on user behavior and preferences
   */
  async getRecommendations(
    userId: string,
    userProfile?: {
      budget?: number;
      preferredAreas?: string[];
      propertyType?: string;
      timeline?: string;
      isFirstTimeBuyer?: boolean;
      isInvestor?: boolean;
    }
  ): Promise<SearchRecommendation[]> {
    const recommendations: SearchRecommendation[] = [];
    
    // Budget-based recommendations
    if (userProfile?.budget) {
      if (userProfile.budget <= 300000) {
        recommendations.push({
          reason: 'Based on your budget, these apartments offer great value',
          suggestedFilters: {
            priceRange: { max: userProfile.budget },
            propertyType: ['1 Bed Apartment', '2 Bed Apartment'],
            helpToBuy: userProfile.isFirstTimeBuyer
          },
          expectedResults: 8,
          priority: 'high'
        });
      } else if (userProfile.budget <= 500000) {
        recommendations.push({
          reason: 'Family homes within your budget range',
          suggestedFilters: {
            priceRange: { min: 300000, max: userProfile.budget },
            propertyType: ['3 Bed Townhouse', '3 Bed Semi-Detached'],
            bedrooms: { min: 3 }
          },
          expectedResults: 12,
          priority: 'high'
        });
      }
    }
    
    // First-time buyer recommendations
    if (userProfile?.isFirstTimeBuyer) {
      recommendations.push({
        reason: 'Help to Buy eligible properties perfect for first-time buyers',
        suggestedFilters: {
          helpToBuy: true,
          priceRange: { max: 500000 },
          features: ['Modern Kitchen', 'Energy Efficient']
        },
        expectedResults: 15,
        priority: 'high'
      });
    }
    
    // Investment recommendations
    if (userProfile?.isInvestor) {
      recommendations.push({
        reason: 'High yield investment opportunities',
        suggestedFilters: {
          propertyType: ['1 Bed Apartment', '2 Bed Apartment'],
          rentalYield: { min: 5.0 },
          location: ['Drogheda', 'Dublin Commuter Belt']
        },
        expectedResults: 6,
        priority: 'medium'
      });
    }
    
    // Area-based recommendations
    if (userProfile?.preferredAreas?.length) {
      recommendations.push({
        reason: `Properties in your preferred areas: ${userProfile.preferredAreas.join(', ')}`,
        suggestedFilters: {
          area: userProfile.preferredAreas,
          availabilityStatus: ['Available', 'Coming Soon']
        },
        expectedResults: 10,
        priority: 'medium'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * Save a search for future use and alerts
   */
  async saveSearch(
    userId: string,
    name: string,
    filters: SearchFilters,
    sort: SearchSort,
    enableAlerts: boolean = false
  ): Promise<SavedSearch> {
    const savedSearch: SavedSearch = {
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId,
      name,
      filters,
      sort,
      alertsEnabled: enableAlerts,
      lastRun: new Date(),
      resultsCount: 0,
      createdAt: new Date()
    };
    
    // Execute search to get current results count
    const results = await this.search('', filters, sort, 1, 1, userId);
    savedSearch.resultsCount = results.pagination.total;
    
    // In production, save to database
    console.log('Saved search:', savedSearch);
    
    return savedSearch;
  }
  
  /**
   * Get intelligent search suggestions based on partial input
   */
  getSearchSuggestions(query: string): string[] {
    const suggestions = [
      // Location suggestions
      'Drogheda properties',
      'Dublin commuter belt',
      'Meath properties',
      'Louth developments',
      
      // Property type suggestions
      '3 bedroom house',
      '2 bedroom apartment',
      'townhouse',
      'semi-detached',
      'apartment',
      
      // Feature suggestions
      'help to buy eligible',
      'ready to move',
      'new build',
      'energy efficient',
      'garden',
      'parking',
      
      // Development suggestions
      'Ellwood',
      'Ballymakenny View',
      'Fitzgerald Gardens',
      
      // Investment suggestions
      'rental yield',
      'investment property',
      'buy to let',
      
      // Price suggestions
      'under €300k',
      'under €400k',
      'under €500k'
    ];
    
    if (!query) return suggestions.slice(0, 10);
    
    const lowercaseQuery = query.toLowerCase();
    return suggestions
      .filter(suggestion => suggestion.toLowerCase().includes(lowercaseQuery))
      .slice(0, 8);
  }
  
  /**
   * Build optimized search query
   */
  private buildSearchQuery(query: string, filters: SearchFilters, sort: SearchSort): any {
    const searchQuery = {
      textSearch: query,
      filters,
      sort,
      boost: {
        // Boost newer properties
        completion_date: 1.2,
        // Boost available properties
        availability: 1.5,
        // Boost help to buy eligible for first-time buyers
        help_to_buy: 1.3
      }
    };
    
    return searchQuery;
  }
  
  /**
   * Execute search against database (mock implementation)
   */
  private async executeSearch(searchQuery: any, page: number, limit: number): Promise<any[]> {
    // Mock data representing Kevin's developments
    const mockUnits = [
      {
        id: 'unit-ellwood-01',
        developmentId: 'dev-ellwood',
        developmentName: 'Ellwood',
        unitNumber: 'House 1',
        type: '4 Bed Semi-Detached',
        bedrooms: 4,
        bathrooms: 3,
        livingAreas: 2,
        floorArea: 140,
        basePrice: 275000,
        status: 'Sold',
        completionDate: new Date('2024-06-15'),
        features: ['Modern Kitchen', 'Energy Efficient', 'Garden', 'Parking'],
        images: ['/images/ellwood-1.jpg'],
        description: 'Spacious family home in established development',
        location: {
          address: 'Ellwood, Drogheda',
          area: 'Drogheda',
          county: 'Louth',
          coordinates: { lat: 53.7175, lng: -6.3478 }
        },
        financing: {
          monthlyPayment: 1250,
          deposit: 27500,
          helpToBuyEligible: true
        },
        investment: {
          estimatedRentalYield: 6.2,
          pricePerSqFt: 1964,
          growthPotential: 'High'
        }
      },
      {
        id: 'unit-ballymakenny-01',
        developmentId: 'dev-ballymakenny',
        developmentName: 'Ballymakenny View',
        unitNumber: 'House 1',
        type: '3 Bed Townhouse',
        bedrooms: 3,
        bathrooms: 2,
        livingAreas: 2,
        floorArea: 120,
        basePrice: 315000,
        status: 'Sold',
        completionDate: new Date('2024-09-30'),
        features: ['Open Plan Living', 'Modern Kitchen', 'Garden', 'Parking'],
        images: ['/images/ballymakenny-1.jpg'],
        description: 'Contemporary townhouse with modern amenities',
        location: {
          address: 'Ballymakenny View, Drogheda',
          area: 'Drogheda',
          county: 'Louth',
          coordinates: { lat: 53.7190, lng: -6.3520 }
        },
        financing: {
          monthlyPayment: 1430,
          deposit: 31500,
          helpToBuyEligible: true
        },
        investment: {
          estimatedRentalYield: 5.8,
          pricePerSqFt: 2625,
          growthPotential: 'Medium'
        }
      },
      {
        id: 'unit-fitzgerald-01',
        developmentId: 'dev-fitzgerald',
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'House 1',
        type: '4 Bed Semi-Detached',
        bedrooms: 4,
        bathrooms: 3,
        livingAreas: 3,
        floorArea: 155,
        basePrice: 495000,
        status: 'Available',
        completionDate: new Date('2025-03-31'),
        features: ['Premium Kitchen', 'Smart Home', 'Large Garden', 'Double Garage'],
        images: ['/images/fitzgerald-1.jpg'],
        description: 'Luxury family home with premium finishes',
        location: {
          address: 'Fitzgerald Gardens, Drogheda',
          area: 'Drogheda',
          county: 'Louth',
          coordinates: { lat: 53.7205, lng: -6.3565 }
        },
        financing: {
          monthlyPayment: 2250,
          deposit: 49500,
          helpToBuyEligible: true
        },
        investment: {
          estimatedRentalYield: 4.8,
          pricePerSqFt: 3194,
          growthPotential: 'High'
        }
      },
      {
        id: 'unit-fitzgerald-02',
        developmentId: 'dev-fitzgerald',
        developmentName: 'Fitzgerald Gardens',
        unitNumber: 'Apartment 2A',
        type: '2 Bed Apartment',
        bedrooms: 2,
        bathrooms: 2,
        livingAreas: 1,
        floorArea: 85,
        basePrice: 235000,
        status: 'Available',
        completionDate: new Date('2025-03-31'),
        features: ['Modern Kitchen', 'Balcony', 'Parking Space'],
        images: ['/images/fitzgerald-apt-1.jpg'],
        description: 'Modern apartment ideal for young professionals',
        location: {
          address: 'Fitzgerald Gardens, Drogheda',
          area: 'Drogheda',
          county: 'Louth',
          coordinates: { lat: 53.7205, lng: -6.3565 }
        },
        financing: {
          monthlyPayment: 1070,
          deposit: 23500,
          helpToBuyEligible: true
        },
        investment: {
          estimatedRentalYield: 7.2,
          pricePerSqFt: 2765,
          growthPotential: 'Medium'
        }
      }
    ];
    
    // Apply filters
    let filteredUnits = mockUnits;
    
    if (searchQuery.filters.priceRange) {
      filteredUnits = filteredUnits.filter(unit => {
        const price = unit.basePrice;
        return (!searchQuery.filters.priceRange.min || price >= searchQuery.filters.priceRange.min) &&
               (!searchQuery.filters.priceRange.max || price <= searchQuery.filters.priceRange.max);
      });
    }
    
    if (searchQuery.filters.bedrooms) {
      filteredUnits = filteredUnits.filter(unit => {
        const bedrooms = unit.bedrooms;
        return (!searchQuery.filters.bedrooms.min || bedrooms >= searchQuery.filters.bedrooms.min) &&
               (!searchQuery.filters.bedrooms.max || bedrooms <= searchQuery.filters.bedrooms.max);
      });
    }
    
    if (searchQuery.filters.availabilityStatus?.length) {
      filteredUnits = filteredUnits.filter(unit => 
        searchQuery.filters.availabilityStatus.includes(unit.status)
      );
    }
    
    if (searchQuery.filters.propertyType?.length) {
      filteredUnits = filteredUnits.filter(unit => 
        searchQuery.filters.propertyType.includes(unit.type)
      );
    }
    
    if (searchQuery.filters.helpToBuy) {
      filteredUnits = filteredUnits.filter(unit => unit.financing.helpToBuyEligible);
    }
    
    // Apply text search
    if (searchQuery.textSearch) {
      const query = searchQuery.textSearch.toLowerCase();
      filteredUnits = filteredUnits.filter(unit => 
        unit.developmentName.toLowerCase().includes(query) ||
        unit.type.toLowerCase().includes(query) ||
        unit.description.toLowerCase().includes(query) ||
        unit.location.area.toLowerCase().includes(query) ||
        unit.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    return filteredUnits;
  }
  
  /**
   * Calculate search relevance score
   */
  private calculateSearchScore(unit: any, query: string, filters: SearchFilters): number {
    let score = 100; // Base score
    
    // Boost available properties
    if (unit.status === 'Available') score += 20;
    
    // Boost help to buy eligible if filter is set
    if (filters.helpToBuy && unit.financing.helpToBuyEligible) score += 15;
    
    // Boost based on text match relevance
    if (query) {
      const queryLower = query.toLowerCase();
      if (unit.developmentName.toLowerCase().includes(queryLower)) score += 25;
      if (unit.type.toLowerCase().includes(queryLower)) score += 20;
      if (unit.features.some((f: string) => f.toLowerCase().includes(queryLower))) score += 10;
    }
    
    // Boost newer properties
    const completionDate = new Date(unit.completionDate);
    const now = new Date();
    if (completionDate > now) score += 10; // Future completion
    
    // Boost based on value
    const pricePerSqFt = unit.investment.pricePerSqFt;
    if (pricePerSqFt < 2500) score += 15; // Good value
    
    return Math.min(score, 200); // Cap at 200
  }
  
  /**
   * Generate match reasons for search results
   */
  private generateMatchReasons(unit: any, query: string, filters: SearchFilters): string[] {
    const reasons = [];
    
    if (filters.helpToBuy && unit.financing.helpToBuyEligible) {
      reasons.push('Help to Buy eligible');
    }
    
    if (unit.status === 'Available') {
      reasons.push('Available now');
    }
    
    if (unit.investment.estimatedRentalYield > 6.0) {
      reasons.push('High rental yield');
    }
    
    if (unit.features.includes('Modern Kitchen')) {
      reasons.push('Modern kitchen included');
    }
    
    if (unit.features.includes('Garden')) {
      reasons.push('Private garden');
    }
    
    if (unit.investment.pricePerSqFt < 2500) {
      reasons.push('Excellent value per sq ft');
    }
    
    return reasons.slice(0, 3); // Limit to top 3 reasons
  }
  
  /**
   * Sort search results
   */
  private sortResults(units: any[], sort: SearchSort): any[] {
    return units.sort((a, b) => {
      let aValue, bValue;
      
      switch (sort.field) {
        case 'price':
          aValue = a.basePrice;
          bValue = b.basePrice;
          break;
        case 'size':
          aValue = a.floorArea;
          bValue = b.floorArea;
          break;
        case 'bedrooms':
          aValue = a.bedrooms;
          bValue = b.bedrooms;
          break;
        case 'completion':
          aValue = new Date(a.completionDate).getTime();
          bValue = new Date(b.completionDate).getTime();
          break;
        case 'yield':
          aValue = a.investment.estimatedRentalYield || 0;
          bValue = b.investment.estimatedRentalYield || 0;
          break;
        default:
          aValue = a.searchScore;
          bValue = b.searchScore;
      }
      
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }
  
  /**
   * Generate search aggregations for filter UI
   */
  private generateAggregations(units: any[]): any {
    const aggregations = {
      priceRanges: [
        { range: 'Under €250k', count: units.filter(u => u.basePrice < 250000).length },
        { range: '€250k - €350k', count: units.filter(u => u.basePrice >= 250000 && u.basePrice < 350000).length },
        { range: '€350k - €450k', count: units.filter(u => u.basePrice >= 350000 && u.basePrice < 450000).length },
        { range: 'Over €450k', count: units.filter(u => u.basePrice >= 450000).length }
      ],
      bedroomCounts: [],
      propertyTypes: [],
      developments: [],
      availabilityStatus: []
    };
    
    // Calculate bedroom counts
    const bedroomCounts = new Map();
    units.forEach(unit => {
      bedroomCounts.set(unit.bedrooms, (bedroomCounts.get(unit.bedrooms) || 0) + 1);
    });
    aggregations.bedroomCounts = Array.from(bedroomCounts.entries())
      .map(([bedrooms, count]) => ({ bedrooms, count }));
    
    // Calculate property types
    const propertyTypes = new Map();
    units.forEach(unit => {
      propertyTypes.set(unit.type, (propertyTypes.get(unit.type) || 0) + 1);
    });
    aggregations.propertyTypes = Array.from(propertyTypes.entries())
      .map(([type, count]) => ({ type, count }));
    
    // Calculate developments
    const developments = new Map();
    units.forEach(unit => {
      developments.set(unit.developmentName, (developments.get(unit.developmentName) || 0) + 1);
    });
    aggregations.developments = Array.from(developments.entries())
      .map(([name, count]) => ({ name, count }));
    
    // Calculate availability status
    const availabilityStatus = new Map();
    units.forEach(unit => {
      availabilityStatus.set(unit.status, (availabilityStatus.get(unit.status) || 0) + 1);
    });
    aggregations.availabilityStatus = Array.from(availabilityStatus.entries())
      .map(([status, count]) => ({ status, count }));
    
    return aggregations;
  }
  
  /**
   * Generate search suggestions
   */
  private generateSuggestions(query: string, filters: SearchFilters): string[] {
    const suggestions = [];
    
    if (!query && Object.keys(filters).length === 0) {
      suggestions.push(
        'Try searching for "3 bedroom house"',
        'Filter by "help to buy eligible"',
        'Search "Fitzgerald Gardens"',
        'Look for "investment properties"'
      );
    } else {
      suggestions.push(
        'Refine your search with price range',
        'Add bedroom count filter',
        'Filter by completion date',
        'Save this search for alerts'
      );
    }
    
    return suggestions;
  }
  
  /**
   * Track search for analytics
   */
  private trackSearch(userId: string, query: string, filters: SearchFilters, resultCount: number): void {
    console.log('Search tracked:', {
      userId,
      query,
      filters,
      resultCount,
      timestamp: new Date()
    });
  }
}

// Export singleton instance
export const searchService = new SearchService();