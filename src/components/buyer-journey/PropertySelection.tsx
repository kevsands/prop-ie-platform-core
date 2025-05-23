'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Sun,
  MapPin,
  Check,
  Info 
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import Image from 'next/image';

interface PropertySelectionProps {
  transactionId: string;
  developmentId: string;
  onSelect: (unitId: string) => void;
}

interface Unit {
  id: string;
  unitNumber: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  floor: number;
  hasBalcony: boolean;
  hasParking: boolean;
  orientation: string;
  images: string[];
  customizationOptions?: CustomizationOption[];
}

interface CustomizationOption {
  id: string;
  category: 'flooring' | 'kitchen' | 'bathroom' | 'paint';
  name: string;
  description: string;
  price: number;
  image?: string;
}

export function PropertySelection({ transactionId, developmentId, onSelect }: PropertySelectionProps) {
  const [unitssetUnits] = useState<Unit[]>([]);
  const [selectedUnitsetSelectedUnit] = useState<Unit | null>(null);
  const [selectedCustomizationssetSelectedCustomizations] = useState<string[]>([]);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [stepsetStep] = useState<'selection' | 'customization'>('selection');

  useEffect(() => {
    fetchAvailableUnits();
  }, [developmentId]);

  const fetchAvailableUnits = async () => {
    try {
      const response = await fetch(`/api/v1/developments/${developmentId}/units?status=available`);
      if (!response.ok) throw new Error('Failed to fetch units');

      const data = await response.json();
      setUnits(data.units);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    if (unit.customizationOptions && unit.customizationOptions.length> 0) {
      setStep('customization');
    } else {
      confirmSelection(unit.id);
    }
  };

  const handleCustomizationToggle = (optionId: string) => {
    setSelectedCustomizations(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      }
      return [...prevoptionId];
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedUnit) return 0;

    const customizationTotal = selectedUnit.customizationOptions
      ?.filter(opt => selectedCustomizations.includes(opt.id))
      .reduce((sumopt: any) => sum + opt.price0) || 0;

    return selectedUnit.price + customizationTotal;
  };

  const confirmSelection = async (unitId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/transactions/${transactionId}/property`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          customizations: selectedCustomizations,
          totalPrice: calculateTotalPrice()})});

      if (!response.ok) throw new Error('Failed to select property');

      onSelect(unitId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'customization' && selectedUnit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Home</CardTitle>
          <p className="text-sm text-muted-foreground">
            Unit {selectedUnit.unitNumber} - {selectedUnit.type}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {['flooring', 'kitchen', 'bathroom', 'paint'].map(category => {
            const options = selectedUnit.customizationOptions?.filter(
              opt => opt.category === category
            );

            if (!options || options.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.map(option => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCustomizations.includes(option.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleCustomizationToggle(option.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{option.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </p>
                          <p className="font-semibold mt-2">
                            +{formatCurrency(option.price)}
                          </p>
                        </div>
                        {selectedCustomizations.includes(option.id) && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Base Price:</span>
              <span>{formatCurrency(selectedUnit.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Customizations:</span>
              <span>
                {formatCurrency(
                  selectedUnit.customizationOptions
                    ?.filter(opt => selectedCustomizations.includes(opt.id))
                    .reduce((sumopt: any) => sum + opt.price0) || 0
                )}
              </span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Price:</span>
              <span>{formatCurrency(calculateTotalPrice())}</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep('selection')}
            >
              Back to Selection
            </Button>
            <Button
              className="flex-1"
              onClick={() => confirmSelection(selectedUnit.id)}
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm Selection'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Select Your Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map(unit => (
            <Card
              key={unit.id}
              className={`cursor-pointer transition-shadow hover:shadow-lg ${
                unit.status !== 'available' ? 'opacity-50' : ''
              }`}
              onClick={() => unit.status === 'available' && handleUnitSelect(unit)}
            >
              {unit.images[0] && (
                <div className="relative h-48 w-full">
                  <Image
                    src={unit.images[0]}
                    alt={`Unit ${unit.unitNumber}`}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={unit.status === 'available' ? 'default' : 'secondary'}
                  >
                    {unit.status}
                  </Badge>
                </div>
              )}

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">Unit {unit.unitNumber}</h3>
                <p className="text-muted-foreground">{unit.type}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.area} m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Floor {unit.floor}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {unit.hasBalcony && (
                    <Badge variant="outline" className="text-xs">
                      <Sun className="h-3 w-3 mr-1" />
                      Balcony
                    </Badge>
                  )}
                  {unit.hasParking && (
                    <Badge variant="outline" className="text-xs">
                      <Car className="h-3 w-3 mr-1" />
                      Parking
                    </Badge>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {formatCurrency(unit.price)}
                  </span>
                  {unit.status === 'available' && (
                    <Button size="sm">Select</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {units.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No available units found for this development.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}