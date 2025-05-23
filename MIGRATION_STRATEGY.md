# Migration Strategy: Preserving Critical Business Logic

## Overview
This document outlines the strategy for migrating or refactoring the platform while preserving all critical business logic identified in the audit.

## Core Principles

1. **Zero Business Logic Loss**: Every calculation, workflow, and rule must be preserved
2. **Incremental Migration**: Move components gradually with feature flags
3. **Parallel Testing**: Run old and new implementations side-by-side
4. **Audit Trail**: Track all changes with comprehensive logging

## Critical Components to Preserve

### 1. Transaction State Machine

#### Current Implementation
```typescript
// Location: src/services/transactionCoordinator.ts
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

#### Migration Strategy
```typescript
// New location: src/core/transactions/StateMachine.ts
export class TransactionStateMachine {
  private static readonly transitions = VALID_TRANSITIONS;
  
  // Preserve exact validation logic
  static canTransition(from: Phase, to: Phase): boolean {
    return this.transitions[from]?.includes(to) ?? false;
  }
  
  // Add transition history for debugging
  static async transition(
    transactionId: string,
    newPhase: Phase,
    metadata?: any
  ): Promise<void> {
    const current = await this.getCurrentPhase(transactionId);
    
    if (!this.canTransition(current, newPhase)) {
      throw new InvalidTransitionError(current, newPhase);
    }
    
    // Log for parallel testing
    await this.logTransition({
      transactionId,
      from: current,
      to: newPhase,
      timestamp: new Date(),
      metadata
    });
    
    // Execute transition
    await this.executeTransition(transactionId, newPhase);
  }
}
```

### 2. HTB Calculations

#### Preservation Requirements
```typescript
// MUST preserve exact calculation logic
export class HTBCalculatorV2 {
  // Original calculation - DO NOT MODIFY
  static calculateRelief(
    propertyPrice: number,
    totalTaxPaid: number
  ): number {
    if (propertyPrice > 500000) return 0;
    
    const tenPercentPrice = propertyPrice * 0.10;
    return Math.min(totalTaxPaid, tenPercentPrice, 30000);
  }
  
  // Wrapper for testing parity
  static async calculateWithValidation(
    params: HTBParams
  ): Promise<HTBResult> {
    // Run old calculation
    const oldResult = HTBCalculator.calculate(params);
    
    // Run new calculation
    const newResult = this.calculateRelief(
      params.propertyPrice,
      params.totalTaxPaid
    );
    
    // Log any discrepancies
    if (oldResult !== newResult) {
      await this.logDiscrepancy({
        params,
        oldResult,
        newResult,
        timestamp: new Date()
      });
    }
    
    // Return old result during migration
    return {
      amount: oldResult,
      metadata: {
        calculationVersion: 'v1',
        migrationStatus: 'in_progress'
      }
    };
  }
}
```

### 3. Customization Pricing Engine

#### Current Implementation
```typescript
// Location: src/lib/customization/utils.ts
// Complex pricing with dependencies and discounts
```

#### Migration Approach
```typescript
// New modular structure
export class PricingEngineV2 {
  private rules: PricingRule[] = [];
  
  constructor() {
    // Load all existing rules
    this.rules = this.loadLegacyRules();
  }
  
  async calculatePrice(
    selections: CustomizationSelection[]
  ): Promise<PricingResult> {
    // Step 1: Calculate base price
    const base = this.calculateBase(selections);
    
    // Step 2: Apply dependencies (MUST match legacy)
    const withDependencies = this.applyDependencies(base, selections);
    
    // Step 3: Check conflicts (MUST match legacy)
    this.validateConflicts(selections);
    
    // Step 4: Apply discounts (MUST match legacy)
    const withDiscounts = this.applyDiscounts(withDependencies);
    
    // Step 5: Add VAT (13.5% - Irish rate)
    const withVAT = this.applyVAT(withDiscounts);
    
    // Parallel testing
    if (process.env.ENABLE_PRICING_VALIDATION === 'true') {
      await this.validateAgainstLegacy(selections, withVAT);
    }
    
    return {
      subtotal: withDependencies,
      discount: withDependencies - withDiscounts,
      vat: withVAT - withDiscounts,
      total: withVAT
    };
  }
}
```

## Migration Phases

### Phase 1: Infrastructure (Weeks 1-2)
```typescript
// Set up parallel testing framework
export class MigrationValidator {
  async validateOperation<T>(
    operationName: string,
    oldImpl: () => Promise<T>,
    newImpl: () => Promise<T>
  ): Promise<T> {
    const [oldResult, newResult] = await Promise.all([
      this.captureResult(oldImpl),
      this.captureResult(newImpl)
    ]);
    
    if (!this.resultsMatch(oldResult, newResult)) {
      await this.logMismatch({
        operation: operationName,
        old: oldResult,
        new: newResult,
        timestamp: new Date()
      });
    }
    
    // Return old result during migration
    return oldResult.value;
  }
}
```

### Phase 2: Data Layer (Weeks 3-4)
```yaml
Strategy:
  - Create new schema alongside existing
  - Set up bidirectional sync
  - Validate data integrity continuously
  
Implementation:
  - Use Prisma migrations for new schema
  - Create sync triggers in PostgreSQL
  - Build reconciliation reports
```

### Phase 3: Business Logic (Weeks 5-8)
```typescript
// Feature flag controlled migration
export class FeatureFlaggedService {
  async executeOperation(params: any) {
    if (await this.isNewVersionEnabled('operation_name')) {
      return this.newImplementation(params);
    }
    
    return this.legacyImplementation(params);
  }
  
  private async isNewVersionEnabled(feature: string): Promise<boolean> {
    // Check feature flags with gradual rollout
    const flag = await this.featureFlags.get(feature);
    
    // Percentage-based rollout
    if (flag.rolloutPercentage) {
      const userHash = this.hashUser(this.currentUser);
      return userHash % 100 < flag.rolloutPercentage;
    }
    
    return flag.enabled;
  }
}
```

### Phase 4: API Layer (Weeks 9-10)
```typescript
// Versioned API endpoints
export class APIVersionManager {
  // v1 endpoints (legacy)
  @Route('/api/v1/transactions')
  async getTransactionsV1() {
    return this.legacyTransactionService.getAll();
  }
  
  // v2 endpoints (new)
  @Route('/api/v2/transactions')
  async getTransactionsV2() {
    const result = await this.newTransactionService.getAll();
    
    // Validate against v1 in background
    this.backgroundValidator.validate(
      'getTransactions',
      () => this.getTransactionsV1(),
      result
    );
    
    return result;
  }
}
```

### Phase 5: UI Migration (Weeks 11-12)
```typescript
// Component migration with fallback
export function MigratedComponent({ ...props }) {
  const { isNewUIEnabled } = useFeatureFlags();
  
  if (isNewUIEnabled) {
    return <NewComponent {...props} />;
  }
  
  return <LegacyComponent {...props} />;
}
```

## Testing Strategy

### 1. Unit Test Preservation
```typescript
// Keep all existing tests and add new ones
describe('Transaction State Machine', () => {
  // Legacy tests (MUST PASS)
  describe('Legacy Behavior', () => {
    legacyTests.forEach(test => {
      it(test.name, async () => {
        const result = await NewImplementation[test.method](...test.args);
        expect(result).toEqual(test.expectedResult);
      });
    });
  });
  
  // New tests
  describe('Enhanced Behavior', () => {
    // Additional test cases
  });
});
```

### 2. Integration Test Suite
```yaml
Test Scenarios:
  - Complete transaction flow (11 phases)
  - HTB application with edge cases
  - Customization with complex dependencies
  - SLP generation with all documents
  - Payment processing with refunds
  
Validation:
  - Compare outputs byte-for-byte
  - Measure performance regression
  - Check database state consistency
```

### 3. Data Validation
```typescript
export class DataMigrationValidator {
  async validateMigration() {
    const checks = [
      this.validateTransactionIntegrity(),
      this.validatePaymentTotals(),
      this.validateHTBCalculations(),
      this.validateCustomizationPrices(),
      this.validateUserPermissions()
    ];
    
    const results = await Promise.all(checks);
    
    return {
      success: results.every(r => r.success),
      details: results
    };
  }
}
```

## Rollback Strategy

### Instant Rollback Capability
```typescript
export class RollbackManager {
  async rollback(component: string, reason: string) {
    // 1. Switch feature flag immediately
    await this.featureFlags.disable(component);
    
    // 2. Log rollback event
    await this.auditLog.log({
      event: 'ROLLBACK',
      component,
      reason,
      timestamp: new Date()
    });
    
    // 3. Notify team
    await this.notifications.alert({
      severity: 'HIGH',
      message: `Rollback initiated: ${component}`,
      reason
    });
    
    // 4. Revert database if needed
    if (this.requiresDataRollback(component)) {
      await this.dataRollback.execute(component);
    }
  }
}
```

## Monitoring During Migration

### Key Metrics
```typescript
interface MigrationMetrics {
  // Business metrics (MUST NOT DEGRADE)
  transactionSuccessRate: number;
  avgTransactionTime: number;
  paymentFailureRate: number;
  htbCalculationAccuracy: number;
  
  // Technical metrics
  apiResponseTime: number;
  errorRate: number;
  databaseQueryTime: number;
  
  // Migration specific
  featureFlagAdoption: number;
  validationMismatches: number;
  rollbackCount: number;
}
```

### Alerting Rules
```yaml
Critical Alerts:
  - Validation mismatch rate > 0.1%
  - Transaction success rate drops > 2%
  - Payment failures increase > 1%
  - HTB calculation discrepancy found
  
Warning Alerts:
  - API response time increase > 20%
  - Database query time increase > 30%
  - Memory usage increase > 40%
```

## Documentation Requirements

### 1. Migration Log
```markdown
## Migration Log Template

### Component: [Name]
**Date**: YYYY-MM-DD
**Engineer**: [Name]
**Status**: In Progress | Completed | Rolled Back

#### Changes Made:
- List all modifications
- Note any logic changes
- Document new dependencies

#### Validation Results:
- Test coverage: X%
- Validation mismatches: X
- Performance impact: +X%

#### Rollback Plan:
- Feature flag: [flag_name]
- Database changes: [reversible/irreversible]
- Rollback command: `npm run rollback:[component]`
```

### 2. Business Logic Documentation
```typescript
/**
 * CRITICAL BUSINESS LOGIC - DO NOT MODIFY WITHOUT APPROVAL
 * 
 * This calculation implements Irish HTB rules as of 2024.
 * Any changes require:
 * 1. Legal review
 * 2. Business approval
 * 3. Full regression testing
 * 
 * @see https://revenue.ie/htb-rules
 */
export function calculateHTBRelief(params: HTBParams): number {
  // Implementation
}
```

## Success Criteria

### Technical Success
- Zero business logic regressions
- Performance within 10% of legacy
- 100% feature parity
- Zero data loss

### Business Success  
- No increase in support tickets
- Transaction success rate maintained
- User satisfaction unchanged
- Revenue unaffected

### Migration Success
- Completed within timeline
- Under budget
- No emergency rollbacks
- Team knowledge transferred

## Risk Mitigation

### High-Risk Components
1. **Payment Processing**: Extra validation, manual QA
2. **HTB Calculations**: Legal review required  
3. **Transaction State**: Extensive parallel testing
4. **User Permissions**: Security audit required

### Contingency Plans
1. **Performance Degradation**: Pre-scaled infrastructure
2. **Data Corruption**: Point-in-time recovery ready
3. **Integration Failures**: Circuit breakers in place
4. **Team Availability**: Documentation complete

## Timeline Summary

- **Weeks 1-2**: Infrastructure setup
- **Weeks 3-4**: Data layer migration
- **Weeks 5-8**: Business logic migration  
- **Weeks 9-10**: API migration
- **Weeks 11-12**: UI migration
- **Weeks 13-14**: Full system testing
- **Weeks 15-16**: Gradual rollout
- **Week 17+**: Monitoring and optimization