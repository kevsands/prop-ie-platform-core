'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  Eye,
  FileText,
  BarChart3,
  ArrowRight,
  Package,
  MapPin,
  Bed,
  Bath,
  Square,
  Calculator,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for Prop's three developments
const developments = [
  {
    id: 1,
    name: 'Fitzgerald Gardens',
    slug: 'fitzgerald-gardens',
    location: 'Drogheda, Co. Louth',
    totalUnits: 120,
    phases: 2,
    currentPhase: 2,
    completion: '2024',
    image: '/images/fitzgerald-gardens/hero.jpg',
    units: {
      1: { type: '1 Bed Apartment', total: 24, sold: 22, reserved: 2, available: 0, price: 285000 },
      2: { type: '2 Bed Apartment', total: 48, sold: 38, reserved: 6, available: 4, price: 385000 },
      3: { type: '3 Bed House', total: 36, sold: 12, reserved: 4, available: 20, price: 425000 },
      4: { type: '4 Bed House', total: 12, sold: 3, reserved: 1, available: 8, price: 495000 }
    }
  },
  {
    id: 2,
    name: 'Ellwood',
    slug: 'ellwood',
    location: 'Dublin 15',
    totalUnits: 65,
    phases: 1,
    currentPhase: 1,
    completion: '2024',
    image: '/images/ellwood/hero.jpg',
    units: {
      1: { type: '1 Bed Apartment', total: 10, sold: 10, reserved: 0, available: 0, price: 325000 },
      2: { type: '2 Bed Apartment', total: 25, sold: 20, reserved: 3, available: 2, price: 425000 },
      3: { type: '3 Bed Duplex', total: 20, sold: 8, reserved: 2, available: 10, price: 495000 },
      4: { type: '4 Bed House', total: 10, sold: 4, reserved: 0, available: 6, price: 595000 }
    }
  },
  {
    id: 3,
    name: 'Ballymakenny View',
    slug: 'ballymakenny-view',
    location: 'Drogheda, Co. Louth',
    totalUnits: 40,
    phases: 1,
    currentPhase: 1,
    completion: '2025',
    image: '/images/ballymakenny-view/hero.jpg',
    units: {
      2: { type: '2 Bed House', total: 15, sold: 1, reserved: 2, available: 12, price: 345000 },
      3: { type: '3 Bed House', total: 20, sold: 1, reserved: 1, available: 18, price: 395000 },
      4: { type: '4 Bed House', total: 5, sold: 0, reserved: 0, available: 5, price: 445000 }
    }
  }
];

// Schedule of Accommodation data
const scheduleOfAccommodation: Record<string, Record<string, any>> = {
  'Fitzgerald Gardens': {
    '1 Bed Apartment': {
      totalArea: 52,
      rooms: [
        { name: 'Living/Kitchen/Dining', area: 25.5 },
        { name: 'Master Bedroom', area: 14.2 },
        { name: 'Bathroom', area: 4.8 },
        { name: 'Hall', area: 3.5 },
        { name: 'Balcony', area: 4 }
      ]
    },
    '2 Bed Apartment': {
      totalArea: 75,
      rooms: [
        { name: 'Living/Kitchen/Dining', area: 32.5 },
        { name: 'Master Bedroom', area: 14.5 },
        { name: 'Bedroom 2', area: 11.8 },
        { name: 'Bathroom', area: 4.8 },
        { name: 'En-suite', area: 3.2 },
        { name: 'Hall', area: 5.2 },
        { name: 'Balcony', area: 5 }
      ]
    },
    '3 Bed House': {
      totalArea: 110,
      rooms: [
        { name: 'Living Room', area: 18.5 },
        { name: 'Kitchen/Dining', area: 24.2 },
        { name: 'Master Bedroom', area: 15.2 },
        { name: 'Bedroom 2', area: 12.5 },
        { name: 'Bedroom 3', area: 11.2 },
        { name: 'Bathroom', area: 5.2 },
        { name: 'En-suite', area: 3.8 },
        { name: 'Utility', area: 4.2 },
        { name: 'Hall', area: 8.5 },
        { name: 'Garden', area: 50 }
      ]
    },
    '4 Bed House': {
      totalArea: 145,
      rooms: [
        { name: 'Living Room', area: 22.5 },
        { name: 'Kitchen/Dining', area: 28.5 },
        { name: 'Master Bedroom', area: 18.2 },
        { name: 'Bedroom 2', area: 14.5 },
        { name: 'Bedroom 3', area: 12.8 },
        { name: 'Bedroom 4', area: 11.5 },
        { name: 'Bathroom', area: 5.8 },
        { name: 'En-suite', area: 4.5 },
        { name: 'Utility', area: 5.2 },
        { name: 'Hall', area: 10.5 },
        { name: 'Garden', area: 75 }
      ]
    }
  }
};

export default function PropDeveloperDashboard() {
  const [selectedDevelopmentsetSelectedDevelopment] = useState(developments[0]);
  const [selectedUnitTypesetSelectedUnitType] = useState('2 Bed Apartment');

  // Calculate totals
  const calculateTotals = () => {
    let totalUnits = 0;
    let soldUnits = 0;
    let reservedUnits = 0;
    let availableUnits = 0;
    let totalRevenue = 0;

    developments.forEach((dev: any) => {
      totalUnits += dev.totalUnits;
      Object.values(dev.units).forEach((unit: any) => {
        soldUnits += unit.sold;
        reservedUnits += unit.reserved;
        availableUnits += unit.available;
        totalRevenue += (unit.sold * unit.price);
      });
    });

    return { totalUnits, soldUnits, reservedUnits, availableUnits, totalRevenue };
  };

  const totals = calculateTotals();

  // Sales funnel data for selected development
  const getSalesFunnelData = (dev: any) => {
    const data = [];
    Object.entries(dev.units).forEach(([keyunit]: [stringany]) => {
      data.push({
        type: unit.type,
        total: unit.total,
        sold: unit.sold,
        reserved: unit.reserved,
        available: unit.available
      });
    });
    return data;
  };

  // Monthly sales data
  const monthlySalesData = [
    { month: 'Jan', fitzgeraldGardens: 8, ellwood: 6, ballymakenny: 0 },
    { month: 'Feb', fitzgeraldGardens: 12, ellwood: 8, ballymakenny: 1 },
    { month: 'Mar', fitzgeraldGardens: 15, ellwood: 10, ballymakenny: 1 },
    { month: 'Apr', fitzgeraldGardens: 10, ellwood: 7, ballymakenny: 2 },
    { month: 'May', fitzgeraldGardens: 18, ellwood: 12, ballymakenny: 0 },
    { month: 'Jun', fitzgeraldGardens: 12, ellwood: 9, ballymakenny: 1 }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prop Developer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Complete development management for Fitzgerald Gardens, Ellwood & Ballymakenny View
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            Public View
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              Across 3 developments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.soldUnits}</div>
            <Progress value={(totals.soldUnits / totals.totalUnits) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.reservedUnits}</div>
            <p className="text-xs text-muted-foreground">
              Pending contracts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.availableUnits}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(totals.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3" /> +22% YoY
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Developments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Our Developments</h2>
          <Link href="/developments">
            <Button variant="outline" size="sm">
              Explore Our Developments <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Development Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
        {developments.map((dev: any) => (
          <Card 
            key={dev.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDevelopment.id === dev.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedDevelopment(dev: any)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{dev.name}</CardTitle>
                  <CardDescription>{dev.location}</CardDescription>
                </div>
                <Badge>Phase {dev.currentPhase}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Unit breakdown */}
                <div className="space-y-2">
                  {Object.entries(dev.units).map(([keyunit]: [stringany]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm">{unit.type}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-xs">
                          {unit.sold} sold
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {unit.reserved} reserved
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {unit.available} available
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sales Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        ((Object.values(dev.units).reduce((acc: number, unit: any) => acc + unit.sold0) / 
                          dev.totalUnits) * 100)
                      )}%
                    </span>
                  </div>
                  <Progress 
                    value={
                      (Object.values(dev.units).reduce((acc: number, unit: any) => acc + unit.sold0) / 
                        dev.totalUnits) * 100
                    } 
                  />
                </div>

                <Link href={`/developments/${dev.slug}`}>
                  <Button className="w-full" variant="outline">
                    View Development
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Selected Development Details */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedDevelopment.name} - Detailed Analysis</CardTitle>
          <CardDescription>
            Unit availability, pricing, and schedule of accommodation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="units" className="space-y-4">
            <TabsList>
              <TabsTrigger value="units">Unit Availability</TabsTrigger>
              <TabsTrigger value="schedule">Schedule of Accommodation</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Matrix</TabsTrigger>
              <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
              <TabsTrigger value="buyers">Buyer Pipeline</TabsTrigger>
            </TabsList>

            <TabsContent value="units" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(selectedDevelopment.units).map(([keyunit]: [stringany]) => (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{unit.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="font-medium">{unit.total}</span>
                        </div>
                        <Progress 
                          value={(unit.sold / unit.total) * 100} 
                          className="h-2"
                        />
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold text-green-600">{unit.sold}</p>
                            <p className="text-xs text-gray-600">Sold</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-yellow-600">{unit.reserved}</p>
                            <p className="text-xs text-gray-600">Reserved</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-blue-600">{unit.available}</p>
                            <p className="text-xs text-gray-600">Available</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Interactive site plan placeholder */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Interactive Site Plan</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Interactive site plan showing unit availability
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click on units to view details and pricing
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="mb-4">
                <label className="text-sm font-medium">Select Unit Type</label>
                <select 
                  className="mt-1 w-full p-2 border rounded-md"
                  value={selectedUnitType}
                  onChange={(e) => setSelectedUnitType(e.target.value)}
                >
                  {Object.keys(scheduleOfAccommodation[selectedDevelopment.name] || {}).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {scheduleOfAccommodation[selectedDevelopment.name] && 
               scheduleOfAccommodation[selectedDevelopment.name][selectedUnitType] && (
                <div>
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">{selectedUnitType}</h4>
                    <p className="text-2xl font-bold">
                      {scheduleOfAccommodation[selectedDevelopment.name][selectedUnitType].totalArea} sq.m
                    </p>
                    <p className="text-sm text-gray-600">Total Area</p>
                  </div>

                  <div className="space-y-3">
                    {scheduleOfAccommodation[selectedDevelopment.name][selectedUnitType].rooms.map((room: any, index: number) => (
                      <div key={index: any} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Square className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{room.name}</span>
                        </div>
                        <span className="text-gray-600">{room.area} sq.m</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price/sq.m
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium (Top Floor)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Garden Premium
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(selectedDevelopment.units).map(([keyunit]: [stringany]) => {
                      const area = scheduleOfAccommodation[selectedDevelopment.name]?.[unit.type]?.totalArea || 0;
                      const pricePerSqm = area> 0 ? unit.price / area : 0;

                      return (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{unit.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">€{unit.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">€{Math.round(pricePerSqm).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">+€15,000</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {unit.type.includes('House') ? '+€10,000' : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Unit Sales Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getSalesFunnelData(selectedDevelopment)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sold" fill="#10B981" />
                        <Bar dataKey="reserved" fill="#F59E0B" />
                        <Bar dataKey="available" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="fitzgeraldGardens" stroke="#10B981" name="Fitzgerald Gardens" />
                        <Line type="monotone" dataKey="ellwood" stroke="#6366F1" name="Ellwood" />
                        <Line type="monotone" dataKey="ballymakenny" stroke="#F59E0B" name="Ballymakenny View" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="buyers" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { stage: 'Website Inquiries', count: 45, trend: '+12%', icon: Users },
                    { stage: 'Brochure Downloads', count: 128, trend: '+18%', icon: FileText },
                    { stage: 'Viewing Requests', count: 32, trend: '+8%', icon: Eye },
                    { stage: 'Viewings Completed', count: 24, trend: '+5%', icon: Calendar },
                    { stage: 'Offers Received', count: 15, trend: '+10%', icon: FileText },
                    { stage: 'Reservations', count: 8, trend: '+3%', icon: Clock }
                  ].map((item) => (
                    <Card key={item.stage}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{item.stage}</CardTitle>
                          <item.icon className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{item.count}</div>
                        <p className="text-xs text-green-600">{item.trend} from last month</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Buyer Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah O\'Connor', unit: 'Type B - 2 Bed Apartment', stage: 'Contract Signed', date: '2 hours ago' },
                        { name: 'Michael Murphy', unit: 'Type C - 3 Bed House', stage: 'Offer Accepted', date: '5 hours ago' },
                        { name: 'Emma Walsh', unit: 'Type A - 1 Bed Apartment', stage: 'Viewing Scheduled', date: '1 day ago' },
                        { name: 'James Kelly', unit: 'Type D - 4 Bed House', stage: 'Inquiry', date: '2 days ago' }
                      ].map((buyer, index: number) => (
                        <div key={index: any} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium">{buyer.name}</p>
                            <p className="text-sm text-gray-600">{buyer.unit}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{buyer.stage}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{buyer.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}