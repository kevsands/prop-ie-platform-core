'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Factory, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin,
  Phone,
  Mail,
  Star,
  Plus,
  Eye,
  Edit,
  Wrench,
  Shield,
  Leaf,
  Target,
  Activity,
  ArrowUpRight,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

/**
 * Enterprise Manufacturing & Supply Chain Management Dashboard
 * Comprehensive management of production, suppliers, and delivery logistics
 * Real-time tracking and performance monitoring
 */

interface Supplier {
  supplierId: string;
  name: string;
  category: string;
  contact: any;
  capabilities: any;
  performance: any;
  contractTerms: any;
  status: string;
  currentOrders: number;
  nextAvailableSlot: string;
}

interface ProductionOrder {
  orderId: string;
  propChoiceOrderId: string;
  supplierId: string;
  unitId: string;
  buyerName: string;
  items: any[];
  timeline: any;
  costs: any;
  status: string;
  progress?: any;
}

const SupplyChainManagement: React.FC = () => {
  const [supplyChainData, setSupplyChainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    timeframe: '30d'
  });

  // Load supply chain data
  useEffect(() => {
    fetchSupplyChainData();
  }, [filters]);

  const fetchSupplyChainData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('projectId', 'proj_fitzgerald_gardens');
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/developer/prop-choice/supply-chain?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setSupplyChainData(result.data);
      }
    } catch (error) {
      console.error('Failed to load supply chain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in_production': 'bg-purple-100 text-purple-800',
      'ready_for_delivery': 'bg-green-100 text-green-800',
      'in_transit': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-emerald-100 text-emerald-800',
      'installed': 'bg-teal-100 text-teal-800',
      'completed': 'bg-gray-100 text-gray-800',
      'active': 'bg-green-100 text-green-800',
      'under_review': 'bg-amber-100 text-amber-800'
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatStatus = (status: string) => 
    status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading supply chain data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing & Supply Chain</h1>
          <p className="text-gray-600 mt-2">
            Manage production, suppliers, and delivery logistics for {supplyChainData?.overview?.projectName}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={fetchSupplyChainData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{supplyChainData?.overview?.totalActiveOrders}</p>
                <p className="text-xs text-green-600">+23% vs last month</p>
              </div>
              <Factory className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Deliveries</p>
                <p className="text-2xl font-bold">{supplyChainData?.overview?.totalPendingDeliveries}</p>
                <p className="text-xs text-amber-600">Due this week</p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(supplyChainData?.overview?.totalValueInProduction || 0)}
                </p>
                <p className="text-xs text-purple-600">In production</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                <p className="text-2xl font-bold">{supplyChainData?.overview?.onTimeDeliveryRate}%</p>
                <p className="text-xs text-green-600">Above target</p>
              </div>
              <Target className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="production">Production Orders</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="delivery">Delivery & Logistics</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex space-x-2">
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="in_production">In Production</SelectItem>
                <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <OverviewDashboard data={supplyChainData} />
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <ProductionOrdersView 
            orders={supplyChainData?.productionOrders || []}
            suppliers={supplyChainData?.suppliers || []}
          />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <SuppliersView suppliers={supplyChainData?.suppliers || []} />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <DeliveryLogisticsView 
            deliveries={supplyChainData?.deliverySchedule || []}
            installationData={supplyChainData?.installationCoordination}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsView analytics={supplyChainData?.analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Overview Dashboard Component
const OverviewDashboard: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Production Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Production Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.productionOrders?.slice(0, 3).map((order: ProductionOrder) => (
              <div key={order.orderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{order.buyerName}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{order.items[0]?.description}</p>
                  {order.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{order.progress.currentStage.replace('_', ' ')}</span>
                        <span>{order.progress.percentage}%</span>
                      </div>
                      <Progress value={order.progress.percentage} className="h-2" />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.costs.totalCost)}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(order.timeline.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Suppliers Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.suppliers?.slice(0, 3).map((supplier: Supplier) => (
              <div key={supplier.supplierId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{supplier.name}</span>
                    <Badge variant="outline" className="capitalize">{supplier.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {supplier.performance.qualityScore}
                    </span>
                    <span>{supplier.performance.deliveryReliability}% on-time</span>
                    <span>{supplier.currentOrders} active orders</span>
                  </div>
                </div>
                <Badge className={getStatusColor(supplier.status)}>
                  {formatStatus(supplier.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.deliverySchedule?.map((delivery: any) => (
              <div key={delivery.deliveryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{delivery.buyerName}</span>
                    <Badge className={getStatusColor(delivery.status)}>
                      {formatStatus(delivery.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{delivery.unitId}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(delivery.deliveryWindow.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {delivery.deliveryWindow.timeSlot}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors & Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Factors & Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.analytics?.riskFactors?.map((risk: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-amber-400 bg-amber-50 rounded">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-amber-900">{risk.category.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-sm text-amber-800">{risk.description}</p>
                  <p className="text-xs text-amber-700 mt-1">Mitigation: {risk.mitigation}</p>
                </div>
              </div>
            ))}
            
            {data?.analytics?.opportunities?.map((opportunity: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50 rounded">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">{opportunity.category.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-sm text-green-800">{opportunity.description}</p>
                  <p className="text-xs text-green-700 mt-1">Potential: {opportunity.potential}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Production Orders View Component
const ProductionOrdersView: React.FC<{ orders: ProductionOrder[]; suppliers: Supplier[] }> = ({ orders, suppliers }) => {
  const getSupplierName = (supplierId: string) => 
    suppliers.find(s => s.supplierId === supplierId)?.name || 'Unknown Supplier';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Production Orders</h3>
        <CreateProductionOrderDialog suppliers={suppliers} />
      </div>

      <div className="grid gap-4">
        {orders.map(order => (
          <Card key={order.orderId}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{order.buyerName}</h4>
                    <Badge className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{order.unitId} • {getSupplierName(order.supplierId)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(order.costs.totalCost)}</p>
                  <p className="text-sm text-gray-600">Order #{order.orderId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500">Items</Label>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">{item.description}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Timeline</Label>
                  <div className="space-y-1 text-sm">
                    <p>Started: {new Date(order.timeline.productionStart).toLocaleDateString()}</p>
                    <p>Delivery: {new Date(order.timeline.deliveryDate).toLocaleDateString()}</p>
                    {order.timeline.installationDate && (
                      <p>Installation: {new Date(order.timeline.installationDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Cost Breakdown</Label>
                  <div className="space-y-1 text-sm">
                    <p>Materials: {formatCurrency(order.costs.materialCost)}</p>
                    <p>Labor: {formatCurrency(order.costs.laborCost)}</p>
                    <p>Shipping: {formatCurrency(order.costs.shippingCost)}</p>
                  </div>
                </div>
              </div>

              {order.progress && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs text-gray-500">Progress</Label>
                    <span className="text-sm font-medium">{order.progress.percentage}%</span>
                  </div>
                  <Progress value={order.progress.percentage} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current: {order.progress.currentStage.replace('_', ' ')}</span>
                    <span>Next: {order.progress.nextMilestone?.replace('_', ' ')}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Suppliers View Component
const SuppliersView: React.FC<{ suppliers: Supplier[] }> = ({ suppliers }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Supplier Management</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(supplier => (
          <Card key={supplier.supplierId}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold">{supplier.name}</h4>
                  <Badge variant="outline" className="capitalize mt-1">{supplier.category}</Badge>
                </div>
                <Badge className={getStatusColor(supplier.status)}>
                  {formatStatus(supplier.status)}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quality Score</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{supplier.performance.qualityScore}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On-Time Delivery</span>
                  <span className="font-medium">{supplier.performance.deliveryReliability}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Orders</span>
                  <span className="font-medium">{supplier.currentOrders}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lead Time</span>
                  <span className="font-medium">
                    {supplier.capabilities.leadTimeRange.min}-{supplier.capabilities.leadTimeRange.max} days
                  </span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Next Available</span>
                  <span className="text-xs">{new Date(supplier.nextAvailableSlot).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  {supplier.capabilities.sustainabilityRating === 'A' && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Leaf className="h-3 w-3 mr-1" />
                      Eco A
                    </Badge>
                  )}
                  {supplier.capabilities.installationServices && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <Wrench className="h-3 w-3 mr-1" />
                      Install
                    </Badge>
                  )}
                  {supplier.capabilities.qualityCertifications.includes('ISO 9001') && (
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      <Shield className="h-3 w-3 mr-1" />
                      ISO
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status: string) => {
  const statusMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'in_production': 'bg-purple-100 text-purple-800',
    'ready_for_delivery': 'bg-green-100 text-green-800',
    'in_transit': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-emerald-100 text-emerald-800',
    'installed': 'bg-teal-100 text-teal-800',
    'completed': 'bg-gray-100 text-gray-800',
    'active': 'bg-green-100 text-green-800',
    'under_review': 'bg-amber-100 text-amber-800',
    'scheduled': 'bg-blue-100 text-blue-800'
  };
  return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
};

const formatStatus = (status: string) => 
  status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

// Delivery & Logistics View Component
const DeliveryLogisticsView: React.FC<{ deliveries: any[]; installationData: any }> = ({ deliveries, installationData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map(delivery => (
                <div key={delivery.deliveryId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{delivery.buyerName}</h4>
                      <p className="text-sm text-gray-600">{delivery.unitId}</p>
                    </div>
                    <Badge className={getStatusColor(delivery.status)}>
                      {formatStatus(delivery.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Delivery Date</p>
                      <p>{new Date(delivery.deliveryWindow.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time Slot</p>
                      <p>{delivery.deliveryWindow.timeSlot}</p>
                    </div>
                  </div>

                  {delivery.tracking?.trackingNumber && (
                    <div className="mt-3 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-800">
                        Tracking: {delivery.tracking.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Installation Teams */}
        <Card>
          <CardHeader>
            <CardTitle>Installation Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {installationData?.installationTeams?.map((team: any) => (
                <div key={team.teamId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-gray-600">
                        {team.specialties.join(', ')}
                      </p>
                    </div>
                    <Badge className={team.availability === 'available' ? getStatusColor('active') : getStatusColor('pending')}>
                      {team.availability}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{team.performanceRating}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Next available: {new Date(team.nextAvailableDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installation Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Installation Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{installationData?.activeInstallations}</p>
              <p className="text-sm text-gray-600">Active Installations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{installationData?.scheduledInstallations}</p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{installationData?.completedThisMonth}</p>
              <p className="text-sm text-gray-600">Completed This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">1.2</p>
              <p className="text-sm text-gray-600">Avg Days/Install</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Analytics View Component
const AnalyticsView: React.FC<{ analytics: any }> = ({ analytics }) => {
  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>On-Time Delivery</span>
              <div className="flex items-center space-x-2">
                <Progress value={analytics.performance?.overallOnTimeDelivery} className="w-24 h-2" />
                <span className="font-medium">{analytics.performance?.overallOnTimeDelivery}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Quality Score</span>
              <div className="flex items-center space-x-2">
                <Progress value={analytics.performance?.qualityScore * 20} className="w-24 h-2" />
                <span className="font-medium">{analytics.performance?.qualityScore}/5</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Supplier Satisfaction</span>
              <div className="flex items-center space-x-2">
                <Progress value={analytics.performance?.supplierSatisfaction * 20} className="w-24 h-2" />
                <span className="font-medium">{analytics.performance?.supplierSatisfaction}/5</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Cost Variance</span>
              <span className={`font-medium ${analytics.performance?.costVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.performance?.costVariance}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demand Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.trends?.demandPatterns || {}).map(([category, data]: [string, any]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium">{category}</span>
                  <Badge variant={data.demand === 'high' ? 'default' : data.demand === 'moderate' ? 'secondary' : 'outline'}>
                    {data.demand} demand
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Lead Time Trend</span>
                  <span className={`${data.leadTime === 'increasing' ? 'text-red-600' : data.leadTime === 'decreasing' ? 'text-green-600' : 'text-gray-600'}`}>
                    {data.leadTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Cost Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(analytics.trends?.costTrends || {}).map(([cost, trend]: [string, any]) => (
              <div key={cost} className="text-center">
                <p className="text-sm text-gray-600 capitalize">{cost.replace('Costs', ' Costs')}</p>
                <p className={`font-medium ${
                  trend === 'increasing' ? 'text-red-600' : 
                  trend === 'decreasing' ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {trend}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Create Production Order Dialog Component
const CreateProductionOrderDialog: React.FC<{ suppliers: Supplier[] }> = ({ suppliers }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    unitId: '',
    items: [],
    deliveryDate: '',
    priority: 'normal'
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Production Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Production Order</DialogTitle>
          <DialogDescription>
            Create a new production order for a PROP Choice customization
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Select 
              value={formData.supplierId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name} ({supplier.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unitId">Unit ID</Label>
            <Input 
              id="unitId"
              value={formData.unitId}
              onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
              placeholder="e.g., unit_fg_2b_15"
            />
          </div>

          <div>
            <Label htmlFor="deliveryDate">Required Delivery Date</Label>
            <Input 
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">
            Create Production Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplyChainManagement;