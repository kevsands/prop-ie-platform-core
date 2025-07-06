'use client';

import { useState } from 'react';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ArrowsPointingOutIcon,
  BoltIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  propertyTypes: string[];
  locations: string[];
  features: string[];
  sizeMin?: number;
  sizeMax?: number;
  gardenSizeMin?: number;
  berRating?: string[];
  availability?: string;
  developmentStage?: string[];
  orientation?: string[];
  floor?: string[];
  parking?: boolean;
  garden?: boolean;
  balcony?: boolean;
  ensuite?: boolean;
  walkInWardrobe?: boolean;
}

interface PropertySearchFiltersProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  loading?: boolean;
}

export default function PropertySearchFilters({
  filters,
  setFilters,
  loading = false
}: PropertySearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['price', 'property-type', 'bedrooms']);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: BuildingOfficeIcon },
    { value: 'house', label: 'House', icon: HomeIcon },
    { value: 'duplex', label: 'Duplex', icon: HomeModernIcon },
    { value: 'penthouse', label: 'Penthouse', icon: BuildingOfficeIcon },
    { value: 'studio', label: 'Studio', icon: HomeModernIcon },
  ];

  const locations = [
    'Dublin City Centre',
    'Dublin North',
    'Dublin South',
    'Dublin West',
    'Cork',
    'Galway',
    'Limerick',
    'Waterford',
    'Kilkenny',
    'Wexford',
  ];

  const features = [
    { value: 'parking', label: 'Parking Space' },
    { value: 'garden', label: 'Garden' },
    { value: 'balcony', label: 'Balcony/Terrace' },
    { value: 'ensuite', label: 'En-suite' },
    { value: 'walkin', label: 'Walk-in Wardrobe' },
    { value: 'gym', label: 'Gym' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'security', label: '24/7 Security' },
    { value: 'lift', label: 'Lift Access' },
    { value: 'storage', label: 'Storage Room' },
  ];

  const berRatings = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

  const developmentStages = [
    'Planning',
    'Under Construction',
    'Ready to Move',
    'Completed',
  ];

  const orientations = [
    'North',
    'South',
    'East',
    'West',
    'North-East',
    'North-West',
    'South-East',
    'South-West',
  ];

  const handlePriceChange = (values: number[]) => {
    setFilters({
      ...filters,
      priceMin: values[0],
      priceMax: values[1]
    });
  };

  const handleBedroomChange = (values: number[]) => {
    setFilters({
      ...filters,
      bedroomsMin: values[0],
      bedroomsMax: values[1]
    });
  };

  const handleTypeToggle = (type: string) => {
    const types = filters.propertyTypes || [];
    if (types.includes(type)) {
      setFilters({
        ...filters,
        propertyTypes: types.filter(t => t !== type)
      });
    } else {
      setFilters({
        ...filters,
        propertyTypes: [...types, type]
      });
    }
  };

  const handleLocationToggle = (location: string) => {
    const locations = filters.locations || [];
    if (locations.includes(location)) {
      setFilters({
        ...filters,
        locations: locations.filter(l => l !== location)
      });
    } else {
      setFilters({
        ...filters,
        locations: [...locations, location]
      });
    }
  };

  const handleFeatureToggle = (feature: string) => {
    const features = filters.features || [];
    if (features.includes(feature)) {
      setFilters({
        ...filters,
        features: features.filter(f => f !== feature)
      });
    } else {
      setFilters({
        ...filters,
        features: [...features, feature]
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      locations: [],
      features: [],
      berRating: [],
      developmentStage: [],
      orientation: [],
      floor: []
    });
  };

  const activeFiltersCount = 
    (filters.propertyTypes?.length || 0) +
    (filters.locations?.length || 0) +
    (filters.features?.length || 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.bedroomsMin || filters.bedroomsMax ? 1 : 0);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <Accordion 
        type="multiple" 
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-4"
      >
        {/* Price Range */}
        <AccordionItem value="price" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <CurrencyEuroIcon className="h-5 w-5" />
              <span>Price Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  €{filters.priceMin?.toLocaleString() || '0'}
                </span>
                <span className="text-sm text-gray-600">
                  €{filters.priceMax?.toLocaleString() || '1,000,000'}+
                </span>
              </div>
              <Slider
                min={0}
                max={1000000}
                step={10000}
                value={[filters.priceMin || 0, filters.priceMax || 1000000]}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Min Price</Label>
                  <Input
                    type="number"
                    value={filters.priceMin || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceMin: parseInt(e.target.value) || undefined
                    })}
                    placeholder="€0"
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Price</Label>
                  <Input
                    type="number"
                    value={filters.priceMax || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceMax: parseInt(e.target.value) || undefined
                    })}
                    placeholder="€1,000,000"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Property Type */}
        <AccordionItem value="property-type" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              <span>Property Type</span>
              {filters.propertyTypes?.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {filters.propertyTypes.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4 space-y-3">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = filters.propertyTypes?.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeToggle(type.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      isSelected ? "text-blue-600" : "text-gray-400"
                    )} />
                    <span className={cn(
                      "flex-1 text-left",
                      isSelected ? "text-blue-900 font-medium" : "text-gray-700"
                    )}>
                      {type.label}
                    </span>
                    {isSelected && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Bedrooms */}
        <AccordionItem value="bedrooms" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <HomeModernIcon className="h-5 w-5" />
              <span>Bedrooms</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {filters.bedroomsMin || 0} - {filters.bedroomsMax || 5}+ beds
                </span>
              </div>
              <Slider
                min={0}
                max={5}
                step={1}
                value={[filters.bedroomsMin || 0, filters.bedroomsMax || 5]}
                onValueChange={handleBedroomChange}
                className="mb-4"
              />
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, '5+'].map((bed) => (
                  <Button
                    key={bed}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (bed === '5+') {
                        setFilters({ ...filters, bedroomsMin: 5, bedroomsMax: 10 });
                      } else {
                        setFilters({ ...filters, bedroomsMin: bed as number, bedroomsMax: bed as number });
                      }
                    }}
                    className={cn(
                      filters.bedroomsMin === (bed === '5+' ? 5 : bed) &&
                      filters.bedroomsMax === (bed === '5+' ? 10 : bed)
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : ""
                    )}
                  >
                    {bed}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location */}
        <AccordionItem value="location" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              <span>Location</span>
              {filters.locations?.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {filters.locations.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4">
              <Input
                type="text"
                placeholder="Search locations..."
                className="mb-3"
              />
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((location) => (
                  <label
                    key={location}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.locations?.includes(location)}
                      onCheckedChange={() => handleLocationToggle(location)}
                    />
                    <span className="text-sm">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Features */}
        <AccordionItem value="features" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5" />
              <span>Features & Amenities</span>
              {filters.features?.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {filters.features.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4 space-y-3">
              {features.map((feature) => (
                <label
                  key={feature.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.features?.includes(feature.value)}
                    onCheckedChange={() => handleFeatureToggle(feature.value)}
                  />
                  <span className="text-sm">{feature.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <ArrowsPointingOutIcon className="h-5 w-5" />
              <span>Property Size</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Min Size (sq ft)</Label>
                  <Input
                    type="number"
                    value={filters.sizeMin || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      sizeMin: parseInt(e.target.value) || undefined
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Size (sq ft)</Label>
                  <Input
                    type="number"
                    value={filters.sizeMax || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      sizeMax: parseInt(e.target.value) || undefined
                    })}
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Energy Rating */}
        <AccordionItem value="energy" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-5 w-5" />
              <span>Energy Rating (BER)</span>
              {filters.berRating?.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {filters.berRating.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4">
              <div className="grid grid-cols-3 gap-2">
                {berRatings.map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const ratings = filters.berRating || [];
                      if (ratings.includes(rating)) {
                        setFilters({
                          ...filters,
                          berRating: ratings.filter(r => r !== rating)
                        });
                      } else {
                        setFilters({
                          ...filters,
                          berRating: [...ratings, rating]
                        });
                      }
                    }}
                    className={cn(
                      filters.berRating?.includes(rating)
                        ? "bg-green-50 border-green-500 text-green-700"
                        : ""
                    )}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Additional Filters */}
        <AccordionItem value="additional" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Additional Filters</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-4 space-y-4">
              <div>
                <Label className="text-sm mb-2">Development Stage</Label>
                <Select 
                  value={filters.developmentStage?.[0] || ""}
                  onValueChange={(value) => setFilters({
                    ...filters,
                    developmentStage: value ? [value] : []
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any stage</SelectItem>
                    {developmentStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2">Orientation</Label>
                <Select 
                  value={filters.orientation?.[0] || ""}
                  onValueChange={(value) => setFilters({
                    ...filters,
                    orientation: value ? [value] : []
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any orientation</SelectItem>
                    {orientations.map((orientation) => (
                      <SelectItem key={orientation} value={orientation}>
                        {orientation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2">Availability</Label>
                <Select 
                  value={filters.availability || ""}
                  onValueChange={(value) => setFilters({
                    ...filters,
                    availability: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any availability</SelectItem>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="3months">Within 3 months</SelectItem>
                    <SelectItem value="6months">Within 6 months</SelectItem>
                    <SelectItem value="1year">Within 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}