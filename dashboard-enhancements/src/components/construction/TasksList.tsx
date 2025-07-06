'use client';

// components/construction/TasksList.tsx
import React from 'react';
import Link from 'next/link';
import { FiAlertCircle, FiCheck, FiClock, FiUser } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  assignedToName?: string;
}

interface TasksListProps {
  tasks: Task[];
  orgSlug: string;
  showProject?: boolean;
  listType?: 'full' | 'compact';
  emptyMessage?: string;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

const StatusIcon: Record<string, IconType> = {
  pending: FiClock,
  'in-progress': FiUser,
  completed: FiCheck,
  delayed: FiAlertCircle
};

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  orgSlug, 
  showProject = true,
  listType = 'full',
  emptyMessage = 'No tasks found',
  onStatusChange
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string): JSX.Element | null => {
    const Icon = StatusIcon[status];
    if (!Icon) return null;
    return Icon({ className: "h-4 w-4", "aria-hidden": "true" });
  };
  
  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    return dueDate < now;
  };
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  if (listType === 'compact') {
    return (
      <div className="space-y-1">
        {tasks.map(task => (
          <Link 
            key={task.id}
            href={`/${orgSlug}/projects/${task.projectSlug}/tasks/${task.id}`}
            className="block px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  task.status === 'completed' ? 'bg-green-500' : 
                  isOverdue(task) ? 'bg-red-500' : 
                  task.priority === 'high' ? 'bg-orange-500' : 
                  'bg-blue-500'
                }`}></span>
                <span className="font-medium text-gray-900 truncate">{task.title}</span>
              </div>
              <div className="flex items-center">
                {task.dueDate && (
                  <span className={`text-xs ${isOverdue(task) && task.status !== 'completed' ? 'text-red-600' : 'text-gray-500'}`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <li key={task.id} className="hover:bg-gray-50 transition-colors">
            <Link 
              href={`/${orgSlug}/projects/${task.projectSlug}/tasks/${task.id}`}
              className="block p-4"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  
                  {showProject && (
                    <p className="text-sm text-gray-500 mt-1">
                      Project: {task.projectName}
                    </p>
                  )}
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">
                        {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </span>
                    
                    {task.dueDate && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isOverdue(task) && task.status !== 'completed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isOverdue(task) && task.status !== 'completed' && (
                          StatusIcon.delayed({ className: "mr-1 h-4 w-4", "aria-hidden": "true" })
                        )}
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    
                    {task.assignedToName && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {StatusIcon['in-progress']({ className: "mr-1 h-4 w-4", "aria-hidden": "true" })}
                        {task.assignedToName}
                      </span>
                    )}
                  </div>
                </div>
                
                {onStatusChange && task.status !== 'completed' && (
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onStatusChange(task.id, 'completed');
                      }}
                      className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;