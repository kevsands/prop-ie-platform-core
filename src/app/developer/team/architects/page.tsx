'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  PenTool, 
  FileText, 
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
  Shield,
  MapPin,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * Developer Team Management - Architects
 * 
 * Manage architect teams across all developer projects from the developer dashboard.
 * Shows which architects are working on which projects, their design stages,
 * planning applications, and provides navigation to individual architect dashboards.
 */

interface Architect {
  id: string;
  name: string;
  company: string;
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
  planningApplications: number;
}

export default function DeveloperArchitectManagement() {
  const [selectedArchitect, setSelectedArchitect] = useState<string | null>(null);

  // Real architect data across developer projects
  const architects: Architect[] = useMemo(() => [
    {
      id: 'arch-1',
      name: 'Michael McCarthy',
      company: 'Brady Hughes Consulting',
      qualifications: ['MRIAI', 'ARB Registration', 'BSc Architecture'],
      activeProjects: ['Fitzgerald Gardens', 'Ellwood Development'],
      currentWorkload: 90,
      performance: 4.8,
      specializations: ['Residential', 'Planning Applications', 'PSDP Services', 'BIM'],
      contact: {
        email: 'michael@bradyhughes.ie',
        phone: '+353 1 234 5678'
      },
      status: 'busy',
      dashboardUrl: '/architect/coordination',
      currentStage: 'Developed Design',
      planningApplications: 3
    },
    {
      id: 'arch-2', 
      name: 'Emma Sullivan',
      company: 'Sullivan Architecture',
      qualifications: ['RIAI', 'MSc Urban Design'],
      activeProjects: ['Ballymakenny View'],
      currentWorkload: 70,
      performance: 4.6,
      specializations: ['Commercial', 'Urban Design', 'Sustainability', 'Conservation'],
      contact: {
        email: 'emma@sullivanarch.ie',
        phone: '+353 1 234 5679'
      },
      status: 'available',
      dashboardUrl: '/architect/coordination',
      currentStage: 'Concept Design',
      planningApplications: 1
    },
    {
      id: 'arch-3',
      name: 'David Chen',
      company: 'Chen Design Studio',
      qualifications: ['RIAI', 'LEED AP', 'PhD Architecture'],
      activeProjects: ['Fitzgerald Gardens'],
      currentWorkload: 65,
      performance: 4.7,
      specializations: ['Landscape Architecture', 'Green Buildings', 'Masterplanning'],
      contact: {
        email: 'david@chendesign.ie',
        phone: '+353 1 234 5680'
      },
      status: 'available',
      dashboardUrl: '/architect/coordination',
      currentStage: 'Technical Design',
      planningApplications: 2
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Concept Design': return 'bg-blue-100 text-blue-800';
      case 'Developed Design': return 'bg-purple-100 text-purple-800';
      case 'Technical Design': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Architects</h1>
          <p className="text-gray-600">Manage architect teams across all developer projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-800">
            <Building2 className="h-3 w-3 mr-1" />
            {architects.length} Architects Active
          </Badge>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Find New Architect
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{architects.length}</p>
                <p className="text-sm text-muted-foreground">Active Architects</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
              <PenTool className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">Planning Apps</p>
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

      {/* Architect Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {architects.map((architect) => (
          <Card key={architect.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{architect.name}</CardTitle>
                  <p className="text-sm text-gray-600">{architect.company}</p>
                </div>
                <Badge className={getStatusColor(architect.status)}>
                  {architect.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance & Workload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Performance</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{architect.performance}/5</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Workload</span>
                    <span className={`text-sm font-medium ${getWorkloadColor(architect.currentWorkload)}`}>
                      {architect.currentWorkload}%
                    </span>
                  </div>
                  <Progress value={architect.currentWorkload} className="h-2" />
                </div>
              </div>

              {/* Current Stage */}
              <div>
                <h4 className="text-sm font-medium mb-2">Current Stage</h4>
                <Badge className={getStageColor(architect.currentStage)}>
                  <Layers className="h-3 w-3 mr-1" />
                  {architect.currentStage}
                </Badge>
              </div>

              {/* Active Projects */}
              <div>
                <h4 className="text-sm font-medium mb-2">Active Projects</h4>
                <div className="space-y-1">
                  {architect.activeProjects.map((project, index) => (
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

              {/* Planning Applications */}
              <div>
                <h4 className="text-sm font-medium mb-2">Planning Applications</h4>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{architect.planningApplications} Active</span>
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="text-sm font-medium mb-2">Qualifications</h4>
                <div className="flex flex-wrap gap-1">
                  {architect.qualifications.map((qual, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={architect.dashboardUrl} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    Architect Dashboard
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
        ))}
      </div>

      {/* Design Stage Progress Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Design Stage Progress Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Architect</th>
                  <th className="text-center p-3">Concept</th>
                  <th className="text-center p-3">Developed</th>
                  <th className="text-center p-3">Technical</th>
                  <th className="text-center p-3">Current Stage</th>
                  <th className="text-center p-3">Planning Apps</th>
                </tr>
              </thead>
              <tbody>
                {architects.map((architect) => (
                  <tr key={architect.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{architect.name}</div>
                        <div className="text-sm text-gray-600">{architect.company}</div>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center p-3">
                      {architect.currentStage === 'Developed Design' ? (
                        <Activity className="h-5 w-5 text-blue-500 mx-auto" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-3">
                      {architect.currentStage === 'Technical Design' ? (
                        <Activity className="h-5 w-5 text-blue-500 mx-auto" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-3">
                      <Badge className={getStageColor(architect.currentStage)}>
                        {architect.currentStage}
                      </Badge>
                    </td>
                    <td className="text-center p-3">
                      <span className="font-medium">{architect.planningApplications}</span>
                    </td>
                  </tr>
                ))}
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
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Architect Integration Active</h3>
                <p className="text-blue-700">
                  All architects are integrated with developer project management and planning coordination
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