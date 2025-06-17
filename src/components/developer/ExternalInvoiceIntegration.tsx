'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Users, 
  Building2, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface ExternalTeam {
  id: string;
  name: string;
  type: 'contractor' | 'consultant' | 'supplier' | 'vendor';
  email: string;
  phone?: string;
  address?: string;
  vatNumber?: string;
  paymentTerms: number;
  preferredMethod: string;
  status: 'active' | 'inactive';
  totalInvoices: number;
  totalAmount: number;
  avgPaymentDays: number;
}

interface ExternalInvoiceIntegrationProps {
  onAddExternalInvoice: (invoiceData: any) => void;
}

const EXTERNAL_TEAMS: ExternalTeam[] = [
  {
    id: 'ext-1',
    name: 'McCarthy Construction Ltd',
    type: 'contractor',
    email: 'invoices@mccarthyconstruction.ie',
    phone: '+353 1 234 5678',
    address: '123 Construction Avenue, Dublin 4',
    vatNumber: 'IE9876543Z',
    paymentTerms: 30,
    preferredMethod: 'BANK_TRANSFER',
    status: 'active',
    totalInvoices: 25,
    totalAmount: 2850000,
    avgPaymentDays: 28
  },
  {
    id: 'ext-2',
    name: 'Dublin City Council',
    type: 'vendor',
    email: 'developmentlevies@dublincity.ie',
    phone: '+353 1 222 2222',
    address: 'Civic Offices, Wood Quay, Dublin 8',
    vatNumber: 'IE1111111A',
    paymentTerms: 14,
    preferredMethod: 'GOVERNMENT_PORTAL',
    status: 'active',
    totalInvoices: 15,
    totalAmount: 675000,
    avgPaymentDays: 12
  },
  {
    id: 'ext-3',
    name: 'O\'Sullivan & Associates Architects',
    type: 'consultant',
    email: 'billing@osullivan-arch.ie',
    phone: '+353 1 555 5555',
    address: '45 Georgian Square, Dublin 2',
    vatNumber: 'IE3333333C',
    paymentTerms: 30,
    preferredMethod: 'BANK_TRANSFER',
    status: 'active',
    totalInvoices: 12,
    totalAmount: 485000,
    avgPaymentDays: 25
  },
  {
    id: 'ext-4',
    name: 'Green Energy Solutions Ltd',
    type: 'supplier',
    email: 'accounts@greenenergy.ie',
    phone: '+353 1 777 7777',
    address: '88 Innovation Park, Dublin 12',
    vatNumber: 'IE4444444D',
    paymentTerms: 21,
    preferredMethod: 'BANK_TRANSFER',
    status: 'active',
    totalInvoices: 8,
    totalAmount: 125000,
    avgPaymentDays: 19
  }
];

export default function ExternalInvoiceIntegration({ onAddExternalInvoice }: ExternalInvoiceIntegrationProps) {
  const [selectedTeam, setSelectedTeam] = useState<ExternalTeam | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTeams = EXTERNAL_TEAMS.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || team.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contractor': return 'bg-blue-100 text-blue-800';
      case 'consultant': return 'bg-green-100 text-green-800';
      case 'supplier': return 'bg-purple-100 text-purple-800';
      case 'vendor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (avgDays: number, terms: number) => {
    if (avgDays <= terms * 0.8) return <CheckCircle className="text-green-500" size={16} />;
    if (avgDays <= terms) return <Clock className="text-yellow-500" size={16} />;
    return <AlertCircle className="text-red-500" size={16} />;
  };

  const handleCreateInvoiceFromTeam = (team: ExternalTeam) => {
    const invoiceData = {
      type: 'PAYABLE',
      clientName: team.name,
      clientEmail: team.email,
      clientAddress: team.address,
      description: `${team.type.charAt(0).toUpperCase() + team.type.slice(1)} services`,
      dueDate: new Date(Date.now() + team.paymentTerms * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: team.preferredMethod,
      taxRate: team.vatNumber ? 23 : 0,
      termsConditions: `Payment due within ${team.paymentTerms} days of invoice date.`,
      notes: `VAT Number: ${team.vatNumber || 'Not applicable'}`
    };
    
    onAddExternalInvoice(invoiceData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="mr-2 text-blue-600" size={20} />
            External Team Invoice Management
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Manage invoices from contractors, consultants, suppliers, and vendors
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Upload size={16} className="mr-2" />
          Upload Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search external teams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="contractor">Contractors</option>
            <option value="consultant">Consultants</option>
            <option value="supplier">Suppliers</option>
            <option value="vendor">Vendors</option>
          </select>
        </div>
      </div>

      {/* External Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{team.name}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getTypeColor(team.type)}`}>
                    {team.type.charAt(0).toUpperCase() + team.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(team.avgPaymentDays, team.paymentTerms)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2" />
                {team.email}
              </div>
              {team.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-2" />
                  {team.phone}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Total Invoices:</span>
                <div className="font-medium">{team.totalInvoices}</div>
              </div>
              <div>
                <span className="text-gray-500">Total Amount:</span>
                <div className="font-medium">€{team.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Payment Terms:</span>
                <div className="font-medium">{team.paymentTerms} days</div>
              </div>
              <div>
                <span className="text-gray-500">Avg Payment:</span>
                <div className="font-medium">{team.avgPaymentDays} days</div>
              </div>
            </div>

            <button
              onClick={() => handleCreateInvoiceFromTeam(team)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              Create Invoice
            </button>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No external teams found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Upload External Invoice</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-2">Drop invoice files here or click to browse</p>
              <p className="text-sm text-gray-500">Supports PDF, PNG, JPG formats</p>
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}