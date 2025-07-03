'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Building2, 
  Euro, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  Truck, 
  Wrench, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ChevronDown, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  RefreshCw, 
  X, 
  Check, 
  AlertCircle, 
  Package, 
  CreditCard, 
  MapPin, 
  Star,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface CustomerOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    buyerId: string;
  };
  unit: {
    id: string;
    number: string;
    project: string;
    type: string;
    expectedCompletion: string;
  };
  packages: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }[];
  totalValue: number;
  creditUsed: number;
  balanceDue: number;
  status: 'pending_review' | 'approved' | 'in_production' | 'ready_to_ship' | 'installing' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  approvedAt?: string;
  expectedDelivery?: string;
  notes: string[];
  approvalRequired: boolean;
  changeRequests: any[];
  assignedTo?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Mock order data
  useEffect(() => {
    const mockOrders: CustomerOrder[] = [
      {
        id: 'ord_001',
        orderNumber: 'PC-2025-001',
        customer: {
          name: 'Sarah & James Murphy',
          email: 'sarah.murphy@email.com',
          phone: '+353 87 123 4567',
          buyerId: 'buyer_001'
        },
        unit: {
          id: 'unit_fg_101',
          number: 'FG-A-101',
          project: 'Fitzgerald Gardens',
          type: '2-bed apartment',
          expectedCompletion: '2025-08-15'
        },
        packages: [
          {
            id: 'pkg_001',
            name: 'Premium Living Room Pack',
            category: 'Room Packs',
            price: 4750,
            quantity: 1
          },
          {
            id: 'pkg_002',
            name: 'Smart Home Security Package',
            category: 'Smart Features',
            price: 3200,
            quantity: 1
          }
        ],
        totalValue: 7950,
        creditUsed: 2500,
        balanceDue: 5450,
        status: 'pending_review',
        priority: 'high',
        submittedAt: '2025-02-01T14:30:00Z',
        notes: ['Customer requested expedited delivery', 'Unit completion scheduled for August'],
        approvalRequired: true,
        changeRequests: []
      },
      {
        id: 'ord_002',
        orderNumber: 'PC-2025-002',
        customer: {
          name: 'Michael O\'Brien',
          email: 'michael.obrien@email.com',
          phone: '+353 86 987 6543',
          buyerId: 'buyer_002'
        },
        unit: {
          id: 'unit_fg_205',
          number: 'FG-B-205',
          project: 'Fitzgerald Gardens',
          type: '1-bed apartment',
          expectedCompletion: '2025-07-20'
        },
        packages: [
          {
            id: 'pkg_002',
            name: 'Smart Home Security Package',
            category: 'Smart Features',
            price: 3200,
            quantity: 1
          }
        ],
        totalValue: 3200,
        creditUsed: 2500,
        balanceDue: 700,
        status: 'approved',
        priority: 'medium',
        submittedAt: '2025-01-28T10:15:00Z',
        approvedAt: '2025-01-29T09:30:00Z',
        expectedDelivery: '2025-07-15',
        notes: ['Standard installation requested'],
        approvalRequired: false,
        changeRequests: []
      },
      {
        id: 'ord_003',
        orderNumber: 'PC-2025-003',
        customer: {
          name: 'Emma & David Lee',
          email: 'emma.lee@email.com',
          phone: '+353 85 456 7890',
          buyerId: 'buyer_003'
        },
        unit: {
          id: 'unit_ew_301',
          number: 'EW-C-301',
          project: 'Ellwood',
          type: '3-bed apartment',
          expectedCompletion: '2025-09-30'
        },
        packages: [
          {
            id: 'pkg_003',
            name: 'Luxury Kitchen Upgrade',
            category: 'Premium Upgrades',
            price: 8950,
            quantity: 1
          },
          {
            id: 'pkg_001',
            name: 'Premium Living Room Pack',
            category: 'Room Packs',
            price: 4750,
            quantity: 1
          }
        ],
        totalValue: 13700,
        creditUsed: 2500,
        balanceDue: 11200,
        status: 'in_production',
        priority: 'medium',
        submittedAt: '2025-01-20T16:45:00Z',
        approvedAt: '2025-01-22T11:00:00Z',
        expectedDelivery: '2025-09-20',
        notes: ['Custom kitchen layout approved', 'Wine cooler upgrade confirmed'],
        approvalRequired: false,
        changeRequests: [],
        assignedTo: 'Production Team A'
      },
      {
        id: 'ord_004',
        orderNumber: 'PC-2025-004',
        customer: {
          name: 'Robert & Lisa Walsh',
          email: 'robert.walsh@email.com',
          phone: '+353 87 321 6547',
          buyerId: 'buyer_004'
        },
        unit: {
          id: 'unit_bv_150',
          number: 'BV-A-150',
          project: 'Ballymakenny View',
          type: '2-bed apartment',
          expectedCompletion: '2025-06-30'
        },
        packages: [
          {
            id: 'pkg_002',
            name: 'Smart Home Security Package',
            category: 'Smart Features',
            price: 3200,
            quantity: 1
          },
          {
            id: 'pkg_005',
            name: 'Climate Control Pro',
            category: 'Smart Features',
            price: 2400,
            quantity: 1
          }
        ],
        totalValue: 5600,
        creditUsed: 2500,
        balanceDue: 3100,
        status: 'ready_to_ship',
        priority: 'medium',
        submittedAt: '2025-01-15T12:20:00Z',
        approvedAt: '2025-01-16T14:15:00Z',
        expectedDelivery: '2025-06-25',
        notes: ['All items ready for installation', 'Customer confirmed installation date'],
        approvalRequired: false,
        changeRequests: [],
        assignedTo: 'Installation Team B'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.unit.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || order.unit.project === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending_review').length,
    approved: orders.filter(o => o.status === 'approved').length,
    inProduction: orders.filter(o => o.status === 'in_production').length,
    readyToShip: orders.filter(o => o.status === 'ready_to_ship').length,
    totalValue: orders.reduce((sum, o) => sum + o.totalValue, 0),
    averageOrder: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalValue, 0) / orders.length : 0
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock, label: 'Pending Review' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle, label: 'Approved' },
      in_production: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Wrench, label: 'In Production' },
      ready_to_ship: { bg: 'bg-green-100', text: 'text-green-800', icon: Package, label: 'Ready to Ship' },
      installing: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Truck, label: 'Installing' },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle, label: 'Completed' },
      on_hold: { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle, label: 'On Hold' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: X, label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
    const Icon = config.icon;

    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full flex items-center gap-1`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-800' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleOrderAction = (orderId: string, action: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        switch (action) {
          case 'approve':
            return { ...order, status: 'approved' as const, approvedAt: new Date().toISOString() };
          case 'hold':
            return { ...order, status: 'on_hold' as const };
          case 'production':
            return { ...order, status: 'in_production' as const };
          case 'ship':
            return { ...order, status: 'ready_to_ship' as const };
          default:
            return order;
        }
      }
      return order;
    }));
  };

  const handleViewOrder = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600">Track and manage customer PROP Choice orders</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-blue-600" />
                <span className="text-gray-600">{orderStats.total} Total Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-600" />
                <span className="text-gray-600">{orderStats.pending} Pending Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro size={16} className="text-green-600" />
                <span className="text-gray-600">{formatCurrency(orderStats.totalValue)} Total Value</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/developer/prop-choice" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ArrowUpRight size={16} />
              Back to Dashboard
            </Link>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <RefreshCw size={16} />
              Sync Orders
            </button>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-600" />
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-xl font-bold text-gray-900">{orderStats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Wrench size={20} className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">In Production</p>
              <p className="text-xl font-bold text-gray-900">{orderStats.inProduction}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Ready to Ship</p>
              <p className="text-xl font-bold text-gray-900">{orderStats.readyToShip}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(orderStats.averageOrder)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers, or units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="in_production">In Production</option>
              <option value="ready_to_ship">Ready to Ship</option>
              <option value="installing">Installing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Project Filter */}
          <div className="relative">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="all">All Projects</option>
              <option value="Fitzgerald Gardens">Fitzgerald Gardens</option>
              <option value="Ellwood">Ellwood</option>
              <option value="Ballymakenny View">Ballymakenny View</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Orders ({filteredOrders.length})
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.packages.length} item(s)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.unit.number}</div>
                      <div className="text-sm text-gray-500">{order.unit.project}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{formatCurrency(order.totalValue)}</div>
                      <div className="text-sm text-gray-500">Due: {formatCurrency(order.balanceDue)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(order.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.submittedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </button>
                      {order.status === 'pending_review' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'approve')}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-600">{selectedOrder.orderNumber}</p>
              </div>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer & Unit Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedOrder.customer.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Unit Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedOrder.unit.number} - {selectedOrder.unit.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedOrder.unit.project}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm">Expected completion: {new Date(selectedOrder.unit.expectedCompletion).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status & Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Status</h4>
                <div className="flex items-center gap-4 mb-4">
                  {getStatusBadge(selectedOrder.status)}
                  {getPriorityBadge(selectedOrder.priority)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{formatDate(selectedOrder.submittedAt)}</p>
                  </div>
                  {selectedOrder.approvedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Approved</p>
                      <p className="font-medium">{formatDate(selectedOrder.approvedAt)}</p>
                    </div>
                  )}
                  {selectedOrder.expectedDelivery && (
                    <div>
                      <p className="text-sm text-gray-600">Expected Delivery</p>
                      <p className="font-medium">{new Date(selectedOrder.expectedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.packages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{pkg.name}</p>
                        <p className="text-sm text-gray-600">{pkg.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(pkg.price)}</p>
                        <p className="text-sm text-gray-600">Qty: {pkg.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Financial Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PROP Choice Credit Used:</span>
                    <span className="text-green-600">-{formatCurrency(selectedOrder.creditUsed)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-gray-900">Balance Due:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(selectedOrder.balanceDue)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="space-y-2">
                    {selectedOrder.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 border-t pt-6">
                {selectedOrder.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => {
                        handleOrderAction(selectedOrder.id, 'approve');
                        setShowOrderDetails(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Approve Order
                    </button>
                    <button
                      onClick={() => {
                        handleOrderAction(selectedOrder.id, 'hold');
                        setShowOrderDetails(false);
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      Put on Hold
                    </button>
                  </>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <MessageSquare size={16} />
                  Contact Customer
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download size={16} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all'
              ? 'Try adjusting your filters to see more orders.'
              : 'Orders will appear here as customers submit PROP Choice customizations.'
            }
          </p>
        </div>
      )}
    </div>
  );
}