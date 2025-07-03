'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Brain,
  Target,
  TrendingUp,
  Star,
  MapPin,
  Home,
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Filter,
  Settings,
  Lightbulb,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Zap,
  Award,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  Gauge,
  Map,
  Building,
  Car,
  Wifi,
  Trees,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Coffee,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Cell, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

/**
 * AI-Powered Property Recommendations Dashboard for Buyers
 * Advanced machine learning-based property matching with personalized insights
 * Intelligent property discovery and recommendation explanation system
 */

interface Property {
  propertyId: string;
  basicInfo: any;
  pricing: any;
  features: any;
  location: any;
  marketData: any;
  propChoiceCompatibility: any;
  recommendationScore: any;
  reasons: string[];
}

interface UserPreferences {
  demographics: any;
  locationPreferences: any;
  propertyPreferences: any;
  lifestyleFactors: any;
  investmentGoals?: any;
}

const AIPropertyRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [filters, setFilters] = useState({
    minScore: 60,
    maxPrice: 500000,
    propertyTypes: [],
    regions: []
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Load recommendations
  useEffect(() => {
    fetchRecommendations();
  }, [filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('userId', 'demo_user');
      params.append('limit', '10');
      params.append('minScore', filters.minScore.toString());
      params.append('includeReasons', 'true');

      const response = await fetch(`/api/ai/property-recommendations?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.recommendations);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (propertyId: string, interactionType: string, feedback?: any) => {
    try {
      await fetch('/api/ai/property-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_feedback',
          data: {
            userId: 'demo_user',
            propertyId,
            interactionType,
            feedback
          }
        })
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handlePropertyInteraction = (property: Property, type: string) => {
    submitFeedback(property.propertyId, type);
    
    if (type === 'view') {
      setSelectedProperty(property);
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(amount);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-amber-600 bg-amber-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Very Good Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Poor Match';
  };

  const calculateMatchPercentage = (userScore: number, maxScore: number) => {
    return Math.round((userScore / maxScore) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Brain size={32} className="animate-pulse text-blue-600" />
          <p className="text-gray-600">AI is analyzing perfect properties for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Property Recommendations</h1>
                <p className="text-gray-600">Personalized property matching powered by machine learning</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-purple-600" />
                <span className="text-gray-600">{recommendations.length} Properties Analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-gray-600">92% Accuracy Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-green-600" />
                <span className="text-gray-600">Real-time AI Analysis</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowPreferencesModal(true)}>
              <Settings size={16} className="mr-2" />
              Preferences
            </Button>
            
            <Button variant="outline" onClick={fetchRecommendations}>
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Confidence</p>
                <p className="text-xl font-bold">92%</p>
                <p className="text-xs text-green-600">Very High</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Match Quality</p>
                <p className="text-xl font-bold">87/100</p>
                <p className="text-xs text-blue-600">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Savings Found</p>
                <p className="text-xl font-bold">€28K</p>
                <p className="text-xs text-green-600">Below Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="insights">Personal Insights</TabsTrigger>
          <TabsTrigger value="preferences">Preference Learning</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
        </TabsList>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter size={20} />
                Smart Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Minimum Match Score</Label>
                  <div className="mt-2">
                    <Slider
                      value={[filters.minScore]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, minScore: value[0] }))}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{filters.minScore}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Maximum Price</Label>
                  <Select value={filters.maxPrice.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300000">€300K</SelectItem>
                      <SelectItem value="400000">€400K</SelectItem>
                      <SelectItem value="500000">€500K</SelectItem>
                      <SelectItem value="750000">€750K</SelectItem>
                      <SelectItem value="1000000">€1M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Property Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Region</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dublin">Dublin</SelectItem>
                      <SelectItem value="cork">Cork</SelectItem>
                      <SelectItem value="galway">Galway</SelectItem>
                      <SelectItem value="limerick">Limerick</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((property, index) => (
              <Card key={property.propertyId} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Building size={48} className="text-gray-400" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getScoreColor(property.recommendationScore.overallScore)} border-none`}>
                      {property.recommendationScore.overallScore}% Match
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white">
                      #{index + 1} Recommended
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Property Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold">{property.basicInfo.address}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin size={14} />
                        <span className="capitalize">{property.basicInfo.region}</span>
                        <span>•</span>
                        <span className="capitalize">{property.basicInfo.propertyType}</span>
                        <span>•</span>
                        <span>{property.basicInfo.bedrooms} bed, {property.basicInfo.bathrooms} bath</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(property.pricing.listPrice)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(property.pricing.estimatedMonthlyPayment)}/month
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">€{property.pricing.pricePerSqm}/m²</p>
                        <p className="text-sm text-gray-600">{property.basicInfo.squareMeters}m²</p>
                      </div>
                    </div>

                    {/* AI Score Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget Match</span>
                        <span className="font-medium">{property.recommendationScore.scoreBreakdown.budgetMatch}%</span>
                      </div>
                      <Progress value={property.recommendationScore.scoreBreakdown.budgetMatch} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Location Match</span>
                        <span className="font-medium">{property.recommendationScore.scoreBreakdown.locationMatch}%</span>
                      </div>
                      <Progress value={property.recommendationScore.scoreBreakdown.locationMatch} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Lifestyle Match</span>
                        <span className="font-medium">{property.recommendationScore.scoreBreakdown.lifestyleMatch}%</span>
                      </div>
                      <Progress value={property.recommendationScore.scoreBreakdown.lifestyleMatch} className="h-2" />
                    </div>

                    {/* Key Features */}
                    <div className="flex flex-wrap gap-2">
                      {property.features.smartHomeFeatures && (
                        <Badge variant="outline" className="text-xs">
                          <Wifi size={12} className="mr-1" />
                          Smart Home
                        </Badge>
                      )}
                      {property.features.parking !== 'none' && (
                        <Badge variant="outline" className="text-xs">
                          <Car size={12} className="mr-1" />
                          {property.features.parking}
                        </Badge>
                      )}
                      {property.features.outdoorSpace !== 'none' && (
                        <Badge variant="outline" className="text-xs">
                          <Trees size={12} className="mr-1" />
                          {property.features.outdoorSpace}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Energy: {property.features.energyRating}
                      </Badge>
                    </div>

                    {/* AI Reasons */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb size={16} className="text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Why AI recommends this:</p>
                          <ul className="text-xs text-blue-800 mt-1 space-y-1">
                            {property.reasons.slice(0, 2).map((reason, idx) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePropertyInteraction(property, 'view')}
                      >
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePropertyInteraction(property, 'save')}
                      >
                        <Heart size={14} />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePropertyInteraction(property, 'contact')}
                      >
                        <MessageCircle size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Personal Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preference Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Your Preference Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { subject: 'Location', A: 85, fullMark: 100 },
                    { subject: 'Budget', A: 92, fullMark: 100 },
                    { subject: 'Size', A: 78, fullMark: 100 },
                    { subject: 'Style', A: 88, fullMark: 100 },
                    { subject: 'Investment', A: 65, fullMark: 100 },
                    { subject: 'Lifestyle', A: 90, fullMark: 100 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Preferences"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={20} />
                  AI Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completeness</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Preference Accuracy</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Recommendation Quality</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-3" />
                </div>

                <div className="bg-green-50 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      AI has learned your preferences
                    </span>
                  </div>
                  <p className="text-xs text-green-800 mt-1">
                    Your recommendations are becoming more accurate with each interaction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Behavior Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Your Property Search Behavior</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <div className="text-sm text-gray-600">Properties Viewed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Properties Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600">Inquiries Made</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">Researcher</div>
                  <div className="text-sm text-gray-600">Behavior Type</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preference Learning Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help AI Learn Your Preferences</CardTitle>
              <p className="text-sm text-gray-600">
                Rate these features to improve your recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Public Transport Access', icon: Map, importance: 8 },
                { label: 'Modern Architecture', icon: Building, importance: 9 },
                { label: 'Smart Home Features', icon: Wifi, importance: 7 },
                { label: 'Outdoor Space', icon: Trees, importance: 6 },
                { label: 'Shopping Centers', icon: ShoppingBag, importance: 5 },
                { label: 'Schools Nearby', icon: GraduationCap, importance: 4 },
                { label: 'Healthcare Access', icon: Stethoscope, importance: 8 },
                { label: 'Nightlife & Dining', icon: Coffee, importance: 3 }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <item.icon size={20} className="text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-16">
                      {item.importance}/10
                    </span>
                    <Slider
                      value={[item.importance]}
                      max={10}
                      min={0}
                      step={1}
                      className="w-32"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <CheckCircle size={16} className="mr-2" />
                  Update Preferences
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Market Trends for You</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { month: 'Jan', avgPrice: 420000, yourBudget: 450000 },
                    { month: 'Feb', avgPrice: 425000, yourBudget: 450000 },
                    { month: 'Mar', avgPrice: 432000, yourBudget: 450000 },
                    { month: 'Apr', avgPrice: 438000, yourBudget: 450000 },
                    { month: 'May', avgPrice: 441000, yourBudget: 450000 },
                    { month: 'Jun', avgPrice: 445000, yourBudget: 450000 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="avgPrice" stroke="#8884d8" name="Market Average" />
                    <Line type="monotone" dataKey="yourBudget" stroke="#82ca9d" name="Your Budget" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Investment Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="font-medium text-green-900">Best Time to Buy</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Market conditions favor buyers in your price range. Prices expected to stabilize.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-900">High Growth Areas</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Dublin 4 and Cork City showing 12% annual appreciation in your property type.
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <span className="font-medium text-amber-900">Market Alert</span>
                  </div>
                  <p className="text-sm text-amber-800">
                    Interest rates may increase next quarter. Consider locking in rates soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Market Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>AI Market Predictions for Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+8.5%</div>
                  <div className="text-sm text-gray-600">Expected Appreciation</div>
                  <div className="text-xs text-gray-500 mt-1">Next 12 months</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">€28K</div>
                  <div className="text-sm text-gray-600">Potential Savings</div>
                  <div className="text-xs text-gray-500 mt-1">Below market value</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600">Investment Score</div>
                  <div className="text-xs text-gray-500 mt-1">For your profile</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProperty.basicInfo.address}</DialogTitle>
              <DialogDescription>
                AI Recommendation Score: {selectedProperty.recommendationScore.overallScore}% • {getScoreLabel(selectedProperty.recommendationScore.overallScore)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Detailed Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Analysis Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(selectedProperty.recommendationScore.scoreBreakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium">{value as number}%</span>
                      </div>
                      <Progress value={value as number} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Property Type:</span>
                      <span className="capitalize">{selectedProperty.basicInfo.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{selectedProperty.basicInfo.squareMeters}m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bedrooms:</span>
                      <span>{selectedProperty.basicInfo.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bathrooms:</span>
                      <span>{selectedProperty.basicInfo.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year Built:</span>
                      <span>{selectedProperty.basicInfo.yearBuilt}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Location Scores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {Object.entries(selectedProperty.location.proximityScores).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{value}/10</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1">
                  <MessageCircle size={16} className="mr-2" />
                  Contact Agent
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar size={16} className="mr-2" />
                  Schedule Viewing
                </Button>
                <Button variant="outline">
                  <Heart size={16} />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AIPropertyRecommendations;