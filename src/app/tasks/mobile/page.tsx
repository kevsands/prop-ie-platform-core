/**
 * Mobile Task Manager Page
 * 
 * Mobile-first PWA page for task management with offline capabilities,
 * AI-powered suggestions, and touch-optimized interface.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MobileTaskManager from '@/components/MobileTaskManager';
import { usePWA, useOfflineTasks, usePWANotifications, useDeviceCapabilities } from '@/hooks/usePWA';
import { 
  Task, 
  UniversalTaskStatus as TaskStatus, 
  UniversalTaskPriority as TaskPriority, 
  TaskCategory,
  TaskComplexityLevel,
  TaskOrchestrationContext 
} from '@/types/task/universal-task';
import { 
  AITaskPriorityScore, 
  PredictionConfidence 
} from '@/services/AITaskIntelligenceService';
import {
  Download,
  Wifi,
  WifiOff,
  Bell,
  Smartphone,
  RefreshCw,
  Settings,
  Zap,
  AlertCircle,
  CheckCircle2,
  Plus,
  Mic,
  Download as DownloadIcon
} from 'lucide-react';

/**
 * Sample task data for demonstration
 */
const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete buyer pre-approval documents',
    description: 'Review and process mortgage pre-approval documentation for new buyer',
    category: TaskCategory.BUYER_FINANCING,
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    complexityLevel: TaskComplexityLevel.MODERATE,
    estimatedDuration: 4,
    targetPersonas: ['BUYER'],
    isTimeDependent: true,
    isRegulatory: false,
    isLegalRequirement: false,
    progressPercentage: 60,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    assignedTo: 'user-1'
  },
  {
    id: 'task-2',
    title: 'Property valuation report',
    description: 'Conduct comprehensive property valuation for development project',
    category: TaskCategory.DEVELOPER_VALUATION,
    priority: TaskPriority.CRITICAL,
    status: TaskStatus.PENDING,
    complexityLevel: TaskComplexityLevel.EXPERT,
    estimatedDuration: 8,
    targetPersonas: ['DEVELOPER', 'AGENT'],
    isTimeDependent: true,
    isRegulatory: true,
    isLegalRequirement: false,
    progressPercentage: 0,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    assignedTo: 'user-2'
  },
  {
    id: 'task-3',
    title: 'Legal contract review',
    description: 'Review purchase agreement and legal documentation',
    category: TaskCategory.SOLICITOR_CONTRACTS,
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    complexityLevel: TaskComplexityLevel.COMPLEX,
    estimatedDuration: 6,
    targetPersonas: ['SOLICITOR'],
    isTimeDependent: false,
    isRegulatory: false,
    isLegalRequirement: true,
    progressPercentage: 0,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    assignedTo: 'user-3'
  }
];

/**
 * Sample AI scores for demonstration
 */
const sampleAIScores = new Map<string, AITaskPriorityScore>([
  ['task-1', {
    taskId: 'task-1',
    originalPriority: TaskPriority.HIGH,
    aiRecommendedPriority: TaskPriority.HIGH,
    score: 78,
    confidence: PredictionConfidence.HIGH,
    reasoning: ['Due in 2 days', 'High business value', 'Blocks dependent tasks'],
    factors: [],
    lastCalculated: new Date()
  }],
  ['task-2', {
    taskId: 'task-2',
    originalPriority: TaskPriority.CRITICAL,
    aiRecommendedPriority: TaskPriority.CRITICAL,
    score: 92,
    confidence: PredictionConfidence.VERY_HIGH,
    reasoning: ['Regulatory requirement', 'Critical path task', 'Due tomorrow'],
    factors: [],
    lastCalculated: new Date()
  }],
  ['task-3', {
    taskId: 'task-3',
    originalPriority: TaskPriority.HIGH,
    aiRecommendedPriority: TaskPriority.MEDIUM,
    score: 65,
    confidence: PredictionConfidence.MEDIUM,
    reasoning: ['Legal requirement', 'Good time buffer', 'Single assignee'],
    factors: [],
    lastCalculated: new Date()
  }]
]);

const sampleContext: TaskOrchestrationContext = {
  userId: 'user-1',
  userRole: 'BUYER' as any,
  transactionStage: 'active',
  workloadCapacity: 75,
  skillLevel: 'intermediate',
  availableHours: 32,
  preferredComplexity: TaskComplexityLevel.MODERATE,
  collaborationPreference: 'collaborative'
};

