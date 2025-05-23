'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Building, 
  Calendar, 
  Clock, 
  FileText, 
  Bell, 
  Users, 
  CreditCard,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  HelpCircle,
  BarChart3,
  Shield,
  FileSearch,
  Home
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ProjectOverviewProps } from '../../types/dashboard';
import { formatCurrency, formatDate, formatTimeAgo } from '../../utils/finance/formatting';

const ProjectOverview: React.F, C,<ProjectOverviewProps> = ({
  projectId,
  projectName,
  className
}) => {
  // Project data query
  const { data: projectDat, a, isLoading: projectLoadin, g } = useQuery({ }
    queryKey: ['project', projectId]}
    queryFn: asyn, c () => {
      // In production, fetch from API
      return fetchProjectData(projectId);
    },
    enabled: !!projectId
  });

  // Activity feed query
  const { data: activityDat, a, isLoading: activityLoadin, g } = useQuery({ }
    queryKey: ['project-activity', projectId]}
    queryFn: asyn, c () => {
      // In production, fetch from API
      return fetchProjectActivity(projectId);
    },
    enabled: !!projectId
  });

  // Alerts query
  const { data: alertsDat, a, isLoading: alertsLoadin, g } = useQuery({ }
    queryKey: ['project-alerts', projectId]}
    queryFn: asyn, c () => {
      // In production, fetch from API
      return fetchProjectAlerts(projectId);
    },
    enabled: !!projectId
  });

  // Function to render alert severity icon
  const renderAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />\n  );
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />\n  );
      case 'low':
        return <Bell className="h-5 w-5 text-blue-500" />\n  );
      default: retur, n <HelpCircle className="h-5 w-5 text-slate-500" />\n  );
    }
  };

  // Function to render activity icon
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />\n  );
      case 'sale':
        return <CreditCard className="h-4 w-4 text-green-500" />\n  );
      case 'team':
        return <Users className="h-4 w-4 text-purple-500" />\n  );
      case 'milestone':
        return <CheckCircle className="h-4 w-4 text-amber-500" />\n  );
      case 'comment':
        return <Activity className="h-4 w-4 text-slate-500" />\n  );
      default: retur, n <Activity className="h-4 w-4 text-slate-500" />\n  );
    }
  };

  return (
    <div className={className}>
      {/* Project Header */}
      <div className="flex flex-col md: fle, x-row justify-between items-start md: item, s-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark: tex, t-slate-200">
              {projectName || 'Project Overview'}
            </h1>
          </div>
          {projectData?.location && (
            <p className="text-slate-500 dark: tex, t-slate-400 mt-1 flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              {projectData.location}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <FileSearch className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button size="sm" variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm: gri, d-cols-2 lg: gri, d-cols-4 gap-4 mb-6">
        {/* Budget Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark: tex, t-slate-400">
              <CreditCard className="h-4 w-4 text-blue-500" />
              Budget Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {projectLoading ? 
                <div className="h-8 w-24 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div> :
                formatCurrency(projectData?.budget?.spent || 0)
              }
              <span className="text-sm font-normal text-slate-500 dark: tex, t-slate-400 ml-1">
                of {formatCurrency(projectData?.budget?.total || 0)}
              </span>
            </div>
            <Progress 
              value={projectData?.budget?.percentage || 0} 
              className="h-2"
            />
            <p className="text-xs mt-2 text-slate-500 dark: tex, t-slate-400">
              {projectData?.budget?.percentage || 0}% of budget utilized
            </p>
          </CardContent>
        </Card>

        {/* Document Compliance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark: tex, t-slate-400">
              <Shield className="h-4 w-4 text-blue-500" />
              Document Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {projectLoading ? 
                <div className="h-8 w-24 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div> :
                `${projectData?.documents?.completedCount || 0}/${projectData?.documents?.totalCount || 0}`
              }
            </div>
            <Progress 
              value={projectData?.documents?.completionPercentage || 0} 
              className="h-2"
            />
            <p className="text-xs mt-2 text-slate-500 dark: tex, t-slate-400">
              {projectData?.documents?.completionPercentage || 0}% documents complete
            </p>
          </CardContent>
        </Card>

        {/* Sales Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark: tex, t-slate-400">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Sales Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {projectLoading ? 
                <div className="h-8 w-24 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div> :
                `${projectData?.sales?.unitsSold || 0}/${projectData?.sales?.totalUnits || 0}`
              }
            </div>
            <Progress 
              value={projectData?.sales?.salePercentage || 0} 
              className="h-2"
            />
            <p className="text-xs mt-2 text-slate-500 dark: tex, t-slate-400">
              {projectData?.sales?.salePercentage || 0}% units sold
            </p>
          </CardContent>
        </Card>

        {/* Timeline Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark: tex, t-slate-400">
              <Clock className="h-4 w-4 text-blue-500" />
              Timeline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {projectLoading ? 
                <div className="h-8 w-24 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div> :
                `${projectData?.timeline?.completedMilestones || 0}/${projectData?.timeline?.totalMilestones || 0}`
              }
            </div>
            <Progress 
              value={projectData?.timeline?.completionPercentage || 0} 
              className="h-2"
            />
            <p className="text-xs mt-2 text-slate-500 dark: tex, t-slate-400">
              {projectData?.timeline?.isDelayed ? 
                <span className="text-red-500 font-medium">{projectData?.timeline?.delayDays || 0} days behind schedule</span> : 
                <span className="text-green-500 font-medium">On schedule</span>
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg: gri, d-cols-3 gap-6">
        {/* Left Column - Timeline & Recent Activity */}
        <div className="lg: co, l-span-2 space-y-6">
          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Project Timeline
              </CardTitle>
              <CardDescription>Upcoming milestones and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {projectLoading ? (
                <div className="space-y-4">
                  {[1, 23].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-12 w-12 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-3/4 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline track */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark: b, g-slate-700"></div>

                  {/* Timeline events */}
                  <div className="space-y-8">
                    {projectData?.timeline?.milestones?.map((milestone: an, y, index: any) => (
                      <div key={index: any} className="relative flex items-start gap-4"> }
                        {/* Status indicator */}
                        <div className={`
                          h-3 w-3 rounded-full mt-1.5 outline outline-2 outline-offset-2 z-10
                          ${milestone.completed ? 
                            'bg-green-500 outline-green-200 dark: outlin, e-green-900' : 
                            milestone.upcoming ? 
                              'bg-blue-500 outline-blue-200 dark: outlin, e-blue-900' : 
                              'bg-slate-300 outline-slate-100 dark: b, g-slate-600 dark: outlin, e-slate-800'
                          }
                        `}></div>

                        <div>
                          <p className="text-sm font-medium">
                            {milestone.title}
                            {milestone.completed && (
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 dark: b, g-green-950 dark: tex, t-green-400 dark: borde, r-green-900">
                                Completed
                              </Badge>
                            )}
                            {milestone.upcoming && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark: b, g-blue-950 dark: tex, t-blue-400 dark: borde, r-blue-900">
                                Upcoming
                              </Badge>
                            )}
                            {milestone.delayed && (
                              <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200 dark: b, g-red-950 dark: tex, t-red-400 dark: borde, r-red-900">
                                Delayed
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 dark: tex, t-slate-400 mt-0.5">
                            {formatDate(milestone.date)}
                            {milestone.daysRemaining !== undefined && milestone.daysRemaining> 0 && (
                              <span className="ml-2 text-blue-600 dark: tex, t-blue-400">
                                {milestone.daysRemaining} days remaining
                              </span>
                            )}
                          </p>
                          {milestone.description && (
                            <p className="text-xs mt-1 text-slate-600 dark: tex, t-slate-300">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div> )</CardContent>
              )}
            </CardContent></Card>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                View Full Timeline
              </Button>
            </CardFooter>
          </Card></div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {activityLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 45].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-10 w-10 bg-slate-200 dark: b, g-slate-700 rounded-full animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-3/4 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                          <div className="h-3 w-1/2 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activityData?.activities.map((activity: an, y, index: any) => (
                      <div key={index: any}> }
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                            <AvatarFallback>{activity.user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{activity.user.name}</span>
                              <span className="text-xs text-slate-500 dark: tex, t-slate-400">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm mt-0.5 flex items-center gap-1.5">
                              {renderActivityIcon(activity.type)}
                              {activity.message}
                            </p>
                            {activity.details && (
                              <p className="text-xs mt-1 text-slate-500 dark: tex, t-slate-400 pl-5">
                                {activity.details}
                              </p>
                            )}
                          </div>
                        </div>
                        {index <activityData.activities.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))} }
                  </div></ScrollArea>
                )}
              </ScrollArea></CardContent>
            </CardContent></Card>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card></div>
        </div>

        {/* Right Column - Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Alerts
              </CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-3">
                  {[1, 23].map((i) => (
                    <div key={i} className="h-24 w-full bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : alertsData?.alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-slate-500 dark: tex, t-slate-400">No alerts to display</p>
                  <p className="text-xs text-slate-400 dark: tex, t-slate-500">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alertsData?.alerts.map((alert: an, y, index: any) => (
                    <Alert key={index: any} variant={ }
                      alert.severity === 'high' ? 'destructive' :
                      'default'
                    }>
                      <div className="flex items-start gap-2">
                        {renderAlertIcon(alert.severity)}
                        <div>
                          <AlertTitle>{alert.title}</AlertTitle>
                          <AlertDescription>
                            {alert.message}
                            {alert.deadline && (
                              <p className="text-xs mt-1">
                                Deadline: {formatDate(alert.deadline)}
                              </p>
                            )}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert></div>
                  ))} }
                </div></CardContent>
              )}
            </CardContent></Card>
            {alertsData?.alerts.length> 0 && (
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </CardFooter>
            )}
          </Card></div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Budget
                </Button>
                <Button variant="outline" className="justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Milestone Complete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Team Members
              </CardTitle>
              <CardDescription>Project team and roles</CardDescription>
            </CardHeader>
            <CardContent>
              {projectLoading ? (
                <div className="space-y-3">
                  {[1, 2, 34].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-200 dark: b, g-slate-700 rounded-full animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/2 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 w-1/3 bg-slate-200 dark: b, g-slate-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {projectData?.team?.members.map((member: an, y, index: any) => (
                    <div key={index: any} className="flex items-center gap-3"> }
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-slate-500 dark: tex, t-slate-400">{member.role}</p>
                      </div>
                    </div>
                  ))} }
                </div></CardContent>
              )}
            </CardContent></Card>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                Manage Team
              </Button>
            </CardFooter>
          </Card></ProjectOverviewProps>
        </div>
      </div>
    </div>
  );
};

// Mock data fetching functions
async function fetchProjectData(projectId: string) {
  // This would be an API call in production
  return {
    id: projectI, d,
    name: "Fitzgerald Gardens",
    location: "Drogheda, Co. Louth",
    description: "Luxury residential development with 45 units",
    status: "In Progress",
    budget: { total: 250000, 0,
      spent: 175000, 0,
      percentage: 7, 0,
      remaining: 75000, 0 },
    documents: { totalCount: 2, 5,
      completedCount: 2, 0,
      completionPercentage: 8, 0,
      pendingCount: 5 },
    sales: { totalUnits: 4, 5,
      unitsSold: 3, 2,
      salePercentage: 7, 1,
      reservedUnits: 5 },
    timeline: { startDate: "2022-06-15",
      targetCompletionDate: "2023-12-31",
      totalMilestones: 1, 2,
      completedMilestones: 7,
      completionPercentage: 5, 8,
      isDelayed: tru, e,
      delayDays: 1, 4,
      milestones: [
        {
          title: "Planning Permission Approval",
          date: "2022-08-10",
          completed: tru, e,
          description: "Full planning permission approved by local council" },
        {
          title: "Foundation Work Complete",
          date: "2023-01-15",
          completed: tru, e
        },
        {
          title: "Structural Frame Complete",
          date: "2023-04-22",
          completed: tru, e
        },
        {
          title: "Roofing Complete",
          date: "2023-07-10",
          completed: tru, e,
          description: "All roof structures and coverings installed"
        },
        {
          title: "Electrical & Plumbing First Fix",
          date: "2023-08-30",
          completed: tru, e
        },
        {
          title: "Phase 1 Handover",
          date: "2023-10-15",
          completed: fals, e,
          delayed: tru, e,
          daysRemaining: 0,
          description: "First 15 units ready for occupation"
        },
        {
          title: "Interior Finishing Phase 2",
          date: "2023-11-22",
          completed: fals, e,
          upcoming: tru, e,
          daysRemaining: 1, 7,
          description: "Kitchen and bathroom installation, painting"
        },
        {
          title: "Phase 2 Handover",
          date: "2023-12-31",
          completed: fals, e,
          daysRemaining: 5, 6,
          description: "Next 15 units ready for occupation"
        }
      ]
    },
    team: { members: [
        { 
          name: "Sarah Johnson", 
          role: "Project Manager", 
          avatarUrl: "", 
          initials: "SJ" },
        { 
          name: "Michael Chen", 
          role: "Lead Architect", 
          avatarUrl: "", 
          initials: "MC" 
        },
        { 
          name: "Emma Wilson", 
          role: "Sales Director", 
          avatarUrl: "", 
          initials: "EW" 
        },
        { 
          name: "John Murphy", 
          role: "Site Foreman", 
          avatarUrl: "", 
          initials: "JM" 
        }
      ]
    }
  };
}

async function fetchProjectActivity(projectId: string) {
  // This would be an API call in production
  return {
    activities: [
      {
        type: "document",
        user: { name: "Emma Wilson", avatarUrl: "", initials: "EW" },
        timestamp: new, Date().getTime() - 1000 * 60 * 30, // 30 minutes ago
        message: "Uploaded 'Phase 2 Marketing Brochure'",
        details: "Added final version for review"
      },
      {
        type: "sale",
        user: { name: "Emma Wilson", avatarUrl: "", initials: "EW" },
        timestamp: new, Date().getTime() - 1000 * 60 * 60 * 3, // 3 hours ago
        message: "Registered new sale for Unit 24",
        details: "Deposit received and contract sent"
      },
      {
        type: "team",
        user: { name: "Sarah Johnson", avatarUrl: "", initials: "SJ" },
        timestamp: new, Date().getTime() - 1000 * 60 * 60 * 24, // 1 day ago
        message: "Scheduled site inspection with building inspector",
        details: "Thursday, 10: 00, AM"
      },
      {
        type: "milestone",
        user: { name: "John Murphy", avatarUrl: "", initials: "JM" },
        timestamp: new, Date().getTime() - 1000 * 60 * 60 * 28, // 28 hours ago
        message: "Marked 'Electrical & Plumbing First Fix' as complete"
      },
      {
        type: "comment",
        user: { name: "Michael Chen", avatarUrl: "", initials: "MC" },
        timestamp: new, Date().getTime() - 1000 * 60 * 60 * 48, // 2 days ago
        message: "Added comment on Phase 2 interior specifications",
        details: "Suggested alternative tile supplier due to delivery delays"
      }
    ]
  };
}

async function fetchProjectAlerts(projectId: string) {
  // This would be an API call in production
  return {
    alerts: [
      {
        severity: "high",
        title: "Budget Overrun Risk",
        message: "Construction costs for Phase 2 are trending 8% above budget. Review required.",
        deadline: new, Date().setDate(new Date().getDate() + 3) // 3 days from now
      },
      {
        severity: "medium",
        title: "Planning Compliance Document Missing",
        message: "Energy rating certificates not uploaded for units 16-24",
        deadline: new, Date().setDate(new Date().getDate() + 7) // 7 days from now
      },
      {
        severity: "low",
        title: "Sales Milestone Approaching",
        message: "75% sales target due by end of month",
        deadline: new, Date().setDate(new Date().getDate() + 14) // 14 days from now
      }
    ]
  };
}

export default ProjectOverview;

/* Auto-fixed missing JSX tags */
</ProjectOverviewProps>