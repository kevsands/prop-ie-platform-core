'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BuyerDocumentRepositoryProps {
  initialPhase?: string;
}

const BuyerDocumentRepository: React.FC<BuyerDocumentRepositoryProps> = ({ 
  initialPhase 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Document repository is being rebuilt...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerDocumentRepository;