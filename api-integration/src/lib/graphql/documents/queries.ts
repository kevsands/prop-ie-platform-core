/**
 * Document GraphQL Queries
 * 
 * This file contains GraphQL queries related to documents and document management
 */

// Document queries
export const GET_DOCUMENTS = /* GraphQL */ `
  query GetDocuments($projectId: ID, $filters: DocumentFilterInput) {
    documents(projectId: $projectId, filters: $filters) {
      items {
        id
        name
        fileType
        fileSize
        downloadUrl
        uploadedBy {
          id
          name
          email
        }
        metadata {
          category
          tags
          description
          version
        }
        status
        uploadedAt
        expiresAt
        signatures {
          id
          signedBy {
            id
            name
            email
          }
          signedAt
          status
        }
      }
      totalCount
    }
  }
`;

export const GET_DOCUMENT_CATEGORIES = /* GraphQL */ `
  query GetDocumentCategories($projectId: ID) {
    documentCategories(projectId: $projectId) {
      id
      name
      description
      required
      documentCount
      completionStatus
    }
  }
`;

export const GET_DOCUMENT_BY_ID = /* GraphQL */ `
  query GetDocumentById($documentId: ID!) {
    document(id: $documentId) {
      id
      name
      fileType
      fileSize
      downloadUrl
      uploadedBy {
        id
        name
        email
      }
      metadata {
        category
        tags
        description
        version
      }
      status
      uploadedAt
      expiresAt
      signatures {
        id
        signedBy {
          id
          name
          email
        }
        signedAt
        status
      }
      history {
        id
        action
        performedBy {
          id
          name
        }
        timestamp
        details
      }
    }
  }
`;

export const GET_DOCUMENT_STATS = /* GraphQL */ `
  query GetDocumentStats($projectId: ID!) {
    documentStats(projectId: $projectId) {
      totalCount
      byStatus {
        status
        count
      }
      byCategory {
        category
        count
      }
      completionRate
      recentActivity {
        documentId
        action
        timestamp
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_DOCUMENT_COMPLIANCE = /* GraphQL */ `
  query GetDocumentCompliance($projectId: ID!) {
    documentCompliance(projectId: $projectId) {
      overallComplianceRate
      requiredDocuments {
        categoryId
        categoryName
        documentsRequired
        documentsSubmitted
        complianceRate
        status
      }
      upcomingDeadlines {
        documentType
        deadline
        daysRemaining
        status
      }
    }
  }
`;