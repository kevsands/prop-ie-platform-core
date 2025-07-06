'use client';

import { useGraphQLMutation } from './useGraphQL';
import { QueryClient } from '@tanstack/react-query';

// Document mutations
const UPLOAD_DOCUMENT = /* GraphQL */ `
  mutation UploadDocument($input: UploadDocumentInput!) {
    uploadDocument(input: $input) {
      id
      name
      status
      downloadUrl
    }
  }
`;

const UPDATE_DOCUMENT = /* GraphQL */ `
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
`;

const DELETE_DOCUMENT = /* GraphQL */ `
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      id
      status
    }
  }
`;

const REQUEST_SIGNATURE = /* GraphQL */ `
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
`;

const SIGN_DOCUMENT = /* GraphQL */ `
  mutation SignDocument($signatureId: ID!) {
    signDocument(signatureId: $signatureId) {
      id
      status
      signedAt
    }
  }
`;

// Response interfaces
interface DocumentUploadResponse {
  uploadDocument: {
    id: string;
    name: string;
    status: string;
    downloadUrl: string;
  };
}

interface DocumentUpdateResponse {
  updateDocument: {
    id: string;
    name: string;
    status: string;
    metadata: {
      category?: string;
      tags?: string[];
      description?: string;
      version?: string;
    };
  };
}

interface DocumentDeleteResponse {
  deleteDocument: {
    id: string;
    status: string;
  };
}

interface SignatureRequestResponse {
  requestSignature: {
    id: string;
    status: string;
    signatures: Array<{
      id: string;
      signedBy: {
        id: string;
        name: string;
      };
      status: string;
    }>;
  };
}

interface SignDocumentResponse {
  signDocument: {
    id: string;
    status: string;
    signedAt: string;
  };
}

// Input types
export interface UploadDocumentInput {
  projectId: string;
  file: File;
  metadata: {
    category?: string;
    tags?: string | string[];
    description?: string;
    version?: string;
  };
}

export interface UpdateDocumentInput {
  id: string;
  input: {
    name?: string;
    metadata?: {
      category?: string;
      tags?: string | string[];
      description?: string;
      version?: string;
    };
  };
}

export function useDocumentMutations() {
  // Create a new QueryClient instance
  const queryClient = new QueryClient();

  // Upload document mutation
  const uploadMutation = useGraphQLMutation<DocumentUploadResponse, { input: any }>(
    UPLOAD_DOCUMENT,
    {
      mutationKey: ['uploadDocument'],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  );

  // Update document mutation
  const updateMutation = useGraphQLMutation<DocumentUpdateResponse, { id: string; input: any }>(
    UPDATE_DOCUMENT,
    {
      mutationKey: ['updateDocument'],
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ 
          queryKey: ['document', data.updateDocument.id]
        });
      }
    }
  );

  // Delete document mutation
  const deleteMutation = useGraphQLMutation<DocumentDeleteResponse, { id: string }>(
    DELETE_DOCUMENT,
    {
      mutationKey: ['deleteDocument'],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  );

  // Request signature mutation
  const requestSignatureMutation = useGraphQLMutation<
    SignatureRequestResponse, 
    { documentId: string; userId: string }
  >(
    REQUEST_SIGNATURE,
    {
      mutationKey: ['requestSignature'],
      onSuccess: (data) => {
        queryClient.invalidateQueries({ 
          queryKey: ['document', data.requestSignature.id]
        });
      }
    }
  );

  // Sign document mutation
  const signDocumentMutation = useGraphQLMutation<
    SignDocumentResponse, 
    { signatureId: string }
  >(
    SIGN_DOCUMENT,
    {
      mutationKey: ['signDocument'],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  );

  // Convenience methods
  const uploadDocument = async (variables: UploadDocumentInput) => {
    // For file uploads, we need to handle the file upload first
    // then pass the resulting URL to the GraphQL mutation
    
    try {
      // 1. Get a presigned URL for the file upload (implementation depends on your backend)
      const presignedUrl = await getPresignedUrl(variables.file.name, variables.file.type);
      
      // 2. Upload the file to the presigned URL
      await uploadToPresignedUrl(presignedUrl.url, variables.file);
      
      // Process tags if they're provided as a string
      let processedTags: string[] | undefined;
      if (typeof variables.metadata.tags === 'string') {
        processedTags = variables.metadata.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      } else {
        processedTags = variables.metadata.tags;
      }
      
      // 3. Call the GraphQL mutation with the file URL
      return uploadMutation.mutateAsync({
        input: {
          projectId: variables.projectId,
          name: variables.file.name,
          fileType: variables.file.type,
          fileSize: variables.file.size,
          fileUrl: presignedUrl.fileUrl,
          metadata: {
            ...variables.metadata,
            tags: processedTags
          }
        }
      });
    } catch (error) {
      console.error("Error in uploadDocument:", error);
      throw error;
    }
  };

  const updateDocument = (variables: UpdateDocumentInput) => {
    // Process tags if they're provided as a string
    const processedInput = { ...variables.input };
    
    if (processedInput.metadata?.tags && typeof processedInput.metadata.tags === 'string') {
      processedInput.metadata = {
        ...processedInput.metadata,
        tags: (processedInput.metadata.tags as string)
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };
    }
    
    return updateMutation.mutateAsync({
      id: variables.id,
      input: processedInput
    });
  };

  const deleteDocument = (id: string) => {
    return deleteMutation.mutateAsync({ id });
  };

  const requestSignature = (documentId: string, userId: string) => {
    return requestSignatureMutation.mutateAsync({
      documentId,
      userId
    });
  };

  const signDocument = (signatureId: string) => {
    return signDocumentMutation.mutateAsync({
      signatureId
    });
  };

  return {
    uploadDocument,
    updateDocument,
    deleteDocument,
    requestSignature,
    signDocument,
    // Expose loading and error states
    isUploading: uploadMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRequestingSignature: requestSignatureMutation.isPending,
    isSigning: signDocumentMutation.isPending,
    // Expose errors
    uploadError: uploadMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    requestSignatureError: requestSignatureMutation.error,
    signError: signDocumentMutation.error
  };
}

// Helper functions for file uploads
async function getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; fileUrl: string }> {
  // Example implementation - this would be replaced with your actual implementation
  try {
    const response = await fetch('/api/get-upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get presigned URL: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    throw error;
  }
}

async function uploadToPresignedUrl(url: string, file: File): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error uploading to presigned URL:", error);
    throw error;
  }
}