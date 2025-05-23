'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export default function TestUploadPage() {
  const [filesetFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (uploadedFile: File | null) => {
    if (uploadedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(uploadedFile.type)) {
        alert('Please upload a PDF, JPG, or PNG file');
        return;
      }

      // Validate file size (10MB max)
      if (uploadedFile.size> 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setFile(uploadedFile);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Document Upload</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Test Document
          </label>

          <div className="relative">
            {file ? (
              <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-gray-600">
                        Type: {file.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleFileRemove}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 text-center cursor-pointer transition-all"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload a document
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG (max 10MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}