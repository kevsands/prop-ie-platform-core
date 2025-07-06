'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  name: string;
  count: number;
}

interface DocumentCategoryProgressProps {
  categories: Category[];
}

const DocumentCategoryProgress: React.FC<DocumentCategoryProgressProps> = ({
  categories
}) => {
  // Calculate total documents
  const totalDocuments = categories.reduce((sum, category) => sum + category.count, 0);
  
  // Generate category colors
  const categoryColors: Record<string, string> = {
    'Legal': 'bg-purple-500',
    'Planning': 'bg-indigo-500',
    'Technical': 'bg-blue-500',
    'Financial': 'bg-green-500',
    'Marketing': 'bg-pink-500',
    'KYC': 'bg-red-500',
    'Compliance': 'bg-yellow-500',
    'Contract': 'bg-orange-500',
    'Certificate': 'bg-emerald-500',
    'Warranty': 'bg-cyan-500',
    'Other': 'bg-gray-500'
  };
  
  if (totalDocuments === 0) {
    return null; // Don't show if no documents
  }
  
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-2">Documents by Category</h3>
      <div className="flex h-3 mb-2 rounded-full overflow-hidden">
        {categories.map((category, index) => {
          // Calculate percentage width
          const percentage = (category.count / totalDocuments) * 100;
          if (percentage === 0) return null;
          
          return (
            <div 
              key={category.name}
              className={`${categoryColors[category.name] || 'bg-gray-500'}`}
              style={{ width: `${percentage}%` }}
              title={`${category.name}: ${category.count} documents (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
        {categories.filter(c => c.count > 0).map((category) => (
          <div key={category.name} className="flex items-center text-xs">
            <div 
              className={`w-3 h-3 mr-2 rounded-full ${categoryColors[category.name] || 'bg-gray-500'}`}
            />
            <span className="font-medium">{category.name}:</span>
            <span className="ml-1">{category.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DocumentCategoryProgress;