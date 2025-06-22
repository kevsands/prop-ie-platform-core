/**
 * Universal Tasks Hook
 * 
 * React hook that integrates the new Universal Task Management system
 * with the existing TaskOrchestrationEngine and provides a unified
 * interface for task operations across all personas.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserRole } from '@prisma/client';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskComplexityLevel,
  TaskCategory,
  TaskViewType,
  TaskOrchestrationContext,
  TaskTemplate
} from '@/types/task/universal-task';
import { FilteredTaskView, progressiveDisclosureService } from '@/services/ProgressiveDisclosureService';
import { createUniversalTaskManager } from '@/services/UniversalTaskManager';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

/**
 * Hook options
 */
interface UseUniversalTasksOptions {
  transactionId?: string;
  projectId?: string;
  propertyId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
  defaultViewType?: TaskViewType;
  contextOverride?: Partial<TaskOrchestrationContext>;
}

/**
 * Hook return type
 */
interface UseUniversalTasksReturn {
  // Data
  tasks: Task[];
  filteredView: FilteredTaskView | null;
  templates: TaskTemplate[];
  
  // State
  loading: boolean;
  error: string | null;
  context: TaskOrchestrationContext;
  
  // View management
  currentViewType: TaskViewType;
  availableViewTypes: TaskViewType[];
  setViewType: (viewType: TaskViewType) => void;
  
  // Task operations
  createTask: (taskData: Partial<Task>, options?: any) => Promise<{ success: boolean; taskId?: string; error?: string }>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  completeTask: (taskId: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  
  // Bulk operations
  bulkUpdateStatus: (taskIds: string[], status: TaskStatus) => Promise<{ success: boolean; error?: string }>;
  bulkAssign: (taskIds: string[], assigneeId: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  bulkPrioritize: (taskIds: string[], priority: TaskPriority) => Promise<{ success: boolean; error?: string }>;
  
  // Search and filtering
  searchTasks: (query: string) => Promise<Task[]>;
  filterTasks: (filters: TaskFilters) => Task[];
  
  // Analytics and insights
  getTaskAnalytics: (taskId: string) => Promise<any>;
  getProgress: () => ProgressSummary;
  getBottlenecks: () => Task[];
  getRecommendations: () => any[];
  
  // Utilities
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Task filters
 */
interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  complexity?: TaskComplexityLevel[];
  assignedTo?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  isOverdue?: boolean;
  hasBlockers?: boolean;
}

/**
 * Progress summary
 */
interface ProgressSummary {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  overdue: number;
  percentage: number;
  estimatedCompletion: Date;
}

/**
 * Main hook implementation
 */
export function useUniversalTasks(options: UseUniversalTasksOptions = {}): UseUniversalTasksReturn {
  const {
    transactionId,
    projectId,
    propertyId,
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    enableRealTime = true,
    defaultViewType = TaskViewType.MILESTONE,
    contextOverride = {}
  } = options;

  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredView, setFilteredView] = useState<FilteredTaskView | null>(null);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentViewType, setCurrentViewType] = useState<TaskViewType>(defaultViewType);

  // Build user context
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

  // Get available view types for current persona
  const availableViewTypes = useMemo(() => {
    return progressiveDisclosureService.getAvailableViewTypes(context.userRole);
  }, [context.userRole]);

  // Task manager instance (would be injected in real implementation)
  const taskManager = useMemo(() => {
    // In real implementation, this would be injected via dependency injection
    // return createUniversalTaskManager(prismaClient);
    return null;
  }, []);

  /**
   * Load tasks and apply progressive disclosure
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // In real implementation, this would call the task manager
      // const tasksData = await taskManager.getTaskView(context, currentViewType, {
      //   transactionId,
      //   projectId,
      //   propertyId
      // });

      // For now, generate sample tasks
      const sampleTasks = generateSampleTasks(context);
      setTasks(sampleTasks);

      // Apply progressive disclosure
      const view = await progressiveDisclosureService.getFilteredTaskView(
        sampleTasks,
        context,
        currentViewType
      );
      setFilteredView(view);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [context, currentViewType, transactionId, projectId, propertyId, toast]);

  /**
   * Task operations
   */
  const createTask = useCallback(async (taskData: Partial<Task>, creationOptions: any = {}) => {
    try {
      // In real implementation, call task manager
      // return await taskManager.createTask(taskData, context, creationOptions);

      // Simulate task creation
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: taskData.title || 'New Task',
        description: taskData.description || '',
        category: taskData.category || TaskCategory.DOCUMENTATION,
        complexityLevel: taskData.complexityLevel || TaskComplexityLevel.SIMPLE,
        viewType: TaskViewType.DETAILED,
        status: TaskStatus.NOT_STARTED,
        priority: taskData.priority || TaskPriority.MEDIUM,
        targetPersonas: taskData.targetPersonas || [context.userRole],
        assignedTo: taskData.assignedTo || context.userId,
        assignedRole: taskData.assignedRole || context.userRole,
        createdAt: new Date(),
        updatedAt: new Date(),
        progressPercentage: 0,
        automationLevel: 'MANUAL',
        commentCount: 0,
        attachmentCount: 0,
        isRegulatory: taskData.isRegulatory || false,
        isLegalRequirement: taskData.isLegalRequirement || false,
        isTimeDependent: taskData.isTimeDependent || false,
        complianceChecked: false,
        isVisible: true,
        isExpanded: false,
        ...taskData
      };

      setTasks(prev => [...prev, newTask]);
      
      toast({
        title: 'Success',
        description: 'Task created successfully'
      });

      return { success: true, taskId: newTask.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      return { success: false, error: errorMessage };
    }
  }, [context, toast]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      // In real implementation, call task manager
      // return await taskManager.updateTask(taskId, updates, context);

      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      ));

      toast({
        title: 'Success',
        description: 'Task updated successfully'
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully'
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  const completeTask = useCallback(async (taskId: string, notes?: string) => {
    return updateTask(taskId, {
      status: TaskStatus.COMPLETED,
      progressPercentage: 100,
      actualEnd: new Date(),
      userNotes: notes
    });
  }, [updateTask]);

  /**
   * Bulk operations
   */
  const bulkUpdateStatus = useCallback(async (taskIds: string[], status: TaskStatus) => {
    try {
      setTasks(prev => prev.map(task =>
        taskIds.includes(task.id) ? { ...task, status, updatedAt: new Date() } : task
      ));

      toast({
        title: 'Success',
        description: `Updated ${taskIds.length} tasks`
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tasks';
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  const bulkAssign = useCallback(async (taskIds: string[], assigneeId: string, role?: UserRole) => {
    try {
      setTasks(prev => prev.map(task =>
        taskIds.includes(task.id) ? { 
          ...task, 
          assignedTo: assigneeId, 
          assignedRole: role || task.assignedRole,
          updatedAt: new Date() 
        } : task
      ));

      toast({
        title: 'Success',
        description: `Assigned ${taskIds.length} tasks`
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign tasks';
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  const bulkPrioritize = useCallback(async (taskIds: string[], priority: TaskPriority) => {
    try {
      setTasks(prev => prev.map(task =>
        taskIds.includes(task.id) ? { ...task, priority, updatedAt: new Date() } : task
      ));

      toast({
        title: 'Success',
        description: `Updated priority for ${taskIds.length} tasks`
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task priorities';
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  /**
   * Search and filtering
   */
  const searchTasks = useCallback(async (query: string): Promise<Task[]> => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [tasks]);

  const filterTasks = useCallback((filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
      if (filters.status && !filters.status.includes(task.status)) return false;
      if (filters.priority && !filters.priority.includes(task.priority)) return false;
      if (filters.category && !filters.category.includes(task.category)) return false;
      if (filters.complexity && !filters.complexity.includes(task.complexityLevel)) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      
      if (filters.dueDate) {
        if (filters.dueDate.from && task.dueDate && task.dueDate < filters.dueDate.from) return false;
        if (filters.dueDate.to && task.dueDate && task.dueDate > filters.dueDate.to) return false;
      }
      
      if (filters.isOverdue && task.dueDate) {
        const isOverdue = task.dueDate < new Date() && task.status !== TaskStatus.COMPLETED;
        if (!isOverdue) return false;
      }
      
      if (filters.hasBlockers && (!task.blockedBy || task.blockedBy.length === 0)) return false;
      
      return true;
    });
  }, [tasks]);

  /**
   * Analytics and insights
   */
  const getTaskAnalytics = useCallback(async (taskId: string) => {
    // In real implementation, call task manager
    // return await taskManager.getTaskAnalytics(taskId);
    return null;
  }, []);

  const getProgress = useCallback((): ProgressSummary => {
    const now = new Date();
    const completed = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const inProgress = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const blocked = tasks.filter(task => task.status === TaskStatus.BLOCKED).length;
    const overdue = tasks.filter(task => 
      task.dueDate && task.dueDate < now && task.status !== TaskStatus.COMPLETED
    ).length;

    const percentage = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
    
    // Estimate completion date based on progress
    const remainingTasks = tasks.length - completed;
    const avgDaysPerTask = 2; // Estimate
    const estimatedCompletion = new Date(now.getTime() + (remainingTasks * avgDaysPerTask * 24 * 60 * 60 * 1000));

    return {
      total: tasks.length,
      completed,
      inProgress,
      blocked,
      overdue,
      percentage,
      estimatedCompletion
    };
  }, [tasks]);

  const getBottlenecks = useCallback((): Task[] => {
    return tasks.filter(task => 
      task.status === TaskStatus.BLOCKED ||
      (task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.COMPLETED) ||
      task.priority === TaskPriority.CRITICAL
    );
  }, [tasks]);

  const getRecommendations = useCallback(() => {
    return filteredView?.recommendedActions || [];
  }, [filteredView]);

  /**
   * Utilities
   */
  const refresh = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  const reset = useCallback(() => {
    setTasks([]);
    setFilteredView(null);
    setError(null);
  }, []);

  const setViewType = useCallback((viewType: TaskViewType) => {
    if (availableViewTypes.includes(viewType)) {
      setCurrentViewType(viewType);
    }
  }, [availableViewTypes]);

  // Load tasks on mount and when dependencies change
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Update filtered view when tasks or view type changes
  useEffect(() => {
    if (tasks.length > 0) {
      progressiveDisclosureService.getFilteredTaskView(tasks, context, currentViewType)
        .then(setFilteredView)
        .catch(err => setError(err.message));
    }
  }, [tasks, context, currentViewType]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  // Real-time updates (placeholder)
  useEffect(() => {
    if (!enableRealTime) return;

    // Here we would set up WebSocket listeners for real-time updates
    // For now, this is a placeholder
    
    return () => {
      // Cleanup WebSocket listeners
    };
  }, [enableRealTime]);

  return {
    // Data
    tasks,
    filteredView,
    templates,
    
    // State
    loading,
    error,
    context,
    
    // View management
    currentViewType,
    availableViewTypes,
    setViewType,
    
    // Task operations
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    
    // Bulk operations
    bulkUpdateStatus,
    bulkAssign,
    bulkPrioritize,
    
    // Search and filtering
    searchTasks,
    filterTasks,
    
    // Analytics and insights
    getTaskAnalytics,
    getProgress,
    getBottlenecks,
    getRecommendations,
    
    // Utilities
    refresh,
    reset
  };
}

/**
 * Generate sample tasks for demonstration
 */
function generateSampleTasks(context: TaskOrchestrationContext): Task[] {
  const sampleTasks: Task[] = [
    {
      id: 'task_1',
      title: 'Complete mortgage application',
      description: 'Submit all required documents to the lender for mortgage approval',
      category: TaskCategory.BUYER_FINANCING,
      complexityLevel: TaskComplexityLevel.MODERATE,
      viewType: TaskViewType.DETAILED,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      targetPersonas: [UserRole.BUYER],
      assignedTo: context.userId,
      assignedRole: UserRole.BUYER,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progressPercentage: 60,
      automationLevel: 'SEMI_AUTOMATED',
      commentCount: 3,
      attachmentCount: 5,
      isRegulatory: true,
      isLegalRequirement: false,
      isTimeDependent: true,
      complianceChecked: false,
      isVisible: true,
      isExpanded: false,
      milestoneId: 'financing'
    },
    {
      id: 'task_2',
      title: 'Schedule property viewing',
      description: 'Arrange viewing appointment with estate agent',
      category: TaskCategory.BUYER_SEARCHING,
      complexityLevel: TaskComplexityLevel.SIMPLE,
      viewType: TaskViewType.MILESTONE,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      targetPersonas: [UserRole.BUYER, UserRole.AGENT],
      assignedTo: context.userId,
      assignedRole: UserRole.BUYER,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      actualStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      actualEnd: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      progressPercentage: 100,
      automationLevel: 'MANUAL',
      commentCount: 1,
      attachmentCount: 0,
      isRegulatory: false,
      isLegalRequirement: false,
      isTimeDependent: true,
      complianceChecked: true,
      isVisible: true,
      isExpanded: false,
      milestoneId: 'searching'
    },
    {
      id: 'task_3',
      title: 'Legal searches and surveys',
      description: 'Complete all required legal searches and property surveys',
      category: TaskCategory.SOLICITOR_SEARCHES,
      complexityLevel: TaskComplexityLevel.EXPERT,
      viewType: TaskViewType.PROFESSIONAL,
      status: TaskStatus.PENDING,
      priority: TaskPriority.CRITICAL,
      targetPersonas: [UserRole.SOLICITOR],
      assignedRole: UserRole.SOLICITOR,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      progressPercentage: 0,
      automationLevel: 'MANUAL',
      commentCount: 0,
      attachmentCount: 0,
      isRegulatory: true,
      isLegalRequirement: true,
      isTimeDependent: true,
      complianceChecked: false,
      isVisible: true,
      isExpanded: false,
      milestoneId: 'legal_financial'
    }
  ];

  return sampleTasks;
}