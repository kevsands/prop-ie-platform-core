import { useQuery, useMutation, useSubscription } from './index';
import type { Document, DocumentCategory, DocumentsResponse, DocumentFilters, UploadDocumentInput, UpdateDocumentInput } from '../types/documents';
import { GET_DOCUMENTS, GET_DOCUMENT_BY_ID, GET_DOCUMENT_CATEGORIES, UPLOAD_DOCUMENT, UPDATE_DOCUMENT, DELETE_DOCUMENT, REQUEST_SIGNATURE, SIGN_DOCUMENT, ON_DOCUMENT_UPDATE, ON_SIGNATURE_REQUEST } from '../operations/documents';

export function useDocuments(projectId: string, filters?: DocumentFilters) {
  return useQuery<DocumentsResponse>(GET_DOCUMENTS, {
    variables: { projectId, filters },
    transform: (data: any) => ({
      documents: data.documents?.items || [],
      pagination: data.documents?.pagination || { hasMore: false, nextCursor: null, totalCount: 0 }
    })
  });
}

export function useDocument(documentId: string) {
  return useQuery<{ document: Document }>(GET_DOCUMENT_BY_ID, {
    variables: { id: documentId },
    enabled: !!documentId,
    transform: (data: any) => ({
      document: data.document
    })
  });
}

export function useDocumentCategories(projectId: string) {
  return useQuery<{ documentCategories: DocumentCategory[] }>(GET_DOCUMENT_CATEGORIES, {
    variables: { projectId },
    transform: (data: any) => ({
      documentCategories: data.documentCategories || []
    })
  });
}

export function useDocumentMutations() {
  const uploadDocument = useMutation<{ uploadDocument: Document }, { input: UploadDocumentInput }>(UPLOAD_DOCUMENT);
  const updateDocument = useMutation<{ updateDocument: Document }, { input: UpdateDocumentInput }>(UPDATE_DOCUMENT);
  const deleteDocument = useMutation<{ deleteDocument: boolean }, { id: string }>(DELETE_DOCUMENT);
  const requestSignature = useMutation<{ requestSignature: boolean }, { documentId: string, signerId: string }>(REQUEST_SIGNATURE);
  const signDocument = useMutation<{ signDocument: boolean }, { documentId: string }>(SIGN_DOCUMENT);

  return {
    uploadDocument,
    updateDocument,
    deleteDocument,
    requestSignature,
    signDocument
  };
}

export function useDocumentSubscriptions(documentId: string) {
  return useSubscription<{ onDocumentUpdate: Document }>(ON_DOCUMENT_UPDATE, {
    variables: { documentId },
    enabled: !!documentId,
    onData: (data: any) => {
      // Handle document update
      console.log('Document updated:', data.onDocumentUpdate);
    }
  });
}

export function useSignatureRequestSubscriptions(documentId: string) {
  return useSubscription<{
    onSignatureRequest: {
      id: string;
      document: {
        id: string;
        name: string;
        status: string;
      };
      requestedBy: {
        id: string;
        name: string;
      };
      status: string;
      requestedAt: string;
    };
  }>(ON_SIGNATURE_REQUEST, {
    variables: { documentId },
    enabled: !!documentId,
    onData: (data: any) => {
      // Handle signature request
      console.log('Signature requested:', data.onSignatureRequest);
    }
  });
} 