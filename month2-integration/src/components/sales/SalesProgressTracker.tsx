'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Home, 
  Building, 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  PieChart, 
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Search,
  Filter,
  Eye,
  CalendarRange,
  CircleDollarSign,
  Briefcase,
  BarChart4,
  Tag,
  Clock5
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  SalesProgressTrackerProps, 
  UnitType, 
  UnitStatus, 
  PropertyUnit 
} from '../../types/sales';
import { formatCurrency, formatDate, formatTimeAgo, formatPercentage } from '../../utils/finance/formatting';

// Status color mapping
const statusColorMap: Record<UnitStatus, string> = {
  available: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900',
  sold: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900',
  pending: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900',
  withdrawn: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
};

const statusTextMap: Record<UnitStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  pending: 'Pending',
  withdrawn: 'Withdrawn'
};

// Unit type color mapping
const unitTypeColorMap: Record<UnitType, string> = {
  apartment: '#3b82f6', // blue
  house: '#10b981', // green
  duplex: '#8b5cf6', // purple
  penthouse: '#f97316', // orange
  commercial: '#6b7280' // gray
};

// Lead status color mapping
const leadStatusColorMap: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
  contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900',
  viewing_scheduled: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900',
  viewed: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-900',
  interested: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-900',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900',
  contract: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900',
  closed: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900',
  lost: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900'
};

// Activity type icon mapping
const activityTypeIconMap: Record<string, React.ReactNode> = {
  viewing: <Eye className="h-4 w-4" />,
  reservation: <CalendarRange className="h-4 w-4" />,
  sale: <CheckCircle className="h-4 w-4" />,
  cancellation: <CircleDollarSign className="h-4 w-4" />,
  price_change: <Tag className="h-4 w-4" />,
  status_change: <ArrowUpRight className="h-4 w-4" />
};

