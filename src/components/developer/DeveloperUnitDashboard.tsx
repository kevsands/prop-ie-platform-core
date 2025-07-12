/**
 * Developer Unit Dashboard
 * Comprehensive unit management and analytics dashboard for developers
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Activity,
  MapPin,
  Home,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Unit, UnitStatus, UnitType } from '@/types/core/unit';
import UnitsGridListing from '../units/UnitsGridListing';

export interface DeveloperMetrics {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  totalRevenue: number;
  averagePrice: number;
  conversionRate: number;
  averageDaysToSell: number;
  viewingToInquiryRate: number;
  inquiryToReservationRate: number;
  reservationToSaleRate: number;
  totalViews: number;
  totalInquiries: number;
  activeViewers: number;
  exclusivityPurchases: number;
  htbApplications: number;
}

export interface SalesActivity {
  id: string;
  type: 'view' | 'inquiry' | 'exclusivity' | 'reservation' | 'sale';
  unitId: string;
  unitNumber: string;
  buyerName?: string;
  timestamp: Date;
  amount?: number;
  details: string;
}

export interface DevelopmentData {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  units: Unit[];
  metrics: DeveloperMetrics;
  recentActivity: SalesActivity[];
  priceHistory: {
    date: Date;
    averagePrice: number;
    unitsAvailable: number;
    changeReason?: string;
  }[];
}

interface DeveloperUnitDashboardProps {
  developmentData: DevelopmentData;
  onUnitEdit: (unitId: string) => void;
  onUnitCreate: () => void;
  onUnitDelete: (unitId: string) => void;
  onBulkUpdate: (unitIds: string[], updates: Partial<Unit>) => void;
  onExportData: (format: 'csv' | 'excel' | 'pdf') => void;
}

export const DeveloperUnitDashboard: React.FC<DeveloperUnitDashboardProps> = ({
  developmentData,
  onUnitEdit,
  onUnitCreate,
  onUnitDelete,
  onBulkUpdate,
  onExportData
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  const { metrics, units, recentActivity } = developmentData;

  const formatPrice = (price: number) => `€${price.toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    
    return {
      value: Math.abs(change),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600'
    };
  };

  const getStatusDistribution = () => {
    const distribution = units.reduce((acc, unit) => {
      acc[unit.status] = (acc[unit.status] || 0) + 1;
      return acc;
    }, {} as Record<UnitStatus, number>);

    return Object.entries(distribution).map(([status, count]) => ({
      status: status as UnitStatus,
      count,
      percentage: (count / units.length) * 100
    }));
  };

  const getTopPerformingUnits = () => {
    return units
      .filter(unit => unit.viewCount && unit.viewCount > 0)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
  };

  const getRevenueByMonth = () => {
    // This would typically come from your analytics service
    return [
      { month: 'Jan', revenue: 2500000, units: 5 },
      { month: 'Feb', revenue: 3200000, units: 7 },
      { month: 'Mar', revenue: 1800000, units: 4 },
      { month: 'Apr', revenue: 4100000, units: 9 },
      { month: 'May', revenue: 2900000, units: 6 },
      { month: 'Jun', revenue: 3600000, units: 8 },
    ];
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {developmentData.name} Dashboard
          </h1>
          <div className="flex items-center space-x-4 text-gray-600 mt-2">
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{developmentData.location}</span>
            </span>
            <span>{metrics.totalUnits} total units</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => onExportData('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={onUnitCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold">{metrics.totalUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{metrics.availableUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.reservedUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.soldUnits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(metrics.totalRevenue)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatPercent(metrics.conversionRate)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Funnel Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-4 mb-2">
              <Eye className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <p className="font-bold text-xl">{metrics.totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-lg p-4 mb-2">
              <Users className="h-8 w-8 text-orange-600 mx-auto" />
            </div>
            <p className="font-bold text-xl">{metrics.totalInquiries}</p>
            <p className="text-sm text-gray-600">Inquiries</p>
            <p className="text-xs text-orange-600">
              {formatPercent(metrics.viewingToInquiryRate)} from views
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 rounded-lg p-4 mb-2">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto" />
            </div>
            <p className="font-bold text-xl">{metrics.exclusivityPurchases}</p>
            <p className="text-sm text-gray-600">Exclusivity Purchases</p>
            <p className="text-xs text-yellow-600">
              {formatPercent(metrics.inquiryToReservationRate)} from inquiries
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-4 mb-2">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
            </div>
            <p className="font-bold text-xl">{metrics.soldUnits}</p>
            <p className="text-sm text-gray-600">Sales</p>
            <p className="text-xs text-green-600">
              {formatPercent(metrics.reservationToSaleRate)} from reservations
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Unit Status Distribution</h3>
              <div className="space-y-3">
                {getStatusDistribution().map(({ status, count, percentage }) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        status === UnitStatus.AVAILABLE ? 'bg-green-100 text-green-800' :
                        status === UnitStatus.RESERVED ? 'bg-orange-100 text-orange-800' :
                        status === UnitStatus.SOLD ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600">{count} units</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={percentage} className="w-16" />
                      <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Performing Units */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Units</h3>
              <div className="space-y-3">
                {getTopPerformingUnits().map((unit, index) => (
                  <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">Unit {unit.unitNumber}</p>
                        <p className="text-sm text-gray-600">{unit.bedrooms} bed • {formatPrice(unit.basePrice)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{unit.viewCount} views</p>
                      <Badge className={
                        unit.status === UnitStatus.AVAILABLE ? 'bg-green-100 text-green-800' :
                        unit.status === UnitStatus.RESERVED ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }>
                        {unit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'sale' ? 'bg-green-100' :
                    activity.type === 'reservation' ? 'bg-orange-100' :
                    activity.type === 'exclusivity' ? 'bg-yellow-100' :
                    activity.type === 'inquiry' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'sale' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'reservation' && <Clock className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'exclusivity' && <Zap className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'inquiry' && <Users className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'view' && <Eye className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.details}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Unit {activity.unitNumber}</span>
                      {activity.buyerName && <span>{activity.buyerName}</span>}
                      {activity.amount && <span>{formatPrice(activity.amount)}</span>}
                      <span>{activity.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-6">
          <UnitsGridListing
            data={{
              units,
              totalCount: units.length,
              summary: {
                available: metrics.availableUnits,
                reserved: metrics.reservedUnits,
                sold: metrics.soldUnits,
                averagePrice: metrics.averagePrice,
                priceRange: {
                  min: Math.min(...units.map(u => u.basePrice)),
                  max: Math.max(...units.map(u => u.basePrice))
                }
              },
              developmentInfo: {
                id: developmentData.id,
                name: developmentData.name,
                location: developmentData.location,
                totalUnits: developmentData.totalUnits
              }
            }}
            viewMode="developer"
            showConversionFeatures={false}
            onUnitEdit={onUnitEdit}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
              <div className="space-y-4">
                {getRevenueByMonth().map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(month.revenue)}</p>
                      <p className="text-xs text-gray-600">{month.units} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Days to Sell</span>
                  <span className="font-bold">{metrics.averageDaysToSell} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">HTB Applications</span>
                  <span className="font-bold">{metrics.htbApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Viewers</span>
                  <span className="font-bold">{metrics.activeViewers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Unit Price</span>
                  <span className="font-bold">{formatPrice(metrics.averagePrice)}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">All Activity</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'sale' ? 'bg-green-100' :
                      activity.type === 'reservation' ? 'bg-orange-100' :
                      activity.type === 'exclusivity' ? 'bg-yellow-100' :
                      activity.type === 'inquiry' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'sale' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {activity.type === 'reservation' && <Clock className="h-5 w-5 text-orange-600" />}
                      {activity.type === 'exclusivity' && <Zap className="h-5 w-5 text-yellow-600" />}
                      {activity.type === 'inquiry' && <Users className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'view' && <Eye className="h-5 w-5 text-gray-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.details}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Unit {activity.unitNumber}</span>
                        {activity.buyerName && <span>{activity.buyerName}</span>}
                        <span>{activity.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatPrice(activity.amount)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperUnitDashboard;