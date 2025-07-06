'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

// Define interfaces for props and other types
interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  items: ChecklistItem[];
}

interface ReadinessChecklistProps {
  onProgressChange?: (progress: number) => void;
  onCategoryProgressChange?: (category: string, progress: number) => void;
  editable?: boolean;
}

// Simplified ReadinessChecklist component
const SimplifiedReadinessChecklist = ({ 
  onProgressChange, 
  onCategoryProgressChange, 
  editable = true 
}: ReadinessChecklistProps) => {
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

  // Define interface for Progress component props
  interface ProgressProps {
    value?: number;
    className?: string;
  }

  // Simple progress bar component
  const Progress = ({ value = 0, className = "" }: ProgressProps) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );

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

export default function BuyerReadinessChecklistPage() {
  const [overallProgress, setOverallProgress] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});

  // Track progress changes
  const handleProgressChange = (progress: number) => {
    setOverallProgress(progress);
  };

  // Track category progress changes
  const handleCategoryProgressChange = (category: string, progress: number) => {
    setCategoryProgress(prev => ({
      ...prev,
      [category]: progress,
    }));
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Alert about simplified version */}
        <div className="bg-amber-100 p-4 rounded-md mb-8 text-amber-800">
          <h3 className="font-semibold mb-1">Simplified Page</h3>
          <p>This is a simplified buyer readiness checklist for build testing. Full functionality will be restored later.</p>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Home Buying Readiness Checklist</h1>
        <p className="text-gray-600 mb-8">
          Track your progress towards buying your first home with our comprehensive checklist.
          Mark items off as you complete them and monitor your readiness.
        </p>
        
        <SimplifiedReadinessChecklist 
          onProgressChange={handleProgressChange}
          onCategoryProgressChange={handleCategoryProgressChange}
          editable={true}
        />

        {overallProgress >= 75 && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-2">You're almost ready!</h2>
            <p className="text-green-700">
              You've completed {overallProgress}% of the recommended steps. 
              When you reach 100%, you'll be in a strong position to proceed with your home buying journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}