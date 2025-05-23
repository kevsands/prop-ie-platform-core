
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({ items, height, itemHeight, renderItem }: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight});

  return (
    <div
      ref={parentRef}
      style={
        height: `${height}px`,
        overflow: 'auto'}
    >
      <div
        style={
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem: any) => (
          <div
            key={virtualItem.key}
            style={
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
