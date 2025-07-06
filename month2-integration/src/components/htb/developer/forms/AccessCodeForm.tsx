'use client';

import React, { useState, ChangeEvent } from 'react';
import { useHTB } from '@/context/HTBContext';

interface AccessCodeFormProps {
  claimId: string;
  onSuccessAction: () => void;
  onErrorAction: (error: Error) => void;
}

export default function AccessCodeForm({ 
  claimId,
  onSuccessAction,
  onErrorAction
}: AccessCodeFormProps) {
  const { processAccessCode } = useHTB();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await processAccessCode(claimId, accessCode);
      setAccessCode('');
      onSuccessAction();
    } catch (error) {
      onErrorAction(error instanceof Error ? error : new Error('Failed to process access code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
          Access Code
        </label>
        <input
          type="text"
          id="accessCode"
          value={accessCode}
          onChange={handleAccessCodeChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter access code"
          pattern="[A-Z0-9-]+"
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !accessCode}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Process Access Code'}
      </button>
    </form>
  );
}