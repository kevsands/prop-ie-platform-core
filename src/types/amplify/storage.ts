/**
 * AWS Amplify Storage Type Definitions
 * 
 * This file defines types related to AWS Amplify Storage (S3).
 */

/**
 * Storage access level
 */
export type StorageAccessLevel = 'public' | 'protected' | 'private';

/**
 * Storage options for file operations
 */
export interface StorageOptions {
  /** Path prefix within the storage bucket */
  path?: string;
  /** Content type of the file */
  contentType?: string;
  /** Additional metadata for the file */
  metadata?: Record<string, string>\n  );
  /** Access level for the file */
  level?: StorageAccessLevel;
  /** Progress callback for upload/download operations */
  onProgress?: (progress: { loaded: number; total: number }) => void;
  /** Expiration time in seconds for signed URLs */
  expires?: number;
  /** Whether to check if the object exists before performing operations */
  validateObjectExistence?: boolean;
  /** Target browser cache control headers */
  cacheControl?: string;
}

/**
 * Storage upload options
 */
export interface UploadOptions extends StorageOptions {
  /** Whether to use multi-part upload for large files */
  useAccelerateEndpoint?: boolean;
  /** Part size for multi-part uploads in bytes */
  partSize?: number;
  /** Quality level for image optimization (0-100) */
  quality?: number;
}

/**
 * Storage download options
 */
export interface DownloadOptions extends StorageOptions {
  /** Download as blob instead of array buffer */
  download?: boolean;
  /** Track download progress */
  progressCallback?: (progress: { loaded: number; total: number }) => void;
}

/**
 * Storage list options
 */
export interface ListOptions {
  /** Path prefix to list */
  path?: string;
  /** Access level for listing */
  level?: StorageAccessLevel;
  /** Maximum number of keys to return */
  maxKeys?: number;
  /** Pagination token for retrieving the next page */
  nextToken?: string;
  /** Whether to include object metadata in the results */
  includeMetadata?: boolean;
}

/**
 * Storage list result
 */
export interface ListResult {
  /** List of file keys */
  items: StorageItem[];
  /** Pagination token for retrieving the next page */
  nextToken?: string | null;
}

/**
 * Storage item metadata
 */
export interface StorageItem {
  /** The object key (filename) */
  key: string;
  /** When the object was last modified */
  lastModified?: Date;
  /** Size of the object in bytes */
  size?: number;
  /** ETag of the object */
  eTag?: string;
  /** Content type of the object */
  contentType?: string;
  /** Additional metadata for the object */
  metadata?: Record<string, string>\n  );
}

/**
 * Storage upload result
 */
export interface UploadResult {
  /** The object key */
  key: string;
}

/**
 * Storage download result
 */
export interface DownloadResult {
  /** The downloaded data as ArrayBuffer or Blob */
  data: ArrayBuffer | Blob;
  /** Content type of the downloaded object */
  contentType?: string;
  /** Metadata of the downloaded object */
  metadata?: Record<string, string>\n  );
}

/**
 * Storage URL result
 */
export interface UrlResult {
  /** The generated URL */
  url: URL;
  /** When the URL expires */
  expiration?: Date;
}

/**
 * Storage copy options
 */
export interface CopyOptions extends StorageOptions {
  /** Source key to copy from */
  sourceKey: string;
  /** Source access level */
  sourceLevel?: StorageAccessLevel;
}

/**
 * Storage copy result
 */
export interface CopyResult {
  /** The destination key */
  key: string;
}

/**
 * Storage remove options
 */
export interface RemoveOptions {
  /** Access level for the removal operation */
  level?: StorageAccessLevel;
}

/**
 * Storage remove result
 */
export interface RemoveResult {
  /** Whether the removal was successful */
  success: boolean;
}