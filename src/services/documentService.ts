import {
  Document as DocumentType,
  DocumentStatus,
  DocumentType as DocumentTypeEnum,
  DocumentCategory,
  DocumentFilter,
  DocumentPermissions
} from '@/types/document';
import { DocumentVersion, DocumentWorkflowInstance } from '@/types/core/document';

/**
 * Document service for client-side operations
 * Handles document management operations like uploading, fetching, and managing versions
 */
class DocumentService {
  /**
   * Upload a new document or a new version of an existing document
   * @param file File to upload
   * @param metadata Document metadata
   * @returns Upload result with success status, document, and message
   */
  async uploadDocument(file: File, metadata: Partial<DocumentType>): Promise<{
    success: boolean;
    document?: DocumentType;
    message?: string;
  }> {
    try {
      // First, generate a pre-signed URL for the file upload
      const uploadUrlResponse = await this.generateUploadUrl(file.name, file.type);

      if (!uploadUrlResponse.success) {
        return {
          success: false,
          message: uploadUrlResponse.message || 'Failed to generate upload URL'
        };
      }

      if (!uploadUrlResponse.uploadUrl) {
        return {
          success: false,
          message: 'Upload URL is missing'
        };
      }

      // Upload the file to the pre-signed URL
      const uploadResult = await this.uploadFileToUrl(file, uploadUrlResponse.uploadUrl);

      if (!uploadResult.success) {
        return {
          success: false,
          message: uploadResult.message || 'Failed to upload file'
        };
      }

      // Now create or update the document record
      const documentData = {
        ...metadata,
        fileUrl: uploadUrlResponse.fileUrl,
        fileType: file.type,
        fileSize: file.size
      };

      // Check if this is a new version of an existing document
      if (metadata.isNewVersion && metadata.documentId) {
        return await this.createDocumentVersion(
          metadata.documentId,
          file,
          documentData,
          metadata.versionNotes || ''
        );
      } else {
        // Create a new document
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': this.getCsrfToken() // Add CSRF token for security
          },
          body: JSON.stringify(documentData)
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: result.error || 'Failed to create document record'
          };
        }

