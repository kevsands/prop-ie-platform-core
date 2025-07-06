/**
 * Smart Property Wishlist
 * Intelligent property saving with AI-powered alerts and recommendations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bell, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  MapPin, 
  Euro, 
  Clock, 
  Target,
  Filter,
  Settings,
  Trash2,
  Share2,
  Download,
  Plus,
  Sparkles,
  Zap,
  Calendar,
  Mail,
  Phone,
  Eye,
  Bookmark
} from 'lucide-react';
import { Property } from '@/types/properties';
import { PropertyMatch, UserProfile } from '@/lib/algorithms/PropertyRecommendationEngine';

interface WishlistItem {
  id: string;
  property: Property;
  matchScore?: number;
  addedAt: Date;
  alertsEnabled: boolean;
  alertCriteria: AlertCriteria;
  notes?: string;
  viewedCount: number;
  lastViewed?: Date;
  tags: string[];
}

interface AlertCriteria {
  priceDrops: boolean;
  priceDropThreshold: number; // percentage
  statusChanges: boolean;
  similarProperties: boolean;
  marketUpdates: boolean;
  openHouses: boolean;
  priceIncreases: boolean;
}

interface SmartAlert {
  id: string;
  type: 'price_drop' | 'status_change' | 'similar_property' | 'market_update' | 'open_house' | 'price_increase';
  propertyId: string;
  title: string;
  message: string;
  data: any;
  createdAt: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface SmartWishlistProps {
  userProfile?: UserProfile;
  className?: string;
}

export default function SmartWishlist({ userProfile, className = '' }: SmartWishlistProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'added' | 'match_score' | 'price' | 'viewed'>('added');
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('propertyWishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      setWishlistItems(parsed.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
        lastViewed: item.lastViewed ? new Date(item.lastViewed) : undefined
      })));
    }

    const savedAlerts = localStorage.getItem('wishlistAlerts');
    if (savedAlerts) {
      const parsed = JSON.parse(savedAlerts);
      setAlerts(parsed.map((alert: any) => ({
        ...alert,
        createdAt: new Date(alert.createdAt)
      })));
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('propertyWishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('wishlistAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Simulate intelligent alerts (in production, this would come from backend)
  useEffect(() => {
    const generateSmartAlerts = () => {
      const newAlerts: SmartAlert[] = [];

      wishlistItems.forEach(item => {
        if (!item.alertsEnabled) return;

        // Price drop simulation
        if (item.alertCriteria.priceDrops && Math.random() < 0.1) {
          const dropPercentage = Math.floor(Math.random() * 10) + 1;
          newAlerts.push({
            id: `alert-${Date.now()}-${Math.random()}`,
            type: 'price_drop',
            propertyId: item.property.id,
            title: `Price Drop Alert: ${item.property.name}`,
            message: `Price reduced by €${dropPercentage * 1000} (${dropPercentage}%)`,
            data: { oldPrice: item.property.price, newPrice: item.property.price - (dropPercentage * 1000), dropPercentage },
            createdAt: new Date(),
            isRead: false,
            priority: dropPercentage >= 5 ? 'high' : 'medium'
          });
        }

        // Similar property simulation
        if (item.alertCriteria.similarProperties && Math.random() < 0.05) {
          newAlerts.push({
            id: `alert-${Date.now()}-${Math.random()}`,
            type: 'similar_property',
            propertyId: item.property.id,
            title: `Similar Property Found`,
            message: `Found a new ${item.property.type} in ${item.property.address?.city} matching your criteria`,
            data: { similarities: ['location', 'price range', 'property type'] },
            createdAt: new Date(),
            isRead: false,
            priority: 'medium'
          });
        }

        // Open house simulation
        if (item.alertCriteria.openHouses && Math.random() < 0.08) {
          const date = new Date();
          date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
          newAlerts.push({
            id: `alert-${Date.now()}-${Math.random()}`,
            type: 'open_house',
            propertyId: item.property.id,
            title: `Open House Scheduled`,
            message: `${item.property.name} open house on ${date.toLocaleDateString()}`,
            data: { date: date.toISOString(), time: '2:00 PM - 4:00 PM' },
            createdAt: new Date(),
            isRead: false,
            priority: 'high'
          });
        }
      });

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    };

    // Check for new alerts every 30 seconds (in production, use WebSocket/SSE)
    const interval = setInterval(generateSmartAlerts, 30000);
    return () => clearInterval(interval);
  }, [wishlistItems]);

  const addToWishlist = (property: Property, matchScore?: number) => {
    const newItem: WishlistItem = {
      id: `wishlist-${Date.now()}`,
      property,
      matchScore,
      addedAt: new Date(),
      alertsEnabled: true,
      alertCriteria: {
        priceDrops: true,
        priceDropThreshold: 5,
        statusChanges: true,
        similarProperties: true,
        marketUpdates: false,
        openHouses: true,
        priceIncreases: false
      },
      notes: '',
      viewedCount: 0,
      tags: []
    };

    setWishlistItems(prev => [newItem, ...prev]);
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    // Remove related alerts
    setAlerts(prev => prev.filter(alert => alert.propertyId !== itemId));
  };

  const updateAlertSettings = (itemId: string, criteria: AlertCriteria) => {
    setWishlistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, alertCriteria: criteria } : item
    ));
  };

  const markViewed = (itemId: string) => {
    setWishlistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            viewedCount: item.viewedCount + 1, 
            lastViewed: new Date() 
          } 
        : item
    ));
  };

  const addTag = (itemId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setWishlistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            tags: [...item.tags, tag.trim()].filter((t, i, arr) => arr.indexOf(t) === i)
          } 
        : item
    ));
  };

  const removeTag = (itemId: string, tag: string) => {
    setWishlistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, tags: item.tags.filter(t => t !== tag) } 
        : item
    ));
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const filteredItems = wishlistItems
    .filter(item => 
      selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'added':
          return b.addedAt.getTime() - a.addedAt.getTime();
        case 'match_score':
          return (b.matchScore || 0) - (a.matchScore || 0);
        case 'price':
          return a.property.price - b.property.price;
        case 'viewed':
          return b.viewedCount - a.viewedCount;
        default:
          return 0;
      }
    });

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const allTags = [...new Set(wishlistItems.flatMap(item => item.tags))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'similar_property':
        return <Target className="text-blue-600" size={16} />;
      case 'open_house':
        return <Calendar className="text-purple-600" size={16} />;
      case 'status_change':
        return <AlertCircle className="text-orange-600" size={16} />;
      default:
        return <Bell className="text-gray-600" size={16} />;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Smart Wishlist</h2>
              <p className="text-gray-600 text-sm">
                {wishlistItems.length} saved properties with intelligent alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Alerts Button */}
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View alerts"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Wishlist settings"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="added">Recently Added</option>
            <option value="match_score">Best Match</option>
            <option value="price">Price: Low to High</option>
            <option value="viewed">Most Viewed</option>
          </select>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts Panel */}
      {showAlerts && (
        <div className="border-b bg-blue-50 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            Smart Alerts ({unreadAlerts.length} unread)
          </h3>
          
          {alerts.length === 0 ? (
            <p className="text-gray-600 text-sm">No alerts yet. We'll notify you about price changes, new similar properties, and more!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts.slice(0, 10).map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    alert.isRead ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-600'
                  }`}
                  onClick={() => markAlertRead(alert.id)}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                    <p className="text-gray-600 text-xs">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {alert.createdAt.toLocaleDateString()} • {alert.priority} priority
                    </p>
                  </div>
                  {!alert.isRead && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Items */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {wishlistItems.length === 0 ? 'Your wishlist is empty' : 'No properties match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {wishlistItems.length === 0 
                ? 'Start saving properties you love to get intelligent alerts and recommendations'
                : 'Try adjusting your tag filters to see more properties'
              }
            </p>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map(item => (
              <WishlistItemCard
                key={item.id}
                item={item}
                onRemove={() => removeFromWishlist(item.id)}
                onUpdateAlerts={(criteria) => updateAlertSettings(item.id, criteria)}
                onMarkViewed={() => markViewed(item.id)}
                onAddTag={(tag) => addTag(item.id, tag)}
                onRemoveTag={(tag) => removeTag(item.id, tag)}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Wishlist Item Component
interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: () => void;
  onUpdateAlerts: (criteria: AlertCriteria) => void;
  onMarkViewed: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  formatCurrency: (amount: number) => string;
}

function WishlistItemCard({
  item,
  onRemove,
  onUpdateAlerts,
  onMarkViewed,
  onAddTag,
  onRemoveTag,
  formatCurrency
}: WishlistItemCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      onAddTag(newTag);
      setNewTag('');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Property Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
          <img
            src={item.property.images?.[0] || '/api/placeholder/150/150'}
            alt={item.property.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{item.property.name}</h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MapPin size={14} />
                {item.property.address?.city}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(item.property.price)}
              </div>
              {item.matchScore && (
                <div className="text-sm text-blue-600 font-medium">
                  {item.matchScore}% match
                </div>
              )}
            </div>
          </div>

          {/* Property Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{item.property.bedrooms} bed</span>
            <span>{item.property.bathrooms} bath</span>
            <span>{item.property.floorArea}sqm</span>
            {item.property.parkingSpaces && <span>{item.property.parkingSpaces} parking</span>}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onMarkViewed}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
              >
                <Eye size={14} />
                View ({item.viewedCount})
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
              >
                <Bell size={14} />
                Alerts {item.alertsEnabled && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <form onSubmit={handleAddTag} className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="px-2 py-1 border border-gray-300 rounded text-xs w-16 focus:w-24 transition-all"
                />
                <button
                  type="submit"
                  className="p-1 text-gray-400 hover:text-blue-600"
                  title="Add tag"
                >
                  <Plus size={12} />
                </button>
              </form>

              <button
                onClick={onRemove}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Remove from wishlist"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Alert Settings */}
          {showSettings && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Alert Settings</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries({
                  priceDrops: 'Price Drops',
                  statusChanges: 'Status Changes',
                  similarProperties: 'Similar Properties',
                  openHouses: 'Open Houses'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.alertCriteria[key as keyof AlertCriteria] as boolean}
                      onChange={(e) => {
                        onUpdateAlerts({
                          ...item.alertCriteria,
                          [key]: e.target.checked
                        });
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}