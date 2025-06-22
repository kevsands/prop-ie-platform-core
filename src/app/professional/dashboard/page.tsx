/**
 * Professional Dashboard Page
 * 
 * Week 3 Implementation: Professional Role Integration
 * Main dashboard for professional role management and coordination
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProfessionalRoleAssignment from '@/components/professional/ProfessionalRoleAssignment';
import CertificationManagementDashboard from '@/components/professional/CertificationManagementDashboard';
import ProfessionalWorkflowTemplates from '@/components/professional/ProfessionalWorkflowTemplates';
import ProfessionalDirectory from '@/components/professional/ProfessionalDirectory';
import ProfessionalEcosystemDashboard from '@/components/professional/ProfessionalEcosystemDashboard';
import {
  User, Award, Workflow, Users, BarChart3, Settings,
  CheckCircle, AlertTriangle, Clock, TrendingUp, Bell,
  Shield, Briefcase, GraduationCap, Building2
} from 'lucide-react';

interface ProfessionalDashboardStats {
  profileCompletion: number;
  verificationStatus: 'verified' | 'pending' | 'incomplete';
  activeTasks: number;
  completedTasks: number;
  certificationsExpiringSoon: number;
  activeCollaborations: number;
  weeklyHours: number;
  clientSatisfaction: number;
}

const ProfessionalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('BUYER_SOLICITOR'); // This would come from auth context
  const [userId] = useState('user-123'); // This would come from auth context
  const [stats, setStats] = useState<ProfessionalDashboardStats>({
    profileCompletion: 78,
    verificationStatus: 'pending',
    activeTasks: 12,
    completedTasks: 145,
    certificationsExpiringSoon: 2,
    activeCollaborations: 8,
    weeklyHours: 35,
    clientSatisfaction: 4.8
  });

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'warning',
      title: 'Certification Expiring Soon',
      message: 'Your BER Assessor certification expires in 45 days',
      action: 'Renew Now'
    },
    {
      id: '2',
      type: 'info',
      title: 'Profile Incomplete',
      message: 'Complete your professional profile to improve visibility',
      action: 'Complete Profile'
    }
  ]);

  // Mock data - in real implementation would fetch from API
  useEffect(() => {
    // Fetch user professional data
    const fetchProfessionalData = async () => {
      try {
        // const response = await fetch('/api/professional/roles?action=get_profile&userId=' + userId);
        // const data = await response.json();
        // setStats(data.stats);
        // setAlerts(data.alerts);
      } catch (error) {
        console.error('Error fetching professional data:', error);
      }
    };

    fetchProfessionalData();
  }, [userId]);

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending Verification
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Incomplete
        </Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Professional Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your professional roles, certifications, and collaborations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getVerificationStatusBadge(stats.verificationStatus)}
            <Badge variant="outline">
              Profile {stats.profileCompletion}% Complete
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.slice(0, 2).map((alert) => (
              <Alert key={alert.id} className={`${
                alert.type === 'warning' ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    ) : (
                      <Bell className="h-4 w-4 text-blue-500 mt-0.5" />
                    )}
                    <div>
                      <AlertDescription className="font-medium">
                        {alert.title}
                      </AlertDescription>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.activeTasks}</p>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.activeCollaborations}</p>
                  <p className="text-sm text-muted-foreground">Collaborations</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.clientSatisfaction}</p>
                  <p className="text-sm text-muted-foreground">Client Rating</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="ecosystem" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Ecosystem
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Professional Roles</span>
                      <span className="text-sm font-medium">Complete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Certifications</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Professional Bio</span>
                      <span className="text-sm font-medium">Incomplete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Portfolio</span>
                      <span className="text-sm font-medium">Incomplete</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed property survey</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 border rounded">
                      <Award className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Certification renewed</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 border rounded">
                      <Users className="h-4 w-4 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Joined new collaboration</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.weeklyHours}h</p>
                    <p className="text-sm text-muted-foreground">Hours Worked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">New Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Roles Tab */}
          <TabsContent value="roles">
            <ProfessionalRoleAssignment userId={userId} />
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <CertificationManagementDashboard userId={userId} />
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <ProfessionalWorkflowTemplates userRole={userRole} />
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory">
            <ProfessionalDirectory />
          </TabsContent>

          {/* Ecosystem Tab */}
          <TabsContent value="ecosystem">
            <ProfessionalEcosystemDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;