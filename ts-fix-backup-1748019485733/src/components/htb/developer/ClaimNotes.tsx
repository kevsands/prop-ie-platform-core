'use client';

import React from 'react';
import { formatDate } from '@/utils/date-utils';

interface ClaimNotesProps {
  notes: any[]; // Ideally, you should define a proper type for your notes
}

export function ClaimNotes({ notes }: ClaimNotesProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
        <p className="text-gray-500">No notes available for this claim</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Claim Notes
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Notes and updates for this HTB claim
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {notes.map((noteindex) => (
            <li key={note.id || index} className={`px-4 py-4 sm:px-6 ${note.isPrivate ? 'bg-yellow-50' : ''}`}>
              <div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    {note.author || 'System'}
                    {note.isPrivate && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Private
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(note.createdAt)}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}