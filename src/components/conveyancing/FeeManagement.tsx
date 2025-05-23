'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Fee {
  id: string;
  description: string;
  amount: number;
  type: 'fixed' | 'percentage';
  stage: string;
}

export const FeeManagement: React.FC = () => {
  const [feessetFees] = useState<Fee[]>([]);
  const [newFeesetNewFee] = useState<Partial<Fee>>({
    description: '',
    amount: 0,
    type: 'fixed',
    stage: ''
  });

  const addFee = () => {
    if (newFee.description && newFee.amount) {
      setFees([...fees, { ...newFee, id: Date.now().toString() } as Fee]);
      setNewFee({ description: '', amount: 0, type: 'fixed', stage: '' });
    }
  };

  const removeFee = (id: string) => {
    setFees(fees.filter(fee => fee.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Description</Label>
              <Input
                value={newFee.description}
                onChange={(e: any) => setNewFee({ ...newFee, description: e.target.value })}
                placeholder="Fee description"
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={newFee.amount}
                onChange={(e: any) => setNewFee({ ...newFee, amount: parseFloat(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={addFee}>Add Fee</Button>

          <div className="space-y-2">
            {fees.map(fee => (
              <div key={fee.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">{fee.description}</div>
                  <div className="text-sm text-gray-600">
                    €{fee.amount} ({fee.type})
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFee(fee.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeManagement;
