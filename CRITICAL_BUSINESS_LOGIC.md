# Critical Business Logic to Preserve

## 1. Property Customization Engine

### Core Components
- **CustomizationContext** (`/src/context/CustomizationContext.tsx`)
  - Manages all customization state
  - Calculates total costs in real-time
  - Saves/loads configurations
  
- **Price Calculation Algorithm**
  ```typescript
  // Basic: Sum of selected options
  const basicTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
  
  // Advanced: Base + Options + Discounts + VAT
  const subtotal = basePrice + optionsTotal
  const discountAmount = calculateDiscounts(subtotal, options)
  const taxableAmount = subtotal - discountAmount
  const vatAmount = taxableAmount * 0.135 // 13.5% Irish VAT
  const total = taxableAmount + vatAmount
  ```

### 3D Visualization
- Three.js integration for property models
- Real-time material swapping
- Room-based customization interface
- GLTF/GLB model support

## 2. Transaction State Machine

### Phase Transitions
```typescript
const VALID_TRANSITIONS = {
  ENQUIRY: ['VIEWING_SCHEDULED'],
  VIEWING_SCHEDULED: ['VIEWED', 'ENQUIRY'],
  VIEWED: ['RESERVATION', 'ENQUIRY'],
  RESERVATION: ['CONTRACT_ISSUED'],
  CONTRACT_ISSUED: ['CONTRACT_SIGNED'],
  CONTRACT_SIGNED: ['DEPOSIT_PAID'],
  DEPOSIT_PAID: ['MORTGAGE_APPROVED'],
  MORTGAGE_APPROVED: ['CLOSING'],
  CLOSING: ['COMPLETED'],
  COMPLETED: ['HANDED_OVER']
}
```

### Automatic Milestones
- Created automatically on phase transitions
- Tracks completion with dependencies
- Sends notifications to stakeholders
- Maintains audit trail

## 3. Ireland-Specific Calculations

### Help to Buy (HTB)
```typescript
const calculateHTB = (price: number, tax: TaxDetails) => {
  if (price > 500000) return 0 // Property value limit
  
  const totalTax = tax.incomeTax + tax.usc + tax.dirt
  const tenPercentPrice = price * 0.10
  
  return Math.min(totalTax, tenPercentPrice, 30000) // Max €30k
}
```

### Payment Schedule
```typescript
const IRISH_PAYMENT_SCHEDULE = {
  booking: 5000, // Fixed €5,000
  contract: 0.10, // 10% of purchase price
  stage: 'As per construction milestones',
  final: 'Balance on completion'
}
```

## 4. Seller's Legal Pack Components

### Required Documents
1. Title Documents
2. Planning Permission
3. Building Regulations Compliance
4. BER Certificate
5. Service Charge Details
6. Management Company Information
7. Searches (Planning, Judgments)
8. Building Agreements
9. Warranties and Guarantees
10. Fire Safety Certificate

### SLP Validation
```typescript
const validateSLP = (components: SLPComponent[]) => {
  const required = [
    'title_documents',
    'planning_permission',
    'building_compliance',
    'ber_certificate'
  ]
  
  return required.every(req => 
    components.some(c => c.type === req && c.status === 'COMPLETED')
  )
}
```

## 5. Multi-Role Access Control

### Role Permissions
```typescript
const ROLE_PERMISSIONS = {
  BUYER: ['view_properties', 'make_offers', 'track_transaction'],
  DEVELOPER: ['manage_projects', 'view_sales', 'generate_slp'],
  SOLICITOR: ['manage_cases', 'review_documents', 'exchange_contracts'],
  AGENT: ['list_properties', 'schedule_viewings', 'track_commissions'],
  ARCHITECT: ['upload_designs', 'manage_specifications']
}
```

## 6. Payment Processing

### Payment Types
- BOOKING_DEPOSIT: €5,000 fixed
- CONTRACT_DEPOSIT: 10% of purchase price
- STAGE_PAYMENT: Based on construction milestones
- FINAL_PAYMENT: Balance on completion

### Stripe Integration
- Webhook handling for payment events
- Automatic status updates
- Refund processing
- Payment scheduling

## 7. Document Retention Policies

### Legal Requirements (Ireland)
```typescript
const RETENTION_PERIODS = {
  financial_records: 7 * 365, // 7 years
  kyc_documents: 5 * 365,     // 5 years
  contracts: 7 * 365,         // 7 years
  general_documents: 3 * 365, // 3 years
  audit_logs: 90,            // 90 days
  notifications: 90          // 90 days
}
```

## 8. GDPR Compliance

### User Rights Implementation
- Data export functionality
- Right to be forgotten
- Anonymization instead of deletion
- Consent management
- Data retention automation

## 9. Notification System

### Event-Driven Notifications
```typescript
const NOTIFICATION_TRIGGERS = {
  'transaction.phase_changed': ['buyer', 'agent', 'solicitor'],
  'payment.confirmed': ['buyer', 'developer'],
  'document.uploaded': ['solicitor', 'buyer'],
  'milestone.completed': ['all_participants'],
  'slp.updated': ['solicitor', 'buyer']
}
```

## 10. Critical Integrations

### Must Maintain
1. **NextAuth.js** - Authentication system
2. **Stripe** - Payment processing
3. **Prisma** - Database ORM
4. **AWS S3** - Document storage
5. **Google Analytics** - User tracking
6. **Three.js** - 3D visualization

### Database Schema
- Maintain all relationships
- Keep audit fields (createdAt, updatedAt)
- Preserve enum values
- Maintain indexes for performance

## Files Never to Delete
1. `/src/services/transactionCoordinator.ts`
2. `/src/services/paymentService.ts`
3. `/src/services/htbService.ts`
4. `/src/services/slpService.ts`
5. `/src/context/CustomizationContext.tsx`
6. `/src/lib/db/index.ts`
7. `/prisma/schema.prisma`
8. All API route handlers in `/src/app/api/`

## Testing Requirements
- Transaction flow E2E tests
- HTB calculation unit tests
- Payment processing integration tests
- SLP generation tests
- Role-based access tests