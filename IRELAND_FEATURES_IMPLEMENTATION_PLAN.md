# Ireland-Specific Features Implementation Plan

## Executive Summary
This document outlines the implementation plan for missing Ireland-specific features identified in the platform audit. These features are critical for full Irish market compliance and competitiveness.

## Priority 1: Critical for Irish Market (Q1 2025)

### 1. Property Price Register Integration
**Timeline:** 4 weeks  
**Dependencies:** API access from Property Services Regulatory Authority

```typescript
interface PropertyPriceRegisterAPI {
  searchSales(params: {
    county: string;
    year: number;
    priceRange?: { min: number; max: number };
  }): Promise<SaleRecord[]>;
  
  getComparables(address: string, radius: number): Promise<Comparable[]>;
  
  submitSale(saleData: CompletedSale): Promise<void>;
}
```

**Implementation Steps:**
1. Register for API access with PSRA
2. Create service wrapper for PPR API
3. Implement comparable property analysis
4. Add automatic sale submission on completion
5. Create UI for price comparison tools

### 2. Central Bank Mortgage Rules Engine
**Timeline:** 3 weeks  
**Dependencies:** None (rule-based implementation)

```typescript
interface MortgageRulesEngine {
  calculateMaxLoan(params: {
    income: number;
    isFirstTimeBuyer: boolean;
    propertyValue: number;
    propertyType: 'PPR' | 'BTL';
  }): MortgageAssessment;
  
  validateLTV(params: {
    loanAmount: number;
    propertyValue: number;
    buyerType: string;
  }): LTVValidation;
}
```

**Rules to Implement:**
- First-time buyers: 90% LTV max
- Second/subsequent buyers: 80% LTV max  
- Buy-to-let: 70% LTV max
- Income multiples: 3.5x gross income
- Exemptions tracking (10% can exceed)

### 3. Stamp Duty Calculator Enhancement
**Timeline:** 2 weeks  
**Dependencies:** None

```typescript
interface StampDutyCalculator {
  calculate(params: {
    propertyValue: number;
    buyerType: 'RESIDENTIAL' | 'NON_RESIDENTIAL';
    isFirstTimeBuyer: boolean;
    propertyType: 'NEW' | 'SECOND_HAND';
    multipleProperties?: boolean;
  }): StampDutyResult;
}
```

**Rates to Implement:**
- Residential: 1% up to €1m, 2% on balance
- Non-residential: 7.5% 
- Refund scheme for new homes
- Multiple property surcharge (10%)

### 4. PSRA License Verification
**Timeline:** 2 weeks  
**Dependencies:** PSRA API or web scraping

```typescript
interface PSRAVerification {
  verifyLicense(licenseNumber: string): Promise<PSRALicense>;
  validateAgent(name: string, company: string): Promise<boolean>;
  checkExpiry(license: PSRALicense): boolean;
}
```

### 5. Homebond Warranty Integration
**Timeline:** 3 weeks  
**Dependencies:** Homebond API partnership

```typescript
interface HomebondIntegration {
  registerProperty(development: Development): Promise<HomebondRegistration>;
  verifyWarranty(propertyId: string): Promise<WarrantyStatus>;
  fileClaimm(claim: HomebondClaim): Promise<ClaimReference>;
  generateCertificate(propertyId: string): Promise<PDF>;
}
```

## Priority 2: Important for Compliance (Q2 2025)

### 1. Land Registry Integration
**Timeline:** 6 weeks  
**Dependencies:** Land Registry API access

**Features:**
- Folio search and verification
- Title document retrieval
- Charge registration
- Ownership transfer automation

### 2. BCAR Compliance Tracking
**Timeline:** 4 weeks  
**Dependencies:** Building control system access

**Features:**
- Assigned certifier management
- Inspection stage tracking
- Compliance documentation
- Certificate generation

### 3. Revenue Integration
**Timeline:** 4 weeks  
**Dependencies:** Revenue Online Service (ROS) API

**Features:**
- Tax clearance certificate verification
- HTB claim submission
- Stamp duty returns
- CGT calculations for investors

### 4. Part V Social Housing Calculator
**Timeline:** 2 weeks  
**Dependencies:** Local authority requirements

**Features:**
- 10% social housing requirement
- Cash contribution calculator
- Unit allocation tracker
- Compliance reporting

## Priority 3: Market Differentiators (Q3 2025)

### 1. Snag List Management System
**Timeline:** 4 weeks  
**Dependencies:** None

```typescript
interface SnagListSystem {
  createInspection(propertyId: string): Inspection;
  addSnag(snag: {
    location: string;
    description: string;
    severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
    photo?: string;
  }): void;
  trackResolution(snagId: string, status: string): void;
  generateReport(): PDF;
}
```

### 2. Irish Bank Direct Integration
**Timeline:** 8 weeks  
**Dependencies:** Bank partnerships

**Target Banks:**
- AIB
- Bank of Ireland  
- Permanent TSB
- Ulster Bank
- KBC (if still operating)

**Features:**
- Mortgage application API
- Direct debit setup
- Balance verification
- Document exchange

### 3. Eircode Integration
**Timeline:** 1 week  
**Dependencies:** Eircode API license

```typescript
interface EircodeService {
  lookup(eircode: string): Promise<Address>;
  findEircode(address: Partial<Address>): Promise<string>;
  validateAddress(address: Address): boolean;
}
```

### 4. Local Authority Planning Integration
**Timeline:** 6 weeks  
**Dependencies:** Council system access

**Features:**
- Planning application search
- Permission verification
- Condition tracking
- Compliance certificates

## Implementation Architecture

### 1. Service Layer Structure
```
src/services/ireland/
├── property-price-register/
├── central-bank-rules/
├── revenue-integration/
├── land-registry/
├── homebond/
├── psra/
├── eircode/
├── local-authorities/
└── irish-banks/
```

### 2. Configuration Management
```typescript
// config/ireland-services.ts
export const IRELAND_SERVICES = {
  PPR: {
    baseUrl: process.env.PPR_API_URL,
    apiKey: process.env.PPR_API_KEY,
  },
  REVENUE: {
    rosUrl: process.env.ROS_API_URL,
    certificateAuth: process.env.ROS_CERT,
  },
  // ... other services
}
```

### 3. Feature Flags
```typescript
// Enable gradual rollout
export const IRELAND_FEATURES = {
  PPR_INTEGRATION: process.env.ENABLE_PPR === 'true',
  MORTGAGE_RULES: process.env.ENABLE_CB_RULES === 'true',
  SNAG_LIST: process.env.ENABLE_SNAG_LIST === 'true',
  // ... other features
}
```

## Testing Strategy

### 1. Unit Tests
- Rule engine calculations
- API response parsing
- Data transformations

### 2. Integration Tests
- External API mocking
- Error handling
- Timeout scenarios

### 3. E2E Tests
- Complete user journeys
- Cross-service workflows
- Compliance scenarios

## Estimated Resources

### Development Team
- 2 Senior Full-Stack Developers
- 1 Ireland Market Specialist
- 1 QA Engineer
- 0.5 DevOps Engineer

### Timeline
- Priority 1: 12 weeks
- Priority 2: 16 weeks  
- Priority 3: 16 weeks
- **Total: 44 weeks (11 months)**

### Budget Estimate
- Development: €180,000
- API Licenses: €25,000/year
- Infrastructure: €10,000/year
- **Total Year 1: €215,000**

## Risk Mitigation

### 1. API Availability
- Build fallback mechanisms
- Cache frequently used data
- Manual override options

### 2. Regulatory Changes
- Configurable rules engine
- Regular compliance reviews
- Legal consultation budget

### 3. Integration Complexity
- Phased rollout approach
- Feature flags for control
- Comprehensive monitoring

## Success Metrics

### Technical KPIs
- API uptime > 99.5%
- Response time < 2s
- Error rate < 0.1%

### Business KPIs
- Compliance automation: 80%
- Manual process reduction: 60%
- User satisfaction: > 4.5/5

### Market Impact
- Competitive advantage in speed
- Reduced transaction times
- Increased user trust

## Next Steps

1. **Immediate Actions:**
   - Begin API access applications
   - Set up development environment
   - Create detailed technical specs

2. **Week 1-2:**
   - Finalize architecture design
   - Set up monitoring infrastructure
   - Begin Priority 1 development

3. **Ongoing:**
   - Weekly progress reviews
   - Stakeholder updates
   - Compliance verification