/**
 * Database Row Type Definitions
 * 
 * TypeScript interfaces for database query results to replace 'any' types
 * and provide better type safety for database operations
 */

/**
 * Raw development row from database query
 * Represents the result of joining Development and Unit tables
 */
export interface DevelopmentRow {
  id: string;
  name: string;
  description: string;
  location: string;
  totalUnits: number;
  availableUnits: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Raw unit/property row from database query
 * Represents the result of joining Unit and Development tables
 */
export interface UnitRow {
  id: string;
  name: string;
  type: string;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  developmentId: string;
  developmentName: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Query parameters for database operations
 * Strongly typed array for SQL query parameters
 */
export type QueryParams = (string | number | boolean | null)[];

/**
 * Database error interface
 */
export interface DatabaseError extends Error {
  code?: string;
  errno?: number;
}

/**
 * SQLite database callback signatures
 */
export type DatabaseAllCallback<T> = (err: DatabaseError | null, rows: T[]) => void;
export type DatabaseGetCallback<T> = (err: DatabaseError | null, row: T | undefined) => void;
export type DatabaseRunCallback = (err: DatabaseError | null) => void;

/**
 * Generic database query result
 */
export interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Database connection interface
 */
export interface DatabaseConnection {
  all<T>(sql: string, params: QueryParams, callback: DatabaseAllCallback<T>): void;
  get<T>(sql: string, params: QueryParams, callback: DatabaseGetCallback<T>): void;
  run(sql: string, params: QueryParams, callback?: DatabaseRunCallback): void;
  close(): void;
}