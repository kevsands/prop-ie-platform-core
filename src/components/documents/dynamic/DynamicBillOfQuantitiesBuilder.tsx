'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Save, 
  Upload,
  Download,
  RefreshCw,
  Building2,
  AlertTriangle,
  CheckCircle,
  PieChart,
  BarChart3,
  FileSpreadsheet,
  Edit3,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Info,
  Settings
} from 'lucide-react';

// Bill of Quantities Categories for Irish Construction
const BOQ_CATEGORIES = {
  preliminaries: {
    name: 'Preliminaries',
    description: 'Site setup, management, and general costs',
    icon: <Settings className="w-4 h-4" />,
    defaultItems: [
      { description: 'Site Setup and Establishment', unit: 'sum', rate: 0, quantity: 1 },
      { description: 'Site Management and Supervision', unit: 'month', rate: 8500, quantity: 18 },
      { description: 'Temporary Works and Services', unit: 'sum', rate: 0, quantity: 1 },
      { description: 'Health & Safety Compliance', unit: 'sum', rate: 15000, quantity: 1 }
    ]
  },
  excavation: {
    name: 'Excavation & Earthworks',
    description: 'Site preparation and foundation excavation',
    icon: <Building2 className="w-4 h-4" />,
    defaultItems: [
      { description: 'Site Clearance and Stripping', unit: 'm²', rate: 8.50, quantity: 1000 },
      { description: 'Bulk Excavation', unit: 'm³', rate: 12.50, quantity: 850 },
      { description: 'Foundation Excavation', unit: 'm³', rate: 18.75, quantity: 320 },
      { description: 'Backfilling and Compaction', unit: 'm³', rate: 15.25, quantity: 200 }
    ]
  },
  concrete: {
    name: 'Concrete & Formwork',
    description: 'Structural concrete and formwork',
    icon: <Building2 className="w-4 h-4" />,
    defaultItems: [
      { description: 'Foundation Concrete C30/37', unit: 'm³', rate: 145.00, quantity: 180 },
      { description: 'Reinforced Concrete Columns', unit: 'm³', rate: 180.00, quantity: 85 },
      { description: 'Floor Slabs C25/30', unit: 'm³', rate: 155.00, quantity: 420 },
      { description: 'Formwork to Walls', unit: 'm²', rate: 35.00, quantity: 650 }
    ]
  },
  masonry: {
    name: 'Masonry & Blockwork',
    description: 'Block walls and masonry construction',
    icon: <Building2 className="w-4 h-4" />,
    defaultItems: [
      { description: 'Hollow Block Walls 215mm', unit: 'm²', rate: 45.00, quantity: 580 },
      { description: 'Internal Partition Walls 100mm', unit: 'm²', rate: 28.50, quantity: 420 },
      { description: 'Insulation Cavity Walls', unit: 'm²', rate: 18.75, quantity: 650 },
      { description: 'Lintels and Accessories', unit: 'nr', rate: 85.00, quantity: 45 }
    ]
  },
  roofing: {
    name: 'Roofing & Cladding',
    description: 'Roof structure and external cladding',
    icon: <Building2 className="w-4 h-4" />,
    defaultItems: [
      { description: 'Roof Trusses and Structure', unit: 'm²', rate: 65.00, quantity: 520 },
      { description: 'Roof Covering - Tiles', unit: 'm²', rate: 35.00, quantity: 580 },
      { description: 'External Wall Insulation', unit: 'm²', rate: 55.00, quantity: 750 },
      { description: 'Guttering and Downpipes', unit: 'm', rate: 25.00, quantity: 180 }
    ]
  },
  mechanical: {
    name: 'Mechanical & Electrical',
    description: 'M&E installations and services',
    icon: <Settings className="w-4 h-4" />,
    defaultItems: [
      { description: 'Heating System Installation', unit: 'nr', rate: 4500, quantity: 15 },
      { description: 'Electrical Installation per unit', unit: 'nr', rate: 6500, quantity: 15 },
      { description: 'Plumbing Installation per unit', unit: 'nr', rate: 3800, quantity: 15 },
      { description: 'Ventilation Systems', unit: 'nr', rate: 2200, quantity: 15 }
    ]
  },
  finishes: {
    name: 'Internal Finishes',
    description: 'Internal finishes and fixtures',
    icon: <Edit3 className="w-4 h-4" />,
    defaultItems: [
      { description: 'Internal Wall Plastering', unit: 'm²', rate: 18.50, quantity: 1200 },
      { description: 'Floor Finishes - Tiles/Timber', unit: 'm²', rate: 45.00, quantity: 850 },
      { description: 'Kitchen Installation per unit', unit: 'nr', rate: 12000, quantity: 15 },
      { description: 'Bathroom Fitting per unit', unit: 'nr', rate: 8500, quantity: 15 }
    ]
  },
  external: {
    name: 'External Works',
    description: 'Site development and external works',
    icon: <Building2 className="w-4 h-4" />,
    defaultItems: [
      { description: 'Car Park Construction', unit: 'm²', rate: 85.00, quantity: 600 },
      { description: 'Landscaping and Gardens', unit: 'm²', rate: 25.00, quantity: 400 },
      { description: 'External Lighting', unit: 'nr', rate: 450, quantity: 25 },
      { description: 'Boundary Walls and Fencing', unit: 'm', rate: 125.00, quantity: 180 }
    ]
  }
};

// Common measurement units in Irish construction
const MEASUREMENT_UNITS = [
  'nr', 'm', 'm²', 'm³', 'kg', 'tonnes', 'sum', 'item', 'linear m', 'week', 'month'
];

interface BOQItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  total: number;
}

interface BOQCategory {
  id: string;
  name: string;
  items: BOQItem[];
  subtotal: number;
  locked: boolean;
}

interface DynamicBillOfQuantitiesBuilderProps {
  onSave: (boqData: any) => void;
  onCancel: () => void;
  projectId?: string;
  existingBOQ?: any;
}

export default function DynamicBillOfQuantitiesBuilder({
  onSave,
  onCancel,
  projectId,
  existingBOQ
}: DynamicBillOfQuantitiesBuilderProps) {
  const [boqData, setBOQData] = useState({
    projectName: existingBOQ?.projectName || '',
    boqTitle: existingBOQ?.boqTitle || '',
    projectLocation: existingBOQ?.projectLocation || '',
    contractor: existingBOQ?.contractor || '',
    dateCreated: existingBOQ?.dateCreated || new Date().toISOString().split('T')[0],
    revision: existingBOQ?.revision || 'Rev 1.0',
    currency: existingBOQ?.currency || 'EUR',
    vatRate: existingBOQ?.vatRate || 13.5,
    contingencyRate: existingBOQ?.contingencyRate || 5.0,
    overheadRate: existingBOQ?.overheadRate || 8.0,
    profitRate: existingBOQ?.profitRate || 12.0
  });

  const [categories, setCategories] = useState<BOQCategory[]>(() => {
    if (existingBOQ?.categories) {
      return existingBOQ.categories;
    }

    // Initialize with default categories and items
    return Object.entries(BOQ_CATEGORIES).map(([key, category]) => ({
      id: key,
      name: category.name,
      locked: false,
      items: category.defaultItems.map((item, index) => ({
        id: `${key}-${index}`,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        rate: item.rate,
        total: item.quantity * item.rate
      })),
      subtotal: category.defaultItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
    }));
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    contingency: 0,
    overhead: 0,
    profit: 0,
    netTotal: 0,
    vat: 0,
    grandTotal: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('preliminaries');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');

  // Recalculate totals whenever categories or rates change
  const calculateTotals = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const subtotal = categories.reduce((sum, category) => sum + category.subtotal, 0);
      const contingency = (subtotal * boqData.contingencyRate) / 100;
      const overhead = (subtotal * boqData.overheadRate) / 100;
      const profit = (subtotal * boqData.profitRate) / 100;
      const netTotal = subtotal + contingency + overhead + profit;
      const vat = (netTotal * boqData.vatRate) / 100;
      const grandTotal = netTotal + vat;

      setTotals({
        subtotal,
        contingency,
        overhead,
        profit,
        netTotal,
        vat,
        grandTotal
      });
      
      setIsCalculating(false);
    }, 300);
  }, [categories, boqData]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const updateItem = (categoryId: string, itemId: string, field: string, value: any) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId && !category.locked) {
        const updatedItems = category.items.map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'rate') {
              updatedItem.total = updatedItem.quantity * updatedItem.rate;
            }
            return updatedItem;
          }
          return item;
        });
        
        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...category, items: updatedItems, subtotal };
      }
      return category;
    }));
  };

  const addItem = (categoryId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId && !category.locked) {
        const newItem: BOQItem = {
          id: `${categoryId}-${Date.now()}`,
          description: '',
          unit: 'nr',
          quantity: 0,
          rate: 0,
          total: 0
        };
        const updatedItems = [...category.items, newItem];
        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...category, items: updatedItems, subtotal };
      }
      return category;
    }));
  };

  const removeItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId && !category.locked) {
        const updatedItems = category.items.filter(item => item.id !== itemId);
        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...category, items: updatedItems, subtotal };
      }
      return category;
    }));
  };

  const toggleCategoryLock = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, locked: !category.locked }
        : category
    ));
  };

  const addNewCategory = () => {
    const newCategory: BOQCategory = {
      id: `custom-${Date.now()}`,
      name: 'New Category',
      locked: false,
      items: [],
      subtotal: 0
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategoryName = (categoryId: string, name: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, name }
        : category
    ));
  };

  const handleSave = () => {
    if (!boqData.boqTitle) {
      alert('Please provide a BOQ title.');
      return;
    }

    const billOfQuantities = {
      ...boqData,
      categories,
      totals,
      itemCount: categories.reduce((count, cat) => count + cat.items.length, 0),
      calculatedAt: new Date().toISOString(),
      projectId: projectId || 'general',
      documentType: 'bill_of_quantities',
      metadata: {
        lastModified: new Date().toISOString(),
        version: boqData.revision,
        totalValue: totals.grandTotal,
        currency: boqData.currency
      }
    };

    onSave(billOfQuantities);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: boqData.currency
    }).format(amount);
  };

  const activeTab = categories.find(cat => cat.id === activeCategory);

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dynamic Bill of Quantities</h1>
                <p className="text-gray-600">Interactive BOQ with real-time calculations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {isCalculating ? 'Calculating...' : 'Updated'}
                </span>
              </div>
              <button
                onClick={() => setViewMode(viewMode === 'detailed' ? 'summary' : 'detailed')}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'detailed' ? 'Summary View' : 'Detailed View'}
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save BOQ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BOQ Title *</label>
                <input
                  type="text"
                  value={boqData.boqTitle}
                  onChange={(e) => setBOQData(prev => ({ ...prev, boqTitle: e.target.value }))}
                  placeholder="e.g., Fitzgerald Gardens - Main Contract BOQ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={boqData.projectName}
                  onChange={(e) => setBOQData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={boqData.projectLocation}
                  onChange={(e) => setBOQData(prev => ({ ...prev, projectLocation: e.target.value }))}
                  placeholder="Cork, Ireland"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contractor</label>
                <input
                  type="text"
                  value={boqData.contractor}
                  onChange={(e) => setBOQData(prev => ({ ...prev, contractor: e.target.value }))}
                  placeholder="Main contractor name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={boqData.dateCreated}
                    onChange={(e) => setBOQData(prev => ({ ...prev, dateCreated: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Revision</label>
                  <input
                    type="text"
                    value={boqData.revision}
                    onChange={(e) => setBOQData(prev => ({ ...prev, revision: e.target.value }))}
                    placeholder="Rev 1.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Financial Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Currency</label>
                <select
                  value={boqData.currency}
                  onChange={(e) => setBOQData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">VAT Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={boqData.vatRate}
                    onChange={(e) => setBOQData(prev => ({ ...prev, vatRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Contingency (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={boqData.contingencyRate}
                    onChange={(e) => setBOQData(prev => ({ ...prev, contingencyRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Overhead (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={boqData.overheadRate}
                    onChange={(e) => setBOQData(prev => ({ ...prev, overheadRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Profit (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={boqData.profitRate}
                    onChange={(e) => setBOQData(prev => ({ ...prev, profitRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Project Totals</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Subtotal:</span>
                <span className="font-medium text-green-900">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Contingency:</span>
                <span className="font-medium text-green-900">{formatCurrency(totals.contingency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Overhead:</span>
                <span className="font-medium text-green-900">{formatCurrency(totals.overhead)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Profit:</span>
                <span className="font-medium text-green-900">{formatCurrency(totals.profit)}</span>
              </div>
              <div className="border-t border-green-300 pt-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Net Total:</span>
                  <span className="font-medium text-green-900">{formatCurrency(totals.netTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">VAT:</span>
                  <span className="font-medium text-green-900">{formatCurrency(totals.vat)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-900 text-base mt-2 pt-2 border-t border-green-400">
                  <span>GRAND TOTAL:</span>
                  <span>{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Category Tabs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">BOQ Categories</h3>
                <button
                  onClick={addNewCategory}
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      activeCategory === category.id
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {BOQ_CATEGORIES[category.id]?.icon || <FileSpreadsheet className="w-4 h-4" />}
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {formatCurrency(category.subtotal)}
                    </span>
                    {category.locked && <Lock className="w-3 h-3 text-red-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Content */}
            {activeTab && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={activeTab.name}
                      onChange={(e) => updateCategoryName(activeTab.id, e.target.value)}
                      className="text-xl font-semibold bg-transparent border-none focus:ring-2 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      ({activeTab.items.length} items)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCategoryLock(activeTab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        activeTab.locked 
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {activeTab.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      {activeTab.locked ? 'Locked' : 'Unlocked'}
                    </button>
                    <button
                      onClick={() => addItem(activeTab.id)}
                      disabled={activeTab.locked}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">Description</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Unit</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Quantity</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Rate</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Total</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab.items.map((item, index) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(activeTab.id, item.id, 'description', e.target.value)}
                              disabled={activeTab.locked}
                              placeholder="Item description"
                              className="w-full bg-transparent border-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-4 py-3 border-b text-center">
                            <select
                              value={item.unit}
                              onChange={(e) => updateItem(activeTab.id, item.id, 'unit', e.target.value)}
                              disabled={activeTab.locked}
                              className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500"
                            >
                              {MEASUREMENT_UNITS.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 border-b text-center">
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateItem(activeTab.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              disabled={activeTab.locked}
                              className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-4 py-3 border-b text-center">
                            <input
                              type="number"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateItem(activeTab.id, item.id, 'rate', parseFloat(e.target.value) || 0)}
                              disabled={activeTab.locked}
                              className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-4 py-3 border-b text-center font-medium">
                            {formatCurrency(item.total)}
                          </td>
                          <td className="px-4 py-3 border-b text-center">
                            <button
                              onClick={() => removeItem(activeTab.id, item.id)}
                              disabled={activeTab.locked}
                              className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-50">
                        <td colSpan={4} className="px-4 py-3 text-right font-semibold text-green-900 border-t">
                          Category Subtotal:
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-green-900 border-t">
                          {formatCurrency(activeTab.subtotal)}
                        </td>
                        <td className="px-4 py-3 border-t"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}