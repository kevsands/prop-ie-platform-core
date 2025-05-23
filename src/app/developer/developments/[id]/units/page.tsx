'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Upload, 
  MoreHorizontal,
  ChevronLeft,
  ChevronDown,
  Home,
  Search,
  X,
  CheckCircle,
  Clock,
  CircleDollarSign
} from 'lucide-react';

interface UnitType {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  priceFrom: number;
}

interface Unit {
  id: string;
  unitNumber: string;
  block?: string;
  floor: number;
  status: string;
  currentPrice: number;
  orientation?: string;
  aspect?: string;
  viewType?: string;
  balconyArea?: number;
  terraceArea?: number;
  gardenArea?: number;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  customizationDeadline?: string;
  floorplanVariation?: string;
  features: string[];
  unitType: UnitType;
  unitTypeId: string;
  reservations: Reservation[];
  sales: Sale[];
}

interface Reservation {
  id: string;
  status: string;
  reservationDate: string;
  expiryDate: string;
  buyerId: string;
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
}

interface Sale {
  id: string;
  saleDate: string;
  agreedPrice: number;
  buyerId: string;
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
}

interface DevelopmentData {
  id: string;
  name: string;
  totalUnits: number;
}

export default function UnitsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [unitssetUnits] = useState<Unit[]>([]);
  const [unitTypessetUnitTypes] = useState<UnitType[]>([]);
  const [developmentsetDevelopment] = useState<DevelopmentData | null>(null);
  const [loadingsetLoading] = useState(true);
  const [statusFiltersetStatusFilter] = useState<string>('');
  const [unitTypeFiltersetUnitTypeFilter] = useState<string>('');
  const [searchQuerysetSearchQuery] = useState<string>('');
  const [pagesetPage] = useState(1);
  const [totalPagessetTotalPages] = useState(1);
  const [showAddModalsetShowAddModal] = useState(false);
  const [showBulkModalsetShowBulkModal] = useState(false);
  const [unitStatusCountssetUnitStatusCounts] = useState({
    AVAILABLE: 0,
    RESERVED: 0,
    SALE_AGREED: 0,
    SOLD: 0,
    COMPLETED: 0,
    WITHDRAWN: 0,
    TOTAL: 0
  });

  // Fetch the units data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch development data
        const devResponse = await fetch(`/api/developer/developments/${params.id}`);
        const devData = await devResponse.json();

        if (devResponse.ok && devData.development) {
          setDevelopment({
            id: devData.development.id,
            name: devData.development.name,
            totalUnits: devData.development.totalUnits
          });
        } else {
          // Use mock data if API fails
          setDevelopment({
            id: params.id as string,
            name: "Fitzgerald Gardens",
            totalUnits: 97
          });
        }

        // Fetch units data
        let apiUrl = `/api/developer/developments/${params.id}/units?page=${page}`;
        if (statusFilter) apiUrl += `&status=${statusFilter}`;
        if (unitTypeFilter) apiUrl += `&unitType=${unitTypeFilter}`;

        const unitsResponse = await fetch(apiUrl);
        const unitsData = await unitsResponse.json();

        if (unitsResponse.ok && unitsData.units) {
          setUnits(unitsData.units);
          setUnitTypes(unitsData.unitTypes || []);
          setTotalPages(unitsData.pagination?.pageCount || 1);

          // If no real data, use mock data
          if (unitsData.units.length === 0) {
            generateMockUnits();
          }
        } else {
          // Use mock data
          generateMockUnits();
        }
      } catch (error) {

        generateMockUnits();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, statusFilter, unitTypeFilterpage]);

  // Generate mock units for testing
  const generateMockUnits = () => {
    const mockUnitTypes: UnitType[] = [
      { id: 'ut1', name: '2 Bedroom Apartment', bedrooms: 2, bathrooms: 1, area: 75, priceFrom: 325000 },
      { id: 'ut2', name: '3 Bedroom Semi-Detached', bedrooms: 3, bathrooms: 2.5, area: 110, priceFrom: 425000 },
      { id: 'ut3', name: '4 Bedroom Detached', bedrooms: 4, bathrooms: 3, area: 140, priceFrom: 525000 },
      { id: 'ut4', name: '2 Bedroom Duplex', bedrooms: 2, bathrooms: 2, area: 85, priceFrom: 365000 }
    ];

    const statuses = ['AVAILABLE', 'RESERVED', 'SALE_AGREED', 'SOLD', 'COMPLETED', 'WITHDRAWN'];
    const blocks = ['A', 'B', 'C', 'D'];
    const orientations = ['North', 'South', 'East', 'West'];
    const aspects = ['Front', 'Rear', 'Dual'];
    const viewTypes = ['Park', 'Street', 'Garden', 'Communal'];

    const mockUnits: Unit[] = [];
    const counts = {
      AVAILABLE: 0,
      RESERVED: 0,
      SALE_AGREED: 0,
      SOLD: 0,
      COMPLETED: 0,
      WITHDRAWN: 0,
      TOTAL: 0
    };

    // Generate 97 mock units
    for (let i = 1; i <= 97; i++) {
      const blockIndex = Math.floor((i - 1) / 25);
      const block = blocks[blockIndex];
      const floor = Math.floor((i - 1) % 25 / 5) + 1;
      const unitNumber = `${block}${floor}${((i - 1) % 5) + 1}`;

      // Determine unit type based on block and floor
      const unitTypeIndex = (blockIndex + floor) % mockUnitTypes.length;
      const unitType = mockUnitTypes[unitTypeIndex];

      // Determine status with distribution
      let status;
      if (i <= 40) {
        status = 'AVAILABLE';
      } else if (i <= 50) {
        status = 'RESERVED';
      } else if (i <= 60) {
        status = 'SALE_AGREED';
      } else if (i <= 90) {
        status = 'SOLD';
      } else if (i <= 95) {
        status = 'COMPLETED';
      } else {
        status = 'WITHDRAWN';
      }

      // Update counts
      counts[status]++;
      counts.TOTAL++;

      // Calculate price with some variation
      const priceVariation = (Math.random() * 0.1) - 0.05; // -5% to +5%
      const currentPrice = Math.round(unitType.priceFrom * (1 + priceVariation));

      // Generate reservations and sales if applicable
      const reservations = [];
      const sales = [];

      if (status === 'RESERVED' || status === 'SALE_AGREED') {
        reservations.push({
          id: `res${i}`,
          status: 'ACTIVE',
          reservationDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
          expiryDate: new Date(Date.now() + Math.random() * 30 * 86400000).toISOString(),
          buyerId: `buyer${i}`,
          buyer: {
            id: `buyer${i}`,
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            phone: `0851234${i.toString().padStart(3, '0')}`
          }
        });
      }

      if (status === 'SOLD' || status === 'COMPLETED') {
        sales.push({
          id: `sale${i}`,
          saleDate: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
          agreedPrice: currentPrice,
          buyerId: `buyer${i}`,
          buyer: {
            id: `buyer${i}`,
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            phone: `0851234${i.toString().padStart(3, '0')}`
          }
        });
      }

      mockUnits.push({
        id: `unit${i}`,
        unitNumber,
        block,
        floor,
        status,
        currentPrice,
        orientation: orientations[Math.floor(Math.random() * orientations.length)],
        aspect: aspects[Math.floor(Math.random() * aspects.length)],
        viewType: viewTypes[Math.floor(Math.random() * viewTypes.length)],
        balconyArea: unitType.name.includes('Apartment') ? Math.round(Math.random() * 10) + 5 : undefined,
        terraceArea: unitType.name.includes('Duplex') ? Math.round(Math.random() * 15) + 10 : undefined,
        gardenArea: unitType.name.includes('Detached') || unitType.name.includes('Semi-Detached') ? Math.round(Math.random() * 50) + 50 : undefined,
        estimatedCompletionDate: new Date(Date.now() + (Math.random() * 365 + 180) * 86400000).toISOString(),
        actualCompletionDate: status === 'COMPLETED' ? new Date(Date.now() - Math.random() * 90 * 86400000).toISOString() : undefined,
        customizationDeadline: new Date(Date.now() + Math.random() * 60 * 86400000).toISOString(),
        floorplanVariation: Math.random() > 0.7 ? ['Standard', 'Mirror', 'Extended Kitchen', 'Open Plan'][Math.floor(Math.random() * 4)] : undefined,
        features: [],
        unitType,
        unitTypeId: unitType.id,
        reservations,
        sales
      });
    }

    setUnits(mockUnits);
    setUnitTypes(mockUnitTypes);
    setUnitStatusCounts(counts);
  };

  // Filter units by search query
  const filteredUnits = units.filter(unit => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      unit.unitNumber.toLowerCase().includes(query) ||
      (unit.block && unit.block.toLowerCase().includes(query)) ||
      unit.unitType.name.toLowerCase().includes(query) ||
      unit.status.toLowerCase().includes(query)
    );
  });

  // Handler for status filtering
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === statusFilter ? '' : status);
    setPage(1);
  };

  // Handler for unit type filtering
  const handleUnitTypeFilter = (unitTypeId: string) => {
    setUnitTypeFilter(unitTypeId === unitTypeFilter ? '' : unitTypeId);
    setPage(1);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SALE_AGREED':
        return 'bg-blue-100 text-blue-800';
      case 'SOLD':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-indigo-100 text-indigo-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5273] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading units...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/developer" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/developer/developments" className="hover:text-gray-700">Developments</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/developer/developments/${params.id}`} className="hover:text-gray-700">{development?.name || 'Development'}</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">Units</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Unit Management</h1>
                <p className="mt-2 text-gray-600">{development?.name} - {development?.totalUnits} Units</p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowBulkModal(true)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Bulk Add
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]"
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Units</p>
                    <p className="text-2xl font-bold text-gray-900">{unitStatusCounts.TOTAL}</p>
                  </div>
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Available</p>
                    <p className="text-2xl font-bold text-green-700">{unitStatusCounts.AVAILABLE}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Reserved</p>
                    <p className="text-2xl font-bold text-yellow-700">{unitStatusCounts.RESERVED}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Sale Agreed</p>
                    <p className="text-2xl font-bold text-blue-700">{unitStatusCounts.SALE_AGREED}</p>
                  </div>
                  <CircleDollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Sold</p>
                    <p className="text-2xl font-bold text-purple-700">{unitStatusCounts.SOLD + unitStatusCounts.COMPLETED}</p>
                  </div>
                  <CircleDollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Withdrawn</p>
                    <p className="text-2xl font-bold text-gray-900">{unitStatusCounts.WITHDRAWN}</p>
                  </div>
                  <X className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-3 text-gray-900 flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filter by Status
              </h3>
              <div className="space-y-2">
                {['AVAILABLE', 'RESERVED', 'SALE_AGREED', 'SOLD', 'COMPLETED', 'WITHDRAWN'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      statusFilter === status
                        ? 'bg-[#2B5273] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {status.replace('_', ' ')}
                    <span className="ml-2 text-xs">({unitStatusCounts[status] || 0})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-3 text-gray-900 flex items-center">
                <Home className="h-4 w-4 mr-2" /> Filter by Unit Type
              </h3>
              <div className="space-y-2">
                {unitTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleUnitTypeFilter(type.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      unitTypeFilter === type.id
                        ? 'bg-[#2B5273] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by unit number, block, or type..."
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <button 
                  onClick={() => {
                    setStatusFilter('');
                    setUnitTypeFilter('');
                    setSearchQuery('');
                  }
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                >
                  Clear All Filters
                </button>
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
                  Export Units <Download className="h-3 w-3 inline ml-1" />
                </button>
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
                  Print List
                </button>
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUnits.map((unit: any) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{unit.unitNumber}</div>
                      <div className="text-sm text-gray-500">
                        {unit.block && <span>Block {unit.block}</span>}
                        {unit.block && unit.floor && <span> • </span>}
                        {unit.floor && <span>Floor {unit.floor}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{unit.unitType.name}</div>
                      <div className="text-xs text-gray-500">
                        {unit.unitType.bedrooms} bed • {unit.unitType.bathrooms} bath • {unit.unitType.area}m²
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(unit.status)}`}>
                        {unit.status.replace('_', ' ')}
                      </span>
                      {unit.reservations.length> 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Reserved: {new Date(unit.reservations[0].reservationDate).toLocaleDateString()}
                        </div>
                      )}
                      {unit.sales.length> 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Sold: {new Date(unit.sales[0].saleDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">€{unit.currentPrice.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{unit.orientation} facing</div>
                      {unit.viewType && <div>{unit.viewType} view</div>}
                      {unit.balconyArea && <div>Balcony: {unit.balconyArea}m²</div>}
                      {unit.terraceArea && <div>Terrace: {unit.terraceArea}m²</div>}
                      {unit.gardenArea && <div>Garden: {unit.gardenArea}m²</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/developer/developments/${params.id}/units/${unit.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button className="text-[#2B5273] hover:text-[#1e3347]">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages> 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                        page === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {Array.from({ length: Math.min(5totalPages) }, (_i: any) => {
                      const pageNumber = page <= 3 
                        ? i + 1 
                        : page>= totalPages - 2 
                          ? totalPages - 4 + i 
                          : page - 2 + i;

                      return pageNumber <= totalPages ? (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === pageNumber
                              ? 'z-10 bg-[#2B5273] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5273]'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ) : null;
                    })}

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                        page === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Unit Modal - This would be a complete form in a real implementation */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Unit</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., A101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]">
                    <option value="">Select Unit Type</option>
                    {unitTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]">
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="SALE_AGREED">Sale Agreed</option>
                    <option value="SOLD">Sold</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., 325000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]">
                    <option value="">Select Orientation</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]">
                    <option value="">Select View Type</option>
                    <option value="Park">Park</option>
                    <option value="Street">Street</option>
                    <option value="Garden">Garden</option>
                    <option value="Communal">Communal</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('In a real implementation, this would save the unit.');
                    setShowAddModal(false);
                  }
                  className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]"
                >
                  Add Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bulk Add Units</h2>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Add multiple units at once by filling out the form below.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]">
                    <option value="">Select Unit Type</option>
                    {unitTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Range</label>
                  <div className="flex space-x-2">
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      placeholder="From"
                    />
                    <span className="flex items-center">to</span>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      placeholder="To"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Units Per Floor</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., 5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (€)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., 325000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Increment Per Floor (%)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="E.g., 2"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('In a real implementation, this would add multiple units.');
                    setShowBulkModal(false);
                  }
                  className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]"
                >
                  Generate Units
                </button>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium">Or upload a CSV file</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Download a template CSV file and upload your completed data.
                </p>
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs text-[#2B5273] hover:underline">
                    <Download className="h-3 w-3 inline mr-1" />
                    Download Template
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-xs text-[#2B5273] hover:underline">
                    <Upload className="h-3 w-3 inline mr-1" />
                    Upload CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}