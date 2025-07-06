'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SecurityMetricsChartProps {
  metrics: any[];
}

/**
 * Performance-optimized security metrics visualization component
 * 
 * Renders a line chart showing security metrics trends with optimized
 * rendering and memory usage.
 */
const SecurityMetricsChart: React.FC<SecurityMetricsChartProps> = ({ metrics }) => {
  // Process and prepare chart data with memoization
  const chartData = useMemo(() => {
    // Filter metrics to include only those with historical values
    const metricCategories = new Set<string>();
    const metricsByName: Record<string, any[]> = {};
    
    // Group metrics by name and collect categories
    metrics.forEach(metric => {
      if (!metricsByName[metric.name]) {
        metricsByName[metric.name] = [];
      }
      
      metricsByName[metric.name].push(metric);
      metricCategories.add(metric.category);
    });
    
    // Sort metrics by timestamp for each name
    Object.keys(metricsByName).forEach(name => {
      metricsByName[name].sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
    });
    
    // Prepare labels (timestamps)
    let labels: string[] = [];
    const scoreMetrics = metricsByName['Security Score'] || [];
    
    if (scoreMetrics.length > 0) {
      labels = scoreMetrics.map(m => {
        const date = new Date(m.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
    } else if (Object.keys(metricsByName).length > 0) {
      // Fallback to any available metric's timestamps
      const firstMetricName = Object.keys(metricsByName)[0];
      labels = metricsByName[firstMetricName].map(m => {
        const date = new Date(m.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
    }
    
    // Prepare datasets
    const datasets = [];
    
    // Color palette for different metrics
    const colors = [
      { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' },
      { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.2)' },
      { border: 'rgba(255, 206, 86, 1)', background: 'rgba(255, 206, 86, 0.2)' },
      { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' },
      { border: 'rgba(153, 102, 255, 1)', background: 'rgba(153, 102, 255, 0.2)' }
    ];
    
    // Important metrics to always show
    const priorityMetrics = ['Security Score', 'Failed Login Attempts', 'API Rate Limit'];
    
    // Add priority metrics first
    priorityMetrics.forEach((metricName, index) => {
      if (metricsByName[metricName] && metricsByName[metricName].length > 0) {
        // Get values
        const values = metricsByName[metricName].map(m => m.value);
        
        datasets.push({
          label: metricName,
          data: values,
          borderColor: colors[index % colors.length].border,
          backgroundColor: colors[index % colors.length].background,
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2
        });
      }
    });
    
    // Add other metrics (up to a reasonable limit to avoid clutter)
    let additionalMetricsCount = 0;
    Object.keys(metricsByName).forEach((metricName, index) => {
      // Skip if it's a priority metric or if we already have enough metrics
      if (priorityMetrics.includes(metricName) || additionalMetricsCount >= 2) {
        return;
      }
      
      const metricsForName = metricsByName[metricName];
      if (metricsForName && metricsForName.length > 0) {
        // Get values
        const values = metricsForName.map(m => m.value);
        
        datasets.push({
          label: metricName,
          data: values,
          borderColor: colors[(priorityMetrics.length + additionalMetricsCount) % colors.length].border,
          backgroundColor: colors[(priorityMetrics.length + additionalMetricsCount) % colors.length].background,
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2
        });
        
        additionalMetricsCount++;
      }
    });
    
    return {
      labels,
      datasets
    };
  }, [metrics]);
  
  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 250 // Faster animations for better performance
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Use callback to avoid excessive decimal places
          callback: function(value) {
            if (Math.floor(Number(value)) === Number(value)) {
              return value;
            }
            return null;
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 0, // Don't rotate x-axis labels
          autoSkip: true,
          maxTicksLimit: 10 // Limit number of ticks for readability
        }
      }
    }
  };
  
  // If no data is available, show a placeholder message
  if (!chartData.datasets.length) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
        <p className="text-gray-500">No historical metrics available</p>
      </div>
    );
  }
  
  // Render the chart with memoized data
  return <Line data={chartData} options={options} />;
};

export default React.memo(SecurityMetricsChart);