/**
 * Enterprise Developer Profile Page
 * Comprehensive profile management for property developers
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  Award, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  TrendingUp,
  FileText,
  Upload,
  Edit,
  Save,
  X,
  Plus,
  Star,
  CheckCircle,
  AlertCircle,
  Camera,
  Clock
} from 'lucide-react';
import { DeveloperProfile, TeamMember } from '@/lib/services/developer-profile-service';

export default function DeveloperProfilePage() {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DeveloperProfile>>({});
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({});
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/developer/profile?userId=cmc6bsi2y0000y3q4d3rxvihw');
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
      } else {
        console.error('Failed to fetch profile:', data.error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<DeveloperProfile>) => {
    try {
      const response = await fetch('/api/developer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.userId,
          updateData: updates
        })
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setEditing(false);
        setEditingSection(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addTeamMember = async () => {
    try {
      const response = await fetch('/api/developer/profile/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.userId,
          memberData: newTeamMember
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchProfile(); // Refresh profile data
        setNewTeamMember({});
        setShowAddMember(false);
      }
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading developer profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load developer profile</p>
            <Button onClick={fetchProfile}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.logo} alt={profile.companyName} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {profile.companyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.companyName}</h1>
                    {profile.verificationStatus === 'VERIFIED' && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {profile.companyType}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Est. {profile.establishedYear}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.headOfficeAddress.city}, {profile.headOfficeAddress.county}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 max-w-3xl">{profile.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary">{spec}</Badge>
                    ))}
                    {profile.specializations.length > 3 && (
                      <Badge variant="outline">+{profile.specializations.length - 3} more</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-4">
                  <Progress value={profile.profileCompleteness} className="w-32" />
                  <span className="text-sm font-medium">{profile.profileCompleteness}%</span>
                </div>
                <Button 
                  onClick={() => setEditing(!editing)}
                  variant={editing ? "outline" : "default"}
                >
                  {editing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Key Metrics */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.totalProjectsCompleted}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Units Built</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.totalUnitsBuilt.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Project Value</p>
                      <p className="text-2xl font-bold text-gray-900">€{(profile.averageProjectValue / 1000000).toFixed(1)}M</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Team Size</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.totalEmployees}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{profile.primaryEmail}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                    {profile.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Head Office</h4>
                    <div className="text-sm text-gray-600">
                      <p>{profile.headOfficeAddress.street}</p>
                      <p>{profile.headOfficeAddress.city}, {profile.headOfficeAddress.county}</p>
                      <p>{profile.headOfficeAddress.eircode}</p>
                      <p>{profile.headOfficeAddress.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Awards */}
            {profile.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Recent Awards & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.awards.slice(0, 4).map((award) => (
                      <div key={award.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{award.title}</h4>
                          <Badge variant="outline">{award.year}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{award.organization}</p>
                        <p className="text-sm text-gray-500">{award.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>
                  Comprehensive information about your development company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={formData.companyName || ''} 
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input 
                      id="registrationNumber" 
                      value={profile.registrationNumber} 
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="establishedYear">Established Year</Label>
                    <Input 
                      id="establishedYear" 
                      type="number"
                      value={formData.establishedYear || ''} 
                      onChange={(e) => setFormData({...formData, establishedYear: parseInt(e.target.value)})}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalEmployees">Total Employees</Label>
                    <Input 
                      id="totalEmployees" 
                      type="number"
                      value={formData.totalEmployees || ''} 
                      onChange={(e) => setFormData({...formData, totalEmployees: parseInt(e.target.value)})}
                      disabled={!editing}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    disabled={!editing}
                    rows={4}
                    placeholder="Describe your company's mission, values, and expertise..."
                  />
                </div>

                {/* Specializations */}
                <div>
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">{spec}</Badge>
                    ))}
                    {editing && (
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="flex space-x-3">
                    <Button onClick={() => updateProfile(formData)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications & Accreditations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accreditations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.accreditations.map((acc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{acc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Key personnel and team leadership
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddMember(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.keyPersonnel.map((member) => (
                    <Card key={member.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <Avatar className="h-16 w-16 mx-auto mb-4">
                            <AvatarImage src={member.profileImage} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{member.position}</p>
                          
                          {member.isPrimaryContact && (
                            <Badge variant="outline" className="mb-3">Primary Contact</Badge>
                          )}
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <p className="flex items-center justify-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {member.email}
                            </p>
                            {member.phone && (
                              <p className="flex items-center justify-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {member.phone}
                              </p>
                            )}
                            <p className="text-center mt-2">
                              {member.yearsExperience} years experience
                            </p>
                          </div>
                          
                          {member.qualifications.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium mb-1">Qualifications:</p>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {member.qualifications.slice(0, 2).map((qual, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {qual}
                                  </Badge>
                                ))}
                                {member.qualifications.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{member.qualifications.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Member Modal would go here */}
                {showAddMember && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                      <CardHeader>
                        <CardTitle>Add Team Member</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="memberName">Name</Label>
                          <Input 
                            id="memberName"
                            value={newTeamMember.name || ''}
                            onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberPosition">Position</Label>
                          <Input 
                            id="memberPosition"
                            value={newTeamMember.position || ''}
                            onChange={(e) => setNewTeamMember({...newTeamMember, position: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberEmail">Email</Label>
                          <Input 
                            id="memberEmail"
                            type="email"
                            value={newTeamMember.email || ''}
                            onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberExperience">Years Experience</Label>
                          <Input 
                            id="memberExperience"
                            type="number"
                            value={newTeamMember.yearsExperience || ''}
                            onChange={(e) => setNewTeamMember({...newTeamMember, yearsExperience: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={addTeamMember} className="flex-1">Add Member</Button>
                          <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Portfolio</CardTitle>
                <CardDescription>
                  Overview of completed and ongoing developments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Project Integration</h3>
                  <p className="text-gray-600 mb-4">
                    This section will show all projects from your developer dashboard
                  </p>
                  <Button variant="outline">
                    View All Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Insurance Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Insurance Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Public Liability</span>
                      <span className="text-sm">€{profile.insuranceDetails.publicLiabilityAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Policy: {profile.insuranceDetails.policyNumbers.publicLiability}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Employers Liability</span>
                      <span className="text-sm">€{profile.insuranceDetails.employersLiabilityAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Policy: {profile.insuranceDetails.policyNumbers.employersLiability}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Professional Indemnity</span>
                      <span className="text-sm">€{profile.insuranceDetails.professionalIndemnityAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Policy: {profile.insuranceDetails.policyNumbers.professionalIndemnity}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Provider: {profile.insuranceDetails.insuranceProvider}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Licenses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Licenses & Permits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.licenses.map((license) => (
                    <div key={license.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{license.type}</h4>
                        <Badge 
                          variant={license.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {license.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>License #: {license.number}</p>
                        <p>Authority: {license.authority}</p>
                        <p>Expires: {license.expiryDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.totalProjectViews.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Enquiries</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.totalEnquiries.toLocaleString()}</p>
                    </div>
                    <Mail className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.responseRate}%</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.averageResponseTime}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed analytics and performance trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive analytics and reporting tools coming soon
                  </p>
                  <Button variant="outline">
                    View Detailed Analytics
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