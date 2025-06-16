/**
 * PrismaClient type definition
 * This is a stub type for the PrismaClient to avoid direct imports from @prisma/client
 * which causes TypeScript errors in the test environment
 */

export interface PrismaClient {
  $executeRaw: (query: any, ...values: any[]) => Promise<any>
  );
  $disconnect: () => Promise<void>
  );
  $transaction: <T>(fn: (tx: any) => Promise<T>) => Promise<T>
  );
  // Add models used in tests
  user: {
    create: (args: any) => Promise<any>
  );
    findUnique: (args: any) => Promise<any>
  );
    findMany: (args: any) => Promise<any[]>
  );
    update: (args: any) => Promise<any>
  );
    delete: (args: any) => Promise<any>
  );
    upsert: (args: any) => Promise<any>
  );
    count: (args: any) => Promise<number>
  );
  };
  
  development: {
    create: (args: any) => Promise<any>
  );
    findUnique: (args: any) => Promise<any>
  );
    findMany: (args: any) => Promise<any[]>
  );
    update: (args: any) => Promise<any>
  );
    delete: (args: any) => Promise<any>
  );
  };
  
  document: {
    create: (args: any) => Promise<any>
  );
    findUnique: (args: any) => Promise<any>
  );
    findMany: (args: any) => Promise<any[]>
  );
    update: (args: any) => Promise<any>
  );
    delete: (args: any) => Promise<any>
  );
  };
  
  documentVersion: {
    create: (args: any) => Promise<any>
  );
    findMany: (args: any) => Promise<any[]>
  );
  };
}