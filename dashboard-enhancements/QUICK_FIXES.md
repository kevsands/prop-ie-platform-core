# Quick Implementation Fixes - PropIE Platform

## 1. Create Transaction Context (Today)

Create a central transaction context that all stakeholders can access:

```typescript
// src/context/TransactionContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  developerId: string;
  agentId?: string;
  solicitorId?: string;
  status: 'DRAFT' | 'RESERVED' | 'CONTRACTED' | 'CLOSING' | 'COMPLETED';
  documents: Document[];
  communications: Message[];
  timeline: TimelineEvent[];
  payments: Payment[];
}

interface TransactionContextType {
  currentTransaction: Transaction | null;
  setCurrentTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (status: string) => void;
  addDocument: (document: Document) => void;
  sendMessage: (message: Message) => void;
}

const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);

export const useTransaction = () => useContext(TransactionContext);
```

## 2. Unified Dashboard Component (Today)

Create a unified dashboard that adapts based on user role:

```typescript
// src/components/dashboard/UnifiedDashboard.tsx
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';

export const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { currentTransaction } = useTransaction();

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Transaction Status - Visible to all */}
      <div className="col-span-12">
        <TransactionStatus transaction={currentTransaction} />
      </div>

      {/* Role-specific content */}
      {user?.role === 'DEVELOPER' && <DeveloperDashboard />}
      {user?.role === 'BUYER' && <BuyerDashboard />}
      {user?.role === 'AGENT' && <AgentDashboard />}
      {user?.role === 'SOLICITOR' && <SolicitorDashboard />}

      {/* Shared components */}
      <div className="col-span-4">
        <ParticipantsList transaction={currentTransaction} />
      </div>
      
      <div className="col-span-4">
        <DocumentCenter transaction={currentTransaction} />
      </div>
      
      <div className="col-span-4">
        <CommunicationHub transaction={currentTransaction} />
      </div>
    </div>
  );
};
```

## 3. Fix Route Structure (Today)

Reorganize routes to be transaction-centric:

```
src/app/
├── transactions/
│   ├── [id]/
│   │   ├── page.tsx (Transaction detail - adapts by role)
│   │   ├── documents/
│   │   ├── messages/
│   │   ├── timeline/
│   │   └── payments/
│   └── new/
│       └── page.tsx (Create new transaction)
├── dashboard/
│   └── page.tsx (User-specific dashboard)
├── profile/
│   └── page.tsx (User profile management)
└── auth/
    ├── login/
    └── register/
```

## 4. Create Navigation Component (Today)

Build a smart navigation that shows relevant options based on user role:

```typescript
// src/components/navigation/SmartNav.tsx
export const SmartNav = () => {
  const { user } = useAuth();
  const router = useRouter();

  const navigationItems = {
    DEVELOPER: [
      { label: 'Projects', href: '/projects' },
      { label: 'Transactions', href: '/transactions' },
      { label: 'Analytics', href: '/analytics' },
    ],
    BUYER: [
      { label: 'Property Search', href: '/properties' },
      { label: 'My Transactions', href: '/transactions' },
      { label: 'Documents', href: '/documents' },
    ],
    AGENT: [
      { label: 'Listings', href: '/listings' },
      { label: 'Leads', href: '/leads' },
      { label: 'Transactions', href: '/transactions' },
    ],
    SOLICITOR: [
      { label: 'Cases', href: '/cases' },
      { label: 'Documents', href: '/documents' },
      { label: 'Clients', href: '/clients' },
    ],
  };

  return (
    <nav>
      {navigationItems[user?.role as keyof typeof navigationItems]?.map(item => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

## 5. Transaction Flow Visualization (Tomorrow)

Create a visual transaction flow component that shows current status:

```typescript
// src/components/transaction/TransactionFlow.tsx
export const TransactionFlow = ({ transaction }: { transaction: Transaction }) => {
  const stages = [
    { id: 'SEARCH', label: 'Property Search', completed: true },
    { id: 'OFFER', label: 'Offer Made', completed: true },
    { id: 'ACCEPTED', label: 'Offer Accepted', completed: true },
    { id: 'LEGAL', label: 'Legal Process', active: true },
    { id: 'MORTGAGE', label: 'Mortgage Approval', pending: true },
    { id: 'CLOSING', label: 'Closing', pending: true },
    { id: 'COMPLETE', label: 'Completed', pending: true },
  ];

  return (
    <div className="relative">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${stage.completed ? 'bg-green-500' : stage.active ? 'bg-blue-500' : 'bg-gray-300'}
          `}>
            {stage.completed && <CheckIcon />}
            {stage.active && <Spinner />}
          </div>
          <span className="ml-3">{stage.label}</span>
          {index < stages.length - 1 && (
            <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};
```

## Implementation Priority

1. **Today**: 
   - Create TransactionContext
   - Build UnifiedDashboard component
   - Implement SmartNav

2. **Tomorrow**:
   - Create transaction flow visualization
   - Build participant management
   - Implement real-time notifications

3. **This Week**:
   - Connect all existing pages to TransactionContext
   - Implement document workflow
   - Add payment processing hooks
   - Create communication hub

## Testing Plan

1. Create test transaction with all stakeholders
2. Verify each role can see appropriate information
3. Test status updates propagate to all users
4. Ensure documents flow between parties
5. Validate payment processing works

## Success Metrics

- All stakeholders can view same transaction
- Status updates are real-time
- Documents are accessible by right parties
- Communication flows seamlessly
- UI adapts based on user role