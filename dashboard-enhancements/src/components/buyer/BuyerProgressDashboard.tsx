'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Euro, 
  Home,
  RefreshCw,
  Calendar,
  ArrowRight,
  Target,
  Award,
  Activity,
  BarChart3,
  PlayCircle,
  PauseCircle,
  Users,
  Shield
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { BuyerPhase, BuyerJourney } from '@/types/buyer-journey';
import { HTBClaim, HTBClaimStatus } from '@/types/htb';
import HTBAutomationDashboard from '@/components/htb/HTBAutomationDashboard';
import DocumentUploader from '@/components/documents/DocumentUploader';

interface BuyerProgressDashboardProps {
  buyerId: string;
  className?: string;
}

interface ProgressMetrics {
  overallProgress: number;
  documentsProgress: number;
  htbProgress: number;
  journeyProgress: number;
  estimatedCompletionDays: number;
  completedMilestones: number;
  totalMilestones: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  phase: BuyerPhase;
  status: 'completed' | 'active' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completedDate?: string;
  dependencies?: string[];
  progress: number;
}

interface ActivityItem {
  id: string;
  type: 'document' | 'htb' | 'milestone' | 'system' | 'meeting';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
}

export default function BuyerProgressDashboard({
  buyerId,
  className = ''
}: BuyerProgressDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics>({
    overallProgress: 0,
    documentsProgress: 0,
    htbProgress: 0,
    journeyProgress: 0,
    estimatedCompletionDays: 0,
    completedMilestones: 0,
    totalMilestones: 0
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [currentPhase, setCurrentPhase] = useState<BuyerPhase>(BuyerPhase.PLANNING);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Simulate loading comprehensive buyer progress data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - In real implementation, this would come from various services
      const mockMetrics: ProgressMetrics = {
        overallProgress: 68,
        documentsProgress: 75,
        htbProgress: 85,
        journeyProgress: 60,
        estimatedCompletionDays: 45,
        completedMilestones: 8,
        totalMilestones: 12
      };

      const mockMilestones: Milestone[] = [
        {
          id: 'mortgage_approval',
          title: 'Mortgage Pre-Approval',
          description: 'Obtain mortgage approval in principle',
          phase: BuyerPhase.FINANCING,
          status: 'completed',
          priority: 'high',
          completedDate: '2025-01-15',
          progress: 100
        },
        {
          id: 'htb_application',
          title: 'HTB Application',
          description: 'Submit and process Help-to-Buy application',
          phase: BuyerPhase.FINANCING,
          status: 'active',
          priority: 'high',
          progress: 85
        },
        {
          id: 'property_selection',
          title: 'Property Selection',
          description: 'Choose and reserve your property',
          phase: BuyerPhase.PROPERTY_SEARCH,
          status: 'active',
          priority: 'high',
          progress: 45
        },
        {
          id: 'legal_review',
          title: 'Legal Documentation',
          description: 'Review and sign legal documents',
          phase: BuyerPhase.LEGAL_PROCESS,
          status: 'pending',
          priority: 'medium',
          dependencies: ['property_selection'],
          progress: 0
        },
        {
          id: 'final_approval',
          title: 'Final Mortgage Approval',
          description: 'Complete mortgage approval process',
          phase: BuyerPhase.LEGAL_PROCESS,
          status: 'pending',
          priority: 'high',
          dependencies: ['legal_review'],
          progress: 0
        },
        {
          id: 'completion',
          title: 'Property Completion',
          description: 'Complete property purchase and move in',
          phase: BuyerPhase.COMPLETION,
          status: 'pending',
          priority: 'high',
          dependencies: ['final_approval'],
          progress: 0
        }
      ];

      const mockActivity: ActivityItem[] = [
        {
          id: '1',
          type: 'document',
          title: 'Bank Statement Verified',
          description: 'Your latest bank statement has been successfully verified',
          timestamp: '2025-01-20T10:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          type: 'htb',
          title: 'HTB Application Progressed',
          description: 'Your HTB application moved to financial verification stage',
          timestamp: '2025-01-20T09:15:00Z',
          status: 'info'
        },
        {
          id: '3',
          type: 'system',
          title: 'Property Match Found',
          description: 'New property matching your criteria has become available',
          timestamp: '2025-01-19T16:45:00Z',
          status: 'info'
        },
        {
          id: '4',
          type: 'milestone',
          title: 'Mortgage Pre-Approval Complete',
          description: 'Congratulations! Your mortgage has been approved in principle',
          timestamp: '2025-01-19T14:20:00Z',
          status: 'success'
        },
        {
          id: '5',
          type: 'document',
          title: 'Salary Certificate Required',
          description: 'Please upload your latest salary certificate to continue',
          timestamp: '2025-01-18T11:30:00Z',
          status: 'warning'
        }
      ];

      setProgressMetrics(mockMetrics);
      setMilestones(mockMilestones);
      setRecentActivity(mockActivity);
      setCurrentPhase(BuyerPhase.PROPERTY_SEARCH);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [buyerId]);

  // Get phase name
  const getPhaseName = (phase: BuyerPhase): string => {
    const phaseNames = {
      [BuyerPhase.PLANNING]: 'Planning',
      [BuyerPhase.FINANCING]: 'Financing',
      [BuyerPhase.PROPERTY_SEARCH]: 'Property Search',
      [BuyerPhase.RESERVATION]: 'Reservation',
      [BuyerPhase.LEGAL_PROCESS]: 'Legal Process',
      [BuyerPhase.CONSTRUCTION]: 'Construction',
      [BuyerPhase.COMPLETION]: 'Completion',
      [BuyerPhase.POST_PURCHASE]: 'Post Purchase'
    };
    return phaseNames[phase] || phase;
  };

  // Get milestone status color
  const getMilestoneStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'blocked':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'htb':
        return <Euro className="h-4 w-4" />;
      case 'milestone':
        return <Target className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get activity status color
  const getActivityStatusColor = (status: string): string => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading your progress...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Your Property Journey
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress towards homeownership
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadDashboardData}
          disabled={refreshing}
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{progressMetrics.overallProgress}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={progressMetrics.overallProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Phase</p>
                <p className="text-2xl font-bold">{getPhaseName(currentPhase)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Home className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {progressMetrics.estimatedCompletionDays} days to completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Milestones</p>
                <p className="text-2xl font-bold">
                  {progressMetrics.completedMilestones}/{progressMetrics.totalMilestones}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Progress 
              value={(progressMetrics.completedMilestones / progressMetrics.totalMilestones) * 100} 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{progressMetrics.documentsProgress}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <Progress value={progressMetrics.documentsProgress} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="htb">HTB Progress</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Journey Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Journey Progress
                </CardTitle>
                <CardDescription>Your progress through the buyer journey phases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.values(BuyerPhase).map((phase, index) => {
                  const isCompleted = index < Object.values(BuyerPhase).indexOf(currentPhase);
                  const isActive = phase === currentPhase;
                  
                  return (
                    <div key={phase} className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isCompleted ? "bg-green-100 text-green-600" :
                        isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : isActive ? (
                          <PlayCircle className="h-4 w-4" />
                        ) : (
                          <PauseCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{getPhaseName(phase)}</div>
                        <div className="text-sm text-muted-foreground">
                          {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks for your current phase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Euro className="h-4 w-4 mr-2" />
                  Check HTB Status
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates on your property journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      getActivityStatusColor(activity.status)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          {/* Milestones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Journey Milestones
              </CardTitle>
              <CardDescription>Key milestones in your property buying journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        getMilestoneStatusColor(milestone.status)
                      )}>
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : milestone.status === 'active' ? (
                          <PlayCircle className="h-5 w-5" />
                        ) : milestone.status === 'blocked' ? (
                          <AlertCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-px h-16 bg-gray-200 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{getPhaseName(milestone.phase)}</Badge>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", {
                                'border-red-200 text-red-600': milestone.priority === 'high',
                                'border-yellow-200 text-yellow-600': milestone.priority === 'medium',
                                'border-green-200 text-green-600': milestone.priority === 'low'
                              })}
                            >
                              {milestone.priority} priority
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{milestone.progress}%</div>
                          <Progress value={milestone.progress} className="w-24 mt-1" />
                        </div>
                      </div>
                      
                      {milestone.status === 'completed' && milestone.completedDate && (
                        <div className="text-xs text-green-600">
                          Completed on {format(new Date(milestone.completedDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                      
                      {milestone.dependencies && milestone.dependencies.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Depends on: {milestone.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="htb" className="space-y-6">
          <HTBAutomationDashboard buyerId={buyerId} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Documents Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Management
              </CardTitle>
              <CardDescription>Track and manage your required documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Documents progress overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-muted-foreground">Total Required</div>
                  </div>
                  <div className="text-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-green-600">9</div>
                    <div className="text-sm text-muted-foreground">Uploaded</div>
                  </div>
                  <div className="text-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-purple-600">7</div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                </div>

                {/* Document upload area */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your documents here or click to browse
                    </p>
                    <Button>Choose Files</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activity Feed
              </CardTitle>
              <CardDescription>Complete timeline of your property journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 border rounded-md">
                    <div className={cn(
                      "p-2 rounded-full",
                      getActivityStatusColor(activity.status)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{activity.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{activity.description}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}