import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BuyerData {
  profile: {
    name: string;
    email: string;
    phone: string;
    type: 'first-time' | 'move-up' | 'investor';
    budget: {
      min: number;
      max: number;
    };
  };
  searches: Array<{
    id: string;
    query: string;
    date: Date;
    results: number;
  }>\n  );
  viewings: Array<{
    id: string;
    propertyId: string;
    propertyName: string;
    date: Date;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>\n  );
  offers: Array<{
    id: string;
    propertyId: string;
    propertyName: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    date: Date;
  }>\n  );
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: Date;
    status: 'pending' | 'verified' | 'rejected';
  }>\n  );
  timeline: Array<{
    id: string;
    event: string;
    date: Date;
    type: 'milestone' | 'activity' | 'document';
  }>\n  );
}

export function useBuyerData() {
  const [buyerDatasetBuyerData] = useState<BuyerData>({
    profile: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+353 86 123 4567',
      type: 'first-time',
      budget: {
        min: 300000,
        max: 450000},
    searches: [
      {
        id: '1',
        query: '3 bed house Dublin',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        results: 45},
      {
        id: '2',
        query: 'New developments Kildare',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        results: 12}],
    viewings: [
      {
        id: '1',
        propertyId: 'prop1',
        propertyName: 'Fitzgerald Gardens - Unit 12',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'scheduled'}],
    offers: [],
    documents: [
      {
        id: '1',
        name: 'Mortgage Approval in Principle',
        type: 'financial',
        uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'verified'}],
    timeline: [
      {
        id: '1',
        event: 'Started property search',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        type: 'milestone'},
      {
        id: '2',
        event: 'Pre-approval obtained',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        type: 'milestone'}]});

  const [isLoadingsetIsLoading] = useState(false);

  const updateProfile = async (updates: Partial<BuyerData['profile']>) => {
    try {
      setBuyerData(prev => ({
        ...prev,
        profile: { ...prev.profile, ...updates }));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const scheduleViewing = async (viewing: Omit<BuyerData['viewings'][0], 'id'>) => {
    try {
      const newViewing = {
        id: Math.random().toString(36).substr(29),
        ...viewing};

      setBuyerData(prev => ({
        ...prev,
        viewings: [...prev.viewingsnewViewing]}));

      toast.success('Viewing scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule viewing');
    }
  };

  const makeOffer = async (offer: Omit<BuyerData['offers'][0], 'id' | 'date' | 'status'>) => {
    try {
      const newOffer = {
        id: Math.random().toString(36).substr(29),
        ...offer,
        date: new Date(),
        status: 'pending' as const};

      setBuyerData(prev => ({
        ...prev,
        offers: [...prev.offersnewOffer]}));

      toast.success('Offer submitted successfully');
    } catch (error) {
      toast.error('Failed to submit offer');
    }
  };

  const uploadDocument = async (document: Omit<BuyerData['documents'][0], 'id' | 'uploadDate' | 'status'>) => {
    try {
      const newDocument = {
        id: Math.random().toString(36).substr(29),
        ...document,
        uploadDate: new Date(),
        status: 'pending' as const};

      setBuyerData(prev => ({
        ...prev,
        documents: [...prev.documentsnewDocument]}));

      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  return {
    buyerData,
    isLoading,
    updateProfile,
    scheduleViewing,
    makeOffer,
    uploadDocument};
}