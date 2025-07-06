import { mockDeep, mockReset } from 'jest-mock-extended';
// Create a deep mock of the Prisma client
export const prismaMock = mockDeep();
// Mock transaction implementation that passes the tx context to the callback
prismaMock.$transaction.mockImplementation(async (callback) => {
    // Create transaction context that mimics the structure of prismaMock
    const txContext = mockDeep();
    // Execute callback with transaction context
    return callback(txContext);
});
// Reset all mocks between tests
beforeEach(() => {
    mockReset(prismaMock);
});
// Mock the PrismaClient in the @prisma/client module
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => prismaMock),
}));
/**
 * Create a mocked repository context with transaction support
 * @returns Mocked Prisma client with transaction support
 */
export function createMockRepositoryContext() {
    return {
        prisma: prismaMock,
        transaction: async (callback) => {
            return prismaMock.$transaction(callback);
        }
    };
}
/**
 * Setup transaction mock for testing repository transaction operations
 * This configures the transaction to work with repository pattern testing
 * @param setupCallback Optional callback to configure mock responses for transaction context
 */
export function setupTransactionMock(setupCallback) {
    // Replace the transaction implementation
    prismaMock.$transaction.mockImplementation(async (callback) => {
        // Create a fresh transaction context for this test
        const txMock = mockDeep();
        // Allow test to configure mock responses for transaction
        if (setupCallback) {
            setupCallback(txMock);
        }
        // Execute the callback with our configured transaction context
        return callback(txMock);
    });
}
export default prismaMock;
