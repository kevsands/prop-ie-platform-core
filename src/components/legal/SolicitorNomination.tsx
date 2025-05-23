import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SolicitorDetails {
  firmName: string;
  solicitorName: string;
  email: string;
  phone: string;
  lawSocRegistration: string;
  address: string;
}

interface SolicitorNominationProps {
  onSubmit: (details: SolicitorDetails) => void;
  onSkip: () => void;
  loading?: boolean;
}

export const SolicitorNomination: React.FC<SolicitorNominationProps> = ({
  onSubmit,
  onSkip,
  loading = false
}) => {
  const [detailssetDetails] = useState<SolicitorDetails>({
    firmName: '',
    solicitorName: '',
    email: '',
    phone: '',
    lawSocRegistration: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  const updateField = (field: keyof SolicitorDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const isValid = details.firmName && details.solicitorName && details.email && details.lawSocRegistration;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Nominate Your Solicitor</CardTitle>
        <p className="text-sm text-gray-600">
          Please provide your solicitor's details. They will receive the contract for review.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firmName">Law Firm Name *</Label>
              <Input
                id="firmName"
                value={details.firmName}
                onChange={(e: any) => updateField('firmName', e.target.value)}
                placeholder="e.g., Smith & Associates"
                required
              />
            </div>
            <div>
              <Label htmlFor="solicitorName">Solicitor Name *</Label>
              <Input
                id="solicitorName"
                value={details.solicitorName}
                onChange={(e: any) => updateField('solicitorName', e.target.value)}
                placeholder="e.g., John Smith"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e: any) => updateField('email', e.target.value)}
                placeholder="solicitor@lawfirm.ie"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={details.phone}
                onChange={(e: any) => updateField('phone', e.target.value)}
                placeholder="+353 1 234 5678"
              />
            </div>
            <div>
              <Label htmlFor="lawSocRegistration">Law Society Registration *</Label>
              <Input
                id="lawSocRegistration"
                value={details.lawSocRegistration}
                onChange={(e: any) => updateField('lawSocRegistration', e.target.value)}
                placeholder="Registration Number"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Practice Address</Label>
            <Input
              id="address"
              value={details.address}
              onChange={(e: any) => updateField('address', e.target.value)}
              placeholder="Full practice address"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};