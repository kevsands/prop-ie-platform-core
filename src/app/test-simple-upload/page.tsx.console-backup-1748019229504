'use client';

import React, { useState } from 'react';

export default function TestSimpleUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log('File selected:', file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // In a real app, you'd upload the file here
      setUploadStatus(`Would upload: ${selectedFile.name}`);
      console.log('Would upload file:', selectedFile);
    } else {
      setUploadStatus('No file selected');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Simple File Upload Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a file:
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <button
            onClick={handleUpload}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload File
          </button>

          {uploadStatus && (
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-sm">{uploadStatus}</p>
              {selectedFile && (
                <div className="mt-2 text-xs text-gray-600">
                  <p>Name: {selectedFile.name}</p>
                  <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p>Type: {selectedFile.type}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}