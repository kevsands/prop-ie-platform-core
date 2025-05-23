'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface CustomizationCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  description?: string;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  category: string;
  variants?: OptionVariant[];
  dependencies?: string[];
  incompatible?: string[];
  bulkDiscount?: BulkDiscount;
}

export interface OptionVariant {
  id: string;
  name: string;
  price: number;
  color?: string;
  texture?: string;
  material?: string;
  image?: string;
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercent: number;
}

export interface SelectedOption {
  optionId: string;
  variantId?: string;
  quantity?: number;
}

interface OptionsManagerProps {
  categories: CustomizationCategory[];
  selectedOptions: Record<string, SelectedOption>\n  );
  onOptionChange: (categoryId: string, option: SelectedOption | null) => void;
  developmentId: string;
}

export default function OptionsManager({
  categories,
  selectedOptions,
  onOptionChange,
  developmentId}: OptionsManagerProps) {
  const [activeCategorysetActiveCategory] = useState(categories[0]?.id || '');

  // Check if an option is available based on dependencies
  const isOptionAvailable = useCallback((option: CustomizationOption): boolean => {
    if (!option.available) return false;

    // Check dependencies
    if (option.dependencies && option.dependencies.length> 0) {
      const hasAllDependencies = option.dependencies.every(depId => 
        Object.values(selectedOptions).some(selected => selected.optionId === depId)
      );
      if (!hasAllDependencies) return false;
    }

    // Check incompatibilities
    if (option.incompatible && option.incompatible.length> 0) {
      const hasIncompatible = option.incompatible.some(incId =>
        Object.values(selectedOptions).some(selected => selected.optionId === incId)
      );
      if (hasIncompatible) return false;
    }

    return true;
  }, [selectedOptions]);

  // Calculate price with bulk discount
  const calculateOptionPrice = useCallback((option: CustomizationOption, quantity: number = 1): number => {
    let basePrice = option.price;

    if (option.bulkDiscount && quantity>= option.bulkDiscount.minQuantity) {
      const discount = basePrice * (option.bulkDiscount.discountPercent / 100);
      basePrice = basePrice - discount;
    }

    return basePrice * quantity;
  }, []);

  // Render option card
  const renderOptionCard = (option: CustomizationOption, category: CustomizationCategory) => {
    const isAvailable = isOptionAvailable(option);
    const isSelected = selectedOptions[category.id]?.optionId === option.id;

    return (
      <Card
        key={option.id}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isAvailable ? "hover:shadow-lg" : "opacity-50 cursor-not-allowed",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={() => {
          if (!isAvailable) return;

          if (isSelected) {
            onOptionChange(category.idnull);
          } else {
            onOptionChange(category.id, { optionId: option.id });
          }
        }
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{option.name}</CardTitle>
            <div className="flex items-center gap-2">
              {isSelected && (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  Selected
                </Badge>
              )}
              <Badge variant="outline">
                €{option.price.toLocaleString()}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {option.image && (
            <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden bg-gray-100">
              <img
                src={option.image}
                alt={option.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {option.description && (
            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
          )}

          {option.variants && option.variants.length> 0 && isSelected && (
            <div className="mt-4 space-y-3">
              <Label>Choose variant:</Label>
              <RadioGroup
                value={selectedOptions[category.id]?.variantId || option.variants[0].id}
                onValueChange={(variantId: any) => {
                  onOptionChange(category.id, {
                    optionId: option.id,
                    variantId});
                }
                onClick={(e: any) => e.stopPropagation()}
              >
                {option.variants.map((variant: any) => (
                  <div key={variant.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={variant.id} id={variant.id} />
                    <Label
                      htmlFor={variant.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {variant.color && (
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={ backgroundColor: variant.color }
                        />
                      )}
                      <span>{variant.name}</span>
                      {variant.price> 0 && (
                        <span className="text-sm text-gray-500">
                          (+€{variant.price.toLocaleString()})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {!isAvailable && option.dependencies && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
              <Info className="h-4 w-4" />
              <span>Requires: {option.dependencies.join(', ')}</span>
            </div>
          )}

          {option.bulkDiscount && (
            <div className="mt-3 text-sm text-green-600">
              <Badge variant="secondary" className="text-xs">
                Buy {option.bulkDiscount.minQuantity}+ and save {option.bulkDiscount.discountPercent}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {categories.map((category: any) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2"
            >
              {category.icon}
              <span>{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category: any) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            {category.description && (
              <p className="text-sm text-gray-600 mb-6">{category.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.options.map((option: any) => renderOptionCard(optioncategory))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}