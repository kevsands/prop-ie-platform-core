# Platform Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        A1[Estate Agent Dashboard]
        A2[Solicitor Dashboard]
        A3[Architect Dashboard]
        A4[Mobile Apps - Pending]
    end

    subgraph "Component Layer"
        B1[CRM Components<br/>- Lead Management<br/>- Property Matching<br/>- Viewing Scheduler<br/>- Offer Tracker]
        B2[Conveyancing Components<br/>- Case Management<br/>- Task Tracker<br/>- Document Manager<br/>- AML Compliance]
        B3[Collaboration Components<br/>- Project Dashboard<br/>- Drawing Manager<br/>- Task Board<br/>- 3D Model Viewer]
    end

    subgraph "Service Layer"
        C1[CRM Service<br/>- Lead Processing<br/>- Property Search<br/>- Booking System]
        C2[Conveyancing Service<br/>- Case Workflow<br/>- Document Generation<br/>- Compliance Checks]
        C3[Collaboration Service<br/>- Project Management<br/>- Version Control<br/>- Real-time Updates]
    end

    subgraph "Data Layer"
        D1[(CRM Database<br/>Leads, Properties,<br/>Viewings, Offers)]
        D2[(Conveyancing DB<br/>Cases, Tasks,<br/>Documents, Fees)]
        D3[(Collaboration DB<br/>Projects, Drawings,<br/>Models, Comments)]
    end

    subgraph "Integration Layer - In Progress"
        E1[Property Portals<br/>Daft.ie, MyHome.ie]
        E2[Payment Systems<br/>Stripe, PayPal]
        E3[Document Services<br/>DocuSign, Onfido]
        E4[External CRMs<behrig/>Salesforce, HubSpot]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    
    C1 --> D1
    C2 --> D2
    C3 --> D3
    
    C1 -.-> E1
    C2 -.-> E2
    C2 -.-> E3
    C1 -.-> E4

    classDef completed fill:#90EE90,stroke:#006400,stroke-width:2px
    classDef inProgress fill:#FFD700,stroke:#B8860B,stroke-width:2px
    classDef pending fill:#FFB6C1,stroke:#DC143C,stroke-width:2px

    class A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3 completed
    class E1,E2,E3,E4 inProgress
    class A4 pending
```

## User Journey Flow

```mermaid
graph LR
    subgraph "Property Transaction Lifecycle"
        U1[Buyer/Seller] --> A1[Estate Agent]
        A1 --> P1[Property Listed]
        P1 --> V1[Viewings Scheduled]
        V1 --> O1[Offer Made]
        O1 --> S1[Solicitor Engaged]
        S1 --> C1[Conveyancing Process]
        C1 --> AR1[Architect Consulted]
        AR1 --> D1[Design/Modifications]
        D1 --> T1[Transaction Complete]
    end

    subgraph "Platform Features"
        A1 -.-> F1[CRM System]
        S1 -.-> F2[Case Management]
        AR1 -.-> F3[Collaboration Tools]
    end
```

## Component Status Overview

| Component | Status | Location | Key Features |
|-----------|---------|-----------|--------------|
| **Estate Agent CRM** | ✅ Complete | `/agent/dashboard` | Lead management, Property matching, Viewing scheduler |
| **Solicitor System** | ✅ Complete | `/solicitor/dashboard` | Case tracking, Document management, AML compliance |
| **Architect Tools** | ✅ Complete | `/architect/collaboration` | Drawing management, 3D models, Task boards |
| **Third-party APIs** | 🏗️ In Progress | `/src/lib/integrations` | Property portals, Payment gateways, DocuSign |
| **Mobile Apps** | 📋 Pending | - | React Native apps for iOS/Android |
| **Multi-tenancy** | 📋 Pending | - | White-label support, Custom domains |

## Quick Test Links

When running the development server (`npm run dev`), you can access:

1. **Estate Agent CRM**: [http://localhost:3000/agent/dashboard](http://localhost:3000/agent/dashboard)
   - View leads and manage properties
   - Schedule viewings
   - Track offers

2. **Solicitor Conveyancing**: [http://localhost:3000/solicitor/dashboard](http://localhost:3000/solicitor/dashboard)
   - Click "View Conveyancing Dashboard" for full system
   - Manage cases and documents
   - Track compliance

3. **Architect Collaboration**: [http://localhost:3000/architect/dashboard](http://localhost:3000/architect/dashboard)
   - Click "Collaboration Hub" for tools
   - Manage drawings and 3D models
   - Coordinate with team

## Data Models Overview

### CRM Schema
- **Lead**: Potential buyers/sellers
- **Property**: Property listings
- **Viewing**: Scheduled property viewings
- **Offer**: Purchase offers
- **Client**: Registered clients

### Conveyancing Schema
- **ConveyancingCase**: Legal cases
- **ConveyancingTask**: Workflow tasks
- **Document**: Legal documents
- **AMLCheck**: Compliance checks
- **LegalFee**: Billing information

### Collaboration Schema
- **Project**: Architectural projects
- **Drawing**: Technical drawings
- **DrawingRevision**: Version control
- **BuildingModel**: 3D models
- **ProjectTask**: Project tasks

## Key Technologies Used

- **Frontend**: Next.js 15.3.1, React 18, TypeScript
- **UI Library**: Radix UI, Tailwind CSS
- **Database**: Prisma ORM (PostgreSQL)
- **3D Graphics**: Three.js
- **State Management**: React Context API
- **Real-time**: EventEmitter
- **Authentication**: NextAuth.js