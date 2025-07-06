'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin,
  Home,
  Euro,
  Heart,
  Search,
  Save,
  Settings,
  TrendingUp,
  Clock,
  Star,
  Filter,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Eye,
  Target,
  Bell,
  User,
  Guest,
  LogIn,
  Sparkles
} from 'lucide-react';

interface SearchPreferencesManagerProps {
  buyerId?: string; // Undefined for guest users
  sessionId: string;
  onPreferencesChange?: (preferences: any) => void;
  className?: string;
}

interface PreferenceState {
  location: {
    counties: string[];
    cities: string[];
    areas: string[];
    radius?: number;
  };
  property: {
    types: string[];
    bedrooms: { min: number; max: number };
    bathrooms: { min: number; max: number };
    parking: boolean;
    garden: boolean;
    balcony: boolean;
    ensuite: boolean;
  };
  budget: {
    min: number;
    max: number;
    includeHTB: boolean;
    htbAmount?: number;
  };
  lifestyle: {
    nearPublicTransport: boolean;
    nearSchools: boolean;
    nearShopping: boolean;
    nearHealthcare: boolean;
    nearRecreation: boolean;
  };
  notifications: {
    newMatches: boolean;
    priceChanges: boolean;
    similarProperties: boolean;
    frequency: string;
    method: string[];
  };
}

interface SearchInsight {
  category: string;
  insight: string;
  confidence: number;
  impact: string;
  recommendation: string;
}

interface Recommendation {
  properties: any[];
  reasoning: string[];
  confidence: number;
}

