'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, Bed, Bath, Square, Calendar, Check, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function EllwoodPage() {
  const [selectedUnitTypesetSelectedUnitType] = useState('1bed');

  const development = {
    name: 'Ellwood',
    location: 'Dublin 15',
    county: 'Co. Dublin',
    totalUnits: 65,
    unitsAvailable: 42,
    completion: 'Q3 2024',
    description: 'Modern sustainable living in the heart of Dublin 15. Ellwood offers contemporary homes designed for modern lifestyles, with a focus on energy efficiency and community wellbeing.',
    keyFeatures: [
      'A-rated energy efficient homes',
      'Solar panels on every home',
      'EV charging points',
      'Community gardens',
      'Children\'s play areas',
      'Walking distance to shops',
      'Public transport links',
      'Cycle lane access'
    ],
    transport: [
      'Phoenix Park Station - 10 min walk',
      'Blanchardstown Shopping Centre - 15 min',
      'M50 Access - 5 min drive',
      'Dublin Airport - 20 min',
      'City Centre - 30 min bus'
    ],
    UnitType: {
      '1bed': {
        name: '1 Bed Apartment',
        price: 'From €325,000',
        area: '52 sq.m',
        available: 8,
        total: 12,
        features: ['Open plan living', 'Private balcony', 'Built-in wardrobes', 'Video intercom'],
        schedule: {
          'Living/Kitchen/Dining': '24.5 sq.m',
          'Bedroom': '12.8 sq.m',
          'Bathroom': '5.2 sq.m',
          'Hall': '5.5 sq.m',
          'Balcony': '4.0 sq.m'
        }
      },
      '2bed': {
        name: '2 Bed Apartment',
        price: 'From €385,000',
        area: '72 sq.m',
        available: 18,
        total: 28,
        features: ['Master en-suite', 'Utility room', 'South facing', 'Floor to ceiling windows'],
        schedule: {
          'Living/Kitchen/Dining': '29.5 sq.m',
          'Master Bedroom': '13.5 sq.m',
          'Bedroom 2': '10.8 sq.m',
          'Bathroom': '4.8 sq.m',
          'En-suite': '3.2 sq.m',
          'Utility': '3.2 sq.m',
          'Hall': '5.0 sq.m',
          'Balcony': '5.0 sq.m'
        }
      },
      '3bed': {
        name: '3 Bed House',
        price: 'From €485,000',
        area: '115 sq.m',
        available: 12,
        total: 18,
        features: ['Private garden', 'Garage', 'Home office space', 'Triple glazing'],
        schedule: {
          'Living Room': '22.5 sq.m',
          'Kitchen/Dining': '28.5 sq.m',
          'Master Bedroom': '14.5 sq.m',
          'Bedroom 2': '12.8 sq.m',
          'Bedroom 3': '10.2 sq.m',
          'Bathroom': '5.8 sq.m',
          'En-suite': '4.2 sq.m',
          'Downstairs WC': '2.5 sq.m',
          'Hall': '8.0 sq.m',
          'Landing': '6.0 sq.m',
          'Garden': '40.0 sq.m'
        }
      },
      '4bed': {
        name: '4 Bed House',
        price: 'From €595,000',
        area: '145 sq.m',
        available: 4,
        total: 7,
        features: ['Double garage', 'Large garden', 'Home office', 'Solar panels + battery'],
        schedule: {
          'Living Room': '26.5 sq.m',
          'Kitchen/Dining': '32.5 sq.m',
          'Master Bedroom': '16.5 sq.m',
          'Bedroom 2': '14.2 sq.m',
          'Bedroom 3': '12.8 sq.m',
          'Bedroom 4': '10.8 sq.m',
          'Family Bathroom': '6.8 sq.m',
          'En-suite': '5.2 sq.m',
          'Downstairs WC': '2.5 sq.m',
          'Utility': '4.2 sq.m',
          'Hall': '9.0 sq.m',
          'Landing': '7.0 sq.m',
          'Garden': '65.0 sq.m'
        }
      }
    }
  };

  const salesFunnel = {
    available: development.unitsAvailable,
    reserved: 15,
    saleAgreed: 8,
    completed: 0
  };

  const currentUnit = development.UnitType[selectedUnitType];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <Image
          src="/images/ellwood/hero.jpg"
          alt={development.name}
          width={1920}
          height={600}
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <Badge className="mb-4" variant="secondary">
                Now Selling - {development.completion} Completion
              </Badge>
              <h1 className="text-5xl font-bold text-white mb-4">
                {development.name}
              </h1>
              <p className="text-xl text-white/90 mb-6 flex items-center">
                <MapPin className="mr-2" />
                {development.location}, {development.county}
              </p>
              <p className="text-lg text-white/80 mb-8">
                {development.description}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="text-lg">
                  View Available Homes
                </Button>
                <Button size="lg" variant="outline" className="text-lg text-white border-white hover:bg-white hover:text-slate-900">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{development.totalUnits}</p>
              <p className="text-sm text-slate-600">Total Homes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{development.unitsAvailable}</p>
              <p className="text-sm text-slate-600">Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{development.UnitType['1bed'].price.split('€')[1]}</p>
              <p className="text-sm text-slate-600">Starting Price</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{development.completion}</p>
              <p className="text-sm text-slate-600">Completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="homes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
              <TabsTrigger value="homes">Homes</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="site-plan">Site Plan</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="virtual-tour">Virtual Tour</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="homes" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Unit Type Selector */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Home Type</CardTitle>
                      <CardDescription>Explore our range of homes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(development.UnitType).map(([keyunit]) => (
                        <div
                          key={key}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                            selectedUnitType === key
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => setSelectedUnitType(key)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{unit.name}</h4>
                            <Badge variant={unit.available> 0 ? 'default' : 'secondary'}>
                              {unit.available> 0 ? `${unit.available} Available` : 'Sold Out'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{unit.price}</p>
                          <p className="text-sm text-slate-600">{unit.area}</p>
                          <Progress 
                            value={(unit.available / unit.total) * 100} 
                            className="mt-2"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Unit Details */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentUnit.name}</CardTitle>
                      <CardDescription>
                        {currentUnit.area} • {currentUnit.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <Image
                          src={`/images/ellwood/${selectedUnitType}.jpg`}
                          alt={currentUnit.name}
                          width={800}
                          height={600}
                          className="w-full rounded-lg"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4">Schedule of Accommodation</h4>
                          <div className="space-y-2">
                            {Object.entries(currentUnit.schedule).map(([roomarea]) => (
                              <div key={room} className="flex justify-between text-sm">
                                <span className="text-slate-600">{room}</span>
                                <span className="font-medium">{area}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4">Key Features</h4>
                          <ul className="space-y-2">
                            {currentUnit.features.map((feature: any, index: any) => (
                              <li key={index: any} className="flex items-center text-sm">
                                <Check className="mr-2 text-green-600" size={16} />
                                {feature: any}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button className="flex-1">
                        Register Interest
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="mr-2" size={16} />
                        Download Floor Plan
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Premium Specifications</CardTitle>
                  <CardDescription>A-rated sustainable homes with modern finishes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Kitchen</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• High gloss fitted kitchen</li>
                        <li>• Quartz worktops</li>
                        <li>• Integrated Bosch appliances</li>
                        <li>• Wine cooler (3 & 4 bed)</li>
                        <li>• Soft close drawers</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Energy & Tech</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• A2 BER rating</li>
                        <li>• Solar panels</li>
                        <li>• Heat pump system</li>
                        <li>• EV charging point</li>
                        <li>• Smart home ready</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Interior Finishes</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Oak engineered flooring</li>
                        <li>• Porcelain tiling</li>
                        <li>• Built-in wardrobes</li>
                        <li>• Contemporary sanitary ware</li>
                        <li>• Chrome fixtures</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="site-plan" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Site Plan</CardTitle>
                  <CardDescription>Masterplan layout showing all phases</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src="/images/ellwood/site-plan.jpg"
                    alt="Ellwood Site Plan"
                    width={1200}
                    height={800}
                    className="w-full rounded-lg"
                  />
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Download className="mr-2" size={16} />
                      Download Site Plan
                    </Button>
                    <Button>
                      View Interactive Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Prime Dublin 15 Location</CardTitle>
                  <CardDescription>Everything you need within reach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Image
                        src="/images/ellwood/location-map.jpg"
                        alt="Location Map"
                        width={600}
                        height={400}
                        className="w-full rounded-lg mb-6"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Transport Links</h3>
                      <ul className="space-y-2 mb-6">
                        {development.transport.map((link, index: any) => (
                          <li key={index: any} className="flex items-start">
                            <MapPin className="mr-2 text-blue-600 flex-shrink-0" size={16} />
                            <span className="text-sm">{link}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="font-semibold mb-4">Local Amenities</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-2">Education</p>
                          <ul className="space-y-1 text-slate-600">
                            <li>• Scoil Mhuire Primary</li>
                            <li>• Castleknock College</li>
                            <li>• DCU - 15 min</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">Shopping</p>
                          <ul className="space-y-1 text-slate-600">
                            <li>• Blanchardstown Centre</li>
                            <li>• Castleknock Village</li>
                            <li>• Phoenix Park</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-8">
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 56].map((num) => (
                  <Card key={num} className="overflow-hidden">
                    <Image
                      src={`/images/ellwood/${num}.jpg`}
                      alt={`Ellwood Image ${num}`}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="virtual-tour" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Tour</CardTitle>
                  <CardDescription>Explore our show homes from anywhere</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                    <p className="text-slate-600">Virtual tour loading...</p>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Button>
                      3 Bed Show Home
                    </Button>
                    <Button variant="outline">
                      2 Bed Apartment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Team</CardTitle>
                    <CardDescription>Our expert team is here to help</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold">Opening Hours</p>
                        <p className="text-sm text-slate-600">Monday - Sunday: 11am - 5pm</p>
                      </div>
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-sm text-slate-600">01 234 5678</p>
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-slate-600">ellwood@prop.ie</p>
                      </div>
                      <div>
                        <p className="font-semibold">Show Home Address</p>
                        <p className="text-sm text-slate-600">
                          Ellwood Sales Suite<br />
                          Castleknock Road<br />
                          Dublin 15
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Book a Viewing</CardTitle>
                    <CardDescription>Visit our show homes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 border rounded-lg"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full p-3 border rounded-lg"
                      />
                      <select className="w-full p-3 border rounded-lg">
                        <option>Select Unit Type</option>
                        <option>1 Bed Apartment</option>
                        <option>2 Bed Apartment</option>
                        <option>3 Bed House</option>
                        <option>4 Bed House</option>
                      </select>
                      <textarea
                        placeholder="Message (optional)"
                        rows={3}
                        className="w-full p-3 border rounded-lg"
                      />
                      <Button className="w-full">
                        Request Viewing
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Ellwood?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {development.keyFeatures.map((feature: any, index: any) => (
              <div key={index: any} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-blue-600" />
                </div>
                <p className="font-medium">{feature: any}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}