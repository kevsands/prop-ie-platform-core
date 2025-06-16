'use client';

/**
 * AWS Amplify v6 Analytics Adapter
 * 
 * This adapter provides a compatibility layer for AWS Amplify Analytics,
 * making it easier to migrate from Amplify v5 to v6 patterns.
 */

import { 
  record, 
  identifyUser, 
  updateEndpoint 
} from 'aws-amplify/analytics';
import { ensureAmplifyInitialized } from './index';

/**
 * Analytics event parameters interface
 */
export interface AnalyticsEventParams {
  name: string;
  attributes?: Record<string, string>\n  );
  metrics?: Record<string, number>\n  );
}

/**
 * Analytics user attributes interface
 */
export interface AnalyticsUserAttributes {
  userId: string;
  userAttributes?: Record<string, string[] | string>\n  );
}

/**
 * Analytics endpoint attributes interface
 */
export interface AnalyticsEndpointAttributes {
  address?: string;
  attributes?: Record<string, string[]>\n  );
  demographic?: {
    appVersion?: string;
    locale?: string;
    make?: string;
    model?: string;
    modelVersion?: string;
    platform?: string;
    platformVersion?: string;
    timezone?: string;
  };
  location?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    postalCode?: string;
    region?: string;
  };
  metrics?: Record<string, number>\n  );
  optOut?: string;
  userId?: string;
}

/**
 * V6 Analytics Service
 * 
 * Provides a simple, centralized interface for analytics functionality
 */
export class AnalyticsService {
  /**
   * Record an analytics event
   */
  static async recordEvent(params: AnalyticsEventParams): Promise<void> {
    ensureAmplifyInitialized();
    try {
      await record({
        name: params.name,
        attributes: params.attributes,
        metrics: params.metrics
      });
    } catch (error) {

    }
  }

  /**
   * Identify a user for analytics tracking
   */
  static async identifyUser(params: AnalyticsUserAttributes): Promise<void> {
    ensureAmplifyInitialized();
    try {
      await identifyUser({
        userId: params.userId,
        userAttributes: params.userAttributes
      });
    } catch (error) {

    }
  }

  /**
   * Update endpoint for a user
   */
  static async updateEndpoint(params: AnalyticsEndpointAttributes): Promise<void> {
    ensureAmplifyInitialized();
    try {
      await updateEndpoint({
        address: params.address,
        attributes: params.attributes,
        demographic: params.demographic,
        location: params.location,
        metrics: params.metrics,
        optOut: params.optOut,
        userId: params.userId
      });
    } catch (error) {

    }
  }

  /**
   * Record a page view event with standard attributes
   */
  static async recordPageView(
    pageName: string, 
    additionalAttributes?: Record<string, string>,
    additionalMetrics?: Record<string, number>
  ): Promise<void> {
    const attributes = {
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      pageReferrer: typeof document !== 'undefined' ? document.referrer : '',
      ...additionalAttributes
    };

    const metrics = {
      timestamp: Date.now(),
      ...additionalMetrics
    };

    return this.recordEvent({
      name: 'page_view',
      attributes: {
        page: pageName,
        ...attributes
      },
      metrics
    });
  }

  /**
   * Record a user sign-in event
   */
  static async recordUserSignIn(
    userId: string,
    method: 'email' | 'username' | 'social' | 'phone_number' | 'custom',
    additionalAttributes?: Record<string, string>
  ): Promise<void> {
    return this.recordEvent({
      name: 'user_sign_in',
      attributes: {
        userId,
        method,
        ...additionalAttributes
      }
    });
  }

  /**
   * Record a user sign-up event
   */
  static async recordUserSignUp(
    userId: string,
    method: 'email' | 'username' | 'social' | 'phone_number' | 'custom',
    additionalAttributes?: Record<string, string>
  ): Promise<void> {
    return this.recordEvent({
      name: 'user_sign_up',
      attributes: {
        userId,
        method,
        ...additionalAttributes
      }
    });
  }

  /**
   * Record a feature usage event
   */
  static async recordFeatureUsage(
    featureName: string,
    additionalAttributes?: Record<string, string>,
    additionalMetrics?: Record<string, number>
  ): Promise<void> {
    return this.recordEvent({
      name: 'feature_usage',
      attributes: {
        feature: featureName,
        ...additionalAttributes
      },
      metrics: additionalMetrics
    });
  }

  /**
   * Record an error event
   */
  static async recordError(
    errorName: string,
    errorMessage: string,
    additionalAttributes?: Record<string, string>
  ): Promise<void> {
    return this.recordEvent({
      name: 'error',
      attributes: {
        error_name: errorName,
        error_message: errorMessage,
        url: typeof window !== 'undefined' ? window.location.href : '',
        ...additionalAttributes
      }
    });
  }
}

// Legacy v5 compatibility API
export const AnalyticsV5Compatible = {
  record: (eventName: string, attributes?: Record<string, string>, metrics?: Record<string, number>) => {
    return AnalyticsService.recordEvent({
      name: eventName,
      attributes,
      metrics
    });
  },
  updateEndpoint: (endpointAttributes: AnalyticsEndpointAttributes) => {
    return AnalyticsService.updateEndpoint(endpointAttributes);
  },
  identifyUser: (userId: string, userAttributes?: Record<string, string[] | string>) => {
    return AnalyticsService.identifyUser({
      userId,
      userAttributes
    });
  }
};

export default AnalyticsService;