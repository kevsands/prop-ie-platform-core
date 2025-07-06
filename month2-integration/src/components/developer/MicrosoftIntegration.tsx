'use client';

import React, { useState, useEffect } from 'react';
import { FiDatabase, FiRefreshCw, FiCheck, FiAlertTriangle, FiSettings } from 'react-icons/fi';
import type { IconBaseProps } from 'react-icons';

interface MicrosoftIntegrationProps {
  projectId: string;
  projectName: string;
}

const MicrosoftIntegration: React.FC<MicrosoftIntegrationProps> = ({
  projectId,
  projectName
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    sharepointSite: 'https://yourcompany.sharepoint.com/sites/PropertyDevelopment',
    propertyListName: 'Properties',
    developmentListName: 'Developments',
    syncInterval: '60', // minutes
    autoSync: true
  });
  
  // Mock data for connected data sources
  const [dataSources, setDataSources] = useState([
    {
      id: '1',
      name: 'Property Listings',
      type: 'SharePoint List',
      status: 'connected',
      itemCount: 96,
      lastSync: '2025-04-22T18:30:00Z'
    },
    {
      id: '2',
      name: 'Development Details',
      type: 'SharePoint List',
      status: 'connected',
      itemCount: 3,
      lastSync: '2025-04-22T18:30:00Z'
    },
    {
      id: '3',
      name: 'Floor Plans & Images',
      type: 'SharePoint Document Library',
      status: 'connected',
      itemCount: 24,
      lastSync: '2025-04-22T18:30:00Z'
    },
    {
      id: '4',
      name: 'Property Reservations',
      type: 'SharePoint List',
      status: 'connected',
      itemCount: 12,
      lastSync: '2025-04-22T18:30:00Z'
    }
  ]);
  
  // Mock data for sync logs
  const [syncLogs, setSyncLogs] = useState([
    {
      id: '1',
      timestamp: '2025-04-22T18:30:00Z',
      status: 'success',
      itemsProcessed: 135,
      duration: '45 seconds',
      message: 'All items synchronized successfully'
    },
    {
      id: '2',
      timestamp: '2025-04-22T17:30:00Z',
      status: 'success',
      itemsProcessed: 135,
      duration: '42 seconds',
      message: 'All items synchronized successfully'
    },
    {
      id: '3',
      timestamp: '2025-04-22T16:30:00Z',
      status: 'warning',
      itemsProcessed: 134,
      duration: '50 seconds',
      message: 'One item failed to sync: Floor plan for Unit B4'
    },
    {
      id: '4',
      timestamp: '2025-04-22T15:30:00Z',
      status: 'success',
      itemsProcessed: 133,
      duration: '41 seconds',
      message: 'All items synchronized successfully'
    }
  ]);
  
  // Simulate connection status
  useEffect(() => {
    // In a real implementation, we would check the actual connection status
    // and get the last sync time from an API or local storage
    setIsConnected(true);
    setLastSyncTime('2025-04-22T18:30:00Z');
    
    // This effect doesn't have any dependencies since it's just setting
    // initial mock data. In a real implementation, we might want to
    // refresh this data periodically or when certain props change.
  }, []);
  
  // Handle manual sync
  const handleSync = () => {
    setSyncStatus('syncing');
    
    // Simulate sync process
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% chance of success
      
      if (success) {
        setSyncStatus('success');
        const now = new Date().toISOString();
        setLastSyncTime(now);
        
        // Add new sync log
        const newLog = {
          id: (syncLogs.length + 1).toString(),
          timestamp: now,
          status: 'success',
          itemsProcessed: 135,
          duration: `${Math.floor(Math.random() * 10) + 40} seconds`,
          message: 'All items synchronized successfully'
        };
        
        setSyncLogs([newLog, ...syncLogs]);
        
        // Update data sources last sync time
        setDataSources(dataSources.map(ds => ({
          ...ds,
          lastSync: now
        })));
      } else {
        setSyncStatus('error');
        
        // Add error log
        const newLog = {
          id: (syncLogs.length + 1).toString(),
          timestamp: new Date().toISOString(),
          status: 'error',
          itemsProcessed: Math.floor(Math.random() * 50) + 80,
          duration: `${Math.floor(Math.random() * 10) + 40} seconds`,
          message: 'Sync failed: Could not connect to SharePoint'
        };
        
        setSyncLogs([newLog, ...syncLogs]);
      }
      
      // Reset status after a delay
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }, 2000);
  };

  // Stub: Export to Excel (not implemented in this context)
  const handleExportToExcel = () => {
    console.warn('Export to Excel is not implemented yet.');
  }; // Proper closure with just a semicolon
  
  // Handle settings change
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2B5273]">Microsoft Integration</h2>
        <p className="text-gray-500">Project: {projectName} (ID: {projectId})</p>
      </div>
      
      {/* Connection Status */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isConnected ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {FiDatabase({ className: "text-gray-400" })}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isConnected ? 'Connected to Microsoft' : 'Not Connected'}
              </h3>
              <p className="text-sm text-gray-500">
                {isConnected 
                  ? `Last synchronized: ${lastSyncTime ? formatDate(lastSyncTime) : 'Never'}`
                  : 'Connect to Microsoft to sync your property data'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSync}
              disabled={!isConnected || syncStatus === 'syncing'}
              className={`${
                !isConnected || syncStatus === 'syncing'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#2B5273] hover:bg-[#1E3142]'
              } text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center`}
            >
              {syncStatus === 'syncing' ? (
                <>
                  {FiRefreshCw({ className: "mr-2 animate-spin" })}
                  Syncing...
                </>
              ) : (
                <>
                  {FiRefreshCw({ className: "mr-2" })}
                  Sync Now
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300 flex items-center"
            >
              {FiSettings({ className: "text-gray-400" })}
              Settings
            </button>
          </div>
        </div>
        
        {/* Sync Status Indicator */}
        {syncStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
            {FiCheck({ className: "text-green-500" })}
            <span className="text-green-700">Sync completed successfully</span>
          </div>
        )}
        
        {syncStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            {FiAlertTriangle({ className: "text-yellow-500" })}
            <span className="text-red-700">Sync failed. Please check your connection and try again.</span>
          </div>
        )}
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Integration Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sharepointSite" className="block text-sm font-medium text-gray-700 mb-1">
                SharePoint Site URL
              </label>
              <input
                type="text"
                id="sharepointSite"
                name="sharepointSite"
                value={settings.sharepointSite}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
            </div>
            
            <div>
              <label htmlFor="propertyListName" className="block text-sm font-medium text-gray-700 mb-1">
                Property List Name
              </label>
              <input
                type="text"
                id="propertyListName"
                name="propertyListName"
                value={settings.propertyListName}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
            </div>
            
            <div>
              <label htmlFor="developmentListName" className="block text-sm font-medium text-gray-700 mb-1">
                Development List Name
              </label>
              <input
                type="text"
                id="developmentListName"
                name="developmentListName"
                value={settings.developmentListName}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
            </div>
            
            <div>
              <label htmlFor="syncInterval" className="block text-sm font-medium text-gray-700 mb-1">
                Sync Interval (minutes)
              </label>
              <select
                id="syncInterval"
                name="syncInterval"
                value={settings.syncInterval}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              >
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
                <option value="360">Every 6 hours</option>
                <option value="720">Every 12 hours</option>
                <option value="1440">Once a day</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoSync"
                  name="autoSync"
                  checked={settings.autoSync}
                  onChange={handleSettingsChange}
                  className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                />
                <label htmlFor="autoSync" className="ml-2 block text-sm text-gray-700">
                  Enable automatic synchronization
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowSettings(false)}
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
      
      {/* Connected Data Sources */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Connected Data Sources</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataSources.map((source) => (
                <tr key={source.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{source.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{source.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        source.status === 'connected'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.itemCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(source.lastSync)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> {/* end of table wrapper for Connected Data Sources */}

      {/* Sync Logs */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[#2B5273] mb-4">Synchronization History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Processed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {syncLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {log.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.itemsProcessed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MicrosoftIntegration;
