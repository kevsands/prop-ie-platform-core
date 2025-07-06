/**
 * Enhanced Session Fingerprinting Module
 * 
 * This module creates and validates unique fingerprints for user sessions
 * to detect potential session hijacking and unauthorized access attempts.
 * 
 * Features:
 * - Client environment fingerprinting (browser, device, hardware, etc.)
 * - Geographic location tracking and validation
 * - Device change detection
 * - Trusted device management
 * - Risk scoring
 * 
 * Note: This module is used in conjunction with the AuditLogger for
 * comprehensive security monitoring.
 */

import { SHA256 } from 'crypto-js';
import { Auth } from '@/lib/amplify/auth';
import { AuditLogger } from './auditLogger';

// Constants
const FINGERPRINT_STORAGE_KEY = 'sec_session_fingerprint';
const FINGERPRINT_TIMESTAMP_KEY = 'sec_session_fingerprint_ts';
const TRUSTED_DEVICES_KEY = 'sec_trusted_devices';
const FINGERPRINT_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours
const ACCURACY_THRESHOLD = 0.85; // 85% similarity needed for validation

// IP Geolocation service endpoint (mock)
const GEOLOCATION_API = 'https://api.propie.example/geolocation';

// Types
export interface ClientInfo {
  userAgent: string;
  language: string;
  colorDepth: number;
  screenResolution: string;
  timezone: string;
  platform: string;
  hasTouch: boolean;
  hasWebGL: boolean;
  hasStorage: boolean;
  hasIndexDB: boolean;
  cpuCores: number;
  deviceMemory?: number;
  networkType?: string;
  networkDownlink?: number;
}

export interface GeoLocation {
  ip: string;
  country: string;
  region: string;
  city: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  isp?: string;
  asn?: number;
}

export interface DeviceProfile {
  fingerprint: string;
  clientInfo: ClientInfo;
  location?: GeoLocation;
  name?: string;
  trusted: boolean;
  firstSeen: number;
  lastSeen: number;
  riskScore: number;
}

export interface SessionStatus {
  valid: boolean;
  reason?: string;
  requiresVerification?: boolean;
  riskScore?: number;
}

export interface FingerprintData {
  fingerprint: string;
  timestamp: number;
  clientInfo: ClientInfo;
  location?: GeoLocation;
  userId?: string;
}

/**
 * Session Fingerprint Service
 */
class SessionFingerprintService {
  private currentFingerprint: FingerprintData | null = null;
  private trustedDevices: DeviceProfile[] = [];
  private isInitialized = false;

  /**
   * Initialize the session fingerprint service
   */
  async initialize(): Promise<void> {
    try {
      // Load trusted devices from storage
      const storedDevices = localStorage.getItem(TRUSTED_DEVICES_KEY);
      if (storedDevices) {
        this.trustedDevices = JSON.parse(storedDevices);
      }
      
      // Load existing fingerprint if available
      const storedFingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(FINGERPRINT_TIMESTAMP_KEY);
      
      if (storedFingerprint && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        const now = Date.now();
        
        // Check if fingerprint is still valid
        if (now - timestamp < FINGERPRINT_EXPIRY) {
          const fingerprintData = JSON.parse(storedFingerprint);
          this.currentFingerprint = fingerprintData;
        } else {
          // Clear expired fingerprint
          this.clear();
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing session fingerprint service:', error);
    }
  }

  /**
   * Generate a new session fingerprint
   */
  async generate(): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Get client info and location
      const clientInfo = this.collectClientInfo();
      const location = await this.getGeoLocation();
      
      // Get user ID if authenticated
      let userId: string | undefined;
      try {
        const user = await Auth.currentAuthenticatedUser();
        userId = user.username || user.attributes?.sub;
      } catch (error) {
        // User not authenticated, continue without user ID
      }
      
      // Create fingerprint hash
      const fingerprintData = {
        clientInfo,
        location,
        userId,
        timestamp: Date.now()
      };
      
      const fingerprintString = JSON.stringify(fingerprintData);
      const fingerprint = SHA256(fingerprintString).toString();
      
      // Store fingerprint data
      const fullFingerprintData: FingerprintData = {
        fingerprint,
        timestamp: Date.now(),
        clientInfo,
        location,
        userId
      };
      
      localStorage.setItem(FINGERPRINT_STORAGE_KEY, JSON.stringify(fullFingerprintData));
      localStorage.setItem(FINGERPRINT_TIMESTAMP_KEY, Date.now().toString());
      
      this.currentFingerprint = fullFingerprintData;
      
      // Update device profiles
      this.updateDeviceProfiles(fullFingerprintData);
      
      return fingerprint;
    } catch (error) {
      console.error('Error generating session fingerprint:', error);
      return null;
    }
  }

