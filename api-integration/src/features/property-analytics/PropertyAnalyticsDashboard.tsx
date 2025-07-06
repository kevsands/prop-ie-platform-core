'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Home,
  Euro,
  Calendar,
  MapPin,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Users,
  Building,
  Map,
  Filter,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Target,
  Zap,
  Shield,
  Eye,
  Star,
  Heart,
  Flame,
  Maximize,
  Layers,
  Globe,
  Gauge,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subMonths, startOfMonth } from 'date-fns';

interface PropertyAnalyticsDashboardProps {
  propertyId?: string;
  developmentId?: string;
  userId?: string;
  location?: string;
}

interface MarketTrend {
  month: string;
  avgPrice: number;
  medianPrice: number;
  volume: number;
  pricePerSqft: number;
  daysOnMarket: number;
  listingCount: number;
}

interface LocationMetrics {
  location: string;
  avgPrice: number;
  priceChange: number;
  volume: number;
  demand: number;
  supply: number;
  growthRate: number;
  roi: number;
}

interface PropertyTypeMetrics {
  type: string;
  avgPrice: number;
  count: number;
  avgSqft: number;
  pricePerSqft: number;
  popularityScore: number;
  growthTrend: number;
}

interface DemographicData {
  ageGroup: string;
  percentage: number;
  avgIncome: number;
  homeOwnership: number;
}

