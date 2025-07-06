'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Camera, 
  Upload, 
  Download, 
  Eye, 
  EyeOff,
  Lock, 
  Unlock,
  Zap,
  Home,
  DollarSign,
  Calendar,
  User,
  Building,
  MapPin,
  Thermometer,
  Wifi,
  Car,
  Utensils,
  Shield,
  Bell,
  CreditCard,
  FileText,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Unit, UnitStatus } from '@/types/project';

interface UnitSettingsPanelProps {
  unit: Unit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (unitId: string, settings: UnitSettings) => Promise<boolean>;
  projectId: string;
}

interface UnitSettings {
  // Visibility & Marketing
  showOnWebsite: boolean;
  showPricing: boolean;
  showFloorPlan: boolean;
  allowVirtualTours: boolean;
  enableOnlineBooking: boolean;
  
  // Pricing Configuration
  basePriceOverride?: number;
  dynamicPricing: boolean;
  priceAdjustmentType: 'none' | 'premium' | 'discount';
  priceAdjustmentValue: number;
  priceAdjustmentReason: string;
  
  // Physical Configuration
  upgrades: {
    flooring: string;
    kitchen: string;
    bathroom: string;
    heating: string;
    security: string;
  };
  
  // Smart Home Features
  smartFeatures: {
    smartThermostat: boolean;
    smartLighting: boolean;
    smartSecurity: boolean;
    smartAppliances: boolean;
    voiceControl: boolean;
    homeAutomation: boolean;
  };
  
  // Accessibility Features
  accessibility: {
    wheelchairAccess: boolean;
    accessibleBathroom: boolean;
    visualAlerts: boolean;
    hearingLoopSystem: boolean;
    loweredSwitches: boolean;
  };
  
  // Legal & Documentation
  legalPack: {
    solicitorPackReady: boolean;
    energyCertificate: boolean;
    planningDocuments: boolean;
    warrantyDocuments: boolean;
    complianceCertificates: boolean;
  };
  
  // Marketing Settings
  marketing: {
    featuredUnit: boolean;
    showCallToAction: boolean;
    customDescription?: string;
    tags: string[];
    priority: number;
  };
  
  // Booking & Viewing
  viewing: {
    allowPhysicalViewing: boolean;
    allowVirtualViewing: boolean;
    availableSlots: string[];
    bookingNotice: number; // hours
    maxBookingsPerDay: number;
  };
  
  // Financial Settings
  financial: {
    depositAmount: number;
    depositType: 'fixed' | 'percentage';
    paymentPlan: string;
    incentives: string[];
    htbEligible: boolean;
  };
}

