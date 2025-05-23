'use client';

import React, { useState, useRef } from 'react';
import { useHTB } from '@/context/HTBContext';

interface DocumentUploadFormProps {
  claimId: string;
  onSuccessAction: () => void;
  onErrorAction: (error: string) => void;
}

export function DocumentUploadForm({ claimId, onSuccessAction, onErrorAction }: DocumentUploadFormProps) {
  const { uploadHTBDocument, isLoading } = useHTB();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formDatasetFormData] = useState({
    file: null as File | null,
    type: "revenue_correspondence",
    name: "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;

      setFormData(prev => ({
        ...prev,
        file,
        // Auto-set name if not already set
        name: prev.name || (file ? file.name.split('.')[0] : '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      onErrorAction('Please select a file to upload');
      return;
    }

    try {
      await uploadHTBDocument(claimId, formData.file, formData.type, formData.name);
      onSuccessAction();
      // Reset form
      setFormData({
        file: null,
        type: "revenue_correspondence",
        name: ""
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onErrorAction(error instanceof Error ? error.message : 'Failed to upload document');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
          Document
        </label>
        <input
          type="file"
          id="file"
          name="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Document Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter document name"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Document Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="revenue_correspondence">Revenue Correspondence</option>
          <option value="bank_statement">Bank Statement</option>
          <option value="identity_verification">Identity Verification</option>
          <option value="deposit_receipt">Deposit Receipt</option>
          <option value="contract">Contract</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </form>
  );
}