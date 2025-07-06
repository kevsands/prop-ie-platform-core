'use client';

import React, { useState, useEffect } from 'react';
import { RealTimeSyncDashboard } from '@/components/realtime/RealTimeSyncDashboard';
import { RealTimeSyncProvider } from '@/components/realtime/RealTimeSyncProvider';
import { RealTimeSyncIndicator } from '@/components/realtime/RealTimeSyncIndicator';
import { usePropertyUpdates, useTaskUpdates, usePaymentUpdates, useMessageUpdates } from '@/hooks/useRealTimeSync';
import {
  Users,
  Activity,
  MessageSquare,
  BarChart3,
  Home,
  Bell,
  Zap,
  Server,
  Globe,
  Monitor
} from 'lucide-react';

export default function RealTimeSyncPage() {
  const [selectedDemo, setSelectedDemo] = useState<'property' | 'task' | 'payment' | 'message'>('property');
  const [connectionStats, setConnectionStats] = useState<any>(null);

  // Demo user data
  const demoUser = {
    id: 'admin_001',
    role: 'admin',
    name: 'System Administrator'
  };

  // Fetch connection statistics
  useEffect(() => {
    fetchConnectionStats();
    const interval = setInterval(fetchConnectionStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchConnectionStats = async () => {
    try {
      const response = await fetch('/api/realtime', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch connection stats:', error);
    }
  };

  const triggerDemoEvent = async (eventType: string) => {
    const demoEvents = {
      property: {
        type: 'property_update',
        data: {
          propertyId: 'prop_001',
          updatedData: {
            price: 450000,
            status: 'available',
            viewingCount: 15
          },
          updatedBy: demoUser.id,
          timestamp: new Date().toISOString()
        }
      },
      task: {
        type: 'task_update',
        data: {
          taskId: 'task_001',
          status: 'completed',
          assignedTo: 'user_buyer_001',
          updatedBy: demoUser.id,
          milestone: 'financial_planning',
          timestamp: new Date().toISOString()
        }
      },
      payment: {
        type: 'payment_update',
        data: {
          transactionId: 'txn_001',
          paymentStatus: 'completed',
          amount: 15000,
          buyerId: 'user_buyer_001',
          propertyId: 'prop_001',
          timestamp: new Date().toISOString()
        }
      },
      message: {
        type: 'message_received',
        data: {
          conversationId: 'conv_001',
          messageId: 'msg_001',
          senderId: 'user_agent_001',
          content: 'Property viewing scheduled for tomorrow at 2pm',
          timestamp: new Date().toISOString()
        }
      }
    };

    try {
      await fetch('/api/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(demoEvents[eventType])
      });
    } catch (error) {
      console.error('Failed to trigger demo event:', error);
    }
  };

  return (
    <RealTimeSyncProvider userId={demoUser.id} userRole={demoUser.role}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap size={28} className="text-blue-600" />
                Real-Time Data Synchronization
              </h1>
              <p className="text-gray-600 mt-1">
                Live data sync across all portals - monitor connections, events, and system health
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <RealTimeSyncIndicator 
                userId={demoUser.id} 
                userRole={demoUser.role}
                showDetails={false}
                className="relative"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{demoUser.name}</p>
                <p className="text-xs text-gray-600 capitalize">{demoUser.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Statistics */}
        {connectionStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Connections</p>
                  <p className="text-2xl font-bold text-blue-900">{connectionStats.totalConnections}</p>
                </div>
                <Users size={24} className="text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Server Uptime</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Math.floor(connectionStats.serverUptime / 3600)}h
                  </p>
                </div>
                <Server size={24} className="text-green-600" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-800">Memory Usage</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {Math.round(connectionStats.memoryUsage.heapUsed / 1024 / 1024)}MB
                  </p>
                </div>
                <Monitor size={24} className="text-amber-600" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Object.values(connectionStats.activeSubscriptions).reduce((a: number, b: number) => a + b, 0)}
                  </p>
                </div>
                <Globe size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Demo Event Triggers */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Event Triggers</h2>
          <p className="text-gray-600 mb-4">
            Test real-time synchronization by triggering demo events. These will be broadcast to all connected clients.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => triggerDemoEvent('property')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Home size={20} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Property Update</p>
                <p className="text-sm text-gray-600">Trigger property change</p>
              </div>
            </button>

            <button
              onClick={() => triggerDemoEvent('task')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <Activity size={20} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Task Update</p>
                <p className="text-sm text-gray-600">Complete a task</p>
              </div>
            </button>

            <button
              onClick={() => triggerDemoEvent('payment')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors"
            >
              <BarChart3 size={20} className="text-amber-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Payment Update</p>
                <p className="text-sm text-gray-600">Process payment</p>
              </div>
            </button>

            <button
              onClick={() => triggerDemoEvent('message')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <MessageSquare size={20} className="text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">New Message</p>
                <p className="text-sm text-gray-600">Send message</p>
              </div>
            </button>
          </div>
        </div>

        {/* Connection Details by Role */}
        {connectionStats && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connections by Role</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(connectionStats.connectionsByRole).map(([role, count]) => (
                <div key={role} className="text-center p-3 border border-gray-200 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{count as number}</div>
                  <div className="text-sm text-gray-600 capitalize">{role}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <RealTimeSyncDashboard 
          userId={demoUser.id}
          userRole={demoUser.role}
        />

        {/* Live Event Monitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PropertyUpdateMonitor />
          <TaskUpdateMonitor />
          <PaymentUpdateMonitor />
          <MessageUpdateMonitor />
        </div>
      </div>
    </RealTimeSyncProvider>
  );
}

// Component monitors for different event types
function PropertyUpdateMonitor() {
  const { propertyData, lastUpdate, hasUpdates } = usePropertyUpdates();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Home size={16} className="text-blue-600" />
        <h3 className="font-medium text-gray-900">Property Updates</h3>
        {hasUpdates && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
      </div>
      
      {propertyData ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Property: {propertyData.propertyId}
          </p>
          <p className="text-sm text-gray-600">
            Last update: {lastUpdate?.toLocaleTimeString()}
          </p>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(propertyData, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No property updates received</p>
      )}
    </div>
  );
}

function TaskUpdateMonitor() {
  const { taskData, lastUpdate, hasUpdates } = useTaskUpdates();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} className="text-green-600" />
        <h3 className="font-medium text-gray-900">Task Updates</h3>
        {hasUpdates && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
      </div>
      
      {taskData ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Task: {taskData.taskId} - {taskData.status}
          </p>
          <p className="text-sm text-gray-600">
            Last update: {lastUpdate?.toLocaleTimeString()}
          </p>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(taskData, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No task updates received</p>
      )}
    </div>
  );
}

function PaymentUpdateMonitor() {
  const { paymentData, lastUpdate, hasUpdates } = usePaymentUpdates();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} className="text-amber-600" />
        <h3 className="font-medium text-gray-900">Payment Updates</h3>
        {hasUpdates && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
      </div>
      
      {paymentData ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Transaction: {paymentData.transactionId}
          </p>
          <p className="text-sm text-gray-600">
            Amount: €{paymentData.amount?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Last update: {lastUpdate?.toLocaleTimeString()}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No payment updates received</p>
      )}
    </div>
  );
}

function MessageUpdateMonitor() {
  const { messages, unreadCount, hasNewMessages, markAsRead } = useMessageUpdates();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-purple-600" />
        <h3 className="font-medium text-gray-900">Message Updates</h3>
        {hasNewMessages && (
          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      
      {messages.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{messages.length} messages</p>
            {hasNewMessages && (
              <button
                onClick={markAsRead}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                Mark as read
              </button>
            )}
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {messages.slice(-3).map((message, index) => (
              <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                <p className="font-medium">{message.senderId}</p>
                <p className="text-gray-600">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No messages received</p>
      )}
    </div>
  );
}