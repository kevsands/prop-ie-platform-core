'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { BuyerJourney, BuyerPhase, AffordabilityCheck, MortgageApplication } from '@/types/buyer-journey';
import { journeyService } from '@/services/journeyService';
import { useToast } from '@/hooks/useToast';

interface BuyerJourneyContextProps {
  journey: BuyerJourney | null;
  loading: boolean;
  error: string | null;
  updateJourneyPhase: (phase: BuyerPhase) => Promise<void>;
  addAffordabilityCheck: (check: Omit<AffordabilityCheck, 'id' | 'created'>) => Promise<void>;
  addMortgageApplication: (app: Omit<MortgageApplication, 'id' | 'created' | 'updated'>) => Promise<void>;
  refreshJourney: () => Promise<void>;
  getPhaseNextSteps: (phase: BuyerPhase) => Promise<string[]>;
  getPhaseCompletedTasks: (phase: BuyerPhase) => Promise<string[]>;
}

const BuyerJourneyContext = createContext<BuyerJourneyContextProps | undefined>(undefined);

export const BuyerJourneyProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({
  children,
  userId,
}) => {
  const [journey, setJourney] = useState<BuyerJourney | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJourney = async () => {
    setLoading(true);
    try {
      const journeyData = await journeyService.getBuyerJourney(userId);
      setJourney(journeyData);
      setError(null);
    } catch (error) {
      console.error('Error fetching buyer journey:', error);
      setError('Failed to load journey data');
      toast({
        title: 'Error',
        description: 'Failed to load your journey data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchJourney();
    }
  }, [userId]);

  const updateJourneyPhase = async (phase: BuyerPhase) => {
    if (!journey) return;
    
    try {
      const updatedJourney = await journeyService.updateBuyerPhase(journey.id, phase);
      setJourney(updatedJourney);
      toast({
        title: 'Journey Updated',
        description: `You've progressed to the ${phase.toLowerCase().replace('_', ' ')} phase.`,
      });
    } catch (error) {
      console.error('Error updating journey phase:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update your journey. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addAffordabilityCheck = async (check: Omit<AffordabilityCheck, 'id' | 'created'>) => {
    try {
      await journeyService.addAffordabilityCheck(check);
      toast({
        title: 'Affordability Check Saved',
        description: 'Your affordability information has been saved.',
      });
      await fetchJourney(); // Refresh journey data
    } catch (error) {
      console.error('Error adding affordability check:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save your affordability check. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addMortgageApplication = async (app: Omit<MortgageApplication, 'id' | 'created' | 'updated'>) => {
    try {
      await journeyService.addMortgageApplication(app);
      toast({
        title: 'Mortgage Application Saved',
        description: 'Your mortgage application has been saved.',
      });
      await fetchJourney(); // Refresh journey data
    } catch (error) {
      console.error('Error adding mortgage application:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save your mortgage application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getPhaseNextSteps = async (phase: BuyerPhase) => {
    if (!journey) return [];
    try {
      return await journeyService.getPhaseNextSteps(journey.id, phase);
    } catch (error) {
      console.error('Error fetching next steps:', error);
      return [];
    }
  };

  const getPhaseCompletedTasks = async (phase: BuyerPhase) => {
    if (!journey) return [];
    try {
      return await journeyService.getPhaseCompletedTasks(journey.id, phase);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      return [];
    }
  };

  return (
    <BuyerJourneyContext.Provider
      value={{
        journey,
        loading,
        error,
        updateJourneyPhase,
        addAffordabilityCheck,
        addMortgageApplication,
        refreshJourney: fetchJourney,
        getPhaseNextSteps,
        getPhaseCompletedTasks,
      }}
    >
      {children}
    </BuyerJourneyContext.Provider>
  );
};

export const useBuyerJourney = () => {
  const context = useContext(BuyerJourneyContext);
  if (context === undefined) {
    throw new Error('useBuyerJourney must be used within a BuyerJourneyProvider');
  }
  return context;
};