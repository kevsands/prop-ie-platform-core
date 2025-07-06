'use client';

import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

interface VariablesPanelProps {
  fields: Field[];
  onInsertAction: (variable: string) => void;
}

export default function VariablesPanel({ fields, onInsertAction }: VariablesPanelProps) {
  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-full">
      <h4 className="font-medium text-gray-900 mb-4">Available Variables</h4>
      
      {fields.length === 0 ? (
        <p className="text-sm text-gray-500">
          No variables available. Add fields to create variables.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">
            Click on a variable to insert it into your template.
          </p>
          
          {fields.map(field => (
            <button
              key={field.id}
              onClick={() => onInsertAction(field.name)}
              className="w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-white flex justify-between items-center"
            >
              <span>{field.label} <span className="text-gray-500">({field.name})</span></span>
              <span className="text-gray-400">→</span>
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h5 className="font-medium text-gray-900 mb-2">How to use variables</h5>
        <p className="text-sm text-gray-600">
          Insert variables in your template using the syntax: {'{{variableName}}'}
        </p>
      </div>
    </div>
  );
}