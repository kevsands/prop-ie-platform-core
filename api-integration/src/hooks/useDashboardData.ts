"use client";

import { useState, useEffect } from 'react';
import { mockTasks, mockAlerts, TaskItem, AlertItem } from '@/lib/mock';

// Custom hook for fetching dashboard data
export function useDashboardData() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In production, these would be API calls
        // Use setTimeout to simulate network delay
        setTimeout(() => {
          setTasks(mockTasks);
          setAlerts(mockAlerts);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions for tasks
  const getPendingTasks = () => tasks.filter(task => task.status === 'pending');
  const getInProgressTasks = () => tasks.filter(task => task.status === 'in_progress');
  const getCompletedTasks = () => tasks.filter(task => task.status === 'completed');
  const getHighPriorityTasks = () => tasks.filter(task => task.priority === 'high');

  // Helper functions for alerts
  const getUnreadAlerts = () => alerts.filter(alert => !alert.isRead);
  const getCriticalAlerts = () => alerts.filter(alert => alert.severity === 'critical');

  // Date utility functions
  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3; // Due within next 3 days
  };

  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  // Mark an alert as read
  const markAlertAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  // Update task status
  const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return {
    tasks,
    alerts,
    isLoading,
    error,
    getPendingTasks,
    getInProgressTasks,
    getCompletedTasks,
    getHighPriorityTasks,
    getUnreadAlerts,
    getCriticalAlerts,
    isDueSoon,
    isOverdue,
    markAlertAsRead,
    updateTaskStatus
  };
}

// Re-export the types for use in components
export type { TaskItem, AlertItem };