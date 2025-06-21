# PropPlatform API Documentation

## Overview

The PropPlatform API provides programmatic access to all platform features including property management, legal services, and architectural collaboration.

## Base URL
```
Production: https://api.propplatform.com/v1
Development: http://localhost:3000/api
```

## Authentication

All API requests require authentication using JWT tokens.

### Obtaining a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clh1234567",
    "email": "user@example.com",
    "role": "AGENT",
    "name": "John Doe"
  }
}
```

### Using the Token

Include the token in the Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Endpoints

### Properties

#### List Properties
```http
GET /api/properties?page=1&limit=10&status=AVAILABLE
```

Query Parameters:
- `page` (number): Page number for pagination
- `limit` (number): Items per page (max 100)
- `status` (string): Filter by status (AVAILABLE, SOLD, PENDING)
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `type` (string): Property type (HOUSE, APARTMENT, STUDIO, etc.)

Response:
```json
{
  "data": [
    {
      "id": "prop_123",
      "title": "Modern 3-Bed House",
      "address": "123 Main St, Dublin",
      "price": 450000,
      "type": "HOUSE",
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 1500,
      "status": "AVAILABLE",
      "images": [
        {
          "url": "https://...",
          "isPrimary": true
        }
      ],
      "agent": {
        "id": "user_456",
        "name": "Jane Smith",
        "email": "jane@agency.com"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16
  }
}
```

#### Get Property Details
```http
GET /api/properties/:id
```

Response:
```json
{
  "id": "prop_123",
  "title": "Modern 3-Bed House",
  "description": "Beautiful modern house...",
  "address": "123 Main St, Dublin",
  "price": 450000,
  "type": "HOUSE",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 1500,
  "status": "AVAILABLE",
  "features": ["Garden", "Garage", "Solar Panels"],
  "images": [...],
  "floorPlans": [...],
  "virtualTourUrl": "https://...",
  "agent": {...},
  "development": {...},
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### Create Property
```http
POST /api/properties
Content-Type: application/json

{
  "title": "New Property",
  "address": "456 Oak Lane",
  "price": 350000,
  "type": "APARTMENT",
  "bedrooms": 2,
  "bathrooms": 1,
  "area": 900,
  "description": "Lovely apartment...",
  "features": ["Balcony", "Parking"]
}
```

#### Update Property
```http
PUT /api/properties/:id
Content-Type: application/json

{
  "price": 340000,
  "status": "PENDING"
}
```

#### Delete Property
```http
DELETE /api/properties/:id
```

### Legal Cases

#### List Cases
```http
GET /api/cases?status=ACTIVE&page=1
```

Query Parameters:
- `status`: ACTIVE, COMPLETED, PENDING
- `solicitorId`: Filter by solicitor
- `propertyId`: Filter by property

Response:
```json
{
  "data": [
    {
      "id": "case_123",
      "caseReference": "CV-2024-0045",
      "propertyId": "prop_123",
      "status": "ACTIVE",
      "type": "PURCHASE",
      "client": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "solicitor": {
        "name": "Michael Murphy",
        "firmName": "Murphy & Associates"
      },
      "tasks": [
        {
          "id": "task_456",
          "title": "Contract Review",
          "status": "COMPLETED"
        }
      ],
      "documents": [
        {
          "id": "doc_789",
          "name": "Purchase Agreement",
          "status": "SIGNED"
        }
      ]
    }
  ],
  "meta": {...}
}
```

#### Create Case
```http
POST /api/cases
Content-Type: application/json

{
  "propertyId": "prop_123",
  "type": "PURCHASE",
  "clientId": "client_456",
  "solicitorId": "user_789",
  "purchasePrice": 450000
}
```

### Architectural Projects

#### List Projects
```http
GET /api/projects?status=ACTIVE
```

Response:
```json
{
  "data": [
    {
      "id": "proj_123",
      "name": "Riverside Development Phase 2",
      "status": "DESIGN",
      "progress": 65,
      "leadArchitectId": "user_123",
      "team": [
        {
          "id": "user_456",
          "name": "Emma Walsh",
          "role": "ARCHITECT"
        }
      ],
      "drawings": [
        {
          "id": "draw_789",
          "title": "Floor Plan - Level 1",
          "version": 3,
          "status": "APPROVED"
        }
      ],
      "tasks": [...],
      "milestones": [...]
    }
  ],
  "meta": {...}
}
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "New Development",
  "propertyId": "prop_123",
  "leadArchitectId": "user_456",
  "startDate": "2024-02-01",
  "targetCompletion": "2024-12-31",
  "budget": 2500000
}
```

### Offers

#### Create Offer
```http
POST /api/offers
Content-Type: application/json

{
  "propertyId": "prop_123",
  "buyerId": "user_456",
  "amount": 425000,
  "conditions": ["Subject to survey", "Subject to mortgage approval"],
  "expiryDate": "2024-02-01"
}
```

#### Update Offer Status
```http
PUT /api/offers/:id/status
Content-Type: application/json

{
  "status": "ACCEPTED",
  "notes": "Seller accepted the offer"
}
```

### Viewings

#### Schedule Viewing
```http
POST /api/viewings
Content-Type: application/json

{
  "propertyId": "prop_123",
  "clientId": "client_456",
  "dateTime": "2024-01-20T14:00:00Z",
  "duration": 30,
  "notes": "First-time buyer interested in garden"
}
```

#### List Viewings
```http
GET /api/viewings?date=2024-01-20&agentId=user_123
```

### Documents

#### Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data

file: [binary data]
metadata: {
  "type": "CONTRACT",
  "caseId": "case_123",
  "name": "Purchase Agreement"
}
```

#### Generate Document
```http
POST /api/documents/generate
Content-Type: application/json

{
  "templateId": "template_contract",
  "caseId": "case_123",
  "data": {
    "buyerName": "John Doe",
    "propertyAddress": "123 Main St",
    "purchasePrice": 450000
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `CONFLICT`: Resource conflict (e.g., duplicate)
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated requests

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642435200
```

## Webhooks

Configure webhooks to receive real-time updates:

```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["property.created", "offer.accepted", "case.completed"],
  "secret": "your_webhook_secret"
}
```

### Available Events
- `property.created`
- `property.updated`
- `property.sold`
- `offer.created`
- `offer.accepted`
- `offer.rejected`
- `case.created`
- `case.updated`
- `case.completed`
- `document.uploaded`
- `document.signed`

## SDK Examples

### JavaScript/TypeScript
```typescript
import { PropPlatformClient } from '@propplatform/sdk';

const client = new PropPlatformClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

// List properties
const properties = await client.properties.list({
  status: 'AVAILABLE',
  minPrice: 300000,
  maxPrice: 500000
});

// Create an offer
const offer = await client.offers.create({
  propertyId: 'prop_123',
  amount: 425000,
  conditions: ['Subject to survey']
});
```

### Python
```python
from propplatform import PropPlatformClient

client = PropPlatformClient(
    api_key='your_api_key',
    environment='production'
)

# List properties
properties = client.properties.list(
    status='AVAILABLE',
    min_price=300000,
    max_price=500000
)

# Create an offer
offer = client.offers.create(
    property_id='prop_123',
    amount=425000,
    conditions=['Subject to survey']
)
```

## Best Practices

1. **Use Pagination**: Always paginate large result sets
2. **Cache Responses**: Implement client-side caching for frequently accessed data
3. **Handle Errors**: Implement proper error handling and retry logic
4. **Validate Input**: Validate data client-side before sending requests
5. **Use Webhooks**: Subscribe to webhooks for real-time updates instead of polling

## Support

- Documentation: https://docs.propplatform.com
- API Status: https://status.propplatform.com
- Support Email: api-support@propplatform.com
- Developer Forum: https://forum.propplatform.com