'use client';

// components/sales/DepositTracker.tsx
import React from 'react';
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

interface DepositTrackerProps {
  unitPrice: number;
  bookingDeposit: {
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    dueDate: string;
    paidDate?: string;
  };
  contractDeposit: {
    amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'not-due';
    dueDate: string;
    paidDate?: string;
  };
  balance: {
    amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'not-due';
    dueDate: string;
    paidDate?: string;
  };
  onRequestPayment?: (type: 'booking' | 'contract' | 'balance') => void;
}

const DepositTracker: React.FC<DepositTrackerProps> = ({ 
  unitPrice, 
  bookingDeposit, 
  contractDeposit, 
  balance,
  onRequestPayment
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      case 'not-due':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return FiCheckCircle({ className: "h-5 w-5 text-green-600" });
      case 'pending':
        return FiClock({ className: "h-5 w-5 text-yellow-600" });
      case 'overdue':
        return FiAlertCircle({ className: "h-5 w-5 text-red-600" });
      case 'not-due':
        return FiClock({ className: "h-5 w-5 text-gray-400" });
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Schedule</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            {getStatusIcon(bookingDeposit.status)}
            <div className="ml-3">
              <h4 className="font-medium">Booking Deposit</h4>
              <p className={`text-sm ${getStatusColor(bookingDeposit.status)}`}>
                {bookingDeposit.status === 'paid'
                  ? `Paid on ${formatDate(bookingDeposit.paidDate!)}`
                  : bookingDeposit.status === 'overdue'
                    ? `Overdue since ${formatDate(bookingDeposit.dueDate)}`
                    : `Due by ${formatDate(bookingDeposit.dueDate)}`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(bookingDeposit.amount)}</p>
            {bookingDeposit.status === 'pending' && onRequestPayment && (
              <button
                onClick={() => onRequestPayment('booking')}
                className="text-sm text-[#2B5273] hover:underline"
              >
                Request Payment
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            {getStatusIcon(contractDeposit.status)}
            <div className="ml-3">
              <h4 className="font-medium">Contract Deposit</h4>
              <p className={`text-sm ${getStatusColor(contractDeposit.status)}`}>
                {contractDeposit.status === 'paid'
                  ? `Paid on ${formatDate(contractDeposit.paidDate!)}`
                  : contractDeposit.status === 'overdue'
                    ? `Overdue since ${formatDate(contractDeposit.dueDate)}`
                    : contractDeposit.status === 'not-due'
                      ? 'Not yet due'
                      : `Due by ${formatDate(contractDeposit.dueDate)}`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(contractDeposit.amount)}</p>
            {contractDeposit.status === 'pending' && onRequestPayment && (
              <button
                onClick={() => onRequestPayment('contract')}
                className="text-sm text-[#2B5273] hover:underline"
              >
                Request Payment
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon(balance.status)}
            <div className="ml-3">
              <h4 className="font-medium">Balance</h4>
              <p className={`text-sm ${getStatusColor(balance.status)}`}>
                {balance.status === 'paid'
                  ? `Paid on ${formatDate(balance.paidDate!)}`
                  : balance.status === 'overdue'
                    ? `Overdue since ${formatDate(balance.dueDate)}`
                    : balance.status === 'not-due'
                      ? 'Due at completion'
                      : `Due by ${formatDate(balance.dueDate)}`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(balance.amount)}</p>
            {balance.status === 'pending' && onRequestPayment && (
              <button
                onClick={() => onRequestPayment('balance')}
                className="text-sm text-[#2B5273] hover:underline"
              >
                Request Payment
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
        <span className="font-medium">Total Purchase Price:</span>
        <span className="font-bold text-lg">{formatCurrency(unitPrice)}</span>
      </div>
    </div>
  );
};

export default DepositTracker;