export default function MobileTaskPage() {
  const { state: pwaState, actions: pwaActions, capabilities } = usePWA();
  const { queueAction, getQueueStatus } = useOfflineTasks();
  const { permission, requestPermission, scheduleTaskReminder } = usePWANotifications();
  const deviceCapabilities = useDeviceCapabilities();
  
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  
  // Integration with AI Intelligence Services
  const [aiSuggestions, setAISuggestions] = useState<Map<string, string>>(new Map());
  const [workloadBalance, setWorkloadBalance] = useState<any>(null);
  const [bottleneckPredictions, setBottleneckPredictions] = useState<any[]>([]);

  // Check if we should show PWA install prompt
  useEffect(() => {
    if (capabilities.canInstall && pwaState.canInstall && !pwaState.isInstalled) {
      // Show prompt after 30 seconds of usage
      const timer = setTimeout(() => {
        setShowPWAPrompt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [capabilities.canInstall, pwaState.canInstall, pwaState.isInstalled]);

  // Enhanced task caching with AI scores
  useEffect(() => {
    if (pwaState.isOnline && tasks.length > 0) {
      pwaActions.cacheTaskData(tasks);
      
      // Cache AI scores with tasks
      if (sampleAIScores.size > 0) {
        caches.open('prop-ie-ai-v1').then(cache => {
          cache.put('/api/ai/scores', new Response(JSON.stringify(
            Array.from(sampleAIScores.entries())
          )));
        }).catch(console.error);
      }
    }
  }, [pwaState.isOnline, tasks, pwaActions]);
  
  // Load cached data when offline
  useEffect(() => {
    if (!pwaState.isOnline) {
      const loadCachedData = async () => {
        try {
          const cachedData = await pwaActions.getCachedTasks();
          if (cachedData && cachedData.length > 0) {
            setTasks(cachedData);
            console.log('[Mobile] Loaded cached tasks for offline use');
          }
        } catch (error) {
          console.error('[Mobile] Failed to load cached tasks:', error);
        }
      };
      loadCachedData();
    }
  }, [pwaState.isOnline, pwaActions]);
  
  // AI Intelligence Integration
  useEffect(() => {
    const initializeAI = async () => {
      if (pwaState.isOnline) {
        try {
          // Simulate AI service calls (replace with actual service calls)
          const suggestions = new Map<string, string>();
          tasks.forEach(task => {
            if (task.status === TaskStatus.PENDING) {
              if (task.priority === TaskPriority.CRITICAL) {
                suggestions.set(task.id, `🚨 Critical task - consider immediate attention`);
              } else if (task.category === TaskCategory.BUYER_FINANCING) {
                suggestions.set(task.id, `💰 Financial task - ensure all documents are prepared`);
              } else {
                suggestions.set(task.id, `💡 Consider prioritizing this ${task.category.toLowerCase()} task`);
              }
            }
          });
          setAISuggestions(suggestions);
          
          // Mock workload balance data based on current tasks
          const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
          const currentLoad = Math.min((totalEstimatedHours / sampleContext.availableHours) * 100, 100);
          setWorkloadBalance({
            currentLoad: Math.round(currentLoad),
            optimalLoad: 70,
            suggestions: currentLoad > 80 ? 
              ['Defer 2 low-priority tasks', 'Delegate 1 complex task'] :
              ['Workload is balanced', 'Consider taking on additional tasks']
          });
          
          // Mock bottleneck predictions
          const criticalTasks = tasks.filter(t => t.priority === TaskPriority.CRITICAL);
          if (criticalTasks.length > 1) {
            setBottleneckPredictions([
              {
                taskId: criticalTasks[0].id,
                risk: 'high',
                prediction: 'Multiple critical tasks may cause resource conflicts',
                mitigation: 'Prioritize by business impact or assign additional resources'
              }
            ]);
          }
        } catch (error) {
          console.error('[Mobile] AI initialization failed:', error);
        }
      }
    };
    
    initializeAI();
  }, [tasks, pwaState.isOnline]);

  // Handle task actions
  const handleTaskAction = (action: string, taskId: string, data?: any) => {
    switch (action) {
      case 'complete':
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: TaskStatus.COMPLETED, progressPercentage: 100 }
            : task
        ));
        
        if (!pwaState.isOnline) {
          queueAction('complete', taskId, { status: TaskStatus.COMPLETED });
          
          // Show offline confirmation with haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
          }
        }
        break;
        
      case 'defer':
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, priority: TaskPriority.LOW }
            : task
        ));
        
        if (!pwaState.isOnline) {
          queueAction('defer', taskId, { priority: TaskPriority.LOW });
        }
        
        // Update AI suggestions after deferring
        setAISuggestions(prev => {
          const updated = new Map(prev);
          updated.set(taskId, '📅 Task deferred - consider rescheduling when resources are available');
          return updated;
        });
        break;
        
      case 'create':
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: data?.title || 'New Mobile Task',
          description: data?.description || 'Created on mobile device',
          category: data?.category || TaskCategory.GENERAL,
          priority: data?.priority || TaskPriority.MEDIUM,
          status: TaskStatus.PENDING,
          complexityLevel: TaskComplexityLevel.SIMPLE,
          estimatedDuration: data?.duration || 2,
          targetPersonas: ['BUYER'],
          isTimeDependent: false,
          isRegulatory: false,
          isLegalRequirement: false,
          progressPercentage: 0,
          dueDate: data?.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          assignedTo: sampleContext.userId
        };
        
        setTasks(prev => [newTask, ...prev]);
        
        if (!pwaState.isOnline) {
          queueAction('create', newTask.id, newTask);
        }
        
        // Haptic feedback for mobile
        if ('vibrate' in navigator) {
          navigator.vibrate([50]);
        }
        
        // Add AI suggestion for new task
        setAISuggestions(prev => {
          const updated = new Map(prev);
          updated.set(newTask.id, '✨ New task created - AI will analyze priority shortly');
          return updated;
        });
        break;
        
      default:
        console.log(`Action ${action} for task ${taskId}:`, data);
    }
  };

  // Voice input for creating tasks
  const handleVoiceInput = () => {
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => {
        setVoiceRecording(true);
        if ('vibrate' in navigator) {
          navigator.vibrate([50]);
        }
      };
      
      recognition.onend = () => {
        setVoiceRecording(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleTaskAction('create', '', { 
          title: transcript,
          description: `Voice input: "${transcript}"`,
          priority: TaskPriority.MEDIUM
        });
      };
      
      recognition.start();
    } else {
      alert('Voice input not supported on this device');
    }
  };

  // Handle PWA install
  const handleInstallPWA = async () => {
    const installed = await pwaActions.promptInstall();
    if (installed) {
      setShowPWAPrompt(false);
    }
  };

  // Handle notification permission
  const handleNotificationSetup = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Schedule reminders for upcoming tasks
      tasks.forEach(task => {
        if (task.dueDate && task.status !== TaskStatus.COMPLETED) {
          scheduleTaskReminder(task.id, task.title, task.dueDate, task.priority);
        }
      });
      
      // Send AI suggestions as notifications if available
      if (aiSuggestions.size > 0) {
        setTimeout(() => {
          aiSuggestions.forEach((suggestion, taskId) => {
            if (Math.random() > 0.7) { // Randomly show some suggestions
              const task = tasks.find(t => t.id === taskId);
              if (task && pwaActions.scheduleNotification) {
                pwaActions.scheduleNotification(
                  '🤖 AI Suggestion',
                  `${task.title}: ${suggestion}`,
                  5000 // 5 seconds delay
                );
              }
            }
          });
        }, 10000); // Wait 10 seconds before showing AI suggestions
      }
    }
  };

  const queueStatus = getQueueStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PWA Status Bar */}
      <div className={`sticky top-0 z-50 bg-white border-b ${
        pwaState.isOnline ? 'border-green-200' : 'border-red-200'
      }`}>
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {pwaState.isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              pwaState.isOnline ? 'text-green-700' : 'text-red-700'
            }`}>
              {pwaState.isOnline ? 'Online' : 'Offline'}
            </span>
            
            {queueStatus.pendingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {queueStatus.pendingCount} pending
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="h-7 w-7 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {pwaState.updateAvailable && (
              <Button
                size="sm"
                variant="outline"
                onClick={pwaActions.updateApp}
                className="h-7 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Update
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="h-7 w-7 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      {showQuickActions && (
        <Card className="m-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              onClick={() => handleTaskAction('create', '', { 
                title: 'Quick Task',
                category: TaskCategory.GENERAL,
                priority: TaskPriority.MEDIUM
              })}
              className="w-full"
            >
              <Plus className="h-3 w-3 mr-1" />
              New Task
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleVoiceInput}
              disabled={voiceRecording}
              className="w-full"
            >
              <Mic className={`h-3 w-3 mr-1 ${voiceRecording ? 'animate-pulse text-red-500' : ''}`} />
              Voice Input
            </Button>
          </div>
        </Card>
      )}

      {/* PWA Install Prompt */}
      {showPWAPrompt && (
        <Alert className="m-4 border-blue-200 bg-blue-50">
          <Smartphone className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Install PropIE Tasks for offline access and notifications</span>
            <div className="flex space-x-2 ml-4">
              <Button size="sm" onClick={handleInstallPWA}>
                <DownloadIcon className="h-3 w-3 mr-1" />
                Install
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowPWAPrompt(false)}>
                Later
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Permission Prompt */}
      {permission === 'default' && (
        <Alert className="m-4 border-yellow-200 bg-yellow-50">
          <Bell className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Enable notifications for task reminders and updates</span>
            <Button size="sm" onClick={handleNotificationSetup}>
              <Bell className="h-3 w-3 mr-1" />
              Enable
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* AI Intelligence Panel */}
      {pwaState.isOnline && (aiSuggestions.size > 0 || workloadBalance || bottleneckPredictions.length > 0) && (
        <Card className="m-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            AI Intelligence
          </h3>
          
          <div className="space-y-3">
            {workloadBalance && (
              <div className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">Workload Balance</span>
                  <Badge variant={workloadBalance.currentLoad > 80 ? 'destructive' : 'default'}>
                    {workloadBalance.currentLoad}%
                  </Badge>
                </div>
                <Progress value={workloadBalance.currentLoad} className="h-2" />
                {workloadBalance.currentLoad > workloadBalance.optimalLoad && (
                  <div className="mt-2 text-xs text-orange-600">
                    💡 {workloadBalance.suggestions[0]}
                  </div>
                )}
              </div>
            )}
            
            {bottleneckPredictions.length > 0 && (
              <div className="text-sm">
                <div className="text-gray-700 mb-1">Bottleneck Alerts</div>
                {bottleneckPredictions.map((prediction, index) => (
                  <div key={index} className="bg-orange-50 p-2 rounded border-l-4 border-orange-400">
                    <div className="text-orange-800 font-medium">⚠️ {prediction.prediction}</div>
                    <div className="text-orange-600 text-xs mt-1">{prediction.mitigation}</div>
                  </div>
                ))}
              </div>
            )}
            
            {aiSuggestions.size > 0 && (
              <div className="text-sm">
                <div className="text-gray-700 mb-1">AI Suggestions ({aiSuggestions.size})</div>
                <div className="text-blue-600 text-xs">
                  🤖 Tap tasks to see personalized AI recommendations
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* PWA Settings Panel */}
      {showSettings && (
        <Card className="m-4 p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">PWA Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">App Installed</span>
              <Badge variant={pwaState.isInstalled ? 'default' : 'secondary'}>
                {pwaState.isInstalled ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Notifications</span>
              <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
                {permission === 'granted' ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Cache Usage</span>
              <span className="text-sm text-gray-600">
                {Math.round(pwaState.cacheUsage.percentage)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Device Type</span>
              <Badge variant="outline">
                {deviceCapabilities.isMobile ? 'Mobile' : 
                 deviceCapabilities.isTablet ? 'Tablet' : 'Desktop'}
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={pwaActions.clearCache}
              className="flex-1"
            >
              Clear Cache
            </Button>
            
            {!pwaState.isInstalled && pwaState.canInstall && (
              <Button
                size="sm"
                onClick={handleInstallPWA}
                className="flex-1"
              >
                <DownloadIcon className="h-3 w-3 mr-1" />
                Install App
              </Button>
            )}
          </div>
        </Card>
      )}
      
      {/* Device Info for Development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="m-4 p-3 bg-gray-100">
          <div className="text-xs text-gray-600 space-y-1">
            <div>Screen: {deviceCapabilities.screenSize.width}x{deviceCapabilities.screenSize.height}</div>
            <div>Orientation: {deviceCapabilities.orientation}</div>
            <div>Touch: {deviceCapabilities.hasTouch ? 'Yes' : 'No'}</div>
            <div>PWA Support: {Object.entries(capabilities).map(([key, value]) => 
              `${key}: ${value ? '✓' : '✗'}`
            ).join(', ')}</div>
            <div>AI: {aiSuggestions.size} suggestions, {bottleneckPredictions.length} alerts</div>
            <div>Workload: {workloadBalance?.currentLoad || 0}% capacity</div>
          </div>
        </Card>
      )}

      {/* Main Task Manager */}
      <MobileTaskManager
        tasks={tasks}
        context={sampleContext}
        aiScores={sampleAIScores}
        aiSuggestions={aiSuggestions}
        workloadBalance={workloadBalance}
        bottleneckPredictions={bottleneckPredictions}
        onTaskAction={handleTaskAction}
        isOffline={!pwaState.isOnline}
        className="pb-safe-area"
      />
      
      {/* Offline Queue Status */}
      {queueStatus.pendingCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {queueStatus.pendingCount} actions queued for sync
              {queueStatus.lastSync && (
                <span className="text-xs text-gray-600 block">
                  Last sync: {queueStatus.lastSync.toLocaleTimeString()}
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}