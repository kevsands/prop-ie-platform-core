
// This is a simplified version of collaboration-engine.ts
// See collaboration-engine.ts.reference.txt for original code

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface Room {
  id: string;
  type: 'document' | 'property' | 'transaction' | 'meeting';
  participants: Map<string, User>
  );
  state: Y.Doc;
  metadata: any;
}

interface Message {
  id: string;
  roomId: string;
  userId: string;
  type: 'cursor' | 'selection' | 'presence' | 'change' | 'message' | 'notification';
  payload: any;
  timestamp: number;
}