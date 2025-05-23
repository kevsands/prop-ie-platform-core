import React from 'react';
'use client';

import { useToast } from './use-toast';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast: any) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg shadow-lg ${
            toast.variant === 'destructive' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          } animate-slide-in-right`}
        >
          {toast.variant === 'destructive' ? (
            <FiAlertCircle className="mr-3 h-5 w-5" />
          ) : (
            <FiCheckCircle className="mr-3 h-5 w-5" />
          )}
          <div className="flex-1">
            {toast.title && <p className="font-medium">{toast.title}</p>}
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-4 hover:opacity-75"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toaster;