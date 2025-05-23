# TransactionTracker Component Implementation

## Overview

The `TransactionTracker` component has been modified to accept mock data through props, allowing it to be used in both development/testing scenarios and with real API data in production. This document outlines the implementation details and how to use the component.

## Component Features

- Visual timeline representation of transaction progress
- Detailed milestone tracking within each phase
- Support for completed, active, and pending phases
- Expandable/collapsible phases with detailed milestones
- Progress indicator showing completion percentage
- Next actions list
- Property and development information
- Key contacts section

## Mock Data Support

The component now accepts a `mockData` prop that can be used to populate the component with pre-defined transaction data. This allows the component to be used in development and testing without requiring a connection to a backend API.

## Component Props

```typescript
interface TransactionTrackerProps {
  transactionId?: string;  // Optional ID for API requests
  userRole: 'buyer' | 'agent' | 'solicitor' | 'developer';  // Required role information
  mockData?: Transaction;  // Optional mock data
}
```

## Usage Examples

### With Mock Data

```tsx
import TransactionTracker, { mockTransactionData } from '@/components/transaction/TransactionTracker';

// In your component:
<TransactionTracker 
  userRole="buyer" 
  mockData={mockTransactionData} 
/>
```

### With API Data

```tsx
<TransactionTracker 
  transactionId="tx-12345" 
  userRole="buyer" 
/>
```

## Mock Data Structure

The mock data structure follows the `Transaction` interface:

```typescript
interface Transaction {
  id: string;
  referenceNumber: string;
  status: string;
  unit: {
    name: string;
    development: {
      name: string;
      location: any;
    };
  };
  timeline: {
    phases: Array<{
      phase: string;
      status: 'completed' | 'active' | 'pending';
      completedDate?: Date;
      milestones: Array<{
        id: string;
        name: string;
        status: 'completed' | 'in_progress' | 'pending';
        required: boolean;
        completionCriteria: string[];
        documentsRequired: string[];
        tasks: Array<{
          id: string;
          title: string;
          status: string;
          dueDate: string;
        }>;
      }>;
    }>;
  };
  currentMilestones: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  completionPercentage: number;
  nextActions: string[];
  availableTransitions: string[];
}
```

## Implementation Details

1. The component now accepts both a `transactionId` and a `mockData` prop.
2. If `mockData` is provided, it is used directly without making API calls.
3. If only `transactionId` is provided, the component makes an API call to fetch transaction data.
4. If neither `transactionId` nor `mockData` is provided, the component shows an error.

## How It Works

1. The component uses React's useState and useEffect hooks to manage state and side effects.
2. Within useEffect, it checks if mockData is provided and uses it if available.
3. If no mockData is provided but a transactionId is, it calls the fetchTransaction function.
4. The component conditionally renders different views based on loading state, error state, and data availability.
5. A phases array is created by mapping the phaseConfig array with data from the transaction.

## Example Mock Data

Sample mock data is exported as `mockTransactionData` from the TransactionTracker component. This data includes:

- Transaction in "RESERVATION" status (32% complete)
- Three completed phases (ENQUIRY, VIEWING_SCHEDULED, VIEWED)
- One active phase (RESERVATION) with three milestones (one completed, one in-progress, one pending)
- Several pending future phases
- Next actions and available transitions

## Visual Structure

The component renders three main sections:

1. **Header** - Shows transaction summary, completion percentage, property details, and next actions
2. **Progress Timeline** - Displays the full transaction journey with expandable phases and milestones
3. **Key Contacts** - Shows contact information for relevant parties

Each milestone includes:
- Completion criteria
- Required documents
- Associated tasks with due dates

## Testing

To test the component with mock data, create a page that imports and renders the TransactionTracker component with the mockTransactionData:

```tsx
import TransactionTracker, { mockTransactionData } from '@/components/transaction/TransactionTracker';

export default function TestPage() {
  return (
    <div>
      <h1>Transaction Tracker Test</h1>
      <TransactionTracker userRole="buyer" mockData={mockTransactionData} />
    </div>
  );
}
```