export default function UnitSettingsPanel({
  unit,
  isOpen,
  onClose,
  onSave,
  projectId
}: UnitSettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<'general' | 'pricing' | 'features' | 'marketing' | 'viewing' | 'legal'>('general');
  const [settings, setSettings] = useState<UnitSettings>({
    // Default values
    showOnWebsite: true,
    showPricing: true,
    showFloorPlan: true,
    allowVirtualTours: true,
    enableOnlineBooking: true,
    
    dynamicPricing: false,
    priceAdjustmentType: 'none',
    priceAdjustmentValue: 0,
    priceAdjustmentReason: '',
    
    upgrades: {
      flooring: 'standard',
      kitchen: 'standard',
      bathroom: 'standard',
      heating: 'standard',
      security: 'standard'
    },
    
    smartFeatures: {
      smartThermostat: false,
      smartLighting: false,
      smartSecurity: false,
      smartAppliances: false,
      voiceControl: false,
      homeAutomation: false
    },
    
    accessibility: {
      wheelchairAccess: false,
      accessibleBathroom: false,
      visualAlerts: false,
      hearingLoopSystem: false,
      loweredSwitches: false
    },
    
    legalPack: {
      solicitorPackReady: false,
      energyCertificate: false,
      planningDocuments: false,
      warrantyDocuments: false,
      complianceCertificates: false
    },
    
    marketing: {
      featuredUnit: false,
      showCallToAction: true,
      tags: [],
      priority: 1
    },
    
    viewing: {
      allowPhysicalViewing: true,
      allowVirtualViewing: true,
      availableSlots: [],
      bookingNotice: 24,
      maxBookingsPerDay: 3
    },
    
    financial: {
      depositAmount: 10000,
      depositType: 'fixed',
      paymentPlan: 'standard',
      incentives: [],
      htbEligible: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load existing settings when unit changes
  useEffect(() => {
    if (unit) {
      // In a real app, this would load from the unit's settings
      // For now, we'll use the defaults with some unit-specific adjustments
      setSettings(prev => ({
        ...prev,
        basePriceOverride: unit.pricing?.currentPrice,
        financial: {
          ...prev.financial,
          htbEligible: unit.type !== 'Penthouse' && unit.pricing?.currentPrice < 500000
        }
      }));
    }
  }, [unit]);

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const success = await onSave(unit.id, settings);
      
      if (success) {
        setSuccessMessage('Unit settings saved successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage('Failed to save unit settings. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while saving settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const toggleArrayItem = (path: string, item: string) => {
    const keys = path.split('.');
    setSettings(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const array = current[keys[keys.length - 1]] as string[];
      if (array.includes(item)) {
        current[keys[keys.length - 1]] = array.filter(i => i !== item);
      } else {
        current[keys[keys.length - 1]] = [...array, item];
      }
      
      return updated;
    });
  };

  if (!isOpen || !unit) return null;

  const sections = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'pricing', label: 'Pricing & Financial', icon: DollarSign },
    { id: 'features', label: 'Features & Upgrades', icon: Zap },
    { id: 'marketing', label: 'Marketing & Display', icon: Globe },
    { id: 'viewing', label: 'Viewing & Booking', icon: Calendar },
    { id: 'legal', label: 'Legal & Documentation', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <div>
            <h2 className="text-xl font-bold">Unit {unit.number} - Settings</h2>
            <p className="text-indigo-100">{unit.type} • Configure all unit parameters and preferences</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
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

        <div className="flex h-[600px]">
          {/* Settings Navigation */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Settings Categories</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon size={16} />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">General Unit Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Visibility & Display</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.showOnWebsite}
                            onChange={(e) => updateSettings('showOnWebsite', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Show unit on website</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.showPricing}
                            onChange={(e) => updateSettings('showPricing', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Display pricing publicly</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.showFloorPlan}
                            onChange={(e) => updateSettings('showFloorPlan', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Show floor plan</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.allowVirtualTours}
                            onChange={(e) => updateSettings('allowVirtualTours', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Enable virtual tours</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.enableOnlineBooking}
                            onChange={(e) => updateSettings('enableOnlineBooking', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Allow online booking</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Accessibility Features</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.accessibility.wheelchairAccess}
                            onChange={(e) => updateSettings('accessibility.wheelchairAccess', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Wheelchair accessible</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.accessibility.accessibleBathroom}
                            onChange={(e) => updateSettings('accessibility.accessibleBathroom', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Accessible bathroom</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.accessibility.visualAlerts}
                            onChange={(e) => updateSettings('accessibility.visualAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Visual alert system</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.accessibility.hearingLoopSystem}
                            onChange={(e) => updateSettings('accessibility.hearingLoopSystem', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Hearing loop system</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.accessibility.loweredSwitches}
                            onChange={(e) => updateSettings('accessibility.loweredSwitches', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Lowered light switches</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'pricing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Pricing & Financial Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Price Settings</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price Override</label>
                        <input
                          type="number"
                          value={settings.basePriceOverride || ''}
                          onChange={(e) => updateSettings('basePriceOverride', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Leave empty to use default pricing"
                        />
                      </div>

                      <div>
                        <label className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={settings.dynamicPricing}
                            onChange={(e) => updateSettings('dynamicPricing', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Enable dynamic pricing</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment</label>
                        <select
                          value={settings.priceAdjustmentType}
                          onChange={(e) => updateSettings('priceAdjustmentType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="none">No adjustment</option>
                          <option value="premium">Premium pricing</option>
                          <option value="discount">Discount pricing</option>
                        </select>
                      </div>

                      {settings.priceAdjustmentType !== 'none' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Value (%)</label>
                          <input
                            type="number"
                            value={settings.priceAdjustmentValue}
                            onChange={(e) => updateSettings('priceAdjustmentValue', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                            max="50"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Payment & Financing</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={settings.financial.depositAmount}
                            onChange={(e) => updateSettings('financial.depositAmount', Number(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <select
                            value={settings.financial.depositType}
                            onChange={(e) => updateSettings('financial.depositType', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="fixed">€ Fixed</option>
                            <option value="percentage">% of price</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Plan</label>
                        <select
                          value={settings.financial.paymentPlan}
                          onChange={(e) => updateSettings('financial.paymentPlan', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="standard">Standard (10% deposit, 90% on completion)</option>
                          <option value="staged">Staged payments (Construction milestones)</option>
                          <option value="flexible">Flexible payment terms</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.financial.htbEligible}
                            onChange={(e) => updateSettings('financial.htbEligible', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Help to Buy eligible</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Incentives</label>
                        <div className="space-y-2">
                          {['Stamp duty paid', 'Legal fees included', 'Furniture package', 'First year management fee'].map((incentive) => (
                            <label key={incentive} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.financial.incentives.includes(incentive)}
                                onChange={() => toggleArrayItem('financial.incentives', incentive)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-3 text-sm text-gray-700">{incentive}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'features' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Features & Upgrades</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Standard Upgrades</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Flooring</label>
                          <select
                            value={settings.upgrades.flooring}
                            onChange={(e) => updateSettings('upgrades.flooring', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="standard">Standard carpet/vinyl</option>
                            <option value="laminate">Laminate flooring</option>
                            <option value="hardwood">Hardwood floors</option>
                            <option value="luxury">Luxury vinyl plank</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kitchen</label>
                          <select
                            value={settings.upgrades.kitchen}
                            onChange={(e) => updateSettings('upgrades.kitchen', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="standard">Standard kitchen</option>
                            <option value="upgraded">Upgraded appliances</option>
                            <option value="premium">Premium kitchen package</option>
                            <option value="luxury">Luxury kitchen with island</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom</label>
                          <select
                            value={settings.upgrades.bathroom}
                            onChange={(e) => updateSettings('upgrades.bathroom', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="standard">Standard bathroom</option>
                            <option value="upgraded">Upgraded fixtures</option>
                            <option value="premium">Premium bathroom suite</option>
                            <option value="spa">Spa-style bathroom</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Smart Home Features</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.smartFeatures.smartThermostat}
                            onChange={(e) => updateSettings('smartFeatures.smartThermostat', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Smart thermostat</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.smartFeatures.smartLighting}
                            onChange={(e) => updateSettings('smartFeatures.smartLighting', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Smart lighting system</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.smartFeatures.smartSecurity}
                            onChange={(e) => updateSettings('smartFeatures.smartSecurity', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Smart security system</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.smartFeatures.smartAppliances}
                            onChange={(e) => updateSettings('smartFeatures.smartAppliances', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Smart appliances</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.smartFeatures.voiceControl}
                            onChange={(e) => updateSettings('smartFeatures.voiceControl', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Voice control system</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.smartFeatures.homeAutomation}
                            onChange={(e) => updateSettings('smartFeatures.homeAutomation', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Home automation hub</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'marketing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Marketing & Display Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Display Options</h4>
                      
                      <div>
                        <label className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={settings.marketing.featuredUnit}
                            onChange={(e) => updateSettings('marketing.featuredUnit', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Featured unit (priority display)</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={settings.marketing.showCallToAction}
                            onChange={(e) => updateSettings('marketing.showCallToAction', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Show call-to-action buttons</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Priority (1-10)</label>
                        <input
                          type="number"
                          value={settings.marketing.priority}
                          onChange={(e) => updateSettings('marketing.priority', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="1"
                          max="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">Higher numbers appear first in listings</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Description</label>
                        <textarea
                          value={settings.marketing.customDescription || ''}
                          onChange={(e) => updateSettings('marketing.customDescription', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows={3}
                          placeholder="Special description for this unit..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Marketing Tags</h4>
                      
                      <div className="space-y-2">
                        {['New Release', 'Best Value', 'Corner Unit', 'Sea View', 'Garden Access', 'Penthouse', 'Move-in Ready', 'Last Few'].map((tag) => (
                          <label key={tag} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.marketing.tags.includes(tag)}
                              onChange={() => toggleArrayItem('marketing.tags', tag)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'viewing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Viewing & Booking Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Viewing Options</h4>
                      
                      <div>
                        <label className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={settings.viewing.allowPhysicalViewing}
                            onChange={(e) => updateSettings('viewing.allowPhysicalViewing', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Allow physical viewings</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={settings.viewing.allowVirtualViewing}
                            onChange={(e) => updateSettings('viewing.allowVirtualViewing', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Allow virtual viewings</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Notice (hours)</label>
                        <input
                          type="number"
                          value={settings.viewing.bookingNotice}
                          onChange={(e) => updateSettings('viewing.bookingNotice', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="2"
                          max="168"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max bookings per day</label>
                        <input
                          type="number"
                          value={settings.viewing.maxBookingsPerDay}
                          onChange={(e) => updateSettings('viewing.maxBookingsPerDay', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Available Time Slots</h4>
                      
                      <div className="space-y-2">
                        {['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'].map((slot) => (
                          <label key={slot} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.viewing.availableSlots.includes(slot)}
                              onChange={() => toggleArrayItem('viewing.availableSlots', slot)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{slot}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'legal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Legal & Documentation Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Legal Pack Completion</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.legalPack.solicitorPackReady}
                            onChange={(e) => updateSettings('legalPack.solicitorPackReady', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Solicitor pack ready</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.legalPack.energyCertificate}
                            onChange={(e) => updateSettings('legalPack.energyCertificate', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Energy certificate (BER)</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.legalPack.planningDocuments}
                            onChange={(e) => updateSettings('legalPack.planningDocuments', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Planning documents</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.legalPack.warrantyDocuments}
                            onChange={(e) => updateSettings('legalPack.warrantyDocuments', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Warranty documents</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.legalPack.complianceCertificates}
                            onChange={(e) => updateSettings('legalPack.complianceCertificates', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Compliance certificates</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Legal Pack Status</h4>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          {Object.entries(settings.legalPack).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {value ? 'Complete' : 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Overall Completion</span>
                            <span className="text-lg font-bold text-indigo-600">
                              {Math.round((Object.values(settings.legalPack).filter(Boolean).length / Object.values(settings.legalPack).length) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}