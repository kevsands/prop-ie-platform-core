'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  User, 
  DollarSign, 
  Home, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Briefcase,
  AlertCircle,
  CheckCircle,
  Edit3,
  Settings,
  Upload,
  Download,
  Camera,
  FileText,
  Trash2,
  Plus
} from 'lucide-react';
import { Unit, UnitStatus } from '@/types/project';
import UnitSettingsPanel from './UnitSettingsPanel';

interface UnitEditModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (unitId: string, updates: Partial<Unit>) => Promise<boolean>;
  onStatusUpdate: (unitId: string, status: UnitStatus, reason?: string) => Promise<boolean>;
  onPriceUpdate: (unitId: string, price: number, reason?: string) => Promise<boolean>;
  onBuyerAssign: (unitId: string, buyerData: any) => Promise<boolean>;
  projectId: string;
  initialTab?: 'details' | 'buyer' | 'features' | 'media' | 'history' | 'settings';
}

interface BuyerData {
  name: string;
  email: string;
  phone: string;
  solicitor: string;
  notes: string;
}

interface FeatureItem {
  id: string;
  name: string;
  included: boolean;
}

export default function UnitEditModal({
  unit,
  isOpen,
  onClose,
  onSave,
  onStatusUpdate,
  onPriceUpdate,
  onBuyerAssign,
  projectId,
  initialTab = 'details'
}: UnitEditModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'buyer' | 'features' | 'media' | 'history' | 'settings'>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Unit details state
  const [unitDetails, setUnitDetails] = useState({
    number: '',
    type: '',
    status: 'available' as UnitStatus,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    floor: 0,
    building: '',
    features: [] as string[],
    amenities: [] as string[],
    description: ''
  });

  // Buyer information state
  const [buyerData, setBuyerData] = useState<BuyerData>({
    name: '',
    email: '',
    phone: '',
    solicitor: '',
    notes: ''
  });

  // Features state
  const [unitFeatures, setUnitFeatures] = useState<FeatureItem[]>([]);
  const [customFeature, setCustomFeature] = useState('');

  // Price update state
  const [priceReason, setPriceReason] = useState('');
  const [statusReason, setStatusReason] = useState('');

  // Initialize modal data when unit changes
  useEffect(() => {
    if (unit) {
      setActiveTab(initialTab); // Reset to initial tab when unit changes
      setUnitDetails({
        number: unit.number || '',
        type: unit.type || '',
        status: unit.status || 'available',
        price: unit.pricing?.currentPrice || 0,
        bedrooms: unit.features?.bedrooms || 0,
        bathrooms: unit.features?.bathrooms || 0,
        sqft: unit.features?.sqft || 0,
        floor: unit.features?.floor || 0,
        building: unit.features?.building || '',
        features: unit.features?.features || [],
        amenities: unit.features?.amenities || [],
        description: unit.description || ''
      });

      setBuyerData({
        name: unit.buyer?.name || '',
        email: unit.buyer?.email || '',
        phone: unit.buyer?.phone || '',
        solicitor: unit.buyer?.solicitor || '',
        notes: unit.buyer?.notes || ''
      });

      // Initialize features checklist
      const allFeatures = [
        'Air Conditioning',
        'Hardwood Floors',
        'Granite Countertops',
        'Stainless Steel Appliances',
        'Walk-in Closet',
        'Balcony/Terrace',
        'Storage Unit',
        'Parking Space',
        'Garden Access',
        'High Ceilings',
        'Fireplace',
        'Built-in Wardrobes'
      ];

      setUnitFeatures(allFeatures.map(feature => ({
        id: feature.toLowerCase().replace(/\s+/g, '-'),
        name: feature,
        included: unit.features?.features?.includes(feature) || false
      })));
    }
  }, [unit, initialTab]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleSave = async () => {
    if (!unit) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updates = {
        number: unitDetails.number,
        type: unitDetails.type,
        pricing: {
          ...unit.pricing,
          currentPrice: unitDetails.price
        },
        features: {
          bedrooms: unitDetails.bedrooms,
          bathrooms: unitDetails.bathrooms,
          sqft: unitDetails.sqft,
          floor: unitDetails.floor,
          building: unitDetails.building,
          features: unitFeatures.filter(f => f.included).map(f => f.name),
          amenities: unitDetails.amenities
        },
        description: unitDetails.description
      };

      const success = await onSave(unit.id, updates);
      
      if (success) {
        setSuccessMessage('Unit updated successfully!');
      } else {
        setErrorMessage('Failed to update unit. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the unit.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!unit) return;

    setIsLoading(true);
    try {
      const success = await onStatusUpdate(unit.id, unitDetails.status, statusReason);
      if (success) {
        setSuccessMessage(`Unit status updated to ${unitDetails.status}!`);
        setStatusReason('');
      } else {
        setErrorMessage('Failed to update unit status.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceUpdate = async () => {
    if (!unit) return;

    setIsLoading(true);
    try {
      const success = await onPriceUpdate(unit.id, unitDetails.price, priceReason);
      if (success) {
        setSuccessMessage(`Unit price updated to €${unitDetails.price.toLocaleString()}!`);
        setPriceReason('');
      } else {
        setErrorMessage('Failed to update unit price.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the price.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyerAssignment = async () => {
    if (!unit || !buyerData.name || !buyerData.email) {
      setErrorMessage('Please provide at least buyer name and email.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onBuyerAssign(unit.id, buyerData);
      if (success) {
        setSuccessMessage(`Buyer ${buyerData.name} assigned to unit!`);
        setUnitDetails(prev => ({ ...prev, status: 'reserved' }));
      } else {
        setErrorMessage('Failed to assign buyer.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while assigning the buyer.');
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomFeature = () => {
    if (customFeature.trim()) {
      const newFeature: FeatureItem = {
        id: customFeature.toLowerCase().replace(/\s+/g, '-'),
        name: customFeature.trim(),
        included: true
      };
      setUnitFeatures(prev => [...prev, newFeature]);
      setCustomFeature('');
    }
  };

  const toggleFeature = (featureId: string) => {
    setUnitFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, included: !feature.included }
          : feature
      )
    );
  };

  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div>
            <h2 className="text-xl font-bold">Edit Unit {unit.number}</h2>
            <p className="text-blue-100">{unit.type} • {unit.features?.bedrooms} bed, {unit.features?.bathrooms} bath</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-6 px-6">
            {[
              { id: 'details', label: 'Unit Details', icon: Home },
              { id: 'buyer', label: 'Buyer Information', icon: User },
              { id: 'features', label: 'Features & Amenities', icon: Settings },
              { id: 'media', label: 'Media & Documents', icon: Camera },
              { id: 'settings', label: 'Unit Settings', icon: Settings },
              { id: 'history', label: 'Update History', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                    <input
                      type="text"
                      value={unitDetails.number}
                      onChange={(e) => setUnitDetails(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                    <select
                      value={unitDetails.type}
                      onChange={(e) => setUnitDetails(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex gap-2">
                      <select
                        value={unitDetails.status}
                        onChange={(e) => setUnitDetails(prev => ({ ...prev, status: e.target.value as UnitStatus }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Reason for status change..."
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={unitDetails.price}
                        onChange={(e) => setUnitDetails(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handlePriceUpdate}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Reason for price change..."
                      value={priceReason}
                      onChange={(e) => setPriceReason(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Physical Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={unitDetails.bedrooms}
                        onChange={(e) => setUnitDetails(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={unitDetails.bathrooms}
                        onChange={(e) => setUnitDetails(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                      <input
                        type="number"
                        value={unitDetails.sqft}
                        onChange={(e) => setUnitDetails(prev => ({ ...prev, sqft: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                      <input
                        type="number"
                        value={unitDetails.floor}
                        onChange={(e) => setUnitDetails(prev => ({ ...prev, floor: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                    <input
                      type="text"
                      value={unitDetails.building}
                      onChange={(e) => setUnitDetails(prev => ({ ...prev, building: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Building name or number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={unitDetails.description}
                      onChange={(e) => setUnitDetails(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Unit description..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buyer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Buyer Information</h3>
                {unit.buyer && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Buyer Assigned
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={buyerData.name}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={buyerData.email}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={buyerData.phone}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+353 1 234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Solicitor</label>
                  <input
                    type="text"
                    value={buyerData.solicitor}
                    onChange={(e) => setBuyerData(prev => ({ ...prev, solicitor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="O'Sullivan & Partners"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={buyerData.notes}
                  onChange={(e) => setBuyerData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional notes about the buyer..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleBuyerAssignment}
                  disabled={isLoading || !buyerData.name || !buyerData.email}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <User size={16} />
                  {unit.buyer ? 'Update Buyer' : 'Assign Buyer'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Features & Amenities</h3>
                <span className="text-sm text-gray-600">
                  {unitFeatures.filter(f => f.included).length} features selected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unitFeatures.map((feature) => (
                  <label
                    key={feature.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={feature.included}
                      onChange={() => toggleFeature(feature.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{feature.name}</span>
                  </label>
                ))}
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Add Custom Feature</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter custom feature name..."
                    onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
                  />
                  <button
                    onClick={addCustomFeature}
                    disabled={!customFeature.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Media & Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Floor Plans</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload floor plans</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                      <Upload size={16} />
                      Choose Files
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Unit Photos</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload unit photos</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                      <Upload size={16} />
                      Choose Files
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Documents</h4>
                <div className="space-y-2">
                  {['Specification Sheet', 'Floor Plan PDF', 'Energy Certificate'].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-600" />
                        <span className="font-medium text-gray-900">{doc}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Download size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <UnitSettingsPanel
              unit={unit}
              isOpen={true}
              onClose={() => {}}
              onSave={async (unitId, settings) => {
                // In a real implementation, this would save settings to the database
                console.log('Saving unit settings:', unitId, settings);
                setSuccessMessage('Unit settings saved successfully!');
                return true;
              }}
              projectId={projectId}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Update History</h3>
              
              <div className="space-y-4">
                {[
                  {
                    date: '2025-06-15 14:30',
                    user: 'John Developer',
                    action: 'Price updated',
                    details: 'Price changed from €485,000 to €495,000',
                    type: 'price'
                  },
                  {
                    date: '2025-06-14 09:15',
                    user: 'Jane Sales',
                    action: 'Status updated',
                    details: 'Status changed from Available to Reserved',
                    type: 'status'
                  },
                  {
                    date: '2025-06-13 16:45',
                    user: 'Mike Manager',
                    action: 'Buyer assigned',
                    details: 'Sarah O\'Connor assigned as buyer',
                    type: 'buyer'
                  }
                ].map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.type === 'price' ? 'bg-green-500' :
                          entry.type === 'status' ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`} />
                        <span className="font-medium text-gray-900">{entry.action}</span>
                      </div>
                      <span className="text-sm text-gray-600">{entry.date}</span>
                    </div>
                    <p className="text-gray-700 mb-1">{entry.details}</p>
                    <p className="text-sm text-gray-500">by {entry.user}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}