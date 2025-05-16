# Real Integration Plan - PropIE Platform

## Current Situation
All components exist but are disconnected. The platform has:
- ✅ All UI components built
- ✅ All contexts and providers created
- ✅ AWS services configured
- ❌ No integration between components
- ❌ Mock data used everywhere
- ❌ Multiple conflicting provider patterns

## Integration Tasks

### 1. Create Unified Provider Architecture

```typescript
// src/app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AmplifyProvider } from '@/components/AmplifyProvider';
import { AuthProvider } from '@/context/AuthContext';
import { TransactionProvider } from '@/context/TransactionContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SecurityProvider } from '@/context/SecurityContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AmplifyProvider>
        <AuthProvider>
          <SecurityProvider>
            <TransactionProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </TransactionProvider>
          </SecurityProvider>
        </AuthProvider>
      </AmplifyProvider>
    </QueryClientProvider>
  );
}
```

### 2. Update Main Layout

```typescript
// src/app/layout.tsx
import { Providers } from './providers';
import { SmartNav } from '@/components/navigation/SmartNav';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <SmartNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
```

### 3. Connect Pages to Real Data

#### Update Dashboard Page
```typescript
// src/app/dashboard/page.tsx
import { useAuth } from '@/context/AuthContext';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';

export default function DashboardPage() {
  return <UnifiedDashboard />;
}
```

#### Update Transaction Pages
```typescript
// src/app/transactions/[id]/page.tsx
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';

export default function TransactionPage({ params }) {
  return <UnifiedDashboard transactionId={params.id} />;
}
```

### 4. Replace Mock Auth with Real Cognito

```typescript
// src/lib/auth.ts - Update to use real AWS Cognito
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

export const authService = {
  async login(email: string, password: string) {
    return await signIn({ username: email, password });
  },
  
  async getCurrentUser() {
    return await getCurrentUser();
  },
  
  async logout() {
    return await signOut();
  }
};
```

### 5. Connect Components to Real APIs

Update TransactionContext to use real API calls:

```typescript
// src/context/TransactionContext.tsx - Update fetchTransaction
const fetchTransaction = async (transactionId: string) => {
  try {
    // Replace mock with real API call
    const transaction = await API.graphql({
      query: getTransaction,
      variables: { id: transactionId }
    });
    setCurrentTransaction(transaction.data.getTransaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
};
```

### 6. Implement Real-time Updates

```typescript
// src/context/TransactionContext.tsx - Add subscriptions
useEffect(() => {
  const subscription = API.graphql({
    query: onUpdateTransaction,
    variables: { id: transactionId }
  }).subscribe({
    next: (data) => {
      setCurrentTransaction(data.value.data.onUpdateTransaction);
    }
  });
  
  return () => subscription.unsubscribe();
}, [transactionId]);
```

## Implementation Order

1. **Day 1**: Consolidate providers and update layout
2. **Day 2**: Fix authentication flow with real Cognito
3. **Day 3**: Connect TransactionContext to real APIs
4. **Day 4**: Update all dashboard pages to use real data
5. **Day 5**: Add real-time subscriptions
6. **Day 6**: Test all stakeholder workflows
7. **Day 7**: Deploy and monitor

## Files to Update

### High Priority
1. `/src/app/layout.tsx` - Add unified providers
2. `/src/app/providers.tsx` - Create unified provider
3. `/src/lib/auth.ts` - Use real Cognito
4. `/src/context/TransactionContext.tsx` - Real API calls
5. `/src/app/dashboard/page.tsx` - Connect to real data

### Medium Priority
6. All role dashboard pages - Remove mock data
7. Transaction pages - Use TransactionContext
8. Navigation components - Ensure proper integration
9. Document/Payment/Message components - Connect to real APIs

### Low Priority
10. Remove deprecated files
11. Clean up unused mock implementations
12. Update documentation

## Success Criteria

- [ ] All pages load with real data
- [ ] Authentication works with AWS Cognito
- [ ] Transactions update in real-time
- [ ] All stakeholders can access appropriate data
- [ ] Navigation adapts based on user role
- [ ] Documents/payments/messages flow correctly
- [ ] No mock data remains in production code