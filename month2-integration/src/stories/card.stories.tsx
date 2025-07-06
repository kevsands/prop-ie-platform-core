import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  Pencil, 
  Star, 
  Heart, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  ChevronRight,
  Bell,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardMedia,
  CardBadge
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where the main content of the card is displayed.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" className="ml-2">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <Card>
      <CardMedia
        src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070"
        alt="Property image"
        ratio="video"
      />
      <CardHeader>
        <CardTitle>Modern Property</CardTitle>
        <CardDescription>Dublin, Ireland</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A stunning modern property in the heart of Dublin, featuring 3 bedrooms and 2 bathrooms with excellent amenities.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Details</Button>
        <Button size="sm" className="ml-2">Book Viewing</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithMediaOverlay: Story = {
  render: () => (
    <Card>
      <CardMedia
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
        alt="Property image"
        ratio="video"
        overlay={
          <div>
            <h3 className="text-lg font-semibold">Luxury Apartment</h3>
            <p className="text-sm opacity-90">€450,000</p>
          </div>
        }
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium">Dublin, Ireland</h3>
            <p className="text-sm text-muted-foreground">3 beds • 2 baths • 1,250 sq ft</p>
          </div>
          <Badge variant="outline">New</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Available from September 2023</p>
      </CardContent>
      <CardFooter className="justify-end border-t pt-4 mt-4">
        <Button variant="ghost" size="sm">
          <Heart size={16} className="mr-1" />
          Save
        </Button>
        <Button size="sm" className="ml-2">
          Contact Agent
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="relative">
      <CardBadge variant="success" position="top-right">
        New
      </CardBadge>
      <CardMedia
        src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084"
        alt="Property image"
        ratio="video"
      />
      <CardHeader>
        <CardTitle>Family Home</CardTitle>
        <CardDescription>Galway, Ireland</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Perfect family home with 4 bedrooms and large garden, located in a quiet neighborhood.</p>
      </CardContent>
      <CardFooter>
        <Button>View Property</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over me to see effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects to indicate it's interactive. Great for clickable cards.</p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-sm text-muted-foreground">Click to learn more</span>
        <ChevronRight size={16} />
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader 
        action={
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={16} />
          </Button>
        }
      >
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>This card has an action in the header</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Cards can have action buttons in the header for common operations like edit, delete, etc.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" className="ml-2">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Standard card with border and shadow</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card text-card-foreground shadow-md">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with more prominent shadow</p>
        </CardContent>
      </Card>
      
      <Card className="border border-border bg-transparent">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with border but no background</p>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/30 border-secondary/20">
        <CardHeader>
          <CardTitle>Filled</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with background fill</p>
        </CardContent>
      </Card>
      
      <Card className="border-transparent bg-transparent hover:bg-muted/50">
        <CardHeader>
          <CardTitle>Ghost</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with no background until hover</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const StatusCards: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="bg-blue-50 border-blue-200 text-blue-900">
        <CardHeader>
          <div className="flex items-center">
            <Info size={18} className="mr-2" />
            <CardTitle>Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>This contains important information you should know about.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-200 text-green-900">
        <CardHeader>
          <div className="flex items-center">
            <CheckCircle2 size={18} className="mr-2" />
            <CardTitle>Success</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>Your action has been completed successfully.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 border-amber-200 text-amber-900">
        <CardHeader>
          <div className="flex items-center">
            <Bell size={18} className="mr-2" />
            <CardTitle>Warning</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>Be careful with this action as it may have consequences.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200 text-red-900">
        <CardHeader>
          <div className="flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <CardTitle>Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>Something went wrong. Please try again or contact support.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const PropertyCard: Story = {
  render: () => (
    <Card className="overflow-hidden">
      <div className="relative">
        <CardMedia
          src="https://images.unsplash.com/photo-1600607687644-c7f34bc91088?q=80&w=2070"
          alt="Luxury apartment"
          ratio="video"
        />
        <CardBadge variant="success" position="top-left">Featured</CardBadge>
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <Button variant="secondary" size="icon" className="rounded-full bg-white/80 text-gray-800 h-8 w-8">
            <Heart size={14} />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full bg-white/80 text-gray-800 h-8 w-8">
            <Bookmark size={14} />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full bg-white/80 text-gray-800 h-8 w-8">
            <Share2 size={14} />
          </Button>
        </div>
      </div>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">€450,000</CardTitle>
            <CardDescription>Luxury Apartment</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            New
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <span className="font-medium text-foreground">Dublin 4, Ireland</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 py-2 border-y text-sm">
          <div className="text-center">
            <p className="font-semibold">3</p>
            <p className="text-xs text-muted-foreground">Bedrooms</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">2</p>
            <p className="text-xs text-muted-foreground">Bathrooms</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">1,250</p>
            <p className="text-xs text-muted-foreground">Sq Ft</p>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-sm">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} fill="currentColor" size={14} />
            ))}
          </div>
          <span className="ml-2 text-muted-foreground">(24 reviews)</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 justify-between">
        <Button variant="outline" size="sm">
          More Details
        </Button>
        <Button size="sm">Schedule Viewing</Button>
      </CardFooter>
    </Card>
  ),
};

export const DashboardCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sales Overview</CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">Day</Button>
            <Button variant="secondary" size="sm">Week</Button>
            <Button variant="ghost" size="sm">Month</Button>
          </div>
        </div>
        <CardDescription>
          Comparison of current and previous week
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-2">
        {/* Placeholder for Chart */}
        <div className="w-full h-48 bg-muted/20 rounded-md flex items-center justify-center">
          [Chart Visualization]
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded-md p-3">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-2xl font-semibold">€148,520</p>
            <p className="text-xs text-green-600 flex items-center">
              <span>↑ 12.5%</span>
              <span className="ml-1">vs last week</span>
            </p>
          </div>
          
          <div className="border rounded-md p-3">
            <p className="text-sm text-muted-foreground">Properties Sold</p>
            <p className="text-2xl font-semibold">24</p>
            <p className="text-xs text-green-600 flex items-center">
              <span>↑ 8.2%</span>
              <span className="ml-1">vs last week</span>
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 mt-4 justify-end">
        <Button variant="ghost" size="sm">
          View detailed report →
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const BlogPostCard: Story = {
  render: () => (
    <Card>
      <CardMedia
        src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?q=80&w=1973"
        alt="Real estate investing"
        ratio="video"
      />
      <CardHeader>
        <div className="flex flex-wrap gap-1 mb-1">
          <Badge variant="secondary" className="font-normal">Investment</Badge>
          <Badge variant="secondary" className="font-normal">Real Estate</Badge>
        </div>
        <CardTitle>Guide to Real Estate Investing in 2023</CardTitle>
        <CardDescription>Published on June 15, 2023 • 10 min read</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Learn about the current real estate market trends and the best strategies for property investment in Ireland this year.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4 mt-4 justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
          <div>
            <p className="text-sm font-medium">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Investment Advisor</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Read More
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  ),
};