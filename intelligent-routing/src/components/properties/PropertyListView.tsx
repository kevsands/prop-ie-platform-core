'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  BoltIcon,
  CarIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  CalendarDaysIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from '@/types/property';
import { cn } from "@/lib/utils";

interface PropertyListViewProps {
  properties: Property[];
  loading: boolean;
  viewMode: 'list' | 'grid';
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  compareMode: boolean;
  compareProperties: Property[];
  onCompareToggle: (property: Property) => void;
  onPropertySelect: (property: Property) => void;
}

export default function PropertyListView({
  properties,
  loading,
  viewMode,
  currentPage,
  totalCount,
  onPageChange,
  compareMode,
  compareProperties,
  onCompareToggle,
  onPropertySelect
}: PropertyListViewProps) {
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  const toggleSaved = (propertyId: string) => {
    if (savedProperties.includes(propertyId)) {
      setSavedProperties(savedProperties.filter(id => id !== propertyId));
    } else {
      setSavedProperties([...savedProperties, propertyId]);
    }
  };

  const isCompareSelected = (property: Property) => {
    return compareProperties.some(p => p.id === property.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-700';
      case 'SOLD':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBerColor = (rating: string) => {
    const letter = rating.charAt(0);
    switch (letter) {
      case 'A':
        return 'bg-green-500 text-white';
      case 'B':
        return 'bg-yellow-500 text-white';
      case 'C':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6 p-6",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className={cn(
          "grid gap-6 p-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <AnimatePresence>
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                <Card 
                  className={cn(
                    "overflow-hidden cursor-pointer transition-all duration-200",
                    hoveredProperty === property.id && "shadow-lg",
                    compareMode && isCompareSelected(property) && "ring-2 ring-blue-500"
                  )}
                  onClick={() => onPropertySelect(property)}
                >
                  <div className="relative">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={property.images?.[0] || '/images/properties/placeholder.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>

                      {/* BER Rating */}
                      {property.berRating && (
                        <div className="absolute top-4 right-4">
                          <Badge className={getBerColor(property.berRating)}>
                            BER {property.berRating}
                          </Badge>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {compareMode && (
                          <Button
                            size="sm"
                            variant={isCompareSelected(property) ? "default" : "secondary"}
                            onClick={(e) => {
                              e.stopPropagation();
                              onCompareToggle(property);
                            }}
                          >
                            <ScaleIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaved(property.id);
                          }}
                        >
                          {savedProperties.includes(property.id) ? (
                            <HeartSolidIcon className="h-4 w-4 text-red-500" />
                          ) : (
                            <HeartIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-2xl font-bold text-white">
                          €{property.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <HomeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HomeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowsPointingOutIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{property.size} m²</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.features?.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {property.features?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {viewMode === 'list' && (
                      <>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {property.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <EnvelopeIcon className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                          <Button size="sm" variant="outline">
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            Book Viewing
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      <div className="border-t bg-white p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(currentPage - 1)}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
            
            {[...Array(Math.ceil(totalCount / 12))].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => onPageChange(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(currentPage + 1)}
                className={cn(
                  currentPage >= Math.ceil(totalCount / 12) && 
                  "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}