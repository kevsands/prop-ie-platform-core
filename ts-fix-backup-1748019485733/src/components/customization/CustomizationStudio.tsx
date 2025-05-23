'use client';

import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Share2, ShoppingCart, Home, Sofa, Kitchen, Bath } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// Lazy load heavy components
const Studio3D = lazy(() => import('./Studio3D'));
const OptionsManager = lazy(() => import('./OptionsManager'));
const PriceCalculator = lazy(() => import('./PriceCalculator'));

// Import types
import type { CustomizationCategory, SelectedOption } from './OptionsManager';

interface CustomizationStudioProps {
  propertyId: string;
  propertyData: {
    id: string;
    title: string;
    price: number;
    modelUrl?: string;
    developmentId: string;
  };
}

// Mock data for customization options
const MOCK_CATEGORIES: CustomizationCategory[] = [
  {
    id: 'flooring',
    name: 'Flooring',
    icon: <Home className="h-4 w-4" />,
    description: 'Choose from premium flooring options',
    options: [
      {
        id: 'floor-oak',
        name: 'Oak Hardwood',
        description: 'Premium oak hardwood flooring with natural finish',
        price: 4500,
        available: true,
        category: 'flooring',
        image: '/images/customization/oak-floor.jpg',
        variants: [
          { id: 'oak-natural', name: 'Natural', price: 0, color: '#8B7355' },
          { id: 'oak-dark', name: 'Dark', price: 200, color: '#654321' },
          { id: 'oak-light', name: 'Light', price: 150, color: '#D2B48C' }]},
      {
        id: 'floor-tile',
        name: 'Porcelain Tiles',
        description: 'Large format porcelain tiles',
        price: 3200,
        available: true,
        category: 'flooring',
        image: '/images/customization/tile-floor.jpg',
        variants: [
          { id: 'tile-marble', name: 'Marble Look', price: 500, color: '#F0F0F0' },
          { id: 'tile-concrete', name: 'Concrete Look', price: 0, color: '#808080' }]}]},
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: <Kitchen className="h-4 w-4" />,
    description: 'Upgrade your kitchen finishes',
    options: [
      {
        id: 'kitchen-cabinets',
        name: 'Cabinet Upgrade',
        description: 'Premium cabinet finishes and hardware',
        price: 8500,
        available: true,
        category: 'kitchen',
        image: '/images/customization/kitchen-cabinets.jpg',
        variants: [
          { id: 'cab-modern', name: 'Modern White', price: 0, color: '#FFFFFF' },
          { id: 'cab-shaker', name: 'Shaker Gray', price: 1200, color: '#6B7280' },
          { id: 'cab-dark', name: 'Dark Wood', price: 2000, color: '#3E2723' }]},
      {
        id: 'kitchen-countertop',
        name: 'Countertop Upgrade',
        description: 'Premium countertop materials',
        price: 5500,
        available: true,
        category: 'kitchen',
        image: '/images/customization/countertop.jpg',
        variants: [
          { id: 'counter-quartz', name: 'Quartz', price: 0, color: '#E0E0E0' },
          { id: 'counter-granite', name: 'Granite', price: 1500, color: '#4A4A4A' },
          { id: 'counter-marble', name: 'Marble', price: 3000, color: '#F5F5F5' }]}]},
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: <Bath className="h-4 w-4" />,
    description: 'Luxury bathroom upgrades',
    options: [
      {
        id: 'bath-fixtures',
        name: 'Premium Fixtures',
        description: 'High-end bathroom fixtures and fittings',
        price: 3200,
        available: true,
        category: 'bathroom',
        image: '/images/customization/bath-fixtures.jpg',
        bulkDiscount: { minQuantity: 2, discountPercent: 10 },
      {
        id: 'bath-tiles',
        name: 'Designer Tiles',
        description: 'Premium wall and floor tiles',
        price: 2800,
        available: true,
        category: 'bathroom',
        image: '/images/customization/bath-tiles.jpg',
        dependencies: ['bath-fixtures']}]},
  {
    id: 'fixtures',
    name: 'Fixtures',
    icon: <Sofa className="h-4 w-4" />,
    description: 'Lighting and electrical upgrades',
    options: [
      {
        id: 'smart-home',
        name: 'Smart Home Package',
        description: 'Complete smart home automation system',
        price: 12000,
        available: true,
        category: 'fixtures',
        image: '/images/customization/smart-home.jpg'},
      {
        id: 'lighting-upgrade',
        name: 'Designer Lighting',
        description: 'Premium lighting fixtures throughout',
        price: 4500,
        available: true,
        category: 'fixtures',
        image: '/images/customization/lighting.jpg'}]}];

