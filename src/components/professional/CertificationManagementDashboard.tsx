/**
 * Certification Management Dashboard
 * 
 * Week 3 Implementation: Professional Role Integration
 * Comprehensive dashboard for managing professional certifications, renewals, and compliance
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Award, AlertTriangle, CheckCircle, Clock, Calendar, Upload,
  FileText, Download, RefreshCw, Bell, Shield, Filter,
  Search, Plus, ExternalLink, AlertCircle, TrendingUp
} from 'lucide-react';

interface Certification {
  id: string;
  certificationName: string;
  issuingBody: string;
  certificationNumber?: string;
  issueDate: Date;
  expiryDate?: Date;
  scope?: string;
  specializations: string[];
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  documentUrl?: string;
  renewalRequired: boolean;
  daysUntilExpiry?: number;
  category: 'mandatory' | 'professional' | 'specialization' | 'continuing_education';
  renewalProcess?: {
    provider: string;
    cost: number;
    duration: string;
    requirements: string[];
  };
}

interface CertificationAlert {
  id: string;
  type: 'expiring' | 'expired' | 'renewal_available' | 'verification_required';
  certification: Certification;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired: string;
  dueDate?: Date;
}

interface CertificationStats {
  total: number;
  verified: number;
  expiringSoon: number;
  expired: number;
  renewalRequired: number;
  complianceScore: number;
}

const IRISH_CERTIFICATION_PROVIDERS = [
  {
    name: 'Royal Institute of the Architects of Ireland (RIAI)',
    type: 'professional_body',
    website: 'https://www.riai.ie',
    certifications: ['RIAI Membership', 'Chartered Architect', 'RIAI Accredited']
  },
  {
    name: 'Engineers Ireland',
    type: 'professional_body',
    website: 'https://www.engineersireland.ie',
    certifications: ['Chartered Engineer', 'Engineers Ireland Membership', 'CPD Certified']
  },
  {
    name: 'Law Society of Ireland',
    type: 'professional_body',
    website: 'https://www.lawsociety.ie',
    certifications: ['Practising Certificate', 'Conveyancing Certificate', 'Continuing Legal Education']
  },
  {
    name: 'Society of Chartered Surveyors Ireland (SCSI)',
    type: 'professional_body',
    website: 'https://www.scsi.ie',
    certifications: ['MSCSI', 'FSCSI', 'SCSI Accredited Valuer']
  },
  {
    name: 'Sustainable Energy Authority of Ireland (SEAI)',
    type: 'government_agency',
    website: 'https://www.seai.ie',
    certifications: ['BER Assessor', 'NZEB Assessor', 'Energy Auditor']
  },
  {
    name: 'Central Bank of Ireland',
    type: 'regulatory',
    website: 'https://www.centralbank.ie',
    certifications: ['Approved Person', 'Fitness & Probity', 'CBI Authorization']
  }
];

const CertificationManagementDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [alerts, setAlerts] = useState<CertificationAlert[]>([]);
  const [stats, setStats] = useState<CertificationStats>({
    total: 0,
    verified: 0,
    expiringSoon: 0,
    expired: 0,
    renewalRequired: 0,
    complianceScore: 0
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockCertifications: Certification[] = [
      {
        id: '1',
        certificationName: 'RIAI Membership',
        issuingBody: 'Royal Institute of the Architects of Ireland',
        certificationNumber: 'RIAI-2023-001234',
        issueDate: new Date('2023-01-15'),
        expiryDate: new Date('2025-01-15'),
        scope: 'Registered Architect - Full Membership',
        specializations: ['Residential Design', 'Commercial Architecture'],
        isVerified: true,
        verificationStatus: 'verified',
        renewalRequired: false,
        daysUntilExpiry: 180,
        category: 'professional',
        renewalProcess: {
          provider: 'RIAI',
          cost: 850,
          duration: '12 months',
          requirements: ['CPD Points: 35', 'Professional Indemnity Insurance', 'Membership Fees']
        }
      },
      {
        id: '2',
        certificationName: 'BER Assessor',
        issuingBody: 'Sustainable Energy Authority of Ireland',
        certificationNumber: 'SEAI-BER-2024-5678',
        issueDate: new Date('2024-03-10'),
        expiryDate: new Date('2025-08-10'),
        scope: 'Domestic and Commercial BER Assessment',
        specializations: ['NZEB Assessment', 'Energy Auditing'],
        isVerified: true,
        verificationStatus: 'verified',
        renewalRequired: false,
        daysUntilExpiry: 45,
        category: 'mandatory',
        renewalProcess: {
          provider: 'SEAI',
          cost: 450,
          duration: '3 years',
          requirements: ['Refresher Course', 'Quality Assurance', 'Continuing Education']
        }
      },
      {
        id: '3',
        certificationName: 'Law Society Practising Certificate',
        issuingBody: 'Law Society of Ireland',
        certificationNumber: 'LSI-PC-2024-9012',
        issueDate: new Date('2024-01-01'),
        expiryDate: new Date('2024-12-31'),
        scope: 'Practising Solicitor - Conveyancing',
        specializations: ['Property Law', 'Commercial Conveyancing'],
        isVerified: true,
        verificationStatus: 'verified',
        renewalRequired: true,
        daysUntilExpiry: -15, // Expired
        category: 'mandatory'
      },
      {
        id: '4',
        certificationName: 'Chartered Engineer',
        issuingBody: 'Engineers Ireland',
        certificationNumber: 'EI-CE-2023-3456',
        issueDate: new Date('2023-06-20'),
        expiryDate: new Date('2026-06-20'),
        scope: 'Chartered Professional Engineer',
        specializations: ['Structural Engineering', 'Project Management'],
        isVerified: true,
        verificationStatus: 'verified',
        renewalRequired: false,
        daysUntilExpiry: 540,
        category: 'professional'
      }
    ];

    setCertifications(mockCertifications);

    // Generate alerts based on certifications
    const generatedAlerts: CertificationAlert[] = [];
    mockCertifications.forEach(cert => {
      if (cert.daysUntilExpiry !== undefined) {
        if (cert.daysUntilExpiry < 0) {
          generatedAlerts.push({
            id: `alert-${cert.id}-expired`,
            type: 'expired',
            certification: cert,
            priority: 'critical',
            message: `${cert.certificationName} has expired`,
            actionRequired: 'Renew immediately to maintain compliance',
            dueDate: cert.expiryDate
          });
        } else if (cert.daysUntilExpiry <= 60) {
          generatedAlerts.push({
            id: `alert-${cert.id}-expiring`,
            type: 'expiring',
            certification: cert,
            priority: cert.daysUntilExpiry <= 30 ? 'high' : 'medium',
            message: `${cert.certificationName} expires in ${cert.daysUntilExpiry} days`,
            actionRequired: 'Begin renewal process',
            dueDate: cert.expiryDate
          });
        }
      }
    });

    setAlerts(generatedAlerts);

    // Calculate stats
    const verified = mockCertifications.filter(c => c.verificationStatus === 'verified').length;
    const expiringSoon = mockCertifications.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 60 && c.daysUntilExpiry > 0).length;
    const expired = mockCertifications.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry < 0).length;
    const renewalRequired = mockCertifications.filter(c => c.renewalRequired).length;
    
    setStats({
      total: mockCertifications.length,
      verified,
      expiringSoon,
      expired,
      renewalRequired,
      complianceScore: Math.round(((verified - expired) / mockCertifications.length) * 100)
    });
  }, []);

  const getStatusBadge = (certification: Certification) => {
    if (certification.daysUntilExpiry !== undefined && certification.daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (certification.daysUntilExpiry !== undefined && certification.daysUntilExpiry <= 30) {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    }
    if (certification.daysUntilExpiry !== undefined && certification.daysUntilExpiry <= 60) {
      return <Badge variant="outline">Renewal Due</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.certificationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuingBody.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && (cert.daysUntilExpiry === undefined || cert.daysUntilExpiry > 0);
    if (filterStatus === 'expiring') return matchesSearch && cert.daysUntilExpiry !== undefined && cert.daysUntilExpiry <= 60 && cert.daysUntilExpiry > 0;
    if (filterStatus === 'expired') return matchesSearch && cert.daysUntilExpiry !== undefined && cert.daysUntilExpiry < 0;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Certifications</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.complianceScore}%</p>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={stats.complianceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Certification Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <Alert key={alert.id} className={`${
                  alert.priority === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(alert.priority)}
                      <div>
                        <AlertDescription className="font-medium">
                          {alert.message}
                        </AlertDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.actionRequired}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Take Action
                    </Button>
                  </div>
                </Alert>
              ))}
              {alerts.length > 3 && (
                <Button variant="outline" className="w-full">
                  View All {alerts.length} Alerts
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certification Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Certification Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['mandatory', 'professional', 'specialization'].map((category) => {
                    const categoryCerts = certifications.filter(c => c.category === category);
                    const activeCount = categoryCerts.filter(c => c.daysUntilExpiry === undefined || c.daysUntilExpiry > 0).length;
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium capitalize">{category.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {activeCount} of {categoryCerts.length} active
                          </p>
                        </div>
                        <Badge variant={activeCount === categoryCerts.length ? 'default' : 'destructive'}>
                          {Math.round((activeCount / categoryCerts.length) * 100)}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">BER Assessor verified</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <Upload className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">RIAI certificate uploaded</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Practising Certificate renewal reminder</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search certifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Certifications</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certifications Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certification</TableHead>
                    <TableHead>Issuing Body</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertifications.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cert.certificationName}</p>
                          <p className="text-sm text-muted-foreground">
                            {cert.certificationNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{cert.issuingBody}</TableCell>
                      <TableCell>{getStatusBadge(cert)}</TableCell>
                      <TableCell>
                        {cert.expiryDate ? cert.expiryDate.toLocaleDateString() : 'No expiry'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {cert.renewalRequired && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Renewals Tab */}
        <TabsContent value="renewals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Renewal Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track and manage certification renewals and continuing education requirements
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications
                  .filter(cert => cert.renewalRequired || (cert.daysUntilExpiry !== undefined && cert.daysUntilExpiry <= 90))
                  .map((cert) => (
                    <Card key={cert.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{cert.certificationName}</h4>
                          <p className="text-sm text-muted-foreground">{cert.issuingBody}</p>
                          {cert.renewalProcess && (
                            <div className="text-sm space-y-1">
                              <p><strong>Cost:</strong> €{cert.renewalProcess.cost}</p>
                              <p><strong>Duration:</strong> {cert.renewalProcess.duration}</p>
                              <p><strong>Requirements:</strong> {cert.renewalProcess.requirements.join(', ')}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(cert)}
                          <Button size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Start Renewal
                          </Button>
                        </div>
                      </div>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certification Providers</CardTitle>
              <p className="text-sm text-muted-foreground">
                Irish professional bodies and certification authorities
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {IRISH_CERTIFICATION_PROVIDERS.map((provider, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{provider.name}</h4>
                          <Badge variant="outline">{provider.type.replace('_', ' ')}</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Available Certifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {provider.certifications.map((cert, certIndex) => (
                              <Badge key={certIndex} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificationManagementDashboard;