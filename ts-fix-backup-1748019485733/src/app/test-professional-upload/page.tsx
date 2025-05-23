'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export default function TestProfessionalUploadPage() {
  const [filessetFiles] = useState({
    license: null as File | null,
    insurance: null as File | null
  });

  const fileInputRefs = {
    license: useRef<HTMLInputElement>(null),
    insurance: useRef<HTMLInputElement>(null)
  };

  const handleFileUpload = (field: 'license' | 'insurance', file: File | null) => {
    if (file) {

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, JPG, or PNG file');
        return;
      }

      // Validate file size (10MB max)
      if (file.size> 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setFiles(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleFileRemove = (field: 'license' | 'insurance') => {

    setFiles(prev => ({
      ...prev,
      [field]: null
    }));

    if (fileInputRefs[field]?.current) {
      fileInputRefs[field].current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Professional Document Upload</h1>

        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          {/* License Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional License
            </label>
            <div className="relative">
              {files.license ? (
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{files.license.name}</p>
                        <p className="text-sm text-gray-600">
                          {(files.license.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileRemove('license')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRefs.license.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 text-center cursor-pointer transition-all"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload license
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG (max 10MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRefs.license}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileUpload('license', e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Insurance Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Certificate
            </label>
            <div className="relative">
              {files.insurance ? (
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{files.insurance.name}</p>
                        <p className="text-sm text-gray-600">
                          {(files.insurance.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileRemove('insurance')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRefs.insurance.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 text-center cursor-pointer transition-all"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload insurance
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG (max 10MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRefs.insurance}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileUpload('insurance', e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="text-xs">
              {JSON.stringify({
                license: files.license ? {
                  name: files.license.name,
                  size: files.license.size,
                  type: files.license.type
                } : null,
                insurance: files.insurance ? {
                  name: files.insurance.name,
                  size: files.insurance.size,
                  type: files.insurance.type
                } : null
              }, null2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}