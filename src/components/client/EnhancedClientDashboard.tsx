/**
 * Enhanced Client Dashboard
 * 
 * AI-powered client portal integrating with multi-professional coordination ecosystem
 * Provides unified client experience with real-time project insights and communication
 * 
 * Features:
 * - Unified project overview with AI insights
 * - Real-time professional coordination tracking  
 * - Interactive project timeline and milestones
 * - Direct communication with professionals
 * - Document management and notifications
 * - Mobile-responsive design with offline capabilities
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2,
  Users,
  BarChart3,
  Brain,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  Eye,
  Settings,
  Lightbulb,
  Activity,
  Network,
  FileText,
  PieChart,
  Globe,
  Shield,
  Award,
  Rocket,
  Star,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Filter,
  Search,
  Download,
  Upload,
  Share,
  Phone,
  Video,
  Mail,
  MapPin,
  Euro,
  Calendar as CalendarIcon,
  Home,
  Camera,
  Plus,
  Edit,
  Send,
  Archive,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Info,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

import ClientPortalService, { 
  ClientPortalProject, 
  ClientMessage, 
  ClientAnnouncement,
  ClientMilestone,
  ClientAnalytics
} from '@/services/ClientPortalService';

export interface EnhancedClientDashboardProps {
  clientId: string;
  projectId?: string;
  defaultView?: 'overview' | 'project' | 'messages' | 'professionals' | 'documents';
}

export default function EnhancedClientDashboard({
  clientId,
  projectId,
  defaultView = 'overview'
}: EnhancedClientDashboardProps) {
  const [activeTab, setActiveTab] = useState(defaultView);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Service instance
  const [clientService] = useState(() => new ClientPortalService());

  // Dashboard data
  const [projects, setProjects] = useState<ClientPortalProject[]>([]);
  const [activeProject, setActiveProject] = useState<ClientPortalProject | null>(null);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [notifications, setNotifications] = useState<ClientAnnouncement[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<ClientMilestone[]>([]);
  const [analytics, setAnalytics] = useState<ClientAnalytics | null>(null);

  // UI state
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [composeMode, setComposeMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'important'>('all');

  // Real-time updates
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        const dashboardData = await clientService.getClientDashboardSummary(clientId);
        
        setProjects(dashboardData.projects);
        setMessages(dashboardData.messages);
        setNotifications(dashboardData.notifications);
        setUpcomingMilestones(dashboardData.upcomingMilestones);
        setAnalytics(dashboardData.analytics);

        // Set active project
        if (projectId) {
          const project = dashboardData.projects.find(p => p.id === projectId);
          setActiveProject(project || dashboardData.projects[0] || null);
        } else {
          setActiveProject(dashboardData.projects[0] || null);
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Set up real-time updates
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        loadDashboardData();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [clientId, projectId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const dashboardData = await clientService.getClientDashboardSummary(clientId);
      setProjects(dashboardData.projects);
      setMessages(dashboardData.messages);
      setNotifications(dashboardData.notifications);
      setUpcomingMilestones(dashboardData.upcomingMilestones);
      setAnalytics(dashboardData.analytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendMessage = async (professionalId: string, message: {
    subject: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }) => {
    try {
      await clientService.sendMessageToProfessional(clientId, professionalId, message);
      // Refresh messages
      const updatedMessages = await clientService.getClientMessages(clientId);
      setMessages(updatedMessages);
      setComposeMode(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="text-green-600" size={16} />;
    if (score >= 70) return <AlertTriangle className="text-yellow-600" size={16} />;
    return <AlertCircle className="text-red-600" size={16} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Dashboard</h2>
          <p className="text-gray-600">Gathering your project information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Portal</h1>
              <p className="text-gray-600 mt-1">
                Your unified view of all project activities and communications
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Monitor size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Smartphone size={16} />
                </button>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageSquare size={16} className="mr-2" />
                New Message
              </Button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          {activeProject && (
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{activeProject.name}</h3>
                  <p className="text-blue-100 mb-2">{activeProject.location.address}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Due: {activeProject.timeline.estimatedCompletion.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro size={16} />
                      <span>{formatCurrency(activeProject.budget.totalBudget)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{activeProject.professionals.totalProfessionals} Professionals</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">{activeProject.timeline.completionPercentage}%</span>
                  </div>
                  <p className="text-sm text-blue-100">Complete</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="project" className="flex items-center gap-2">
              <Building2 size={16} />
              <span className="hidden sm:inline">Project</span>
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Messages</span>
              {messages.filter(m => !m.read).length > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs">
                  {messages.filter(m => !m.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">Docs</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeProject && (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Project Health</p>
                          <p className={`text-2xl font-bold ${getHealthScoreColor(activeProject.intelligence.overview.healthScore)}`}>
                            {activeProject.intelligence.overview.healthScore}%
                          </p>
                          <p className="text-sm text-gray-500">Overall health score</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          {getHealthScoreIcon(activeProject.intelligence.overview.healthScore)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {activeProject.intelligence.progress.overallCompletion}%
                          </p>
                          <p className="text-sm text-gray-500">Completion</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <TrendingUp size={24} className="text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Budget Status</p>
                          <p className={`text-2xl font-bold ${
                            activeProject.budget.variance.trend === 'under' ? 'text-green-600' :
                            activeProject.budget.variance.trend === 'on_track' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {activeProject.budget.variance.trend === 'under' ? '↓' : 
                             activeProject.budget.variance.trend === 'over' ? '↑' : '→'}
                            {Math.abs(activeProject.budget.variance.percentage).toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-500">vs. planned</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <Euro size={24} className="text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Time Remaining</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {activeProject.timeline.daysRemaining}
                          </p>
                          <p className="text-sm text-gray-500">days</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                          <Clock size={24} className="text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* AI Insights */}
            {activeProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="text-purple-600" size={20} />
                    AI Project Intelligence
                  </CardTitle>
                  <CardDescription>
                    AI-powered insights and recommendations for your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Key Insights */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Lightbulb size={16} className="text-yellow-600" />
                        Key Insights
                      </h4>
                      <div className="space-y-3">
                        {activeProject.intelligence.overview.keyInsights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Target size={16} className="text-green-600" />
                        Recommendations
                      </h4>
                      <div className="space-y-3">
                        {activeProject.intelligence.overview.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-800">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity & Upcoming Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="text-amber-600" size={20} />
                    Recent Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          notification.importance === 'high' ? 'bg-red-100' :
                          notification.importance === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {notification.type === 'milestone' ? <CheckCircle size={16} /> : <Bell size={16} />}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{notification.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.timestamp.toLocaleString()}</p>
                        </div>
                        {notification.actionRequired && (
                          <Badge className="bg-orange-100 text-orange-800">Action Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="text-blue-600" size={20} />
                    Upcoming Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMilestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(milestone.status)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">{milestone.name}</h5>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Due: {milestone.targetDate.toLocaleDateString()}</span>
                            <span>By: {milestone.responsible}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Project Details Tab */}
          <TabsContent value="project" className="space-y-6">
            {activeProject && (
              <>
                {/* Project Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="text-blue-600" size={20} />
                      Project Timeline
                    </CardTitle>
                    <CardDescription>
                      Track progress across all project phases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{activeProject.intelligence.progress.overallCompletion}%</span>
                        </div>
                        <Progress value={activeProject.intelligence.progress.overallCompletion} className="h-3" />
                      </div>

                      {/* Phase Progress */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(activeProject.intelligence.progress.phaseCompletion).map(([phase, completion]) => (
                          <div key={phase} className="text-center p-4 border rounded-lg">
                            <h4 className="font-medium text-gray-900">{phase}</h4>
                            <div className="mt-2">
                              <Progress value={completion} className="h-2" />
                              <p className="text-sm text-gray-600 mt-1">{completion}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Euro className="text-green-600" size={20} />
                      Budget Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Budget Summary */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium">Total Budget</span>
                          <span className="font-bold text-lg">{formatCurrency(activeProject.budget.totalBudget)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                          <span className="font-medium">Current Spend</span>
                          <span className="font-bold text-blue-600">{formatCurrency(activeProject.budget.currentSpend)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                          <span className="font-medium">Remaining</span>
                          <span className="font-bold text-green-600">{formatCurrency(activeProject.budget.remaining)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                          <span className="font-medium">Predicted Final</span>
                          <span className="font-bold text-purple-600">{formatCurrency(activeProject.budget.forecasting.predictedFinalCost)}</span>
                        </div>
                      </div>

                      {/* Budget Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Budget Breakdown</h4>
                        {activeProject.budget.breakdown.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{item.category}</span>
                              <span>{item.percentage}% used</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Spent: {formatCurrency(item.spent)}</span>
                              <span>Remaining: {formatCurrency(item.remaining)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-6">
            {activeProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-blue-600" size={20} />
                    Professional Team
                  </CardTitle>
                  <CardDescription>
                    Your project's professional team and their current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Team Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{activeProject.professionals.totalProfessionals}</div>
                        <div className="text-sm text-blue-800">Total Professionals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {activeProject.professionals.coordinationStatus === 'excellent' ? '100%' : '85%'}
                        </div>
                        <div className="text-sm text-green-800">Coordination Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {new Date(activeProject.professionals.lastUpdate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-purple-800">Last Update</div>
                      </div>
                    </div>

                    {/* Professional Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Architect */}
                      {activeProject.professionals.architect && (
                        <div className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 size={24} className="text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{activeProject.professionals.architect.name}</h4>
                                <p className="text-sm text-gray-600">{activeProject.professionals.architect.role}</p>
                                <p className="text-xs text-gray-500">{activeProject.professionals.architect.company}</p>
                              </div>
                            </div>
                            <Badge className={`${
                              activeProject.professionals.architect.availability === 'available' ? 'bg-green-100 text-green-800' :
                              activeProject.professionals.architect.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {activeProject.professionals.architect.availability}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Current Task</p>
                              <p className="text-sm text-gray-600">{activeProject.professionals.architect.currentTask}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Next Milestone</p>
                              <p className="text-sm text-gray-600">{activeProject.professionals.architect.nextMilestone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500" />
                                <span className="text-sm">{activeProject.professionals.architect.performance.rating}/5.0</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  Last contact: {activeProject.professionals.architect.lastContact.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Mail size={14} className="mr-2" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Phone size={14} className="mr-2" />
                                Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Project Manager */}
                      {activeProject.professionals.projectManager && (
                        <div className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Target size={24} className="text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{activeProject.professionals.projectManager.name}</h4>
                                <p className="text-sm text-gray-600">{activeProject.professionals.projectManager.role}</p>
                                <p className="text-xs text-gray-500">{activeProject.professionals.projectManager.company}</p>
                              </div>
                            </div>
                            <Badge className={`${
                              activeProject.professionals.projectManager.availability === 'available' ? 'bg-green-100 text-green-800' :
                              activeProject.professionals.projectManager.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {activeProject.professionals.projectManager.availability}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Current Task</p>
                              <p className="text-sm text-gray-600">{activeProject.professionals.projectManager.currentTask}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Next Milestone</p>
                              <p className="text-sm text-gray-600">{activeProject.professionals.projectManager.nextMilestone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500" />
                                <span className="text-sm">{activeProject.professionals.projectManager.performance.rating}/5.0</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  Last contact: {activeProject.professionals.projectManager.lastContact.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Mail size={14} className="mr-2" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Video size={14} className="mr-2" />
                                Video Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="text-blue-600" size={20} />
                      Communications
                    </CardTitle>
                    <CardDescription>Messages and updates from your professional team</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setComposeMode(true)}>
                      <Plus size={16} className="mr-2" />
                      New Message
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages
                    .filter(msg => {
                      if (filterType === 'unread') return !msg.read;
                      if (filterType === 'important') return msg.priority === 'high';
                      return true;
                    })
                    .map((message) => (
                    <div 
                      key={message.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        !message.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      } ${selectedMessage === message.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold text-gray-900">{message.from.name}</h5>
                              <Badge className="text-xs">{message.from.role}</Badge>
                              {message.priority === 'high' && (
                                <Badge className="bg-red-100 text-red-800 text-xs">High Priority</Badge>
                              )}
                              {!message.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <h6 className="font-medium text-gray-800 mb-1">{message.subject}</h6>
                            <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{message.timestamp.toLocaleString()}</span>
                              {message.attachments && message.attachments.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <FileText size={12} />
                                  {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                      
                      {selectedMessage === message.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <h6 className="text-sm font-medium text-gray-700">Attachments:</h6>
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                                    <FileText size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-700">{attachment.name}</span>
                                    <Button size="sm" variant="outline" className="ml-auto">
                                      <Download size={14} />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm">
                              <Send size={14} className="mr-2" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share size={14} className="mr-2" />
                              Forward
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-purple-600" size={20} />
                  Project Documents
                </CardTitle>
                <CardDescription>
                  Access all project documents, contracts, and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Management</h3>
                  <p className="text-gray-600 mb-4">
                    Document management features will be integrated with your project workflow
                  </p>
                  <Button>
                    <Upload size={16} className="mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}