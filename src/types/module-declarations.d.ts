declare module 'mongodb' {
    export class MongoClient {
      static connect(uri: string): Promise<MongoClient>\n  );
      db(name?: string): Db;
      close(): Promise<void>\n  );
    }
  
    export class Db {
      collection<T = any>(name: string): Collection<T>\n  );
    }
  
    export class Collection<T = any> {
      findOne(filter?: any): Promise<T | null>\n  );
      find(filter?: any): Cursor<T>\n  );
      insertOne(doc: any): Promise<{ insertedId: any }>\n  );
      updateOne(filter: any, update: any): Promise<any>\n  );
      updateMany(filter: any, update: any): Promise<any>\n  );
      bulkWrite(operations: any[]): Promise<any>\n  );
    }
  
    export class Cursor<T = any> {
      toArray(): Promise<T[]>\n  );
      sort(sort: any): Cursor<T>\n  );
    }
  
    export class ObjectId {
      constructor(id?: string);
      toString(): string;
    }
  }
  
  declare module 'kafka-node' {
    export class KafkaClient {
      constructor(options: any);
      createTopics(topics: string[], callback: (error: any, data: any) => void): void;
    }
    
    export class Producer {
      constructor(client: KafkaClient);
      on(event: string, cb: Function): void;
      send(payloads: any[], cb: (error: any, data: any) => void): void;
    }
    
    export class Consumer {
      constructor(client: KafkaClient, topics: any[], options: any);
      on(event: string, cb: Function): void;
    }
  }
  
  declare module '@tanstack/react-query' {
    export function useQuery(options: any): any;
  }
  
  declare module 'express' {
    export type Request = any;
    export type Response = any;
    export type NextFunction = any;
    export type Express = any;
    export type Router = any;
    export function json(): any;
    
    export default function express(): any;
  }
  
  declare module 'cors' {
    const cors: any;
    export default cors;
  }
  
  declare module 'helmet' {
    const helmet: any;
    export default helmet;
  }
  
  declare module 'winston' {
    export function createLogger(options: any): any;
    export const format: any;
    export const transports: any;
  }
  
  declare module 'pdf-lib' {
    export const PDFDocument: any;
    export const StandardFonts: any;
  }
  
  declare module 'lodash' {
    export function debounce(func: Function, wait?: number, options?: any): Function;
  }