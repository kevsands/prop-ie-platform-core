"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getConfig } from '../config/environment';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  contentHtml: string;
  tags?: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  fields: Array<{
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    helpText?: string;
  }>\n  );
}

interface UseDocumentTemplatesResult {
  templates: DocumentTemplate[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>\n  );
}

export function useDocumentTemplates(orgSlug: string): UseDocumentTemplatesResult {
  const { accessToken, isAuthenticated } = useAuth();
  const [templatessetTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoadingsetIsLoading] = useState<boolean>(true);
  const [errorsetError] = useState<Error | null>(null);

  const fetchTemplates = async () => {
    if (!isAuthenticated || !accessToken || !orgSlug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = getConfig('apiUrl');
      const response = await fetch(`${apiUrl}/api/${orgSlug}/templates`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }

      const data = await response.json();
      setTemplates(data as DocumentTemplate[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [orgSlug, accessTokenisAuthenticated]);

  return { templates, isLoading, error, refetch: fetchTemplates };
}

// For development or testing
export function getMockDocumentTemplates(): DocumentTemplate[] {
  return [
    {
      id: "template-1",
      name: "Sales Contract",
      description: "Standard contract for property sales with customizable terms",
      category: "sales",
      contentHtml: "<h1>Sales Contract</h1><p>This agreement dated {date} between {sellerName} and {buyerName}...</p>",
      tags: ["contract", "sales", "legal"],
      usageCount: 24,
      createdAt: "2024-12-01T08:30:00Z",
      updatedAt: "2025-03-15T14:22:00Z",
      fields: [
        {
          id: "field-1",
          name: "date",
          label: "Agreement Date",
          type: "date",
          required: true
        },
        {
          id: "field-2",
          name: "sellerName",
          label: "Seller Name",
          type: "text",
          required: true
        },
        {
          id: "field-3",
          name: "buyerName",
          label: "Buyer Name",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "template-2",
      name: "Construction Schedule",
      description: "Template for creating construction schedules with milestones",
      category: "construction",
      contentHtml: "<h1>Construction Schedule</h1><p>Project: {projectName}</p><p>Start Date: {startDate}</p>...",
      tags: ["schedule", "construction", "planning"],
      usageCount: 18,
      createdAt: "2025-01-10T10:15:00Z",
      updatedAt: "2025-02-22T09:45:00Z",
      fields: [
        {
          id: "field-1",
          name: "projectName",
          label: "Project Name",
          type: "text",
          required: true
        },
        {
          id: "field-2",
          name: "startDate",
          label: "Start Date",
          type: "date",
          required: true
        }
      ]
    },
    {
      id: "template-3",
      name: "Property Handover Checklist",
      description: "Comprehensive checklist for property handover to owners",
      category: "handover",
      contentHtml: "<h1>Property Handover Checklist</h1><p>Property: {propertyAddress}</p>...",
      tags: ["checklist", "handover", "inspection"],
      usageCount: 31,
      createdAt: "2024-11-05T14:30:00Z",
      updatedAt: "2025-04-02T11:20:00Z",
      fields: [
        {
          id: "field-1",
          name: "propertyAddress",
          label: "Property Address",
          type: "textarea",
          required: true
        },
        {
          id: "field-2",
          name: "handoverDate",
          label: "Handover Date",
          type: "date",
          required: true
        }
      ]
    }
  ];
}