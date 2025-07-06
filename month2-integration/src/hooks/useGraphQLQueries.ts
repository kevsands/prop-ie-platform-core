'use client';

import { useGraphQLQuery } from './useGraphQL';
import type { QueryKey } from '@tanstack/react-query';

// Define TypeScript interfaces for our GraphQL responses
export interface DocumentItem {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: {
    category?: string;
    tags?: string[];
    description?: string;
    version?: string;
  };
  status: string;
  uploadedAt: string;
  expiresAt?: string;
  signatures?: Array<{
    id: string;
    signedBy: {
      id: string;
      name: string;
      email: string;
    };
    signedAt: string;
    status: string;
  }>;
}

export interface DocumentsResponse {
  items: DocumentItem[];
  totalCount: number;
}

export interface DocumentCategoryItem {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  documentCount: number;
  completionStatus: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  status: string;
}

export interface ProjectsResponse {
  items: ProjectItem[];
}

// Document queries
const GET_DOCUMENTS = /* GraphQL */ `
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

const GET_DOCUMENT_CATEGORIES = /* GraphQL */ `
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

const GET_DOCUMENT_BY_ID = /* GraphQL */ `
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

// Projects queries for document context
const GET_PROJECTS = /* GraphQL */ `
  query GetProjects {
    projects {
      items {
        id
        name
        status
      }
    }
  }
`;

// Type for filters
export interface DocumentFilters {
  category?: string;
  status?: string;
  searchTerm?: string;
  dateRange?: { start: string; end: string };
  tags?: string[];
}

// Hook for fetching documents
export function useDocuments(options: { 
  projectId?: string | null;
  filters?: DocumentFilters;
} = {}) {
  return useGraphQLQuery<{ documents: DocumentsResponse }>(
    ['documents', options.projectId || 'all', JSON.stringify(options.filters || {})] as QueryKey,
    GET_DOCUMENTS,
    { 
      projectId: options.projectId || null,
      filters: options.filters || null
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.documents || { items: [], totalCount: 0 };
      }
    }
  );
}

// Hook for fetching document categories
export function useDocumentCategories(projectId?: string | null) {
  return useGraphQLQuery<{ documentCategories: DocumentCategoryItem[] }>(
    ['documentCategories', projectId || 'all'] as QueryKey,
    GET_DOCUMENT_CATEGORIES,
    { projectId: projectId || null },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.documentCategories || [];
      }
    }
  );
}

// Hook for fetching a single document by ID
export function useDocument(documentId?: string) {
  return useGraphQLQuery<{ document: DocumentItem }>(
    ['document', documentId] as QueryKey,
    GET_DOCUMENT_BY_ID,
    { documentId },
    {
      enabled: Boolean(documentId),
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.document;
      }
    }
  );
}

// Hook for fetching projects (for document context)
export function useProjects() {
  return useGraphQLQuery<{ projects: ProjectsResponse }>(
    ['projects'] as QueryKey,
    GET_PROJECTS,
    {},
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.projects?.items || [];
      }
    }
  );
}

// Developer Dashboard GraphQL Query
const DEVELOPER_DASHBOARD_QUERY = /* GraphQL */ `
  query GetDeveloperDashboard {
    developerDashboard {
      activeProjects
      propertiesAvailable
      totalSales
      projects {
        id
        name
        status
        completionPercentage
        location
        propertyCount
        lastUpdated
      }
      salesTrend {
        period
        percentage
        direction
      }
    }
  }
`;

// Interface for dashboard data
export interface DeveloperDashboardData {
  activeProjects: number;
  propertiesAvailable: number;
  totalSales: number;
  projects: Array<{
    id: string;
    name: string;
    status: string;
    completionPercentage: number;
    location: string;
    propertyCount: number;
    lastUpdated: string;
  }>;
  salesTrend?: {
    period: string;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

// Full dashboard response type
interface DeveloperDashboardResponse {
  developerDashboard: DeveloperDashboardData;
}

// Hook for fetching developer dashboard data
export function useDeveloperDashboard() {
  const { data, isLoading, error } = useGraphQLQuery<DeveloperDashboardResponse>(
    ['developerDashboard'] as QueryKey,
    DEVELOPER_DASHBOARD_QUERY,
    {},
    {
      refetchOnWindowFocus: false,
      select: (data) => data || {
        developerDashboard: {
          activeProjects: 0,
          propertiesAvailable: 0,
          totalSales: 0,
          projects: []
        }
      }
    }
  );

  return {
    data: data?.developerDashboard || {
      activeProjects: 0,
      propertiesAvailable: 0,
      totalSales: 0,
      projects: []
    },
    loading: isLoading,
    error
  };
}