'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualizedListProps<T> {
  /**
   * Array of items to render
   */
  items: T[];
  /**
   * Function to render each item
   * 
   * Note: When using this component in a client entry file ('use client'),
   * rename this prop to 'renderItemAction' if passing a server action
   */
  renderItemAction?: (item: T, index: number) => React.ReactNode;
  /**
   * Alternative name for renderItem to fix Server Component serialization issues
   */
  renderItem?: never;
  /**
   * Height of each item in pixels
   */
  itemHeight: number;
  /**
   * Optional className for the container
   */
  className?: string;
  /**
   * Optional height for the container (defaults to 500px)
   */
  height?: number;
  /**
   * Optional width for the container (defaults to 100%)
   */
  width?: number | string;
  /**
   * Number of extra items to render above and below the visible area
   * for smooth scrolling (defaults to 3)
   */
  overscan?: number;
}

/**
 * VirtualizedList - A component for efficiently rendering large lists
 * 
 * This component only renders items that are currently visible in the viewport,
 * plus a configurable number of items above and below (overscan) for smooth scrolling.
 * 
 * @example
 * <VirtualizedList
 *   items={properties}
 *   itemHeight={300}
 *   renderItemAction={(property, index) => (
 *     <PropertyCard key={property.id} property={property} />
 *   )}
 *   height={600}
 * />
 */
function VirtualizedList<T>({
  items,
  renderItemAction,
  itemHeight,
  className = '',
  height = 500,
  width = '100%',
  overscan = 3,
}: VirtualizedListProps<T> & { renderItemAction: (item: T, index: number) => React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Update scroll position when user scrolls
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };
  
  // Calculate which items should be visible
  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    // Calculate the visible range
    const visibleStartIndex = Math.floor(scrollTop / itemHeight);
    const visibleEndIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + height) / itemHeight)
    );
    
    // Add overscan for smoother scrolling
    const start = Math.max(0, visibleStartIndex - overscan);
    const end = Math.min(items.length - 1, visibleEndIndex + overscan);
    
    return {
      startIndex: start,
      endIndex: end,
      totalHeight: items.length * itemHeight,
    };
  }, [scrollTop, height, itemHeight, items.length, overscan]);
  
  // Calculate styles for the inner container
  const innerStyle: React.CSSProperties = {
    height: totalHeight,
    position: 'relative',
  };
  
  // Generate visible items
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => {
      const actualIndex = startIndex + index;
      const top = actualIndex * itemHeight;
      
      return (
        <div
          key={actualIndex}
          style={{
            position: 'absolute',
            top,
            left: 0,
            width: '100%',
            height: itemHeight,
          }}
        >
          {renderItemAction(item, actualIndex)}
        </div>
      );
    });
  }, [items, startIndex, endIndex, itemHeight, renderItemAction]);
  
  // Effect for cleanup
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height, width }}
    >
      <div style={innerStyle}>
        {visibleItems}
      </div>
    </div>
  );
}

/**
 * VirtualizedGrid - A component for efficiently rendering large grids
 * 
 * Similar to VirtualizedList but for grid layouts with multiple columns.
 * 
 * @example
 * <VirtualizedGrid
 *   items={properties}
 *   itemHeight={300}
 *   columns={3}
 *   renderItemAction={(property, index) => (
 *     <PropertyCard key={property.id} property={property} />
 *   )}
 *   height={600}
 * />
 */
interface VirtualizedGridProps<T> extends Omit<VirtualizedListProps<T>, 'width'> {
  /**
   * Number of columns in the grid
   */
  columns: number;
  /**
   * Optional gap between items in pixels
   */
  gap?: number;
  /**
   * Function to render each item
   * 
   * Note: When using this component in a client entry file ('use client'),
   * rename this prop to 'renderItemAction' if passing a server action
   */
  renderItemAction?: (item: T, index: number) => React.ReactNode;
}

function VirtualizedGrid<T>({
  items,
  renderItemAction,
  itemHeight,
  columns = 3,
  gap = 16,
  className = '',
  height = 500,
  overscan = 1,
}: VirtualizedGridProps<T> & { renderItemAction: (item: T, index: number) => React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Calculate row height (including gap)
  const rowHeight = itemHeight + gap;
  
  // Update scroll position when user scrolls
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };
  
  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Calculate total rows and visible range
  const { startRow, endRow, totalHeight } = useMemo(() => {
    const totalRows = Math.ceil(items.length / columns);
    
    // Calculate visible rows
    const visibleStartRow = Math.floor(scrollTop / rowHeight);
    const visibleEndRow = Math.min(
      totalRows - 1,
      Math.floor((scrollTop + height) / rowHeight)
    );
    
    // Add overscan for smoother scrolling
    const start = Math.max(0, visibleStartRow - overscan);
    const end = Math.min(totalRows - 1, visibleEndRow + overscan);
    
    return {
      startRow: start,
      endRow: end,
      totalHeight: totalRows * rowHeight,
    };
  }, [scrollTop, height, rowHeight, items.length, columns, overscan]);
  
  // Calculate item width
  const itemWidth = useMemo(() => {
    if (!containerWidth) return 0;
    return (containerWidth - (gap * (columns - 1))) / columns;
  }, [containerWidth, columns, gap]);
  
  // Generate visible grid items
  const visibleItems = useMemo(() => {
    if (!containerWidth) return null;
    
    const result = [];
    
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      for (let colIndex = 0; colIndex < columns; colIndex++) {
        const itemIndex = rowIndex * columns + colIndex;
        
        if (itemIndex >= items.length) continue;
        
        const item = items[itemIndex];
        const top = rowIndex * rowHeight;
        const left = colIndex * (itemWidth + gap);
        
        result.push(
          <div
            key={itemIndex}
            style={{
              position: 'absolute',
              top,
              left,
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItemAction(item, itemIndex)}
          </div>
        );
      }
    }
    
    return result;
  }, [
    items, 
    startRow, 
    endRow, 
    columns, 
    itemWidth, 
    itemHeight, 
    rowHeight, 
    gap, 
    renderItemAction, 
    containerWidth,
  ]);
  
  // Effect for cleanup
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  const innerStyle: React.CSSProperties = {
    height: totalHeight,
    position: 'relative',
  };
  
  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
    >
      <div style={innerStyle}>
        {visibleItems}
      </div>
    </div>
  );
}

// Export the components
export { VirtualizedList, VirtualizedGrid };