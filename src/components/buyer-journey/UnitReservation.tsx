'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  User, 
  FileCheck, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UnitReservationProps {
  unitId: string;
  unitType: string;
  price: string;
  onComplete: (transactionId: string) => void;
}

export function UnitReservation({ unitId, unitType, price, onComplete }: UnitReservationProps) {
  const [loadingsetLoading] = useState(false);
  const [errorsetError] = useState<string | null>(null);

  const handleReserve = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, call the API to create a transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unitId,
          agreedPrice: parseFloat(price.replace(/[^0-9.]/g, '')),
          mortgageRequired: false,
          helpToBuyUsed: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reserve unit');
      }

      const data = await response.json();

      if (data.success) {
        onComplete(data.data.id);
      } else {
        throw new Error(data.error || 'Failed to reserve unit');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve Your Unit</CardTitle>
        <CardDescription>Secure your {unitType} with a deposit</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Unit Details</h4>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">{unitType}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-medium">{price}</span>
            </div>
            <div className="flex justify-between">
              <span>Deposit Required:</span>
              <span className="font-medium">€1,000</span>
            </div>
          </div>

          <Alert className="bg-blue-50">
            <AlertDescription className="text-blue-800">
              Your deposit of €1,000 is fully refundable within the 14-day cooling off period.
            </AlertDescription>
          </Alert>

          <div className="pt-2">
            <Button 
              onClick={handleReserve} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Reserve Now
                  <ChevronRight className="ml-2 h-4 w-4" / />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}