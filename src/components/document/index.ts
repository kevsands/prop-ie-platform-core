// Export all document components from a single location
export { default as DocumentComplianceTracker } from './DocumentComplianceTracker';
export { default as DocumentCategoryProgress } from './DocumentCategoryProgress';
export { default as DocumentListItem } from './DocumentListItem';
export { default as DocumentFilterBar } from './DocumentFilterBar';
export { default as DocumentUploadDialog } from './DocumentUploadDialog';
export { default as DocumentTimeline } from './DocumentTimeline';
export { default as DocumentManager } from './DocumentManager';
export { default as DocumentUploader } from './DocumentUploader';

// Export existing components
export { DocumentList } from './DocumentList';
export { DocumentUpload } from './DocumentUpload';

// Export types from DocumentComplianceTracker
export type { 
  DocumentStatus,
  DocumentCategory,
  DocumentItem
} from './DocumentComplianceTracker';

// Export types from new components
export type { DocumentItemProps, DocumentListProps } from './DocumentList';
export type { DocumentUploadFormValues, DocumentUploadProps } from './DocumentUpload';