interface PriceSegment {
  range: string;
  count: number;
  percentage: number;
  avgDaysOnMarket: number;
  demandScore: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function PropertyAnalyticsDashboard({
  propertyId,
  developmentId,
  userId,
  location = 'Dublin'
}: PropertyAnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState('6M');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'volume' | 'roi' | 'demand'>('price');
  const [showPredictions, setShowPredictions] = useState(false);

  // Fetch market trends
  const { data: marketTrends = [], isLoading: loadingTrends } = useQuery<MarketTrend[]>({
    queryKey: ['market-trends', location, timeframe, propertyType],
    queryFn: async () => {
      // Mock data for demonstration
      const months = [];
      for (let i = 0; i < (timeframe === '1Y' ? 12 : timeframe === '6M' ? 6 : 3); i++) {
        months.push({
          month: format(subMonths(new Date(), i), 'MMM yyyy'),
          avgPrice: 350000 + Math.random() * 50000,
          medianPrice: 340000 + Math.random() * 40000,
          volume: Math.floor(200 + Math.random() * 100),
          pricePerSqft: 400 + Math.random() * 100,
          daysOnMarket: Math.floor(20 + Math.random() * 30),
          listingCount: Math.floor(300 + Math.random() * 200)
        });
      }
      return months.reverse();
    }
  });

  // Fetch location metrics
  const { data: locationMetrics = [] } = useQuery<LocationMetrics[]>({
    queryKey: ['location-metrics', location],
    queryFn: async () => {
      // Mock data
      return [
        { location: 'Dublin 2', avgPrice: 650000, priceChange: 8.5, volume: 120, demand: 85, supply: 65, growthRate: 7.2, roi: 5.8 },
        { location: 'Dublin 4', avgPrice: 750000, priceChange: 6.2, volume: 98, demand: 90, supply: 55, growthRate: 6.8, roi: 5.5 },
        { location: 'Dublin 6', avgPrice: 580000, priceChange: 9.1, volume: 145, demand: 80, supply: 70, growthRate: 8.1, roi: 6.2 },
        { location: 'Dublin 8', avgPrice: 420000, priceChange: 11.5, volume: 180, demand: 88, supply: 75, growthRate: 10.2, roi: 7.1 },
        { location: 'Dublin 9', avgPrice: 380000, priceChange: 10.8, volume: 165, demand: 75, supply: 80, growthRate: 9.5, roi: 6.8 }
      ];
    }
  });

  // Fetch property type metrics
  const { data: propertyTypeMetrics = [] } = useQuery<PropertyTypeMetrics[]>({
    queryKey: ['property-type-metrics'],
    queryFn: async () => {
      return [
        { type: 'Apartment', avgPrice: 320000, count: 450, avgSqft: 850, pricePerSqft: 380, popularityScore: 85, growthTrend: 6.5 },
        { type: 'House', avgPrice: 480000, count: 320, avgSqft: 1400, pricePerSqft: 340, popularityScore: 90, growthTrend: 7.8 },
        { type: 'Townhouse', avgPrice: 410000, count: 180, avgSqft: 1200, pricePerSqft: 340, popularityScore: 75, growthTrend: 8.2 },
        { type: 'Penthouse', avgPrice: 850000, count: 45, avgSqft: 1800, pricePerSqft: 470, popularityScore: 60, growthTrend: 5.1 },
        { type: 'Studio', avgPrice: 250000, count: 280, avgSqft: 500, pricePerSqft: 500, popularityScore: 70, growthTrend: 9.5 }
      ];
    }
  });

  // Calculate key metrics
  const currentAvgPrice = marketTrends[marketTrends.length - 1]?.avgPrice || 0;
  const previousAvgPrice = marketTrends[marketTrends.length - 2]?.avgPrice || 0;
  const priceChange = previousAvgPrice ? ((currentAvgPrice - previousAvgPrice) / previousAvgPrice) * 100 : 0;

  const currentVolume = marketTrends[marketTrends.length - 1]?.volume || 0;
  const previousVolume = marketTrends[marketTrends.length - 2]?.volume || 0;
  const volumeChange = previousVolume ? ((currentVolume - previousVolume) / previousVolume) * 100 : 0;

  const avgDaysOnMarket = marketTrends[marketTrends.length - 1]?.daysOnMarket || 0;
  const listingCount = marketTrends[marketTrends.length - 1]?.listingCount || 0;

  // Price segments data
  const priceSegments: PriceSegment[] = [
    { range: '€0-300k', count: 120, percentage: 25, avgDaysOnMarket: 15, demandScore: 95 },
    { range: '€300k-500k', count: 180, percentage: 38, avgDaysOnMarket: 22, demandScore: 85 },
    { range: '€500k-700k', count: 100, percentage: 21, avgDaysOnMarket: 35, demandScore: 70 },
    { range: '€700k-1M', count: 50, percentage: 11, avgDaysOnMarket: 45, demandScore: 55 },
    { range: '€1M+', count: 25, percentage: 5, avgDaysOnMarket: 60, demandScore: 40 }
  ];

  // Demographic data
  const demographicData: DemographicData[] = [
    { ageGroup: '25-34', percentage: 35, avgIncome: 55000, homeOwnership: 25 },
    { ageGroup: '35-44', percentage: 30, avgIncome: 75000, homeOwnership: 55 },
    { ageGroup: '45-54', percentage: 20, avgIncome: 85000, homeOwnership: 75 },
    { ageGroup: '55-64', percentage: 10, avgIncome: 70000, homeOwnership: 85 },
    { ageGroup: '65+', percentage: 5, avgIncome: 45000, homeOwnership: 90 }
  ];

  // ROI comparison data
  const roiComparison = [
    { location: 'Dublin 2', residential: 5.8, commercial: 7.2, mixed: 6.5 },
    { location: 'Dublin 4', residential: 5.5, commercial: 6.8, mixed: 6.1 },
    { location: 'Dublin 6', residential: 6.2, commercial: 7.5, mixed: 6.8 },
    { location: 'Dublin 8', residential: 7.1, commercial: 8.5, mixed: 7.8 },
    { location: 'Dublin 9', residential: 6.8, commercial: 8.2, mixed: 7.5 }
  ];

  // Future predictions (mock)
  const predictions = marketTrends.map((trend, index) => ({
    ...trend,
    predictedPrice: trend.avgPrice * (1 + 0.005 * (index + 1)),
    confidence: 85 - index * 2
  }));

  // Format numbers
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            Property Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Market insights and trends for {location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartments</SelectItem>
              <SelectItem value="house">Houses</SelectItem>
              <SelectItem value="townhouse">Townhouses</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Price
              </CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentAvgPrice)}</div>
            <div className="flex items-center mt-2">
              {priceChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${priceChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(priceChange)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sales Volume
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentVolume}</div>
            <div className="flex items-center mt-2">
              {volumeChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${volumeChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(volumeChange)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Days on Market
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDaysOnMarket}</div>
            <div className="flex items-center mt-2">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-500">
                {avgDaysOnMarket < 30 ? 'Fast moving' : avgDaysOnMarket < 60 ? 'Normal' : 'Slow'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Listings
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listingCount}</div>
            <div className="flex items-center mt-2">
              <Layers className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm text-purple-500">
                {listingCount > 400 ? 'High supply' : listingCount > 200 ? 'Normal supply' : 'Low supply'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="segments">Price Segments</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Market Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>
                Average and median prices over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `€${value/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === 'Volume') return value;
                        return formatCurrency(value);
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgPrice"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Average Price"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="medianPrice"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Median Price"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="volume"
                      fill="#f59e0b"
                      opacity={0.7}
                      name="Volume"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Price per Square Foot</CardTitle>
                <CardDescription>
                  Trend analysis of price per square foot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `€${value}`} />
                      <Tooltip formatter={(value: any) => `€${value}/sq ft`} />
                      <Line
                        type="monotone"
                        dataKey="pricePerSqft"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Velocity</CardTitle>
                <CardDescription>
                  Average days on market and listing trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="daysOnMarket"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Days on Market"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>
                Comparative analysis across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationMetrics} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis dataKey="location" type="category" />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="avgPrice" fill="#3b82f6" name="Average Price" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Rates by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationMetrics.map((location) => (
                    <div key={location.location}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{location.location}</span>
                        <span className={`text-sm ${location.growthRate > 8 ? 'text-green-600' : 'text-blue-600'}`}>
                          {location.growthRate}% annual
                        </span>
                      </div>
                      <Progress 
                        value={location.growthRate * 10} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supply vs Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={locationMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="location" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Demand"
                        dataKey="demand"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Supply"
                        dataKey="supply"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Price Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Distribution</CardTitle>
                <CardDescription>
                  Properties by price range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priceSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ range, percentage }) => `${range} (${percentage}%)`}
                      >
                        {priceSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Demand by Price</CardTitle>
                <CardDescription>
                  Demand score and days on market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={priceSegments}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="range" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="demandScore" fill="#10b981" name="Demand Score" />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="avgDaysOnMarket" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Days on Market"
                      />
                      <Legend />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Type Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {propertyTypeMetrics.map((type) => (
                  <div key={type.type} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{type.type}</h4>
                      <Badge variant={type.growthTrend > 7 ? "default" : "secondary"}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {type.growthTrend}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Price</span>
                        <span className="font-medium">{formatCurrency(type.avgPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price/sq ft</span>
                        <span className="font-medium">€{type.pricePerSqft}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Popularity</span>
                        <Progress value={type.popularityScore} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>
                  Property buyers by age group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demographicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#3b82f6" name="Percentage">
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income & Ownership</CardTitle>
                <CardDescription>
                  Average income and homeownership rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demographicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `€${value/1000}k`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                      <Tooltip />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="avgIncome" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Avg Income"
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="homeOwnership" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Ownership %"
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buyer Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-semibold">52%</p>
                  <p className="text-sm text-muted-foreground">Prefer Houses</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-semibold">68%</p>
                  <p className="text-sm text-muted-foreground">City Center</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="font-semibold">41%</p>
                  <p className="text-sm text-muted-foreground">Families</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Briefcase className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="font-semibold">33%</p>
                  <p className="text-sm text-muted-foreground">Remote Work</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price Predictions</CardTitle>
                  <CardDescription>
                    AI-powered market predictions for the next 6 months
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  85% confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `€${value/1000}k`} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Line 
                      type="monotone" 
                      dataKey="avgPrice" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Actual Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predictedPrice" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">6 Month Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Price Growth</span>
                    <Badge variant="default">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +4.2%
                    </Badge>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Demand Index</span>
                    <Badge variant="secondary">
                      <Activity className="h-3 w-3 mr-1" />
                      High
                    </Badge>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Market Risk</span>
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Low
                    </Badge>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="aspect-square">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-green-600">8.5</p>
                        <p className="text-sm text-muted-foreground">out of 10</p>
                      </div>
                    </div>
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={`${85 * 2.83} 283`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ChevronUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Buy Now</p>
                    <p className="text-xs text-muted-foreground">Prices expected to rise</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Focus on Dublin 8</p>
                    <p className="text-xs text-muted-foreground">Highest growth potential</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Apartments</p>
                    <p className="text-xs text-muted-foreground">Best value for money</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Sentiment Analysis</CardTitle>
              <CardDescription>
                Based on news, social media, and economic indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="relative mx-auto w-24 h-24">
                    <Gauge className="w-full h-full text-green-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">82%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">Buyer Confidence</p>
                </div>
                <div className="text-center">
                  <div className="relative mx-auto w-24 h-24">
                    <Globe className="w-full h-full text-blue-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">75%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">Market Stability</p>
                </div>
                <div className="text-center">
                  <div className="relative mx-auto w-24 h-24">
                    <TrendingUp className="w-full h-full text-yellow-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">68%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">Growth Outlook</p>
                </div>
                <div className="text-center">
                  <div className="relative mx-auto w-24 h-24">
                    <DollarSign className="w-full h-full text-purple-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">91%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">Investment Appeal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), 'PPp')}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Set Alert
          </Button>
        </div>
      </div>
    </div>
  );
}