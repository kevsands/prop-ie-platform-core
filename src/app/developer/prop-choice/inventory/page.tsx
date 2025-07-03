'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  Factory, 
  DollarSign, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Upload, 
  RefreshCw, 
  ChevronDown, 
  ArrowUpRight, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  Target, 
  Users, 
  Building2,
  ShoppingCart,
  Archive,
  Star,
  Activity
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'furniture' | 'electronics' | 'fixtures' | 'appliances' | 'accessories';
  packageId?: string;
  packageName?: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  retailPrice: number;
  margin: number;
  supplier: {
    id: string;
    name: string;
    contactEmail: string;
    leadTimeDays: number;
    reliability: number;
  };
  location: string;
  lastOrdered?: string;
  lastReceived?: string;
  nextDelivery?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' | 'pending_order';
  qualityGrade: 'A' | 'B' | 'C';
  notes: string[];
  totalValue: number;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  leadTimeDays: number;
  reliability: number;
  totalItems: number;
  totalValue: number;
  paymentTerms: string;
  status: 'active' | 'inactive' | 'pending';
}

export default function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers' | 'orders'>('inventory');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  // Mock inventory data
  useEffect(() => {
    const mockSuppliers: Supplier[] = [
      {
        id: 'sup_001',
        name: 'Premium Furniture Co.',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@premiumfurniture.ie',
        phone: '+353 1 234 5678',
        address: 'Dublin Industrial Estate, Dublin',
        leadTimeDays: 14,
        reliability: 95,
        totalItems: 45,
        totalValue: 125000,
        paymentTerms: 'Net 30',
        status: 'active'
      },
      {
        id: 'sup_002', 
        name: 'Smart Tech Solutions',
        contactPerson: 'Michael Chen',
        email: 'michael@smarttech.ie',
        phone: '+353 21 987 6543',
        address: 'Cork Technology Park, Cork',
        leadTimeDays: 10,
        reliability: 98,
        totalItems: 23,
        totalValue: 89000,
        paymentTerms: 'Net 15',
        status: 'active'
      },
      {
        id: 'sup_003',
        name: 'Luxury Appliances Ltd',
        contactPerson: 'Emma Walsh',
        email: 'emma@luxuryappliances.ie',
        phone: '+353 91 456 7890',
        address: 'Galway Business Park, Galway',
        leadTimeDays: 21,
        reliability: 87,
        totalItems: 18,
        totalValue: 156000,
        paymentTerms: 'Net 45',
        status: 'active'
      }
    ];

    const mockInventory: InventoryItem[] = [
      {
        id: 'inv_001',
        name: 'Premium Leather Sofa - 3 Seater',
        sku: 'PLS-3S-001',
        category: 'furniture',
        packageId: 'pkg_001',
        packageName: 'Premium Living Room Pack',
        currentStock: 12,
        reservedStock: 5,
        availableStock: 7,
        minStockLevel: 5,
        maxStockLevel: 25,
        reorderPoint: 8,
        reorderQuantity: 15,
        unitCost: 1200,
        retailPrice: 1800,
        margin: 33,
        supplier: {
          id: 'sup_001',
          name: 'Premium Furniture Co.',
          contactEmail: 'sarah@premiumfurniture.ie',
          leadTimeDays: 14,
          reliability: 95
        },
        location: 'Warehouse A - Section 2',
        lastOrdered: '2025-01-15',
        lastReceived: '2025-01-28',
        nextDelivery: '2025-02-15',
        status: 'in_stock',
        qualityGrade: 'A',
        notes: ['Premium Italian leather', 'Requires assembly'],
        totalValue: 14400
      },
      {
        id: 'inv_002',
        name: 'Smart Door Lock - Keyless Entry',
        sku: 'SDL-KE-002',
        category: 'electronics',
        packageId: 'pkg_002',
        packageName: 'Smart Home Security Package',
        currentStock: 3,
        reservedStock: 8,
        availableStock: -5,
        minStockLevel: 10,
        maxStockLevel: 50,
        reorderPoint: 15,
        reorderQuantity: 30,
        unitCost: 180,
        retailPrice: 280,
        margin: 36,
        supplier: {
          id: 'sup_002',
          name: 'Smart Tech Solutions',
          contactEmail: 'michael@smarttech.ie',
          leadTimeDays: 10,
          reliability: 98
        },
        location: 'Warehouse B - Electronics Bay',
        lastOrdered: '2025-01-20',
        nextDelivery: '2025-02-08',
        status: 'out_of_stock',
        qualityGrade: 'A',
        notes: ['Urgent reorder needed', 'High demand item'],
        totalValue: 540
      },
      {
        id: 'inv_003',
        name: 'Quartz Countertop - White',
        sku: 'QCT-WH-003',
        category: 'fixtures',
        packageId: 'pkg_003',
        packageName: 'Luxury Kitchen Upgrade',
        currentStock: 8,
        reservedStock: 3,
        availableStock: 5,
        minStockLevel: 3,
        maxStockLevel: 15,
        reorderPoint: 5,
        reorderQuantity: 10,
        unitCost: 850,
        retailPrice: 1400,
        margin: 39,
        supplier: {
          id: 'sup_003',
          name: 'Luxury Appliances Ltd',
          contactEmail: 'emma@luxuryappliances.ie',
          leadTimeDays: 21,
          reliability: 87
        },
        location: 'Warehouse C - Stone Section',
        lastOrdered: '2025-01-10',
        lastReceived: '2025-02-01',
        status: 'in_stock',
        qualityGrade: 'A',
        notes: ['Custom cutting required', 'Template needed'],
        totalValue: 6800
      },
      {
        id: 'inv_004',
        name: 'Wine Cooler - 46 Bottle',
        sku: 'WC-46B-004',
        category: 'appliances',
        packageId: 'pkg_003',
        packageName: 'Luxury Kitchen Upgrade',
        currentStock: 2,
        reservedStock: 1,
        availableStock: 1,
        minStockLevel: 2,
        maxStockLevel: 8,
        reorderPoint: 3,
        reorderQuantity: 5,
        unitCost: 1100,
        retailPrice: 1650,
        margin: 33,
        supplier: {
          id: 'sup_003',
          name: 'Luxury Appliances Ltd',
          contactEmail: 'emma@luxuryappliances.ie',
          leadTimeDays: 21,
          reliability: 87
        },
        location: 'Warehouse C - Appliance Bay',
        lastOrdered: '2025-01-25',
        nextDelivery: '2025-02-20',
        status: 'low_stock',
        qualityGrade: 'A',
        notes: ['Dual zone cooling', 'Energy efficient'],
        totalValue: 2200
      },
      {
        id: 'inv_005',
        name: 'Designer Coffee Table - Glass',
        sku: 'DCT-GL-005',
        category: 'furniture',
        packageId: 'pkg_001',
        packageName: 'Premium Living Room Pack',
        currentStock: 15,
        reservedStock: 2,
        availableStock: 13,
        minStockLevel: 5,
        maxStockLevel: 20,
        reorderPoint: 7,
        reorderQuantity: 10,
        unitCost: 320,
        retailPrice: 520,
        margin: 38,
        supplier: {
          id: 'sup_001',
          name: 'Premium Furniture Co.',
          contactEmail: 'sarah@premiumfurniture.ie',
          leadTimeDays: 14,
          reliability: 95
        },
        location: 'Warehouse A - Section 1',
        lastReceived: '2025-01-30',
        status: 'in_stock',
        qualityGrade: 'A',
        notes: ['Tempered glass top', 'Oak base'],
        totalValue: 4800
      }
    ];

    setSuppliers(mockSuppliers);
    setInventoryItems(mockInventory);
  }, []);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.packageName && item.packageName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSupplier = supplierFilter === 'all' || item.supplier.id === supplierFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  const inventoryStats = {
    totalItems: inventoryItems.length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.totalValue, 0),
    lowStockItems: inventoryItems.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length,
    outOfStockItems: inventoryItems.filter(item => item.status === 'out_of_stock').length,
    averageMargin: inventoryItems.length > 0 ? inventoryItems.reduce((sum, item) => sum + item.margin, 0) / inventoryItems.length : 0,
    pendingOrders: inventoryItems.filter(item => item.status === 'pending_order').length
  };

  const getStatusBadge = (status: string, availableStock: number) => {
    const statusConfig = {
      in_stock: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'In Stock' },
      low_stock: { bg: 'bg-amber-100', text: 'text-amber-800', icon: AlertTriangle, label: 'Low Stock' },
      out_of_stock: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Out of Stock' },
      pending_order: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'Pending Order' },
      discontinued: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Archive, label: 'Discontinued' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock;
    const Icon = config.icon;

    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full flex items-center gap-1`}>
        <Icon size={12} />
        {config.label}
        {availableStock < 0 && <span className="ml-1">({availableStock})</span>}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      furniture: <Building2 size={16} className="text-blue-600" />,
      electronics: <Activity size={16} className="text-green-600" />,
      fixtures: <Target size={16} className="text-purple-600" />,
      appliances: <Package size={16} className="text-orange-600" />,
      accessories: <Star size={16} className="text-pink-600" />
    };
    return icons[category as keyof typeof icons] || icons.furniture;
  };

  const getReliabilityBadge = (reliability: number) => {
    if (reliability >= 95) return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Excellent</span>;
    if (reliability >= 90) return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Good</span>;
    if (reliability >= 85) return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Fair</span>;
    return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Poor</span>;
  };

  const handleReorderItem = (itemId: string) => {
    setInventoryItems(items => items.map(item => {
      if (item.id === itemId) {
        return { ...item, status: 'pending_order' as const };
      }
      return item;
    }));
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600">Track stock levels, suppliers, and inventory operations</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                <span className="text-gray-600">{inventoryStats.totalItems} Total Items</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-gray-600">{formatCurrency(inventoryStats.totalValue)} Total Value</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <span className="text-gray-600">{inventoryStats.lowStockItems} Low/Out of Stock</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/developer/prop-choice" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ArrowUpRight size={16} />
              Back to Dashboard
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-600">In Stock Items</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.totalItems - inventoryStats.lowStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600" />
            <div>
              <p className="text-sm text-gray-600">Low Stock Alerts</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.lowStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Avg Margin</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.averageMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inventory Items
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'suppliers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Purchase Orders
            </button>
          </nav>
        </div>

        {/* Inventory Items Tab */}
        {activeTab === 'inventory' && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items, SKUs, or packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="fixtures">Fixtures</option>
                  <option value="appliances">Appliances</option>
                  <option value="accessories">Accessories</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="pending_order">Pending Order</option>
                </select>

                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Levels</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(item.category)}
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                            {item.packageName && (
                              <div className="text-xs text-blue-600">{item.packageName}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">Available: {item.availableStock}</div>
                          <div className="text-gray-500">Reserved: {item.reservedStock}</div>
                          <div className="text-gray-500">Total: {item.currentStock}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status, item.availableStock)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{item.supplier.name}</div>
                          <div className="text-gray-500">{item.supplier.leadTimeDays} day lead time</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{formatCurrency(item.unitCost)}</div>
                          <div className="text-gray-500">{formatCurrency(item.retailPrice)} ({item.margin}%)</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{formatCurrency(item.totalValue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewItem(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          >
                            <Eye size={16} />
                          </button>
                          {(item.status === 'low_stock' || item.status === 'out_of_stock') && (
                            <button
                              onClick={() => handleReorderItem(item.id)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            >
                              <ShoppingCart size={16} />
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
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                    {getReliabilityBadge(supplier.reliability)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span>{supplier.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{supplier.leadTimeDays} day lead time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span>{supplier.totalItems} items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span>{formatCurrency(supplier.totalValue)} value</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-6">
            <div className="text-center py-12">
              <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Purchase Orders</h3>
              <p className="text-gray-600">Purchase order management coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {showItemDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedItem.name}</h3>
                <p className="text-sm text-gray-600">SKU: {selectedItem.sku}</p>
              </div>
              <button 
                onClick={() => setShowItemDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Item Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize">{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span>{selectedItem.packageName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span>{selectedItem.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality Grade:</span>
                      <span className="font-medium">{selectedItem.qualityGrade}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Stock Levels</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className="font-medium">{selectedItem.currentStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reserved:</span>
                      <span className="text-amber-600">{selectedItem.reservedStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className={selectedItem.availableStock < 0 ? 'text-red-600' : 'text-green-600'}>
                        {selectedItem.availableStock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reorder Point:</span>
                      <span>{selectedItem.reorderPoint}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pricing & Costs</h4>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Unit Cost:</span>
                    <p className="font-medium text-lg">{formatCurrency(selectedItem.unitCost)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Retail Price:</span>
                    <p className="font-medium text-lg">{formatCurrency(selectedItem.retailPrice)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Margin:</span>
                    <p className="font-medium text-lg text-green-600">{selectedItem.margin}%</p>
                  </div>
                </div>
              </div>

              {/* Supplier Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Supplier Information</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{selectedItem.supplier.name}</h5>
                    {getReliabilityBadge(selectedItem.supplier.reliability)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Lead Time:</span>
                      <p>{selectedItem.supplier.leadTimeDays} days</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact:</span>
                      <p>{selectedItem.supplier.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order History</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Last Ordered:</span>
                    <p>{formatDate(selectedItem.lastOrdered)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Received:</span>
                    <p>{formatDate(selectedItem.lastReceived)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Delivery:</span>
                    <p>{formatDate(selectedItem.nextDelivery)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedItem.notes.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="space-y-2">
                    {selectedItem.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 border-t pt-6">
                {(selectedItem.status === 'low_stock' || selectedItem.status === 'out_of_stock') && (
                  <button
                    onClick={() => {
                      handleReorderItem(selectedItem.id);
                      setShowItemDetails(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Reorder Item
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Edit size={16} />
                  Edit Item
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download size={16} />
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || supplierFilter !== 'all'
              ? 'Try adjusting your filters to see more items.'
              : 'Start by adding inventory items to track your PROP Choice stock.'
            }
          </p>
        </div>
      )}
    </div>
  );
}