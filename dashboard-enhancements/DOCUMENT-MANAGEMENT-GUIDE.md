# Document Management System Guide

This guide provides an overview of the Document Management System implementation, including its architecture, key features, and usage instructions.

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [API Reference](#api-reference)
5. [UI Components](#ui-components)
6. [Adding Document Management to Your Project](#adding-document-management-to-your-project)
7. [Document Workflows](#document-workflows)
8. [Document Permissions](#document-permissions)
9. [Document Versioning](#document-versioning)
10. [Testing](#testing)

## Overview

The Document Management System (DMS) is designed to provide comprehensive document handling within the PropIE AWS application. It allows users to upload, view, manage, and share documents with versioning, permission controls, and workflow capabilities.

The system is AWS-integrated with S3 storage for documents and leverages the application's existing authentication and authorization systems.

## Key Features

- **Document Upload**: Upload files with metadata, including name, description, category, and tags
- **Document Versioning**: Create and manage versions of documents with change tracking
- **Document Permissions**: Control access to documents with fine-grained permissions
- **Document Workflows**: Define and execute approval workflows for documents
- **Document Viewing**: View documents in-browser or download them
- **Document Search**: Search documents by name, content, metadata, and more
- **Document Sharing**: Share documents with other users with specific permissions

## Architecture

The Document Management System follows a layered architecture:

### Frontend Components
- UI Components: React components for document management interfaces
- Service Layer: Client-side services for interacting with the document API
- State Management: Context and hooks for managing document state

### Backend Components
- API Routes: Next.js API routes for document operations
- Service Layer: Server-side services for business logic
- Repository Layer: Data access layer for document storage and retrieval
- AWS Integration: S3 for document storage, CloudFront for document delivery

### Data Model

The core document data model is defined in `/src/types/document.ts` and `/src/types/core/document.ts` and includes:

- `Document`: Core document metadata and properties
- `DocumentVersion`: Document version information
- `DocumentWorkflow`: Workflow definitions and states
- `DocumentPermissions`: Access control and sharing

## API Reference

### Document Service API

The Document Service provides the following methods:

#### Document Management
- `uploadDocument(file, metadata)`: Upload a new document or new version
- `getDocuments(filter)`: Get documents with optional filtering
- `getDocumentById(id)`: Get a document by ID
- `updateDocument(id, updates)`: Update document metadata
- `deleteDocument(id, soft)`: Delete or archive a document

#### Document Versioning
- `getDocumentVersions(documentId)`: Get versions of a document

#### Document Permissions
- `updatePermissions(id, permissions)`: Update document permissions

#### Document Workflows
- `startWorkflow(id, workflowId)`: Start a workflow for a document
- `approveWorkflowStage(documentId, workflowInstanceId, notes)`: Approve a workflow stage
- `rejectWorkflowStage(documentId, workflowInstanceId, notes)`: Reject a workflow stage
- `getWorkflowHistory(documentId)`: Get workflow history for a document

### REST API Endpoints

All document operations are available through REST API endpoints:

- `GET /api/documents`: List documents or get document by ID
- `POST /api/documents`: Create a new document
- `PUT /api/documents`: Update an existing document
- `DELETE /api/documents`: Delete or archive a document
- `POST /api/documents/upload-url`: Generate a pre-signed URL for file upload
- `GET /api/documents/versions`: Get document versions
- `POST /api/documents/versions`: Create a new document version
- `PUT /api/documents/permissions`: Update document permissions
- `POST /api/documents/workflow/start`: Start a workflow
- `POST /api/documents/workflow/approve`: Approve a workflow stage
- `POST /api/documents/workflow/reject`: Reject a workflow stage
- `GET /api/documents/workflow/history`: Get workflow history

## UI Components

The Document Management System includes the following UI components:

### Main Components
- `DocumentManager`: Main component for document management
- `DocumentUploader`: Component for uploading documents
- `DocumentList`: Component for displaying a list of documents
- `DocumentDetails`: Component for displaying document details

### Specialized Components
- `DocumentFilterPanel`: Component for filtering documents
- `DocumentVersionHistory`: Component for displaying document versions
- `DocumentWorkflowView`: Component for viewing and managing document workflows
- `DocumentPermissionsEditor`: Component for editing document permissions

## Adding Document Management to Your Project

### Basic Integration

To add document management to your project:

1. Import the DocumentManager component:
```tsx
import { DocumentManager } from '@/components/documents';
```

2. Add it to your page or component:
```tsx
<DocumentManager 
  title="Project Documents"
  description="Manage your project documents"
  relatedEntityType="project"
  relatedEntityId={projectId}
  relatedEntityName={projectName}
/>
```

### Document Upload Only

If you only need document upload functionality:

```tsx
import { DocumentUploader } from '@/components/documents';

// In your component
const handleUpload = async (file, metadata) => {
  const result = await documentService.uploadDocument(file, metadata);
  if (result.success) {
    // Handle success
  }
};

// In your JSX
<DocumentUploader 
  onUpload={handleUpload}
  loading={isUploading}
  relatedEntityType="project"
  relatedEntityId={projectId}
/>
```

### Document Details View

To display document details:

```tsx
import { DocumentDetails } from '@/components/documents';

// In your JSX
<DocumentDetails
  document={document}
  onVersionAdded={handleVersionAdded}
  onStatusChange={handleStatusChange}
/>
```

## Document Workflows

Document workflows enable systematic review and approval processes for documents.

### Workflow Definition

A workflow consists of stages, each with its own approvers and settings:

```typescript
interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  stages: DocumentWorkflowStage[];
  documentTypes: DocumentType[];
  isDefault: boolean;
}

interface DocumentWorkflowStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  approvers: ApproverConfig[];
  isOptional: boolean;
  timeoutDays?: number;
}
```

### Starting a Workflow

```typescript
// Start a workflow for a document
const result = await documentService.startWorkflow(
  documentId,
  workflowId
);
```

### Workflow Approval/Rejection

```typescript
// Approve a workflow stage
await documentService.approveWorkflowStage(
  documentId,
  workflowInstanceId,
  'Approved - looks good'
);

// Reject a workflow stage
await documentService.rejectWorkflowStage(
  documentId,
  workflowInstanceId,
  'Rejected - please fix the highlighted issues'
);
```

## Document Permissions

Document permissions control who can access, edit, and share documents.

### Permission Structure

```typescript
interface DocumentPermissions {
  isPublic: boolean;
  sensitivity: 'low' | 'standard' | 'confidential';
  canView: string[]; // User IDs
  canEdit: string[];
  canDelete: string[];
  canShare: string[];
}
```

### Setting Permissions

```typescript
// Update document permissions
await documentService.updatePermissions(documentId, {
  isPublic: false,
  sensitivity: 'standard',
  canView: ['user1', 'user2', 'user3'],
  canEdit: ['user1'],
  canDelete: ['user1'],
  canShare: ['user1', 'user2']
});
```

## Document Versioning

Document versioning keeps track of changes to documents over time.

### Creating a New Version

```typescript
// Upload a new version of a document
const result = await documentService.uploadDocument(file, {
  isNewVersion: true,
  documentId: existingDocumentId,
  versionNotes: 'Updated with new information'
});
```

### Getting Version History

```typescript
// Get document versions
const versions = await documentService.getDocumentVersions(documentId);
```

## Testing

The Document Management System includes a comprehensive test script to verify its functionality:

```typescript
// Import the test runner
import { runTests } from '@/tests/document-management-test';

// Run all tests
runTests().then(() => {
  console.log('Tests completed');
});
```

You can also run individual test functions for specific features:

```typescript
import {
  testDocumentUpload,
  testDocumentRetrieval,
  testDocumentVersioning,
  testDocumentPermissions,
  testDocumentWorkflow
} from '@/tests/document-management-test';

// Run just the upload test
testDocumentUpload().then(document => {
  console.log('Upload test completed');
});
```