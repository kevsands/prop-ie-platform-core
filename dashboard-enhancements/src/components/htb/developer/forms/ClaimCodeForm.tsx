'use client';

import React, { useState, useRef } from 'react';
import { useHTB } from '@/context/HTBContext';

interface ClaimCodeFormProps {
  claimId: string;
  onSuccessAction: () => void;
  onErrorAction: (error: string) => void;
}

export function ClaimCodeForm({ claimId, onSuccessAction, onErrorAction }: ClaimCodeFormProps) {
  const { updateClaimCode, isLoading } = useHTB();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    claimCode: "",
    claimCodeExpiryDate: "",
    approvedAmount: 0,
    documentFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData(prev => ({
        ...prev,
        documentFile: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.documentFile) {
        throw new Error('Please upload a supporting document');
      }
      
      await updateClaimCode(
        claimId, 
        formData.claimCode, 
        new Date(formData.claimCodeExpiryDate).toISOString(), 
        formData.approvedAmount, 
        formData.documentFile
      );
      onSuccessAction();
      // Reset form
      setFormData({
        claimCode: "",
        claimCodeExpiryDate: "",
        approvedAmount: 0,
        documentFile: null
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onErrorAction(error instanceof Error ? error.message : 'Failed to update claim code');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="claimCode" className="block text-sm font-medium text-gray-700 mb-1">
          Claim Code
        </label>
        <input
          type="text"
          id="claimCode"
          name="claimCode"
          value={formData.claimCode}
          onChange={handleInputChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="claimCodeExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Date
        </label>
        <input
          type="date"
          id="claimCodeExpiryDate"
          name="claimCodeExpiryDate"
          value={formData.claimCodeExpiryDate}
          onChange={handleInputChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Approved Amount (€)
        </label>
        <input
          type="number"
          id="approvedAmount"
          name="approvedAmount"
          value={formData.approvedAmount || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700 mb-1">
          Supporting Document
        </label>
        <input
          type="file"
          id="documentFile"
          name="documentFile"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">Upload Revenue documentation (PDF preferred)</p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Updating...' : 'Update Claim Code'}
        </button>
      </div>
    </form>
  );
}