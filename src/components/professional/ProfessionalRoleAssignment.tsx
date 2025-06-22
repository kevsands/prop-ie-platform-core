/**
 * Professional Role Assignment Interface
 * 
 * Week 3 Implementation: Professional Role Integration
 * Comprehensive interface for assigning and managing professional roles
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  User, Plus, Upload, FileText, Award, Building2, Clock,
  CheckCircle, AlertTriangle, Calendar, Star, Settings,
  Shield, Users, Briefcase, GraduationCap
} from 'lucide-react';

interface ProfessionalRole {
  role: string;
  name: string;
  category: string;
  requiredCertifications: string[];
  requiredAssociations: string[];
  typicalSpecializations: string[];
  isPrimary?: boolean;
}

interface ProfessionalCertification {
  id?: string;
  certificationName: string;
  issuingBody: string;
  certificationNumber?: string;
  issueDate: Date;
  expiryDate?: Date;
  scope?: string;
  specializations?: string[];
  isVerified?: boolean;
}

interface ProfessionalAssociation {
  id?: string;
  associationName: string;
  membershipType: string;
  membershipNumber?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

interface ProfessionalSpecialization {
  id?: string;
  specializationArea: string;
  proficiencyLevel: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  experienceYears?: number;
  description?: string;
  keyProjects?: string[];
}

interface ProfessionalProfile {
  userId: string;
  primaryRole?: string;
  secondaryRoles: string[];
  certifications: ProfessionalCertification[];
  associations: ProfessionalAssociation[];
  specializations: ProfessionalSpecialization[];
  profileCompleteness: number;
  eligibilityScore: number;
  verificationStatus: 'pending' | 'verified' | 'incomplete';
}

const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  // Buyer Ecosystem
  {
    role: 'BUYER_SOLICITOR',
    name: 'Buyer Solicitor',
    category: 'Legal',
    requiredCertifications: ['Law Society Practising Certificate'],
    requiredAssociations: ['Law Society of Ireland'],
    typicalSpecializations: ['Conveyancing', 'Property Law', 'Commercial Law']
  },
  {
    role: 'BUYER_MORTGAGE_BROKER',
    name: 'Mortgage Broker',
    category: 'Financial',
    requiredCertifications: ['CBI Authorization', 'QFA Qualification'],
    requiredAssociations: ['Brokers Ireland', 'PIBA'],
    typicalSpecializations: ['Residential Mortgages', 'First Time Buyer', 'Investment Mortgages']
  },
  {
    role: 'BUYER_SURVEYOR',
    name: 'Property Surveyor',
    category: 'Professional Services',
    requiredCertifications: ['SCSI Membership'],
    requiredAssociations: ['Society of Chartered Surveyors Ireland'],
    typicalSpecializations: ['Structural Survey', 'Valuation', 'Building Survey']
  },
  
  // Developer Ecosystem
  {
    role: 'LEAD_ARCHITECT',
    name: 'Lead Architect',
    category: 'Design',
    requiredCertifications: ['RIAI Membership'],
    requiredAssociations: ['Royal Institute of the Architects of Ireland'],
    typicalSpecializations: ['Residential Design', 'Commercial Design', 'Sustainable Design']
  },
  {
    role: 'STRUCTURAL_ENGINEER',
    name: 'Structural Engineer',
    category: 'Engineering',
    requiredCertifications: ['Engineers Ireland Membership'],
    requiredAssociations: ['Engineers Ireland'],
    typicalSpecializations: ['Structural Design', 'Foundation Design', 'Seismic Design']
  },
  
  // Compliance Specialists
  {
    role: 'BER_ASSESSOR',
    name: 'BER Assessor',
    category: 'Compliance',
    requiredCertifications: ['SEAI BER Assessor'],
    requiredAssociations: ['SEAI'],
    typicalSpecializations: ['Energy Assessment', 'NZEB Assessment', 'Retrofit Assessment']
  },
  {
    role: 'BCAR_CERTIFIER',
    name: 'BCAR Certifier',
    category: 'Compliance',
    requiredCertifications: ['BCAR Assigned Certifier'],
    requiredAssociations: ['Engineers Ireland', 'RIAI'],
    typicalSpecializations: ['Building Control', 'Compliance Certification', 'Fire Safety']
  }
];

const ProfessionalRoleAssignment: React.FC<{ userId: string }> = ({ userId }) => {
  const [profile, setProfile] = useState<ProfessionalProfile>({
    userId,
    secondaryRoles: [],
    certifications: [],
    associations: [],
    specializations: [],
    profileCompleteness: 0,
    eligibilityScore: 0,
    verificationStatus: 'incomplete'
  });

  const [activeTab, setActiveTab] = useState('roles');
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificationDialog, setShowCertificationDialog] = useState(false);
  const [showAssociationDialog, setShowAssociationDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ProfessionalRole | null>(null);

  // New certification form state
  const [newCertification, setNewCertification] = useState<ProfessionalCertification>({
    certificationName: '',
    issuingBody: '',
    issueDate: new Date(),
  });

  // New association form state
  const [newAssociation, setNewAssociation] = useState<ProfessionalAssociation>({
    associationName: '',
    membershipType: '',
    startDate: new Date(),
    isActive: true
  });

  // Calculate profile completeness
  useEffect(() => {
    let completeness = 0;
    
    if (profile.primaryRole) completeness += 30;
    if (profile.certifications.length > 0) completeness += 25;
    if (profile.associations.length > 0) completeness += 25;
    if (profile.specializations.length > 0) completeness += 20;
    
    setProfile(prev => ({ ...prev, profileCompleteness: completeness }));
  }, [profile.primaryRole, profile.certifications, profile.associations, profile.specializations]);

  const handleRoleSelection = (roleKey: string, isPrimary: boolean = false) => {
    const role = PROFESSIONAL_ROLES.find(r => r.role === roleKey);
    if (!role) return;

    if (isPrimary) {
      setProfile(prev => ({ ...prev, primaryRole: roleKey }));
    } else {
      setProfile(prev => ({
        ...prev,
        secondaryRoles: prev.secondaryRoles.includes(roleKey)
          ? prev.secondaryRoles.filter(r => r !== roleKey)
          : [...prev.secondaryRoles, roleKey]
      }));
    }

    setSelectedRole(role);
  };

  const addCertification = () => {
    if (!newCertification.certificationName || !newCertification.issuingBody) return;

    setProfile(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...newCertification, id: Date.now().toString() }]
    }));

    setNewCertification({
      certificationName: '',
      issuingBody: '',
      issueDate: new Date(),
    });
    setShowCertificationDialog(false);
  };

  const addAssociation = () => {
    if (!newAssociation.associationName || !newAssociation.membershipType) return;

    setProfile(prev => ({
      ...prev,
      associations: [...prev.associations, { ...newAssociation, id: Date.now().toString() }]
    }));

    setNewAssociation({
      associationName: '',
      membershipType: '',
      startDate: new Date(),
      isActive: true
    });
    setShowAssociationDialog(false);
  };

  const getEligibilityForRole = (role: ProfessionalRole): { eligible: boolean; missing: string[] } => {
    const missing: string[] = [];
    
    // Check certifications
    role.requiredCertifications.forEach(reqCert => {
      const hasCert = profile.certifications.some(cert => 
        cert.certificationName.toLowerCase().includes(reqCert.toLowerCase())
      );
      if (!hasCert) missing.push(`Certification: ${reqCert}`);
    });

    // Check associations
    role.requiredAssociations.forEach(reqAssoc => {
      const hasAssoc = profile.associations.some(assoc => 
        assoc.associationName.toLowerCase().includes(reqAssoc.toLowerCase()) && assoc.isActive
      );
      if (!hasAssoc) missing.push(`Association: ${reqAssoc}`);
    });

    return { eligible: missing.length === 0, missing };
  };

  return (
    <div className="space-y-6">
      {/* Header with Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                Professional Role Management
              </CardTitle>
              <p className="text-muted-foreground">
                Assign and manage professional roles, certifications, and specializations
              </p>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Profile Completeness</span>
                <Badge variant={profile.profileCompleteness >= 80 ? 'default' : 'secondary'}>
                  {profile.profileCompleteness}%
                </Badge>
              </div>
              <Progress value={profile.profileCompleteness} className="w-24" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="associations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Associations
          </TabsTrigger>
          <TabsTrigger value="specializations" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Specializations
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Roles Assignment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select your primary professional role and any secondary roles
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Role Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Primary Professional Role</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROFESSIONAL_ROLES.map((role) => {
                    const eligibility = getEligibilityForRole(role);
                    const isSelected = profile.primaryRole === role.role;
                    
                    return (
                      <Card 
                        key={role.role}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleRoleSelection(role.role, true)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold">{role.name}</h4>
                              {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                            </div>
                            <Badge variant="outline">{role.category}</Badge>
                            <div className="flex items-center gap-2">
                              {eligibility.eligible ? (
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Eligible
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Requirements Missing
                                </Badge>
                              )}
                            </div>
                            {!eligibility.eligible && (
                              <div className="text-xs text-muted-foreground">
                                Missing: {eligibility.missing.slice(0, 2).join(', ')}
                                {eligibility.missing.length > 2 && '...'}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Roles */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Secondary Professional Roles</Label>
                <p className="text-sm text-muted-foreground">
                  Select additional roles you are qualified to perform
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROFESSIONAL_ROLES.filter(role => role.role !== profile.primaryRole).map((role) => {
                    const eligibility = getEligibilityForRole(role);
                    const isSelected = profile.secondaryRoles.includes(role.role);
                    
                    return (
                      <Card 
                        key={role.role}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'ring-2 ring-secondary bg-secondary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleRoleSelection(role.role, false)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{role.name}</h4>
                              {isSelected && <CheckCircle className="h-4 w-4 text-secondary" />}
                            </div>
                            <Badge variant="outline" className="text-xs">{role.category}</Badge>
                            {eligibility.eligible && (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Eligible
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Professional Certifications</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your professional certifications and qualifications
                  </p>
                </div>
                <Dialog open={showCertificationDialog} onOpenChange={setShowCertificationDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Professional Certification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="certName">Certification Name *</Label>
                        <Input
                          id="certName"
                          value={newCertification.certificationName}
                          onChange={(e) => setNewCertification(prev => ({ ...prev, certificationName: e.target.value }))}
                          placeholder="e.g., RIAI Membership"
                        />
                      </div>
                      <div>
                        <Label htmlFor="issuingBody">Issuing Body *</Label>
                        <Input
                          id="issuingBody"
                          value={newCertification.issuingBody}
                          onChange={(e) => setNewCertification(prev => ({ ...prev, issuingBody: e.target.value }))}
                          placeholder="e.g., Royal Institute of the Architects of Ireland"
                        />
                      </div>
                      <div>
                        <Label htmlFor="certNumber">Certification Number</Label>
                        <Input
                          id="certNumber"
                          value={newCertification.certificationNumber || ''}
                          onChange={(e) => setNewCertification(prev => ({ ...prev, certificationNumber: e.target.value }))}
                          placeholder="Certificate or license number"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Input
                            id="issueDate"
                            type="date"
                            value={newCertification.issueDate.toISOString().split('T')[0]}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, issueDate: new Date(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={newCertification.expiryDate?.toISOString().split('T')[0] || ''}
                            onChange={(e) => setNewCertification(prev => ({ 
                              ...prev, 
                              expiryDate: e.target.value ? new Date(e.target.value) : undefined 
                            }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="scope">Scope/Specialization</Label>
                        <Textarea
                          id="scope"
                          value={newCertification.scope || ''}
                          onChange={(e) => setNewCertification(prev => ({ ...prev, scope: e.target.value }))}
                          placeholder="Describe the scope or specialization covered by this certification"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addCertification} disabled={!newCertification.certificationName || !newCertification.issuingBody}>
                          Add Certification
                        </Button>
                        <Button variant="outline" onClick={() => setShowCertificationDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {profile.certifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No certifications added yet</p>
                  <p className="text-sm">Add your professional certifications to improve your profile</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{cert.certificationName}</h4>
                            <p className="text-sm text-muted-foreground">{cert.issuingBody}</p>
                            {cert.certificationNumber && (
                              <p className="text-xs text-muted-foreground">
                                Certificate #: {cert.certificationNumber}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                Issued: {cert.issueDate.toLocaleDateString()}
                              </Badge>
                              {cert.expiryDate && (
                                <Badge variant={cert.expiryDate < new Date() ? 'destructive' : 'default'} className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Expires: {cert.expiryDate.toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={cert.isVerified ? 'default' : 'secondary'}>
                              {cert.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Associations Tab */}
        <TabsContent value="associations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Professional Associations</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage your professional body memberships and associations
                  </p>
                </div>
                <Dialog open={showAssociationDialog} onOpenChange={setShowAssociationDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Association
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Professional Association</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="assocName">Association Name *</Label>
                        <Select 
                          value={newAssociation.associationName}
                          onValueChange={(value) => setNewAssociation(prev => ({ ...prev, associationName: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select professional association" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Law Society of Ireland">Law Society of Ireland</SelectItem>
                            <SelectItem value="Royal Institute of the Architects of Ireland">Royal Institute of the Architects of Ireland</SelectItem>
                            <SelectItem value="Engineers Ireland">Engineers Ireland</SelectItem>
                            <SelectItem value="Society of Chartered Surveyors Ireland">Society of Chartered Surveyors Ireland</SelectItem>
                            <SelectItem value="Brokers Ireland">Brokers Ireland</SelectItem>
                            <SelectItem value="PIBA">Professional Insurance Brokers Association</SelectItem>
                            <SelectItem value="SEAI">Sustainable Energy Authority of Ireland</SelectItem>
                            <SelectItem value="CIOB">Chartered Institute of Building</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="membershipType">Membership Type *</Label>
                        <Select 
                          value={newAssociation.membershipType}
                          onValueChange={(value) => setNewAssociation(prev => ({ ...prev, membershipType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select membership type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Member">Full Member</SelectItem>
                            <SelectItem value="Associate Member">Associate Member</SelectItem>
                            <SelectItem value="Student Member">Student Member</SelectItem>
                            <SelectItem value="Fellow">Fellow</SelectItem>
                            <SelectItem value="Chartered Member">Chartered Member</SelectItem>
                            <SelectItem value="Licensed Member">Licensed Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="membershipNumber">Membership Number</Label>
                        <Input
                          id="membershipNumber"
                          value={newAssociation.membershipNumber || ''}
                          onChange={(e) => setNewAssociation(prev => ({ ...prev, membershipNumber: e.target.value }))}
                          placeholder="Your membership number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startDate">Membership Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newAssociation.startDate.toISOString().split('T')[0]}
                          onChange={(e) => setNewAssociation(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={newAssociation.isActive}
                          onCheckedChange={(checked) => setNewAssociation(prev => ({ ...prev, isActive: !!checked }))}
                        />
                        <Label htmlFor="isActive">Currently active membership</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addAssociation} disabled={!newAssociation.associationName || !newAssociation.membershipType}>
                          Add Association
                        </Button>
                        <Button variant="outline" onClick={() => setShowAssociationDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {profile.associations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No professional associations added yet</p>
                  <p className="text-sm">Add your professional body memberships to enhance your credentials</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.associations.map((assoc) => (
                    <Card key={assoc.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{assoc.associationName}</h4>
                            <p className="text-sm text-muted-foreground">{assoc.membershipType}</p>
                            {assoc.membershipNumber && (
                              <p className="text-xs text-muted-foreground">
                                Member #: {assoc.membershipNumber}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                Since: {assoc.startDate.toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={assoc.isActive ? 'default' : 'secondary'}>
                              {assoc.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specializations Tab */}
        <TabsContent value="specializations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Specializations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Define your areas of expertise and specialization
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Specializations management coming soon</p>
                <p className="text-sm">This feature will allow you to define and manage your professional specializations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          className="flex-1" 
          disabled={!profile.primaryRole}
          onClick={() => {
            // TODO: Submit profile changes
            console.log('Saving professional profile:', profile);
          }}
        >
          <Shield className="h-4 w-4 mr-2" />
          Save Professional Profile
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Profile Report
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalRoleAssignment;