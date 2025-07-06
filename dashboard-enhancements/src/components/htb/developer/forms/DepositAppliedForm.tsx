'use client';

import React, { useState, useRef } from 'react';
import { useHTB } from '@/context/HTBContext';

interface DepositAppliedFormProps {
  claimId: string;
  onSuccessAction: () => void;
  onErrorAction: (error: string) => void;
}

export function DepositAppliedForm({ claimId, onSuccessAction, onErrorAction }: DepositAppliedFormProps) {
  const { markDepositApplied, isLoading } = useHTB();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
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
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await markDepositApplied(
        claimId, 
        new Date(formData.appliedDate), 
        formData.notes, 
        formData.documentFile || undefined
      );
      onSuccessAction();
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFormData(prev => ({
        ...prev,
        notes: "",
        documentFile: null
      }));
    } catch (error) {
      onErrorAction(error instanceof Error ? error.message : 'Failed to mark deposit as applied');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 mb-1">
          Date Applied
        </label>
        <input
          type="date"
          id="appliedDate"
          name="appliedDate"
          value={formData.appliedDate}
          onChange={handleInputChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Enter any notes related to the deposit application..."
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
        <p className="mt-1 text-xs text-gray-500">Upload any relevant documentation (PDF preferred)</p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Processing...' : 'Mark Deposit Applied'}
        </button>
      </div>
    </form>
  );
}