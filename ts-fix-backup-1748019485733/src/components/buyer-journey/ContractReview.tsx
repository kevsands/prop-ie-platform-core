'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Eye,
  CheckCircle,
  AlertCircle,
  Lock,
  Shield,
  Clock
} from 'lucide-react';
import { formatDate } from '@/utils/format';

interface ContractReviewProps {
  transactionId: string;
  onComplete: () => void;
}

interface ContractDocument {
  id: string;
  name: string;
  type: 'purchase_agreement' | 'terms_conditions' | 'disclosure' | 'warranty';
  status: 'pending' | 'reviewed' | 'signed';
  url: string;
  size: number;
  pageCount: number;
  requiredSignatures: SignatureRequirement[];
  createdAt: string;
  signedAt?: string;
}

interface SignatureRequirement {
  id: string;
  role: 'buyer' | 'seller' | 'witness';
  name: string;
  signed: boolean;
  signedAt?: string;
}

export function ContractReview({ transactionId, onComplete }: ContractReviewProps) {
  const [documentssetDocuments] = useState<ContractDocument[]>([]);
  const [selectedDocsetSelectedDoc] = useState<ContractDocument | null>(null);
  const [loadingsetLoading] = useState(true);
  const [signingsetSigning] = useState(false);
  const [errorsetError] = useState<string | null>(null);
  const [agreedsetAgreed] = useState({
    terms: false,
    accuracy: false,
    legal: false});

  useEffect(() => {
    fetchContractDocuments();
  }, [transactionId]);

  const fetchContractDocuments = async () => {
    try {
      const response = await fetch(`/api/v1/transactions/${transactionId}/contracts`);
      if (!response.ok) throw new Error('Failed to fetch contracts');

      const data = await response.json();
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (doc: ContractDocument) => {
    setSelectedDoc(doc);
    // In real app, this would open a document viewer
    window.open(doc.url, '_blank');

    // Mark as reviewed
    markAsReviewed(doc.id);
  };

  const markAsReviewed = async (documentId: string) => {
    try {
      await fetch(`/api/v1/contracts/${documentId}/review`, {
        method: 'POST'});

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'reviewed' as const }
          : doc
      ));
    } catch (err) {

    }
  };

  const handleSignDocument = async (doc: ContractDocument) => {
    setSigning(true);
    setError(null);

    try {
      // In real app, this would integrate with e-signature service
      const response = await fetch(`/api/v1/contracts/${doc.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          agreements: agreed})});

      if (!response.ok) throw new Error('Failed to sign document');

      const signedDoc = await response.json();

      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? signedDoc : d
      ));

      // Check if all documents are signed
      const allSigned = documents.every(d => 
        d.id === doc.id ? true : d.status === 'signed'
      );

      if (allSigned) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSigning(false);
    }
  };

  const allReviewed = documents.every(doc => doc.status !== 'pending');
  const allAgreed = Object.values(agreed).every(v => v);
  const canSign = allReviewed && allAgreed;
  const signedCount = documents.filter(doc => doc.status === 'signed').length;
  const progress = (signedCount / documents.length) * 100;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Review & Signing
        </CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Contract Documents</h3>
          {documents.map(doc => (
            <div
              key={doc.id}
              className={`p-4 border rounded-lg ${
                doc.status === 'signed' ? 'bg-success/5 border-success' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {doc.pageCount} pages • {Math.round(doc.size / 1024)}KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      doc.status === 'signed' ? 'success' :
                      doc.status === 'reviewed' ? 'warning' : 'default'
                    }
                  >
                    {doc.status === 'signed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {doc.status}
                  </Badge>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    {doc.status !== 'signed' && (
                      <Button
                        size="sm"
                        onClick={() => handleSignDocument(doc)}
                        disabled={!canSign || signing}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Sign
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {doc.signedAt && (
                <p className="text-sm text-muted-foreground mt-2">
                  Signed on {formatDate(doc.signedAt)}
                </p>
              )}

              {doc.requiredSignatures.length> 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Signatures:</p>
                  <div className="flex gap-4">
                    {doc.requiredSignatures.map(sig => (
                      <div key={sig.id} className="flex items-center gap-2">
                        {sig.signed ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">
                          {sig.name} ({sig.role})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {documents.some(doc => doc.status !== 'signed') && (
          <div className="space-y-4">
            <h3 className="font-semibold">Terms & Conditions</h3>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Please review all documents carefully before signing. This is a legally binding agreement.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreed.terms}
                  onCheckedChange={(checked) => 
                    setAgreed(prev => ({ ...prev, terms: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I have read and agree to all terms and conditions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accuracy"
                  checked={agreed.accuracy}
                  onCheckedChange={(checked) => 
                    setAgreed(prev => ({ ...prev, accuracy: checked as boolean }))
                  }
                />
                <Label htmlFor="accuracy" className="text-sm font-normal">
                  I confirm that all information provided is accurate
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="legal"
                  checked={agreed.legal}
                  onCheckedChange={(checked) => 
                    setAgreed(prev => ({ ...prev, legal: checked as boolean }))
                  }
                />
                <Label htmlFor="legal" className="text-sm font-normal">
                  I understand this is a legally binding contract
                </Label>
              </div>
            </div>
          </div>
        )}

        {!allReviewed && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please review all documents before signing.
            </AlertDescription>
          </Alert>
        )}

        {allReviewed && !allAgreed && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please agree to all terms before signing.
            </AlertDescription>
          </Alert>
        )}

        {documents.every(doc => doc.status === 'signed') && (
          <Alert className="bg-success/10 border-success">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              All contracts have been signed successfully!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}