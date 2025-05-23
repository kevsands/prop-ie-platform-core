'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBuyerJourneyManager } from '@/hooks/useBuyerJourney';
import { useAuth } from '@/context/AuthContext';
import { OptimizedUnitList, UnitCardPreloader } from '@/components/buyer-journey/OptimizedUnitCard';
import { BuyerJourney } from '@/components/buyer-journey/BuyerJourney';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, ArrowLeft, Home, ShoppingBag } from 'lucide-react';
import { BuyerProgressTracker } from '@/components/buyer-journey/BuyerProgressTracker';

// Unit data - in production would come from API
import { unitTypes } from './unitData';

export default function BuyerJourneyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isLoadingAuth, user } = useAuth();

  // Local state
  const [selectedUnitsetSelectedUnit] = useState<string>('2bed');
  const [showJourneysetShowJourney] = useState(false);
  const [completedTransactionsetCompletedTransaction] = useState<string | null>(null);
  const [activeTabsetActiveTab] = useState('homes');

  // Pre-select unit from URL if present
  useEffect(() => {
    const unitParam = searchParams.get('unit');
    if (unitParam && unitTypes[unitParam]) {
      setSelectedUnit(unitParam);
      setActiveTab('homes');
    }

    const showJourneyParam = searchParams.get('journey');
    if (showJourneyParam === 'true') {
      setShowJourney(true);
    }
  }, [searchParams]);

  // React Query hooks from buyer journey manager
  const {
    useKYCStatus,
    useBuyerReservations
  } = useBuyerJourneyManager({
    developmentId: 'fitzgerald-gardens'
  });

  // KYC status
  const { data: kycStatus, isLoading: isLoadingKYC } = useKYCStatus(user?.id);

  // Existing reservations
  const { data: reservations, isLoading: isLoadingReservations } = useBuyerReservations();

  // Handle unit selection
  const handleSelectUnit = (key: string) => {
    setSelectedUnit(key);

    // Update URL for deep linking
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('unit', key);
    window.history.pushState({}, '', newUrl.toString());
  };

  // Handle Buy Now button click
  const handleBuyNow = (unitKey: string) => {
    setSelectedUnit(unitKey);
    setShowJourney(true);

    // Update URL for deep linking
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('unit', unitKey);
    newUrl.searchParams.set('journey', 'true');
    window.history.pushState({}, '', newUrl.toString());
  };

  // Handle journey completion
  const handleJourneyComplete = (transactionId: string) => {
    setCompletedTransaction(transactionId);
    setShowJourney(false);

    // Remove journey param from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('journey');
    window.history.pushState({}, '', newUrl.toString());
  };

  // Handle back to development
  const handleBack = () => {
    router.push('/developments');
  };

  // Determine if user has already reserved a unit in this development
  const hasReservation = reservations?.transactions?.some(
    transaction => transaction.developmentId === 'fitzgerald-gardens'
  );

  // Journey steps for progress tracker
  const journeySteps = [
    { 
      id: 'browse', 
      label: 'Browse Units', 
      status: completedTransaction ? 'completed' : 'active' as const
    },
    { 
      id: 'select', 
      label: 'Select Unit', 
      status: selectedUnit && !completedTransaction ? 'active' : completedTransaction ? 'completed' : 'pending' as const
    },
    { 
      id: 'reserve', 
      label: 'Reserve Unit', 
      status: completedTransaction ? 'completed' : 'pending' as const
    },
    { 
      id: 'complete', 
      label: 'Complete Transaction', 
      status: completedTransaction ? 'completed' : 'pending' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Developments
          </Button>
          <h1 className="text-2xl font-bold">Fitzgerald Gardens</h1>

          {completedTransaction && (
            <div className="ml-auto">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/buyer/transactions?transaction=${completedTransaction}`)}
              >
                View Your Transaction
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-lg font-medium mb-4">Your Home Buying Journey</h2>
          <BuyerProgressTracker 
            steps={journeySteps}
            currentStep={completedTransaction ? 'complete' : showJourney ? 'reserve' : 'select'}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading state */}
        {(isLoadingAuth || isLoadingKYC || isLoadingReservations) && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <p>Loading your information...</p>
          </div>
        )}

        {/* Main content when loaded */}
        {!(isLoadingAuth || isLoadingKYC || isLoadingReservations) && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="homes">Available Homes</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="homes" className="space-y-8">
              {/* Already reserved notice */}
              {hasReservation && !completedTransaction && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <Home className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-blue-800">You already have a reservation in this development</h3>
                        <p className="text-blue-700 mt-1">
                          You have an existing reservation in Fitzgerald Gardens. 
                          View your transaction details in your account.
                        </p>
                        <Button 
                          className="mt-3" 
                          variant="outline" 
                          onClick={() => router.push('/buyer/transactions')}
                        >
                          View Your Transactions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success notice */}
              {completedTransaction && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Home className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Your unit has been successfully reserved!</h3>
                        <p className="text-green-700 mt-1">
                          Congratulations on reserving your new home at Fitzgerald Gardens.
                          Our team will be in touch with next steps.
                        </p>
                        <div className="flex gap-3 mt-3">
                          <Button 
                            variant="outline" 
                            onClick={() => router.push(`/buyer/transactions?transaction=${completedTransaction}`)}
                          >
                            View Transaction Details
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setCompletedTransaction(null)}
                          >
                            Browse More Units
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <h2 className="text-3xl font-bold mb-6">Available Homes</h2>
                <Suspense fallback={<UnitCardPreloader />}>
                  <OptimizedUnitList 
                    units={unitTypes}
                    selectedUnit={selectedUnit}
                    onSelectUnit={handleSelectUnit}
                    onBuyNow={handleBuyNow}
                  />
                </Suspense>
              </div>

              {/* Selected Unit Details */}
              {selectedUnit && unitTypes[selectedUnit] && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{unitTypes[selectedUnit].name} - Details</CardTitle>
                    <div className="flex items-center mt-2">
                      <div className="text-xl font-semibold">{unitTypes[selectedUnit].price}</div>
                      <div className="ml-auto">
                        {unitTypes[selectedUnit].available> 0 && !hasReservation && !completedTransaction && (
                          <Button 
                            onClick={() => handleBuyNow(selectedUnit)}
                            className="flex items-center"
                          >
                            Buy It Now
                            <ShoppingBag className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="aspect-w-16 aspect-h-12 mb-4">
                          <div className="bg-gray-200 rounded-lg p-8 text-center">
                            <Home className="h-16 w-16 mx-auto text-gray-400" />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{unitTypes[selectedUnit].bedrooms}</span>
                            <span>Bedrooms</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{unitTypes[selectedUnit].bathrooms}</span>
                            <span>Bathrooms</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{unitTypes[selectedUnit].area}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Features</h3>
                        <ul className="space-y-2">
                          {unitTypes[selectedUnit].features.map((featureindex: any) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <h3 className="font-semibold mt-6 mb-4">Room Dimensions</h3>
                        <div className="space-y-2">
                          {Object.entries(unitTypes[selectedUnit].schedule).map(([roomsize]) => (
                            <div key={room} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>{room}</span>
                              <span className="text-gray-600">{size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Other tabs content omitted for brevity but would include:
                - Features tab with development features
                - Location tab with maps and amenities
                - Gallery tab with development photos
                - Contact tab with agent information */}
          </Tabs>
        )}
      </div>

      {/* Buy it Now Journey Dialog */}
      <Dialog open={showJourney} onOpenChange={setShowJourney}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
          </DialogHeader>

          <BuyerJourney 
            developmentId="fitzgerald-gardens"
            unit={
              key: selectedUnit,
              name: unitTypes[selectedUnit]?.name || '',
              price: unitTypes[selectedUnit]?.price || '',
              bedrooms: unitTypes[selectedUnit]?.bedrooms || 0,
              bathrooms: unitTypes[selectedUnit]?.bathrooms || 0,
              area: unitTypes[selectedUnit]?.area || '',
              features: unitTypes[selectedUnit]?.features || [],
              available: unitTypes[selectedUnit]?.available || 0
            }
            onComplete={handleJourneyComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}