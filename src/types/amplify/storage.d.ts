/**
 * Custom types for AWS Amplify Storage
 * Provides compatibility between our code and Amplify v6
 */

import { StorageAccessLevel } from 'aws-amplify/storage';
import { TransferProgressEvent } from '@aws-sdk/lib-storage';

// Custom level type that supports "public" 
export type ExtendedAccessLevel = StorageAccessLevel | 'public';

// Progress callback with simplified structure
export interface ProgressCallback {
  (progress: { loaded: number; total: number }): void;
}

// TransferProgress event adapter
export function adaptProgressCallback(callback: ProgressCallback): (event: TransferProgressEvent) => void {
  return (event: TransferProgressEvent) => {
    // Extract loaded and total from whatever is available in the event
    const loaded = (event as any).loaded || 0;
    const total = (event as any).total || 0;
    callback({ loaded, total });
  };
}

// Helper to convert our extended level to Amplify's supported levels
export function normalizeAccessLevel(level: ExtendedAccessLevel): StorageAccessLevel {
  // If the level is 'public', convert it to 'guest' for Amplify v6
  if (level === 'public') {
    return 'guest';
  }
  return level as StorageAccessLevel;
}