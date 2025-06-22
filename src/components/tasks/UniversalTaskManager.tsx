'use client';

/**
 * Universal Task Manager Component
 * 
 * Comprehensive task management interface supporting 3,329+ granular tasks
 * with progressive disclosure, persona-specific views, and real-time coordination.
 * 
 * Integrates with existing TaskOrchestrationEngine and enterprise infrastructure.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskComplexityLevel,
  TaskCategory,
  TaskViewType,
  TaskOrchestrationContext
} from '@/types/task/universal-task';
import { FilteredTaskView, progressiveDisclosureService } from '@/services/ProgressiveDisclosureService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import GanttChart from './GanttChart';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  MoreVertical,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  Star,
  MessageSquare,
  Paperclip,
  Play,
  Pause,
  CheckSquare,
  X
} from 'lucide-react';

/**
 * Component props
 */
interface UniversalTaskManagerProps {
  initialTasks?: Task[];
  contextOverride?: Partial<TaskOrchestrationContext>;
  defaultViewType?: TaskViewType;
  enableRealTimeUpdates?: boolean;
  showAnalytics?: boolean;
  className?: string;
}

/**
 * Main UniversalTaskManager Component
 */
export default function UniversalTaskManager({
  initialTasks = [],
  contextOverride,
  defaultViewType,
  enableRealTimeUpdates = true,
  showAnalytics = true,
  className = ''
}: UniversalTaskManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // State management
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filteredView, setFilteredView] = useState<FilteredTaskView | null>(null);
  const [currentViewType, setCurrentViewType] = useState<TaskViewType>(
    defaultViewType || TaskViewType.MILESTONE
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // User context
  const context: TaskOrchestrationContext = useMemo(() => ({
    userId: user?.id || 'anonymous',
    userRole: (user?.roles?.[0] as UserRole) || UserRole.BUYER,
    transactionStage: 'active',
    workloadCapacity: 70,
    skillLevel: 'intermediate',
    availableHours: 40,
    preferredComplexity: TaskComplexityLevel.MODERATE,
    collaborationPreference: 'collaborative',
    ...contextOverride
  }), [user, contextOverride]);

  // Available view types for current persona
  const availableViewTypes = useMemo(() => {
    return progressiveDisclosureService.getAvailableViewTypes(context.userRole);
  }, [context.userRole]);

  // Load and filter tasks
  const loadTaskView = useCallback(async () => {
    setIsLoading(true);
    try {
      const view = await progressiveDisclosureService.getFilteredTaskView(
        tasks,
        context,
        currentViewType
      );
      setFilteredView(view);
    } catch (error) {
      console.error('Error loading task view:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [tasks, context, currentViewType, toast]);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    if (!filteredView) return [];

    let filtered = filteredView.visibleTasks;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Completed tasks filter
    if (!showCompleted) {
      filtered = filtered.filter(task => task.status !== TaskStatus.COMPLETED);
    }

    return filtered;
  }, [filteredView, searchQuery, selectedCategory, selectedStatus, selectedPriority, showCompleted]);

  // Load tasks on mount and when context changes
  useEffect(() => {
    loadTaskView();
  }, [loadTaskView]);

  // Real-time updates (placeholder for WebSocket integration)
  useEffect(() => {
    if (!enableRealTimeUpdates) return;

    // Here we would set up WebSocket listeners for real-time task updates
    // For now, we'll simulate with a periodic refresh
    const interval = setInterval(loadTaskView, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [enableRealTimeUpdates, loadTaskView]);

  /**
   * Task action handlers
   */
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleStatusChange = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Update task status locally
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task
      ));

      // Here we would call the UniversalTaskManager service
      toast({
        title: 'Task Updated',
        description: `Task status changed to ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const handlePriorityChange = useCallback(async (taskId: string, newPriority: TaskPriority) => {
    try {
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, priority: newPriority, updatedAt: new Date() } : task
      ));

      toast({
        title: 'Task Updated',
        description: `Task priority changed to ${newPriority.toLowerCase()}`,
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task priority',
        variant: 'destructive'
      });
    }
  }, [toast]);

  /**
   * Helper functions
   */
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case TaskStatus.BLOCKED:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case TaskStatus.WAITING_APPROVAL:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return 'bg-red-500 text-white';
      case TaskPriority.HIGH:
        return 'bg-orange-500 text-white';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-500 text-black';
      case TaskPriority.LOW:
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getComplexityIndicator = (complexity: TaskComplexityLevel) => {
    const dots = {
      [TaskComplexityLevel.SIMPLE]: 1,
      [TaskComplexityLevel.MODERATE]: 2,
      [TaskComplexityLevel.COMPLEX]: 3,
      [TaskComplexityLevel.EXPERT]: 4
    };

    return (
      <div className="flex space-x-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i < dots[complexity] ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading && !filteredView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`universal-task-manager ${className}`}>
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
            <p className="text-gray-600">
              {filteredView?.progressSummary.totalTasks || 0} tasks •{' '}
              {Math.round(filteredView?.progressSummary.progressPercentage || 0)}% complete
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* View Type Selector */}
            <Select value={currentViewType} onValueChange={(value) => setCurrentViewType(value as TaskViewType)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableViewTypes.map(viewType => (
                  <SelectItem key={viewType} value={viewType}>
                    {viewType.replace('_', ' ').toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Progress Overview */}
        {filteredView && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold">{filteredView.progressSummary.totalTasks}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{filteredView.progressSummary.completedTasks}</p>
                  </div>
                  <CheckSquare className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{filteredView.progressSummary.inProgressTasks}</p>
                  </div>
                  <Play className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Blocked</p>
                    <p className="text-2xl font-bold text-red-600">{filteredView.progressSummary.blockedTasks}</p>
                  </div>
                  <Pause className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        {filteredView && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(filteredView.progressSummary.progressPercentage)}%
              </span>
            </div>
            <Progress value={filteredView.progressSummary.progressPercentage} className="w-full" />
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TaskCategory | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(TaskCategory).map(category => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, ' ').toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as TaskStatus | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(TaskStatus).map(status => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, ' ').toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as TaskPriority | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {Object.values(TaskPriority).map(priority => (
              <SelectItem key={priority} value={priority}>
                {priority.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center space-x-2"
        >
          {showCompleted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showCompleted ? 'Hide' : 'Show'} Completed</span>
        </Button>
      </div>

      {/* Recommendations */}
      {filteredView?.recommendedActions && filteredView.recommendedActions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
          <div className="space-y-2">
            {filteredView.recommendedActions.map((action, index) => (
              <Alert key={index} className={`border-l-4 ${
                action.priority === TaskPriority.CRITICAL ? 'border-l-red-500' :
                action.priority === TaskPriority.HIGH ? 'border-l-orange-500' :
                'border-l-blue-500'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="capitalize">{action.type.replace(/_/g, ' ')}</AlertTitle>
                <AlertDescription>{action.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Task List/Grid/Gantt */}
      <div className="space-y-4">
        {currentViewType === TaskViewType.GANTT ? (
          // Enterprise Gantt Chart View
          <GanttChart
            tasks={filteredTasks}
            context={context}
            onTaskUpdate={(taskId, updates) => {
              setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
              ));
            }}
            onTaskClick={handleTaskClick}
            showPersonaLanes={true}
            allowDragDrop={context.userRole !== UserRole.BUYER}
            height={600}
            className="border rounded-lg"
          />
        ) : currentViewType === TaskViewType.MILESTONE && filteredView?.milestones ? (
          // Milestone View
          <div className="space-y-6">
            {filteredView.milestones.map(milestone => {
              const milestoneTasks = filteredTasks.filter(task => task.milestoneId === milestone.id);
              return (
                <Card key={milestone.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <CardDescription>{milestone.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(milestone.progressPercentage)}%</div>
                        <div className="text-sm text-gray-600">{milestoneTasks.length} tasks</div>
                      </div>
                    </div>
                    <Progress value={milestone.progressPercentage} className="mt-4" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-3">
                      {milestoneTasks.slice(0, 5).map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => handleTaskClick(task)}
                          onStatusChange={handleStatusChange}
                          onPriorityChange={handlePriorityChange}
                          getStatusIcon={getStatusIcon}
                          getPriorityColor={getPriorityColor}
                          getComplexityIndicator={getComplexityIndicator}
                          showComplexity={context.userRole !== UserRole.BUYER}
                        />
                      ))}
                      {milestoneTasks.length > 5 && (
                        <Button variant="ghost" className="w-full">
                          Show {milestoneTasks.length - 5} more tasks
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // List/Grid View
          <div className="grid gap-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task)}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                getStatusIcon={getStatusIcon}
                getPriorityColor={getPriorityColor}
                getComplexityIndicator={getComplexityIndicator}
                showComplexity={context.userRole !== UserRole.BUYER}
                expanded={currentViewType === TaskViewType.PROFESSIONAL}
              />
            ))}
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Hidden tasks indicator */}
      {filteredView && filteredView.hiddenTaskCount > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Show {filteredView.hiddenTaskCount} hidden tasks</span>
          </Button>
        </div>
      )}

      {/* Task Detail Sheet */}
      {selectedTask && (
        <TaskDetailSheet
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          getStatusIcon={getStatusIcon}
          getPriorityColor={getPriorityColor}
        />
      )}
    </div>
  );
}

/**
 * Individual Task Card Component
 */
interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
  getStatusIcon: (status: TaskStatus) => React.ReactNode;
  getPriorityColor: (priority: TaskPriority) => string;
  getComplexityIndicator: (complexity: TaskComplexityLevel) => React.ReactNode;
  showComplexity?: boolean;
  expanded?: boolean;
}

function TaskCard({
  task,
  onClick,
  onStatusChange,
  onPriorityChange,
  getStatusIcon,
  getPriorityColor,
  getComplexityIndicator,
  showComplexity = true,
  expanded = false
}: TaskCardProps) {
  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.COMPLETED;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isOverdue ? 'border-red-200 bg-red-50' : ''
      } ${task.priority === TaskPriority.CRITICAL ? 'border-red-300' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(task.status)}
              <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>
              {showComplexity && (
                <div className="flex items-center space-x-1">
                  {getComplexityIndicator(task.complexityLevel)}
                </div>
              )}
            </div>

            {expanded && (
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      {task.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                )}

                {task.collaborators && task.collaborators.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{task.collaborators.length}</span>
                  </div>
                )}

                {task.commentCount > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MessageSquare className="h-3 w-3" />
                    <span>{task.commentCount}</span>
                  </div>
                )}

                {task.attachmentCount > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Paperclip className="h-3 w-3" />
                    <span>{task.attachmentCount}</span>
                  </div>
                )}
              </div>

              {task.progressPercentage > 0 && (
                <div className="flex items-center space-x-2">
                  <Progress value={task.progressPercentage} className="w-16 h-2" />
                  <span className="text-xs text-gray-600">{Math.round(task.progressPercentage)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Task Detail Sheet Component
 */
interface TaskDetailSheetProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
  getStatusIcon: (status: TaskStatus) => React.ReactNode;
  getPriorityColor: (priority: TaskPriority) => string;
}

function TaskDetailSheet({
  task,
  isOpen,
  onClose,
  onStatusChange,
  onPriorityChange,
  getStatusIcon,
  getPriorityColor
}: TaskDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(task.status)}
              <SheetTitle className="text-lg">{task.title}</SheetTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            Task ID: {task.id}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, ' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
              <Select value={task.priority} onValueChange={(value) => onPriorityChange(task.id, value as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskPriority).map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">{task.description}</p>
            </div>
          </div>

          {/* Progress */}
          {task.progressPercentage > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Progress</label>
              <div className="space-y-2">
                <Progress value={task.progressPercentage} />
                <p className="text-sm text-gray-600">{Math.round(task.progressPercentage)}% complete</p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {task.dueDate && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Due Date</label>
                <p className="text-sm text-gray-900">{task.dueDate.toLocaleDateString()}</p>
              </div>
            )}
            {task.actualStart && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Started</label>
                <p className="text-sm text-gray-900">{task.actualStart.toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Category and Complexity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Badge variant="outline">{task.category.replace(/_/g, ' ')}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Complexity</label>
              <Badge variant="outline">{task.complexityLevel}</Badge>
            </div>
          </div>

          {/* Compliance Flags */}
          {(task.isRegulatory || task.isLegalRequirement) && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Compliance</label>
              <div className="space-y-1">
                {task.isRegulatory && (
                  <Badge variant="destructive" className="mr-2">Regulatory</Badge>
                )}
                {task.isLegalRequirement && (
                  <Badge variant="destructive" className="mr-2">Legal Requirement</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}