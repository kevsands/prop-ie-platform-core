// Mock SLP client for development
export const slpClient = {
  project: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
  },
  task: {
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
  },
  document: {
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
  }
}

export default slpClient;