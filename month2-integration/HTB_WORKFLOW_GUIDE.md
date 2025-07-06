# HTB (Help to Buy) Manual Workflow for ROS.ie Integration

## 🏠 Help to Buy Scheme Integration Guide

**Context**: As confirmed by the user: *"there is no government api we are going to go on to ROS.ie and put in the detail manually, but we will manage each buyer through the portal as the developer. As the buyer they will get the claim code and access code and then we will claim the money and confirm it has happened"*

---

## 🔄 HTB Workflow Overview

### Manual Process Flow
1. **Buyer Application** → PROP.ie Platform
2. **Developer Management** → PROP.ie Portal 
3. **Manual Submission** → ROS.ie Government Portal
4. **Claim Processing** → Manual verification and confirmation
5. **Platform Update** → Real-time status synchronization

---

## 👥 Stakeholder Roles

### 🏗️ Developer (PROP.ie Platform Manager)
- **Role**: Manages all HTB applications on behalf of buyers
- **Access**: Full PROP.ie developer portal with HTB management dashboard
- **Responsibilities**: Submit applications to ROS.ie, track claim progress, update buyer status

### 🏡 Buyer (Property Purchaser)
- **Role**: Receives claim codes and access credentials
- **Access**: PROP.ie buyer portal for status tracking
- **Responsibilities**: Provide required documentation, complete property purchase

### 🏛️ ROS.ie (Revenue Online Service)
- **Role**: Government portal for HTB scheme administration
- **Process**: Manual data entry and processing of HTB claims
- **Output**: Claim codes, access codes, and grant approval

---

## 📋 Step-by-Step HTB Process

### Phase 1: Buyer Application (PROP.ie Platform)

#### 1.1 Buyer Submits HTB Application
```
Location: /buyer/htb/application
Process: Buyer completes HTB eligibility form
Data Captured:
- Personal details (PPS number, income, employment)
- Property details (price, type, location)
- Financial information (savings, mortgage approval)
- First-time buyer status verification
```

#### 1.2 Developer Receives Application
```
Location: /developer/htb/applications
Process: HTB application appears in developer dashboard
Actions Available:
- Review application completeness
- Request additional documentation
- Approve for ROS.ie submission
- Communicate with buyer
```

#### 1.3 Application Validation
```
Platform Checks:
✓ Buyer eligibility (first-time buyer, income limits)
✓ Property eligibility (price limits, new build status)
✓ Documentation completeness
✓ Financial pre-approval status

Status: READY_FOR_SUBMISSION
```

### Phase 2: Manual ROS.ie Submission (Developer Action)

#### 2.1 Developer Accesses ROS.ie
```
Portal: https://www.ros.ie
Section: Help to Buy Scheme
Login: Developer uses own ROS.ie credentials
Process: Manual data entry of buyer application
```

#### 2.2 Data Entry on ROS.ie
```
Required Information:
- Buyer PPS Number
- Property details (address, price, Eircode)
- Purchase contract details
- Developer information
- Legal representative details

Manual Entry Process:
1. Navigate to HTB application form
2. Enter buyer personal details
3. Input property information
4. Upload supporting documents
5. Submit application to Revenue
```

#### 2.3 ROS.ie Processing
```
Government Process:
- Revenue validates application
- Eligibility verification
- Document review
- Decision: Approve/Reject/Request Info

Timeline: 4-6 weeks typically
```

### Phase 3: Claim Code Generation (ROS.ie Output)

#### 3.1 HTB Approval from Revenue
```
ROS.ie Output:
- HTB Claim Code (unique identifier)
- Access Code (for buyer verification)
- Grant Amount (up to €30,000)
- Validity Period (typically 12 months)

Status: APPROVED_FOR_CLAIM
```

#### 3.2 Developer Updates PROP.ie Platform
```
Location: /developer/htb/claims
Process: Developer manually enters claim details
Data Entry:
- HTB Claim Code
- Access Code
- Approved Grant Amount
- Approval Date
- Validity Period

Platform Action: Updates buyer record and sends notifications
```

### Phase 4: Buyer Notification & Access

#### 4.1 Buyer Receives Credentials
```
Notification Method: Email + SMS + Platform notification
Content:
- HTB Claim Code: [12-digit code]
- Access Code: [6-digit verification]
- Grant Amount: €XX,XXX
- Next Steps Instructions
- Validity Date

Platform Status: CLAIM_READY
```

