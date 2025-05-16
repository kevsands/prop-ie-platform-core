/**
 * Type declarations for AWS SDK types used by Amplify
 */

// Simplified TransferProgressEvent for AWS SDK
declare module '@aws-sdk/lib-storage' {
  export interface TransferProgressEvent {
    loaded?: number;
    total?: number;
    part?: number;
    key?: string;
  }
}

// Define StorageAccessLevel if not exported from Amplify
declare module 'aws-amplify/storage' {
  export type StorageAccessLevel = 'private' | 'protected' | 'guest';
}
EOL < /dev/null