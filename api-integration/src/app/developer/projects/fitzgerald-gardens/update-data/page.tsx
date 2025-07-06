import React from 'react';
import FitzgeraldGardensDataUpdater from '@/components/developer/FitzgeraldGardensDataUpdater';

export const metadata = {
  title: 'Update Fitzgerald Gardens Data | Developer Portal',
  description: 'Update real project data for Fitzgerald Gardens development'
};

export default function UpdateFitzgeraldGardensDataPage() {
  return (
    <div className="min-h-screen bg-background">
      <FitzgeraldGardensDataUpdater />
    </div>
  );
}