const SalesProgressTracker: React.FC<SalesProgressTrackerProps> = ({
  projectId,
  className,
  filterByUnitType,
  filterByLocation,
  showLeads = true
}) => {
  // Local state for filters
  const [unitTypeFilter, setUnitTypeFilter] = useState<UnitType | 'all'>(
    filterByUnitType || 'all'
  );
  const [locationFilter, setLocationFilter] = useState<string | 'all'>(
    filterByLocation || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch sales data
  const { data, isLoading, error } = useQuery({
    queryKey: ['project-sales', projectId, unitTypeFilter, locationFilter],
    queryFn: async () => {
      // In production, this would fetch from API
      const url = new URL(`/api/projects/${projectId}/sales`, window.location.origin);
      
      if (unitTypeFilter !== 'all') {
        url.searchParams.append('unitType', unitTypeFilter);
      }
      
      if (locationFilter !== 'all') {
        url.searchParams.append('location', locationFilter);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      
      return response.json();
    },
    enabled: !!projectId
  });

  // Filter units based on status
  const filteredUnits = React.useMemo(() => {
    if (!data?.units) return [];
    
    return data.units.filter((unit: PropertyUnit) => {
      if (statusFilter !== 'all' && unit.status !== statusFilter) return false;
      return true;
    });
  }, [data?.units, statusFilter]);

  // Helper function to get status badge
  const getStatusBadge = (status: UnitStatus) => (
    <Badge variant="outline" className={statusColorMap[status]}>
      {statusTextMap[status]}
    </Badge>
  );

  // Helper function to generate unit grid visualization
  const renderUnitGrid = () => {
    if (!data?.units) return null;
    
    // Group units by location (block/floor)
    const unitsByLocation: Record<string, PropertyUnit[]> = {};
    
    data.units.forEach((unit: PropertyUnit) => {
      const location = unit.location || 'Unknown';
      if (!unitsByLocation[location]) {
        unitsByLocation[location] = [];
      }
      unitsByLocation[location].push(unit);
    });

    return (
      <div className="space-y-6">
        {Object.entries(unitsByLocation).map(([location, units]) => (
          <div key={location} className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {location}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {units.map((unit) => (
                <div 
                  key={unit.id}
                  className={`
                    p-2 text-center rounded-md border text-xs
                    ${statusColorMap[unit.status]}
                    hover:shadow-md transition-shadow cursor-pointer
                  `}
                  title={`${unit.unitNumber} - ${unit.bedrooms}bed ${unit.type} - ${formatCurrency(unit.price)}`}
                >
                  <div className="font-medium">{unit.unitNumber}</div>
                  <div className="text-[10px] opacity-80">
                    {unit.bedrooms}B {unit.type.slice(0, 3)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-32">
                <CardHeader className="pb-2">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={className}>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error Loading Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading the sales data. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Home className="h-6 w-6 text-blue-500" />
            Sales Progress Tracker
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor sales activity and track unit status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={unitTypeFilter} onValueChange={(value) => setUnitTypeFilter(value as UnitType | 'all')}>
            <SelectTrigger className="w-[160px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Unit Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartments</SelectItem>
              <SelectItem value="house">Houses</SelectItem>
              <SelectItem value="duplex">Duplexes</SelectItem>
              <SelectItem value="penthouse">Penthouses</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[160px]">
              <PieChart className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {data?.locationMetrics?.map((location: any) => (
                <SelectItem key={location.location} value={location.location}>
                  {location.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UnitStatus | 'all')}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <PieChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="units">
            <Building className="h-4 w-4 mr-2" />
            Units
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          {showLeads && (
            <TabsTrigger value="leads">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Units Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Home className="h-4 w-4 text-blue-500" />
                    Units Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {data?.salesSummary?.soldUnits}/{data?.salesSummary?.totalUnits}
                  </div>
                  <Progress 
                    value={(data?.salesSummary?.soldUnits / data?.salesSummary?.totalUnits) * 100} 
                    className="h-2 mb-3" 
                  />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col items-center p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/30">
                      <span className="font-semibold">{data?.salesSummary?.availableUnits}</span>
                      <span className="text-slate-500 dark:text-slate-400">Available</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/30">
                      <span className="font-semibold">{data?.salesSummary?.reservedUnits}</span>
                      <span className="text-slate-500 dark:text-slate-400">Reserved</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 rounded-md bg-green-50 dark:bg-green-950/30">
                      <span className="font-semibold">{data?.salesSummary?.soldUnits}</span>
                      <span className="text-slate-500 dark:text-slate-400">Sold</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Value */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Sales Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {formatCurrency(data?.salesSummary?.soldValue, true)}
                  </div>
                  <Progress 
                    value={(data?.salesSummary?.soldValue / data?.salesSummary?.totalValue) * 100} 
                    className="h-2 mb-3" 
                    indicatorClassName="bg-green-500"
                  />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col p-1.5 rounded-md bg-green-50 dark:bg-green-950/30">
                      <span className="font-semibold">{formatCurrency(data?.salesSummary?.soldValue, true)}</span>
                      <span className="text-slate-500 dark:text-slate-400">Sold Value</span>
                    </div>
                    <div className="flex flex-col p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/30">
                      <span className="font-semibold">{formatCurrency(data?.salesSummary?.reservedValue, true)}</span>
                      <span className="text-slate-500 dark:text-slate-400">Reserved Value</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <BarChart4 className="h-4 w-4 text-purple-500" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Avg. Price:</span>
                    <span className="font-semibold">{formatCurrency(data?.salesSummary?.averageSalePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Avg. Days on Market:</span>
                    <span className="font-semibold">{data?.salesSummary?.averageDaysOnMarket} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Conversion Rate:</span>
                    <span className="font-semibold">{data?.salesSummary?.conversionRate}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Velocity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock5 className="h-4 w-4 text-amber-500" />
                    Sales Velocity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold flex items-baseline gap-2">
                    {data?.salesSummary?.salesVelocity}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">units/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Target:</span>
                    <span className="font-semibold">{data?.salesSummary?.targetSalesPerMonth} per month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Actual:</span>
                    <span className="font-semibold">{data?.salesSummary?.actualSalesPerMonth} per month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Unit Type & Location Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unit Type Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    Sales by Unit Type
                  </CardTitle>
                  <CardDescription>Breakdown of sales by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.unitTypeMetrics?.map((metric: any) => (
                      <div key={metric.type} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: unitTypeColorMap[metric.type as UnitType] }}
                            ></div>
                            <span className="font-medium capitalize">{metric.type}</span>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {metric.sold}/{metric.total} units
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={metric.percentageSold} 
                            className="h-2" 
                            indicatorClassName={`bg-[${unitTypeColorMap[metric.type as UnitType]}]`}
                          />
                          <span className="text-sm font-medium min-w-[40px] text-right">
                            {metric.percentageSold}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Avg. Price: {formatCurrency(metric.averagePrice)}</span>
                          <span>Avg. Days: {metric.averageDaysOnMarket}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-500" />
                    Sales by Location
                  </CardTitle>
                  <CardDescription>Breakdown of sales by block/location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.locationMetrics?.map((metric: any, index: number) => (
                      <div key={metric.location} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'][index % 3] }}
                            ></div>
                            <span className="font-medium">{metric.location}</span>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {metric.sold}/{metric.total} units
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={metric.percentageSold} 
                            className="h-2" 
                            indicatorClassName={`bg-[${['#3b82f6', '#10b981', '#8b5cf6'][index % 3]}]`}
                          />
                          <span className="text-sm font-medium min-w-[40px] text-right">
                            {metric.percentageSold}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sales Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Recent Sales Activity
                </CardTitle>
                <CardDescription>Latest updates and status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.salesActivity?.slice(0, 3).map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-full 
                        ${activity.type === 'sale' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                          : activity.type === 'reservation' 
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        }
                      `}>
                        {activityTypeIconMap[activity.type]}
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-medium">{activity.unitNumber}</span>
                          <Badge variant="outline" className="ml-0 sm:ml-1">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          {activity.type === 'status_change' || activity.type === 'reservation' || activity.type === 'sale'
                            ? `Status changed from ${activity.previousStatus} to ${activity.newStatus}`
                            : activity.type === 'price_change'
                            ? `Price changed from ${formatCurrency(activity.previousPrice)} to ${formatCurrency(activity.newPrice)}`
                            : activity.type === 'viewing'
                            ? `Viewing with ${activity.clientName}`
                            : activity.message || `Activity by ${activity.agentName}`
                          }
                        </p>
                        {activity.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('activity')}>
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Unit Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Unit Status Overview
                </CardTitle>
                <CardDescription>Visual representation of sales status by location</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUnitGrid()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                Property Units
              </CardTitle>
              <CardDescription>Complete list of all property units and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Bedrooms</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.map((unit: PropertyUnit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                      <TableCell className="capitalize">{unit.type}</TableCell>
                      <TableCell>{unit.area} m²</TableCell>
                      <TableCell>{unit.bedrooms}</TableCell>
                      <TableCell>{formatCurrency(unit.price)}</TableCell>
                      <TableCell>{getStatusBadge(unit.status)}</TableCell>
                      <TableCell>{unit.location || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Sales Activity Log
              </CardTitle>
              <CardDescription>Chronological log of all sales activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {data?.salesActivity?.map((activity: any, index: number) => (
                    <div key={activity.id}>
                      <div className="flex items-start gap-4">
                        <div className={`
                          p-2.5 rounded-full 
                          ${activity.type === 'sale' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                            : activity.type === 'reservation' 
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                            : activity.type === 'viewing'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : activity.type === 'price_change'
                            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }
                        `}>
                          {activityTypeIconMap[activity.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="font-medium">Unit {activity.unitNumber}</span>
                              <Badge variant="outline">
                                {activity.type.replace('_', ' ')}
                              </Badge>
                              {activity.agentName && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                  Agent: {activity.agentName}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-2">
                            {activity.type === 'status_change' || activity.type === 'reservation' || activity.type === 'sale'
                              ? `Status changed from ${activity.previousStatus} to ${activity.newStatus}`
                              : activity.type === 'price_change'
                              ? `Price changed from ${formatCurrency(activity.previousPrice)} to ${formatCurrency(activity.newPrice)}`
                              : activity.type === 'viewing'
                              ? `Viewing with ${activity.clientName}`
                              : activity.message || `Activity by ${activity.agentName}`
                            }
                          </p>
                          {activity.clientName && activity.type !== 'viewing' && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              Client: {activity.clientName}
                            </p>
                          )}
                          {activity.notes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {index < data.salesActivity.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leads Tab */}
        {showLeads && (
          <TabsContent value="leads">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Leads Summary Card */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Lead Pipeline
                  </CardTitle>
                  <CardDescription>Overview of prospective buyers in the sales funnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm text-slate-500 dark:text-slate-400">New</span>
                      <span className="text-2xl font-bold">{data?.leadsSummary?.newLeads}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Contacted</span>
                      <span className="text-2xl font-bold">
                        {data?.leadsSummary?.contactedLeads + data?.leadsSummary?.viewingScheduledLeads}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Viewed</span>
                      <span className="text-2xl font-bold">
                        {data?.leadsSummary?.viewedLeads + data?.leadsSummary?.interestedLeads}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Reserved</span>
                      <span className="text-2xl font-bold">
                        {data?.leadsSummary?.reservedLeads + data?.leadsSummary?.contractLeads}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Closed</span>
                      <span className="text-2xl font-bold">{data?.leadsSummary?.closedLeads}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Conversion Rate
                      </div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold mr-2">{data?.leadsSummary?.conversionRate}%</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">of leads convert to sales</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Avg. Time to Reservation
                      </div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold mr-2">{data?.leadsSummary?.averageTimeToReservation}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">days from first contact</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Total Active Leads
                      </div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold mr-2">
                          {data?.leadsSummary?.totalLeads - data?.leadsSummary?.closedLeads - data?.leadsSummary?.lostLeads}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          of {data?.leadsSummary?.totalLeads} total
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Leads Table */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Active Leads</CardTitle>
                  <CardDescription>Prospective buyers currently in the sales pipeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Requirements</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.leads?.map((lead: any) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="font-medium">{lead.clientName}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{lead.clientEmail}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={leadStatusColorMap[lead.status]}>
                              {lead.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {lead.budget ? 
                              `${formatCurrency(lead.budget.min)} - ${formatCurrency(lead.budget.max)}` : 
                              'Not specified'
                            }
                          </TableCell>
                          <TableCell>
                            {lead.requirements?.minBedrooms ?
                              `${lead.requirements.minBedrooms}+ bed` :
                              'Not specified'
                            }
                            {lead.requirements?.preferences && 
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {lead.requirements.preferences.join(', ')}
                              </div>
                            }
                          </TableCell>
                          <TableCell>{lead.assignedAgentName || '-'}</TableCell>
                          <TableCell>
                            <div>{formatDate(lead.lastContactDate)}</div>
                            {lead.nextFollowUpDate && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                Follow up: {formatDate(lead.nextFollowUpDate)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              lead.priority === 'high' ? 'default' :
                              lead.priority === 'medium' ? 'secondary' :
                              'outline'
                            }>
                              {lead.priority || 'low'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SalesProgressTracker;