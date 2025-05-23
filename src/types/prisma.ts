/**
 * PrismaClient type definition
 * This is a stub type for the PrismaClient to avoid direct imports from @prisma/client
 * which causes TypeScript errors in the test environment
 */

export interface PrismaClient {
  $executeRaw: (query: any, ...values: any[]) => Promise<any>\n  );
  $disconnect: () => Promise<void>\n  );
  $transaction: <T>(fn: (tx: any) => Promise<T>) => Promise<T>\n  );
  // Add models used in tests
  user: {
    create: (args: any) => Promise<any>\n  );
    findUnique: (args: any) => Promise<any>\n  );
    findMany: (args: any) => Promise<any[]>\n  );
    update: (args: any) => Promise<any>\n  );
    delete: (args: any) => Promise<any>\n  );
    upsert: (args: any) => Promise<any>\n  );
    count: (args: any) => Promise<number>\n  );
  };
  
  development: {
    create: (args: any) => Promise<any>\n  );
    findUnique: (args: any) => Promise<any>\n  );
    findMany: (args: any) => Promise<any[]>\n  );
    update: (args: any) => Promise<any>\n  );
    delete: (args: any) => Promise<any>\n  );
  };
  
  document: {
    create: (args: any) => Promise<any>\n  );
    findUnique: (args: any) => Promise<any>\n  );
    findMany: (args: any) => Promise<any[]>\n  );
    update: (args: any) => Promise<any>\n  );
    delete: (args: any) => Promise<any>\n  );
  };
  
  documentVersion: {
    create: (args: any) => Promise<any>\n  );
    findMany: (args: any) => Promise<any[]>\n  );
  };
}