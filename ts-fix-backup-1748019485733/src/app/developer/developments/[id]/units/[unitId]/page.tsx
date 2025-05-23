'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Edit, 
  Download,
  Save,
  X,
  Clock,
  Calendar,
  Home,
  User,
  Phone,
  Mail,
  CircleDollarSign,
  Check,
  AlertTriangle,
  FileText,
  Trash,
  Plus,
  Upload,
  Share,
  BuildingIcon,
  Compass,
  Ruler
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
  depositAmount: number;
  depositPaid: boolean;
  depositPaidDate?: string;
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
  deposit: {
    amount: number;
    paid: boolean;
    date?: string;
  };
  contractSigned: boolean;
  contractSignedDate?: string;
  completionDate?: string;
  keysHandedOver: boolean;
  handoverDate?: string;
  buyerId: string;
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  solicitor?: string;
  mortgageProvider?: string;
  mortgageApproved: boolean;
  stampDutyPaid: boolean;
  htbUsed: boolean;
  htbAmount?: number;
}

interface Development {
  id: string;
  name: string;
}

export default function UnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [unitsetUnit] = useState<Unit | null>(null);
  const [unitTypessetUnitTypes] = useState<UnitType[]>([]);
  const [developmentsetDevelopment] = useState<Development | null>(null);
  const [loadingsetLoading] = useState(true);
  const [activeTabsetActiveTab] = useState('details');
  const [isEditingsetIsEditing] = useState(false);

  // Form values
  const [formValuessetFormValues] = useState({
    unitNumber: '',
    block: '',
    floor: 0,
    status: '',
    currentPrice: 0,
    orientation: '',
    aspect: '',
    viewType: '',
    balconyArea: '',
    terraceArea: '',
    gardenArea: '',
    estimatedCompletionDate: '',
    customizationDeadline: '',
    unitTypeId: '',
    features: [] as string[]
  });

  // Fetch unit data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch unit data from API
        // In a real app, this would be an API call
        // For now, we'll generate mock data
        generateMockData();
      } catch (error) {

        generateMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.unitId]);

  // Generate mock data
  const generateMockData = () => {
    // Mock unit types
    const mockUnitTypes: UnitType[] = [
      { id: 'ut1', name: '2 Bedroom Apartment', bedrooms: 2, bathrooms: 1, area: 75, priceFrom: 325000 },
      { id: 'ut2', name: '3 Bedroom Semi-Detached', bedrooms: 3, bathrooms: 2.5, area: 110, priceFrom: 425000 },
      { id: 'ut3', name: '4 Bedroom Detached', bedrooms: 4, bathrooms: 3, area: 140, priceFrom: 525000 },
      { id: 'ut4', name: '2 Bedroom Duplex', bedrooms: 2, bathrooms: 2, area: 85, priceFrom: 365000 }
    ];

    // Parse unit number from the unitId parameter
    const unitNumber = String(params.unitId).replace('unit', '');
    const unitIndex = parseInt(unitNumber);

    // Determine block and floor based on unit number
    const blockIndex = Math.floor((unitIndex - 1) / 25);
    const blocks = ['A', 'B', 'C', 'D'];
    const block = blocks[blockIndex % blocks.length];
    const floor = Math.floor((unitIndex - 1) % 25 / 5) + 1;
    const unitNum = `${block}${floor}${((unitIndex - 1) % 5) + 1}`;

    // Determine unit type
    const unitTypeIndex = (blockIndex + floor) % mockUnitTypes.length;
    const unitType = mockUnitTypes[unitTypeIndex];

    // Determine status based on unit number
    let status;
    if (unitIndex <= 40) {
      status = 'AVAILABLE';
    } else if (unitIndex <= 50) {
      status = 'RESERVED';
    } else if (unitIndex <= 60) {
      status = 'SALE_AGREED';
    } else if (unitIndex <= 90) {
      status = 'SOLD';
    } else if (unitIndex <= 95) {
      status = 'COMPLETED';
    } else {
      status = 'WITHDRAWN';
    }

    // Calculate price with variation
    const priceVariation = (Math.random() * 0.1) - 0.05; // -5% to +5%
    const currentPrice = Math.round(unitType.priceFrom * (1 + priceVariation));

    // Generate reservations and sales if applicable
    const reservations = [];
    const sales = [];

    if (status === 'RESERVED' || status === 'SALE_AGREED') {
      reservations.push({
        id: `res${unitIndex}`,
        status: 'ACTIVE',
        reservationDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
        expiryDate: new Date(Date.now() + Math.random() * 30 * 86400000).toISOString(),
        depositAmount: Math.round(currentPrice * 0.05), // 5% deposit
        depositPaid: Math.random() > 0.5,
        depositPaidDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 20 * 86400000).toISOString() : undefined,
        buyerId: `buyer${unitIndex}`,
        buyer: {
          id: `buyer${unitIndex}`,
          name: `John Doe ${unitIndex}`,
          email: `johndoe${unitIndex}@example.com`,
          phone: `0851234${unitIndex.toString().padStart(3, '0')}`
        }
      });
    }

    if (status === 'SOLD' || status === 'COMPLETED') {
      sales.push({
        id: `sale${unitIndex}`,
        saleDate: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
        agreedPrice: currentPrice,
        deposit: {
          amount: Math.round(currentPrice * 0.1), // 10% deposit
          paid: true,
          date: new Date(Date.now() - Math.random() * 150 * 86400000).toISOString()
        },
        contractSigned: true,
        contractSignedDate: new Date(Date.now() - Math.random() * 120 * 86400000).toISOString(),
        completionDate: status === 'COMPLETED' ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() : undefined,
        keysHandedOver: status === 'COMPLETED',
        handoverDate: status === 'COMPLETED' ? new Date(Date.now() - Math.random() * 20 * 86400000).toISOString() : undefined,
        buyerId: `buyer${unitIndex}`,
        buyer: {
          id: `buyer${unitIndex}`,
          name: `Jane Smith ${unitIndex}`,
          email: `janesmith${unitIndex}@example.com`,
          phone: `0861234${unitIndex.toString().padStart(3, '0')}`
        },
        solicitor: 'Smith & Jones Solicitors',
        mortgageProvider: 'Irish National Bank',
        mortgageApproved: true,
        stampDutyPaid: status === 'COMPLETED',
        htbUsed: Math.random() > 0.7,
        htbAmount: Math.random() > 0.7 ? Math.round(currentPrice * 0.05) : undefined
      });
    }

    // Features
    const features = [];
    if (Math.random() > 0.5) features.push('South-facing garden');
    if (Math.random() > 0.6) features.push('Premium kitchen finishes');
    if (Math.random() > 0.7) features.push('Built-in wardrobes');
    if (Math.random() > 0.8) features.push('Premium bathroom fixtures');

    // Orientation options
    const orientations = ['North', 'South', 'East', 'West'];
    const aspects = ['Front', 'Rear', 'Dual'];
    const viewTypes = ['Park', 'Street', 'Garden', 'Communal'];

    // Create the unit
    const mockUnit: Unit = {
      id: `unit${unitIndex}`,
      unitNumber: unitNum,
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
      features,
      unitType,
      unitTypeId: unitType.id,
      reservations,
      sales
    };

    // Set state
    setUnit(mockUnit);
    setUnitTypes(mockUnitTypes);
    setDevelopment({
      id: params.id as string,
      name: 'Fitzgerald Gardens'
    });

    // Set form values
    setFormValues({
      unitNumber: mockUnit.unitNumber,
      block: mockUnit.block || '',
      floor: mockUnit.floor,
      status: mockUnit.status,
      currentPrice: mockUnit.currentPrice,
      orientation: mockUnit.orientation || '',
      aspect: mockUnit.aspect || '',
      viewType: mockUnit.viewType || '',
      balconyArea: mockUnit.balconyArea?.toString() || '',
      terraceArea: mockUnit.terraceArea?.toString() || '',
      gardenArea: mockUnit.gardenArea?.toString() || '',
      estimatedCompletionDate: mockUnit.estimatedCompletionDate ? new Date(mockUnit.estimatedCompletionDate).toISOString().split('T')[0] : '',
      customizationDeadline: mockUnit.customizationDeadline ? new Date(mockUnit.customizationDeadline).toISOString().split('T')[0] : '',
      unitTypeId: mockUnit.unitTypeId,
      features: mockUnit.features
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would be an API call to update the unit

    // Update the unit data locally for now
    if (unit) {
      const updatedUnit = {
        ...unit,
        unitNumber: formValues.unitNumber,
        block: formValues.block,
        floor: parseInt(formValues.floor.toString()),
        status: formValues.status,
        currentPrice: parseInt(formValues.currentPrice.toString()),
        orientation: formValues.orientation,
        aspect: formValues.aspect,
        viewType: formValues.viewType,
        balconyArea: formValues.balconyArea ? parseFloat(formValues.balconyArea) : undefined,
        terraceArea: formValues.terraceArea ? parseFloat(formValues.terraceArea) : undefined,
        gardenArea: formValues.gardenArea ? parseFloat(formValues.gardenArea) : undefined,
        estimatedCompletionDate: formValues.estimatedCompletionDate ? new Date(formValues.estimatedCompletionDate).toISOString() : undefined,
        customizationDeadline: formValues.customizationDeadline ? new Date(formValues.customizationDeadline).toISOString() : undefined,
        unitTypeId: formValues.unitTypeId,
        features: formValues.features
      };

      setUnit(updatedUnit);
    }

    setIsEditing(false);
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
          <p className="mt-4 text-gray-600">Loading unit details...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Unit not found</p>
          <Link href={`/developer/developments/${params.id}/units`} className="mt-4 text-[#2B5273] hover:underline">
            Back to Units
          </Link>
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
              <Link href={`/developer/developments/${params.id}`} className="hover:text-gray-700">
                {development?.name || 'Development'}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/developer/developments/${params.id}/units`} className="hover:text-gray-700">Units</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">Unit {unit.unitNumber}</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Unit {unit.unitNumber}</h1>
                <p className="mt-2 text-gray-600">
                  {unit.unitType.name} • 
                  {unit.block && ` Block ${unit.block} •`} 
                  {` Floor ${unit.floor}`}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(unit.status)}`}>
                    {unit.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2 inline" />
                      Edit Unit
                    </button>
                    <button 
                      className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]"
                    >
                      <Share className="h-4 w-4 mr-2 inline" />
                      Share Unit
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2 inline" />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]"
                    >
                      <Save className="h-4 w-4 mr-2 inline" />
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['details', 'reservations', 'sales', 'documents', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-[#2B5273] text-[#2B5273]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Unit Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                      <input
                        type="text"
                        name="unitNumber"
                        value={formValues.unitNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                      <input
                        type="text"
                        name="block"
                        value={formValues.block}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                      <input
                        type="number"
                        name="floor"
                        value={formValues.floor}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formValues.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="SALE_AGREED">Sale Agreed</option>
                        <option value="SOLD">Sold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                      <select
                        name="unitTypeId"
                        value={formValues.unitTypeId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      >
                        {unitTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                      <input
                        type="number"
                        name="currentPrice"
                        value={formValues.currentPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Unit Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                      <select
                        name="orientation"
                        value={formValues.orientation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      >
                        <option value="">Select orientation</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aspect</label>
                      <select
                        name="aspect"
                        value={formValues.aspect}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      >
                        <option value="">Select aspect</option>
                        <option value="Front">Front</option>
                        <option value="Rear">Rear</option>
                        <option value="Dual">Dual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                      <select
                        name="viewType"
                        value={formValues.viewType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      >
                        <option value="">Select view type</option>
                        <option value="Park">Park</option>
                        <option value="Street">Street</option>
                        <option value="Garden">Garden</option>
                        <option value="Communal">Communal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Balcony Area (m²)</label>
                      <input
                        type="number"
                        name="balconyArea"
                        value={formValues.balconyArea}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Terrace Area (m²)</label>
                      <input
                        type="number"
                        name="terraceArea"
                        value={formValues.terraceArea}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Garden Area (m²)</label>
                      <input
                        type="number"
                        name="gardenArea"
                        value={formValues.gardenArea}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Dates & Deadlines</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion Date</label>
                      <input
                        type="date"
                        name="estimatedCompletionDate"
                        value={formValues.estimatedCompletionDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customization Deadline</label>
                      <input
                        type="date"
                        name="customizationDeadline"
                        value={formValues.customizationDeadline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Features</h2>
                  <div className="space-y-2">
                    {/* This would be more robust in a real implementation */}
                    <textarea
                      name="features"
                      value={formValues.features.join('\n')}
                      onChange={(e) => setFormValues({...formValues, features: e.target.value.split('\n').filter(f => f.trim() !== '')})}
                      placeholder="Enter features, one per line"
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    />
                    <p className="text-sm text-gray-500">Enter one feature per line</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Unit Info Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Unit Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Unit Details</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start">
                            <Home className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Unit {unit.unitNumber}</p>
                              <p className="text-sm text-gray-600">
                                {unit.block && `Block ${unit.block}`}
                                {unit.block && unit.floor && ' • '}
                                {`Floor ${unit.floor}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <BuildingIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{unit.unitType.name}</p>
                              <p className="text-sm text-gray-600">
                                {unit.unitType.bedrooms} bed • {unit.unitType.bathrooms} bath • {unit.unitType.area}m²
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CircleDollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">€{unit.currentPrice.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(unit.status)}`}>
                                  {unit.status.replace('_', ' ')}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Unit Specifications</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start">
                            <Compass className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Orientation & View</p>
                              <p className="text-sm text-gray-600">
                                {unit.orientation || 'Not specified'} facing
                                {unit.viewType && ` • ${unit.viewType} view`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Ruler className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Additional Areas</p>
                              <p className="text-sm text-gray-600">
                                {unit.balconyArea && `Balcony: ${unit.balconyArea}m²`}
                                {unit.terraceArea && (unit.balconyArea ? ' • ' : '') + `Terrace: ${unit.terraceArea}m²`}
                                {unit.gardenArea && ((unit.balconyArea || unit.terraceArea) ? ' • ' : '') + `Garden: ${unit.gardenArea}m²`}
                                {!unit.balconyArea && !unit.terraceArea && !unit.gardenArea && 'None'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Home className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Floorplan Variation</p>
                              <p className="text-sm text-gray-600">
                                {unit.floorplanVariation || 'Standard'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Dates & Deadlines</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Completion Date</p>
                              <p className="text-sm text-gray-600">
                                {unit.actualCompletionDate 
                                  ? new Date(unit.actualCompletionDate).toLocaleDateString() + ' (Actual)'
                                  : unit.estimatedCompletionDate 
                                    ? new Date(unit.estimatedCompletionDate).toLocaleDateString() + ' (Estimated)'
                                    : 'Not set'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Customization Deadline</p>
                              <p className="text-sm text-gray-600">
                                {unit.customizationDeadline 
                                  ? new Date(unit.customizationDeadline).toLocaleDateString()
                                  : 'Not set'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floorplan */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Floorplan</h2>
                      <div className="flex space-x-2">
                        <button className="text-sm text-[#2B5273] hover:underline">
                          <Download className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                        <button className="text-sm text-[#2B5273] hover:underline">
                          <Upload className="h-4 w-4 inline mr-1" />
                          Upload New
                        </button>
                      </div>
                    </div>

                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      {/* This would be an actual image in a real implementation */}
                      <div className="text-center">
                        <BuildingIcon className="h-16 w-16 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500 text-sm">No floorplan uploaded</p>
                        <button className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <Upload className="h-4 w-4 inline mr-1" />
                          Upload Floorplan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Features</h2>
                      <button className="text-sm text-[#2B5273] hover:underline">
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add Feature
                      </button>
                    </div>

                    {unit.features.length> 0 ? (
                      <ul className="space-y-2">
                        {unit.features.map((featureindex) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No features specified</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Reservations</h2>
                  <button 
                    disabled={unit.status === 'SOLD' || unit.status === 'COMPLETED'}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      unit.status === 'SOLD' || unit.status === 'COMPLETED'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#2B5273] text-white hover:bg-[#1e3347]'
                    }`}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Create Reservation
                  </button>
                </div>

                {unit.reservations.length> 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deposit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expiry
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {unit.reservations.map((reservation) => (
                          <tr key={reservation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(reservation.reservationDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{reservation.buyer.name}</div>
                              <div className="text-sm text-gray-500">{reservation.buyer.email}</div>
                              <div className="text-sm text-gray-500">{reservation.buyer.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
                                {reservation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="text-sm font-medium text-gray-900">€{reservation.depositAmount.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">
                                {reservation.depositPaid 
                                  ? `Paid on ${reservation.depositPaidDate ? new Date(reservation.depositPaidDate).toLocaleDateString() : 'N/A'}`
                                  : 'Not paid'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(reservation.expiryDate).toLocaleDateString()}
                              {new Date(reservation.expiryDate) <new Date() && (
                                <span className="ml-2 text-red-500">Expired</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-[#2B5273] hover:text-[#1e3347] mr-4">
                                View
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This unit currently has no active reservations.
                    </p>
                    {unit.status === 'AVAILABLE' && (
                      <div className="mt-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2B5273] hover:bg-[#1e3347]"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Create Reservation
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Sales</h2>
                  <button 
                    disabled={unit.status !== 'RESERVED' && unit.status !== 'SALE_AGREED'}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      unit.status !== 'RESERVED' && unit.status !== 'SALE_AGREED'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#2B5273] text-white hover:bg-[#1e3347]'
                    }`}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Create Sale
                  </button>
                </div>

                {unit.sales.length> 0 ? (
                  <div className="space-y-8">
                    {unit.sales.map((sale) => (
                      <div key={sale.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-medium text-gray-900">
                              Sale from {new Date(sale.saleDate).toLocaleDateString()}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sale.keysHandedOver ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {sale.keysHandedOver ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>

                        <div className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Buyer Details */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Buyer Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-start">
                                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{sale.buyer.name}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-600">{sale.buyer.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-600">{sale.buyer.phone}</p>
                                  </div>
                                </div>
                                {sale.solicitor && (
                                  <div className="flex items-start">
                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Solicitor</p>
                                      <p className="text-sm text-gray-600">{sale.solicitor}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Financial Details */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Financial Details</h4>
                              <div className="space-y-3">
                                <div className="flex items-start">
                                  <CircleDollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Sale Price</p>
                                    <p className="text-sm text-gray-600">€{sale.agreedPrice.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <CircleDollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Deposit</p>
                                    <p className="text-sm text-gray-600">
                                      €{sale.deposit.amount.toLocaleString()}
                                      {sale.deposit.paid ? 
                                        ` (Paid on ${sale.deposit.date ? new Date(sale.deposit.date).toLocaleDateString() : 'N/A'})` :
                                        ' (Not paid)'}
                                    </p>
                                  </div>
                                </div>
                                {sale.mortgageProvider && (
                                  <div className="flex items-start">
                                    <Home className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Mortgage</p>
                                      <p className="text-sm text-gray-600">
                                        {sale.mortgageProvider}
                                        {sale.mortgageApproved && ' (Approved)'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {sale.htbUsed && (
                                  <div className="flex items-start">
                                    <CircleDollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Help to Buy</p>
                                      <p className="text-sm text-gray-600">
                                        €{sale.htbAmount?.toLocaleString() || 'TBC'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status & Timeline */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Status & Timeline</h4>
                              <div className="space-y-3">
                                <div className="flex items-start">
                                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Sale Date</p>
                                    <p className="text-sm text-gray-600">{new Date(sale.saleDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Contract</p>
                                    <p className="text-sm text-gray-600">
                                      {sale.contractSigned ? 
                                        `Signed on ${sale.contractSignedDate ? new Date(sale.contractSignedDate).toLocaleDateString() : 'N/A'}` :
                                        'Not signed'}
                                    </p>
                                  </div>
                                </div>
                                {sale.completionDate && (
                                  <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Completion</p>
                                      <p className="text-sm text-gray-600">{new Date(sale.completionDate).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                )}
                                {sale.keysHandedOver && (
                                  <div className="flex items-start">
                                    <Home className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">Keys Handed Over</p>
                                      <p className="text-sm text-gray-600">
                                        {sale.handoverDate ? new Date(sale.handoverDate).toLocaleDateString() : 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t">
                          <div className="flex justify-end space-x-3">
                            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <FileText className="h-4 w-4 inline mr-1" />
                              Documents
                            </button>
                            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                              <Edit className="h-4 w-4 inline mr-1" />
                              Edit
                            </button>
                            <button className="px-3 py-1.5 bg-[#2B5273] text-white rounded text-sm font-medium hover:bg-[#1e3347]">
                              Update Status
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                      <CircleDollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sales</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This unit currently has no sales records.
                    </p>
                    {(unit.status === 'RESERVED' || unit.status === 'SALE_AGREED') && (
                      <div className="mt-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2B5273] hover:bg-[#1e3347]"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Create Sale
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                  <button className="px-4 py-2 bg-[#2B5273] text-white rounded-md text-sm font-medium hover:bg-[#1e3347]">
                    <Plus className="h-4 w-4 inline mr-1" />
                    Upload Document
                  </button>
                </div>

                <div className="text-center py-16">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no documents associated with this unit.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2B5273] hover:bg-[#1e3347]"
                    >
                      <Upload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Upload Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Unit History</h2>

                <div className="flow-root">
                  <ul className="-mb-8">
                    <li>
                      <div className="relative pb-8">
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <CircleDollarSign className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Price updated to <span className="font-medium text-gray-900">€{unit.currentPrice.toLocaleString()}</span></p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              2 days ago
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <Check className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Status changed to <span className="font-medium text-gray-900">{unit.status.replace('_', ' ')}</span></p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              5 days ago
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center ring-8 ring-white">
                              <Edit className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Unit details updated</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              2 weeks ago
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-[#2B5273] flex items-center justify-center ring-8 ring-white">
                              <Plus className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Unit created</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              1 month ago
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}