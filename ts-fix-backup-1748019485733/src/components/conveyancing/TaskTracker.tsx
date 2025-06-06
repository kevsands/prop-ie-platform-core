'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export interface Task {
  id: string;
  caseId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  category: 'searches' | 'contracts' | 'enquiries' | 'documentation' | 'compliance';
}

export function TaskTracker() {
  const [taskssetTasks] = useState<Task[]>([]);
  const [filterCategorysetFilterCategory] = useState<string>('all');

  const filteredTasks = tasks.filter(task => 
    filterCategory === 'all' || task.category === filterCategory
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />\n  );
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />\n  );
      default:
        return <Clock className="h-4 w-4 text-gray-500" />\n  );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Tracker</h1>
        <Button variant="default">Add Task</Button>
      </div>

      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded-lg"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="searches">Searches</option>
          <option value="contracts">Contracts</option>
          <option value="enquiries">Enquiries</option>
          <option value="documentation">Documentation</option>
          <option value="compliance">Compliance</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <Badge variant="outline">{task.category}</Badge>
                    <span>Assigned to: {task.assignedTo}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                  {task.priority}
                </Badge>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}