import React from 'react';
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SecurityMetricsSkeletonProps {
  showCharts?: boolean;
  showTimeline?: boolean;
  columns?: 2 | 3 | 4;
  rows?: number;
}

/**
 * Enhanced loading skeleton for security metrics
 * 
 * Provides a smooth loading experience for security dashboard components
 * Compatible with AWS Amplify v6 and Next.js App Router architecture
 * Used in Suspense boundaries for server components
 * 
 * @param props Configuration options for the skeleton
 */
export function SecurityMetricsSkeleton({
  showCharts = true,
  showTimeline = true,
  columns = 4,
  rows = 1
}: SecurityMetricsSkeletonProps) {
  // Function to generate random width for more natural-looking skeletons
  const randomWidth = (min: number, max: number) => {
    return `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
  };

  // Function to create a pulse effect class
  const pulseClass = "animate-pulse";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Skeleton className={`h-8 w-64 mb-2 ${pulseClass}`} />
        <Skeleton className={`h-4 w-96 ${pulseClass}`} />
      </div>

      {/* Security status skeleton */}
      <div className="mb-6 p-4 rounded-lg border border-gray-200 flex items-center">
        <Skeleton className={`h-6 w-6 rounded-full mr-2 ${pulseClass}`} />
        <div className="space-y-2 flex-1">
          <Skeleton className={`h-5 w-48 ${pulseClass}`} />
          <Skeleton className={`h-4 w-72 ${pulseClass}`} />
        </div>
      </div>

      {/* Metric cards skeleton */}
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {Array(columns * rows).fill(0).map((_i: any) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className={`h-4 w-24 ${pulseClass}`} />
            </CardHeader>
            <CardContent>
              <Skeleton className={`h-8 w-32 mb-4 ${pulseClass}`} />
              <Skeleton className={`h-2 w-full mb-2 ${pulseClass}`} />
              <Skeleton className={`h-2 w-${randomWidth(7090)} ${pulseClass}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard tabs skeleton */}
      <div>
        <div className="border-b mb-4">
          <div className="flex">
            {Array(3).fill(0).map((_i: any) => (
              <Skeleton key={i} className={`h-10 w-32 mx-1 ${pulseClass}`} />
            ))}
          </div>
        </div>

        {/* Security events skeleton */}
        {showTimeline && (
          <Card>
            <CardHeader>
              <Skeleton className={`h-6 w-48 ${pulseClass}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(5).fill(0).map((_i: any) => (
                  <div key={i} className="flex items-center border-b pb-3 last:border-0">
                    <div className={`h-10 w-10 rounded-full mr-3 bg-gray-200 ${pulseClass}`} />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <Skeleton className={`h-4 w-${randomWidth(3050)} ${pulseClass}`} />
                        <Skeleton className={`h-3 w-24 ${pulseClass}`} />
                      </div>
                      <Skeleton className={`h-3 w-${randomWidth(7095)} ${pulseClass}`} />
                      <div className="grid grid-cols-3 gap-2">
                        <Skeleton className={`h-2 w-${randomWidth(5090)} ${pulseClass}`} />
                        <Skeleton className={`h-2 w-${randomWidth(5090)} ${pulseClass}`} />
                        <Skeleton className={`h-2 w-${randomWidth(5090)} ${pulseClass}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chart skeleton */}
        {showCharts && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <Skeleton className={`h-6 w-48 ${pulseClass}`} />
              </CardHeader>
              <CardContent>
                <div className={`h-72 w-full relative ${pulseClass}`}>
                  {/* Simulate chart lines for more realistic loading skeleton */}
                  <div className="absolute bottom-0 left-0 right-0 h-60">
                    <div className="relative h-full">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
                        {Array(5).fill(0).map((_i: any) => (
                          <Skeleton key={i} className="h-3 w-8" />
                        ))}
                      </div>

                      {/* X-axis labels */}
                      <div className="absolute left-12 right-0 bottom-0 h-5 flex justify-between">
                        {Array(6).fill(0).map((_i: any) => (
                          <Skeleton key={i} className="h-3 w-12" />
                        ))}
                      </div>

                      {/* Chart area */}
                      <div className="absolute left-12 right-0 top-0 bottom-6 bg-gray-50 rounded">
                        {/* Horizontal grid lines */}
                        {Array(4).fill(0).map((_i: any) => (
                          <div 
                            key={i} 
                            className="border-t border-gray-200 absolute w-full" 
                            style={ top: `${(i + 1) * 20}%` }
                          />
                        ))}

                        {/* Vertical grid lines */}
                        {Array(5).fill(0).map((_i: any) => (
                          <div 
                            key={i} 
                            className="border-l border-gray-200 absolute h-full" 
                            style={ left: `${(i + 1) * 20}%` }
                          />
                        ))}

                        {/* Chart "data" line */}
                        <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-t from-blue-200/30 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}