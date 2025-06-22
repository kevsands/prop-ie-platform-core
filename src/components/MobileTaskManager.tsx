/**
 * Mobile-First Task Manager Component
 * 
 * Enterprise-grade mobile task management interface optimized for touch interactions,
 * offline capabilities, and PWA functionality. Integrates with the Universal Task
 * Management System and AI Intelligence services.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { 
  Task, 
  TaskStatus, 
  TaskPriority, 
  TaskCategory,
  TaskComplexityLevel,
  TaskOrchestrationContext 
} from '@/types/task/universal-task';
import { 
  AITaskPriorityScore, 
  PredictionConfidence 
} from '@/services/AITaskIntelligenceService';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Filter,
  Search,
  Plus,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Timer,
  Users,
  Zap,
  Target,
  TrendingUp,
  Bell,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

/**
 * Mobile-optimized task view configurations
 */
interface MobileViewConfig {
  view: 'today' | 'week' | 'priority' | 'ai-suggestions' | 'offline';
  showCompleted: boolean;
  filterPersona?: string;
  sortBy: 'priority' | 'deadline' | 'ai-score' | 'category';
  compactMode: boolean;
}

/**
 * Touch gesture handlers for mobile interactions
 */
interface TouchGestures {
  onSwipeLeft: (taskId: string) => void;
  onSwipeRight: (taskId: string) => void;
  onLongPress: (taskId: string) => void;
  onDoubleTab: (taskId: string) => void;
}

/**
 * Offline task state for PWA functionality
 */
interface OfflineTaskState {
  pendingActions: Array<{
    taskId: string;
    action: 'complete' | 'update' | 'create' | 'delete';
    data: any;
    timestamp: Date;
  }>;
  lastSync: Date;
  isOnline: boolean;
}

/**
 * Mobile task card component with touch optimizations
 */
