/**
 * Tour Definitions
 * Pre-configured guided tours for different user journeys and features
 */

import { TourConfig } from '@/components/onboarding/GuidedTour';
import { 
  Home, 
  Target, 
  Sparkles, 
  Heart, 
  Calculator,
  FileText,
  TrendingUp,
  User,
  Settings,
  Search,
  Award,
  PiggyBank,
  Building2,
  Shield
} from 'lucide-react';

/**
 * First-Time Buyer Journey Tour
 * Comprehensive introduction for new users
 */
export const firstTimeBuyerTour: TourConfig = {
  id: 'first-time-buyer',
  name: 'First-Time Buyer Guide',
  description: 'Complete walkthrough of your property buying journey',
  icon: Home,
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to PROP.ie!',
      content: 'Ireland\'s most advanced property platform. We\'ll help you find your perfect home using AI-powered recommendations tailored to your needs.',
      target: 'body',
      position: 'center'
    },
    {
      id: 'profile-completion',
      title: 'Complete Your Profile',
      content: 'The more we know about your preferences, budget, and needs, the better we can match you with perfect properties. Let\'s start with your profile.',
      target: '[data-tour="profile-completion"]',
      position: 'bottom',
      actionButton: {
        text: 'Complete Profile',
        action: () => window.location.href = '/buyer/profile-completion'
      },
      skipCondition: () => {
        const profile = localStorage.getItem('userRegistration');
        return profile ? JSON.parse(profile).completionScore >= 75 : false;
      }
    },
    {
      id: 'ai-recommendations',
      title: 'AI Property Recommendations',
      content: 'Our AI analyzes your preferences to recommend properties that match your criteria. Each property shows a match score and explains why it\'s perfect for you.',
      target: '[data-tour="recommendations"]',
      position: 'top'
    },
    {
      id: 'match-scores',
      title: 'Understanding Match Scores',
      content: 'Match scores range from 0-100% based on budget, location, size, features, and financial suitability. Higher scores mean better fits for your needs.',
      target: '[data-tour="match-score"]',
      position: 'left'
    },
    {
      id: 'property-explanations',
      title: 'Why This Property?',
      content: 'Each recommendation comes with detailed explanations showing exactly why it matches your criteria - from budget fit to feature preferences.',
      target: '[data-tour="property-explanation"]',
      position: 'right'
    },
    {
      id: 'save-favorites',
      title: 'Save Your Favorites',
      content: 'Click the heart icon to save properties you love. Your favorites are automatically analyzed to improve future recommendations.',
      target: '[data-tour="favorite-button"]',
      position: 'top'
    },
    {
      id: 'htb-calculator',
      title: 'Help to Buy Calculator',
      content: 'As a first-time buyer, you may be eligible for up to €30,000 through the Help to Buy scheme. Use our calculator to see your potential savings.',
      target: '[data-tour="htb-calculator"]',
      position: 'bottom',
      actionButton: {
        text: 'Check HTB Eligibility',
        action: () => window.location.href = '/buyer/htb/calculator'
      }
    },
    {
      id: 'journey-tracking',
      title: 'Track Your Progress',
      content: 'Monitor your buying journey with our progress tracker. See completed tasks, upcoming milestones, and estimated timeline to purchase.',
      target: '[data-tour="journey-progress"]',
      position: 'left'
    }
  ],
  completionAction: () => {
    localStorage.setItem('onboardingCompleted', 'true');
  }
};

/**
 * Property Recommendation Tour
 * Focused on understanding the AI recommendation system
 */
