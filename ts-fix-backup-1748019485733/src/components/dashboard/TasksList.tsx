"use client";

import React, { useState } from 'react';
import { TaskItem } from '@/hooks/useDashboardData';
import { format, parseISO } from 'date-fns';

interface TasksListProps {
  tasks: TaskItem[];
  isDueSoon: (dueDate: string) => boolean;
  isOverdue: (dueDate: string) => boolean;
  updateTaskStatus?: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  limit?: number;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  isDueSoon,
  isOverdue,
  updateTaskStatus,
  limit = 5
}) => {
  const [selectedStatussetSelectedStatus] = useState<string>('all');

  // Filter tasks based on selected status
  const filteredTasks = selectedStatus === 'all'
    ? tasks
    : tasks.filter(task => task.status === selectedStatus);

  // Sort tasks by priority (high first) and then by due date (soonest first)
  const sortedTasks = [...filteredTasks].sort((ab) => {
    // First sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDiff !== 0) return priorityDiff;

    // Then sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Limit the number of tasks shown
  const displayedTasks = sortedTasks.slice(0limit);

  // Format the due date for display
  const formatDueDate = (dueDate: string) => {
    try {
      return format(parseISO(dueDate), 'MMM d, yyyy');
    } catch (error) {

      return dueDate;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>

        <div className="flex space-x-1">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-2 py-1 text-xs rounded-md ${
              selectedStatus === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-2 py-1 text-xs rounded-md ${
              selectedStatus === 'pending' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus('in_progress')}
            className={`px-2 py-1 text-xs rounded-md ${
              selectedStatus === 'in_progress' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-2 py-1 text-xs rounded-md ${
              selectedStatus === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {displayedTasks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No tasks found.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayedTasks.map((task) => (
            <li 
              key={task.id} 
              className={`border rounded-md p-3 ${
                task.status === 'completed' 
                  ? 'bg-gray-50 border-gray-200' 
                  : isOverdue(task.dueDate) 
                    ? 'bg-red-50 border-red-200' 
                    : isDueSoon(task.dueDate) 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span 
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        task.priority === 'high' 
                          ? 'bg-red-500' 
                          : task.priority === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                    />
                    <h4 className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </h4>
                  </div>

                  {task.description && (
                    <p className={`mt-1 text-sm ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}

                  <div className={`mt-2 text-sm flex items-center ${
                    isOverdue(task.dueDate) && task.status !== 'completed' 
                      ? 'text-red-600' 
                      : isDueSoon(task.dueDate) && task.status !== 'completed' 
                        ? 'text-yellow-600' 
                        : 'text-gray-500'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDueDate(task.dueDate)}</span>
                    {isOverdue(task.dueDate) && task.status !== 'completed' && (
                      <span className="ml-2 text-red-600 font-medium">Overdue</span>
                    )}
                    {isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && task.status !== 'completed' && (
                      <span className="ml-2 text-yellow-600 font-medium">Due Soon</span>
                    )}
                  </div>
                </div>

                {updateTaskStatus && (
                  <div className="ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as 'pending' | 'in_progress' | 'completed')}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {tasks.length> limit && (
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
            View all {tasks.length} tasks
          </a>
        </div>
      )}
    </div>
  );
};

export default TasksList;