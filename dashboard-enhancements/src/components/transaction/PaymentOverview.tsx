'use client';

import React, { useState } from 'react';
import { Transaction, TransactionPayment } from '@/context/TransactionContext';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  CalendarIcon,
  InfoIcon,
  DownloadIcon,
  ReceiptIcon,
  RefreshCwIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { format } from 'date-fns';

interface PaymentOverviewProps {
  transaction: Transaction;
  userRole?: string;
  className?: string;
}

interface PaymentFormData {
  amount: string;
  method: 'bank_transfer' | 'credit_card' | 'debit_card';
  reference: string;
  notes: string;
}

export const PaymentOverview: React.FC<PaymentOverviewProps> = ({ 
  transaction, 
  userRole,
  className = "" 
}) => {
  const { user } = useAuth();
  const { updatePaymentStatus } = useTransaction();
  const { toast } = useToast();
  
  const [selectedPayment, setSelectedPayment] = useState<TransactionPayment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    amount: '',
    method: 'bank_transfer',
    reference: '',
    notes: ''
  });

  // Calculate payment statistics
  const calculatePaymentStats = () => {
    const totalAmount = transaction.totalAmount;
    const paidAmount = transaction.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = transaction.payments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = totalAmount - paidAmount;
    const progressPercentage = (paidAmount / totalAmount) * 100;

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      remainingAmount,
      progressPercentage
    };
  };

  const stats = calculatePaymentStats();

  // Get payment status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get payment type display name
  const getPaymentTypeDisplayName = (type: string) => {
    switch (type) {
      case 'BOOKING_DEPOSIT':
        return 'Booking Deposit';
      case 'CONTRACT_DEPOSIT':
        return 'Contract Deposit';
      case 'STAGE_PAYMENT':
        return 'Stage Payment';
      case 'FINAL_PAYMENT':
        return 'Final Payment';
      default:
        return type;
    }
  };

  // Get payment type icon
  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_DEPOSIT':
      case 'CONTRACT_DEPOSIT':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'STAGE_PAYMENT':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'FINAL_PAYMENT':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <CreditCardIcon className="h-4 w-4" />;
    }
  };

  // Check if user can make payments
  const canMakePayments = () => {
    if (!user || !userRole) return false;
    return userRole === 'BUYER';
  };

  // Check if user can process payments
  const canProcessPayments = () => {
    if (!user || !userRole) return false;
    return userRole === 'DEVELOPER' || userRole === 'AGENT';
  };

  // Handle making a payment
  const handleMakePayment = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status
      await updatePaymentStatus(
        transaction.id, 
        selectedPayment.id, 
        'PROCESSING'
      );

      toast({
        title: "Payment initiated",
        description: "Your payment is being processed. You will be notified once it's complete.",
      });

      setIsPaymentDialogOpen(false);
      setSelectedPayment(null);
      setPaymentForm({
        amount: '',
        method: 'bank_transfer',
        reference: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle confirming a payment
  const handleConfirmPayment = async (paymentId: string) => {
    try {
      await updatePaymentStatus(transaction.id, paymentId, 'COMPLETED');
      
      toast({
        title: "Payment confirmed",
        description: "The payment has been marked as completed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle downloading receipt
  const handleDownloadReceipt = (payment: TransactionPayment) => {
    // TODO: Implement receipt generation and download
    toast({
      title: "Coming soon",
      description: "Receipt download functionality will be available soon.",
    });
  };

  // Get next payment due
  const getNextPaymentDue = () => {
    return transaction.payments
      .filter(p => p.status === 'PENDING')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  };

  const nextPayment = getNextPaymentDue();

  return (
    <div className={className}>
      {/* Payment Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Payment Progress</span>
              <span>{Math.round(stats.progressPercentage)}% Complete</span>
            </div>
            <Progress value={stats.progressPercentage} className="h-3" />
          </div>

          {/* Payment Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-semibold">€{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-xl font-semibold text-green-600">
                €{stats.paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-yellow-600">
                €{stats.pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-xl font-semibold text-blue-600">
                €{stats.remainingAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Next Payment Alert */}
          {nextPayment && (
            <Alert className="mt-6">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Next payment of <strong>€{nextPayment.amount.toLocaleString()}</strong> ({getPaymentTypeDisplayName(nextPayment.type)}) is due on{' '}
                <strong>{format(new Date(nextPayment.dueDate), 'MMMM d, yyyy')}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentTypeIcon(payment.type)}
                      <span>{getPaymentTypeDisplayName(payment.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    €{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.reference || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.status === 'PENDING' && canMakePayments() && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsPaymentDialogOpen(true);
                          }}
                        >
                          Pay Now
                        </Button>
                      )}
                      
                      {payment.status === 'PROCESSING' && canProcessPayments() && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfirmPayment(payment.id)}
                        >
                          Confirm
                        </Button>
                      )}
                      
                      {payment.status === 'COMPLETED' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadReceipt(payment)}
                        >
                          <ReceiptIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Complete your payment for {selectedPayment && getPaymentTypeDisplayName(selectedPayment.type)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              {/* Payment Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Amount Due</p>
                    <p className="font-semibold text-lg">
                      €{selectedPayment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold">
                      {format(new Date(selectedPayment.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paymentForm.method}
                  onValueChange={(v) => setPaymentForm({ ...paymentForm, method: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <BanknotesIcon className="h-4 w-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                    <SelectItem value="credit_card">
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4" />
                        Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="debit_card">
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4" />
                        Debit Card
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Transfer Details */}
              {paymentForm.method === 'bank_transfer' && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Bank Transfer Details:</strong><br />
                    Bank: Allied Irish Banks<br />
                    Account Name: Prop.ie Limited<br />
                    IBAN: IE12 BOFI 9000 0112 3456 78<br />
                    BIC: BOFIIE2D<br />
                    Reference: {transaction.reference}
                  </AlertDescription>
                </Alert>
              )}

              {/* Reference */}
              <div className="space-y-2">
                <Label>Payment Reference</Label>
                <Input
                  placeholder="Enter payment reference"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any additional notes"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Security Notice */}
              <Alert>
                <ShieldCheckIcon className="h-4 w-4" />
                <AlertDescription>
                  Your payment information is secure and encrypted. All transactions are processed through our secure payment gateway.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMakePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentOverview;