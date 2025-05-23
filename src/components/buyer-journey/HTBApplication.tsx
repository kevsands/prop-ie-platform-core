'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/format';
import { 
  Calculator, 
  Home, 
  DollarSign, 
  FileText,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface HTBApplicationProps {
  transactionId: string;
  propertyPrice: number;
  onComplete: () => void;
}

export function HTBApplication({ transactionId, propertyPrice, onComplete }: HTBApplicationProps) {
  const [stepsetStep] = useState(1);
  const [loadingsetLoading] = useState(false);
  const [errorsetError] = useState<string | null>(null);

  const [formDatasetFormData] = useState({
    annualIncome: '',
    deposit: '',
    firstTimeBuyer: 'yes',
    existingHomeowner: 'no',
    propertyIntent: 'primary',
    employmentStatus: 'employed',
    employerName: '',
    yearsEmployed: ''});

  const maxHTBAmount = Math.min(propertyPrice * 0.330000); // 30% up to €30k
  const eligibleHTB = calculateHTB();

  function calculateHTB(): number {
    const deposit = parseFloat(formData.deposit) || 0;
    const income = parseFloat(formData.annualIncome) || 0;

    // Simplified HTB calculation
    if (formData.firstTimeBuyer === 'yes' && income <= 90000) {
      return Math.min(deposit * 0.3maxHTBAmount);
    }
    return 0;
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/transactions/${transactionId}/htb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyPrice,
          estimatedHTB: eligibleHTB})});

      if (!response.ok) throw new Error('Failed to submit HTB application');

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Income & Employment</h3>

            <div>
              <Label htmlFor="annualIncome">Annual Income (€)</Label>
              <Input
                id="annualIncome"
                type="number"
                value={formData.annualIncome}
                onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, annualIncome: e.target.value }))}
                placeholder="65000"
              />
            </div>

            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select
                value={formData.employmentStatus}
                onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, employmentStatus: e.target.value }))}
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="contractor">Contractor</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                value={formData.employerName}
                onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, employerName: e.target.value }))}
                placeholder="Company Name"
              />
            </div>

            <div>
              <Label htmlFor="yearsEmployed">Years with Current Employer</Label>
              <Input
                id="yearsEmployed"
                type="number"
                value={formData.yearsEmployed}
                onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, yearsEmployed: e.target.value }))}
                placeholder="3"
              />
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Next: Property Details
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property & Buyer Status</h3>

            <div>
              <Label>Are you a first-time buyer?</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.firstTimeBuyer === 'yes'}
                    onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, firstTimeBuyer: e.target.value }))}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={formData.firstTimeBuyer === 'no'}
                    onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, firstTimeBuyer: e.target.value }))}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <Label>Do you currently own a home?</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.existingHomeowner === 'yes'}
                    onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, existingHomeowner: e.target.value }))}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={formData.existingHomeowner === 'no'}
                    onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, existingHomeowner: e.target.value }))}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="propertyIntent">How will you use this property?</Label>
              <Select
                value={formData.propertyIntent}
                onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, propertyIntent: e.target.value }))}
              >
                <option value="primary">Primary Residence</option>
                <option value="investment">Investment Property</option>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Next: Calculate HTB
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">HTB Calculation</h3>

            <div>
              <Label htmlFor="deposit">Your Deposit Amount (€)</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit}
                onChange={(e: React.MouseEvent) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                placeholder="20000"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Property Price:</span>
                <span className="font-semibold">{formatCurrency(propertyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Deposit:</span>
                <span className="font-semibold">{formatCurrency(parseFloat(formData.deposit) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Max HTB (30%):</span>
                <span>{formatCurrency(maxHTBAmount)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-lg">
                <span>Eligible HTB Amount:</span>
                <span className="font-bold text-primary">{formatCurrency(eligibleHTB)}</span>
              </div>
            </div>

            {eligibleHTB === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Based on your details, you may not be eligible for HTB. Please check your first-time buyer status and income level.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Previous
              </Button>
              <Button 
                onClick={() => setStep(4)} 
                className="flex-1"
                disabled={eligibleHTB === 0}
              >
                Review & Submit
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Summary
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Income & Employment</p>
                <p>Annual Income: {formatCurrency(parseFloat(formData.annualIncome) || 0)}</p>
                <p>Employer: {formData.employerName}</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Property Details</p>
                <p>First-time Buyer: {formData.firstTimeBuyer === 'yes' ? 'Yes' : 'No'}</p>
                <p>Property Use: {formData.propertyIntent === 'primary' ? 'Primary Residence' : 'Investment'}</p>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold">HTB Benefit</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(eligibleHTB)}</p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                By submitting, you authorize us to verify your information with Revenue for HTB eligibility.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                Previous
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit HTB Application'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Help to Buy Application
        </CardTitle>
        <Progress value={(step / 4) * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}