#### 4.2 Buyer Portal Access
```
Location: /buyer/htb/claim-status
Display:
- Claim code and access code
- Grant amount breakdown
- Property completion timeline
- Required next steps
- Status tracking dashboard
```

### Phase 5: Property Completion & Grant Claim

#### 5.1 Property Purchase Completion
```
Process: Buyer completes property purchase
Requirements:
- Mortgage drawdown
- Legal completion
- Property registration
- Stamp duty payment

Developer Action: Confirm completion in PROP.ie platform
```

#### 5.2 HTB Grant Claim Submission
```
ROS.ie Process:
- Developer accesses ROS.ie again
- Submits completion documentation
- Provides evidence of purchase
- Claims HTB grant on behalf of buyer

Required Documents:
- Completion statement
- Property registration
- Mortgage documentation
- Stamp duty receipt
```

#### 5.3 Grant Payment Processing
```
Government Process:
- Revenue validates completion
- Verifies compliance with scheme rules
- Processes grant payment
- Payment typically within 2-4 weeks

Payment Method: Direct to buyer's account or solicitor
```

### Phase 6: Final Confirmation & Platform Update

#### 6.1 Developer Confirms Grant Payment
```
Location: /developer/htb/claims/[claim-id]
Process: Developer updates claim status
Data Entry:
- Payment confirmation date
- Payment amount received
- Any variations or issues
- Final completion notes

Platform Action: Updates all stakeholder dashboards
```

#### 6.2 Buyer Receives Final Confirmation
```
Notification: "HTB Grant Payment Confirmed"
Details:
- Grant amount: €XX,XXX
- Payment date
- Final claim reference
- Transaction complete status

Platform Status: CLAIM_COMPLETED
```

---

## 💻 PROP.ie Platform Integration

### HTB Database Schema
```sql
-- HTB Claims Management
CREATE TABLE htb_claims (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  developer_id UUID REFERENCES users(id),
  
  -- Application Data
  application_date TIMESTAMP,
  gross_income DECIMAL(10,2),
  property_price DECIMAL(10,2),
  mortgage_amount DECIMAL(10,2),
  
  -- ROS.ie Integration Data
  claim_code VARCHAR(20),
  access_code VARCHAR(10),
  ros_reference VARCHAR(50),
  
  -- Grant Information
  approved_amount DECIMAL(10,2),
  approval_date TIMESTAMP,
  validity_date TIMESTAMP,
  
  -- Status Tracking
  status HTB_STATUS,
  payment_received BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### HTB Status Flow
```typescript
enum HTB_STATUS {
  'APPLICATION_SUBMITTED',
  'UNDER_REVIEW',
  'READY_FOR_ROS_SUBMISSION',
  'SUBMITTED_TO_ROS',
  'PENDING_REVENUE_APPROVAL',
  'APPROVED_FOR_CLAIM',
  'CLAIM_READY',
  'PROPERTY_COMPLETION_PENDING',
  'CLAIM_SUBMITTED',
  'PAYMENT_PROCESSING',
  'CLAIM_COMPLETED',
  'REJECTED',
  'EXPIRED'
}
```

### Developer Dashboard Features
```typescript
// HTB Management Dashboard
interface HTBDashboard {
  // Application Management
  pendingApplications: HTBApplication[];
  readyForSubmission: HTBApplication[];
  
  // ROS.ie Workflow
  submissionQueue: HTBApplication[];
  awaitingApproval: HTBApplication[];
  
  // Claim Management
  activeClaims: HTBClaim[];
  completionPending: HTBClaim[];
  
  // Analytics
  approvalRate: number;
  averageProcessingTime: number;
  totalGrantsProcessed: number;
}
```

### Buyer Portal Features
```typescript
// Buyer HTB Tracking
interface BuyerHTBPortal {
  // Application Status
  applicationProgress: HTBProgress;
  requiredDocuments: Document[];
  
  // Claim Information
  claimCode: string;
  accessCode: string;
  grantAmount: number;
  validityDate: Date;
  
