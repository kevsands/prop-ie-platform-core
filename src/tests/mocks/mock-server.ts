/**
 * Mock Server for Enterprise Testing
 * Provides HTTP server for mocking external services
 */

import express, { Request, Response, Application } from 'express';
import { Server } from 'http';

export class MockServer {
  private app: Application;
  private server: Server | null = null;
  private port: number = 4000;
  
  constructor(port: number = 4000) {
    this.port = port;
    this.app = express();
    
    // Middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS for testing
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      
      next();
    });
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'PropIE Mock Services' });
    });
  }
  
  public addRoute(method: string, path: string, handler: (req: Request, res: Response) => void): void {
    switch (method.toUpperCase()) {
      case 'GET':
        this.app.get(path, handler);
        break;
      case 'POST':
        this.app.post(path, handler);
        break;
      case 'PUT':
        this.app.put(path, handler);
        break;
      case 'DELETE':
        this.app.delete(path, handler);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
  
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, () => {
          console.log(`Mock server running on port ${this.port}`);
          resolve();
        });
        
        this.server.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('Mock server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  
  public isRunning(): boolean {
    return this.server !== null;
  }
}