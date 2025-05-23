'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Home,
  Calculator,
  FileText,
  Download,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  UserCheck,
  Clock,
  AlertCircle,
  Calendar,
  Building,
  Mail,
  Phone,
  MessageSquare,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Settings,
  DollarSign,
  Activity,
  Target,
  Award,
  PieChart,
  LineChart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Share2,
  Globe,
  Zap,
  Shield,
  Database,
  RefreshCw,
  Smartphone,
  Monitor,
  CreditCard,
  Receipt,
  Briefcase,
  ChevronDown,
  MoreVertical,
  Send,
  Bell,
  Star,
  Tag,
  Bookmark,
  Archive,
  Trash2,
  Copy,
  Printer,
  Upload,
  Save,
  ExternalLink,
  Info,
  HelpCircle,
  LogOut,
  BarChart,
  Grid,
  List,
  Columns,
  SortAsc,
  SortDesc,
  Percent,
  Hash,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  UserX,
  CheckSquare,
  Square,
  Circle,
  CircleDot,
  Layers,
  Layout,
  Maximize2,
  Minimize2,
  Move,
  Paperclip,
  Link2,
  Unlink,
  Image,
  FileImage,
  Camera,
  Video,
  Mic,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryLow,
  Power,
  Plug,
  Moon,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplet,
  Thermometer,
  Compass,
  Map,
  Navigation,
  Crosshair,
  Flag,
  Milestone,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Github,
  Gitlab,
  Code,
  Terminal,
  Command,
  Cloud,
  Server,
  HardDrive,
  Cpu,
  Zap as Lightning,
  Flame,
  Snowflake,
  Heart,
  HeartHandshake,
  Handshake,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MessagesSquare,
  Share,
  CornerUpRight,
  CornerDownRight,
  CornerUpLeft,
  CornerDownLeft,
  TrendingDown,
  Repeat,
  RotateCcw,
  RotateCw,
  Shuffle,
  Play,
  Pause,
  StopCircle,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Volume,
  VolumeX as Mute,
  Music,
  Radio,
  Podcast,
  Headphones,
  Airplay,
  Cast,
  Monitor as Screen,
  Tv,
  Speaker,
  Watch,
  Watch as Stopwatch,
  Timer,
  AlarmClock,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12
} from 'lucide-react';

// Mock data for demonstration
const salesMetrics = {
  totalUnits: 248,
  soldUnits: 186,
  reserved: 42,
  available: 20,
  averagePrice: 425000,
  totalRevenue: 79050000,
  conversionRate: 68.5,
  averageSaleTime: 42,
  monthlyTarget: 25,
  monthlySold: 22,
  weeklyInquiries: 186,
  viewingsScheduled: 64
};

const recentSales = [
  { id: 1, unit: 'A-1204', buyer: 'John Smith', price: 485000, date: '2024-03-15', status: 'Completed' },
  { id: 2, unit: 'B-0803', buyer: 'Sarah Johnson', price: 392000, date: '2024-03-14', status: 'In Progress' },
  { id: 3, unit: 'C-1501', buyer: 'Michael Chen', price: 625000, date: '2024-03-13', status: 'Completed' },
  { id: 4, unit: 'A-0605', buyer: 'Emma Thompson', price: 410000, date: '2024-03-12', status: 'Reserved' },
  { id: 5, unit: 'B-1102', buyer: 'David Wilson', price: 445000, date: '2024-03-11', status: 'In Progress' }
];

const inventoryData = [
  { block: 'Block A', total: 80, sold: 68, reserved: 8, available: 4 },
  { block: 'Block B', total: 96, sold: 72, reserved: 16, available: 8 },
  { block: 'Block C', total: 72, sold: 46, reserved: 18, available: 8 }
];

const buyersList = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+353 87 123 4567',
    status: 'Active',
    interestedIn: 'A-1204',
    stage: 'Contract Signed',
    lastContact: '2024-03-15',
    assignedTo: 'Emma Sales',
    source: 'Website',
    budget: '450-500k',
    notes: 'First-time buyer, pre-approved mortgage'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+353 86 234 5678',
    status: 'Active',
    interestedIn: 'B-0803',
    stage: 'Documentation',
    lastContact: '2024-03-14',
    assignedTo: 'Mike Sales',
    source: 'Referral',
    budget: '350-400k',
    notes: 'Cash buyer, looking for investment'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '+353 85 345 6789',
    status: 'Prospect',
    interestedIn: 'C-1501',
    stage: 'Viewing Scheduled',
    lastContact: '2024-03-13',
    assignedTo: 'Emma Sales',
    source: 'Walk-in',
    budget: '600-650k',
    notes: 'Trading up, needs to sell current property'
  }
];

const salesPipeline = [
  { stage: 'Initial Inquiry', count: 45, value: 18000000 },
  { stage: 'Viewing Scheduled', count: 28, value: 11200000 },
  { stage: 'Offer Made', count: 16, value: 6400000 },
  { stage: 'Documentation', count: 12, value: 4800000 },
  { stage: 'Contract Signed', count: 8, value: 3200000 },
  { stage: 'Completed', count: 186, value: 74400000 }
];

export default function SalesManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [dateRange, setDateRange] = useState('month');
  const [showNewBuyerModal, setShowNewBuyerModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12.5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">€{(salesMetrics.totalRevenue / 1000000).toFixed(1)}M</h3>
          <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +8.3%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{salesMetrics.soldUnits}</h3>
          <p className="text-sm text-gray-600 mt-1">Units Sold</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">{salesMetrics.reserved}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{salesMetrics.conversionRate}%</h3>
          <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {salesMetrics.monthlySold}/{salesMetrics.monthlyTarget}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{((salesMetrics.monthlySold / salesMetrics.monthlyTarget) * 100).toFixed(0)}%</h3>
          <p className="text-sm text-gray-600 mt-1">Monthly Target</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                dateRange === 'week' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                dateRange === 'month' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                dateRange === 'quarter' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Quarter
            </button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <LineChart className="w-8 h-8 text-gray-400" />
          <span className="ml-2 text-gray-500">Sales Chart Visualization</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-4">
            {recentSales.slice(0, 3).map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sale.unit}</p>
                    <p className="text-sm text-gray-600">{sale.buyer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">€{sale.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{sale.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="#" className="flex items-center justify-center mt-4 text-blue-600 hover:text-blue-700 font-medium">
            View All Sales
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Viewings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-600">Unit C-1501 • 2:00 PM</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lisa Brown</p>
                  <p className="text-sm text-gray-600">Unit A-0605 • 4:00 PM</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Robert Taylor</p>
                  <p className="text-sm text-gray-600">Unit B-1102 • 5:30 PM</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Link href="#" className="flex items-center justify-center mt-4 text-blue-600 hover:text-blue-700 font-medium">
            View Calendar
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Home className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{salesMetrics.totalUnits}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Units</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{salesMetrics.soldUnits}</h3>
          <p className="text-sm text-gray-600 mt-1">Sold</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{salesMetrics.reserved}</h3>
          <p className="text-sm text-gray-600 mt-1">Reserved</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{salesMetrics.available}</h3>
          <p className="text-sm text-gray-600 mt-1">Available</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search units..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Units</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inventory by Block */}
        <div className="space-y-4">
          {inventoryData.map(block => (
            <div key={block.block} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{block.block}</h4>
                <span className="text-sm text-gray-600">{block.total} units</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{block.sold}</div>
                  <div className="text-sm text-gray-600">Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{block.reserved}</div>
                  <div className="text-sm text-gray-600">Reserved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{block.available}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500" style={{ width: `${(block.sold / block.total) * 100}%` }}></div>
                    <div className="bg-yellow-500" style={{ width: `${(block.reserved / block.total) * 100}%` }}></div>
                    <div className="bg-blue-500" style={{ width: `${(block.available / block.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBuyers = () => (
    <div className="space-y-6">
      {/* Buyer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">324</h3>
          <p className="text-sm text-gray-600 mt-1">Total Leads</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">186</h3>
          <p className="text-sm text-gray-600 mt-1">Qualified Buyers</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">64</h3>
          <p className="text-sm text-gray-600 mt-1">Active Pipeline</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">16%</h3>
          <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
        </div>
      </div>

      {/* Buyers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Buyer Management</h3>
            <button
              onClick={() => setShowNewBuyerModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Buyer</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buyersList.map(buyer => (
                <tr key={buyer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
                      <div className="text-sm text-gray-500">{buyer.budget}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{buyer.email}</div>
                    <div className="text-sm text-gray-500">{buyer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {buyer.interestedIn}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      buyer.stage === 'Contract Signed' ? 'bg-green-100 text-green-800' : 
                      buyer.stage === 'Documentation' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {buyer.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {buyer.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {buyer.lastContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Pipeline</h3>
        <div className="space-y-4">
          {salesPipeline.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{stage.stage}</span>
                <div className="text-right">
                  <span className="text-sm text-gray-600">{stage.count} deals</span>
                  <span className="text-sm text-gray-500 ml-2">€{(stage.value / 1000000).toFixed(1)}M</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div 
                  className={`h-8 rounded-full flex items-center justify-end pr-2 text-white font-medium text-sm ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-indigo-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-yellow-500' :
                    index === 4 ? 'bg-orange-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(stage.value / 20000000) * 100}%` }}
                >
                  {stage.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-blue-100 rounded-t-lg py-4">
                <div className="text-2xl font-bold text-blue-600">186</div>
                <div className="text-sm text-blue-600">Inquiries</div>
              </div>
              <div className="bg-blue-200 py-4" style={{ width: '80%', margin: '0 auto' }}>
                <div className="text-xl font-bold text-blue-700">148</div>
                <div className="text-sm text-blue-700">Qualified Leads</div>
              </div>
              <div className="bg-blue-300 py-4" style={{ width: '60%', margin: '0 auto' }}>
                <div className="text-lg font-bold text-blue-800">89</div>
                <div className="text-sm text-blue-800">Viewings</div>
              </div>
              <div className="bg-blue-400 py-4" style={{ width: '40%', margin: '0 auto' }}>
                <div className="text-lg font-bold text-white">45</div>
                <div className="text-sm text-white">Offers</div>
              </div>
              <div className="bg-blue-500 rounded-b-lg py-4" style={{ width: '20%', margin: '0 auto' }}>
                <div className="text-lg font-bold text-white">22</div>
                <div className="text-sm text-white">Sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deal Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">John Smith moved to Contract Signed</p>
                <p className="text-sm text-gray-600">Unit A-1204 • €485,000</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New inquiry from Lisa Brown</p>
                <p className="text-sm text-gray-600">Interested in 2-bed units</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Viewing scheduled with Michael Chen</p>
                <p className="text-sm text-gray-600">Unit C-1501 • Tomorrow 2:00 PM</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">124</h3>
          <p className="text-sm text-gray-600 mt-1">Contracts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">89</h3>
          <p className="text-sm text-gray-600 mt-1">Invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">56</h3>
          <p className="text-sm text-gray-600 mt-1">Legal Documents</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">342</h3>
          <p className="text-sm text-gray-600 mt-1">Marketing Materials</p>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Sales Contract - A1204</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Contract
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  John Smith
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-03-15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 mr-3">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Receipt className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Invoice - INV-2024-0089</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Invoice
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Sarah Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-03-14
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 mr-3">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Legal Brief - C1501</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Legal
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Michael Chen
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-03-13
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 mr-3">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Sales Contract Template</h4>
            </div>
            <p className="text-sm text-gray-600">Standard sales contract for residential units</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <Receipt className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Invoice Template</h4>
            </div>
            <p className="text-sm text-gray-600">Invoice template for deposits and payments</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <Briefcase className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-gray-900">Legal Disclosure</h4>
            </div>
            <p className="text-sm text-gray-600">Standard legal disclosure documents</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">85%</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Target Achievement</h4>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.68)}`}
                  className="text-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">68%</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Conversion Rate</h4>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.92)}`}
                  className="text-yellow-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">92%</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Occupancy Rate</h4>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.89)}`}
                  className="text-purple-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">89%</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Customer Satisfaction</h4>
          </div>
        </div>
      </div>

      {/* Sales Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <BarChart className="w-8 h-8 text-gray-400" />
          <span className="ml-2 text-gray-500">Sales Trends Chart</span>
        </div>
      </div>

      {/* Revenue by Unit Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Unit Type</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">1 Bedroom</span>
                <span className="text-sm text-gray-600">€12.5M (15.8%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15.8%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">2 Bedroom</span>
                <span className="text-sm text-gray-600">€35.2M (44.5%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '44.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">3 Bedroom</span>
                <span className="text-sm text-gray-600">€24.8M (31.4%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '31.4%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Penthouse</span>
                <span className="text-sm text-gray-600">€6.5M (8.3%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8.3%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Website</span>
                <span className="text-sm text-gray-600">142 (38%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Referrals</span>
                <span className="text-sm text-gray-600">89 (24%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Walk-ins</span>
                <span className="text-sm text-gray-600">75 (20%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Social Media</span>
                <span className="text-sm text-gray-600">67 (18%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Prop
              </Link>
              <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
              <span className="text-lg font-medium text-gray-700">Sales Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="font-medium">John Doe</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Inventory</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'buyers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Buyers</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pipeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Pipeline</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'buyers' && renderBuyers()}
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {/* Quick Actions - Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <div className="relative">
          <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}