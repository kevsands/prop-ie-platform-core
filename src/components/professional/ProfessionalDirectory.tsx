/**
 * Professional Directory & Search Interface
 * 
 * Week 3 Implementation: Professional Role Integration
 * Comprehensive directory for discovering and connecting with professionals
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search, Filter, MapPin, Star, Phone, Mail, Calendar,
  Users, Award, Building2, Clock, CheckCircle, AlertCircle,
  MessageSquare, UserPlus, Heart, MoreVertical, ExternalLink,
  Briefcase, GraduationCap, Shield, Globe, ArrowUpRight
} from 'lucide-react';

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  primaryRole: string;
  secondaryRoles: string[];
  company: {
    name: string;
    website?: string;
    logo?: string;
  };
  location: {
    city: string;
    county: string;
    serviceAreas: string[];
  };
  certifications: Array<{
    name: string;
    issuingBody: string;
    expiryDate?: Date;
    isVerified: boolean;
  }>;
  associations: Array<{
    name: string;
    membershipType: string;
    isActive: boolean;
  }>;
  specializations: string[];
  experience: {
    yearsActive: number;
    projectsCompleted: number;
    clientRating: number;
    reviewCount: number;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    nextAvailable?: Date;
    workingHours: string;
  };
  pricing: {
    hourlyRate?: number;
    fixedFeeRange?: {
      min: number;
      max: number;
    };
    currency: string;
  };
  profileCompletion: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  lastActive: Date;
  isOnline: boolean;
  professionalBio?: string;
  languages: string[];
  tags: string[];
}

interface SearchFilters {
  role?: string;
  location?: string;
  availability?: string;
  certifications?: string[];
  specializations?: string[];
  experienceLevel?: string;
  pricing?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  verifiedOnly?: boolean;
}

const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'O\'Sullivan',
    email: 'sarah.osullivan@lawfirm.ie',
    phone: '+353 1 234 5678',
    avatar: '/avatars/sarah-osullivan.jpg',
    primaryRole: 'BUYER_SOLICITOR',
    secondaryRoles: ['DEVELOPER_SOLICITOR'],
    company: {
      name: 'O\'Sullivan & Partners Solicitors',
      website: 'https://osullivanpartners.ie',
      logo: '/logos/osullivan-partners.png'
    },
    location: {
      city: 'Dublin',
      county: 'Dublin',
      serviceAreas: ['Dublin', 'Kildare', 'Meath', 'Wicklow']
    },
    certifications: [
      {
        name: 'Law Society Practising Certificate',
        issuingBody: 'Law Society of Ireland',
        expiryDate: new Date('2024-12-31'),
        isVerified: true
      },
      {
        name: 'Conveyancing Certificate',
        issuingBody: 'Law Society of Ireland',
        isVerified: true
      }
    ],
    associations: [
      {
        name: 'Law Society of Ireland',
        membershipType: 'Full Member',
        isActive: true
      }
    ],
    specializations: ['Conveyancing', 'Property Law', 'First Time Buyers', 'Commercial Property'],
    experience: {
      yearsActive: 12,
      projectsCompleted: 847,
      clientRating: 4.8,
      reviewCount: 156
    },
    availability: {
      status: 'available',
      workingHours: '9:00 AM - 6:00 PM'
    },
    pricing: {
      fixedFeeRange: {
        min: 1200,
        max: 2500
      },
      currency: 'EUR'
    },
    profileCompletion: 95,
    verificationStatus: 'verified',
    lastActive: new Date('2024-06-21T10:30:00'),
    isOnline: true,
    professionalBio: 'Experienced property solicitor specializing in residential and commercial conveyancing. Particular expertise in first-time buyer transactions and Help to Buy applications.',
    languages: ['English', 'Irish'],
    tags: ['experienced', 'first-time-buyer-specialist', 'help-to-buy']
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@mortgagebrokers.ie',
    phone: '+353 1 987 6543',
    primaryRole: 'BUYER_MORTGAGE_BROKER',
    secondaryRoles: ['BUYER_FINANCIAL_ADVISOR'],
    company: {
      name: 'Chen Mortgage Solutions',
      website: 'https://chenmortgage.ie'
    },
    location: {
      city: 'Cork',
      county: 'Cork',
      serviceAreas: ['Cork', 'Kerry', 'Waterford', 'Limerick']
    },
    certifications: [
      {
        name: 'QFA Qualification',
        issuingBody: 'Professional Insurance Brokers Association',
        isVerified: true
      },
      {
        name: 'CBI Authorization',
        issuingBody: 'Central Bank of Ireland',
        expiryDate: new Date('2025-06-30'),
        isVerified: true
      }
    ],
    associations: [
      {
        name: 'Brokers Ireland',
        membershipType: 'Full Member',
        isActive: true
      },
      {
        name: 'PIBA',
        membershipType: 'Associate Member',
        isActive: true
      }
    ],
    specializations: ['First Time Buyer Mortgages', 'Investment Mortgages', 'Self-Build Finance', 'Commercial Mortgages'],
    experience: {
      yearsActive: 8,
      projectsCompleted: 423,
      clientRating: 4.9,
      reviewCount: 89
    },
    availability: {
      status: 'available',
      workingHours: '8:30 AM - 7:00 PM'
    },
    pricing: {
      hourlyRate: 150,
      currency: 'EUR'
    },
    profileCompletion: 88,
    verificationStatus: 'verified',
    lastActive: new Date('2024-06-21T14:15:00'),
    isOnline: false,
    professionalBio: 'Independent mortgage broker with access to all major lenders. Specializing in complex cases and first-time buyer support.',
    languages: ['English', 'Mandarin'],
    tags: ['mortgage-specialist', 'first-time-buyer', 'investment-property']
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Murphy',
    email: 'emma.murphy@surveying.ie',
    phone: '+353 21 456 7890',
    primaryRole: 'BUYER_SURVEYOR',
    secondaryRoles: ['PROPERTY_VALUER'],
    company: {
      name: 'Murphy Property Surveys',
      website: 'https://murphysurveys.ie'
    },
    location: {
      city: 'Galway',
      county: 'Galway',
      serviceAreas: ['Galway', 'Mayo', 'Roscommon', 'Clare']
    },
    certifications: [
      {
        name: 'SCSI Membership',
        issuingBody: 'Society of Chartered Surveyors Ireland',
        isVerified: true
      }
    ],
    associations: [
      {
        name: 'Society of Chartered Surveyors Ireland',
        membershipType: 'Chartered Member',
        isActive: true
      }
    ],
    specializations: ['Structural Surveys', 'Valuation', 'Building Surveys', 'Defect Analysis'],
    experience: {
      yearsActive: 15,
      projectsCompleted: 1243,
      clientRating: 4.7,
      reviewCount: 203
    },
    availability: {
      status: 'busy',
      nextAvailable: new Date('2024-07-02'),
      workingHours: '9:00 AM - 5:30 PM'
    },
    pricing: {
      fixedFeeRange: {
        min: 450,
        max: 850
      },
      currency: 'EUR'
    },
    profileCompletion: 92,
    verificationStatus: 'verified',
    lastActive: new Date('2024-06-21T09:45:00'),
    isOnline: false,
    professionalBio: 'Chartered surveyor with extensive experience in residential and commercial property surveys. RICS and SCSI qualified.',
    languages: ['English'],
    tags: ['chartered-surveyor', 'structural-specialist', 'commercial']
  }
];

const ProfessionalDirectory: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Apply filters and search
  useEffect(() => {
    let filtered = [...professionals];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(prof =>
        `${prof.firstName} ${prof.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        prof.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.location.county.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter(prof => 
        prof.primaryRole === filters.role || prof.secondaryRoles.includes(filters.role)
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(prof =>
        prof.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        prof.location.county.toLowerCase().includes(filters.location!.toLowerCase()) ||
        prof.location.serviceAreas.some(area => 
          area.toLowerCase().includes(filters.location!.toLowerCase())
        )
      );
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(prof => prof.availability.status === filters.availability);
    }

    // Apply verification filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(prof => prof.verificationStatus === 'verified');
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(prof => prof.experience.clientRating >= filters.rating!);
    }

    // Apply experience level filter
    if (filters.experienceLevel) {
      const experienceMap = {
        'entry': [0, 2],
        'experienced': [3, 9],
        'senior': [10, 19],
        'expert': [20, 100]
      };
      const [min, max] = experienceMap[filters.experienceLevel as keyof typeof experienceMap] || [0, 100];
      filtered = filtered.filter(prof => 
        prof.experience.yearsActive >= min && prof.experience.yearsActive <= max
      );
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.experience.clientRating - a.experience.clientRating);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience.yearsActive - a.experience.yearsActive);
        break;
      case 'availability':
        filtered.sort((a, b) => {
          const statusOrder = { 'available': 0, 'busy': 1, 'unavailable': 2 };
          return statusOrder[a.availability.status] - statusOrder[b.availability.status];
        });
        break;
      case 'name':
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProfessionals(filtered);
  }, [professionals, searchTerm, filters, sortBy]);

  const getAvailabilityBadge = (availability: Professional['availability']) => {
    switch (availability.status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>;
      case 'busy':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Busy</Badge>;
      case 'unavailable':
        return <Badge variant="destructive">Unavailable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getVerificationBadge = (status: Professional['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>;
      case 'pending':
        return <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      default:
        return <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Unverified
        </Badge>;
    }
  };

  const formatPricing = (pricing: Professional['pricing']) => {
    if (pricing.hourlyRate) {
      return `€${pricing.hourlyRate}/hour`;
    }
    if (pricing.fixedFeeRange) {
      return `€${pricing.fixedFeeRange.min} - €${pricing.fixedFeeRange.max}`;
    }
    return 'Contact for pricing';
  };

  const handleContactProfessional = (professional: Professional) => {
    // TODO: Implement contact functionality
    console.log('Contacting professional:', professional.id);
  };

  const handleSaveProfessional = (professional: Professional) => {
    // TODO: Implement save to favorites
    console.log('Saving professional:', professional.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Professional Directory</h2>
          <p className="text-muted-foreground">
            Find and connect with verified property professionals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredProfessionals.length} professionals found</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Select value={filters.role || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value || undefined }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="BUYER_SOLICITOR">Buyer Solicitor</SelectItem>
                  <SelectItem value="BUYER_MORTGAGE_BROKER">Mortgage Broker</SelectItem>
                  <SelectItem value="BUYER_SURVEYOR">Property Surveyor</SelectItem>
                  <SelectItem value="ESTATE_AGENT">Estate Agent</SelectItem>
                  <SelectItem value="LEAD_ARCHITECT">Architect</SelectItem>
                  <SelectItem value="STRUCTURAL_ENGINEER">Engineer</SelectItem>
                  <SelectItem value="BER_ASSESSOR">BER Assessor</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Location"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
              />

              <Select value={filters.availability || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value || undefined }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.experienceLevel || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value || undefined }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="entry">0-2 years</SelectItem>
                  <SelectItem value="experienced">3-9 years</SelectItem>
                  <SelectItem value="senior">10-19 years</SelectItem>
                  <SelectItem value="expert">20+ years</SelectItem>
                </SelectContent>
              </Select>

              <Select value={String(filters.rating || '')} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value ? Number(value) : undefined }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Ratings</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified-only"
                  checked={filters.verifiedOnly || false}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: !!checked }))}
                />
                <Label htmlFor="verified-only" className="text-sm">Verified only</Label>
              </div>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredProfessionals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No professionals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more professionals.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setFilters({});
            }}>
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProfessionals.map((professional) => (
            <Card 
              key={professional.id} 
              className={`hover:shadow-lg transition-shadow cursor-pointer ${viewMode === 'list' ? 'p-4' : ''}`}
              onClick={() => {
                setSelectedProfessional(professional);
                setShowProfileDialog(true);
              }}
            >
              <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-0'}>
                <div className={`space-y-4 ${viewMode === 'list' ? 'flex items-center space-y-0 space-x-6' : ''}`}>
                  {/* Professional Header */}
                  <div className={`flex items-start ${viewMode === 'list' ? 'flex-shrink-0' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={professional.avatar} />
                          <AvatarFallback>
                            {professional.firstName[0]}{professional.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {professional.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{professional.firstName} {professional.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{professional.company.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getVerificationBadge(professional.verificationStatus)}
                          {getAvailabilityBadge(professional.availability)}
                        </div>
                      </div>
                    </div>
                    {viewMode === 'grid' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleContactProfessional(professional);
                          }}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleSaveProfessional(professional);
                          }}>
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Professional Details */}
                  <div className={viewMode === 'list' ? 'flex-1 grid grid-cols-3 gap-4' : 'space-y-3'}>
                    {/* Role and Specializations */}
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {professional.primaryRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {professional.specializations.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {professional.specializations.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{professional.specializations.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Location and Experience */}
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        {professional.location.city}, {professional.location.county}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        {professional.experience.yearsActive} years experience
                      </div>
                    </div>

                    {/* Rating and Pricing */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{professional.experience.clientRating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({professional.experience.reviewCount})
                        </span>
                      </div>
                      <p className="text-sm font-medium">{formatPricing(professional.pricing)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {viewMode === 'grid' && (
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactProfessional(professional);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProfessional(professional);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleContactProfessional(professional);
                      }}>
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleSaveProfessional(professional);
                      }}>
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Professional Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProfessional && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedProfessional.avatar} />
                      <AvatarFallback className="text-lg">
                        {selectedProfessional.firstName[0]}{selectedProfessional.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-2xl">
                        {selectedProfessional.firstName} {selectedProfessional.lastName}
                      </DialogTitle>
                      <p className="text-muted-foreground">{selectedProfessional.company.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getVerificationBadge(selectedProfessional.verificationStatus)}
                        {getAvailabilityBadge(selectedProfessional.availability)}
                        {selectedProfessional.isOnline && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Online now
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold">{selectedProfessional.experience.clientRating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedProfessional.experience.reviewCount} reviews
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Professional Bio */}
              {selectedProfessional.professionalBio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{selectedProfessional.professionalBio}</p>
                </div>
              )}

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience and Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Experience & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Years Active</span>
                      <span className="font-medium">{selectedProfessional.experience.yearsActive}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Projects Completed</span>
                      <span className="font-medium">{selectedProfessional.experience.projectsCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pricing</span>
                      <span className="font-medium">{formatPricing(selectedProfessional.pricing)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Working Hours</span>
                      <span className="font-medium">{selectedProfessional.availability.workingHours}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Location and Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location & Service Areas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Base Location</span>
                      <p className="font-medium">{selectedProfessional.location.city}, {selectedProfessional.location.county}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Service Areas</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProfessional.location.serviceAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Languages</span>
                      <p className="font-medium">{selectedProfessional.languages.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfessional.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications and Associations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProfessional.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">{cert.issuingBody}</p>
                          {cert.expiryDate && (
                            <p className="text-xs text-muted-foreground">
                              Expires: {cert.expiryDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {cert.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Professional Associations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProfessional.associations.map((assoc, index) => (
                      <div key={index} className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{assoc.name}</p>
                          <p className="text-sm text-muted-foreground">{assoc.membershipType}</p>
                        </div>
                        {assoc.isActive && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button className="flex-1" onClick={() => handleContactProfessional(selectedProfessional)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => handleSaveProfessional(selectedProfessional)}>
                  <Heart className="h-4 w-4 mr-2" />
                  Save Professional
                </Button>
                {selectedProfessional.company.website && (
                  <Button variant="outline" asChild>
                    <a href={selectedProfessional.company.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalDirectory;