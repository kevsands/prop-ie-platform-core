# PROP.ie MVP Development Roadmap

## MVP Focus: Help-to-Buy Application Management

### Why HTB First?
- **Government-backed scheme** = real, verifiable data
- **Clear pain point**: Manual, slow application process
- **Defined stakeholders**: First-time buyers, developers, Revenue.ie
- **Measurable success**: Application approval time reduction

## MVP Features (16 weeks)

### Week 9-10: HTB Application Portal
```typescript
// Real HTB application form with Revenue.ie integration
interface HTBApplication {
  applicantDetails: {
    ppsNumber: string;
    fullName: string;
    dateOfBirth: Date;
    address: string;
    eircode: string;
  };
  financialDetails: {
    annualIncome: number;
    employmentStatus: string;
    bankStatements: File[];
    p60Documents: File[];
  };
  propertyDetails: {
    propertyId: string;
    salePrice: number;
    deposit: number;
    mortgageAmount: number;
    requestedHTBAmount: number;
  };
}
```

### Week 11-12: Developer Integration
- **Real developer onboarding**: Cairn Homes, Glenveagh, etc.
- **Property listing with HTB eligibility**
- **Automated HTB amount calculation**
- **Application status tracking**

### Week 13-14: Revenue.ie API Integration
```typescript
// Real government API integration
class RevenueHTBService {
  async submitApplication(application: HTBApplication) {
    // Submit to Revenue.ie HTB portal
    const response = await fetch('https://revenue.ie/api/htb/applications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVENUE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(application)
    });
    
    return response.json();
  }
  
  async checkApplicationStatus(referenceNumber: string) {
    // Real status checking
  }
}
```

### Week 15-16: Real User Testing
- **5-10 real first-time buyers** using the system
- **2-3 real developers** listing properties
- **Measure**: Application submission time vs manual process

## Success Metrics for MVP

### Quantifiable Goals
1. **Reduce HTB application time** from 6 weeks to 2 weeks
2. **Process 50 real applications** in first 3 months
3. **Achieve 90% application accuracy** (no Revenue.ie rejections due to errors)
4. **Onboard 3 real developers** with active listings

### Real Business Value
- **For Buyers**: Faster HTB approval = quicker home purchase
- **For Developers**: Higher conversion rates from HTB-eligible prospects  
- **For Revenue.ie**: Reduced manual processing overhead
- **For PROP.ie**: Proven value proposition for scaling

## Technical Implementation

### Real Data Flow
```
1. Buyer browses HTB-eligible properties (real listings)
2. Applies for HTB through PROP.ie (real form)
3. System validates with PPS/Revenue databases (real APIs)
4. Application submitted to Revenue.ie (real government system)
5. Status updates sync back to PROP.ie (real-time)
6. Developer gets notified of HTB approval (real notifications)
7. Transaction proceeds with verified HTB funding (real money)
```

### Required Integrations
- **Revenue.ie HTB Portal API**
- **PPS Number validation service**
- **Bank account verification APIs**
- **Property Registration Authority**
- **Developer CRM systems**

## Phase 4: Validation & Scaling (Weeks 17-24)

### Real Market Validation
1. **Track actual outcomes**: How many applications completed vs traditional route?
2. **Measure satisfaction**: NPS scores from real users
3. **Financial validation**: Revenue per transaction
4. **Regulatory approval**: Revenue.ie partnership validation

### Scaling Strategy
1. **Geographic expansion**: Dublin → Cork → Galway
2. **Feature expansion**: HTB → Full transaction management
3. **Stakeholder expansion**: Add solicitors, mortgage brokers
4. **Data expansion**: Market analytics, price predictions

## Investment & Resources Needed

### Technical Team (6 months)
- **1 Full-stack developer** (React/Node.js/PostgreSQL)
- **1 Backend/API specialist** (Government API integrations)
- **1 UI/UX designer** (Forms, user experience)
- **1 DevOps engineer** (AWS, security, compliance)

### Business Development
- **Legal consultant** (Data protection, compliance)
- **Business development** (Developer partnerships)
- **Customer success** (User onboarding, support)

### Estimated Budget
- **Development**: €150k (6 months)
- **Legal/Compliance**: €25k
- **Marketing/BD**: €50k
- **Infrastructure**: €20k
- **Total**: €245k for validated MVP

## Expected Timeline to Real Revenue

- **Month 6**: MVP launched with real HTB applications
- **Month 9**: 50+ real transactions processed
- **Month 12**: €500k+ in facilitated property sales
- **Month 18**: Break-even on transaction fees
- **Month 24**: €2M+ annual recurring revenue

This approach focuses on solving ONE real problem extremely well, with real data, real users, and real business value before expanding.