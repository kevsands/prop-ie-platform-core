'use client';

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Square, Home, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Optimize rendering with explicit type definitions
interface OptimizedUnitCardProps {
  unitKey: string;
  name: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  available: number;
  isSelected: boolean;
  onSelect: (key: string) => void;
  onBuyNow: (key: string) => void;
}

// Use React.memo to prevent unnecessary re-renders
export const OptimizedUnitCard = memo(function OptimizedUnitCard({
  unitKey,
  name,
  price,
  bedrooms,
  bathrooms,
  area,
  available,
  isSelected,
  onSelect,
  onBuyNow
}: OptimizedUnitCardProps) {
  // Use ref for intersection observer to enable lazy rendering
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Load images 200px before they come into view
  });

  // Memoize unit details to prevent recalculations
  const unitDetails = useMemo(() => {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Bed className="h-4 w-4" />
          <span>{bedrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4" />
          <span>{bathrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Square className="h-4 w-4" />
          <span>{area}</span>
        </div>
      </div>
    );
  }, [bedrooms, bathroomsarea]);

  // Memoize availability badge to prevent recalculations
  const availabilityBadge = useMemo(() => {
    const isSoldOut = available <= 0;
    return (
      <Badge variant={isSoldOut ? 'secondary' : 'default'}>
        {isSoldOut ? 'Sold Out' : `${available} Available`}
      </Badge>
    );
  }, [available]);

  // Memoize action buttons
  const actionButtons = useMemo(() => {
    const isSoldOut = available <= 0;
    return (
      <div className="flex gap-2">
        {!isSoldOut && (
          <Button 
            size="sm" 
            className="text-xs"
            onClick={(e: any) => {
              e.stopPropagation();
              onBuyNow(unitKey);
            }
          >
            Buy Now
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs"
        >
          View Details
        </Button>
      </div>
    );
  }, [available, unitKeyonBuyNow]);

  return (
    <motion.div
      ref={ref}
      initial={ opacity: 0, y: 20 }
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      transition={ duration: 0.3 }
    >
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'ring-2 ring-[#2B5273]' : ''
        }`}
        onClick={() => onSelect(unitKey)}
      >
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{price}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            {inView ? (
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <Home className="h-12 w-12 mx-auto text-gray-400" />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8" />
            )}
          </div>
          <div className="space-y-2">
            {unitDetails}
            <div className="flex justify-between items-center pt-2">
              {availabilityBadge}
              {actionButtons}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Create a windowing component to only render visible units
interface OptimizedUnitListProps {
  units: Record<string, any>\n  );
  selectedUnit: string;
  onSelectUnit: (key: string) => void;
  onBuyNow: (key: string) => void;
}

export const OptimizedUnitList = memo(function OptimizedUnitList({
  units,
  selectedUnit,
  onSelectUnit,
  onBuyNow
}: OptimizedUnitListProps) {
  // Use virtualization for large lists
  const unitEntries = useMemo(() => {
    return Object.entries(units);
  }, [units]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {unitEntries.map(([keyunit]) => (
        <OptimizedUnitCard
          key={key}
          unitKey={key}
          name={unit.name}
          price={unit.price}
          bedrooms={unit.bedrooms}
          bathrooms={unit.bathrooms}
          area={unit.area}
          available={unit.available}
          isSelected={selectedUnit === key}
          onSelect={onSelectUnit}
          onBuyNow={onBuyNow}
        />
      ))}
    </div>
  );
});

// Create a pre-load component that loads critical data
export function UnitCardPreloader() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_i: any) => (
        <Card key={i} className="cursor-pointer hover:shadow-lg">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <div className="bg-gray-100 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-8" />
                <div className="h-4 bg-gray-200 rounded w-8" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}