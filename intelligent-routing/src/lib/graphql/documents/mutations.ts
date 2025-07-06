/**
 * Document GraphQL Mutations
 * 
 * This file contains GraphQL mutations related to documents and document management
 */

// Document mutations
export const CREATE_DOCUMENT = /* GraphQL */ `
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
      name
      description
      type
      status
      category
      fileUrl
      fileType
      fileSize
      uploadedBy {
        id
        name
        email
      }
      uploadDate
      expiryDate
      tags
      version
      metadata
      signatureRequired
    }
  }
`;

export const UPDATE_DOCUMENT = /* GraphQL */ `
  mutation UpdateDocument($id: ID!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      id
      name
      description
      category
      tags
      expiryDate
      metadata
    }
  }
`;

export const CHANGE_DOCUMENT_STATUS = /* GraphQL */ `
  mutation ChangeDocumentStatus($id: ID!, $status: DocumentStatus!) {
    changeDocumentStatus(id: $id, status: $status) {
      id
      status
      name
    }
  }
`;

export const CREATE_DOCUMENT_VERSION = /* GraphQL */ `
  mutation CreateDocumentVersion($input: CreateDocumentVersionInput!) {
    createDocumentVersion(input: $input) {
      id
      versionNumber
      fileUrl
      createdBy {
        id
        name
        email
      }
      created
      notes
      changes
      size
      checksum
    }
  }
`;

export const SIGN_DOCUMENT = /* GraphQL */ `
  mutation SignDocument($input: SignDocumentInput!) {
    signDocument(input: $input) {
      id
      signerId
      signerName
      signatureDate
      signatureImageUrl
      signaturePosition
      signatureMethod
      verified
      certificateUrl
    }
  }
`;

export const ARCHIVE_DOCUMENT = /* GraphQL */ `
  mutation ArchiveDocument($id: ID!) {
    archiveDocument(id: $id) {
      id
      name
      status
    }
  }
`;

// Document upload presigned URL mutation
export const REQUEST_DOCUMENT_UPLOAD_URL = /* GraphQL */ `
  mutation RequestDocumentUploadUrl($filename: String!, $contentType: String!) {
    requestDocumentUploadUrl(filename: $filename, contentType: $contentType) {
      uploadUrl
      fileKey
      expiresIn
    }
  }
`;