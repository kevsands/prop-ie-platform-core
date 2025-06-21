'use client';

import React, { useState, useEffect } from 'react';
import PropertyBusinessIntelligence from '@/components/analytics/PropertyBusinessIntelligence';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AnalyticsData {
  totalPropertyValue: number;
  availableInventory: number;
  reservedUnits: number;
  soldUnits: number;
  totalRevenue: number;
  avgPropertyPrice: number;
  customizationUptake: number;
  revenueGrowth: number;
  websiteVisitors: number;
  registrations: number;
  propertyViews: number;
  reservations: number;
  conversionRate: number;
  avgTimeToReservation: number;
  popularCustomizations: Array<{ name: string; uptake: number; value: number }>;
  buyerDemographics: {
    firstTimeBuyers: number;
    investors: number;
    upgraders: number;
  };
  developmentPerformance: Array<{
    name: string;
    totalUnits: number;
    soldCount: number;
    avgPrice: number;
    revenue: number;
    velocity: number;
  }>;
  activeUsers: number;
  currentViewers: number;
  todayInquiries: number;
  thisWeekReservations: number;
}

export default function PropertyIntelligencePage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  const fetchAnalytics = async (range: string = timeRange) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/property-intelligence?timeRange=${range}`, {
        headers: {
          'Authorization': 'Bearer dev-mode-dummy-token',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load analytics data');
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      
      // Fallback to mock data if API fails
      setAnalyticsData({
        totalPropertyValue: 26870000,
        availableInventory: 15,
        reservedUnits: 3,
        soldUnits: 74,
        totalRevenue: 16870000,
        avgPropertyPrice: 334375,
        customizationUptake: 0.68,
        revenueGrowth: 0.235,
        websiteVisitors: 2450,
        registrations: 147,
        propertyViews: 1832,
        reservations: 12,
        conversionRate: 0.08,
        avgTimeToReservation: 8.5,
        popularCustomizations: [
          { name: 'Premium Kitchen Package', uptake: 0.45, value: 8500 },
          { name: 'Smart Kitchen Package', uptake: 0.23, value: 12000 },
          { name: 'Complete White Goods', uptake: 0.67, value: 4200 }
        ],
        buyerDemographics: {
          firstTimeBuyers: 0.72,
          investors: 0.15,
          upgraders: 0.13
        },
        developmentPerformance: [
          {
            name: 'Ellwood',
            totalUnits: 46,
            soldCount: 46,
            avgPrice: 275000,
            revenue: 12650000,
            velocity: 7.8
          },
          {
            name: 'Ballymakenny View',
            totalUnits: 20,
            soldCount: 19,
            avgPrice: 315000,
            revenue: 5985000,
            velocity: 4.2
          },
          {
            name: 'Fitzgerald Gardens',
            totalUnits: 27,
            soldCount: 12,
            avgPrice: 387000,
            revenue: 4644000,
            velocity: 2.1
          }
        ],
        activeUsers: 23,
        currentViewers: 8,
        todayInquiries: 5,
        thisWeekReservations: 2
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    fetchAnalytics(newRange);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-gray-600">Fetching business intelligence data...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Unavailable</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-700">
                Using fallback data due to API error: {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {analyticsData && (
        <PropertyBusinessIntelligence 
          data={analyticsData}
          onTimeRangeChange={handleTimeRangeChange}
          onRefresh={() => fetchAnalytics()}
        />
      )}
    </div>
  );
}