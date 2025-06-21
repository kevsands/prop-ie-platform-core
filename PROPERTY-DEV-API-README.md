# Property Development Platform API

This is a NestJS-based RESTful API for a property development platform. It provides a comprehensive backend solution for managing property development projects, including user authentication, organization management, and document handling.

## Technology Stack

- NestJS (Node.js framework)
- TypeScript
- PostgreSQL
- TypeORM (ORM)
- JWT Authentication
- Swagger/OpenAPI for documentation

## Features

- **Authentication System**: Secure JWT-based authentication with refresh tokens
- **Role-Based Access Control**: Fine-grained permissions for different user roles
- **Organization Management**: Support for multiple organizations and users
- **Project Management**: CRUD operations for development projects
- **Document Management**: Storage and retrieval of project-related documents
- **Address Management**: Support for multiple addresses with polymorphic relationships

## Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (v13+)

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-repo/property-dev-api.git
cd property-dev-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables by creating a `.env` file in the root directory. Use the example below:
```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=property_dev_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# App Configuration
APP_PORT=3000
NODE_ENV=development
```

4. Create the database
```sql
CREATE DATABASE property_dev_db;
```

5. Run migrations to create database schema
```bash
npm run migration:run
```

6. (Optional) Seed the database with initial data
```bash
npm run seed
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Database Structure

The database contains the following main entities:

- **Users**: Authentication and user management
- **Organisations**: Company information
- **OrganisationUsers**: Join table for users and organizations with roles
- **Projects**: Property development projects
- **Addresses**: Physical addresses (polymorphic)
- **Documents**: Document storage and management
- **DocumentRelations**: Polymorphic relationships for documents

## Architectural Decisions

1. **TypeORM**: Chosen over Prisma for its flexibility with polymorphic relationships and mature transaction support.
2. **JWT Authentication**: Implemented with both access and refresh tokens for enhanced security.
3. **Repository Pattern**: Used for data access to improve maintainability and testability.
4. **Transaction Management**: Implemented for critical operations to ensure data integrity.

## Development Guide

### Creating Migrations

To generate a new migration:

```bash
npm run migration:generate -- -n MigrationName
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── common/                    # Common utilities and base classes
│   └── base.entity.ts         # Base entity with common fields
├── config/                    # Configuration files
│   └── typeorm.config.ts      # TypeORM configuration
├── entities/                  # TypeORM entities
│   ├── user.entity.ts
│   ├── organisation.entity.ts
│   ├── organisation-user.entity.ts
│   ├── project.entity.ts
│   ├── address.entity.ts
│   ├── document.entity.ts
│   └── document-relation.entity.ts
└── modules/                   # Feature modules
    ├── auth/                  # Authentication module
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── dto/
    │   ├── guards/
    │   ├── decorators/
    │   ├── interfaces/
    │   └── strategies/
    ├── users/                 # Users module
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── dto/
    ├── projects/              # Projects module
    │   ├── projects.module.ts
    │   ├── projects.controller.ts
    │   ├── projects.service.ts
    │   └── dto/
    └── database/              # Database migrations and seeds
        ├── migrations/
        └── seeds/
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 