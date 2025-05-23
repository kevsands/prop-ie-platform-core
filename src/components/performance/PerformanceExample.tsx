'use client';

import React, { useState } from 'react';
import { optimizeComponent } from '../../utils/performance/optimizeComponent';
import { usePerformanceMonitoring } from '../../utils/performance';
import { withMemo } from '../../utils/performance/withMemo';
import { VirtualizedList } from './VirtualizedList';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';
import PerformanceMonitor from './PerformanceMonitor';
import { OptimizedButton, OptimizedCard } from './OptimizedComponent';

/**
 * Example component demonstrating various performance optimizations
 */
export const PerformanceExample: React.FC = () => {
  const [countsetCount] = useState(0);
  const [showPerformanceMonitorsetShowPerformanceMonitor] = useState(false);
  const [itemssetItems] = useState(() => Array.from({ length: 1000 }, (_i: any) => ({
    id: i,
    name: `Item ${i}`,
    description: `This is item number ${i} in the list.`})));

  // Use performance monitor hook to track metrics
  const { metrics, refreshMetrics } = usePerformanceMonitor({
    enabled: true,
    trackWebVitals: true,
    trackMemory: true,
    trackEventLoop: true});

  // Use the performance hook for this component
  const { measureRender } = usePerformanceMonitoring('PerformanceExample', { trackReRenders: true });
  measureRender();

  // Create an expensive calculation that will be memoized
  const expensiveCalculation = React.useMemo(() => {

    let result = 0;
    for (let i = 0; i <1000000; i++) {
      result += Math.random();
    }
    return result / 1000000;
  }, []);

  // Handler for adding an item
  const handleAddItem = () => {
    setItems(prev => [
      {
        id: prev.length,
        name: `Item ${prev.length}`,
        description: `This is a new item that was just added.`},
      ...prev]);
  };

  // Render function for virtualized list items
  const renderItem = React.useCallback((item: any, index: number, style: React.CSSProperties) => (
    <div
      style={style}
      className="p-3 border-b hover:bg-gray-50 flex flex-col justify-center"
    >
      <div className="font-medium">{item.name}</div>
      <div className="text-sm text-gray-500">{item.description}</div>
    </div>
  ), []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Performance Optimization Examples</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {Object.entries(metrics).map(([keymetric]) => (
            <div key={key} className="bg-white shadow rounded-lg p-3">
              <div className="text-xs text-gray-500">{metric.name}</div>
              <div className="text-lg font-bold">
                {metric.value.toFixed(2)}{metric.unit}
              </div>
            </div>
          ))}

          {Object.keys(metrics).length === 0 && (
            <div className="col-span-2 md:col-span-4 text-gray-500">
              No metrics collected yet. Click "Refresh Metrics" to collect them.
            </div>
          )}
        </div>

        <div className="flex space-x-4 mb-6">
          <OptimizedButton onClick={refreshMetrics}>
            Refresh Metrics
          </OptimizedButton>

          <OptimizedButton
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
            className={showPerformanceMonitor ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {showPerformanceMonitor ? 'Hide' : 'Show'} Performance Monitor
          </OptimizedButton>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Memoized Component Example</h2>
        <OptimizedCard className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Counter: {count}</h3>
              <p className="text-sm text-gray-500">
                This component re-renders when the count changes
              </p>
            </div>
            <OptimizedButton onClick={() => setCount(c => c + 1)}>
              Increment
            </OptimizedButton>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium">Memoized Value</h4>
            <p>Result of expensive calculation: {expensiveCalculation.toFixed(6)}</p>
            <p className="text-xs text-gray-500 mt-1">
              This value is calculated once and memoized, even when component re-renders
            </p>
          </div>
        </OptimizedCard>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Virtualized List Example</h2>
        <p className="text-sm text-gray-500 mb-4">
          This list efficiently renders 1000+ items by only rendering what's visible
        </p>

        <div className="mb-4">
          <OptimizedButton onClick={handleAddItem}>
            Add Item
          </OptimizedButton>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <VirtualizedList
            items={items}
            itemHeight={64}
            height={400}
            width="100%"
            renderItemAction={renderItem}
            overscan={5}
          />
        </div>
      </div>

      {/* Performance Monitor */}
      {showPerformanceMonitor && (
        <PerformanceMonitor
          enabled
          autoCollect
          position="bottom-right"
          defaultMinimized={false}
        />
      )}
    </div>
  );
};

/**
 * Optimized version of the PerformanceExample component
 * Uses memoization and performance tracking
 */
export default optimizeComponent(PerformanceExample, {
  memoize: true,
  trackPerformance: true,
  displayName: 'PerformanceExample'});