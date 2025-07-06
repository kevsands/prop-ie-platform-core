"use client";

import React, { useState, useEffect } from 'react';
import { Filter, Download, Plus, Edit2, Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import type { IconBaseProps } from 'react-icons';
import { Button } from '@/components/ui/button';

// Define TypeScript interfaces
interface SalesRecord {
  id: string;
  unitNumber: string;
  customer: string;
  email: string;
  phone: string;
  status: string;
  bookingDeposit: number;
  contractDeposit: number;
  price: number;
  nextAction: string;
  nextActionDue: Date;
}

interface FilterState {
  status: string;
  nextActionDue: string;
  depositStatus: string;
  unitNumber: string;
}

// Mock data generator for sales records
const generateMockSales = (): SalesRecord[] => {
  const statuses = ['Inquiry', 'Viewing Booked', 'Reserved', 'Sale Agreed', 'Contracts Signed', 'Closed'];
  const nextActions = ['Follow up call', 'Arrange viewing', 'Collect booking deposit', 'Send contracts', 'Chase signed contracts', 'Arrange closing'];
  
  const sales: SalesRecord[] = [];
  
  // Generate 30 sales records
  for (let i = 1; i <= 30; i++) {
    // Determine status
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    
    // Determine next action based on status
    let nextActionIndex = statusIndex;
    if (status !== 'Closed') {
      nextActionIndex = Math.min(statusIndex + 1, nextActions.length - 1);
    }
    const nextAction = status === 'Closed' ? 'None' : nextActions[nextActionIndex];
    
    // Generate due date for next action (between now and 30 days from now)
    const daysToAdd = Math.floor(Math.random() * 30);
    const nextActionDue = new Date();
    nextActionDue.setDate(nextActionDue.getDate() + daysToAdd);
    
    // Generate unit number (01-97)
    const unitNum = Math.floor(Math.random() * 97) + 1;
    const unitNumber = unitNum <= 9 ? `0${unitNum}` : `${unitNum}`;
    
    // Generate price (250k-450k)
    const price = 250000 + Math.floor(Math.random() * 200000);
    
    // Determine deposits based on status
    const bookingDeposit = status === 'Inquiry' || status === 'Viewing Booked' ? 0 : Math.round(price * 0.015);
    const contractDeposit = status === 'Inquiry' || status === 'Viewing Booked' || status === 'Reserved' ? 0 : Math.round(price * 0.045);
    
    // Generate customer details
    const firstNames = ['John', 'Mary', 'James', 'Sarah', 'Michael', 'Emma', 'David', 'Laura'];
    const lastNames = ['Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'Smith', 'Jones', 'Ryan', 'O\'Brien'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const customer = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = `+353 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 9000000) + 1000000}`;
    
    sales.push({
      id: `sale-${i}`,
      unitNumber,
      customer,
      email,
      phone,
      status,
      bookingDeposit,
      contractDeposit,
      price,
      nextAction,
      nextActionDue
    });
  }
  
  return sales;
};

export default function FitzgeraldGardensSales() {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [filteredSales, setFilteredSales] = useState<SalesRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    nextActionDue: 'all',
    depositStatus: 'all',
    unitNumber: ''
  });
  
  useEffect(() => {
    // In a real app, this would fetch from API
    const mockSales = generateMockSales();
    setSales(mockSales);
    setFilteredSales(mockSales);
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = [...sales];
    
    if (filters.status !== 'all') {
      result = result.filter(sale => sale.status === filters.status);
    }
    
    if (filters.nextActionDue !== 'all') {
      const now = new Date();
      if (filters.nextActionDue === 'overdue') {
        result = result.filter(sale => sale.nextActionDue < now);
      } else if (filters.nextActionDue === 'today') {
        result = result.filter(sale => {
          const dueDate = new Date(sale.nextActionDue);
          return dueDate.toDateString() === now.toDateString();
        });
      } else if (filters.nextActionDue === 'week') {
        const weekLater = new Date();
        weekLater.setDate(now.getDate() + 7);
        result = result.filter(sale => {
          return sale.nextActionDue >= now && sale.nextActionDue <= weekLater;
        });
      }
    }
    
    if (filters.depositStatus !== 'all') {
      if (filters.depositStatus === 'booking-received') {
        result = result.filter(sale => sale.bookingDeposit > 0);
      } else if (filters.depositStatus === 'contract-received') {
        result = result.filter(sale => sale.contractDeposit > 0);
      } else if (filters.depositStatus === 'no-deposits') {
        result = result.filter(sale => sale.bookingDeposit === 0 && sale.contractDeposit === 0);
      }
    }
    
    if (filters.unitNumber) {
      result = result.filter(sale => 
        sale.unitNumber.toLowerCase().includes(filters.unitNumber.toLowerCase())
      );
    }
    
    setFilteredSales(result);
  }, [filters, sales]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Unit', 'Customer', 'Email', 'Phone', 'Status', 'Booking Deposit', 'Contract Deposit', 'Price', 'Next Action', 'Next Action Due'];
    const rows = filteredSales.map(sale => [
      sale.unitNumber,
      sale.customer,
      sale.email,
      sale.phone,
      sale.status,
      sale.bookingDeposit,
      sale.contractDeposit,
      sale.price,
      sale.nextAction,
      sale.nextActionDue.toISOString().split('T')[0]
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fitzgerald_gardens_sales.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Format currency helper function
  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };
  
  // Format date helper function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get style for action due date
  const getActionDueStyle = (date: Date) => {
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return 'text-red-600 font-bold';
    } else if (daysDiff < 3) {
      return 'text-orange-500 font-bold';
    } else {
      return 'text-gray-700';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2B5273]">Fitzgerald Gardens - Sales Pipeline</h1>
          <p className="text-gray-600">Manage and track all sales activities</p>
        </div>
        <div className="flex space-x-3">
          <Button size="sm" variant="outline" onClick={exportToCSV}>
            <span>
              <Download className="mr-2 h-4 w-4" />
            </span>
            Export Sales
          </Button>
          <Link 
            href="/developer/projects/fitzgerald-gardens/sales/new" 
            className="px-4 py-2 flex items-center bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
          >
            <span>
              <Plus className="mr-2 h-4 w-4" />
            </span>
            New Sale
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <span className="text-[#2B5273] mr-2">
            <span>
              <Filter className="h-4 w-4" />
            </span>
          </span>
          <h2 className="text-lg font-semibold">Filter Sales</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Statuses</option>
              <option value="Inquiry">Inquiry</option>
              <option value="Viewing Booked">Viewing Booked</option>
              <option value="Reserved">Reserved</option>
              <option value="Sale Agreed">Sale Agreed</option>
              <option value="Contracts Signed">Contracts Signed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Action Due</label>
            <select
              name="nextActionDue"
              value={filters.nextActionDue}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Actions</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due Today</option>
              <option value="week">Due This Week</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Status</label>
            <select
              name="depositStatus"
              value={filters.depositStatus}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Deposit Statuses</option>
              <option value="booking-received">Booking Deposit Received</option>
              <option value="contract-received">Contract Deposit Received</option>
              <option value="no-deposits">No Deposits Received</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
            <input
              type="text"
              name="unitNumber"
              value={filters.unitNumber}
              onChange={handleFilterChange}
              placeholder="Search by unit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            />
          </div>
        </div>
      </div>
      
      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Deposit</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Deposit</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.unitNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.customer}</div>
                    <div className="text-sm text-gray-500">{sale.email} · {sale.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${sale.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                      sale.status === 'Contracts Signed' ? 'bg-blue-100 text-blue-800' : 
                      sale.status === 'Sale Agreed' ? 'bg-purple-100 text-purple-800' : 
                      sale.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sale.bookingDeposit > 0 ? (
                      <span className="text-green-600 font-medium">{formatCurrency(sale.bookingDeposit)}</span>
                    ) : (
                      <span className="text-gray-400">Not Received</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sale.contractDeposit > 0 ? (
                      <span className="text-green-600 font-medium">{formatCurrency(sale.contractDeposit)}</span>
                    ) : (
                      <span className="text-gray-400">Not Received</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sale.nextAction !== 'None' ? (
                      <>
                        <div className="text-sm font-medium">{sale.nextAction}</div>
                        <div className={`text-sm flex items-center ${getActionDueStyle(sale.nextActionDue)}`}>
                          <span className="mr-1">
                            <span>
                              <Clock className="h-4 w-4" />
                            </span>
                          </span> {formatDate(sale.nextActionDue)}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">No action needed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/developer/projects/fitzgerald-gardens/sales/${sale.id}`} className="text-[#2B5273] hover:text-[#1E3142]">
                        <span>
                          <span>
                            <Eye className="h-4 w-4" />
                          </span>
                        </span>
                      </Link>
                      <Link href={`/developer/projects/fitzgerald-gardens/sales/${sale.id}/edit`} className="text-[#2B5273] hover:text-[#1E3142]">
                        <span>
                          <span>
                            <Edit2 className="h-4 w-4" />
                          </span>
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredSales.length}</span> of <span className="font-medium">{sales.length}</span> sales
          </div>
        </div>
      </div>
    </div>
  );
}