export const recommendationTour: TourConfig = {
  id: 'recommendations',
  name: 'AI Recommendations',
  description: 'Learn how our AI finds your perfect properties',
  icon: Sparkles,
  steps: [
    {
      id: 'recommendation-overview',
      title: 'Smart Property Matching',
      content: 'Our AI analyzes thousands of properties and ranks them based on how well they match your specific needs and preferences.',
      target: '[data-tour="recommendations-header"]',
      position: 'bottom'
    },
    {
      id: 'analytics-dashboard',
      title: 'Recommendation Analytics',
      content: 'See how many properties were analyzed, your average match scores, and profile completeness to understand the quality of recommendations.',
      target: '[data-tour="analytics"]',
      position: 'top'
    },
    {
      id: 'filtering-system',
      title: 'Smart Filtering',
      content: 'Filter properties by match score, price, bedrooms, and features. Our filters work with the AI to show you the most relevant results.',
      target: '[data-tour="filters"]',
      position: 'bottom'
    },
    {
      id: 'view-modes',
      title: 'Grid and List Views',
      content: 'Switch between grid view for quick browsing and list view for detailed comparisons with full explanations.',
      target: '[data-tour="view-modes"]',
      position: 'left'
    },
    {
      id: 'refresh-recommendations',
      title: 'Fresh Recommendations',
      content: 'As you save favorites and update preferences, click refresh to get newly optimized recommendations based on your evolving taste.',
      target: '[data-tour="refresh-button"]',
      position: 'bottom'
    }
  ]
};

/**
 * Profile Optimization Tour
 * Help users complete and optimize their profiles
 */
export const profileTour: TourConfig = {
  id: 'profile-optimization',
  name: 'Profile Optimization',
  description: 'Maximize your recommendation accuracy',
  icon: User,
  steps: [
    {
      id: 'completion-score',
      title: 'Profile Completion Score',
      content: 'Your completion score affects recommendation quality. Higher scores mean more accurate and personalized property matches.',
      target: '[data-tour="completion-score"]',
      position: 'right'
    },
    {
      id: 'financial-details',
      title: 'Financial Information',
      content: 'Adding your budget, deposit, and HTB status helps us show properties you can actually afford and qualify for.',
      target: '[data-tour="financial-section"]',
      position: 'top'
    },
    {
      id: 'preferences',
      title: 'Property Preferences',
      content: 'Tell us about preferred areas, property types, and must-have features. This dramatically improves match accuracy.',
      target: '[data-tour="preferences-section"]',
      position: 'bottom'
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      content: 'Complete KYC verification to unlock premium features like mortgage pre-approval and property reservations.',
      target: '[data-tour="verification"]',
      position: 'left'
    }
  ]
};

/**
 * Dashboard Navigation Tour
 * Quick overview of main dashboard features
 */
export const dashboardTour: TourConfig = {
  id: 'dashboard-navigation',
  name: 'Dashboard Overview',
  description: 'Navigate your buyer dashboard like a pro',
  icon: TrendingUp,
  steps: [
    {
      id: 'quick-stats',
      title: 'Your Property Stats',
      content: 'Get an instant overview of recommended properties, saved favorites, profile completion, and best match scores.',
      target: '[data-tour="quick-stats"]',
      position: 'bottom'
    },
    {
      id: 'recommended-properties',
      title: 'Top Recommendations',
      content: 'Your highest-scoring property matches appear here. These are the properties most likely to meet your needs.',
      target: '[data-tour="recommended-properties"]',
      position: 'top'
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      content: 'Common tasks like updating your profile, calculating affordability, and scheduling viewings are just one click away.',
      target: '[data-tour="quick-actions"]',
      position: 'left'
    },
    {
      id: 'progress-tracking',
      title: 'Journey Progress',
      content: 'Track your home buying milestones, from profile completion to document verification and property selection.',
      target: '[data-tour="progress-tracking"]',
      position: 'right'
    }
  ]
};

/**
 * HTB (Help to Buy) Tour
 * Specific guide for Help to Buy features
 */
export const htbTour: TourConfig = {
  id: 'help-to-buy',
  name: 'Help to Buy Guide',
  description: 'Maximize your €30,000 government benefit',
  icon: PiggyBank,
  steps: [
    {
      id: 'htb-overview',
      title: 'Help to Buy Scheme',
      content: 'First-time buyers can get up to €30,000 (10% of property value) back from the government when buying a new home.',
      target: '[data-tour="htb-info"]',
      position: 'center'
    },
    {
      id: 'eligibility-check',
      title: 'Check Your Eligibility',
      content: 'Use our calculator to see if you qualify and how much you could save. Requirements include being a first-time buyer and meeting income limits.',
      target: '[data-tour="htb-calculator"]',
      position: 'bottom'
    },
    {
      id: 'eligible-properties',
      title: 'HTB Eligible Properties',
      content: 'Look for the "HTB Eligible" badge on new properties. These qualify for the Help to Buy scheme and show in our filters.',
      target: '[data-tour="htb-badge"]',
      position: 'top'
    },
    {
      id: 'application-process',
      title: 'Application Process',
      content: 'We guide you through the HTB application process and help coordinate with developers to claim your benefit at purchase.',
      target: '[data-tour="htb-application"]',
      position: 'right'
    }
  ]
};

/**
 * Mobile Experience Tour
 * Optimized for mobile users
 */
export const mobileTour: TourConfig = {
  id: 'mobile-experience',
  name: 'Mobile Features',
  description: 'Property search on the go',
  icon: Settings,
  steps: [
    {
      id: 'mobile-search',
      title: 'Search Anywhere',
      content: 'Browse properties, check recommendations, and save favorites from anywhere using our mobile-optimized interface.',
      target: '[data-tour="mobile-search"]',
      position: 'center'
    },
    {
      id: 'location-features',
      title: 'Location-Based Search',
      content: 'Enable location services to see properties near you and get distance-based recommendations for your daily commute.',
      target: '[data-tour="location-search"]',
      position: 'top'
    },
    {
      id: 'offline-favorites',
      title: 'Offline Access',
      content: 'Your saved properties and profile sync across devices and work offline, so you never lose important information.',
      target: '[data-tour="offline-sync"]',
      position: 'bottom'
    }
  ]
};

/**
 * Property Comparison Tour
 * Guide for comparing multiple properties
 */
export const comparisonTour: TourConfig = {
  id: 'property-comparison',
  name: 'Property Comparison',
  description: 'Compare properties side by side',
  icon: Building2,
  steps: [
    {
      id: 'select-properties',
      title: 'Select Properties to Compare',
      content: 'Save multiple properties as favorites, then use our comparison tool to see them side by side with detailed analysis.',
      target: '[data-tour="comparison-selector"]',
      position: 'top'
    },
    {
      id: 'match-comparison',
      title: 'Compare Match Scores',
      content: 'See how different properties score against your criteria and understand which factors make each property a good or poor fit.',
      target: '[data-tour="match-comparison"]',
      position: 'bottom'
    },
    {
      id: 'financial-comparison',
      title: 'Financial Analysis',
      content: 'Compare total costs, monthly payments, HTB benefits, and affordability across multiple properties to make informed decisions.',
      target: '[data-tour="financial-comparison"]',
      position: 'left'
    }
  ]
};

// Export all tours
export const allTours: TourConfig[] = [
  firstTimeBuyerTour,
  recommendationTour,
  profileTour,
  dashboardTour,
  htbTour,
  mobileTour,
  comparisonTour
];

// Helper function to get tours for specific contexts
export const getToursForUser = (userProfile: any): TourConfig[] => {
  const tours: TourConfig[] = [];

  // Always include dashboard tour for new users
  tours.push(dashboardTour);

  // Include first-time buyer tour if applicable
  if (userProfile?.currentStatus === 'first-time-buyer' || userProfile?.hasHTB) {
    tours.push(firstTimeBuyerTour);
    tours.push(htbTour);
  }

  // Include recommendation tour if profile is incomplete
  if (!userProfile || (userProfile.completionScore || 0) < 75) {
    tours.push(profileTour);
  }

  // Always include recommendations tour
  tours.push(recommendationTour);

  return tours;
};

export default allTours;