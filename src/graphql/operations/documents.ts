export const GET_DOCUMENTS = `
  query GetDocuments($projectId: ID!, $filters: DocumentFiltersInput) {
    documents(projectId: $projectId, filters: $filters) {
      items {
        id
        name
        description
        status
        category
        projectId
        uploadedBy {
          id
          name
        }
        uploadedAt
        updatedAt
        url
        metadata
      }
      pagination {
        hasMore
        nextCursor
        totalCount
      }
    }
  }
`;

export const GET_DOCUMENT_BY_ID = `
  query GetDocumentById($id: ID!) {
    document(id: $id) {
      id
      name
      description
      status
      category
      projectId
      uploadedBy {
        id
        name
      }
      uploadedAt
      updatedAt
      url
      metadata
    }
  }
`;

export const GET_DOCUMENT_CATEGORIES = `
  query GetDocumentCategories($projectId: ID!) {
    documentCategories(projectId: $projectId) {
      id
      name
      description
      projectId
    }
  }
`;

export const UPLOAD_DOCUMENT = `
  mutation UploadDocument($input: UploadDocumentInput!) {
    uploadDocument(input: $input) {
      id
      name
      description
      status
      category
      projectId
      uploadedBy {
        id
        name
      }
      uploadedAt
      updatedAt
      url
      metadata
    }
  }
`;

export const UPDATE_DOCUMENT = `
  mutation UpdateDocument($input: UpdateDocumentInput!) {
    updateDocument(input: $input) {
      id
      name
      description
      status
      category
      projectId
      uploadedBy {
        id
        name
      }
      uploadedAt
      updatedAt
      url
      metadata
    }
  }
`;

export const DELETE_DOCUMENT = `
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;

export const REQUEST_SIGNATURE = `
  mutation RequestSignature($documentId: ID!, $signerId: ID!) {
    requestSignature(documentId: $documentId, signerId: $signerId)
  }
`;

export const SIGN_DOCUMENT = `
  mutation SignDocument($documentId: ID!) {
    signDocument(documentId: $documentId)
  }
`;

export const ON_DOCUMENT_UPDATE = `
  subscription OnDocumentUpdate($documentId: ID!) {
    onDocumentUpdate(documentId: $documentId) {
      id
      name
      description
      status
      category
      projectId
      uploadedBy {
        id
        name
      }
      uploadedAt
      updatedAt
      url
      metadata
    }
  }
`;

export const ON_SIGNATURE_REQUEST = `
  subscription OnSignatureRequest($documentId: ID!) {
    onSignatureRequest(documentId: $documentId) {
      id
      document {
        id
        name
        status
      }
      requestedBy {
        id
        name
      }
      status
      requestedAt
    }
  }
`; 