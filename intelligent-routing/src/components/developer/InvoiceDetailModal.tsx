'use client';

import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Save, 
  FileText, 
  User, 
  Building2, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  CreditCard,
  Download,
  Send,
  Trash2
} from 'lucide-react';
import { Invoice } from '@/hooks/useInvoices';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Invoice>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRecordPayment: (invoiceId: string, paymentData: any) => Promise<void>;
}

export default function InvoiceDetailModal({ 
  invoice, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  onRecordPayment 
}: InvoiceDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editData, setEditData] = useState<Partial<Invoice>>({});
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });

  React.useEffect(() => {
    if (invoice) {
      setEditData({
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        description: invoice.description,
        dueDate: invoice.dueDate.split('T')[0],
        notes: invoice.notes,
        status: invoice.status
      });
      
      // Set payment amount to remaining balance
      const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const remaining = invoice.totalAmount - totalPaid;
      setPaymentData(prev => ({ ...prev, amount: remaining }));
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid': return 'text-green-700 bg-green-50 border-green-200';
      case 'sent': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'overdue': return 'text-red-700 bg-red-50 border-red-200';
      case 'draft': return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      case 'partially_paid': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid': return <CheckCircle size={16} />;
      case 'sent': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      case 'draft': return <Edit3 size={16} />;
      case 'cancelled': return <Trash2 size={16} />;
      case 'partially_paid': return <Clock size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(invoice.id, editData);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      setLoading(true);
      try {
        await onDelete(invoice.id);
        onClose();
      } catch (error) {
        alert('Failed to delete invoice');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRecordPayment = async () => {
    setLoading(true);
    try {
      await onRecordPayment(invoice.id, {
        ...paymentData,
        recordedBy: 'current-user-id'
      });
      setShowPaymentForm(false);
      setPaymentData({
        amount: 0,
        paymentMethod: 'BANK_TRANSFER',
        paymentDate: new Date().toISOString().split('T')[0],
        reference: '',
        notes: ''
      });
    } catch (error) {
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remainingBalance = invoice.totalAmount - totalPaid;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <FileText className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{invoice.number}</h2>
              <p className="text-sm text-gray-500">{invoice.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Send size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Invoice Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Client/Vendor</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.clientName || ''}
                        onChange={(e) => setEditData({...editData, clientName: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="mr-2 text-gray-400" size={16} />
                        <span className="font-medium">{invoice.clientName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Project</label>
                    <div className="flex items-center">
                      <Building2 className="mr-2 text-blue-400" size={16} />
                      <span>{invoice.project?.name || invoice.development?.name || 'No Project'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.dueDate || ''}
                        onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-gray-400" size={16} />
                        <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        value={editData.status || invoice.status}
                        onChange={(e) => setEditData({...editData, status: e.target.value as any})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="PARTIALLY_PAID">Partially Paid</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status.toLowerCase().replace('_', ' ')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">Notes</label>
                    <textarea
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({...editData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Line Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Qty</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Unit Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems?.map((item, index) => (
                        <tr key={item.id || index} className="border-t">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{item.description}</div>
                              {item.category && (
                                <div className="text-sm text-gray-500">{item.category}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">€{item.unitPrice.toLocaleString()}</td>
                          <td className="py-3 px-4 font-medium">€{item.lineTotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">€{invoice.subtotal.toLocaleString()}</span>
                    </div>
                    {invoice.taxAmount && invoice.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                        <span className="font-medium">€{invoice.taxAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">€{invoice.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Total:</span>
                    <span className="font-medium">€{invoice.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-600">€{totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Balance Due:</span>
                    <span className={remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                      €{remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                {remainingBalance > 0 && !isEditing && (
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <CreditCard size={18} className="mr-2" />
                    Record Payment
                  </button>
                )}
              </div>

              {/* Payment History */}
              {invoice.payments && invoice.payments.length > 0 && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
                  <div className="space-y-3">
                    {invoice.payments.map((payment, index) => (
                      <div key={payment.id || index} className="border-b last:border-b-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">€{payment.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                            {payment.reference && (
                              <div className="text-xs text-gray-400">Ref: {payment.reference}</div>
                            )}
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">Record Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                    max={remainingBalance}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="CASH">Cash</option>
                    <option value="CHECK">Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <input
                    type="text"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Transaction reference or check number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Additional notes about this payment"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRecordPayment}
                  disabled={loading || paymentData.amount <= 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Recording...' : 'Record Payment'}
                </button>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}