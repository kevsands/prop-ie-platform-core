/**
 * Utility Types
 * 
 * This file exports utility types used throughout the application.
 * These types provide generic type helpers that make working with
 * TypeScript more ergonomic.
 */

/**
 * Makes all properties in T optional and nullable
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };

/**
 * Makes specified properties in T required
 */
export type RequiredProps<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Makes specified properties in T optional
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

/**
 * Picks a subset of properties from T and makes them all optional
 */
export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>
  );
/**
 * Deep partial type - makes all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties in T readonly
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends object ? Immutable<T[P]> : T[P];
};

/**
 * Utility type for pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  nextCursor?: string;
}

/**
 * Type for handling async operation states
 */
export interface AsyncState<T, E = Error> {
  data: T | null;
  isLoading: boolean;
  error: E | null;
}

/**
 * Type for representing validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Type for form field errors
 */
export type FormErrors<T> = {
  [K in keyof T]?: string[];
};

/**
 * Type for API error response
 */
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  errorCode?: string;
}