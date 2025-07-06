# PropIE AWS App API Documentation

This document provides comprehensive information about the API endpoints available in the PropIE AWS application.

## Base URL

```
https://api.propie.com/v1
```

## Authentication

All API endpoints except public endpoints require authentication. Authentication is handled using JWT tokens.

- Include the JWT token in the `Authorization` header:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

## Error Handling

All API endpoints return consistent error objects with the following structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional error details
  }
}
```

## API Endpoints

### Users API

**Endpoint**: `/api/users`

#### GET /api/users

Retrieves a list of users or a specific user.

Query Parameters:
- `id` (string, optional): Retrieve a specific user by ID
- `email` (string, optional): Retrieve a specific user by email address
- `role` (string, optional): Filter users by role (developer, buyer, solicitor, etc.)
- `search` (string, optional): Search users by name or email
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of users per page (default: 10)

Response:
```json
{
  "users": [
    {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "roles": ["buyer"],
      "status": "ACTIVE",
      "kycStatus": "VERIFIED",
      "organization": "Company Name",
      "position": "Job Title",
      "created": "2023-01-01T00:00:00Z",
      "lastActive": "2023-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### POST /api/users

Creates a new user.

Request Body:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123",
  "phone": "+1234567890",
  "roles": ["buyer"],
  "organization": "Company Name",
  "position": "Job Title"
}
```

Response:
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roles": ["buyer"],
  "status": "ACTIVE",
  "kycStatus": "NOT_STARTED",
  "organization": "Company Name",
  "position": "Job Title",
  "created": "2023-01-01T00:00:00Z",
  "lastActive": "2023-01-01T00:00:00Z"
}
```

#### PUT /api/users

Updates an existing user.

Request Body:
```json
{
  "id": "user-123",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567891",
  "organization": "New Company Name",
  "position": "New Job Title"
}
```

Response:
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567891",
  "roles": ["buyer"],
  "status": "ACTIVE",
  "kycStatus": "NOT_STARTED",
  "organization": "New Company Name",
  "position": "New Job Title",
  "created": "2023-01-01T00:00:00Z",
  "lastActive": "2023-01-15T00:00:00Z"
}
```

#### DELETE /api/users

Deletes a user. Requires admin permissions.

Query Parameters:
- `id` (string, required): ID of the user to delete

Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Units API

**Endpoint**: `/api/units`

#### GET /api/units

Retrieves a list of units or a specific unit.

Query Parameters:
- `id` (string, optional): Retrieve a specific unit by ID
- `developmentId` (string, optional): Filter units by development ID
- `status` (string, optional): Filter units by status (available, reserved, sold)
- `type` (string, optional): Filter units by type (apartment, house, duplex)
- `minBedrooms` (number, optional): Minimum number of bedrooms
- `maxBedrooms` (number, optional): Maximum number of bedrooms
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of units per page (default: 10)

Response:
```json
{
  "units": [
    {
      "id": "unit-123",
      "developmentId": "dev-456",
      "name": "Unit A1",
      "type": "APARTMENT",
      "status": "AVAILABLE",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 95,
      "price": 350000,
      "features": ["Balcony", "Parking"],
      "images": ["image1.jpg", "image2.jpg"],
      "floorPlan": "floorplan.jpg"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### POST /api/units

Creates a new unit. Requires developer permissions.

Request Body:
```json
{
  "developmentId": "dev-456",
  "name": "Unit A1",
  "type": "APARTMENT",
  "status": "AVAILABLE",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 95,
  "price": 350000,
  "features": ["Balcony", "Parking"],
  "images": ["image1.jpg", "image2.jpg"],
  "floorPlan": "floorplan.jpg"
}
```

Response:
```json
{
  "id": "unit-123",
  "developmentId": "dev-456",
  "name": "Unit A1",
  "type": "APARTMENT",
  "status": "AVAILABLE",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 95,
  "price": 350000,
  "features": ["Balcony", "Parking"],
  "images": ["image1.jpg", "image2.jpg"],
  "floorPlan": "floorplan.jpg"
}
```

#### PUT /api/units

Updates an existing unit. Requires developer permissions.

Request Body:
```json
{
  "id": "unit-123",
  "status": "RESERVED",
  "price": 360000
}
```

Response:
```json
{
  "id": "unit-123",
  "developmentId": "dev-456",
  "name": "Unit A1",
  "type": "APARTMENT",
  "status": "RESERVED",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 95,
  "price": 360000,
  "features": ["Balcony", "Parking"],
  "images": ["image1.jpg", "image2.jpg"],
  "floorPlan": "floorplan.jpg"
}
```

#### DELETE /api/units

Deletes a unit. Requires developer permissions.

Query Parameters:
- `id` (string, required): ID of the unit to delete

Response:
```json
{
  "success": true,
  "message": "Unit deleted successfully"
}
```

### Sales API

**Endpoint**: `/api/sales`

#### GET /api/sales

Retrieves a list of sales or a specific sale.

Query Parameters:
- `id` (string, optional): Retrieve a specific sale by ID
- `unitId` (string, optional): Filter sales by unit ID
- `developmentId` (string, optional): Filter sales by development ID
- `buyerId` (string, optional): Filter sales by buyer ID
- `status` (string, optional): Filter sales by status (reserved, contract_issued, etc.)
- `stage` (string, optional): Filter sales by stage (reservation, deposit_paid, etc.)
- `from` (date, optional): Filter sales created after this date
- `to` (date, optional): Filter sales created before this date
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of sales per page (default: 10)

Response:
```json
{
  "sales": [
    {
      "id": "sale-123",
      "unitId": "unit-123",
      "developmentId": "dev-456",
      "buyerId": "user-789",
      "status": "IN_PROGRESS",
      "stage": "DEPOSIT_PAID",
      "price": 350000,
      "depositAmount": 35000,
      "depositPaid": true,
      "depositDate": "2023-02-15T00:00:00Z",
      "lenderName": "Example Bank",
      "mortgageAmount": 280000,
      "solicitorId": "user-012",
      "contractIssueDate": "2023-02-20T00:00:00Z",
      "contractReturnDate": "2023-03-05T00:00:00Z",
      "completionDate": null,
      "estimatedCompletionDate": "2023-05-01T00:00:00Z",
      "notes": [
        {
          "id": "note-1",
          "content": "Buyer requested virtual tour",
          "createdBy": "user-456",
          "createdAt": "2023-02-10T00:00:00Z"
        }
      ],
      "timeline": [
        {
          "stage": "RESERVED",
          "date": "2023-02-01T00:00:00Z"
        },
        {
          "stage": "DEPOSIT_PAID",
          "date": "2023-02-15T00:00:00Z"
        }
      ],
      "createdAt": "2023-02-01T00:00:00Z",
      "updatedAt": "2023-02-15T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### POST /api/sales

Creates a new sale record.

Request Body:
```json
{
  "unitId": "unit-123",
  "buyerId": "user-789",
  "price": 350000,
  "depositAmount": 35000,
  "solicitorId": "user-012",
  "estimatedCompletionDate": "2023-05-01T00:00:00Z"
}
```

Response:
```json
{
  "id": "sale-123",
  "unitId": "unit-123",
  "developmentId": "dev-456",
  "buyerId": "user-789",
  "status": "IN_PROGRESS",
  "stage": "RESERVED",
  "price": 350000,
  "depositAmount": 35000,
  "depositPaid": false,
  "solicitorId": "user-012",
  "estimatedCompletionDate": "2023-05-01T00:00:00Z",
  "createdAt": "2023-02-01T00:00:00Z",
  "updatedAt": "2023-02-01T00:00:00Z",
  "timeline": [
    {
      "stage": "RESERVED",
      "date": "2023-02-01T00:00:00Z"
    }
  ]
}
```

#### PUT /api/sales

Updates an existing sale. Supports various update types including status changes, deposit payments, and adding notes.

Request Body (Update Status):
```json
{
  "id": "sale-123",
  "updateType": "status",
  "status": "IN_PROGRESS",
  "stage": "DEPOSIT_PAID"
}
```

Request Body (Record Deposit):
```json
{
  "id": "sale-123",
  "updateType": "deposit",
  "depositPaid": true,
  "depositDate": "2023-02-15T00:00:00Z",
  "depositAmount": 35000
}
```

Request Body (Add Note):
```json
{
  "id": "sale-123",
  "updateType": "note",
  "note": "Buyer requested virtual tour"
}
```

Response:
```json
{
  "id": "sale-123",
  "unitId": "unit-123",
  "developmentId": "dev-456",
  "buyerId": "user-789",
  "status": "IN_PROGRESS",
  "stage": "DEPOSIT_PAID",
  "price": 350000,
  "depositAmount": 35000,
  "depositPaid": true,
  "depositDate": "2023-02-15T00:00:00Z",
  "solicitorId": "user-012",
  "estimatedCompletionDate": "2023-05-01T00:00:00Z",
  "createdAt": "2023-02-01T00:00:00Z",
  "updatedAt": "2023-02-15T00:00:00Z",
  "timeline": [
    {
      "stage": "RESERVED",
      "date": "2023-02-01T00:00:00Z"
    },
    {
      "stage": "DEPOSIT_PAID",
      "date": "2023-02-15T00:00:00Z"
    }
  ]
}
```

#### DELETE /api/sales

Cancels a sale. The sale record is not deleted but marked as cancelled.

Query Parameters:
- `id` (string, required): ID of the sale to cancel

Request Body:
```json
{
  "reason": "Buyer withdrew"
}
```

Response:
```json
{
  "id": "sale-123",
  "status": "CANCELLED",
  "cancellationReason": "Buyer withdrew",
  "cancellationDate": "2023-02-20T00:00:00Z"
}
```

### Documents API

**Endpoint**: `/api/documents`

#### GET /api/documents

Retrieves a list of documents or a specific document.

Query Parameters:
- `id` (string, optional): Retrieve a specific document by ID
- `userId` (string, optional): Filter documents by user ID
- `unitId` (string, optional): Filter documents by unit ID
- `developmentId` (string, optional): Filter documents by development ID
- `saleId` (string, optional): Filter documents by sale ID
- `type` (string, optional): Filter documents by type (contract, brochure, etc.)
- `search` (string, optional): Search documents by title
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of documents per page (default: 10)

Response:
```json
{
  "documents": [
    {
      "id": "doc-123",
      "title": "Sales Contract",
      "description": "Property sales contract",
      "fileUrl": "https://storage.example.com/documents/contract-123.pdf",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "type": "CONTRACT",
      "status": "ACTIVE",
      "userId": "user-789",
      "saleId": "sale-123",
      "unitId": "unit-123",
      "developmentId": "dev-456",
      "isTemplate": false,
      "createdAt": "2023-02-20T00:00:00Z",
      "updatedAt": "2023-02-20T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### POST /api/documents

Uploads a new document or creates a document metadata record.

Request Body:
```json
{
  "title": "Sales Contract",
  "description": "Property sales contract",
  "fileUrl": "https://storage.example.com/documents/contract-123.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "type": "CONTRACT",
  "userId": "user-789",
  "saleId": "sale-123",
  "unitId": "unit-123",
  "developmentId": "dev-456",
  "isTemplate": false
}
```

Response:
```json
{
  "id": "doc-123",
  "title": "Sales Contract",
  "description": "Property sales contract",
  "fileUrl": "https://storage.example.com/documents/contract-123.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "type": "CONTRACT",
  "status": "ACTIVE",
  "userId": "user-789",
  "saleId": "sale-123",
  "unitId": "unit-123",
  "developmentId": "dev-456",
  "isTemplate": false,
  "createdAt": "2023-02-20T00:00:00Z",
  "updatedAt": "2023-02-20T00:00:00Z"
}
```

#### PUT /api/documents

Updates document metadata.

Request Body:
```json
{
  "id": "doc-123",
  "title": "Updated Sales Contract",
  "description": "Updated property sales contract",
  "status": "ARCHIVED"
}
```

Response:
```json
{
  "id": "doc-123",
  "title": "Updated Sales Contract",
  "description": "Updated property sales contract",
  "fileUrl": "https://storage.example.com/documents/contract-123.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "type": "CONTRACT",
  "status": "ARCHIVED",
  "userId": "user-789",
  "saleId": "sale-123",
  "unitId": "unit-123",
  "developmentId": "dev-456",
  "isTemplate": false,
  "createdAt": "2023-02-20T00:00:00Z",
  "updatedAt": "2023-02-21T00:00:00Z"
}
```

#### DELETE /api/documents

Deletes a document or marks it as deleted.

Query Parameters:
- `id` (string, required): ID of the document to delete
- `soft` (boolean, optional): If true, the document will be marked as deleted rather than actually deleted (default: true)

Response:
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Developments API

**Endpoint**: `/api/developments`

#### GET /api/developments

Retrieves a list of developments or a specific development.

Query Parameters:
- `id` (string, optional): Retrieve a specific development by ID
- `developerId` (string, optional): Filter developments by developer ID
- `status` (string, optional): Filter developments by status (planning, construction, completed)
- `location` (string, optional): Filter developments by location
- `search` (string, optional): Search developments by name or description
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of developments per page (default: 10)

Response:
```json
{
  "developments": [
    {
      "id": "dev-456",
      "name": "Riverside Manor",
      "description": "Luxury riverside development with 50 units",
      "developerId": "user-456",
      "status": "CONSTRUCTION",
      "location": {
        "address": "123 Riverside Way",
        "city": "Dublin",
        "county": "Dublin",
        "eircode": "D01 AB12",
        "coordinates": {
          "latitude": 53.3498,
          "longitude": -6.2603
        }
      },
      "totalUnits": 50,
      "availableUnits": 30,
      "reservedUnits": 15,
      "soldUnits": 5,
      "startDate": "2022-01-01T00:00:00Z",
      "estimatedCompletionDate": "2023-12-31T00:00:00Z",
      "features": ["Riverside Views", "Communal Gardens", "Secure Parking"],
      "images": ["image1.jpg", "image2.jpg"],
      "brochureUrl": "https://storage.example.com/brochures/riverside-manor.pdf",
      "createdAt": "2022-01-01T00:00:00Z",
      "updatedAt": "2023-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### POST /api/developments

Creates a new development. Requires developer permissions.

Request Body:
```json
{
  "name": "Riverside Manor",
  "description": "Luxury riverside development with 50 units",
  "status": "PLANNING",
  "location": {
    "address": "123 Riverside Way",
    "city": "Dublin",
    "county": "Dublin",
    "eircode": "D01 AB12",
    "coordinates": {
      "latitude": 53.3498,
      "longitude": -6.2603
    }
  },
  "totalUnits": 50,
  "startDate": "2022-01-01T00:00:00Z",
  "estimatedCompletionDate": "2023-12-31T00:00:00Z",
  "features": ["Riverside Views", "Communal Gardens", "Secure Parking"],
  "images": ["image1.jpg", "image2.jpg"],
  "brochureUrl": "https://storage.example.com/brochures/riverside-manor.pdf"
}
```

Response:
```json
{
  "id": "dev-456",
  "name": "Riverside Manor",
  "description": "Luxury riverside development with 50 units",
  "developerId": "user-456",
  "status": "PLANNING",
  "location": {
    "address": "123 Riverside Way",
    "city": "Dublin",
    "county": "Dublin",
    "eircode": "D01 AB12",
    "coordinates": {
      "latitude": 53.3498,
      "longitude": -6.2603
    }
  },
  "totalUnits": 50,
  "availableUnits": 50,
  "reservedUnits": 0,
  "soldUnits": a0,
  "startDate": "2022-01-01T00:00:00Z",
  "estimatedCompletionDate": "2023-12-31T00:00:00Z",
  "features": ["Riverside Views", "Communal Gardens", "Secure Parking"],
  "images": ["image1.jpg", "image2.jpg"],
  "brochureUrl": "https://storage.example.com/brochures/riverside-manor.pdf",
  "createdAt": "2022-01-01T00:00:00Z",
  "updatedAt": "2022-01-01T00:00:00Z"
}
```

#### PUT /api/developments

Updates an existing development. Requires developer permissions.

Request Body:
```json
{
  "id": "dev-456",
  "status": "CONSTRUCTION",
  "estimatedCompletionDate": "2024-03-31T00:00:00Z",
  "images": ["image1.jpg", "image2.jpg", "image3.jpg"]
}
```

Response:
```json
{
  "id": "dev-456",
  "name": "Riverside Manor",
  "description": "Luxury riverside development with 50 units",
  "developerId": "user-456",
  "status": "CONSTRUCTION",
  "location": {
    "address": "123 Riverside Way",
    "city": "Dublin",
    "county": "Dublin",
    "eircode": "D01 AB12",
    "coordinates": {
      "latitude": 53.3498,
      "longitude": -6.2603
    }
  },
  "totalUnits": 50,
  "availableUnits": 30,
  "reservedUnits": 15,
  "soldUnits": 5,
  "startDate": "2022-01-01T00:00:00Z",
  "estimatedCompletionDate": "2024-03-31T00:00:00Z",
  "features": ["Riverside Views", "Communal Gardens", "Secure Parking"],
  "images": ["image1.jpg", "image2.jpg", "image3.jpg"],
  "brochureUrl": "https://storage.example.com/brochures/riverside-manor.pdf",
  "createdAt": "2022-01-01T00:00:00Z",
  "updatedAt": "2023-06-01T00:00:00Z"
}
```

#### DELETE /api/developments

Deletes a development. This operation will fail if there are any units associated with the development. Requires admin permissions.

Query Parameters:
- `id` (string, required): ID of the development to delete

Response:
```json
{
  "success": true,
  "message": "Development deleted successfully"
}
```

## Rate Limiting

To ensure fair usage and system stability, API requests are rate-limited. The current rate limits are:

- 100 requests per minute per user
- 1000 requests per hour per user

When a rate limit is exceeded, the API will return a 429 Too Many Requests response.