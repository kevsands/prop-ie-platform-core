'use client';

import { useState } from 'react';
import { CreditCard, Building, Plus, ChevronRight, Check, AlertCircle, Lock, Calendar, User, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  bank?: string;
  isDefault: boolean;
  isVerified: boolean;
  brand?: string;
  createdAt: Date;
}

export default function PaymentMethodsPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Personal Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      isVerified: true,
      brand: 'Visa',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'bank',
      name: 'AIB Current Account',
      last4: '6789',
      bank: 'AIB',
      isDefault: false,
      isVerified: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'card',
      name: 'Business Card',
      last4: '1234',
      expiryMonth: 6,
      expiryYear: 2024,
      isDefault: false,
      isVerified: false,
      brand: 'Mastercard',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ]);
  
  const getCardIcon = (brand: string) => {
    // In a real app, you'd have actual card brand icons
    return <CreditCard className="h-8 w-8 text-gray-600" />;
  };
  
  const setDefaultMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };
  
  const deleteMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.filter(method => method.id !== id)
    );
    setSelectedMethod(null);
  };
  
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-600 mt-1">Manage your payment methods for deposits and purchases</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Card
            </button>
            <button
              onClick={() => setShowAddBank(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Bank Account
            </button>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Your payment information is secure</h3>
              <p className="text-sm text-blue-800 mt-1">
                All payment methods are encrypted and securely stored. We comply with PCI DSS standards 
                and never store full card numbers on our servers.
              </p>
            </div>
          </div>
        </div>
        
        {/* Payment Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {method.type === 'card' ? (
                    getCardIcon(method.brand || '')
                  ) : (
                    <Building className="h-8 w-8 text-gray-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">
                      {method.type === 'card' 
                        ? `•••• ${method.last4}` 
                        : `${method.bank} •••• ${method.last4}`
                      }
                    </p>
                  </div>
                </div>
                {method.isDefault && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Default
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {method.type === 'card' && method.expiryMonth && method.expiryYear && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {method.isVerified ? (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      Verification pending
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Added {format(method.createdAt, 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Card */}
          <button
            onClick={() => setShowAddCard(true)}
            className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">Add New Payment Method</span>
          </button>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Deposit - Unit 4B</p>
                  <p className="text-sm text-gray-600">Riverside Manor</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">€5,000</p>
                <p className="text-sm text-gray-600">Dec 10, 2023</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Verification Fee</p>
                  <p className="text-sm text-gray-600">Account verification</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">€25</p>
                <p className="text-sm text-gray-600">Dec 8, 2023</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Legal Fee Payment</p>
                  <p className="text-sm text-gray-600">O'Brien & Associates</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">€450</p>
                <p className="text-sm text-gray-600">Dec 5, 2023</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Method Detail */}
        {selectedMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Payment Method Details</h2>
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  {selectedMethod.type === 'card' ? (
                    getCardIcon(selectedMethod.brand || '')
                  ) : (
                    <Building className="h-12 w-12 text-gray-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMethod.name}</h3>
                    <p className="text-gray-600">
                      {selectedMethod.type === 'card' 
                        ? `${selectedMethod.brand} •••• ${selectedMethod.last4}` 
                        : `${selectedMethod.bank} •••• ${selectedMethod.last4}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  {selectedMethod.type === 'card' && selectedMethod.expiryMonth && selectedMethod.expiryYear && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expiry Date</span>
                      <span className="font-medium text-gray-900">
                        {selectedMethod.expiryMonth}/{selectedMethod.expiryYear}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-gray-900">
                      {selectedMethod.isVerified ? 'Verified' : 'Verification Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Added</span>
                    <span className="font-medium text-gray-900">
                      {format(selectedMethod.createdAt, 'MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Default Method</span>
                    <span className="font-medium text-gray-900">
                      {selectedMethod.isDefault ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {!selectedMethod.isDefault && (
                    <button
                      onClick={() => {
                        setDefaultMethod(selectedMethod.id);
                        setSelectedMethod(null);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteMethod(selectedMethod.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}