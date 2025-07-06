# Real PROP.ie Database Schema

## Core Business Entities

### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  address TEXT NOT NULL,
  eircode VARCHAR(8),
  county VARCHAR(50),
  property_type VARCHAR(50), -- apartment, house, townhouse
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_footage INTEGER,
  ber_rating VARCHAR(3),
  built_year INTEGER,
  developer_id UUID REFERENCES developers(id),
  project_id UUID REFERENCES projects(id),
  status VARCHAR(20), -- available, reserved, sold, under_construction
  asking_price DECIMAL(12,2),
  htb_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Real Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES buyers(id),
  developer_id UUID REFERENCES developers(id),
  agent_id UUID REFERENCES agents(id),
  solicitor_id UUID REFERENCES solicitors(id),
  
  -- Real financial data
  sale_price DECIMAL(12,2),
  deposit_amount DECIMAL(10,2),
  mortgage_amount DECIMAL(12,2),
  htb_amount DECIMAL(10,2),
  
  -- Transaction stages
  status VARCHAR(30), -- inquiry, viewing, offer, accepted, contracts, completion
  inquiry_date TIMESTAMP,
  viewing_date TIMESTAMP,
  offer_date TIMESTAMP,
  contract_date TIMESTAMP,
  completion_date TIMESTAMP,
  
  -- Real documents
  booking_form_signed BOOLEAN DEFAULT false,
  mortgage_approved BOOLEAN DEFAULT false,
  htb_approved BOOLEAN DEFAULT false,
  contracts_exchanged BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Developers Table (Real Companies)
```sql
CREATE TABLE developers (
  id UUID PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  company_registration VARCHAR(20), -- CRO number
  vat_number VARCHAR(20),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  
  -- Real business metrics
  projects_completed INTEGER DEFAULT 0,
  units_sold_total INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  
  -- Compliance
  building_control_cert BOOLEAN DEFAULT false,
  insurance_valid_until DATE,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### HTB Applications (Real Government Scheme)
```sql
CREATE TABLE htb_applications (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES buyers(id),
  property_id UUID REFERENCES properties(id),
  
  -- Real HTB data
  pps_number VARCHAR(10), -- encrypted
  annual_income DECIMAL(10,2),
  first_time_buyer BOOLEAN,
  application_date DATE,
  approval_date DATE,
  htb_amount DECIMAL(10,2),
  
  -- Status tracking
  status VARCHAR(30), -- pending, approved, rejected, paid
  revenue_reference VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Real Data Integration Points

### External APIs to Connect
1. **Property Registration Authority** - Real property data
2. **Revenue.ie HTB API** - Help-to-Buy applications  
3. **CSO Housing Statistics** - Market data
4. **Banking APIs** - Mortgage pre-approval
5. **Eircode API** - Address validation
6. **Planning Permission DBs** - Development status

### Real Metrics to Track
- Actual sale prices vs asking prices
- Time from inquiry to sale completion
- HTB approval rates and timelines
- Regional price variations
- Developer completion rates
- Buyer satisfaction scores (real surveys)

## Implementation Priority
1. **Week 1**: Properties and basic transactions
2. **Week 2**: User management (buyers, developers, agents)
3. **Week 3**: HTB integration with Revenue.ie
4. **Week 4**: External API connections
5. **Week 5**: Real-time analytics and reporting