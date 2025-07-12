'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Building2, 
  Euro, 
  FileText, 
  TrendingUp, 
  Users,
  Calendar,
  Clock,
  CheckCircle,
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
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * Developer Team Management - Quantity Surveyors
 * 
 * Manage QS teams across all developer projects from the developer dashboard.
 * Shows which QS's are working on which projects, their workload, performance,
 * and provides navigation to individual QS dashboards.
 */

interface QuantitySurveyor {
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
}

export default function DeveloperQuantitySurveyorManagement() {
  const [selectedQS, setSelectedQS] = useState<string | null>(null);

  // Real QS data across developer projects
  const quantitySurveyors: QuantitySurveyor[] = useMemo(() => [
    {
      id: 'qs-1',
      name: 'David O\'Brien',
      company: 'O\'Brien Quantity Surveying',
      qualifications: ['SCSI', 'RICS', 'MSc Construction'],
      activeProjects: ['Fitzgerald Gardens', 'Ellwood Development'],
      currentWorkload: 85,
      performance: 4.8,
      specializations: ['Residential', 'Cost Management', 'BOQ', 'Valuations'],
      contact: {
        email: 'david@obrienqs.ie',
        phone: '+353 1 234 5678'
      },
      status: 'busy',
      dashboardUrl: '/quantity-surveyor/cost-management'
    },
    {
      id: 'qs-2', 
      name: 'Sarah Murphy',
      company: 'Murphy Cost Consultants',
      qualifications: ['SCSI', 'BSc Quantity Surveying'],
      activeProjects: ['Ballymakenny View'],
      currentWorkload: 65,
      performance: 4.5,
      specializations: ['Commercial', 'Project Management', 'Risk Assessment'],
      contact: {
        email: 'sarah@murphycost.ie',
        phone: '+353 1 234 5679'
      },
      status: 'available',
      dashboardUrl: '/quantity-surveyor/cost-management'
    },
    {
      id: 'qs-3',
      name: 'Michael Collins',
      company: 'Collins & Associates QS',
      qualifications: ['RICS', 'SCSI', 'PQS'],
      activeProjects: ['Fitzgerald Gardens'],
      currentWorkload: 70,
      performance: 4.6,
      specializations: ['Infrastructure', 'Civil Works', 'Contract Administration'],
      contact: {
        email: 'michael@collinsqs.ie',
        phone: '+353 1 234 5680'
      },
      status: 'available',
      dashboardUrl: '/quantity-surveyor/cost-management'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quantity Surveyors</h1>
          <p className="text-gray-600">Manage QS teams across all developer projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-800">
            <Calculator className="h-3 w-3 mr-1" />
            {quantitySurveyors.length} QS Active
          </Badge>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Find New QS
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{quantitySurveyors.length}</p>
                <p className="text-sm text-muted-foreground">Active QS</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
              <Building2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">73%</p>
                <p className="text-sm text-muted-foreground">Avg Workload</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">4.6</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QS Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {quantitySurveyors.map((qs) => (
          <Card key={qs.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{qs.name}</CardTitle>
                  <p className="text-sm text-gray-600">{qs.company}</p>
                </div>
                <Badge className={getStatusColor(qs.status)}>
                  {qs.status}
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
                    <span className="font-medium">{qs.performance}/5</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Workload</span>
                    <span className={`text-sm font-medium ${getWorkloadColor(qs.currentWorkload)}`}>
                      {qs.currentWorkload}%
                    </span>
                  </div>
                  <Progress value={qs.currentWorkload} className="h-2" />
                </div>
              </div>

              {/* Active Projects */}
              <div>
                <h4 className="text-sm font-medium mb-2">Active Projects</h4>
                <div className="space-y-1">
                  {qs.activeProjects.map((project, index) => (
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
                  {qs.qualifications.map((qual, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={qs.dashboardUrl} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    QS Dashboard
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

      {/* Project Assignment Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Project Assignment Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">QS Name</th>
                  <th className="text-center p-3">Fitzgerald Gardens</th>
                  <th className="text-center p-3">Ellwood Development</th>
                  <th className="text-center p-3">Ballymakenny View</th>
                  <th className="text-center p-3">Total Workload</th>
                </tr>
              </thead>
              <tbody>
                {quantitySurveyors.map((qs) => (
                  <tr key={qs.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{qs.name}</div>
                        <div className="text-sm text-gray-600">{qs.company}</div>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      {qs.activeProjects.includes('Fitzgerald Gardens') ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="text-gray-300">-</div>
                      )}
                    </td>
                    <td className="text-center p-3">
                      {qs.activeProjects.includes('Ellwood Development') ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="text-gray-300">-</div>
                      )}
                    </td>
                    <td className="text-center p-3">
                      {qs.activeProjects.includes('Ballymakenny View') ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="text-gray-300">-</div>
                      )}
                    </td>
                    <td className="text-center p-3">
                      <span className={`font-medium ${getWorkloadColor(qs.currentWorkload)}`}>
                        {qs.currentWorkload}%
                      </span>
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
                <Calculator className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">QS Integration Active</h3>
                <p className="text-blue-700">
                  All quantity surveyors are integrated with developer project management
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