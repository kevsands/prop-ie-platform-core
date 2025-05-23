'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  FileText,
  Download,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Loader2,
  History,
  Lock,
  UserCheck,
  Calendar,
  Share2
} from 'lucide-react';

interface Contract {
  id: string;
  transactionId: string;
  version: number;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'countersigned' | 'completed';
  type: 'sales_contract' | 'reservation_agreement' | 'amendment';
  createdAt: string;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  countersignedAt?: string;
  completedAt?: string;
  fileUrl: string;
  signedFileUrl?: string;
  fields: Record<string, any>\n  );
  signatures: Array<{
    party: string;
    name: string;
    signedAt?: string;
    ipAddress?: string;
  }>\n  );
}

interface ContractManagerProps {
  transactionId: string;
  onContractSigned?: () => void;
}

export default function ContractManager({ transactionId, onContractSigned }: ContractManagerProps) {
  const [selectedContractsetSelectedContract] = useState<Contract | null>(null);
  const [showSignaturesetShowSignature] = useState(false);
  const [viewModesetViewMode] = useState<'preview' | 'history'>('preview');

  // Fetch contracts
  const { data: contracts, refetch } = useQuery({
    queryKey: ['contracts', transactionId],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/${transactionId}/contracts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch contracts');
      return response.json();
    }
  });

  // Generate contract mutation
  const generateContract = useMutation({
    mutationFn: async (type: string) => {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transactionId,
          type
        })
      });
      if (!response.ok) throw new Error('Failed to generate contract');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    }
  });

  // Send contract mutation
  const sendContract = useMutation({
    mutationFn: async (contractId: string) => {
      const response = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to send contract');
      return response.json();
    },
    onSuccess: () => {
      refetch();
    }
  });

  // Sign contract mutation
  const signContract = useMutation({
    mutationFn: async ({ contractId, signature }: { contractId: string; signature: string }) => {
      const response = await fetch(`/api/contracts/${contractId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ signature })
      });
      if (!response.ok) throw new Error('Failed to sign contract');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setShowSignature(false);
      if (onContractSigned) onContractSigned();
    }
  });

  const latestContract = contracts?.[0];
  const contractHistory = contracts?.slice(1) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />\n  );
      case 'signed':
      case 'countersigned':
        return <UserCheck className="w-5 h-5 text-blue-600" />\n  );
      case 'sent':
      case 'viewed':
        return <Clock className="w-5 h-5 text-yellow-600" />\n  );
      default:
        return <FileText className="w-5 h-5 text-gray-400" />\n  );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Fully Executed';
      case 'countersigned':
        return 'Countersigned by Seller';
      case 'signed':
        return 'Signed by Buyer';
      case 'viewed':
        return 'Viewed';
      case 'sent':
        return 'Sent for Review';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contract Management</h2>
              <p className="text-gray-600 mt-1">
                Review and sign your property purchase contracts
              </p>
            </div>
            {!latestContract && (
              <button
                onClick={() => generateContract.mutate('sales_contract')}
                disabled={generateContract.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generateContract.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Generate Contract
              </button>
            )}
          </div>
        </div>

        {latestContract ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Contract Preview/Details */}
            <div className="lg:col-span-2">
              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contract Status</h3>
                <div className="flex items-center justify-between">
                  {['draft', 'sent', 'viewed', 'signed', 'completed'].map((stageindex: any) => {
                    const isActive = ['draft', 'sent', 'viewed', 'signed', 'countersigned', 'completed'].indexOf(latestContract.status) >= index;
                    return (
                      <div key={stage} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        {index <4 && (
                          <div className={`h-0.5 w-full mx-2 ${
                            isActive ? 'bg-blue-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">Draft</span>
                  <span className="text-xs text-gray-600">Sent</span>
                  <span className="text-xs text-gray-600">Viewed</span>
                  <span className="text-xs text-gray-600">Signed</span>
                  <span className="text-xs text-gray-600">Complete</span>
                </div>
              </div>

              {/* Contract Viewer */}
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Sales Contract v{latestContract.version}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(latestContract.fileUrl, '_blank')}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View full document"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = latestContract.signedFileUrl || latestContract.fileUrl;
                          link.download = `Contract_v${latestContract.version}.pdf`;
                          link.click();
                        }
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contract Preview Iframe */}
                <div className="h-[600px] w-full">
                  <iframe
                    src={`${latestContract.fileUrl}#view=FitH`}
                    className="w-full h-full border-0"
                    title="Contract Preview"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                {latestContract.status === 'sent' && (
                  <button
                    onClick={() => setShowSignature(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Sign Contract
                  </button>
                )}
                {latestContract.status === 'draft' && (
                  <button
                    onClick={() => sendContract.mutate(latestContract.id)}
                    disabled={sendContract.isPending}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sendContract.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Send for Signature
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contract Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Contract Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(latestContract.status)}
                      <span className="font-medium">{getStatusText(latestContract.status)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {new Date(latestContract.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {latestContract.sentAt && (
                    <div>
                      <p className="text-sm text-gray-600">Sent</p>
                      <p className="font-medium">
                        {new Date(latestContract.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {latestContract.signedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Signed</p>
                      <p className="font-medium">
                        {new Date(latestContract.signedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Signatures</h3>
                <div className="space-y-3">
                  {latestContract.signatures.map((sigindex: any) => (
                    <div key={index} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{sig.party}</p>
                        <p className="text-xs text-gray-600">{sig.name}</p>
                      </div>
                      {sig.signedAt ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Version History */}
              {contractHistory.length> 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Version History</h3>
                  <div className="space-y-2">
                    {contractHistory.map((contract: Contract) => (
                      <button
                        key={contract.id}
                        onClick={() => setSelectedContract(contract)}
                        className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Version {contract.version}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(contract.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <History className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Important</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Please review the contract carefully before signing. 
                      Consider seeking legal advice if you have any questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // No Contract State
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contract Generated</h3>
            <p className="text-gray-600 mb-6">
              A sales contract will be generated once your reservation is confirmed and KYC is complete.
            </p>
          </div>
        )}
      </div>

      {/* eSignature Modal */}
      {showSignature && latestContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Electronic Signature</h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                By signing below, you acknowledge that you have read, understood, and agree to 
                be bound by the terms and conditions set forth in this sales contract.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type your full legal name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Secure Digital Signature</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Your signature will be encrypted and legally binding. 
                    IP address and timestamp will be recorded.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSignature(false)}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // In real implementation, capture the signature
                  signContract.mutate({
                    contractId: latestContract.id,
                    signature: 'digital-signature-data'
                  });
                }
                disabled={signContract.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {signContract.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Sign Contract
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}