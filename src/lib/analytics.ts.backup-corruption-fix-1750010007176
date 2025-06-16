// src/lib/analytics.ts
import { v4 as uuidv4 } from 'uuid';

// Analytics event types
export enum EventType {
  PAGE_VIEW = 'page_view',
  CUSTOMIZATION_START = 'customization_start',
  CUSTOMIZATION_OPTION_SELECT = 'customization_option_select',
  CUSTOMIZATION_OPTION_DESELECT = 'customization_option_deselect',
  CUSTOMIZATION_ROOM_CHANGE = 'customization_room_change',
  CUSTOMIZATION_CATEGORY_CHANGE = 'customization_category_change',
  CUSTOMIZATION_VIEW_MODE_CHANGE = 'customization_view_mode_change',
  CUSTOMIZATION_SAVE = 'customization_save',
  CUSTOMIZATION_FINALIZE = 'customization_finalize',
  CONSULTATION_REQUEST = 'consultation_request',
  MORTGAGE_CALCULATION = 'mortgage_calculation',
  CUSTOMIZATION_SUMMARY_VIEW = 'customization_summary_view',
  ERROR = 'error'
}

// Analytics configuration interface
interface AnalyticsConfig {
  endpoint: string;
  batchSize: number;
  batchInterval: number;
  debug: boolean;
}

// Session data
interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: number;
  referrer?: string;
  userAgent?: string;
  deviceInfo?: Record<string, any>\n  );
}

// Event data
interface EventData {
  [key: string]: any;
}

// Event batch for sending
interface EventBatch {
  sessionData: SessionData;
  events: Array<{
    id: string;
    type: EventType;
    timestamp: number;
    data: EventData;
  }>\n  );
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  endpoint: '/api/analytics/events',
  batchSize: 10,
  batchInterval: 30000, // 30 seconds
  debug: process.env.NODE_ENV === 'development'};

class AnalyticsTracker {
  private config: AnalyticsConfig;
  private sessionData: SessionData;
  private eventQueue: Array<{
    id: string;
    type: EventType;
    timestamp: number;
    data: EventData;
  }> = [];
  private batchInterval: NodeJS.Timeout | null = null;
  private initialized = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    // Merge with default config
    this.config = {
      ...defaultConfig,
      ...config};

    // Initialize session data with placeholder
    this.sessionData = {
      sessionId: '',
      startTime: Date.now()};
  }

  /**
   * Initialize analytics
   */
  public init(userId?: string): void {
    if (this.initialized) return;

    // Generate or retrieve session ID
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem('analytics_session_id') || '';

      if (!sessionId || this.isSessionExpired()) {
        sessionId = uuidv4();
        localStorage.setItem('analytics_session_id', sessionId);
        localStorage.setItem('analytics_session_start', Date.now().toString());
      }

      // Get referrer and user agent
      const referrer = document.referrer;
      const userAgent = navigator.userAgent;

      // Collect device info
      const deviceInfo = {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth};

      // Set session data
      this.sessionData = {
        sessionId,
        userId,
        startTime: parseInt(localStorage.getItem('analytics_session_start') || Date.now().toString()),
        referrer,
        userAgent,
        deviceInfo};

      // Set up batch sending
      this.startBatchSending();

      // Add beforeunload handler to send remaining events
      window.addEventListener('beforeunload', () => {
        this.sendBatch(true);
      });

      this.initialized = true;
    }
  }

  /**
   * Check if session is expired
   */
  private isSessionExpired(): boolean {
    if (typeof window === 'undefined') return false;

    const sessionStart = parseInt(localStorage.getItem('analytics_session_start') || '0');
    const sessionDuration = Date.now() - sessionStart;
    const maxSessionDuration = 30 * 60 * 1000; // 30 minutes

    return sessionDuration> maxSessionDuration;
  }

  /**
   * Start batch sending interval
   */
  private startBatchSending(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }

    this.batchInterval = setInterval(() => {
      this.sendBatch();
    }, this.config.batchInterval);
  }

  /**
   * Send batch of events
   */
  private async sendBatch(force = false): Promise<void> {
    if (!this.eventQueue.length) return;
    if (!force && this.eventQueue.length <this.config.batchSize) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    const batch: EventBatch = {
      sessionData: this.sessionData,
      events};

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify(batch),
        keepalive: true});

      if (!response.ok) {
        throw new Error(`Analytics error: ${response.status}`);
      }

      if (this.config.debug) {

      }
    } catch (error) {
      if (this.config.debug) {

      }

      // Return events to the queue for retry
      this.eventQueue = [...events, ...this.eventQueue];
    }
  }

  /**
   * Track an event
   */
  public trackEvent(type: EventType, data: EventData = {}): void {
    if (!this.initialized) {
      this.init();
    }

    const event = {
      id: uuidv4(),
      type,
      timestamp: Date.now(),
      data};

    this.eventQueue.push(event);

    if (this.config.debug) {

    }

    // Send immediately if queue is full
    if (this.eventQueue.length>= this.config.batchSize) {
      this.sendBatch();
    }
  }

  /**
   * Track page view
   */
  public trackPageView(path: string, title?: string): void {
    this.trackEvent(EventType.PAGE_VIEW, {
      path,
      title: title || (typeof document !== 'undefined' ? document.title : ''),
      url: typeof window !== 'undefined' ? window.location.href : ''});
  }

  /**
   * Track error
   */
  public trackError(message: string, details: Record<string, any> = {}): void {
    this.trackEvent(EventType.ERROR, {
      message,
      ...details});
  }

  /**
   * Set user ID
   */
  public setUserId(userId: string): void {
    this.sessionData.userId = userId;
  }

  /**
   * Clear user ID
   */
  public clearUserId(): void {
    delete this.sessionData.userId;
  }

  /**
   * Dispose tracker (clear interval and send remaining events)
   */
  public dispose(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }

    this.sendBatch(true);
  }
}

// Create singleton instance
export const analytics = new AnalyticsTracker();

// Track specific customization events
export function trackEvent(action: string, details: any = {}): void {
  switch (action) {
    case 'change_room':
      analytics.trackEvent(EventType.CUSTOMIZATION_ROOM_CHANGEdetails);
      break;
    case 'change_category':
      analytics.trackEvent(EventType.CUSTOMIZATION_CATEGORY_CHANGEdetails);
      break;
    case 'select_option':
      analytics.trackEvent(EventType.CUSTOMIZATION_OPTION_SELECTdetails);
      break;
    case 'deselect_option':
      analytics.trackEvent(EventType.CUSTOMIZATION_OPTION_DESELECTdetails);
      break;
    case 'toggle_view_mode':
      analytics.trackEvent(EventType.CUSTOMIZATION_VIEW_MODE_CHANGEdetails);
      break;
    case 'save_customization':
      analytics.trackEvent(EventType.CUSTOMIZATION_SAVEdetails);
      break;
    case 'finalize_customization':
      analytics.trackEvent(EventType.CUSTOMIZATION_FINALIZEdetails);
      break;
    case 'request_consultation':
      analytics.trackEvent(EventType.CONSULTATION_REQUESTdetails);
      break;
    case 'calculate_mortgage':
      analytics.trackEvent(EventType.MORTGAGE_CALCULATIONdetails);
      break;
    default:
      // For custom events not in the enum
      analytics.trackEvent(action as anydetails);
  }
}

export default analytics;