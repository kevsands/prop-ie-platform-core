// Document Operations
export const DOCUMENT_QUERIES = {
  GET_DOCUMENTS: /* GraphQL */ `
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
  `,

  GET_DOCUMENT_BY_ID: /* GraphQL */ `
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
  `,

  GET_DOCUMENT_CATEGORIES: /* GraphQL */ `
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
  `};

export const DOCUMENT_MUTATIONS = {
  UPLOAD_DOCUMENT: /* GraphQL */ `
    mutation UploadDocument($input: UploadDocumentInput!) {
      uploadDocument(input: $input) {
        id
        name
        status
        downloadUrl
      }
    }
  `,

  UPDATE_DOCUMENT: /* GraphQL */ `
    mutation UpdateDocument($id: ID!, $input: UpdateDocumentInput!) {
      updateDocument(id: $id, input: $input) {
        id
        name
        status
        metadata {
          category
          tags
          description
          version
        }
      }
    }
  `,

  DELETE_DOCUMENT: /* GraphQL */ `
    mutation DeleteDocument($id: ID!) {
      deleteDocument(id: $id) {
        id
        status
      }
    }
  `,

  REQUEST_SIGNATURE: /* GraphQL */ `
    mutation RequestSignature($documentId: ID!, $userId: ID!) {
      requestSignature(documentId: $documentId, userId: $userId) {
        id
        status
        signatures {
          id
          signedBy {
            id
            name
          }
          status
        }
      }
    }
  `,

  SIGN_DOCUMENT: /* GraphQL */ `
    mutation SignDocument($signatureId: ID!) {
      signDocument(signatureId: $signatureId) {
        id
        status
        signedAt
      }
    }
  `};

export const DOCUMENT_SUBSCRIPTIONS = {
  ON_DOCUMENT_UPDATE: /* GraphQL */ `
    subscription OnDocumentUpdate($documentId: ID!) {
      onDocumentUpdate(documentId: $documentId) {
        id
        name
        status
        metadata {
          category
          tags
          description
          version
        }
        signatures {
          id
          signedBy {
            id
            name
          }
          status
          signedAt
        }
      }
    }
  `,

  ON_SIGNATURE_REQUEST: /* GraphQL */ `
    subscription OnSignatureRequest($userId: ID!) {
      onSignatureRequest(userId: $userId) {
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
  `};

// Project Operations
export const PROJECT_QUERIES = {
  GET_PROJECTS: /* GraphQL */ `
    query GetProjects {
      projects {
        items {
          id
          name
          status
          documents {
            id
            name
            status
          }
        }
      }
    }
  `,

  GET_PROJECT_BY_ID: /* GraphQL */ `
    query GetProjectById($projectId: ID!) {
      project(id: $projectId) {
        id
        name
        status
        documents {
          id
          name
          status
          metadata {
            category
            tags
          }
        }
        team {
          id
          name
          role
        }
      }
    }
  `};

export const PROJECT_MUTATIONS = {
  CREATE_PROJECT: /* GraphQL */ `
    mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
        id
        name
        status
      }
    }
  `,

  UPDATE_PROJECT: /* GraphQL */ `
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
      updateProject(id: $id, input: $input) {
        id
        name
        status
      }
    }
  `,

  DELETE_PROJECT: /* GraphQL */ `
    mutation DeleteProject($id: ID!) {
      deleteProject(id: $id) {
        id
        status
      }
    }
  `};

export const PROJECT_SUBSCRIPTIONS = {
  ON_PROJECT_UPDATE: /* GraphQL */ `
    subscription OnProjectUpdate($projectId: ID!) {
      onProjectUpdate(projectId: $projectId) {
        id
        name
        status
        documents {
          id
          name
          status
        }
      }
    }
  `};

// User Operations
export const USER_QUERIES = {
  GET_CURRENT_USER: /* GraphQL */ `
    query GetCurrentUser {
      currentUser {
        id
        name
        email
        role
        permissions
        preferences {
          theme
          notifications
        }
      }
    }
  `,

  GET_USER_BY_ID: /* GraphQL */ `
    query GetUserById($userId: ID!) {
      user(id: $userId) {
        id
        name
        email
        role
        permissions
        preferences {
          theme
          notifications
        }
      }
    }
  `};

export const USER_MUTATIONS = {
  UPDATE_USER: /* GraphQL */ `
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
        id
        name
        email
        role
        permissions
        preferences {
          theme
          notifications
        }
      }
    }
  `,

  UPDATE_PREFERENCES: /* GraphQL */ `
    mutation UpdatePreferences($input: UpdatePreferencesInput!) {
      updatePreferences(input: $input) {
        theme
        notifications
      }
    }
  `};

export const USER_SUBSCRIPTIONS = {
  ON_USER_UPDATE: /* GraphQL */ `
    subscription OnUserUpdate($userId: ID!) {
      onUserUpdate(userId: $userId) {
        id
        name
        email
        role
        permissions
        preferences {
          theme
          notifications
        }
      }
    }
  `};

export * from './documents'; 