  /**
   * Validate the current session fingerprint
   */
  validate(): SessionStatus {
    try {
      if (!this.isInitialized) {
        this.initialize();
      }
      
      // Check if fingerprint exists
      const storedFingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(FINGERPRINT_TIMESTAMP_KEY);
      
      if (!storedFingerprint || !storedTimestamp) {
        return { 
          valid: false, 
          reason: 'No session fingerprint found',
          requiresVerification: true,
          riskScore: 1.0
        };
      }
      
      // Check fingerprint expiry
      const timestamp = parseInt(storedTimestamp, 10);
      const now = Date.now();
      
      if (now - timestamp > FINGERPRINT_EXPIRY) {
        this.clear();
        return { 
          valid: false, 
          reason: 'Session fingerprint expired',
          requiresVerification: true,
          riskScore: 0.7
        };
      }
      
      // Get current client info and stored fingerprint data
      const currentClientInfo = this.collectClientInfo();
      const storedFingerprintData: FingerprintData = JSON.parse(storedFingerprint);
      
      // Compare fingerprints
      const similarityScore = this.calculateSimilarity(
        currentClientInfo, 
        storedFingerprintData.clientInfo
      );
      
      // Validate location if available
      let locationChanged = false;
      let locationDistance = 0;
      let locationRiskScore = 0;
      
      if (storedFingerprintData.location) {
        const currentLocation = this.getGeoLocationSync();
        if (currentLocation && storedFingerprintData.location) {
          locationDistance = this.calculateGeoDistance(
            currentLocation, 
            storedFingerprintData.location
          );
          
          // Flag significant location changes (> 50km) as suspicious
          locationChanged = locationDistance > 50;
          locationRiskScore = this.calculateLocationRiskScore(locationDistance);
        }
      }
      
      // Calculate overall risk score
      const overallRiskScore = Math.max(
        1 - similarityScore, 
        locationRiskScore
      );
      
      // Check if this is a trusted device
      const isTrustedDevice = this.isTrustedDevice(storedFingerprintData.fingerprint);
      
      // Determine validation result
      if (similarityScore >= ACCURACY_THRESHOLD && !locationChanged) {
        // Valid session, no significant changes
        return { 
          valid: true,
          riskScore: overallRiskScore
        };
      } else if (similarityScore >= 0.7 && !locationChanged) {
        // Minor changes detected, but still acceptable
        return { 
          valid: true,
          reason: 'Client environment slightly changed',
          riskScore: overallRiskScore
        };
      } else if (isTrustedDevice) {
        // Trusted device but significant changes detected
        return { 
          valid: true,
          reason: 'Changes detected on trusted device',
          requiresVerification: overallRiskScore > 0.5,
          riskScore: overallRiskScore
        };
      } else if (locationChanged) {
        // Significant location change
        return { 
          valid: false,
          reason: `Significant location change detected (${Math.round(locationDistance)}km)`,
          requiresVerification: true,
          riskScore: overallRiskScore
        };
      } else {
        // Significant environment changes
        return { 
          valid: false,
          reason: 'Significant client environment changes detected',
          requiresVerification: true,
          riskScore: overallRiskScore
        };
      }
    } catch (error) {
      console.error('Error validating session fingerprint:', error);
      return { 
        valid: false, 
        reason: 'Error validating session fingerprint',
        requiresVerification: true,
        riskScore: 1.0
      };
    }
  }

