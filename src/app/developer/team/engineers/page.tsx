'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Building, 
  Droplets,
  Thermometer,
  Shield,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  BarChart3,
  Edit,
  Eye,
  Phone,
  Mail,
  Star,
  Award,
  FileText,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * Developer Team Management - Engineers
 * 
 * Manage engineer teams across all developer projects from the developer dashboard.
 * Shows which engineers are working on which projects, their disciplines,
 * engineering stages, deliverables, and provides navigation to individual engineer dashboards.
 */

interface Engineer {
  id: string;
  name: string;
  company: string;
  discipline: 'structural' | 'civil' | 'mechanical' | 'electrical' | 'plumbing' | 'environmental';
  qualifications: string[];
  activeProjects: string[];
  currentWorkload: number;
  performance: number;
  specializations: string[];
  contact: {
    email: string;
    phone: string;
  };
  status: 'available' | 'busy' | 'unavailable';
  dashboardUrl: string;
  currentStage: string;
  deliverables: number;
}

export default function DeveloperEngineerManagement() {
  const [selectedEngineer, setSelectedEngineer] = useState<string | null>(null);

  // Real engineer data across developer projects
  const engineers: Engineer[] = useMemo(() => [
    {
      id: 'eng-1',
      name: 'Patrick O\'Connor',
      company: 'O\'Connor & Associates',
      discipline: 'structural',
      qualifications: ['Chartered Engineer', 'Engineers Ireland', 'MSc Structural'],
      activeProjects: ['Fitzgerald Gardens', 'Ellwood Development'],
      currentWorkload: 85,
      performance: 4.7,
      specializations: ['Concrete Design', 'Steel Structures', 'Foundation Design', 'Seismic Analysis'],
      contact: {
        email: 'patrick@oconnoreng.ie',
        phone: '+353 1 234 5678'
      },
      status: 'busy',
      dashboardUrl: '/engineer/coordination',
      currentStage: 'Structural Analysis',
      deliverables: 12
    },
    {
      id: 'eng-2', 
      name: 'Sarah Kelly',
      company: 'Irish Civil Engineering',
      discipline: 'civil',
      qualifications: ['Chartered Engineer', 'MICE', 'BSc Civil Engineering'],
      activeProjects: ['Ballymakenny View'],
      currentWorkload: 70,
      performance: 4.5,
      specializations: ['Site Development', 'Drainage', 'Road Design', 'Infrastructure'],
      contact: {
        email: 'sarah@irishcivil.ie',
        phone: '+353 1 234 5679'
      },
      status: 'available',
      dashboardUrl: '/engineer/coordination',
      currentStage: 'Site Survey',
      deliverables: 8
    },
    {
      id: 'eng-3',
      name: 'James Murphy',
      company: 'MEP Solutions Ireland',
      discipline: 'mechanical',
      qualifications: ['Chartered Engineer', 'CIBSE', 'MEng Mechanical'],
      activeProjects: ['Fitzgerald Gardens'],
      currentWorkload: 75,
      performance: 4.6,
      specializations: ['HVAC Systems', 'Energy Efficiency', 'Building Services', 'Sustainability'],
      contact: {
        email: 'james@mepsolutions.ie',
        phone: '+353 1 234 5680'
      },
      status: 'available',
      dashboardUrl: '/engineer/coordination',
      currentStage: 'MEP Design',
      deliverables: 15
    },
    {
      id: 'eng-4',
      name: 'Lisa Walsh',
      company: 'Walsh Electrical Engineering',
      discipline: 'electrical',
      qualifications: ['Chartered Engineer', 'Engineers Ireland', 'Electrical Safety'],
      activeProjects: ['Fitzgerald Gardens', 'Ellwood Development'],
      currentWorkload: 80,
      performance: 4.8,
      specializations: ['Power Systems', 'Lighting Design', 'Fire Alarm Systems', 'Smart Buildings'],
      contact: {
        email: 'lisa@walshelectrical.ie',
        phone: '+353 1 234 5681'
      },
      status: 'busy',
      dashboardUrl: '/engineer/coordination',
      currentStage: 'Electrical Design',
      deliverables: 10
    }
  ], []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'text-red-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'structural': return Building;
      case 'civil': return Building;
      case 'mechanical': return Thermometer;
      case 'electrical': return Zap;
      case 'plumbing': return Droplets;
      case 'environmental': return Shield;
      default: return Wrench;
    }
  };

  const getDisciplineColor = (discipline: string) => {
    switch (discipline) {
      case 'structural': return 'bg-blue-100 text-blue-800';
      case 'civil': return 'bg-green-100 text-green-800';
      case 'mechanical': return 'bg-orange-100 text-orange-800';
      case 'electrical': return 'bg-yellow-100 text-yellow-800';
      case 'plumbing': return 'bg-cyan-100 text-cyan-800';
      case 'environmental': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engineers</h1>
          <p className="text-gray-600">Manage engineering teams across all developer projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-800">
            <Wrench className="h-3 w-3 mr-1" />
            {engineers.length} Engineers Active
          </Badge>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Find New Engineer
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{engineers.length}</p>
                <p className="text-sm text-muted-foreground">Active Engineers</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">Disciplines</p>
              </div>
              <Cpu className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Deliverables</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">4.7</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineer Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {engineers.map((engineer) => {
          const DisciplineIcon = getDisciplineIcon(engineer.discipline);
          return (
            <Card key={engineer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{engineer.name}</CardTitle>
                    <p className="text-sm text-gray-600">{engineer.company}</p>
                  </div>
                  <Badge className={getStatusColor(engineer.status)}>
                    {engineer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discipline & Performance */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getDisciplineColor(engineer.discipline)}>
                      <DisciplineIcon className="h-3 w-3 mr-1" />
                      {engineer.discipline.charAt(0).toUpperCase() + engineer.discipline.slice(1)}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{engineer.performance}/5</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Workload</span>
                      <span className={`text-sm font-medium ${getWorkloadColor(engineer.currentWorkload)}`}>
                        {engineer.currentWorkload}%
                      </span>
                    </div>
                    <Progress value={engineer.currentWorkload} className="h-2" />
                  </div>
                </div>

                {/* Current Stage & Deliverables */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Current Stage</h4>
                    <p className="text-sm text-gray-600">{engineer.currentStage}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-medium">Deliverables</h4>
                    <p className="text-sm text-gray-600">{engineer.deliverables} Active</p>
                  </div>
                </div>

                {/* Active Projects */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Active Projects</h4>
                  <div className="space-y-1">
                    {engineer.activeProjects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{project}</span>
                        <Link 
                          href={`/developer/projects/${project.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Qualifications</h4>
                  <div className="flex flex-wrap gap-1">
                    {engineer.qualifications.slice(0, 2).map((qual, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {qual}
                      </Badge>
                    ))}
                    {engineer.qualifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{engineer.qualifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={engineer.dashboardUrl} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      Engineer Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Mail className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Discipline Distribution Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Engineering Discipline Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Engineer</th>
                  <th className="text-center p-3">Discipline</th>
                  <th className="text-center p-3">Fitzgerald Gardens</th>
                  <th className="text-center p-3">Ellwood Development</th>
                  <th className="text-center p-3">Ballymakenny View</th>
                  <th className="text-center p-3">Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {engineers.map((engineer) => {
                  const DisciplineIcon = getDisciplineIcon(engineer.discipline);
                  return (
                    <tr key={engineer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{engineer.name}</div>
                          <div className="text-sm text-gray-600">{engineer.company}</div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge className={getDisciplineColor(engineer.discipline)}>
                          <DisciplineIcon className="h-3 w-3 mr-1" />
                          {engineer.discipline.charAt(0).toUpperCase() + engineer.discipline.slice(1)}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        {engineer.activeProjects.includes('Fitzgerald Gardens') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {engineer.activeProjects.includes('Ellwood Development') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {engineer.activeProjects.includes('Ballymakenny View') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium">{engineer.deliverables}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Integration Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-lg mr-4">
                <Wrench className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Engineering Integration Active</h3>
                <p className="text-blue-700">
                  All engineering disciplines are integrated with developer project coordination
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">100%</div>
              <div className="text-blue-700 text-sm">Integration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}