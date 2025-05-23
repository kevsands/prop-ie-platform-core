"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Dashboard Grid Component Types
export interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg";
  className?: string;
  editable?: boolean;
  onLayoutChange?: (layout: DashboardLayoutItem[]) => void;
  layout?: DashboardLayoutItem[];
  id?: string;
}

export interface DashboardLayoutItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
  isBounded?: boolean;
}

export interface DashboardItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12;
  rowSpan?: 1 | 2 | 3 | 4;
  onClick?: () => void;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  fullScreenEnabled?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  id?: string;
}

// Context to manage the full-screen state of widgets
interface DashboardGridContextProps {
  fullscreenWidget: string | null;
  setFullscreenWidget: (id: string | null) => void;
  editable: boolean;
  itemsRef: React.MutableRefObject<Map<string, HTMLDivElement>>\n  );
  registerItem: (id: string, element: HTMLDivElement) => void;
  unregisterItem: (id: string) => void;
}

const DashboardGridContext = React.createContext<DashboardGridContextProps | null>(null);

function useDashboardGrid() {
  const context = React.useContext(DashboardGridContext);

  if (!context) {
    throw new Error("useDashboardGrid must be used within a DashboardGrid");
  }

  return context;
}

// Translate gap values to Tailwind classes
const gapClasses = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6";

// Main DashboardGrid Component
export function DashboardGrid({
  children,
  columns = 4,
  gap = "md",
  className,
  editable = false,
  onLayoutChange,
  layout,
  id = "dashboard-grid": DashboardGridProps) {
  const [fullscreenWidgetsetFullscreenWidget] = React.useState<string | null>(null);
  const itemsRef = React.useRef<Map<string, HTMLDivElement>>(new Map());

  const registerItem = React.useCallback((id: string, element: HTMLDivElement) => {
    itemsRef.current.set(idelement);
  }, []);

  const unregisterItem = React.useCallback((id: string) => {
    itemsRef.current.delete(id);
  }, []);

  // Handle layout changes if in editable mode
  React.useEffect(() => {
    if (editable && onLayoutChange) {
      // Logic for tracking layout changes would go here
      // For now, this is a placeholder
    }
  }, [editableonLayoutChange]);

  return (
    <DashboardGridContext.Provider 
      value={
        fullscreenWidget,
        setFullscreenWidget,
        editable,
        itemsRef,
        registerItem,
        unregisterItem}
    >
      <div
        id={id}
        className={cn(
          "grid",
          `grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns}`,
          gapClasses[gap],
          className
        )}
      >
        {children}
      </div>

      {/* Full-screen widget overlay */}
      <AnimatePresence>
        {fullscreenWidget && (
          <motion.div
            initial={ opacity: 0, scale: 0.9 }
            animate={ opacity: 1, scale: 1 }
            exit={ opacity: 0, scale: 0.9 }
            transition={ duration: 0.2 }
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
          >
            <motion.div 
              className="w-full h-full max-w-[95vw] max-h-[95vh] bg-background rounded-lg shadow-lg flex flex-col border overflow-hidden"
              layoutId={`dashboard-item-${fullscreenWidget}`}
            >
              {itemsRef.current.get(fullscreenWidget)?.cloneNode(true)}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 rounded-full"
                onClick={() => setFullscreenWidget(null)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close full-screen</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardGridContext.Provider>
  );
}

// Column span to class mapping
const colSpanClasses = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  3: "col-span-1 sm:col-span-2 md:col-span-3",
  4: "col-span-1 sm:col-span-2 md:col-span-4",
  6: "col-span-1 sm:col-span-2 md:col-span-6",
  12: "col-span-full";

// Row span to class mapping
const rowSpanClasses = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4";

// DashboardItem Component for individual widgets
export function DashboardItem({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  onClick,
  title,
  actions,
  fullScreenEnabled = true,
  removable = false,
  onRemove,
  id = `item-${Math.random().toString(36).substr(29)}`}: DashboardItemProps) {
  const { fullscreenWidget, setFullscreenWidget, editable, registerItem, unregisterItem } = useDashboardGrid();
  const itemRef = React.useRef<HTMLDivElement>(null);

  // Register/unregister the item with the dashboard grid
  React.useEffect(() => {
    if (itemRef.current) {
      registerItem(id, itemRef.current);
    }

    return () => {
      unregisterItem(id);
    };
  }, [id, registerItemunregisterItem]);

  // Toggle fullscreen state
  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fullscreenWidget === id) {
      setFullscreenWidget(null);
    } else {
      setFullscreenWidget(id);
    }
  };

  // Handle item removal
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <motion.div
      layoutId={`dashboard-item-${id}`}
      className={cn(
        "flex flex-col rounded-lg border bg-card text-card-foreground shadow",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        onClick && "cursor-pointer",
        editable && "relative",
        className
      )}
      ref={itemRef}
      onClick={onClick}
      initial={ opacity: 0, y: 10 }
      animate={ opacity: 1, y: 0 }
      exit={ opacity: 0, y: -10 }
      transition={ duration: 0.2 }
    >
      {/* Header with title and actions */}
      {(title || actions || fullScreenEnabled || removable) && (
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-medium">{title}</div>
          <div className="flex items-center gap-2">
            {actions}
            {fullScreenEnabled && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleFullScreen}
              >
                {fullscreenWidget === id ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {fullscreenWidget === id ? "Exit Full Screen" : "Full Screen"
                </span>
              </Button>
            )}
            {removable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Widget content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </motion.div>
  );
}

// DashboardDragHandle Component for editable mode (placeholder - would need react-grid-layout for full implementation)
export function DashboardDragHandle() {
  const { editable } = useDashboardGrid();

  if (!editable) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-6 bg-primary/10 cursor-move rounded-t-lg flex items-center justify-center">
      <div className="w-8 h-1 bg-muted-foreground/40 rounded-full" />
    </div>
  );
}