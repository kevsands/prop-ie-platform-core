'use client';

/**
 * Feature Flag Management UI
 * 
 * This component provides an admin interface for managing feature flags.
 */

import React, { useState, useEffect } from 'react';
import { getAllFeatureFlags, FeatureFlagConfig } from '@/lib/features/featureFlags';

interface FeatureFlagItem {
  name: string;
  config: FeatureFlagConfig;
  enabled: boolean;
}

// Type guards for discriminating different feature flag types
function isBooleanFlag(config: FeatureFlagConfig): config is { type: 'boolean'; enabled: boolean; description?: string } {
  return config.type === 'boolean';
}

function isPercentageFlag(config: FeatureFlagConfig): config is { type: 'percentage'; percentage: number; seed?: string; description?: string } {
  return config.type === 'percentage';
}

function isEnvironmentFlag(config: FeatureFlagConfig): config is { type: 'environment'; environments: Record<string, boolean>; description?: string } {
  return config.type === 'environment';
}

function isUserSegmentFlag(config: FeatureFlagConfig): config is { type: 'userSegment'; segments: any[]; defaultEnabled: boolean; description?: string } {
  return config.type === 'userSegment';
}

/**
 * Feature Flag Manager Component
 */
export function FeatureFlagManager() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFlag, setEditingFlag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  useEffect(() => {
    async function loadFeatureFlags() {
      setIsLoading(true);
      setError(null);
      try {
        const allFlags = await getAllFeatureFlags();
        const flagArray = Object.entries(allFlags).map(([name, { config, enabled }]) => ({
          name,
          config,
          enabled
        }));
        
        setFeatureFlags(flagArray);
      } catch (err) {
        console.error('Error loading feature flags:', err);
        setError('Failed to load feature flags');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFeatureFlags();
  }, []);

  const handleToggleFlag = async (name: string) => {
    try {
      // Make API call to toggle feature flag
      const response = await fetch(`/api/admin/feature-flags/${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enabled: !featureFlags.find(flag => flag.name === name)?.enabled
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update feature flag');
      }
      
      // Update local state
      setFeatureFlags(prev => 
        prev.map(flag => 
          flag.name === name 
            ? { ...flag, enabled: !flag.enabled } 
            : flag
        )
      );
    } catch (err) {
      console.error('Error toggling feature flag:', err);
      setError('Failed to update feature flag');
    }
  };

  const handleSaveFlag = async (flag: FeatureFlagItem) => {
    try {
      // Make API call to update feature flag
      const response = await fetch(`/api/admin/feature-flags/${flag.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: flag.config,
          enabled: flag.enabled
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update feature flag');
      }
      
      // Update local state
      setFeatureFlags(prev => 
        prev.map(f => 
          f.name === flag.name ? flag : f
        )
      );
      
      // Close edit mode
      setEditingFlag(null);
    } catch (err) {
      console.error('Error saving feature flag:', err);
      setError('Failed to save feature flag configuration');
    }
  };

  // Filter flags based on search term and enabled/disabled filter
  const filteredFlags = featureFlags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flag.config.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'enabled' && flag.enabled) || 
      (filter === 'disabled' && !flag.enabled);
      
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feature Flag Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search feature flags..."
            className="w-full px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex">
          <select
            className="px-4 py-2 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Flags</option>
            <option value="enabled">Enabled Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFlags.map((flag) => (
                <tr key={flag.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{flag.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {flag.config.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{flag.config.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${flag.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleFlag(flag.name)}
                      className={`mr-3 py-1 px-3 rounded text-white ${flag.enabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {flag.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => setEditingFlag(flag.name)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredFlags.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No feature flags found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Edit Modal */}
      {editingFlag && (
        <FeatureFlagEditor
          flag={featureFlags.find(f => f.name === editingFlag)!}
          onSave={handleSaveFlag}
          onCancel={() => setEditingFlag(null)}
        />
      )}
    </div>
  );
}

interface FeatureFlagEditorProps {
  flag: FeatureFlagItem;
  onSave: (flag: FeatureFlagItem) => void;
  onCancel: () => void;
}

function FeatureFlagEditor({ flag, onSave, onCancel }: FeatureFlagEditorProps) {
  const [editedFlag, setEditedFlag] = useState<FeatureFlagItem>({ ...flag });
  
  // Handle different form fields based on flag type
  const renderConfigEditor = () => {
    const config = editedFlag.config;
    
    if (isBooleanFlag(config)) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enabled
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={e => setEditedFlag({
              ...editedFlag,
              config: {
                ...config,
                enabled: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      );
    }
    
    if (isPercentageFlag(config)) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentage (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={config.percentage}
            onChange={e => setEditedFlag({
              ...editedFlag,
              config: {
                ...config,
                percentage: parseInt(e.target.value, 10)
              }
            })}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      );
    }
    
    if (isEnvironmentFlag(config)) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environments
          </label>
          {Object.entries(config.environments).map(([env, value]) => (
            <div key={env} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!value}
                onChange={e => {
                  const newEnvironments = {
                    ...config.environments,
                    [env]: e.target.checked
                  };
                  setEditedFlag({
                    ...editedFlag,
                    config: {
                      ...config,
                      environments: newEnvironments
                    }
                  });
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span>{env}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (isUserSegmentFlag(config)) {
      // This would be more complex, for now just showing a basic version
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Enabled
          </label>
          <input
            type="checkbox"
            checked={config.defaultEnabled}
            onChange={e => setEditedFlag({
              ...editedFlag,
              config: {
                ...config,
                defaultEnabled: e.target.checked
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <p className="mt-3 text-sm text-gray-500">
            User segment configuration is not editable through this interface.
          </p>
        </div>
      );
    }
    
    return (
      <p className="text-gray-500 italic">
        This flag type cannot be edited through this interface.
      </p>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Feature Flag: {editedFlag.name}</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={editedFlag.config.description || ''}
            onChange={e => setEditedFlag({
              ...editedFlag,
              config: {
                ...editedFlag.config,
                description: e.target.value
              }
            })}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        {renderConfigEditor()}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedFlag)}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureFlagManager;