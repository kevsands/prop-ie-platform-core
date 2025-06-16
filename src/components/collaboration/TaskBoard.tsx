"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Flag, MessageSquare, Plus, MoreHorizontal } from 'lucide-react';
import { DialogTask } from '@/types/collaboration';
import { collaborationService } from '@/lib/collaboration';

interface TaskBoardProps {
  projectId: string;
}

interface TaskColumn {
  id: string;
  title: string;
  tasks: DialogTask[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [columnssetColumns] = useState<TaskColumn[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in_progress', title: 'In Progress', tasks: [] },
    { id: 'in_review', title: 'In Review', tasks: [] },
    { id: 'completed', title: 'Completed', tasks: [] }
  ]);
  const [loadingsetLoading] = useState(true);
  const [selectedTasksetSelectedTask] = useState<DialogTask | null>(null);
  const [createTaskOpensetCreateTaskOpen] = useState(false);
  const [draggedTasksetDraggedTask] = useState<DialogTask | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await collaborationService.getTasks(projectId);

      // Group tasks by status
      const grouped = columns.map(column => ({
        ...column,
        tasks: tasksData.filter((task: any) => task.status === column.id)
      }));

      setColumns(grouped);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (task: DialogTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      // Update task status
      await collaborationService.updateTask(draggedTask.id, { status: columnId });

      // Update local state
      setColumns(prevColumns => {
        const newColumns = prevColumns.map(column => ({
          ...column,
          tasks: column.tasks.filter((task: any) => task.id !== draggedTask.id)
        }));

        const targetColumn = newColumns.find(col => col.id === columnId);
        if (targetColumn) {
          targetColumn.tasks.push({ ...draggedTask, status: columnId });
        }

        return newColumns;
      });
    } catch (error) {

    }

    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'warning';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  const createNewTask = async (taskData: Partial<DialogTask>) => {
    try {
      await collaborationService.createTask({
        ...taskData,
        projectId
      } as Omit<DialogTask, 'id' | 'createdAt' | 'updatedAt'>);

      fetchTasks();
      setCreateTaskOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <Button onClick={() => setCreateTaskOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column: any) => (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e: any) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">{column.title}</h3>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task: any) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{task.name}</h4>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={getPriorityColor(task.priority)}
                            className="text-xs"
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.assignedTo?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        {task.comments?.length> 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {task.comments.length}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the project board
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e: any) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            createNewTask({
              name: formData.get('name') as string,
              description: formData.get('description') as string,
              priority: formData.get('priority') as string,
              assignedTo: formData.get('assignedTo') as string,
              dueDate: formData.get('dueDate') as string,
              status: 'todo'
            });
          }>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Task Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Input id="assignedTo" name="assignedTo" placeholder="Username or email" />
              </div>
              <Button type="submit" className="w-full">Create Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTask.name}</DialogTitle>
              <DialogDescription>
                Created on {new Date(selectedTask.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedTask.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge>{selectedTask.status.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Priority</h4>
                  <Badge variant={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Assigned To</h4>
                  <p>{selectedTask.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Due Date</h4>
                  <p>{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Comments</h4>
                <div className="space-y-3">
                  {selectedTask.comments?.map((comment: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm">{comment}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input placeholder="Add a comment..." />
                    <Button>Add</Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};