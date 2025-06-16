'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle,
  Info,
  Download,
  Send,
  PlusCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/useToast';

interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  completed: boolean;
  importance: 'high' | 'medium' | 'low';
  helpLink?: string;
}

type ChecklistCategory = 
  | 'financial' 
  | 'documents' 
  | 'research' 
  | 'preparation';

interface ChecklistCategoryMeta {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ReadinessChecklistProps {
  onProgressChange?: (progress: number) => void;
  onCategoryProgressChange?: (category: ChecklistCategory, progress: number) => void;
  initialItems?: ChecklistItem[];
  editable?: boolean;
}

export default function ReadinessChecklist({ 
  onProgressChange, 
  onCategoryProgressChange,
  initialItems,
  editable = false
}: ReadinessChecklistProps) {
  const toast = useToast();

  // Initialize default checklist items
  const defaultItems: ChecklistItem[] = [
    // Financial category
    {
      id: 'fin1',
      category: 'financial',
      title: 'Calculate your budget',
      description: 'Determine how much you can afford to spend on a property based on your income, expenses, and savings.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'fin2',
      category: 'financial',
      title: 'Save for a deposit',
      description: 'Aim for at least 10% of the property price to qualify for most mortgages.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'fin3',
      category: 'financial',
      title: 'Check your credit score',
      description: 'Review your credit report for any errors and ensure your score is in good standing for mortgage applications.',
      completed: false,
      importance: 'medium',
      helpLink: 'https://www.centralcreditregister.ie/'
    },
    {
      id: 'fin4',
      category: 'financial',
      title: 'Research mortgage options',
      description: 'Compare different lenders and mortgage products to find the best fit for your situation.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'fin5',
      category: 'financial',
      title: 'Get mortgage approval in principle',
      description: "This gives you a clear budget and shows sellers you're a serious buyer.",
      completed: false,
      importance: 'high'
    },
    // Documents category
    {
      id: 'doc1',
      category: 'documents',
      title: 'Proof of identity',
      description: "Valid passport, driver's license, or national ID card.",
      completed: false,
      importance: 'high'
    },
    {
      id: 'doc2',
      category: 'documents',
      title: 'Proof of address',
      description: 'Recent utility bills, bank statements, or government correspondence.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'doc3',
      category: 'documents',
      title: 'Proof of income',
      description: 'Recent payslips (usually last 3-6 months), employment contract, and tax documents.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'doc4',
      category: 'documents',
      title: 'Bank statements',
      description: 'At least 6 months of statements for all your accounts.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'doc5',
      category: 'documents',
      title: 'Savings record',
      description: 'Evidence of regular savings over time to show your ability to manage mortgage payments.',
      completed: false,
      importance: 'medium'
    },
    // Research category
    {
      id: 'res1',
      category: 'research',
      title: 'Decide on location preferences',
      description: 'Research different neighborhoods for amenities, transport links, schools, and future development plans.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'res2',
      category: 'research',
      title: 'Determine property requirements',
      description: 'List your must-haves vs. nice-to-haves for property size, type, features, etc.',
      completed: false,
      importance: 'medium'
    },
    {
      id: 'res3',
      category: 'research',
      title: 'Research local property prices',
      description: 'Check recent sales in your target areas to understand market rates.',
      completed: false,
      importance: 'medium'
    },
    {
      id: 'res4',
      category: 'research',
      title: 'Understand government schemes',
      description: 'Research Help-to-Buy and other initiatives for first-time buyers.',
      completed: false,
      importance: 'high',
      helpLink: '/buyer/journey/planning/government-schemes'
    },
    // Preparation category
    {
      id: 'prep1',
      category: 'preparation',
      title: 'Find a solicitor',
      description: 'Research and select a solicitor experienced in property transactions.',
      completed: false,
      importance: 'high'
    },
    {
      id: 'prep2',
      category: 'preparation',
      title: 'Research additional costs',
      description: 'Be prepared for legal fees, stamp duty, valuation fees, surveys, and moving costs.',
      completed: false,
      importance: 'medium'
    },
    {
      id: 'prep3',
      category: 'preparation',
      title: 'Prepare for property viewings',
      description: 'Make a checklist of things to look for and questions to ask during viewings.',
      completed: false,
      importance: 'medium'
    },
    {
      id: 'prep4',
      category: 'preparation',
      title: 'Understand the buying process',
      description: 'Familiarize yourself with each step of buying a property, from offer to completion.',
      completed: false,
      importance: 'high'
    }
  ];

  // Category metadata
  const categoryMeta: Record<ChecklistCategory, ChecklistCategoryMeta> = {
    financial: {
      name: 'Financial Readiness',
      description: 'Your financial preparation for home buying',
      icon: <div className="text-emerald-600">€</div>,
      color: 'emerald'
    },
    documents: {
      name: 'Document Preparation',
      description: "Documents you'll need for your mortgage application",
      icon: <div className="text-blue-600">📄</div>,
      color: 'blue'
    },
    research: {
      name: 'Market Research',
      description: 'Understanding locations, properties and options',
      icon: <div className="text-purple-600">🔍</div>,
      color: 'purple'
    },
    preparation: {
      name: 'Practical Preparation',
      description: 'Getting ready for the buying process',
      icon: <div className="text-amber-600">📋</div>,
      color: 'amber'
    }
  };

  // State for checklist items
  const [itemssetItems] = useState<ChecklistItem[]>(initialItems || defaultItems);
  const [expandedCategoriessetExpandedCategories] = useState<ChecklistCategory[]>(['financial']);
  const [categoryProgresssetCategoryProgress] = useState<Record<ChecklistCategory, number>>({} as Record<ChecklistCategory, number>);
  const [overallProgresssetOverallProgress] = useState(0);
  const [newTaskCategorysetNewTaskCategory] = useState<ChecklistCategory>('financial');
  const [newTaskTitlesetNewTaskTitle] = useState('');
  const [newTaskDescriptionsetNewTaskDescription] = useState('');
  const [newTaskImportancesetNewTaskImportance] = useState<'high' | 'medium' | 'low'>('medium');
  const [isAddingTasksetIsAddingTask] = useState(false);

  // Calculate progress whenever items change
  useEffect(() => {
    calculateProgress();
  }, [items]);

  // Calculate progress for each category and overall
  const calculateProgress = () => {
    const categories = Object.keys(categoryMeta) as ChecklistCategory[];
    const newCategoryProgress: Record<ChecklistCategory, number> = {} as Record<ChecklistCategory, number>
  );
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      const completedCount = categoryItems.filter(item => item.completed).length;
      const progress = categoryItems.length ? Math.round((completedCount / categoryItems.length) * 100) : 0;

      newCategoryProgress[category] = progress;

      if (onCategoryProgressChange) {
        onCategoryProgressChange(categoryprogress);
      }
    });

    setCategoryProgress(newCategoryProgress);

    // Calculate overall progress
    const completedCount = items.filter(item => item.completed).length;
    const newOverallProgress = items.length ? Math.round((completedCount / items.length) * 100) : 0;
    setOverallProgress(newOverallProgress);

    if (onProgressChange) {
      onProgressChange(newOverallProgress);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: ChecklistCategory) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category));
    } else {
      setExpandedCategories([...expandedCategoriescategory]);
    }
  };

  // Toggle item completion
  const toggleItem = (id: string) => {
    const newItems = items.map(item => 
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    );

    setItems(newItems);

    const item = items.find(item => item.id === id);
    if (item) {
      toast({
        title: item.completed ? "Item marked as incomplete" : "Item completed!",
        description: item.title,
        variant: item.completed ? "default" : "success");
    }
  };

  // Add a new task
  const addNewTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your new task.",
        variant: "destructive");
      return;
    }

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      category: newTaskCategory,
      title: newTaskTitle,
      description: newTaskDescription || "Custom task",
      completed: false,
      importance: newTaskImportance
    };

    setItems([...itemsnewItem]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddingTask(false);

    toast({
      title: "Task added",
      description: `Added "${newTaskTitle}" to your checklist.`,
      variant: "success");

    // Make sure the category is expanded
    if (!expandedCategories.includes(newTaskCategory)) {
      setExpandedCategories([...expandedCategoriesnewTaskCategory]);
    }
  };

  // Count items by category
  const getCategoryItemCount = (category: ChecklistCategory) => {
    return items.filter(item => item.category === category).length;
  };

  // Count completed items by category
  const getCategoryCompletedCount = (category: ChecklistCategory) => {
    return items.filter(item => item.category === category && item.completed).length;
  };

  // Get items for a specific category
  const getCategoryItems = (category: ChecklistCategory) => {
    return items.filter(item => item.category === category);
  };

  // Generate a sharable list of items
  const generateShareableList = () => {
    const categories = Object.keys(categoryMeta) as ChecklistCategory[];
    let shareableText = "MY HOME BUYING READINESS CHECKLIST\n\n";

    categories.forEach(category => {
      const meta = categoryMeta[category];
      const categoryItems = getCategoryItems(category);
      const completedCount = getCategoryCompletedCount(category);

      shareableText += `${meta.name.toUpperCase()} (${completedCount}/${categoryItems.length})\n`;

      categoryItems.forEach(item => {
        shareableText += `${item.completed ? "✅" : "⬜" ${item.title}\n`;
      });

      shareableText += "\n";
    });

    shareableText += `Overall Progress: ${overallProgress}%\n`;
    shareableText += "Generated from PropIE First-Time Buyer Platform";

    return shareableText;
  };

  // Share checklist
  const shareChecklist = () => {
    const shareableText = generateShareableList();

    if (navigator.share) {
      navigator.share({
        title: "My Home Buying Checklist",
        text: shareableText
      })
      .then(() => {
        toast({
          title: "Checklist shared",
          description: "Your checklist has been shared successfully.",
          variant: "success");
      })
      .catch(error => {

        // Fallback to clipboard
        copyToClipboard();
      });
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };

  // Copy checklist to clipboard
  const copyToClipboard = () => {
    const shareableText = generateShareableList();

    navigator.clipboard.writeText(shareableText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Your checklist has been copied to the clipboard.",
          variant: "success");
      })
      .catch(error => {

        toast({
          title: "Could not copy to clipboard",
          description: "Please try again or use the download option.",
          variant: "destructive");
      });
  };

  // Download checklist as a text file
  const downloadChecklist = () => {
    const shareableText = generateShareableList();
    const blob = new Blob([shareableText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "home-buying-checklist.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Checklist downloaded",
      description: "Your checklist has been downloaded as a text file.",
      variant: "success");
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center mb-2">
          <CheckSquare className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">First-Time Buyer Readiness Checklist</h2>
        </div>
        <p className="text-blue-100">
          Track your progress towards buying your first home
        </p>
      </div>

      <div className="p-6">
        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Overall Progress</h3>
            <span className="text-lg font-bold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {(Object.keys(categoryMeta) as ChecklistCategory[]).map(category => {
              const meta = categoryMeta[category];
              const progress = categoryProgress[category] || 0;

              return (
                <div 
                  key={category}
                  className={`p-3 rounded-lg border border-${meta.color}-200 bg-${meta.color}-50`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-6 h-6 rounded-full bg-${meta.color}-100 flex items-center justify-center mr-2`}>
                      {meta.icon}
                    </div>
                    <h4 className="text-sm font-medium">{meta.name}</h4>
                  </div>
                  <div className="flex items-center">
                    <Progress value={progress} className={`h-1.5 flex-1 mr-2 bg-${meta.color}-200`} />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist Categories */}
        <div className="mb-8">
          {(Object.keys(categoryMeta) as ChecklistCategory[]).map(category => {
            const meta = categoryMeta[category];
            const isExpanded = expandedCategories.includes(category);
            const itemCount = getCategoryItemCount(category);
            const completedCount = getCategoryCompletedCount(category);

            return (
              <div key={category} className="mb-4 border rounded-lg overflow-hidden">
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 border-b border-${meta.color}-200 bg-${meta.color}-50`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full bg-${meta.color}-100 flex items-center justify-center mr-3`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{meta.name}</h3>
                      <p className="text-sm text-gray-600">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium mr-3">
                      {completedCount}/{itemCount}
                    </div>
                    {isExpanded ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                </div>

                {isExpanded && (
                  <div className="divide-y">
                    {getCategoryItems(category).map(item => (
                      <div 
                        key={item.id}
                        className={`p-4 flex items-start ${item.completed ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <div className="flex-shrink-0 mt-0.5 mr-3">
                          <button 
                            onClick={() => toggleItem(item.id)}
                            className={`w-5 h-5 rounded border ${
                              item.completed ? 'text-green-600 bg-green-50 border-green-400' : 'text-gray-400 border-gray-300'
                            } flex items-center justify-center hover:bg-gray-50`}
                          >
                            {item.completed ? <CheckCircle2 className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-center">
                            <h4 className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {item.title}
                            </h4>
                            <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.importance === 'high' ? 'bg-red-100 text-red-800' :
                              item.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.importance === 'high' ? 'High Priority' :
                               item.importance === 'medium' ? 'Medium Priority' :
                               'Low Priority'}
                            </div>
                          </div>

                          <p className={`text-sm mt-1 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.description}
                          </p>

                          {item.helpLink && (
                            <a 
                              href={item.helpLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
                            >
                              <Info className="h-3 w-3 mr-1" /> More information
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Custom Task */}
        {editable && (
          <div className="mb-8">
            {isAddingTask ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Add Custom Task</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title
                    </label>
                    <input 
                      type="text" 
                      value={newTaskTitle}
                      onChange={(e: any) => setNewTaskTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      placeholder="e.g., Research property taxes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea 
                      value={newTaskDescription}
                      onChange={(e: any) => setNewTaskDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      placeholder="Add more details about this task"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select 
                        value={newTaskCategory}
                        onChange={(e: any) => setNewTaskCategory(e.target.value as ChecklistCategory)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {(Object.keys(categoryMeta) as ChecklistCategory[]).map(category => (
                          <option key={category} value={category}>
                            {categoryMeta[category].name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select 
                        value={newTaskImportance}
                        onChange={(e: any) => setNewTaskImportance(e.target.value as 'high' | 'medium' | 'low')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewTask} disabled={!newTaskTitle.trim()}>
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => setIsAddingTask(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Custom Task
              </Button>
            )}
          </div>
        )}

        {/* Tips and Share */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 text-blue-800">Tips for First-Time Buyers</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Start saving for your deposit as early as possible.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Get mortgage approval in principle before seriously house hunting.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Budget for all the extra costs: legal fees, surveys, moving expenses.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Consider the Help-to-Buy scheme to support your deposit savings.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Research the area thoroughly - visit at different times of day/week.</span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Share Your Progress</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share your checklist with partners, family members, or your mortgage advisor to keep everyone on the same page.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={shareChecklist} className="flex items-center">
                <Send className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadChecklist} className="flex items-center">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}