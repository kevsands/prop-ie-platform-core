# Enterprise Schema Consolidation Decisions

## 🏢 Enterprise-Grade Resolution Strategy

### 1. SnagList Model Consolidation
**Problem**: Duplicate `SnagList` and `SnagListFTB` models
**Enterprise Decision**: 
- **Single `PropertyInspection` model** that serves all inspection needs
- **Polymorphic design** supporting buyer inspections, developer QA, handover inspections
- **Audit trail** with proper stakeholder tracking
- **Workflow integration** for enterprise compliance

### 2. Investment Model Separation
**Problem**: Confusion between property investments and development finance
**Enterprise Decision**:
- **`PropertyInvestment`** - Individual property investments by investors
- **`DevelopmentInvestment`** - Development-level funding and equity
- **Clear separation** of concerns with proper naming

### 3. Enterprise Naming Conventions
**Adopted Standards**:
- Models: PascalCase with clear business domain (e.g., `PropertyInspection`, `BuyerJourney`)
- Relations: Descriptive names (e.g., `propertyInspections` not `snagLists`)
- Enums: SCREAMING_SNAKE_CASE with domain prefix where needed
- Fields: camelCase with full descriptive names

### 4. Workflow Integration
**Enterprise Requirements**:
- All major processes have audit trails
- Stakeholder assignment and responsibility tracking
- Status workflows with proper state transitions
- Document attachments for compliance

### 5. Multi-Tenant Architecture Ready
**Scalability Decisions**:
- Organization/tenant field where needed for SaaS scaling
- Proper indexing hints for performance
- Hierarchical data structures for complex organizations