  /**
   * Get the current fingerprint without storing it
   */
  getCurrentFingerprint(): string | null {
    if (this.currentFingerprint) {
      return this.currentFingerprint.fingerprint;
    }
    
    try {
      // Check if fingerprint exists in storage
      const storedFingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(FINGERPRINT_TIMESTAMP_KEY);
      
      if (storedFingerprint && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < FINGERPRINT_EXPIRY) {
          const fingerprintData: FingerprintData = JSON.parse(storedFingerprint);
          this.currentFingerprint = fingerprintData;
          return fingerprintData.fingerprint;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current fingerprint:', error);
      return null;
    }
  }

  /**
   * Refresh the session fingerprint
   */
  async refresh(): Promise<string | null> {
    this.clear();
    return this.generate();
  }

  /**
   * Clear the stored session fingerprint
   */
  clear(): void {
    localStorage.removeItem(FINGERPRINT_STORAGE_KEY);
    localStorage.removeItem(FINGERPRINT_TIMESTAMP_KEY);
    this.currentFingerprint = null;
  }

  /**
   * Trust the current device
   */
  trustCurrentDevice(name?: string): boolean {
    try {
      if (!this.currentFingerprint) {
        return false;
      }
      
      // Check if device is already trusted
      const existingIndex = this.trustedDevices.findIndex(
        d => d.fingerprint === this.currentFingerprint?.fingerprint
      );
      
      if (existingIndex >= 0) {
        // Update existing trusted device
        this.trustedDevices[existingIndex].lastSeen = Date.now();
        if (name) {
          this.trustedDevices[existingIndex].name = name;
        }
      } else {
        // Add new trusted device
        const newTrustedDevice: DeviceProfile = {
          fingerprint: this.currentFingerprint.fingerprint,
          clientInfo: this.currentFingerprint.clientInfo,
          location: this.currentFingerprint.location,
          name: name || `Device ${this.trustedDevices.length + 1}`,
          trusted: true,
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          riskScore: 0
        };
        
        this.trustedDevices.push(newTrustedDevice);
      }
      
      // Save trusted devices
      localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(this.trustedDevices));
      
      // Log the event
      if (AuditLogger) {
        AuditLogger.logAuth('device_trust', 'success', 'Device marked as trusted');
      }
      
      return true;
    } catch (error) {
      console.error('Error trusting device:', error);
      return false;
    }
  }

  /**
   * Remove trust from a device
   */
  untrustDevice(fingerprint: string): boolean {
    try {
      const deviceIndex = this.trustedDevices.findIndex(d => d.fingerprint === fingerprint);
      
      if (deviceIndex >= 0) {
        this.trustedDevices.splice(deviceIndex, 1);
        localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(this.trustedDevices));
        
        // Log the event
        if (AuditLogger) {
          AuditLogger.logAuth('device_untrust', 'success', 'Device trust removed');
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error untrusting device:', error);
      return false;
    }
  }

  /**
   * Get list of trusted devices
   */
  getTrustedDevices(): DeviceProfile[] {
    return [...this.trustedDevices];
  }

  /**
   * Check if a device is trusted
   */
  isTrustedDevice(fingerprint: string): boolean {
    return this.trustedDevices.some(d => d.fingerprint === fingerprint);
  }

  /**
   * Update device profiles with new fingerprint data
   */
  private updateDeviceProfiles(fingerprintData: FingerprintData): void {
    const existingDeviceIndex = this.trustedDevices.findIndex(
      d => d.fingerprint === fingerprintData.fingerprint
    );
    
    if (existingDeviceIndex >= 0) {
      // Update existing device profile
      this.trustedDevices[existingDeviceIndex].lastSeen = Date.now();
      
      // Update location if available
      if (fingerprintData.location) {
        this.trustedDevices[existingDeviceIndex].location = fingerprintData.location;
      }
    }
    
    // Save trusted devices
    localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(this.trustedDevices));
  }

  /**
   * Collect client information for fingerprinting
   */
  private collectClientInfo(): ClientInfo {
    const nav = window.navigator;
    const screen = window.screen;
    
    // Collect basic client info
    const clientInfo: ClientInfo = {
      userAgent: nav.userAgent,
      language: nav.language,
      colorDepth: screen.colorDepth,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: nav.platform,
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasWebGL: this.hasWebGL(),
      hasStorage: !!window.localStorage,
      hasIndexDB: !!window.indexedDB,
      cpuCores: nav.hardwareConcurrency || 1,
    };
    
    // Add memory if available
    if ('deviceMemory' in nav) {
      clientInfo.deviceMemory = (nav as any).deviceMemory;
    }
    
    // Add network info if available
    if ('connection' in nav) {
      const conn = (nav as any).connection;
      if (conn) {
        clientInfo.networkType = conn.effectiveType;
        clientInfo.networkDownlink = conn.downlink;
      }
    }
    
    return clientInfo;
  }

