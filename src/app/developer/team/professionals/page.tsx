'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Award,
  Users,
  Calculator,
  Building2,
  Wrench,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  BarChart3,
  Eye,
  Phone,
  Mail,
  Star,
  MapPin,
  FileText,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

/**
 * Developer Team Management - All Professionals
 * 
 * Unified view of all professional types working across developer projects.
 * Provides comprehensive management of quantity surveyors, architects, and engineers
 * from the developer dashboard with cross-project coordination and performance tracking.
 */

interface Professional {
  id: string;
  name: string;
  company: string;
  type: 'quantity-surveyor' | 'architect' | 'engineer';
  discipline?: string;
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
  location: string;
  yearsExperience: number;
  certifications: string[];
  lastActive: string;
}

export default function DeveloperAllProfessionalsManagement() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);

  // Comprehensive professional data across all types
  const allProfessionals: Professional[] = useMemo(() => [
    // Quantity Surveyors
    {
      id: 'qs-1',
      name: 'Michael O\'Brien',
      company: 'Byrne Wallace Quantity Surveyors',
      type: 'quantity-surveyor',
      qualifications: ['SCSI', 'RICS', 'MSc QS'],
      activeProjects: ['Fitzgerald Gardens', 'Ellwood Development'],
      currentWorkload: 85,
      performance: 4.8,
      specializations: ['Cost Planning', 'Value Engineering', 'Contract Administration', 'Risk Management'],
      contact: {
        email: 'michael@byrnewalllace.ie',
        phone: '+353 1 234 5670'
      },
      status: 'busy',
      dashboardUrl: '/quantity-surveyor/cost-management',
      currentStage: 'Cost Monitoring',
      deliverables: 18,
      location: 'Dublin',
      yearsExperience: 12,
      certifications: ['SCSI', 'RICS'],
      lastActive: '2 hours ago'
    },
    {
      id: 'qs-2',
      name: 'Sarah Murphy',
      company: 'Precision Cost Consultants',
      type: 'quantity-surveyor',
      qualifications: ['SCSI', 'RICS', 'BSc QS'],
      activeProjects: ['Ballymakenny View'],
      currentWorkload: 70,
      performance: 4.6,
      specializations: ['Procurement', 'Cost Control', 'Feasibility Studies'],
      contact: {
        email: 'sarah@precisioncost.ie',
        phone: '+353 1 234 5671'
      },
      status: 'available',
      dashboardUrl: '/quantity-surveyor/cost-management',
      currentStage: 'Tender Analysis',
      deliverables: 12,
      location: 'Cork',
      yearsExperience: 8,
      certifications: ['SCSI', 'RICS'],
      lastActive: '1 hour ago'
    },
    // Architects
    {
      id: 'arch-1',
      name: 'Emma Collins',
      company: 'Collins Design Studio',
      type: 'architect',
      qualifications: ['RIAI', 'ARB', 'MArch'],
      activeProjects: ['Fitzgerald Gardens', 'Ballymakenny View'],
      currentWorkload: 80,
      performance: 4.7,
      specializations: ['Residential Design', 'Planning Applications', 'Sustainable Design', 'BIM Management'],
      contact: {
        email: 'emma@collinsdesign.ie',
        phone: '+353 1 234 5672'
      },
      status: 'busy',
      dashboardUrl: '/architect/coordination',
      currentStage: 'Design Development',
      deliverables: 15,
      location: 'Dublin',
      yearsExperience: 10,
      certifications: ['RIAI', 'ARB'],
      lastActive: '30 minutes ago'
    },
    {
      id: 'arch-2',
      name: 'David Walsh',
      company: 'Heritage Architecture',
      type: 'architect',
      qualifications: ['RIAI', 'ARB', 'MSc Architecture'],
      activeProjects: ['Ellwood Development'],
      currentWorkload: 65,
      performance: 4.5,
      specializations: ['Conservation', 'Urban Planning', 'Historical Restoration'],
      contact: {
        email: 'david@heritagearch.ie',
        phone: '+353 1 234 5673'
      },
      status: 'available',
      dashboardUrl: '/architect/coordination',
      currentStage: 'Planning Permission',
      deliverables: 9,
      location: 'Galway',
      yearsExperience: 15,
      certifications: ['RIAI', 'ARB'],
      lastActive: '4 hours ago'
    },
    // Engineers
    {
      id: 'eng-1',
      name: 'Patrick O\'Connor',
      company: 'O\'Connor & Associates',
      type: 'engineer',
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
      deliverables: 12,
      location: 'Dublin',
      yearsExperience: 18,
      certifications: ['Engineers Ireland'],
      lastActive: '1 hour ago'
    },
    {
      id: 'eng-2',
      name: 'Lisa Walsh',
      company: 'Walsh Electrical Engineering',
      type: 'engineer',
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
      deliverables: 10,
      location: 'Dublin',
      yearsExperience: 14,
      certifications: ['Engineers Ireland'],
      lastActive: '2 hours ago'
    }
  ], []);

  // Filter professionals based on search and type
  const filteredProfessionals = useMemo(() => {
    let filtered = allProfessionals;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(professional => professional.type === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(professional =>
        professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [allProfessionals, selectedFilter, searchQuery]);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quantity-surveyor': return Calculator;
      case 'architect': return Building2;
      case 'engineer': return Wrench;
      default: return Award;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quantity-surveyor': return 'bg-blue-100 text-blue-800';
      case 'architect': return 'bg-purple-100 text-purple-800';
      case 'engineer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'quantity-surveyor': return 'Quantity Surveyor';
      case 'architect': return 'Architect';
      case 'engineer': return 'Engineer';
      default: return 'Professional';
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return {
      total: allProfessionals.length,
      quantitySurveyors: allProfessionals.filter(p => p.type === 'quantity-surveyor').length,
      architects: allProfessionals.filter(p => p.type === 'architect').length,
      engineers: allProfessionals.filter(p => p.type === 'engineer').length,
      avgPerformance: (allProfessionals.reduce((acc, p) => acc + p.performance, 0) / allProfessionals.length).toFixed(1),
      avgWorkload: Math.round(allProfessionals.reduce((acc, p) => acc + p.currentWorkload, 0) / allProfessionals.length),
      totalDeliverables: allProfessionals.reduce((acc, p) => acc + p.deliverables, 0)
    };
  }, [allProfessionals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Professionals</h1>
          <p className="text-gray-600">Comprehensive management of all professional teams across developer projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-100 text-emerald-800">
            <Award className="h-3 w-3 mr-1" />
            {summaryStats.total} Professionals Active
          </Badge>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Find New Professional
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{summaryStats.quantitySurveyors}</p>
                <p className="text-sm text-muted-foreground">Quantity Surveyors</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{summaryStats.architects}</p>
                <p className="text-sm text-muted-foreground">Architects</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{summaryStats.engineers}</p>
                <p className="text-sm text-muted-foreground">Engineers</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{summaryStats.avgPerformance}</p>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search professionals by name, company, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All ({summaryStats.total})
          </Button>
          <Button
            variant={selectedFilter === 'quantity-surveyor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('quantity-surveyor')}
          >
            <Calculator className="h-3 w-3 mr-1" />
            QS ({summaryStats.quantitySurveyors})
          </Button>
          <Button
            variant={selectedFilter === 'architect' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('architect')}
          >
            <Building2 className="h-3 w-3 mr-1" />
            Architects ({summaryStats.architects})
          </Button>
          <Button
            variant={selectedFilter === 'engineer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('engineer')}
          >
            <Wrench className="h-3 w-3 mr-1" />
            Engineers ({summaryStats.engineers})
          </Button>
        </div>
      </div>

      {/* Professional Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProfessionals.map((professional) => {
          const TypeIcon = getTypeIcon(professional.type);
          return (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{professional.name}</CardTitle>
                    <p className="text-sm text-gray-600">{professional.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{professional.location}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{professional.yearsExperience}y exp</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(professional.status)}>
                    {professional.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Professional Type & Performance */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(professional.type)}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {getTypeName(professional.type)}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{professional.performance}/5</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Workload</span>
                      <span className={`text-sm font-medium ${getWorkloadColor(professional.currentWorkload)}`}>
                        {professional.currentWorkload}%
                      </span>
                    </div>
                    <Progress value={professional.currentWorkload} className="h-2" />
                  </div>
                </div>

                {/* Current Stage & Deliverables */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Current Stage</h4>
                    <p className="text-sm text-gray-600">{professional.currentStage}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-medium">Deliverables</h4>
                    <p className="text-sm text-gray-600">{professional.deliverables} Active</p>
                  </div>
                </div>

                {/* Active Projects */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Active Projects</h4>
                  <div className="space-y-1">
                    {professional.activeProjects.map((project, index) => (
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

                {/* Specializations */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {professional.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {professional.specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{professional.specializations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Active */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last active: {professional.lastActive}</span>
                  <Activity className="h-3 w-3" />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={professional.dashboardUrl} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      View Dashboard
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

      {/* Professional Distribution Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Professional Distribution Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Professional</th>
                  <th className="text-center p-3">Type</th>
                  <th className="text-center p-3">Fitzgerald Gardens</th>
                  <th className="text-center p-3">Ellwood Development</th>
                  <th className="text-center p-3">Ballymakenny View</th>
                  <th className="text-center p-3">Workload</th>
                  <th className="text-center p-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfessionals.map((professional) => {
                  const TypeIcon = getTypeIcon(professional.type);
                  return (
                    <tr key={professional.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{professional.name}</div>
                          <div className="text-sm text-gray-600">{professional.company}</div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge className={getTypeColor(professional.type)}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {getTypeName(professional.type)}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        {professional.activeProjects.includes('Fitzgerald Gardens') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {professional.activeProjects.includes('Ellwood Development') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                      <td className="text-center p-3">
                        {professional.activeProjects.includes('Ballymakenny View') ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                      <td className="text-center p-3">
                        <span className={`font-medium ${getWorkloadColor(professional.currentWorkload)}`}>
                          {professional.currentWorkload}%
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{professional.performance}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status Banner */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-500 rounded-lg mr-4">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900">Professional Integration Active</h3>
                <p className="text-emerald-700">
                  All professional disciplines are fully integrated with developer project coordination
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                    <span className="text-sm text-emerald-700">{summaryStats.avgWorkload}% Avg Utilization</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-emerald-600 mr-1" />
                    <span className="text-sm text-emerald-700">{summaryStats.totalDeliverables} Active Deliverables</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-900">100%</div>
              <div className="text-emerald-700 text-sm">Integration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}