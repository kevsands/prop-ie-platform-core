import { UserRole, UserStatus } from '@/types/core/user';
import { DocumentItem, DocumentCategoryItem, ProjectItem } from '@/hooks/useGraphQLQueries';

/**
 * GraphQL operation names - must match the operation names in the code
 */
export const GraphQLOperations = {
  // Queries
  GetDocuments: 'GetDocuments',
  GetDocumentCategories: 'GetDocumentCategories',
  GetDocumentById: 'GetDocumentById',
  GetProjects: 'GetProjects',
  GetDeveloperDashboard: 'GetDeveloperDashboard',
  GetUser: 'GetUser',
  GetUsers: 'GetUsers',
  
  // Mutations
  CreateDocument: 'CreateDocument',
  UpdateDocument: 'UpdateDocument',
  DeleteDocument: 'DeleteDocument',
  CreateUser: 'CreateUser',
  UpdateUser: 'UpdateUser'};

/**
 * Mock user data
 */
export const mockUsers = [
  {
    id: 'user-1',
    email: 'developer@example.com',
    firstName: 'Developer',
    lastName: 'User',
    fullName: 'Developer User',
    roles: [UserRole.DEVELOPER],
    status: UserStatus.ACTIVE},
  {
    id: 'user-2',
    email: 'buyer@example.com',
    firstName: 'Buyer',
    lastName: 'User',
    fullName: 'Buyer User',
    roles: [UserRole.BUYER],
    status: UserStatus.ACTIVE},
  {
    id: 'user-3',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    roles: [UserRole.ADMIN],
    status: UserStatus.ACTIVE}];

/**
 * Mock document items
 */
export const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Project Plan',
    fileType: 'application/pdf',
    fileSize: 1024 * 1024,
    downloadUrl: 'https://example.com/documents/doc-1.pdf',
    uploadedBy: {
      id: 'user-1',
      name: 'Developer User',
      email: 'developer@example.com'},
    metadata: {
      category: 'planning',
      tags: ['project', 'plan'],
      description: 'Project plan document',
      version: '1.0'},
    status: 'active',
    uploadedAt: '2023-01-15T12:00:00Z'},
  {
    id: 'doc-2',
    name: 'Financial Report',
    fileType: 'application/excel',
    fileSize: 512 * 1024,
    downloadUrl: 'https://example.com/documents/doc-2.xlsx',
    uploadedBy: {
      id: 'user-3',
      name: 'Admin User',
      email: 'admin@example.com'},
    metadata: {
      category: 'financial',
      tags: ['finance', 'report'],
      description: 'Financial report for Q1',
      version: '1.0'},
    status: 'active',
    uploadedAt: '2023-02-20T15:30:00Z'},
  {
    id: 'doc-3',
    name: 'Contract Template',
    fileType: 'application/docx',
    fileSize: 256 * 1024,
    downloadUrl: 'https://example.com/documents/doc-3.docx',
    uploadedBy: {
      id: 'user-3',
      name: 'Admin User',
      email: 'admin@example.com'},
    metadata: {
      category: 'legal',
      tags: ['contract', 'template'],
      description: 'Standard contract template',
      version: '2.1'},
    status: 'active',
    uploadedAt: '2023-03-10T09:45:00Z'}];

/**
 * Mock document categories
 */
export const mockDocumentCategories: DocumentCategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Planning',
    description: 'Planning documents for developments',
    required: true,
    documentCount: 5,
    completionStatus: 'complete'},
  {
    id: 'cat-2',
    name: 'Financial',
    description: 'Financial reports and documents',
    required: true,
    documentCount: 3,
    completionStatus: 'partial'},
  {
    id: 'cat-3',
    name: 'Legal',
    description: 'Legal documents and contracts',
    required: true,
    documentCount: 2,
    completionStatus: 'partial'},
  {
    id: 'cat-4',
    name: 'Marketing',
    description: 'Marketing materials',
    required: false,
    documentCount: 1,
    completionStatus: 'incomplete'}];

/**
 * Mock projects
 */
export const mockProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Riverside Manor',
    status: 'active'},
  {
    id: 'proj-2',
    name: 'Maple Avenue',
    status: 'planning'},
  {
    id: 'proj-3',
    name: 'Oakwood Heights',
    status: 'completed'}];

/**
 * Mock developer dashboard data
 */
export const mockDeveloperDashboard = {
  activeProjects: 2,
  propertiesAvailable: 15,
  totalSales: 8,
  projects: [
    {
      id: 'proj-1',
      name: 'Riverside Manor',
      status: 'active',
      completionPercentage: 75,
      location: 'Riverside',
      propertyCount: 10,
      lastUpdated: '2023-05-15T14:30:00Z'},
    {
      id: 'proj-2',
      name: 'Maple Avenue',
      status: 'planning',
      completionPercentage: 25,
      location: 'Maplewood',
      propertyCount: 5,
      lastUpdated: '2023-04-20T10:15:00Z'},
    {
      id: 'proj-3',
      name: 'Oakwood Heights',
      status: 'completed',
      completionPercentage: 100,
      location: 'Oakville',
      propertyCount: 8,
      lastUpdated: '2022-12-10T16:45:00Z'}],
  salesTrend: {
    period: 'month',
    percentage: 12,
    direction: 'up'};

/**
 * GraphQL Query Response Mocks
 */
export const GraphQLQueryResponses = {
  // GetDocuments response
  [GraphQLOperations.GetDocuments]: {
    documents: {
      items: mockDocuments,
      totalCount: mockDocuments.length},
  
  // GetDocumentCategories response
  [GraphQLOperations.GetDocumentCategories]: {
    documentCategories: mockDocumentCategories},
  
  // GetDocumentById response
  [GraphQLOperations.GetDocumentById]: (documentId: string) => ({
    document: mockDocuments.find(doc => doc.id === documentId) || mockDocuments[0]}),
  
  // GetProjects response
  [GraphQLOperations.GetProjects]: {
    projects: {
      items: mockProjects},
  
  // GetDeveloperDashboard response
  [GraphQLOperations.GetDeveloperDashboard]: {
    developerDashboard: mockDeveloperDashboard},
  
  // GetUser response
  [GraphQLOperations.GetUser]: (userId: string) => ({
    user: mockUsers.find(user => user.id === userId) || mockUsers[0]}),
  
  // GetUsers response
  [GraphQLOperations.GetUsers]: {
    users: {
      users: mockUsers,
      totalCount: mockUsers.length,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null}};

/**
 * GraphQL Mutation Response Mocks
 */
export const GraphQLMutationResponses = {
  // CreateDocument response
  [GraphQLOperations.CreateDocument]: (variables: any) => ({
    createDocument: {
      id: 'new-doc-' + Date.now(),
      name: variables.input.name,
      fileType: variables.input.fileType,
      fileSize: variables.input.fileSize,
      downloadUrl: `https://example.com/documents/new-doc-${Date.now()}.${variables.input.fileType.split('/')[1]}`,
      uploadedBy: {
        id: 'user-1',
        name: 'Developer User',
        email: 'developer@example.com'},
      metadata: {
        category: variables.input.category,
        tags: variables.input.tags || [],
        description: variables.input.description,
        version: '1.0'},
      status: 'active',
      uploadedAt: new Date().toISOString()}),
  
  // UpdateDocument response
  [GraphQLOperations.UpdateDocument]: (variables: any) => ({
    updateDocument: {
      id: variables.input.id,
      name: variables.input.name || 'Updated Document',
      fileType: 'application/pdf',
      fileSize: 1024 * 1024,
      downloadUrl: `https://example.com/documents/${variables.input.id}.pdf`,
      uploadedBy: {
        id: 'user-1',
        name: 'Developer User',
        email: 'developer@example.com'},
      metadata: {
        category: variables.input.category || 'other',
        tags: variables.input.tags || [],
        description: variables.input.description || 'Updated description',
        version: '1.1'},
      status: variables.input.status || 'active',
      uploadedAt: '2023-01-15T12:00:00Z',
      updatedAt: new Date().toISOString()}),
  
  // DeleteDocument response
  [GraphQLOperations.DeleteDocument]: (variables: any) => ({
    deleteDocument: {
      id: variables.id,
      success: true}),
  
  // CreateUser response
  [GraphQLOperations.CreateUser]: (variables: any) => ({
    createUser: {
      id: 'new-user-' + Date.now(),
      email: variables.email,
      firstName: variables.firstName,
      lastName: variables.lastName,
      fullName: `${variables.firstName} ${variables.lastName}`,
      roles: variables.roles || [UserRole.BUYER],
      status: UserStatus.PENDING}),
  
  // UpdateUser response
  [GraphQLOperations.UpdateUser]: (variables: any) => ({
    updateUser: {
      id: variables.id,
      email: variables.email || 'user@example.com',
      firstName: variables.firstName || 'Updated',
      lastName: variables.lastName || 'User',
      fullName: `${variables.firstName || 'Updated'} ${variables.lastName || 'User'}`,
      roles: variables.roles || [UserRole.BUYER],
      status: variables.status || UserStatus.ACTIVE})};