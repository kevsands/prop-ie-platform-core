'use client';

import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Shield, AlertTriangle, ExternalLink } from 'lucide-react';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ThreatVisualizationProps {
  threats: any[];
}

/**
 * Performance-optimized threat visualization component
 * 
 * Displays a comprehensive view of security threats with both
 * visualizations and detailed lists.
 */
const ThreatVisualization: React.FC<ThreatVisualizationProps> = ({ threats }) => {
  // Process threat data with memoization for better performance
  const { threatsByType, threatsBySeverity, threatsBySource, highestConfidenceThreats } = useMemo(() => {
    // Group threats by type
    const byType: Record<string, number> = {};
    // Group threats by severity
    const bySeverity: Record<string, number> = {};
    // Group threats by source
    const bySource: Record<string, number> = {};
    // Find highest confidence threats
    const highConfidence = threats
      .filter(t => t.confidence >= 80)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
    
    // Process each threat
    threats.forEach(threat => {
      // Count by type
      byType[threat.type] = (byType[threat.type] || 0) + 1;
      
      // Count by severity
      bySeverity[threat.severity] = (bySeverity[threat.severity] || 0) + 1;
      
      // Count by source
      bySource[threat.source] = (bySource[threat.source] || 0) + 1;
    });
    
    return {
      threatsByType: byType,
      threatsBySeverity: bySeverity,
      threatsBySource: bySource,
      highestConfidenceThreats: highConfidence
    };
  }, [threats]);
  
  // Prepare data for the severity distribution chart
  const severityChartData = useMemo(() => {
    const labels = Object.keys(threatsBySeverity);
    const data = Object.values(threatsBySeverity);
    
    // Colors for different severity levels
    const backgroundColors = {
      low: 'rgba(46, 204, 113, 0.7)',
      medium: 'rgba(241, 196, 15, 0.7)',
      high: 'rgba(230, 126, 34, 0.7)',
      critical: 'rgba(231, 76, 60, 0.7)',
      info: 'rgba(52, 152, 219, 0.7)'
    };
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map(label => 
            backgroundColors[label as keyof typeof backgroundColors] || 'rgba(149, 165, 166, 0.7)'
          ),
          borderWidth: 1
        }
      ]
    };
  }, [threatsBySeverity]);
  
  // Chart options for better performance
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 250 // Fast animations for better performance
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          textTransform: 'capitalize'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value as number / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };
  
  // Render a severity badge with appropriate color
  const SeverityBadge = ({ severity }: { severity: string }) => {
    const classes = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
      info: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={classes[severity as keyof typeof classes] || 'bg-gray-100'}>
        {severity}
      </Badge>
    );
  };
  
  // No threats message
  if (!threats.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-md p-6">
        <Shield className="h-12 w-12 text-green-500 mb-2" />
        <p className="text-lg font-semibold">No active threats detected</p>
        <p className="text-gray-500 text-center mt-1">
          Your system is currently not detecting any active security threats
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Left column - Charts */}
      <div className="md:col-span-1">
        <div className="h-64 relative">
          <h3 className="font-medium mb-2">Threat Severity Distribution</h3>
          <Doughnut data={severityChartData} options={chartOptions} />
          {/* Center text with total count */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold">{threats.length}</p>
              <p className="text-xs text-gray-500">Total threats</p>
            </div>
          </div>
        </div>
        
        {/* Threat types breakdown */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Threat Types</h3>
          <div className="space-y-2">
            {Object.entries(threatsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right column - Threat details */}
      <div className="md:col-span-2 overflow-auto" style={{ maxHeight: '100%' }}>
        <h3 className="font-medium mb-2">Highest Confidence Threats</h3>
        
        <div className="space-y-3">
          {highestConfidenceThreats.map(threat => (
            <Card key={threat.id} className={`
              border-l-4 
              ${threat.severity === 'critical' ? 'border-l-red-500' : 
                threat.severity === 'high' ? 'border-l-orange-500' : 
                threat.severity === 'medium' ? 'border-l-yellow-500' : 
                'border-l-green-500'}
            `}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <AlertTriangle className={`h-4 w-4 mr-1
                        ${threat.severity === 'critical' ? 'text-red-500' : 
                          threat.severity === 'high' ? 'text-orange-500' : 
                          threat.severity === 'medium' ? 'text-yellow-500' : 
                          'text-green-500'}
                      `} />
                      <span className="font-semibold capitalize">{threat.type.replace('_', ' ')}</span>
                      <SeverityBadge severity={threat.severity} />
                    </div>
                    
                    <p className="text-sm font-mono mb-1 flex items-center">
                      {threat.value}
                      {threat.type === 'url' && (
                        <ExternalLink className="h-3 w-3 ml-1 inline text-gray-400" />
                      )}
                    </p>
                    
                    <div className="flex items-center mt-2">
                      <div className="text-xs text-gray-500 mr-3">
                        Source: {threat.source}
                      </div>
                      <div className="text-xs text-gray-500 mr-3">
                        First seen: {new Date(threat.firstSeen).toLocaleString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last seen: {new Date(threat.lastSeen).toLocaleString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-2 flex flex-col items-end">
                    <div className="text-xl font-bold">
                      {threat.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">
                      confidence
                    </div>
                  </div>
                </div>
                
                {/* Related events */}
                {threat.relatedEvents && threat.relatedEvents.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {threat.relatedEvents.length} related events
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Show message if no high confidence threats */}
          {highestConfidenceThreats.length === 0 && (
            <div className="p-4 bg-gray-50 rounded text-center">
              <p className="text-gray-500">No high confidence threats detected</p>
            </div>
          )}
        </div>
        
        {/* Threat sources */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Threat Sources</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(threatsBySource).map(([source, count]) => (
              <div key={source} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm truncate">{source}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ThreatVisualization);