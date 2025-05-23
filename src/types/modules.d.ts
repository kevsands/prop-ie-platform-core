declare module 'mongodb' {
    export class MongoClient {
      static connect(uri: string): Promise<MongoClient>\n  );
      db(name?: string): Db;
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
  
  declare module '@react-three/fiber' {
    export function Canvas(props: any): JSX.Element;
    // Add more as needed
  }
  
  declare module '@react-three/drei' {
    export function OrbitControls(props: any): JSX.Element;
    export function useGLTF(url: string): any;
    // Add more as needed
  }
  
  declare module 'three' {
    export class Vector3 {
      constructor(x?: number, y?: number, z?: number);
    }
    // Add more as needed
  }
  
  declare module 'express' {
    export interface Request {
      service?: any;
    }
    // Add more types as needed
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
    // Add type declarations as needed
  }
  
  declare module 'lodash' {
    // Add the functions you use
    export function debounce(func: Function, wait?: number, options?: any): Function;
  }