'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FiUploadCloud, 
  FiDownload, 
  FiTrash2, 
  FiEye, 
  FiFileText,
  FiFile,
  FiImage,
  FiFilePlus
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  category: 'identity' | 'financial' | 'property' | 'legal' | 'other';
  url?: string;
}

interface DocumentManagerProps {
  category?: string;
  allowUpload?: boolean;
  onDocumentSelect?: (document: Document) => void;
}

export default function DocumentManager({ 
  category, 
  allowUpload = true, 
  onDocumentSelect 
}: DocumentManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadDocuments();
  }, [category]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDocs: Document[] = [
        {
          id: '1',
          name: 'Passport.pdf',
          type: 'application/pdf',
          size: 1024000,
          uploadedBy: user?.email || 'user@example.com',
          uploadedAt: new Date(),
          status: 'approved',
          category: 'identity'
        },
        {
          id: '2', 
          name: 'Bank_Statement_Jan2024.pdf',
          type: 'application/pdf',
          size: 2048000,
          uploadedBy: user?.email || 'user@example.com',
          uploadedAt: new Date(Date.now() - 86400000),
          status: 'pending',
          category: 'financial'
        }
      ];
      
      setDocuments(mockDocs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];

    try {
      // Simulate file upload - replace with actual upload logic
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedBy: user?.email || 'user@example.com',
        uploadedAt: new Date(),
        status: 'pending',
        category: category as any || 'other'
      };

      setDocuments([...documents, newDoc]);
      
      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDocuments(documents.filter(doc => doc.id !== docId));
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      // Simulate download - replace with actual download logic
      const link = document.createElement('a');
      link.href = doc.url || '#';
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive'
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FiImage className="w-5 h-5" />;
    if (type.includes('pdf')) return <FiFileText className="w-5 h-5" />;
    return <FiFile className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocs = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.category === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Document Management</h2>
          {allowUpload && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              <FiUploadCloud className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('identity')}
            className={`px-3 py-1 rounded ${filter === 'identity' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            Identity
          </button>
          <button
            onClick={() => setFilter('financial')}
            className={`px-3 py-1 rounded ${filter === 'financial' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            Financial
          </button>
          <button
            onClick={() => setFilter('property')}
            className={`px-3 py-1 rounded ${filter === 'property' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            Property
          </button>
          <button
            onClick={() => setFilter('legal')}
            className={`px-3 py-1 rounded ${filter === 'legal' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            Legal
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      {filteredDocs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiFilePlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No documents found</p>
          {allowUpload && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 text-teal-600 hover:underline"
            >
              Upload your first document
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-500">
                  {getFileIcon(doc.type)}
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                  doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {doc.status}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      if (onDocumentSelect) onDocumentSelect(doc);
                    }}
                    className="p-2 text-gray-600 hover:text-teal-600"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}