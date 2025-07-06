/**
 * First-Time Buyer Promotion Component
 * 
 * This component displays information about First-Time Buyer services on the main buyer dashboard.
 * It encourages users to set up their First-Time Buyer profile and explore the services.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiHome, FiClipboard, FiTool, FiFileText } from 'react-icons/fi';
import { FeatherIcon } from '@/components/ui/feather-icon';

const FirstTimeBuyerPromotion = () => {
  return (
    <Card className="border border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-blue-800">First-Time Buyer Services</CardTitle>
        <CardDescription>Specialized tools to guide you through your home buying journey</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FeatherIcon icon={FiHome} className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Personalized Journey</h3>
              <p className="text-sm text-blue-700">Track your progress from planning to moving in</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FeatherIcon icon={FiClipboard} className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Property Reservations</h3>
              <p className="text-sm text-blue-700">Reserve your dream home and manage deposit payments</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FeatherIcon icon={FiTool} className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Digital Snagging</h3>
              <p className="text-sm text-blue-700">Report and track property issues after completion</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FeatherIcon icon={FiFileText} className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Digital Home Pack</h3>
              <p className="text-sm text-blue-700">Access all your property documents in one place</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FirstTimeBuyerPromotion;