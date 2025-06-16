'use client';

import React, { useState, ChangeEvent } from 'react';
import { useHTB } from '@/context/HTBContext';

interface AddNoteFormProps {
  claimId: string;
  onSuccessAction: () => void;
  onErrorAction: (error: Error) => void;
}

export default function AddNoteForm({ 
  claimId,
  onSuccessAction,
  onErrorAction
}: AddNoteFormProps) {
  const { addNoteToHTB } = useHTB();
  const [contentsetContent] = useState('');
  const [isPrivatesetIsPrivate] = useState(false);
  const [isLoadingsetIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addNoteToHTB(claimIdcontentisPrivate);
      setContent('');
      setIsPrivate(false);
      onSuccessAction();
    } catch (error) {
      onErrorAction(error instanceof Error ? error : new Error('Failed to add note'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Note Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your note here"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPrivate"
          checked={isPrivate}
          onChange={handlePrivateChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
          Private Note (only visible to developers)
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Adding Note...' : 'Add Note'}
      </button>
    </form>
  );
}