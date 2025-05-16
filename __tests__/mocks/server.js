// __tests__/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Set up a Mock Service Worker server
export const server = setupServer(...handlers);