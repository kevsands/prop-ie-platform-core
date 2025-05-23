'use client';

import React, { useState, useMemo } from 'react';
import {
  ReceiptPercentIcon,
  CalculatorIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PropertyStampDutyCalculatorProps {
  propertyPrice: number;
  propertyType: string;
}

interface StampDutyBand {
  threshold: number;
  rate: number;
  label: string;
}

// Irish stamp duty rates as of 2024
const RESIDENTIAL_RATES: StampDutyBand[] = [
  { threshold: 1000000, rate: 0.01, label: 'Up to €1M' },
  { threshold: Infinity, rate: 0.02, label: 'Over €1M' }
];

const COMMERCIAL_RATES: StampDutyBand[] = [
  { threshold: Infinity, rate: 0.075, label: 'All values' }
];

export default function PropertyStampDutyCalculator({ 
  propertyPrice, 
  propertyType 
}: PropertyStampDutyCalculatorProps) {
  const [buyerTypesetBuyerType] = useState<'first-time' | 'mover' | 'investor'>('first-time');
  const [propertyCategorysetPropertyCategory] = useState<'residential' | 'commercial'>(
    propertyType.toLowerCase().includes('commercial') ? 'commercial' : 'residential'
  );
  const [customPricesetCustomPrice] = useState<number | null>(null);
  const [showBreakdownsetShowBreakdown] = useState(false);

  const calculationPrice = customPrice || propertyPrice;

  const calculation = useMemo(() => {
    let stampDuty = 0;
    const breakdown: { band: string; amount: number; rate: number }[] = [];
    const rates = propertyCategory === 'residential' ? RESIDENTIAL_RATES : COMMERCIAL_RATES;

    // Calculate stamp duty based on bands
    let remainingValue = calculationPrice;
    let previousThreshold = 0;

    for (const band of rates) {
      const bandValue = Math.min(remainingValue, band.threshold - previousThreshold);
      const bandDuty = bandValue * band.rate;

      if (bandValue> 0) {
        stampDuty += bandDuty;
        breakdown.push({
          band: band.label,
          amount: bandValue,
          rate: band.rate
        });
      }

      remainingValue -= bandValue;
      previousThreshold = band.threshold;

      if (remainingValue <= 0) break;
    }

    // First-time buyer exemption (up to €500k)
    let firstTimeBuyerRelief = 0;
    if (buyerType === 'first-time' && propertyCategory === 'residential') {
      if (calculationPrice <= 500000) {
        firstTimeBuyerRelief = stampDuty;
        stampDuty = 0;
      } else {
        // Calculate duty only on amount over €500k for first-time buyers
        stampDuty = (calculationPrice - 500000) * 0.01;
        firstTimeBuyerRelief = 5000; // Relief on first €500k at 1%
      }
    }

    const effectiveRate = calculationPrice> 0 ? (stampDuty / calculationPrice) * 100 : 0;

    return {
      stampDuty,
      firstTimeBuyerRelief,
      effectiveRate,
      breakdown
    };
  }, [calculationPrice, buyerTypepropertyCategory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptPercentIcon className="h-5 w-5" />
          Stamp Duty Calculator
        </CardTitle>
        <CardDescription>
          Calculate stamp duty for Irish property purchases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price Input */}
        <div className="space-y-2">
          <Label>Property Price</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={customPrice || propertyPrice}
              onChange={(e: any) => setCustomPrice(parseFloat(e.target.value) || null)}
              prefix="€"
              className="flex-1"
            />
            {customPrice !== null && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomPrice(null)}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Property Category */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <RadioGroup
            value={propertyCategory}
            onValueChange={(value: any) => setPropertyCategory(value as 'residential' | 'commercial')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="residential" id="residential" />
              <Label htmlFor="residential">Residential</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="commercial" id="commercial" />
              <Label htmlFor="commercial">Commercial</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Buyer Type */}
        {propertyCategory === 'residential' && (
          <div className="space-y-2">
            <Label>Buyer Type</Label>
            <RadioGroup
              value={buyerType}
              onValueChange={(value: any) => setBuyerType(value as typeof buyerType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="first-time" id="first-time" />
                <Label htmlFor="first-time" className="flex items-center gap-2">
                  First-time Buyer
                  <HoverCard>
                    <HoverCardTrigger>
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-sm">
                        First-time buyers are exempt from stamp duty on properties up to €500,000. 
                        For properties over €500,000, stamp duty is charged only on the excess amount.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mover" id="mover" />
                <Label htmlFor="mover">Home Mover</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investor" id="investor" />
                <Label htmlFor="investor">Investor</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Calculation Results */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              calculation.stampDuty === 0 ? 'bg-green-50' : 'bg-blue-50'
            }`}>
              <p className="text-sm text-gray-600 mb-1">Stamp Duty</p>
              <p className={`text-2xl font-bold ${
                calculation.stampDuty === 0 ? 'text-green-900' : 'text-blue-900'
              }`}>
                €{Math.round(calculation.stampDuty).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Effective Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculation.effectiveRate.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* First-time Buyer Relief */}
          {calculation.firstTimeBuyerRelief> 0 && (
            <Alert className="mb-6">
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>First-time Buyer Relief Applied!</strong><br />
                You save €{Math.round(calculation.firstTimeBuyerRelief).toLocaleString()} in stamp duty.
              </AlertDescription>
            </Alert>
          )}

          {/* Breakdown Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="mb-4"
          >
            {showBreakdown ? 'Hide' : 'Show'} Calculation Breakdown
          </Button>

          {/* Detailed Breakdown */}
          {showBreakdown && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Calculation Breakdown</h4>
              {calculation.breakdown.map((bandindex: any) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {band.band} @ {(band.rate * 100).toFixed(1)}%
                  </span>
                  <span className="font-medium">
                    €{Math.round(band.amount * band.rate).toLocaleString()}
                  </span>
                </div>
              ))}
              {buyerType === 'first-time' && calculationPrice> 500000 && (
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">First-time buyer relief</span>
                  <span className="font-medium text-green-600">
                    -€{Math.round(calculation.firstTimeBuyerRelief).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t font-semibold">
                <span>Total Stamp Duty</span>
                <span>€{Math.round(calculation.stampDuty).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Important Notes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Stamp duty must be paid within 30 days of completion
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                These calculations are based on current Irish stamp duty rates
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Additional reliefs may apply in certain circumstances
              </li>
              {propertyCategory === 'commercial' && (
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Commercial property attracts a flat rate of 7.5%
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}