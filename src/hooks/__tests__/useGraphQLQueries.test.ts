import { waitFor } from '@testing-library/react';
import { useDeveloperDashboard, useDocuments, useDocument } from '../useGraphQLQueries';
import { renderHookWithProviders } from '../../tests/utils/hook-test-utils';
import { createGraphQLMock } from '../../tests/utils/graphql-test-utils';
import { mockAmplifyGraphQLSuccess } from '../../tests/utils/graphql-test-utils';
import { server } from '../../tests/utils/hook-test-utils';
import { createMockDocument, createMockDeveloperDashboard } from '../../tests/utils/test-helpers';

// Set up MSW handlers for GraphQL operations
const graphqlMock = createGraphQLMock();

// Mock response data
const mockDashboardData = {
  developerDashboard: createMockDeveloperDashboard()};

const mockDocumentsData = {
  documents: {
    items: [
      createMockDocument({ id: 'doc1', name: 'Document 1' }),
      createMockDocument({ id: 'doc2', name: 'Document 2' })],
    totalCount: 2};

const mockDocumentData = {
  document: createMockDocument({ id: 'doc1', name: 'Document 1' })};

describe('GraphQL Query Hooks', () => {
  // Setup mock for the Amplify GraphQL client
  beforeAll(() => {
    jest.mock('aws-amplify/api', () => ({
      generateClient: jest.fn(() => ({
        graphql: jest.fn()}))}));
  });

  // Clean up mocks after each test
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });

  describe('useDeveloperDashboard', () => {
    it('should fetch developer dashboard data successfully', async () => {
      // Mock the GraphQL response
      mockAmplifyGraphQLSuccess(mockDashboardData);

      // Render the hook with our custom provider wrapper
      const { result } = renderHookWithProviders(() => useDeveloperDashboard());

      // Initially, it should be loading
      expect(result.current.loading).toBe(true);

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify the data is correct
      expect(result.current.data).toEqual(mockDashboardData.developerDashboard);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle errors when fetching developer dashboard data', async () => {
      // Mock a GraphQL error response using MSW
      graphqlMock
        .mockQueryError('GetDeveloperDashboard', 'Failed to fetch developer dashboard')
        .applyMocks();

      // Render the hook with our custom provider wrapper
      const { result } = renderHookWithProviders(() => useDeveloperDashboard());

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify the result contains placeholder data and error is defined
      expect(result.current.data).toEqual({
        activeProjects: 0,
        propertiesAvailable: 0,
        totalSales: 0,
        projects: []});
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useDocuments', () => {
    it('should fetch documents with specified filters', async () => {
      // Mock the GraphQL response
      mockAmplifyGraphQLSuccess(mockDocumentsData);

      // Create test filters
      const filters = {
        category: 'test-category',
        status: 'active'};

      // Render the hook with our custom provider wrapper and filters
      const { result } = renderHookWithProviders(() => 
        useDocuments({ projectId: 'test-project', filters })
      );

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify the data is correct
      expect(result.current.data).toEqual(mockDocumentsData.documents);
    });
  });

  describe('useDocument', () => {
    it('should fetch a single document by ID', async () => {
      // Mock the GraphQL response
      mockAmplifyGraphQLSuccess(mockDocumentData);

      // Render the hook with our custom provider wrapper
      const { result } = renderHookWithProviders(() => 
        useDocument('doc1')
      );

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify the data is correct
      expect(result.current.data).toEqual(mockDocumentData.document);
    });

    it('should not fetch when documentId is not provided', async () => {
      // Spy on the GraphQL function
      const graphqlSpy = jest.spyOn(require('aws-amplify/api').generateClient(), 'graphql');

      // Render the hook with undefined documentId
      renderHookWithProviders(() => useDocument(undefined));

      // GraphQL should not be called
      expect(graphqlSpy).not.toHaveBeenCalled();
    });
  });
});