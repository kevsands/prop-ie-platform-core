/**
 * GraphQL Fragment Examples
 * 
 * This file demonstrates how to create reusable GraphQL fragments
 * that match React component props for consistent data fetching.
 */

import {
  developmentSummaryFragment,
  developmentDetailsFragment,
  userSummaryFragment,
  documentFragment,
  salesStatusFragment
} from './fragments';

// Example 1: Using fragments with React component props
export interface DevelopmentCardProps {
  development: {
    id: string;
    name: string;
    slug?: string;
    status: string;
    mainImage: string;
    shortDescription?: string;
    totalUnits: number;
    availableUnits: number;
    location: {
      city: string;
      county: string;
    };
  };
}

// The fragment matches the component props exactly
const developmentCardQuery = /* GraphQL */ `
  query GetDevelopmentsForCards {
    developments {
      developments {
        ...DevelopmentSummary
      }
    }
  }
  ${developmentSummaryFragment}
`;

// Example 2: Composing fragments for a complex component
export interface PropertyDetailsProps {
  development: {
    id: string;
    name: string;
    description: string;
    images: string[];
    features: string[];
    amenities: string[];
    salesStatus: {
      totalUnits: number;
      availableUnits: number;
      reservedUnits: number;
      saleAgreedUnits: number;
      soldUnits: number;
      salesVelocity: number;
      targetPriceAverage: number;
      actualPriceAverage: number;
    };
    developer: {
      id: string;
      fullName: string;
      email: string;
      avatar?: string;
    };
  };
}

// Composing multiple fragments for a more complex component
const propertyDetailsQuery = /* GraphQL */ `
  query GetPropertyDetails($id: ID!) {
    development(id: $id) {
      ...DevelopmentDetails
      salesStatus {
        ...SalesStatus
      }
      developer {
        ...UserSummary
      }
    }
  }
  ${developmentDetailsFragment}
  ${salesStatusFragment}
  ${userSummaryFragment}
`;

// Example 3: Creating a custom fragment for a specific component
export interface DeveloperDashboardSummaryProps {
  totalDevelopments: number;
  activeProjects: number;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  revenue: {
    current: number;
    projected: number;
    percentComplete: number;
  };
}

// Creating a custom fragment that matches this specific component
export const developerDashboardFragment = /* GraphQL */ `
  fragment DeveloperDashboardSummary on DeveloperDashboard {
    totalDevelopments
    activeProjects
    totalUnits
    availableUnits
    soldUnits
    reservedUnits
    revenue {
      current
      projected
      percentComplete
    }
  }
`;

// Using the custom fragment
const developerDashboardQuery = /* GraphQL */ `
  query GetDeveloperDashboard {
    developerDashboard {
      ...DeveloperDashboardSummary
    }
  }
  ${developerDashboardFragment}
`;

// Example 4: A complex document component with nested fragments
export interface DocumentManagerProps {
  documents: Array<{
    id: string;
    name: string;
    category: string;
    status: string;
    url: string;
    created: string;
    fileType: string;
    uploadedBy: {
      id: string;
      fullName: string;
    };
    comments?: Array<{
      id: string;
      text: string;
      createdAt: string;
      author: {
        id: string;
        fullName: string;
      };
    }>
  );
  }>
  );
}

// First, define a fragment for document comments
export const documentCommentFragment = /* GraphQL */ `
  fragment DocumentComment on DocumentComment {
    id
    text
    createdAt
    author {
      id
      fullName
    }
  }
`;

// Then, combine with the main document fragment
const documentManagerQuery = /* GraphQL */ `
  query GetDocumentsWithComments($entityType: String!, $entityId: ID!) {
    documentsByEntity(entityType: $entityType, entityId: $entityId) {
      ...DocumentDetails
      comments {
        ...DocumentComment
      }
    }
  }
  ${documentFragment}
  ${documentCommentFragment}
`;

// Export query examples for reference
export const fragmentExamples = {
  developmentCardQuery,
  propertyDetailsQuery,
  developerDashboardQuery,
  documentManagerQuery
};