  /**
   * Check if WebGL is available
   */
  private hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
               (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  /**
   * Get geolocation information
   */
  private async getGeoLocation(): Promise<GeoLocation | undefined> {
    try {
      const response = await fetch(GEOLOCATION_API);
      if (response.ok) {
        return await response.json();
      }
      return undefined;
    } catch (error) {
      console.warn('Error fetching geolocation:', error);
      return undefined;
    }
  }

  /**
   * Get geolocation synchronously (cached or mock)
   */
  private getGeoLocationSync(): GeoLocation | undefined {
    // Check if we have cached location in the current fingerprint
    if (this.currentFingerprint?.location) {
      return this.currentFingerprint.location;
    }
    
    // Return mock location for demonstration purposes
    return {
      ip: '192.168.1.1',
      country: 'Ireland',
      region: 'Dublin',
      city: 'Dublin',
      postalCode: 'D01',
      latitude: 53.3498,
      longitude: -6.2603,
      isp: 'Mock ISP',
      asn: 12345
    };
  }

  /**
   * Calculate similarity between two client info objects
   */
  private calculateSimilarity(current: ClientInfo, stored: ClientInfo): number {
    // Define weights for different attributes
    const weights = {
      userAgent: 0.25,
      screenResolution: 0.2,
      platform: 0.2,
      colorDepth: 0.05,
      language: 0.05,
      timezone: 0.1,
      cpuCores: 0.05,
      hasWebGL: 0.025,
      hasTouch: 0.025,
      hasStorage: 0.025,
      hasIndexDB: 0.025
    };
    
    let totalScore = 0;
    let maxScore = 0;
    
    // Compare string attributes
    for (const attr of ['userAgent', 'language', 'screenResolution', 'timezone', 'platform'] as const) {
      const weight = weights[attr];
      maxScore += weight;
      
      if (current[attr] === stored[attr]) {
        totalScore += weight;
      } else if (attr === 'userAgent' && current[attr].includes(stored[attr])) {
        // Partial match for user agent
        totalScore += weight * 0.7;
      }
    }
    
    // Compare numeric attributes
    for (const attr of ['colorDepth', 'cpuCores'] as const) {
      const weight = weights[attr];
      maxScore += weight;
      
      if (current[attr] === stored[attr]) {
        totalScore += weight;
      }
    }
    
    // Compare boolean attributes
    for (const attr of ['hasTouch', 'hasWebGL', 'hasStorage', 'hasIndexDB'] as const) {
      const weight = weights[attr];
      maxScore += weight;
      
      if (current[attr] === stored[attr]) {
        totalScore += weight;
      }
    }
    
    // Handle optional attributes
    if ('deviceMemory' in current && 'deviceMemory' in stored) {
      const weight = 0.05;
      maxScore += weight;
      
      if (current.deviceMemory === stored.deviceMemory) {
        totalScore += weight;
      }
    }
    
    if ('networkType' in current && 'networkType' in stored) {
      const weight = 0.05;
      maxScore += weight;
      
      if (current.networkType === stored.networkType) {
        totalScore += weight;
      }
    }
    
    return totalScore / maxScore;
  }

  /**
   * Calculate distance between two geographic coordinates (Haversine formula)
   */
  private calculateGeoDistance(loc1: GeoLocation, loc2: GeoLocation): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(loc2.latitude - loc1.latitude);
    const dLon = this.deg2rad(loc2.longitude - loc1.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(loc1.latitude)) * Math.cos(this.deg2rad(loc2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }

  /**
   * Convert degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Calculate location risk score based on distance
   */
  private calculateLocationRiskScore(distance: number): number {
    // No distance = no risk
    if (distance === 0) return 0;
    
    // Local movement (< 5km) = very low risk
    if (distance < 5) return 0.1;
    
    // Near location (5-50km) = low risk
    if (distance < 50) return 0.3;
    
    // Regional change (50-300km) = medium risk
    if (distance < 300) return 0.6;
    
    // Long distance (300-1000km) = high risk
    if (distance < 1000) return 0.8;
    
    // Very long distance (>1000km) = very high risk
    return 0.95;
  }
}

// Export the SessionFingerprint service singleton
export const SessionFingerprint = new SessionFingerprintService();