export default function CustomizationStudio({ propertyId, propertyData }: CustomizationStudioProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedOptionssetSelectedOptions] = useState<Record<string, SelectedOption>>({});
  const [activeTabsetActiveTab] = useState('3d-view');
  const [isSavingsetIsSaving] = useState(false);

  // Fetch saved customization
  const { data: savedCustomization, isLoading } = useQuery({
    queryKey: ['customization', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/customization?propertyId=${propertyId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch customization');
      }
      return response.json();
    });

  // Load saved customization
  useEffect(() => {
    if (savedCustomization?.selectedOptions) {
      setSelectedOptions(savedCustomization.selectedOptions);
    }
  }, [savedCustomization]);

  // Save customization mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)});
      if (!response.ok) throw new Error('Failed to save customization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customization', propertyId] });
      toast({
        title: 'Customization saved!',
        description: 'Your selections have been saved successfully.'});
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save customization. Please try again.',
        variant: 'destructive'});
    });

  // Handle option change
  const handleOptionChange = useCallback((categoryId: string, option: SelectedOption | null) => {
    setSelectedOptions(prev => {
      if (option === null) {
        const { [categoryId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [categoryId]: option };
    });
  }, []);

  // Calculate selected options for price calculator
  const selectedOptionsArray = Object.entries(selectedOptions).map(([categoryIdoption]) => {
    const category = MOCK_CATEGORIES.find(c => c.id === categoryId);
    const optionData = category?.options.find(o => o.id === option.optionId);
    const variant = optionData?.variants?.find(v => v.id === option.variantId);

    return {
      id: option.optionId,
      name: optionData?.name || '',
      price: (optionData?.price || 0) + (variant?.price || 0),
      category: categoryId,
      quantity: option.quantity || 1};
  });

  // Save customization
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveMutation.mutateAsync({
        propertyId,
        selectedOptions,
        totalCost: calculateTotalPrice()});
    } finally {
      setIsSaving(false);
    }
  };

  // Share customization
  const handleShare = async () => {
    const url = `${window.location.origin}/properties/${propertyId}/customize?config=${encodeURIComponent(
      JSON.stringify(selectedOptions)
    )}`;

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Share this link with others to show your customization.'});
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive'});
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedOptionsArray.reduce((sumoption) => sum + option.price * option.quantity0);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    router.push(`/properties/${propertyId}/reserve?customization=${savedCustomization?.id || 'new'}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={ opacity: 0, y: 20 }
        animate={ opacity: 1, y: 0 }
        transition={ duration: 0.5 }
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Customize Your Home</h1>
              <p className="text-gray-600">{propertyData.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={Object.keys(selectedOptions).length === 0}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving || Object.keys(selectedOptions).length === 0}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={Object.keys(selectedOptions).length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Reserve Now
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: 3D View and Options */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="3d-view">3D View</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>

              <TabsContent value="3d-view" className="mt-6">
                <Card className="p-4">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-[600px]">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  }>
                    <Studio3D
                      modelUrl={propertyData.modelUrl || '/models/default-room.glb'}
                      customizations={selectedOptions}
                      onCustomizationChange={handleOptionChange}
                      availableOptions={MOCK_CATEGORIES.flatMap(c => c.options)}
                    />
                  </Suspense>
                </Card>
              </TabsContent>

              <TabsContent value="options" className="mt-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }>
                  <OptionsManager
                    categories={MOCK_CATEGORIES}
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                    developmentId={propertyData.developmentId}
                  />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Price Calculator */}
          <div>
            <Suspense fallback={
              <Card className="h-[400px] animate-pulse bg-gray-100" />
            }>
              <PriceCalculator
                basePrice={propertyData.price}
                selectedOptions={selectedOptionsArray}
                onPriceUpdate={(price) => {
                  // Update total price in parent if needed
                }
              />
            </Suspense>
          </div>
        </div>

        {/* Selected Options Summary */}
        {Object.keys(selectedOptions).length> 0 && (
          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            className="mt-8 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="font-semibold mb-3">Selected Customizations</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedOptions).map(([categoryIdoption]) => {
                const category = MOCK_CATEGORIES.find(c => c.id === categoryId);
                const optionData = category?.options.find(o => o.id === option.optionId);
                return (
                  <Badge key={categoryId} variant="secondary">
                    {optionData?.name}
                  </Badge>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}