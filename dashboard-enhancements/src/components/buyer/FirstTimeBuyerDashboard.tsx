'use client';

/**
 * First-Time Buyer Dashboard Component
 * 
 * Displays all relevant information for first-time buyers, including their journey phase,
 * reservations, mortgage tracking, snag lists, and home pack items.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/useToast';
import { useBuyerAPI } from '@/hooks/useBuyerAPI';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatCurrency } from '@/utils/formatting';

import { 
  BuyerJourneyPhase,
  BuyerProfile,
  Reservation, 
  ReservationStatus,
  MortgageTracking,
  MortgageStatus,
  SnagList,
  SnagItem,
  SnagItemStatus,
  SnagListStatus,
  HomePackItem
} from '@/types/buyer';

interface BuyerJourneyPhaseDisplayProps {
  phase: BuyerJourneyPhase;
}

const BuyerJourneyPhaseDisplay = ({ phase }: BuyerJourneyPhaseDisplayProps) => {
  const phases = [
    { id: 'PLANNING', label: 'Planning', color: 'bg-blue-500' },
    { id: 'FINANCING', label: 'Financing', color: 'bg-purple-500' },
    { id: 'SEARCHING', label: 'Searching', color: 'bg-yellow-500' },
    { id: 'BUYING', label: 'Buying', color: 'bg-orange-500' },
    { id: 'MOVED_IN', label: 'Moved In', color: 'bg-green-500' },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.id === phase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        {phases.map((p, index) => (
          <div key={p.id} className="text-center">
            <div 
              className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center 
              ${currentPhaseIndex >= index ? p.color : 'bg-gray-200'}`}
            >
              <span className="text-white text-xs">{index + 1}</span>
            </div>
            <p className={`text-xs mt-1 ${currentPhaseIndex >= index ? 'font-medium' : 'text-gray-500'}`}>
              {p.label}
            </p>
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

interface ReservationCardProps {
  reservation: Reservation;
}

interface MortgageTrackingCardProps {
  mortgageTracking: MortgageTracking | null;
}

interface SnagListCardProps {
  snagList: SnagList;
}

interface HomePackItemsListProps {
  items: HomePackItem[] | null | undefined;
}

const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const statusColors = {
    PENDING: 'bg-yellow-200 text-yellow-800',
    CONFIRMED: 'bg-blue-200 text-blue-800',
    CANCELLED: 'bg-red-200 text-red-800',
    COMPLETED: 'bg-green-200 text-green-800',
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{reservation.property.name}</CardTitle>
            <CardDescription>Reserved on: {formatDate(reservation.reservationDate)}</CardDescription>
          </div>
          <Badge className={statusColors[reservation.status]}>{reservation.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Deposit Amount</p>
            <p className="font-medium">{formatCurrency(reservation.depositAmount)}</p>
          </div>
          <div>
            <p className="text-gray-500">Deposit Status</p>
            <p className="font-medium">{reservation.depositPaid ? 'Paid' : 'Not Paid'}</p>
          </div>
          <div>
            <p className="text-gray-500">Agreement</p>
            <p className="font-medium">{reservation.agreementSigned ? 'Signed' : 'Not Signed'}</p>
          </div>
          <div>
            <p className="text-gray-500">Expiry Date</p>
            <p className="font-medium">{reservation.expiryDate ? formatDate(reservation.expiryDate) : 'N/A'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
};

const MortgageTrackingCard = ({ mortgageTracking }: MortgageTrackingCardProps) => {
  if (!mortgageTracking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Tracking</CardTitle>
          <CardDescription>No mortgage information available</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Start Mortgage Application</Button>
        </CardContent>
      </Card>
    );
  }

  const statusDisplay = {
    NOT_STARTED: { label: 'Not Started', color: 'bg-gray-200 text-gray-800' },
    AIP_RECEIVED: { label: 'AIP Received', color: 'bg-blue-200 text-blue-800' },
    AIP_EXPIRED: { label: 'AIP Expired', color: 'bg-red-200 text-red-800' },
    MORTGAGE_OFFERED: { label: 'Mortgage Offered', color: 'bg-green-200 text-green-800' },
    MORTGAGE_COMPLETED: { label: 'Mortgage Completed', color: 'bg-green-200 text-green-800' },
  };

  const status = statusDisplay[mortgageTracking.status];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Mortgage Tracking</CardTitle>
            <CardDescription>{mortgageTracking.lenderName || 'No lender selected'}</CardDescription>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {mortgageTracking.amount && (
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">{formatCurrency(mortgageTracking.amount)}</p>
            </div>
          )}
          {mortgageTracking.aipDate && (
            <div>
              <p className="text-gray-500">AIP Date</p>
              <p className="font-medium">{formatDate(mortgageTracking.aipDate)}</p>
            </div>
          )}
          {mortgageTracking.aipExpiryDate && (
            <div>
              <p className="text-gray-500">AIP Expiry</p>
              <p className="font-medium">{formatDate(mortgageTracking.aipExpiryDate)}</p>
            </div>
          )}
          {mortgageTracking.formalOfferDate && (
            <div>
              <p className="text-gray-500">Formal Offer Date</p>
              <p className="font-medium">{formatDate(mortgageTracking.formalOfferDate)}</p>
            </div>
          )}
        </div>

        {mortgageTracking.conditions && mortgageTracking.conditions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Conditions:</p>
            <ul className="list-disc pl-5 text-sm">
              {mortgageTracking.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
        )}

        {mortgageTracking.notes && (
          <div className="mt-4">
            <p className="text-sm font-medium">Notes:</p>
            <p className="text-sm">{mortgageTracking.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Update Details</Button>
      </CardFooter>
    </Card>
  );
};

const SnagListCard = ({ snagList }: SnagListCardProps) => {
  const completedItems = snagList.items.filter(item => item.status === SnagItemStatus.FIXED).length;
  const progress = (completedItems / snagList.items.length) * 100;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Snag List - {snagList.property.name}</CardTitle>
            <CardDescription>Created: {formatDate(snagList.createdAt)}</CardDescription>
          </div>
          <Badge className={snagList.status === SnagListStatus.ACTIVE ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}>
            {snagList.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{completedItems} of {snagList.items.length} resolved</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent items:</p>
            {snagList.items.slice(0, 3).map((item: SnagItem) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <div className="truncate flex-1">
                  <p className="font-medium truncate">{item.description}</p>
                  <p className="text-gray-500 text-xs">{item.location}</p>
                </div>
                <Badge className={
                  item.status === SnagItemStatus.FIXED ? 'bg-green-200 text-green-800' :
                  item.status === SnagItemStatus.ACKNOWLEDGED ? 'bg-blue-200 text-blue-800' :
                  item.status === SnagItemStatus.DISPUTED ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View All Items</Button>
      </CardFooter>
    </Card>
  );
};

const HomePackItemsList = ({ items }: HomePackItemsListProps) => {
  if (!items || items.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Items Available</AlertTitle>
        <AlertDescription>
          No home pack items are available for this property yet.
        </AlertDescription>
      </Alert>
    );
  }

  const groupedItems = items.reduce<Record<string, HomePackItem[]>>((acc: Record<string, HomePackItem[]>, item: HomePackItem) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-lg font-medium mb-2">{category}</h3>
          <div className="space-y-2">
            {categoryItems.map((item: HomePackItem) => (
              <div key={item.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.issuer && <p className="text-sm text-gray-500">Issuer: {item.issuer}</p>}
                  </div>
                  {item.expiryDate && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Expires: {formatDate(item.expiryDate)}
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <Button size="sm" asChild>
                    <a href={item.documentUrl} target="_blank" rel="noopener noreferrer">View Document</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function FirstTimeBuyerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { 
    useMyBuyerProfile, 
    useMyReservations, 
    useMyMortgageTracking,
    useMySnagLists,
    useHomePackItems,
  } = useBuyerAPI();

  // Fetch buyer data
  const { 
    data: buyerProfile, 
    isLoading: isLoadingProfile, 
    error: profileError 
  } = useMyBuyerProfile();
  
  const { 
    data: reservations, 
    isLoading: isLoadingReservations 
  } = useMyReservations();
  
  const { 
    data: mortgageTracking,
    isLoading: isLoadingMortgage
  } = useMyMortgageTracking();
  
  const { 
    data: snagLists,
    isLoading: isLoadingSnagLists 
  } = useMySnagLists();

  // We'll fetch home pack items only if there's a property (from a reservation)
  const activeProperty = reservations && reservations.length > 0 
    ? reservations.find((r: Reservation) => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.COMPLETED)?.property
    : null;
  
  const { 
    data: homePackItems,
    isLoading: isLoadingHomePackItems 
  } = useHomePackItems(activeProperty?.id);

  // Handle errors
  useEffect(() => {
    if (profileError) {
      toast.error({
        title: "Error",
        description: "Failed to load your buyer profile"
      });
    }
  }, [profileError, toast]);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Loading state
  if (isLoadingProfile || isLoadingReservations || isLoadingMortgage || isLoadingSnagLists) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">First-Time Buyer Dashboard</h1>
        <p className="text-gray-500">Manage your property buying journey from start to finish</p>
      </div>

      {buyerProfile ? (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buying Journey</CardTitle>
                <CardDescription>Track your progress through the buying process</CardDescription>
              </CardHeader>
              <CardContent>
                <BuyerJourneyPhaseDisplay phase={buyerProfile.currentJourneyPhase} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Personal Details</h3>
                  <p className="font-medium">{user?.name || 'N/A'}</p>
                  <p>{user?.email || 'N/A'}</p>
                </div>
                
                {buyerProfile.preferences && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Your Preferences</h3>
                    <div className="text-sm">
                      {Object.entries(buyerProfile.preferences).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {buyerProfile.governmentSchemes && Object.keys(buyerProfile.governmentSchemes).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Government Schemes</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(buyerProfile.governmentSchemes)
                        .filter(([_, value]) => value === true)
                        .map(([key]) => (
                          <Badge key={key} variant="outline">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Update Your Profile</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Column - Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="reservations">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="reservations">Reservations</TabsTrigger>
                <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
                <TabsTrigger value="snags">Snag Lists</TabsTrigger>
                <TabsTrigger value="homepack">Home Pack</TabsTrigger>
              </TabsList>

              <TabsContent value="reservations" className="space-y-4">
                <h2 className="text-2xl font-bold">Your Reservations</h2>
                {reservations && reservations.length > 0 ? (
                  reservations.map((reservation: Reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))
                ) : (
                  <Alert>
                    <AlertTitle>No Reservations</AlertTitle>
                    <AlertDescription>
                      You haven't made any property reservations yet. Browse our available properties to find your dream home.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end mt-4">
                  <Button onClick={() => router.push('/properties')}>Browse Properties</Button>
                </div>
              </TabsContent>

              <TabsContent value="mortgage">
                <h2 className="text-2xl font-bold mb-4">Mortgage Tracking</h2>
                <MortgageTrackingCard mortgageTracking={mortgageTracking} />
              </TabsContent>

              <TabsContent value="snags">
                <h2 className="text-2xl font-bold mb-4">Snag Lists</h2>
                {snagLists && snagLists.length > 0 ? (
                  snagLists.map((snagList: SnagList) => (
                    <SnagListCard key={snagList.id} snagList={snagList} />
                  ))
                ) : (
                  <Alert>
                    <AlertTitle>No Snag Lists</AlertTitle>
                    <AlertDescription>
                      You don't have any snag lists yet. These become available after completing a property purchase.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="homepack">
                <h2 className="text-2xl font-bold mb-4">Digital Home Pack</h2>
                {activeProperty ? (
                  <div className="space-y-4">
                    <p className="text-gray-500">
                      Essential documents for your property at {activeProperty.name}:
                    </p>
                    {isLoadingHomePackItems ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <HomePackItemsList items={homePackItems} />
                    )}
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>No Property Selected</AlertTitle>
                    <AlertDescription>
                      Home pack items become available after you have reserved and purchased a property.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Welcome to First-Time Buyer Services</h2>
          <p className="mb-6 text-gray-600">
            It looks like you haven't set up your buyer profile yet. Let's get started with creating your profile to 
            help you track your home buying journey.
          </p>
          <Button onClick={() => router.push('/buyer/setup')}>Set Up Your Buyer Profile</Button>
        </div>
      )}
    </div>
  );
}