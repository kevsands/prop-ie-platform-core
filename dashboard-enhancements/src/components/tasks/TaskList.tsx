'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface TaskListProps {
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
}

export default function TaskList({ tasks = [], onTaskClick }: TaskListProps) {
  const defaultTasks: Task[] = [
    {
      id: '1',
      title: 'Complete mortgage application',
      description: 'Submit all required documents to bank',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Schedule property viewing',
      description: 'Fitzgerald Gardens - Unit 12',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Review purchase agreement',
      description: 'Review terms with solicitor',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority?: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onTaskClick?.(task)}
            >
              {getStatusIcon(task.status)}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  {task.priority && (
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due: {task.dueDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}