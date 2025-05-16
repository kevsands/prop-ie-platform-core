'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// Removed import for build testing;
// Removed import for build testing;
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Home, Brush, Lightbulb, ArrowLeft } from 'lucide-react';

// Simplified component definitions for build testing

// Simplified Card components
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Simplified Button component
const Button = ({ 
  className = "", 
  variant = "default", 
  children, 
  disabled = false, 
  onClick,
  ...props 
}) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      variant === "outline" 
        ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    } h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

/**
 * Simplified fallback customization page to diagnose React errors
 */
export default function FallbackCustomizationPage() {
  const router = useRouter();
  
  // Basic state for room and category selection
  const [activeRoom, setActiveRoom] = React.useState("livingRoom");
  const [activeCategory, setActiveCategory] = React.useState("flooring");
  
  // Simple dummy data
  const rooms = [
    { id: 'livingRoom', name: 'Living Room', icon: '🛋️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' }
  ];
  
  const categories = [
    { id: 'flooring', name: 'Flooring' },
    { id: 'paint', name: 'Paint' },
    { id: 'fixtures', name: 'Fixtures' },
    { id: 'furniture', name: 'Furniture' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customize Your Property (Fallback Mode)
            </h1>
            <p className="mt-2 text-gray-600">
              This is a simplified version of the customization interface.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        {/* Room Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select a Room</CardTitle>
            <CardDescription>Choose which room you want to customize</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeRoom} 
              onValueChange={setActiveRoom} 
              className="mb-8"
            >
              <TabsList className="flex overflow-x-auto pb-1 mb-2">
                {rooms.map((room) => (
                  <TabsTrigger 
                    key={room.id} 
                    value={room.id}
                    className="flex flex-col items-center px-6 py-3"
                  >
                    <span className="text-2xl mb-1">{room.icon}</span>
                    <span className="text-sm font-medium">{room.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Category Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select a Category</CardTitle>
            <CardDescription>Choose what you want to customize</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeCategory} 
              onValueChange={setActiveCategory}
            >
              <TabsList className="flex mb-6">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {getCategoryIcon(category.id)}
                    <span className="ml-2">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="mt-6 p-8 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-500">
                Customization options would appear here. The full interface is currently unavailable.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Summary and Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Selections</CardTitle>
            <CardDescription>
              No selections made in fallback mode
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-wrap gap-4">
            <Button 
              variant="outline"
              onClick={() => alert('Consultation not available in fallback mode')}
            >
              Request Consultation
            </Button>
            <Button onClick={() => router.push('/buyer')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to get icons for categories
function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case 'flooring':
      return <Home className="h-4 w-4" />;
    case 'paint':
      return <Brush className="h-4 w-4" />;
    case 'fixtures':
      return <Lightbulb className="h-4 w-4" />;
    case 'furniture':
      return <Home className="h-4 w-4" />;
    default:
      return null;
  }
}