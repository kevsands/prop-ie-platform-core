'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  Plus, 
  ArrowUpRight, 
  Building2, 
  Sparkles, 
  RefreshCw,
  Euro,
  Target,
  Grid,
  Settings,
  Factory,
  Truck
} from 'lucide-react';

export default function DeveloperPropChoiceDashboard() {
  const [activeOrders, setActiveOrders] = useState(47);
  const [pendingApprovals, setPendingApprovals] = useState(12);
  const [monthlyRevenue, setMonthlyRevenue] = useState(156750);

  const quickStats = [
    {
      title: "Active Orders",
      value: activeOrders.toString(),
      icon: ShoppingCart,
      color: "blue",
      change: "+23%"
    },
    {
      title: "Pending Approvals", 
      value: pendingApprovals.toString(),
      icon: Clock,
      color: "amber",
      change: "+5%"
    },
    {
      title: "Monthly Revenue",
      value: `€${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "green", 
      change: "+34%"
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: CheckCircle,
      color: "emerald",
      change: "+8%"
    }
  ];

  const recentOrders = [
    {
      id: "FG-001-PC",
      customer: "Sarah & James Murphy",
      unit: "FG-A-101",
      package: "Premium Living Room Pack",
      value: 4750,
      status: "pending_approval",
      date: "2 hours ago"
    },
    {
      id: "FG-002-PC", 
      customer: "Michael O'Brien",
      unit: "FG-B-205",
      package: "Smart Home Security Package",
      value: 3200,
      status: "approved",
      date: "4 hours ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_production': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PROP Choice Management</h1>
                <p className="text-gray-600">Comprehensive customization and order management system</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" />
                <span className="text-gray-600">3 Active Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-green-600" />
                <span className="text-gray-600">47 Package Options</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-600" />
                <span className="text-gray-600">234 Total Customers</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Plus size={16} />
              New Package
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <RefreshCw size={16} />
              Sync Orders
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-green-600">{stat.change}</span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'amber' ? 'bg-amber-100' :
                stat.color === 'green' ? 'bg-green-100' :
                'bg-emerald-100'
              }`}>
                <stat.icon size={20} className={
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'amber' ? 'text-amber-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  'text-emerald-600'
                } />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Package Management */}
        <Link href="/developer/prop-choice/packages" className="group">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-purple-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Package size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Package Management</h3>
                <p className="text-sm text-gray-600">Create and manage customization packages</p>
              </div>
              <ArrowUpRight size={20} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Packages</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Categories</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Unit Configuration Matrix */}
        <Link href="/developer/prop-choice/units" className="group">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-indigo-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <Grid size={24} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Unit Configuration</h3>
                <p className="text-sm text-gray-600">Manage unit-specific PROP Choice settings</p>
              </div>
              <ArrowUpRight size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Configured Units</span>
                <span className="font-medium">95</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Buyers</span>
                <span className="font-medium">45</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Order Management */}
        <Link href="/developer/prop-choice/orders" className="group">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-green-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <ShoppingCart size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                <p className="text-sm text-gray-600">Process customer orders and approvals</p>
              </div>
              <ArrowUpRight size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Orders</span>
                <span className="font-medium text-amber-600">{pendingApprovals}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium">{activeOrders}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Supply Chain */}
        <Link href="/developer/prop-choice/supply-chain" className="group">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-orange-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Factory size={24} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Supply Chain</h3>
                <p className="text-sm text-gray-600">Manufacturing, suppliers, and logistics</p>
              </div>
              <ArrowUpRight size={20} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Suppliers</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Production</span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Analytics */}
        <Link href="/developer/prop-choice/analytics" className="group">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-pink-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                <BarChart3 size={24} className="text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Analytics & Insights</h3>
                <p className="text-sm text-gray-600">Performance metrics and trends</p>
              </div>
              <ArrowUpRight size={20} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium">73%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Order Value</span>
                <span className="font-medium">€5,240</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link href="/developer/prop-choice/orders" className="text-sm text-purple-600 hover:text-purple-700">
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {recentOrders.map((order, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{order.customer}</span>
                  <span className="text-xs text-gray-500">({order.unit})</span>
                </div>
                <p className="text-sm text-gray-600">{order.package}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-medium text-gray-900">€{order.value.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}