/**
 * Guided Tour Component
 * Interactive onboarding system that introduces users to key features
 * with smart contextual hints and progressive disclosure
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lightbulb,
  Target,
  Sparkles,
  Home,
  Heart,
  Settings,
  TrendingUp,
  Award,
  Info,
  Zap
} from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionButton?: {
    text: string;
    action: () => void;
  };
  skipCondition?: () => boolean; // Skip this step if condition is true
  beforeShow?: () => void; // Execute before showing this step
  afterShow?: () => void; // Execute after showing this step
}

export interface TourConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  steps: TourStep[];
  completionAction?: () => void;
}

interface GuidedTourProps {
  tours: TourConfig[];
  activeTourId?: string;
  onTourComplete?: (tourId: string) => void;
  onTourSkip?: (tourId: string) => void;
  onTourStart?: (tourId: string) => void;
}

interface TourState {
  isActive: boolean;
  activeTour: TourConfig | null;
  currentStepIndex: number;
  completedTours: string[];
  skippedTours: string[];
}

export default function GuidedTour({
  tours,
  activeTourId,
  onTourComplete,
  onTourSkip,
  onTourStart
}: GuidedTourProps) {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    activeTour: null,
    currentStepIndex: 0,
    completedTours: [],
    skippedTours: []
  });

  const [highlightElement, setHighlightElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Load completed tours from localStorage
  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completedTours') || '[]');
    const skipped = JSON.parse(localStorage.getItem('skippedTours') || '[]');
    setTourState(prev => ({ ...prev, completedTours: completed, skippedTours: skipped }));
  }, []);

  // Auto-start tour if specified
  useEffect(() => {
    if (activeTourId && !tourState.isActive) {
      const tour = tours.find(t => t.id === activeTourId);
      if (tour && !tourState.completedTours.includes(activeTourId)) {
        startTour(activeTourId);
      }
    }
  }, [activeTourId, tours, tourState.completedTours, tourState.isActive]);

  // Update highlight and tooltip position when step changes
  useEffect(() => {
    if (tourState.isActive && tourState.activeTour) {
      const currentStep = tourState.activeTour.steps[tourState.currentStepIndex];
      if (currentStep) {
        updateHighlight(currentStep);
      }
    }
  }, [tourState.isActive, tourState.activeTour, tourState.currentStepIndex]);

  const startTour = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return;

    setTourState(prev => ({
      ...prev,
      isActive: true,
      activeTour: tour,
      currentStepIndex: 0
    }));

    onTourStart?.(tourId);

    // Execute beforeShow for first step
    if (tour.steps[0]?.beforeShow) {
      tour.steps[0].beforeShow();
    }
  };

  const updateHighlight = (step: TourStep) => {
    // Skip if condition is met
    if (step.skipCondition && step.skipCondition()) {
      nextStep();
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      setHighlightElement(targetElement);
      calculateTooltipPosition(targetElement, step.position);
      
      // Scroll element into view
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Execute afterShow
      if (step.afterShow) {
        setTimeout(step.afterShow, 500);
      }
    } else {
      // Element not found, try again in a moment
      setTimeout(() => updateHighlight(step), 500);
    }
  };

  const calculateTooltipPosition = (element: Element, position: string) => {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top + scrollTop - 20;
        left = rect.left + scrollLeft + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + scrollTop + 20;
        left = rect.left + scrollLeft + rect.width / 2;
        break;
      case 'left':
        top = rect.top + scrollTop + rect.height / 2;
        left = rect.left + scrollLeft - 20;
        break;
      case 'right':
        top = rect.top + scrollTop + rect.height / 2;
        left = rect.right + scrollLeft + 20;
        break;
      case 'center':
        top = window.innerHeight / 2 + scrollTop;
        left = window.innerWidth / 2 + scrollLeft;
        break;
    }

    setTooltipPosition({ top, left });
  };

  const nextStep = () => {
    if (!tourState.activeTour) return;

    const nextIndex = tourState.currentStepIndex + 1;
    
    if (nextIndex >= tourState.activeTour.steps.length) {
      completeTour();
    } else {
      setTourState(prev => ({ ...prev, currentStepIndex: nextIndex }));
      
      // Execute beforeShow for next step
      const nextStep = tourState.activeTour.steps[nextIndex];
      if (nextStep?.beforeShow) {
        nextStep.beforeShow();
      }
    }
  };

  const previousStep = () => {
    if (tourState.currentStepIndex > 0) {
      setTourState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }));
    }
  };

  const skipTour = () => {
    if (!tourState.activeTour) return;

    const updatedSkipped = [...tourState.skippedTours, tourState.activeTour.id];
    localStorage.setItem('skippedTours', JSON.stringify(updatedSkipped));
    
    setTourState(prev => ({
      ...prev,
      isActive: false,
      activeTour: null,
      currentStepIndex: 0,
      skippedTours: updatedSkipped
    }));

    setHighlightElement(null);
    onTourSkip?.(tourState.activeTour.id);
  };

  const completeTour = () => {
    if (!tourState.activeTour) return;

    const updatedCompleted = [...tourState.completedTours, tourState.activeTour.id];
    localStorage.setItem('completedTours', JSON.stringify(updatedCompleted));
    
    // Execute completion action
    if (tourState.activeTour.completionAction) {
      tourState.activeTour.completionAction();
    }

    setTourState(prev => ({
      ...prev,
      isActive: false,
      activeTour: null,
      currentStepIndex: 0,
      completedTours: updatedCompleted
    }));

    setHighlightElement(null);
    onTourComplete?.(tourState.activeTour.id);
  };

  const restartTour = (tourId: string) => {
    const updatedCompleted = tourState.completedTours.filter(id => id !== tourId);
    const updatedSkipped = tourState.skippedTours.filter(id => id !== tourId);
    
    localStorage.setItem('completedTours', JSON.stringify(updatedCompleted));
    localStorage.setItem('skippedTours', JSON.stringify(updatedSkipped));
    
    setTourState(prev => ({
      ...prev,
      completedTours: updatedCompleted,
      skippedTours: updatedSkipped
    }));

    startTour(tourId);
  };

  if (!tourState.isActive || !tourState.activeTour) {
    return (
      <TourLauncher
        tours={tours}
        completedTours={tourState.completedTours}
        skippedTours={tourState.skippedTours}
        onStartTour={startTour}
        onRestartTour={restartTour}
      />
    );
  }

  const currentStep = tourState.activeTour.steps[tourState.currentStepIndex];
  const progress = ((tourState.currentStepIndex + 1) / tourState.activeTour.steps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        style={{
          clipPath: highlightElement
            ? `polygon(0% 0%, 0% 100%, ${
                highlightElement.getBoundingClientRect().left - 4
              }px 100%, ${
                highlightElement.getBoundingClientRect().left - 4
              }px ${
                highlightElement.getBoundingClientRect().top - 4
              }px, ${
                highlightElement.getBoundingClientRect().right + 4
              }px ${
                highlightElement.getBoundingClientRect().top - 4
              }px, ${
                highlightElement.getBoundingClientRect().right + 4
              }px ${
                highlightElement.getBoundingClientRect().bottom + 4
              }px, ${
                highlightElement.getBoundingClientRect().left - 4
              }px ${
                highlightElement.getBoundingClientRect().bottom + 4
              }px, ${
                highlightElement.getBoundingClientRect().left - 4
              }px 100%, 100% 100%, 100% 0%)`
            : 'none'
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] max-w-sm bg-white rounded-lg shadow-xl border border-gray-200"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <tourState.activeTour.icon className="text-white" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentStep.title}</h3>
                <p className="text-xs text-gray-500">
                  Step {tourState.currentStepIndex + 1} of {tourState.activeTour.steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={skipTour}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              {currentStep.content}
            </p>
          </div>

          {/* Action Button */}
          {currentStep.actionButton && (
            <div className="mb-4">
              <button
                onClick={currentStep.actionButton.action}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play size={16} />
                {currentStep.actionButton.text}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={previousStep}
              disabled={tourState.currentStepIndex === 0}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={skipTour}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Skip Tour
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {tourState.currentStepIndex === tourState.activeTour.steps.length - 1 ? (
                  <>
                    <CheckCircle size={16} />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Tour Launcher Component
interface TourLauncherProps {
  tours: TourConfig[];
  completedTours: string[];
  skippedTours: string[];
  onStartTour: (tourId: string) => void;
  onRestartTour: (tourId: string) => void;
}

function TourLauncher({
  tours,
  completedTours,
  skippedTours,
  onStartTour,
  onRestartTour
}: TourLauncherProps) {
  const [showLauncher, setShowLauncher] = useState(false);

  // Show launcher if there are available tours
  const availableTours = tours.filter(tour => 
    !completedTours.includes(tour.id) && !skippedTours.includes(tour.id)
  );

  const completedToursList = tours.filter(tour => completedTours.includes(tour.id));

  if (availableTours.length === 0 && completedToursList.length === 0) {
    return null;
  }

  return (
    <>
      {/* Tour Launcher Button */}
      <button
        onClick={() => setShowLauncher(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center justify-center group"
        title="Take a guided tour"
      >
        <Lightbulb size={20} className="group-hover:animate-pulse" />
        {availableTours.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {availableTours.length}
          </span>
        )}
      </button>

      {/* Tour Selection Modal */}
      {showLauncher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Guided Tours</h2>
                  <p className="text-gray-600 text-sm">Learn how to use PROP.ie effectively</p>
                </div>
                <button
                  onClick={() => setShowLauncher(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Available Tours */}
              {availableTours.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Available Tours</h3>
                  <div className="space-y-3">
                    {availableTours.map((tour) => (
                      <div
                        key={tour.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                        onClick={() => {
                          onStartTour(tour.id);
                          setShowLauncher(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <tour.icon className="text-white" size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{tour.name}</h4>
                            <p className="text-sm text-gray-600">{tour.description}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {tour.steps.length} steps • 2-3 minutes
                            </p>
                          </div>
                          <ArrowRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tours */}
              {completedToursList.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Completed Tours</h3>
                  <div className="space-y-3">
                    {completedToursList.map((tour) => (
                      <div
                        key={tour.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-white" size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{tour.name}</h4>
                            <p className="text-sm text-gray-600">{tour.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              onRestartTour(tour.id);
                              setShowLauncher(false);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Replay
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}