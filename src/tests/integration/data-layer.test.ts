import { 
  setupIntegrationTestContext, 
  mockPrismaCall, 
  mockUserData, 
  mockDevelopmentData, 
  mockDocumentData
} from '../utils/data-layer-test-utils';
import { prismaMock } from '../mocks/prisma';
import { UserRole } from '@/types/core/user';

describe('Data Layer Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('User Repository', () => {
    it('should fetch a user by ID', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext();
      const userRepo = repositories.users;
      
      // Mock data to be returned by Prisma
      const mockUser = mockUserData();
      
      // Mock the Prisma call
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      
      // Call the repository method
      const result = await userRepo.findById(mockUser.id);
      
      // Verify the results
      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id });
    });
    
    it('should find users by role', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext();
      const userRepo = repositories.users;
      
      // Mock data to be returned by Prisma
      const mockUsers = [
        mockUserData({ roles: [UserRole.BUYER] }),
        mockUserData({ id: 'user-2', email: 'buyer2@example.com', roles: [UserRole.BUYER] })];
      
      // Mock the Prisma call
      prismaMock.user.findMany.mockResolvedValue(mockUsers);
      
      // Call the repository method
      const result = await userRepo.findByRole(UserRole.BUYER);
      
      // Verify the results
      expect(result).toEqual(mockUsers);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {
          roles: {
            has: UserRole.BUYER});
    });
    
    it('should create a new user', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext();
      const userRepo = repositories.users;
      
      // Setup user data
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        roles: [UserRole.BUYER]};
      
      // Mock created user data
      const mockUser = mockUserData({
        id: 'new-user', 
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roles});
      
      // Mock the Prisma call
      prismaMock.user.create.mockResolvedValue(mockUser);
      
      // Call the repository method
      const result = await userRepo.create(userData);
      
      // Verify the results
      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining(userData)});
    });
  });
  
  describe('Development Repository', () => {
    it('should fetch a development by ID', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext();
      const developmentRepo = repositories.developments;
      
      // Mock data to be returned by Prisma
      const mockDevelopment = mockDevelopmentData();
      
      // Mock the Prisma call
      prismaMock.development.findUnique.mockResolvedValue(mockDevelopment);
      
      // Call the repository method
      const result = await developmentRepo.findById(mockDevelopment.id);
      
      // Verify the results
      expect(result).toEqual(mockDevelopment);
      expect(prismaMock.development.findUnique).toHaveBeenCalledWith({
        where: { id: mockDevelopment.id });
    });
    
    it('should list all active developments', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext();
      const developmentRepo = repositories.developments;
      
      // Mock data to be returned by Prisma
      const mockDevelopments = [
        mockDevelopmentData(),
        mockDevelopmentData({ 
          id: 'dev-2', 
          name: 'Development 2'})];
      
      // Mock the Prisma call
      prismaMock.development.findMany.mockResolvedValue(mockDevelopments);
      
      // Call the repository method
      const result = await developmentRepo.findActive();
      
      // Verify the results
      expect(result).toEqual(mockDevelopments);
      expect(prismaMock.development.findMany).toHaveBeenCalledWith({
        where: {
          status: 'ACTIVE'});
    });
    
    it('should create a new development', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext('test-user');
      const developmentRepo = repositories.developments;
      
      // Setup development data
      const developmentData = {
        name: 'New Development',
        description: 'A new development for testing',
        location: 'Test Location'};
      
      // Mock created development data
      const mockDevelopment = mockDevelopmentData({
        id: 'new-dev',
        name: developmentData.name,
        description: developmentData.description,
        location: developmentData.location,
        createdBy: 'test-user'});
      
      // Mock the Prisma call
      prismaMock.development.create.mockResolvedValue(mockDevelopment);
      
      // Call the repository method
      const result = await developmentRepo.create(developmentData);
      
      // Verify the results
      expect(result).toEqual(mockDevelopment);
      expect(prismaMock.development.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...developmentData,
          createdBy: 'test-user'})});
    });
  });
  
  describe('Document Repository', () => {
    it('should fetch a document by ID', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext();
      const documentRepo = repositories.documents;
      
      // Mock data to be returned by Prisma
      const mockDocument = mockDocumentData();
      
      // Mock the Prisma call
      prismaMock.document.findUnique.mockResolvedValue(mockDocument);
      
      // Call the repository method
      const result = await documentRepo.findById(mockDocument.id);
      
      // Verify the results
      expect(result).toEqual(mockDocument);
      expect(prismaMock.document.findUnique).toHaveBeenCalledWith({
        where: { id: mockDocument.id });
    });
    
    it('should find documents by user ID', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext('test-user');
      const documentRepo = repositories.documents;
      
      // Mock data to be returned by Prisma
      const mockDocuments = [
        mockDocumentData({ uploadedBy: 'test-user' }),
        mockDocumentData({ 
          id: 'doc-2',
          name: 'Document 2',
          uploadedBy: 'test-user'})];
      
      // Mock the Prisma call
      prismaMock.document.findMany.mockResolvedValue(mockDocuments);
      
      // Call the repository method
      const result = await documentRepo.findByUserId('test-user');
      
      // Verify the results
      expect(result).toEqual(mockDocuments);
      expect(prismaMock.document.findMany).toHaveBeenCalledWith({
        where: {
          uploadedBy: 'test-user'});
    });
    
    it('should create a new document', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext('test-user');
      const documentRepo = repositories.documents;
      
      // Setup document data
      const documentData = {
        name: 'New Document',
        fileUrl: 'https://example.com/test-document.pdf',
        fileType: 'application/pdf',
        fileSize: 12345};
      
      // Mock created document data
      const mockDocument = mockDocumentData({
        id: 'new-doc',
        name: documentData.name,
        fileUrl: documentData.fileUrl,
        fileType: documentData.fileType,
        fileSize: documentData.fileSize,
        uploadedBy: 'test-user'});
      
      // Mock the Prisma call
      prismaMock.document.create.mockResolvedValue(mockDocument);
      
      // Call the repository method
      const result = await documentRepo.create(documentData);
      
      // Verify the results
      expect(result).toEqual(mockDocument);
      expect(prismaMock.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...documentData,
          uploadedBy: 'test-user'})});
    });
  });
  
  describe('Transaction Support', () => {
    it('should execute operations in a transaction', async () => {
      // Setup test context
      const { repositories } = setupIntegrationTestContext('test-user');
      const userRepo = repositories.users;
      const documentRepo = repositories.documents;
      
      // Mock transaction async function prismaMockcallback(prismaMock);
      });
      
      // Mock create operations
      prismaMock.user.create.mockResolvedValue(mockUserData());
      prismaMock.document.create.mockResolvedValue(mockDocumentData());
      
      // Create user and document in a transaction
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        roles: [UserRole.BUYER]};
      
      const documentData = {
        name: 'New Document',
        fileUrl: 'https://example.com/test-document.pdf',
        fileType: 'application/pdf',
        fileSize: 12345};
      
      // Execute transaction
      await prismaMock.$transaction(async (tx: any) => {
        await userRepo.create(userDatatx);
        await documentRepo.create(documentDatatx);
      });
      
      // Verify transaction was used
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(prismaMock.document.create).toHaveBeenCalled();
    });
  });
});