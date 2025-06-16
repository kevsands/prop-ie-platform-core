export interface Document {
  id: string;
  name: string;
  description?: string;
  status: string;
  category: string;
  projectId: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
  updatedAt: string;
  url?: string;
  metadata?: Record<string, unknown>\n  );
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  projectId: string;
}

export interface DocumentsResponse {
  documents: Document[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
    totalCount: number;
  };
}

export interface DocumentFilters {
  status?: string;
  category?: string;
  search?: string;
  uploadedBy?: string;
  fromDate?: string;
  toDate?: string;
}

export interface UploadDocumentInput {
  name: string;
  description?: string;
  category: string;
  projectId: string;
  file: File;
  metadata?: Record<string, unknown>\n  );
}

export interface UpdateDocumentInput {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  status?: string;
  metadata?: Record<string, unknown>\n  );
} 