'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  MapPinIcon,
  Square3Stack3DIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useBuyerData } from '@/hooks/useBuyerData';
import { format, addDays, differenceInDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import PropertyCard from '@/components/properties/PropertyCard';
import DocumentList from '@/components/documents/DocumentList';
import TaskList from '@/components/tasks/TaskList';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import MessageCenter from '@/components/messages/MessageCenter';
import FinancialOverview from '@/components/financial/FinancialOverview';
import JourneyTracker from '@/components/journey/JourneyTracker';
import { toast } from 'sonner';

interface BuyerDashboardProps {
  buyerId?: string;
}

export default function BuyerDashboard({ buyerId }: BuyerDashboardProps) {
  const { user } = useAuth();
  const { data: buyerData, isLoading } = useBuyerData(buyerId || user?.id);
  const [selectedDatesetSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuerysetSearchQuery] = useState('');
  const [filterStatussetFilterStatus] = useState('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!buyerData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No buyer data found</p>
      </div>
    );
  }

  const {
    buyer,
    activeProperties,
    savedProperties,
    purchases,
    viewings,
    documents,
    tasks,
    financialSummary,
    journeyProgress,
    notifications,
    messages,
    analytics
  } = buyerData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {buyer.firstName}</p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter notifications={notifications} />
              <MessageCenter messages={messages} />
              <Avatar>
                <AvatarImage src={buyer.avatar} />
                <AvatarFallback>{buyer.firstName.charAt(0)}{buyer.lastName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Journey Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Buying Journey</CardTitle>
            <CardDescription>Track your progress towards homeownership</CardDescription>
          </CardHeader>
          <CardContent>
            <JourneyTracker progress={journeyProgress} />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Searches</p>
                  <p className="text-2xl font-bold">{activeProperties.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeProperties.filter(p: any => p.isNew).length} new matches
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saved Properties</p>
                  <p className="text-2xl font-bold">{savedProperties.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {savedProperties.filter(p: any => p.priceChange <0).length} price drops
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <HeartIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Viewings</p>
                  <p className="text-2xl font-bold">
                    {viewings.filter(v: any => v.status === 'SCHEDULED').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Next: {viewings[0]?.date ? format(viewings[0].date, 'MMM dd') : 'None'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Budget Available</p>
                  <p className="text-2xl font-bold">
                    €{financialSummary.availableBudget.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pre-approved: €{financialSummary.preApprovedAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <CurrencyEuroIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {journeyProgress.blockers.length> 0 && (
          <Alert className="mb-8">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Action Required:</strong> {journeyProgress.blockers[0].title}
              <Button size="sm" variant="link" className="ml-2">
                Resolve Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="viewings">Viewings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.recentActivity.map((activity: any, index: any) => (
                      <motion.div
                        key={activity.id}
                        initial={ opacity: 0, y: 10 }
                        animate={ opacity: 1, y: 0 }
                        transition={ delay: index * 0.05 }
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className={`p-2 rounded-full ${activity.iconColor}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(activity.timestamp, 'MMM dd, HH:mm')}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Stay on top of your to-dos</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList 
                    tasks={tasks.filter(t: any => t.status !== 'COMPLETED').slice(0)}
                    compact
                  />
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => {/* Navigate to tasks */}
                  >
                    View All Tasks
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Property Recommendations */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recommended Properties</CardTitle>
                  <Badge variant="secondary">AI Matched</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProperties.slice(0).map(property: any => (
                    <PropertyCard key={property.id} property: any={property: any} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Track trends in your search areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `€${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="averagePrice" 
                        stroke="#3B82F6" 
                        name="Average Price"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="yourBudget" 
                        stroke="#10B981" 
                        name="Your Budget"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            {/* Property Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Property Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by location, price, or features..."
                      value={searchQuery}
                      onChange={(e: any) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="new">New Listings</SelectItem>
                      <SelectItem value="price-drop">Price Drops</SelectItem>
                      <SelectItem value="saved">Saved Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    Advanced Search
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProperties
                    .filter(property: any => {
                      if (searchQuery) {
                        const query = searchQuery.toLowerCase();
                        return property.name.toLowerCase().includes(query) ||
                               property.location.area.toLowerCase().includes(query) ||
                               property.location.county.toLowerCase().includes(query);
                      }
                      if (filterStatus === 'new') return property.isNew;
                      if (filterStatus === 'price-drop') return property.priceChange <0;
                      if (filterStatus === 'saved') return savedProperties.some(sp: any => sp.id === property.id);
                      return true;
                    })
                    .map(property: any => (
                      <PropertyCard key={property.id} property: any={property: any} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viewings" className="space-y-6">
            {/* Calendar View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Viewing Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Calendar component would go here */}
                  <div className="space-y-4">
                    {viewings.map(viewing: any => (
                      <Card key={viewing.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{viewing.property.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {format(viewing.date, 'EEEE, MMMM dd • HH:mm')}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {viewing.property.address}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                viewing.status === 'SCHEDULED' ? 'default' :
                                viewing.status === 'COMPLETED' ? 'success' :
                                'secondary'
                              }>
                                {viewing.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                Manage
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule New Viewing
                  </Button>
                  <Button className="w-full" variant="outline">
                    <VideoCameraIcon className="h-4 w-4 mr-2" />
                    Request Virtual Tour
                  </Button>
                  <Button className="w-full" variant="outline">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    View Feedback Forms
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentList 
              documents={documents}
              onUpload={() => toast.success('Document uploaded')}
              onDownload={(doc: any) => toast.success(`Downloading ${doc.name}`)}
            />
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <FinancialOverview 
              summary={financialSummary}
              transactions={buyerData.transactions}
              mortgageOptions={buyerData.mortgageOptions}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>Insights based on your search criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Price Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.priceDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({namepercent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.priceDistribution.map((entry: any, index: any) => (
                              <Cell key={`cell-${index: any}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Property Types</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.propertyTypes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Insights</CardTitle>
                <CardDescription>Based on your activity and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ArrowTrendingDownIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Price Opportunity</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Properties in Dundrum are 5% below average this month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <LightBulbIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">New Match</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            3 properties matching your criteria were listed today
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <StarIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Popular Area</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Properties in Blackrock sell 20% faster than average
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}