const MobileTaskCard: React.FC<{
  task: Task;
  aiScore?: AITaskPriorityScore;
  onAction: (action: string, taskId: string) => void;
  gestures: TouchGestures;
  compact?: boolean;
}> = ({ task, aiScore, onAction, gestures, compact = false }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    // Determine gesture type
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      // Horizontal swipe
      if (deltaX > 0) {
        gestures.onSwipeRight(task.id);
        setSwipeDirection('right');
      } else {
        gestures.onSwipeLeft(task.id);
        setSwipeDirection('left');
      }
    } else if (deltaTime > 500 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // Long press
      gestures.onLongPress(task.id);
    }

    setTouchStart(null);
    setTimeout(() => setSwipeDirection(null), 300);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL: return 'text-red-600 bg-red-50';
      case TaskPriority.HIGH: return 'text-orange-600 bg-orange-50';
      case TaskPriority.MEDIUM: return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getComplexityIcon = (complexity: TaskComplexityLevel) => {
    switch (complexity) {
      case TaskComplexityLevel.EXPERT: return <Star className="h-4 w-4 text-purple-600" />;
      case TaskComplexityLevel.COMPLEX: return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case TaskComplexityLevel.MODERATE: return <Target className="h-4 w-4 text-green-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card 
      className={`relative mb-3 transition-all duration-200 active:scale-95 ${
        swipeDirection === 'left' ? 'transform -translate-x-2 bg-red-50' :
        swipeDirection === 'right' ? 'transform translate-x-2 bg-green-50' : ''
      } ${compact ? 'p-3' : 'p-4'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* AI Score Indicator */}
      {aiScore && (
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              aiScore.confidence === PredictionConfidence.VERY_HIGH ? 'border-green-500 text-green-700' :
              aiScore.confidence === PredictionConfidence.HIGH ? 'border-blue-500 text-blue-700' :
              aiScore.confidence === PredictionConfidence.MEDIUM ? 'border-yellow-500 text-yellow-700' :
              'border-gray-500 text-gray-700'
            }`}
          >
            <Zap className="h-3 w-3 mr-1" />
            {Math.round(aiScore.score)}
          </Badge>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 truncate ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {task.title}
          </h3>
          {!compact && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          {getComplexityIcon(task.complexityLevel)}
          <Badge 
            className={`text-xs ${getPriorityColor(task.priority)}`}
            variant="secondary"
          >
            {task.priority}
          </Badge>
        </div>
      </div>

      {/* Progress and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          {task.estimatedDuration}h
          {task.dueDate && (
            <>
              <Calendar className="h-4 w-4 ml-2" />
              {new Date(task.dueDate).toLocaleDateString()}
            </>
          )}
        </div>
        
        {task.status === TaskStatus.IN_PROGRESS && (
          <div className="w-20">
            <Progress value={task.progressPercentage || 0} className="h-2" />
          </div>
        )}
      </div>

      {/* Mobile Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.targetPersonas.length > 1 && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {task.targetPersonas.length}
            </Badge>
          )}
          
          {task.isTimeDependent && (
            <Badge variant="outline" className="text-xs border-red-300 text-red-700">
              <Timer className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onAction('complete', task.id)}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onAction('menu', task.id)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Swipe Hints */}
      {swipeDirection && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className={`flex items-center space-x-2 text-sm font-medium ${
            swipeDirection === 'left' ? 'text-red-600' : 'text-green-600'
          }`}>
            {swipeDirection === 'left' ? (
              <>
                <ArrowDown className="h-5 w-5" />
                Defer Task
              </>
            ) : (
              <>
                <ArrowUp className="h-5 w-5" />
                Complete Task
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

/**
 * Main Mobile Task Manager Component
 */
export const MobileTaskManager: React.FC<{
  tasks: Task[];
  context: TaskOrchestrationContext;
  aiScores?: Map<string, AITaskPriorityScore>;
  onTaskAction: (action: string, taskId: string, data?: any) => void;
  className?: string;
}> = ({ tasks, context, aiScores, onTaskAction, className = '' }) => {
  const [viewConfig, setViewConfig] = useState<MobileViewConfig>({
    view: 'today',
    showCompleted: false,
    sortBy: 'ai-score',
    compactMode: false
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [offlineState, setOfflineState] = useState<OfflineTaskState>({
    pendingActions: [],
    lastSync: new Date(),
    isOnline: navigator.onLine
  });
  
  const [showDrawer, setShowDrawer] = useState(false);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setOfflineState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setOfflineState(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter and sort tasks based on mobile view
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Completed filter
      if (!viewConfig.showCompleted && task.status === TaskStatus.COMPLETED) {
        return false;
      }
      
      // View-specific filters
      switch (viewConfig.view) {
        case 'today':
          return task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
        case 'week':
          return task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        case 'priority':
          return task.priority === TaskPriority.CRITICAL || task.priority === TaskPriority.HIGH;
        case 'ai-suggestions':
          return aiScores?.has(task.id) && (aiScores.get(task.id)?.score || 0) > 70;
        default:
          return true;
      }
    });
    
    // Sort tasks
    filtered.sort((a, b) => {
      switch (viewConfig.sortBy) {
        case 'priority':
          const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, DEFERRED: 0 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'deadline':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'ai-score':
          const aScore = aiScores?.get(a.id)?.score || 0;
          const bScore = aiScores?.get(b.id)?.score || 0;
          return bScore - aScore;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [tasks, viewConfig, searchQuery, aiScores]);

  // Touch gesture handlers
  const gestureHandlers: TouchGestures = {
    onSwipeLeft: useCallback((taskId: string) => {
      onTaskAction('defer', taskId);
    }, [onTaskAction]),
    
    onSwipeRight: useCallback((taskId: string) => {
      onTaskAction('complete', taskId);
    }, [onTaskAction]),
    
    onLongPress: useCallback((taskId: string) => {
      setSelectedTaskId(taskId);
      setShowDrawer(true);
    }, []),
    
    onDoubleTab: useCallback((taskId: string) => {
      onTaskAction('quick-edit', taskId);
    }, [onTaskAction])
  };

  // Handle offline actions
  const handleOfflineAction = useCallback((action: string, taskId: string, data?: any) => {
    if (!offlineState.isOnline) {
      setOfflineState(prev => ({
        ...prev,
        pendingActions: [...prev.pendingActions, {
          taskId,
          action: action as any,
          data,
          timestamp: new Date()
        }]
      }));
    }
    onTaskAction(action, taskId, data);
  }, [offlineState.isOnline, onTaskAction]);

  return (
    <div className={`mobile-task-manager bg-gray-50 min-h-screen ${className}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
            
            <div className="flex items-center space-x-2">
              {/* Online/Offline Indicator */}
              <div className={`flex items-center space-x-1 text-xs ${
                offlineState.isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {offlineState.isOnline ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                {!offlineState.isOnline && offlineState.pendingActions.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {offlineState.pendingActions.length} pending
                  </Badge>
                )}
              </div>
              
              <Button
                size="sm"
                onClick={() => onTaskAction('create', '')}
                className="h-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <Tabs 
          value={viewConfig.view} 
          onValueChange={(value) => setViewConfig(prev => ({ ...prev, view: value as any }))}
          className="w-full"
        >
          <TabsList className="w-full h-auto p-1 bg-gray-100">
            <TabsTrigger value="today" className="flex-1 text-xs py-2">
              <Calendar className="h-3 w-3 mr-1" />
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="flex-1 text-xs py-2">
              <Timer className="h-3 w-3 mr-1" />
              Week
            </TabsTrigger>
            <TabsTrigger value="priority" className="flex-1 text-xs py-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Priority
            </TabsTrigger>
            <TabsTrigger value="ai-suggestions" className="flex-1 text-xs py-2">
              <Zap className="h-3 w-3 mr-1" />
              AI
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Task List */}
      <div className="px-4 py-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'All caught up for now!'}
            </p>
            <Button onClick={() => onTaskAction('create', '')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <MobileTaskCard
                  key={task.id}
                  task={task}
                  aiScore={aiScores?.get(task.id)}
                  onAction={handleOfflineAction}
                  gestures={gestureHandlers}
                  compact={viewConfig.compactMode}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* Mobile Quick Actions Drawer */}
      <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
        <DrawerContent className="max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>Task Actions</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => {
                  selectedTaskId && handleOfflineAction('complete', selectedTaskId);
                  setShowDrawer(false);
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete
              </Button>
              
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => {
                  selectedTaskId && handleOfflineAction('edit', selectedTaskId);
                  setShowDrawer(false);
                }}
              >
                <Star className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => {
                  selectedTaskId && handleOfflineAction('defer', selectedTaskId);
                  setShowDrawer(false);
                }}
              >
                <Timer className="h-4 w-4 mr-2" />
                Defer
              </Button>
              
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => {
                  selectedTaskId && handleOfflineAction('assign', selectedTaskId);
                  setShowDrawer(false);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileTaskManager;