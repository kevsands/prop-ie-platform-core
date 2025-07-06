'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { BarChart, Building, Home, TrendingUp, Users, FilePlus2, BarChart2, LineChart, PieChart, DollarSign } from 'lucide-react';

// Define types for component props
interface BaseComponentProps {
  className?: string;
  children: ReactNode;
}

// Simplified UI components
const Card = ({ className = "", children }: BaseComponentProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }: BaseComponentProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }: BaseComponentProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }: BaseComponentProps) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }: BaseComponentProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Simplified Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  variant?: keyof typeof variantStyles;
}

const variantStyles = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
};

const Button = ({ variant = "default", className = "", children, ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  
  const finalStyle = `${baseStyle} ${variantStyles[variant]} h-10 py-2 px-4 ${className}`;
  
  return (
    <button className={finalStyle} {...props}>
      {children}
    </button>
  );
};

// Simplified Tabs components
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

interface TabsProps extends BaseComponentProps {
  value: string;
  onValueChange: (value: string) => void;
}

const Tabs = ({ value, onValueChange, children, className = "" }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = "" }: BaseComponentProps) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps extends BaseComponentProps {
  value: string;
}

const TabsTrigger = ({ value, children, className = "" }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
        isActive 
          ? "bg-white text-slate-900 shadow-sm" 
          : "text-slate-500 hover:text-slate-900"
      } ${className}`}
      onClick={() => context?.onValueChange(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends BaseComponentProps {
  value: string;
}

const TabsContent = ({ value, children }: TabsContentProps) => {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;
  
  return (
    <div className="mt-2">
      {children}
    </div>
  );
};

// Simplified InvestorModeProvider component
const InvestorModeProvider = ({ children }: BaseComponentProps) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default function InvestorDashboardPage() {
  // We'll force investor mode to be active on this page
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <InvestorModeProvider>
      <div className="container mx-auto py-8">
        {/* Alert about simplified version */}
        <div className="bg-amber-100 p-4 rounded-md mb-6 text-amber-800">
          <h3 className="font-semibold mb-1">Simplified Dashboard</h3>
          <p>This is a simplified investor dashboard for build testing. Full functionality will be restored later.</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
            <p className="mt-1 text-gray-500">
              Manage your property investments and track performance
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>

        {/* Premium Subscription Banner */}
        <div className="bg-gradient-to-r from-[#2B5273] to-[#1E3142] text-white p-4 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-start">
              <BarChart className="h-6 w-6 mr-3 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">Upgrade to Investor Pro</h3>
                <p className="text-white/80 text-sm mt-1">
                  Get full access to portfolio management, AI insights, and premium market data.
                </p>
              </div>
            </div>
            <Button className="mt-4 md:mt-0 bg-white text-[#2B5273] hover:bg-gray-100">
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="border-b border-gray-200 w-full flex overflow-x-auto">
            <TabsTrigger value="portfolio" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Portfolio Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              Financial Analysis
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Lease Management
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Market Insights
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Overview Tab */}
          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Summary</CardTitle>
                    <CardDescription>Your portfolio at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Property Value</p>
                      <p className="text-2xl font-bold">€1,830,000</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Up 8.3% from last year
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Equity</p>
                      <p className="text-2xl font-bold">€630,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Annual Cash Flow</p>
                      <p className="text-2xl font-bold">€50,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average ROI</p>
                      <p className="text-2xl font-bold">7.9%</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">View Detailed Report</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Add New Property
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Run Financial Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PieChart className="mr-2 h-4 w-4" />
                      Portfolio Allocation
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Portfolio Breakdown */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Breakdown</CardTitle>
                    <CardDescription>Distribution by property type</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Portfolio breakdown visualization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location Distribution</CardTitle>
                    <CardDescription>Properties by location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Dublin</span>
                        <span className="text-sm">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cork</span>
                        <span className="text-sm">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Galway</span>
                        <span className="text-sm">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - AI Insights */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Investment Recommendations</CardTitle>
                    <CardDescription>Personalized investment insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Diversification Opportunity</p>
                          <p className="text-sm text-blue-600 mt-1">
                            Your portfolio is concentrated in Dublin. Consider expanding to emerging areas like Drogheda.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Rental Optimization</p>
                          <p className="text-sm text-green-600 mt-1">
                            Market analysis suggests you could increase rent on your Riverside Apartment by €200/month.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                      <div className="flex">
                        <BarChart className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Refinancing Opportunity</p>
                          <p className="text-sm text-amber-600 mt-1">
                            Current rates are 0.8% lower than your Riverside Apartment mortgage. Consider refinancing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Trends</CardTitle>
                    <CardDescription>Current real estate trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Dublin Prices</span>
                        <span className="text-sm text-green-600">+4.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Rental Yield</span>
                        <span className="text-sm">5.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Mortgage Rates</span>
                        <span className="text-sm text-red-600">+0.5%</span>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" className="w-full text-sm">
                          View Market Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other Tabs - Minimal Implementation */}
          <TabsContent value="properties">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Properties Overview</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Detailed property management interface would appear here, showing all your investment properties with performance metrics.
                  </p>
                  <Button className="mt-4">
                    View Properties
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Financial Analysis</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Comprehensive financial analysis tools for your investment portfolio would be displayed here.
                  </p>
                  <Button className="mt-4">
                    Run Analysis
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tenants">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Lease Management</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Tenant and lease management tools would appear here, allowing you to track leases, payments, and tenant information.
                  </p>
                  <Button className="mt-4">
                    Manage Leases
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Market Insights</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    AI-powered market insights and investment opportunities would be displayed here.
                  </p>
                  <Button className="mt-4">
                    View Insights
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </InvestorModeProvider>
  );
}