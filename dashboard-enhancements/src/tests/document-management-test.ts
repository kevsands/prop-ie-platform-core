/**
 * Document Management System Test Script
 * 
 * This script tests the document management system implementation, including:
 * - Document upload and metadata handling
 * - Document versioning
 * - Document permissions
 * - Document workflows
 */

import { documentService } from '../services/documentService';
import {
  Document as DocumentType,
  DocumentStatus,
  DocumentType as DocType,
  DocumentCategory
} from '../types/document';

// Mock file for testing
const createMockFile = (name: string, type: string, size: number): File => {
  const file = new File(['test file content'], name, { type });
  Object.defineProperty(file, 'size', {
    value: size
  });
  return file;
};

// Test document upload
async function testDocumentUpload() {
  console.log('🧪 Testing document upload...');

  const mockFile = createMockFile('test-document.pdf', 'application/pdf', 1024 * 1024); // 1MB

  const result = await documentService.uploadDocument(mockFile, {
    name: 'Test Document',
    description: 'This is a test document',
    type: DocType.LEGAL,
    category: DocumentCategory.DEVELOPMENT,
    tags: ['test', 'document', 'legal'],
    status: DocumentStatus.DRAFT,
    permissions: {
      isPublic: false,
      sensitivity: 'standard',
      canView: ['user1', 'user2'],
      canEdit: ['user1'],
      canDelete: [],
      canShare: ['user1']
    }
  });

  console.log('📤 Upload result:', result.success ? '✅ Success' : '❌ Failed');
  if (result.success && result.document) {
    console.log('📄 Document ID:', result.document.id);
    return result.document;
  } else {
    console.error('❌ Upload error:', result.message);
    return null;
  }
}

// Test document retrieval
async function testDocumentRetrieval(id: string) {
  console.log('🧪 Testing document retrieval...');

  const document = await documentService.getDocumentById(id);

  console.log('📥 Retrieval result:', document ? '✅ Success' : '❌ Failed');
  if (document) {
    console.log('📄 Document details:', {
      name: document.name,
      type: document.type,
      category: document.category,
      status: document.status,
      version: document.version
    });
  }

  return document;
}

// Test document versioning
async function testDocumentVersioning(document: DocumentType) {
  console.log('🧪 Testing document versioning...');

  // Upload new version
  const mockFile = createMockFile('test-document-v2.pdf', 'application/pdf', 1.5 * 1024 * 1024); // 1.5MB

  const versionResult = await documentService.uploadDocument(mockFile, {
    isNewVersion: true,
    id: document.id,
    versionNotes: 'Updated with new information',
    previousVersion: document.version
  });

  console.log('📤 Version upload result:', versionResult.success ? '✅ Success' : '❌ Failed');

  if (versionResult.success && versionResult.document) {
    // Get versions
    const versionsResult = await documentService.getDocumentVersions(document.id);

    console.log('📚 Versions retrieval:', versionsResult.success ? '✅ Success' : '❌ Failed');
    if (versionsResult.success && versionsResult.versions) {
      console.log(`📚 Found ${versionsResult.versions.length} versions`);
      versionsResult.versions.forEach(version => {
        console.log(`   - v${version.versionNumber}: ${new Date(version.created).toLocaleString()}`);
      });
    }

    return versionResult.document;
  }

  return null;
}

// Test document permissions
async function testDocumentPermissions(document: DocumentType) {
  console.log('🧪 Testing document permissions...');

  // Update permissions
  const permissionsResult = await documentService.updatePermissions(document.id, {
    isPublic: true,
    sensitivity: 'low',
    canView: ['user1', 'user2', 'user3'],
    canEdit: ['user1'],
    canDelete: ['user1'],
    canShare: ['user1', 'user2']
  });

  console.log('🔒 Permissions update:', permissionsResult.success ? '✅ Success' : '❌ Failed');

  // Get document to verify permissions
  const updatedDocument = await documentService.getDocumentById(document.id);

  if (updatedDocument && updatedDocument.permissions) {
    console.log('🔒 Updated permissions:', {
      isPublic: updatedDocument.permissions.isPublic,
      sensitivity: updatedDocument.permissions.sensitivity,
      viewersCount: updatedDocument.permissions.canView?.length || 0,
      editorsCount: updatedDocument.permissions.canEdit?.length || 0
    });
  }

  return updatedDocument;
}

// Test document workflow
async function testDocumentWorkflow(document: DocumentType) {
  console.log('🧪 Testing document workflow...');

  // Start workflow (assuming there's a default workflow with ID 'default')
  const workflowResult = await documentService.startWorkflow(document.id, 'default');

  console.log('🔄 Workflow start:', workflowResult.success ? '✅ Success' : '❌ Failed');

  if (workflowResult.success && workflowResult.workflow) {
    console.log('🔄 Workflow started:', {
      workflowId: workflowResult.workflow.id,
      status: workflowResult.workflow.status,
      currentStage: workflowResult.workflow.currentStage?.name
    });

    // Approve current stage
    const approveResult = await documentService.approveWorkflowStage(
      document.id,
      workflowResult.workflow.id,
      'Approved during testing'
    );

    console.log('✅ Stage approval:', approveResult.success ? '✅ Success' : '❌ Failed');

    // Get workflow history
    const historyResult = await documentService.getWorkflowHistory(document.id);

    console.log('📜 Workflow history:', historyResult.success ? '✅ Success' : '❌ Failed');
    if (historyResult.success && historyResult.history) {
      console.log(`📜 Found ${historyResult.history.length} workflow entries`);
    }
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting document management system tests...');

  try {
    // Test document upload
    const document = await testDocumentUpload();
    if (!document) {
      console.error('❌ Document upload failed, cannot continue tests');
      return;
    }

    // Test document retrieval
    const retrievedDocument = await testDocumentRetrieval(document.id);
    if (!retrievedDocument) {
      console.error('❌ Document retrieval failed, cannot continue tests');
      return;
    }

    // Test document versioning
    const versionedDocument = await testDocumentVersioning(retrievedDocument);
    if (!versionedDocument) {
      console.error('❌ Document versioning failed, cannot continue tests');
      return;
    }

    // Test document permissions
    const permissionedDocument = await testDocumentPermissions(versionedDocument);
    if (!permissionedDocument) {
      console.error('❌ Document permissions failed, cannot continue tests');
      return;
    }

    // Test document workflow
    await testDocumentWorkflow(permissionedDocument);

    console.log('✅ All document management system tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test script
if (typeof window !== 'undefined') {
  // Only run in browser environment
  // You can call runTests() from the browser console to run the tests
  (window as any).testDocumentManagement = runTests;
  console.log('📋 Document management test script loaded.');
  console.log('📋 Run tests by calling: testDocumentManagement()');
} else {
  // In Node.js environment
  runTests().catch(console.error);
}

export { runTests };