  // Next Steps
  nextActions: ActionItem[];
  timelineEstimate: TimelineItem[];
}
```

---

## 📊 Workflow Automation in PROP.ie

### Automated Notifications
```typescript
// Email/SMS Automation
const htbNotifications = {
  applicationReceived: 'HTB application received and under review',
  documentationRequired: 'Additional documents needed for HTB application',
  readyForSubmission: 'Application ready for ROS.ie submission',
  claimCodesReceived: 'HTB claim codes available - check your portal',
  completionReminder: 'Property completion required for HTB claim',
  grantProcessing: 'HTB grant payment is being processed',
  grantCompleted: 'HTB grant payment confirmed - €{amount} received'
};
```

### Status Tracking Dashboard
```typescript
// Real-time Status Updates
interface HTBStatusTracker {
  currentStage: HTB_STATUS;
  completedSteps: string[];
  nextSteps: ActionItem[];
  estimatedTimeline: {
    rosSubmission: Date;
    expectedApproval: Date;
    claimWindow: DateRange;
    completionDeadline: Date;
  };
  communicationLog: Communication[];
}
```

### Document Management
```typescript
// HTB Document Workflow
interface HTBDocuments {
  // Required for Application
  incomeVerification: Document;
  employmentLetter: Document;
  bankStatements: Document[];
  mortgageApproval: Document;
  
  // Required for Claim
  purchaseContract: Document;
  completionStatement: Document;
  propertyRegistration: Document;
  stampDutyReceipt: Document;
  
  // Platform Generated
  htbApplication: Document;
  claimSubmission: Document;
  grantConfirmation: Document;
}
```

---

## 🔧 Implementation Guide

### Developer Training Requirements
```markdown
1. **ROS.ie Portal Training**
   - Account setup and access
   - HTB application process
   - Document upload procedures
   - Status checking and updates

2. **PROP.ie Platform Training**
   - HTB dashboard navigation
   - Application review process
   - Claim code entry procedures
   - Buyer communication tools

3. **Compliance Training**
   - HTB scheme eligibility rules
   - Documentation requirements
   - Timeline management
   - Error handling procedures
```

### Quality Assurance Checklist
```markdown
□ Buyer eligibility verified before ROS.ie submission
□ All required documentation collected and validated
□ Property meets HTB scheme criteria
□ ROS.ie submission completed accurately
□ Claim codes entered correctly in PROP.ie platform
□ Buyer notifications sent and confirmed
□ Property completion timeline tracked
□ Grant claim submitted on time
□ Payment confirmation recorded
□ All stakeholders notified of completion
```

### Error Handling Procedures
```markdown
**Common Issues & Solutions:**

1. **ROS.ie Rejection**
   - Review rejection reasons
   - Collect additional documentation
   - Resubmit corrected application
   - Update buyer with new timeline

2. **Missing Claim Codes**
   - Check ROS.ie portal for updates
   - Contact Revenue if necessary
   - Provide interim status to buyer
   - Escalate if beyond normal timeframe

3. **Property Completion Delays**
   - Monitor validity period closely
   - Communicate delays to all parties
   - Apply for extensions if available
   - Have contingency plans ready

4. **Payment Processing Issues**
   - Verify completion documentation
   - Follow up with Revenue directly
   - Provide regular updates to buyer
   - Maintain detailed audit trail
```

---

## 📞 Support & Escalation

### Contact Information
- **ROS.ie Support**: 01-738-3684 (Revenue Helpline)
- **HTB Scheme Queries**: ros-helpdesk@revenue.ie
- **PROP.ie Technical Support**: support@prop.ie
- **Emergency Developer Line**: [Internal escalation process]

### Escalation Matrix
1. **Level 1**: Platform support team
2. **Level 2**: HTB workflow specialist
3. **Level 3**: Developer relations manager
4. **Level 4**: Revenue liaison contact

---

## 📈 Success Metrics

### Key Performance Indicators
- **Application Approval Rate**: Target >85%
- **Average Processing Time**: Target <6 weeks
- **Claim Success Rate**: Target >95%
- **Buyer Satisfaction**: Target >4.5/5
- **Developer Efficiency**: Target <2 hours per application

### Monitoring Dashboard
```typescript
interface HTBMetrics {
  totalApplications: number;
  approvalRate: number;
  averageTimeToApproval: number;
  totalGrantsProcessed: number;
  developerProductivity: number;
  buyerSatisfactionScore: number;
}
```

---

**✅ This manual workflow ensures seamless HTB processing through the PROP.ie platform while maintaining compliance with Revenue requirements and providing excellent buyer experience.**

---

*Document Version: 1.0*  
*Last Updated: June 18, 2025*  
*Implementation Status: Ready for Developer Training*