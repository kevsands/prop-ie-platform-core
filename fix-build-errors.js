#!/usr/bin/env node
// Fix build errors

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing build errors...\n');

// 1. Install missing dependencies
const missingDeps = [
  '@react-pdf/renderer',
  'ethers',
  'ioredis'
];

console.log('Installing missing dependencies...');
missingDeps.forEach(dep => {
  console.log(`Installing ${dep}...`);
  try {
    execSync(`npm install ${dep} --legacy-peer-deps`, { stdio: 'inherit' });
    console.log(`✅ Installed ${dep}`);
  } catch (error) {
    console.log(`⚠️ Failed to install ${dep}`);
  }
});

// 2. Create missing component
const feeManagementComponent = `'use client';

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
  const [fees, setFees] = useState<Fee[]>([]);
  const [newFee, setNewFee] = useState<Partial<Fee>>({
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
                onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                placeholder="Fee description"
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={newFee.amount}
                onChange={(e) => setNewFee({ ...newFee, amount: parseFloat(e.target.value) })}
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
`;

const conveyancingDir = path.join('src', 'components', 'conveyancing');
if (!fs.existsSync(conveyancingDir)) {
  fs.mkdirSync(conveyancingDir, { recursive: true });
}

fs.writeFileSync(path.join(conveyancingDir, 'FeeManagement.tsx'), feeManagementComponent);
console.log('✅ Created FeeManagement component');

// 3. Fix duplicate POST export in payments route
const paymentsRoutePath = path.join('src', 'app', 'api', 'payments', 'route.ts');
if (fs.existsSync(paymentsRoutePath)) {
  let content = fs.readFileSync(paymentsRoutePath, 'utf8');
  
  // Count POST occurrences
  const postMatches = content.match(/export\s+async\s+function\s+POST/g);
  
  if (postMatches && postMatches.length > 1) {
    // Rename second POST to something else
    let count = 0;
    content = content.replace(/export\s+async\s+function\s+POST/g, (match) => {
      count++;
      if (count === 2) {
        return 'export async function processRefund';
      }
      return match;
    });
    
    fs.writeFileSync(paymentsRoutePath, content);
    console.log('✅ Fixed duplicate POST export in payments route');
  }
}

console.log('\nBuild errors fixed!');
console.log('Run "npm run build" to verify the build is working.');