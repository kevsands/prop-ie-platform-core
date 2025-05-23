export interface FeatureFlags {
  showFitzgeraldGardensOnly: boolean;
  enablePropertyCustomization: boolean;
  enableStripePayments: boolean;
  // Add other flags as the platform evolves
  showDeveloperPortal: boolean;
  showAgentPortal: boolean;
  showSolicitorPortal: boolean;
}

const productionFlags: FeatureFlags = {
  showFitzgeraldGardensOnly: true, // Initially true for focused launch
  enablePropertyCustomization: true,
  enableStripePayments: true, // Assuming Stripe will be ready for launch
  showDeveloperPortal: false,
  showAgentPortal: false,
  showSolicitorPortal: false,
};

const developmentFlags: FeatureFlags = {
  showFitzgeraldGardensOnly: false, // Allows developers to see everything
  enablePropertyCustomization: true,
  enableStripePayments: true,
  showDeveloperPortal: true,
  showAgentPortal: true,
  showSolicitorPortal: true,
};

// Determine current environment (simplified)
// In a real app, this might come from process.env.NODE_ENV or similar
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'; // Vercel specific, adjust as needed

export const AppFeatureFlags: FeatureFlags = isProduction ? productionFlags : developmentFlags;

// Example of how to use a flag:
// import { AppFeatureFlags } from '@/core/config/featureFlags';
// if (AppFeatureFlags.showFitzgeraldGardensOnly) { /* show only FG */ } 