'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export interface Viewing {
  id: string;
  propertyId: string;
  propertyAddress: string;
  clientName: string;
  clientEmail: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function ViewingScheduler() {
  const [viewingssetViewings] = useState<Viewing[]>([]);
  const [selectedDatesetSelectedDate] = useState(new Date());

  const todaysViewings = viewings.filter(viewing => {
    const viewingDate = new Date(viewing.scheduledDate);
    return viewingDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Viewing Scheduler</h1>
        <Button variant="default">
          Schedule New Viewing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Today's Viewings</h2>
            <div className="space-y-4">
              {todaysViewings.length === 0 ? (
                <p className="text-gray-500">No viewings scheduled for today</p>
              ) : (
                todaysViewings.map((viewing: any) => (
                  <div key={viewing.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{viewing.propertyAddress}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {viewing.clientName}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {viewing.scheduledTime} ({viewing.duration} min)
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {viewing.propertyAddress}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Calendar</h2>
            <div className="space-y-4">
              {/* Simple calendar placeholder */}
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Calendar view coming soon</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-medium">12 viewings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-medium">48 viewings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium">32%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}