        return {
          success: true,
          document: result as DocumentType,
          message: 'Document uploaded successfully'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during upload'
      };
    }
  }

  /**
   * Create a new version of an existing document
   * @param documentId Original document ID
   * @param file New version file
   * @param metadata Updated metadata
   * @param versionNotes Notes about the changes in this version
   * @returns Version creation result
   */
  private async createDocumentVersion(
    documentId: string,
    file: File,
    metadata: Partial<DocumentType>,
    versionNotes: string
  ): Promise<{
    success: boolean;
    document?: DocumentType;
    message?: string;
  }> {
    try {
      const versionData = {
        documentId,
        fileUrl: metadata.fileUrl,
        fileSize: metadata.fileSize,
        versionNotes,
        changes: versionNotes, // For backward compatibility
      };

      const response = await fetch(`/api/documents/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify(versionData)
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to create document version'
        };
      }

      return {
        success: true,
        document: result as DocumentType,
        message: 'Document version created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while creating version'
      };
    }
  }

  /**
   * Get document versions
   * @param documentId Document ID
   * @returns List of document versions
   */
  async getDocumentVersions(documentId: string): Promise<{
    success: boolean;
    versions?: DocumentVersion[];
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents/versions?documentId=${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to retrieve document versions'
        };
      }

      return {
        success: true,
        versions: result as DocumentVersion[],
        message: 'Document versions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while fetching versions'
      };
    }
  }

  /**
   * Generate a pre-signed URL for file upload
   * @param fileName File name
   * @param fileType File MIME type
   * @returns Pre-signed URL and final file URL
   */
  private async generateUploadUrl(fileName: string, fileType: string): Promise<{
    success: boolean;
    uploadUrl?: string;
    fileUrl?: string;
    expiresIn?: number;
    message?: string;
  }> {
    try {
      const response = await fetch('/api/documents/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify({
          fileName,
          fileType
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to generate upload URL'
        };
      }

      return {
        success: true,
        uploadUrl: result.uploadUrl,
        fileUrl: result.fileUrl,
        expiresIn: result.expiresIn
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Upload a file to a pre-signed URL
   * @param file File to upload
   * @param uploadUrl Pre-signed URL
   * @returns Upload result
   */
  private async uploadFileToUrl(file: File, uploadUrl: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Failed to upload file: ${response.statusText}`
        };
      }

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Get documents with optional filtering
   * @param filter Document filter options
   * @returns List of documents
   */
  async getDocuments(filter: DocumentFilter = {}): Promise<DocumentType[]> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      if ('id' in filter && filter.id) {
        params.append('id', filter.id);
      }

      if (filter.search) {
        params.append('searchTerm', filter.search);
      }

      if (filter.types && filter.types.length > 0) {
        params.append('type', filter.types[0].toString());
      }

      if (filter.categories && filter.categories.length > 0) {
        params.append('category', filter.categories[0].toString());
      }

      if (filter.statuses && filter.statuses.length > 0) {
        params.append('status', filter.statuses[0].toString());
      }

      if (filter.relatedTo) {
        params.append('entityType', filter.relatedTo.type);
        params.append('entityId', filter.relatedTo.id);
      }

      const response = await fetch(`/api/documents?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }

      const result = await response.json();
      return result as DocumentType[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a document by ID
   * @param id Document ID
   * @returns Document or null if not found
   */
  async getDocumentById(id: string): Promise<DocumentType | null> {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const result = await response.json();
      return result as DocumentType;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update document metadata
   * @param id Document ID
   * @param updates Document updates
   * @returns Updated document
   */
  async updateDocument(id: string, updates: Partial<DocumentType>): Promise<DocumentType> {
    try {
      const response = await fetch('/api/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify({
          id,
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update document: ${response.statusText}`);
      }

      const result = await response.json();
      return result as DocumentType;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a document
   * @param id Document ID
   * @param soft Whether to soft-delete (archive) instead of hard-delete
   * @returns Success status and message
   */
  async deleteDocument(id: string, soft = true): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents?id=${id}&soft=${soft}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`);
      }

      return {
        success: true,
        message: soft ? 'Document archived successfully' : 'Document deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Update document permissions
   * @param id Document ID
   * @param permissions Updated permissions
   * @returns Success status and message
   */
  async updatePermissions(id: string, permissions: DocumentPermissions): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify({
          documentId: id,
          permissions
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update permissions: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Permissions updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Start a document workflow
   * @param id Document ID
   * @param workflowId Workflow ID to start
   * @returns Success status and workflow instance
   */
  async startWorkflow(id: string, workflowId: string): Promise<{
    success: boolean;
    workflow?: DocumentWorkflowInstance;
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents/workflow/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify({
          documentId: id,
          workflowId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to start workflow'
        };
      }

      return {
        success: true,
        workflow: result as DocumentWorkflowInstance,
        message: 'Workflow started successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Approve a document workflow stage
   * @param documentId Document ID
   * @param workflowInstanceId Workflow instance ID
   * @param notes Approval notes
   * @returns Success status and message
   */
  async approveWorkflowStage(
    documentId: string,
    workflowInstanceId: string,
    notes?: string
  ): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents/workflow/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify({
          documentId,
          workflowInstanceId,
          notes
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to approve workflow stage'
        };
      }

      return {
        success: true,
        message: 'Workflow stage approved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Reject a document workflow stage
   * @param documentId Document ID
   * @param workflowInstanceId Workflow instance ID
   * @param notes Rejection reason
   * @returns Success status and message
   */
  async rejectWorkflowStage(
    documentId: string,
    workflowInstanceId: string,
    notes: string
  ): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents/workflow/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': this.getCsrfToken()
        },
        body: JSON.stringify({
          documentId,
          workflowInstanceId,
          notes
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to reject workflow stage'
        };
      }

      return {
        success: true,
        message: 'Workflow stage rejected successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Get workflow history for a document
   * @param documentId Document ID
   * @returns Workflow history
   */
  async getWorkflowHistory(documentId: string): Promise<{
    success: boolean;
    history?: Array<{
      id: string;
      stage: string;
      timestamp: string;
      status: string;
      user: { id: string; name: string };
      notes?: string;
    }>;
    message?: string;
  }> {
    try {
      const response = await fetch(`/api/documents/workflow/history?documentId=${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Failed to retrieve workflow history'
        };
      }

      return {
        success: true,
        history: result as Array<{
          id: string;
          stage: string;
          timestamp: string;
          status: string;
          user: { id: string; name: string };
          notes?: string;
        }>,
        message: 'Workflow history retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  /**
   * Get CSRF token from meta tag
   * @returns CSRF token
   */
  private getCsrfToken(): string {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfMeta ? csrfMeta.getAttribute('content') || '' : '';
  }
}

// Create singleton instance
export const documentService = new DocumentService();