export default function SearchPreferencesManager({
  buyerId,
  sessionId,
  onPreferencesChange,
  className = ''
}: SearchPreferencesManagerProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'insights' | 'recommendations' | 'analytics'>('preferences');
  const [preferences, setPreferences] = useState<PreferenceState>({
    location: { counties: [], cities: [], areas: [] },
    property: {
      types: ['apartment', 'house'],
      bedrooms: { min: 1, max: 4 },
      bathrooms: { min: 1, max: 3 },
      parking: false,
      garden: false,
      balcony: false,
      ensuite: false
    },
    budget: { min: 250000, max: 500000, includeHTB: true },
    lifestyle: {
      nearPublicTransport: false,
      nearSchools: false,
      nearShopping: false,
      nearHealthcare: false,
      nearRecreation: false
    },
    notifications: {
      newMatches: !buyerId, // Default false for guests
      priceChanges: !buyerId,
      similarProperties: !buyerId,
      frequency: 'daily',
      method: ['email']
    }
  });
  
  const [insights, setInsights] = useState<SearchInsight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConversionPrompt, setShowConversionPrompt] = useState(false);

  const isGuest = !buyerId;

  useEffect(() => {
    loadCurrentPreferences();
  }, [buyerId, sessionId]);

  useEffect(() => {
    if (activeTab === 'insights' && buyerId) {
      loadInsights();
    } else if (activeTab === 'recommendations') {
      loadRecommendations();
    } else if (activeTab === 'analytics' && buyerId) {
      loadAnalytics();
    }
  }, [activeTab, buyerId]);

  const loadCurrentPreferences = async () => {
    setLoading(true);
    try {
      const endpoint = isGuest 
        ? `/api/buyer-preferences?action=guest-session&sessionId=${sessionId}`
        : `/api/buyer-preferences?action=preferences&buyerId=${buyerId}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success) {
        const prefs = isGuest ? data.data.preferences : data.data;
        setPreferences({
          location: prefs.location || preferences.location,
          property: prefs.property || preferences.property,
          budget: prefs.budget || preferences.budget,
          lifestyle: prefs.lifestyle || preferences.lifestyle,
          notifications: prefs.notifications || preferences.notifications
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const endpoint = '/api/buyer-preferences';
      const payload = isGuest 
        ? {
            action: 'track-guest',
            sessionId,
            preferences,
            fingerprint: generateFingerprint()
          }
        : {
            action: 'update-preferences',
            buyerId,
            sessionId,
            preferences
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        onPreferencesChange?.(preferences);
        
        // Show conversion prompt for active guest users
        if (isGuest && shouldShowConversionPrompt()) {
          setShowConversionPrompt(true);
        }
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const loadInsights = async () => {
    if (!buyerId) return;
    
    try {
      const response = await fetch(`/api/buyer-preferences?action=insights&buyerId=${buyerId}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const identifier = buyerId || sessionId;
      const response = await fetch(
        `/api/buyer-preferences?action=recommendations&${buyerId ? 'buyerId' : 'sessionId'}=${identifier}&guest=${isGuest}&limit=6`
      );
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadAnalytics = async () => {
    if (!buyerId) return;
    
    try {
      const response = await fetch(`/api/buyer-preferences?action=analytics&buyerId=${buyerId}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const generateFingerprint = (): string => {
    // Simple browser fingerprint for session tracking
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + 
      screen.height + 
      new Date().getTimezoneOffset() +
      (canvas.toDataURL().slice(-50))
    ).slice(0, 32);
  };

  const shouldShowConversionPrompt = (): boolean => {
    // Show conversion prompt if guest has significant activity
    return preferences.property.types.length > 1 || 
           preferences.location.counties.length > 0 ||
           preferences.budget.min !== 250000 ||
           preferences.budget.max !== 500000;
  };

  const handleLocationChange = (type: 'counties' | 'cities' | 'areas', value: string) => {
    setPreferences(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [type]: prev.location[type].includes(value)
          ? prev.location[type].filter(item => item !== value)
          : [...prev.location[type], value]
      }
    }));
  };

  const handlePropertyTypeChange = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      property: {
        ...prev.property,
        types: prev.property.types.includes(type)
          ? prev.property.types.filter(t => t !== type)
          : [...prev.property.types, type]
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'budget': return Euro;
      case 'location': return MapPin;
      case 'property': return Home;
      case 'behavior': return TrendingUp;
      default: return Star;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isGuest ? (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isGuest ? 'Guest Search Preferences' : 'My Search Preferences'}
              </h2>
              <p className="text-sm text-gray-600">
                {isGuest ? 'Personalize your property search experience' : 'Manage your saved preferences and get insights'}
              </p>
            </div>
          </div>
          
          {isGuest && (
            <div className="text-center">
              <button 
                onClick={() => setShowConversionPrompt(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Create Account
              </button>
              <p className="text-xs text-gray-500 mt-1">Save your preferences permanently</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'recommendations', label: 'For You', icon: Heart },
            ...(buyerId ? [
              { id: 'insights', label: 'Insights', icon: Brain },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ] : [])
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'preferences' && (
          <div className="space-y-8">
            {/* Location Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Location Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Counties</label>
                  <div className="space-y-2">
                    {['Dublin', 'Cork', 'Galway', 'Meath', 'Kildare', 'Wicklow'].map(county => (
                      <label key={county} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.location.counties.includes(county)}
                          onChange={() => handleLocationChange('counties', county)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{county}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                Property Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Types</label>
                  <div className="space-y-2">
                    {['apartment', 'house', 'townhouse', 'duplex', 'penthouse'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.property.types.includes(type)}
                          onChange={() => handlePropertyTypeChange(type)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">Min</label>
                      <select
                        value={preferences.property.bedrooms.min}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          property: {
                            ...prev.property,
                            bedrooms: { ...prev.property.bedrooms, min: parseInt(e.target.value) }
                          }
                        }))}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Max</label>
                      <select
                        value={preferences.property.bedrooms.max}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          property: {
                            ...prev.property,
                            bedrooms: { ...prev.property.bedrooms, max: parseInt(e.target.value) }
                          }
                        }))}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {[
                      { key: 'parking', label: 'Parking Required' },
                      { key: 'garden', label: 'Garden/Outdoor Space' },
                      { key: 'balcony', label: 'Balcony/Terrace' },
                      { key: 'ensuite', label: 'En-suite Bathroom' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.property[key as keyof typeof preferences.property] as boolean}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              [key]: e.target.checked
                            }
                          }))}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Euro className="w-5 h-5 text-purple-600" />
                Budget Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500">Minimum Budget</label>
                      <input
                        type="number"
                        value={preferences.budget.min}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          budget: { ...prev.budget, min: parseInt(e.target.value) }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        min="100000"
                        max="2000000"
                        step="10000"
                      />
                      <div className="text-xs text-gray-500 mt-1">{formatCurrency(preferences.budget.min)}</div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500">Maximum Budget</label>
                      <input
                        type="number"
                        value={preferences.budget.max}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          budget: { ...prev.budget, max: parseInt(e.target.value) }
                        }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        min="100000"
                        max="2000000"
                        step="10000"
                      />
                      <div className="text-xs text-gray-500 mt-1">{formatCurrency(preferences.budget.max)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Help to Buy</label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.budget.includeHTB}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        budget: { ...prev.budget, includeHTB: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Help to Buy scheme</span>
                  </label>
                  
                  {preferences.budget.includeHTB && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        💡 <strong>You may qualify for up to €30,000</strong> in Help to Buy support, 
                        reducing your deposit requirement significantly.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Preferences - Only for registered users */}
            {!isGuest && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Notification Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Types</label>
                    <div className="space-y-2">
                      {[
                        { key: 'newMatches', label: 'New property matches' },
                        { key: 'priceChanges', label: 'Price change alerts' },
                        { key: 'similarProperties', label: 'Similar property suggestions' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.notifications[key as keyof typeof preferences.notifications] as boolean}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                [key]: e.target.checked
                              }
                            }))}
                            className="rounded border-gray-300 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      value={preferences.notifications.frequency}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, frequency: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly summary</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={savePreferences}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : isGuest ? 'Save Session Preferences' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
              <button
                onClick={loadRecommendations}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            {recommendations && (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {Math.round(recommendations.confidence)}% Match Confidence
                    </span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <strong>Why these properties:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {recommendations.reasoning.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.properties.map((property, index) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{property.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Target className="w-3 h-3" />
                          <span>{property.matchScore}%</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                      <div className="text-lg font-bold text-green-600 mb-3">
                        {formatCurrency(property.price)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                        <span className="capitalize">{property.type}</span>
                      </div>
                      
                      <div className="flex gap-2 text-xs">
                        {property.features.parking && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Parking</span>
                        )}
                        {property.features.garden && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Garden</span>
                        )}
                        {property.features.balcony && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Balcony</span>
                        )}
                      </div>
                      
                      <button className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && buyerId && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Personalized Insights</h3>
            
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.category);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getImpactColor(insight.impact)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold capitalize">{insight.category} Insight</h4>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3" />
                            <span>{insight.confidence}% confidence</span>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-2">{insight.insight}</p>
                        <p className="text-sm font-medium">💡 {insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {insights.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Keep using your preferences to generate insights!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && buyerId && analytics && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Search Analytics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.totalSearches}</div>
                <div className="text-sm text-blue-600">Total Searches</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.propertiesViewed}</div>
                <div className="text-sm text-green-600">Properties Viewed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analytics.favoritesSaved}</div>
                <div className="text-sm text-purple-600">Favorites Saved</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(analytics.averageViewingTime)}s
                </div>
                <div className="text-sm text-orange-600">Avg. Viewing Time</div>
              </div>
            </div>
            
            {analytics.topLocations.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Top Search Locations</h4>
                <div className="flex gap-2">
                  {analytics.topLocations.map((location: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conversion Prompt Modal for Guests */}
      {showConversionPrompt && isGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Save Your Preferences Forever</h3>
              <p className="text-gray-600 mb-6">
                Create an account to save your search preferences, get personalized recommendations, 
                and receive alerts about new properties that match your criteria.
              </p>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Free Account
                </button>
                <button 
                  onClick={() => setShowConversionPrompt(false)}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}