'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SimplifiedReadinessChecklistProps {
  onProgressChange?: (progress: number) => void;
  onCategoryProgressChange?: (category: string, progress: number) => void;
  editable?: boolean;
}

// Simple progressbar component
const Progress = ({ value = 0, className = "" }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-blue-600 transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);

const SimplifiedReadinessChecklist: React.FC<SimplifiedReadinessChecklistProps> = ({
  onProgressChange,
  onCategoryProgressChange,
  editable = true
}) => {
  // Categories with initial items
  const categories = [
    {
      id: 'financial',
      name: 'Financial Preparation',
      items: [
        { id: 'fin1', title: 'Calculate your budget', completed: false },
        { id: 'fin2', title: 'Save for a deposit', completed: false },
        { id: 'fin3', title: 'Check your credit score', completed: false },
        { id: 'fin4', title: 'Research mortgage options', completed: false },
      ]
    },
    {
      id: 'documents',
      name: 'Document Preparation',
      items: [
        { id: 'doc1', title: 'Proof of identity', completed: false },
        { id: 'doc2', title: 'Proof of address', completed: false },
        { id: 'doc3', title: 'Bank statements (6 months)', completed: false },
      ]
    },
    {
      id: 'research',
      name: 'Property Research',
      items: [
        { id: 'res1', title: 'Decide on location preferences', completed: false },
        { id: 'res2', title: 'Determine property requirements', completed: false },
        { id: 'res3', title: 'Research property prices in target areas', completed: false },
      ]
    },
    {
      id: 'legal',
      name: 'Legal Preparation',
      items: [
        { id: 'leg1', title: 'Find a solicitor', completed: false },
        { id: 'leg2', title: 'Research additional purchase costs', completed: false },
        { id: 'leg3', title: 'Understand the conveyancing process', completed: false },
      ]
    }
  ];

  // Track all items in a flat array
  const [items, setItems] = useState(() => 
    categories.flatMap(category => 
      category.items.map(item => ({
        ...item,
        category: category.id
      }))
    )
  );

  // Calculate overall progress
  const [overallProgress, setOverallProgress] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});

  // Toggle item completion
  const toggleItem = (id: string) => {
    if (!editable) return;
    
    const newItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    
    setItems(newItems);
  };

  // Update progress calculations when items change
  useEffect(() => {
    // Calculate overall progress
    const completedCount = items.filter(item => item.completed).length;
    const newOverallProgress = Math.round((completedCount / items.length) * 100);
    setOverallProgress(newOverallProgress);
    
    if (onProgressChange) {
      onProgressChange(newOverallProgress);
    }
    
    // Calculate progress for each category
    const newCategoryProgress: Record<string, number> = {};
    
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category.id);
      const completedCategoryItems = categoryItems.filter(item => item.completed);
      const progress = Math.round((completedCategoryItems.length / categoryItems.length) * 100);
      
      newCategoryProgress[category.id] = progress;
      
      if (onCategoryProgressChange) {
        onCategoryProgressChange(category.id, progress);
      }
    });
    
    setCategoryProgress(newCategoryProgress);
  }, [items, onProgressChange, onCategoryProgressChange]);

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Overall Progress</h2>
          <span className="text-xl font-bold">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} />
        
        {/* Category progress indicators */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {categories.map(category => (
            <div key={category.id} className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium">{category.name}</h3>
                <span className="text-sm">{categoryProgress[category.id] || 0}%</span>
              </div>
              <Progress 
                value={categoryProgress[category.id] || 0} 
                className="h-1.5" 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Checklist sections */}
      {categories.map(category => (
        <div key={category.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium">{category.name}</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {category.items.map(item => {
              const itemWithCategory = items.find(i => i.id === item.id);
              const isCompleted = itemWithCategory?.completed || false;
              
              return (
                <div key={item.id} className={`p-4 flex items-center ${isCompleted ? 'bg-blue-50' : ''}`}>
                  <button
                    onClick={() => toggleItem(item.id)}
                    disabled={!editable}
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    {isCompleted && <CheckCircle className="h-4 w-4" />}
                  </button>
                  
                  <span className={isCompleted ? 'line-through text-gray-500' : ''}>
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimplifiedReadinessChecklist;