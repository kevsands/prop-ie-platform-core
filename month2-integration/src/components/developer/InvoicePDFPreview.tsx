'use client';

import React from 'react';
import { 
  FileText, 
  Download, 
  Eye,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Euro
} from 'lucide-react';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  category?: string;
}

interface Invoice {
  number: string;
  type: 'RECEIVABLE' | 'PAYABLE';
  status: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  description: string;
  notes?: string;
  termsConditions?: string;
  lineItems?: InvoiceLineItem[];
}

interface InvoicePDFPreviewProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoicePDFPreview({ invoice, isOpen, onClose }: InvoicePDFPreviewProps) {
  if (!isOpen) return null;

  const companyInfo = {
    name: 'PROP.ie Development Solutions',
    address: '123 Property Street, Dublin 2, Ireland',
    phone: '+353 1 234 5678',
    email: 'finance@prop.ie',
    vat: 'IE1234567T',
    company: 'Company No: 12345'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('PDF download functionality would be implemented here');
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center">
            <FileText className="mr-3 text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
              <p className="text-gray-600">{invoice.number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <Eye size={18} className="mr-2" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download size={18} className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="p-8 overflow-y-auto max-h-[80vh] bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Company Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-blue-600 mb-2">{companyInfo.name}</h1>
                <div className="text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {companyInfo.address}
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    {companyInfo.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    {companyInfo.email}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {invoice.type === 'RECEIVABLE' ? 'INVOICE' : 'BILL'}
                </h2>
                <div className="text-gray-600">
                  <div>{companyInfo.vat}</div>
                  <div>{companyInfo.company}</div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {invoice.type === 'RECEIVABLE' ? 'Bill To:' : 'Bill From:'}
                </h3>
                <div className="text-gray-700 space-y-1">
                  <div className="font-medium">{invoice.clientName}</div>
                  {invoice.clientAddress && <div>{invoice.clientAddress}</div>}
                  {invoice.clientEmail && (
                    <div className="flex items-center">
                      <Mail size={14} className="mr-2" />
                      {invoice.clientEmail}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-medium">{invoice.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusClasses(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {invoice.description && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Description:</h3>
                <p className="text-gray-700">{invoice.description}</p>
              </div>
            )}

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-20">Qty</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold w-32">Unit Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold w-32">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems?.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-3">
                        <div>{item.description}</div>
                        {item.category && (
                          <div className="text-sm text-gray-500">{item.category}</div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right">€{item.unitPrice.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-medium">€{item.lineTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">€{invoice.subtotal.toLocaleString()}</span>
                  </div>
                  {invoice.taxRate && invoice.taxRate > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">VAT ({invoice.taxRate}%):</span>
                      <span className="font-medium">€{(invoice.taxAmount || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between py-2">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-lg font-bold text-blue-600">€{invoice.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            {invoice.termsConditions && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h3>
                <p className="text-gray-700 text-sm">{invoice.termsConditions}</p>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
                <p className="text-gray-700 text-sm">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
              <p>Thank you for your business!</p>
              <p className="mt-1">For questions about this invoice, please contact {companyInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}