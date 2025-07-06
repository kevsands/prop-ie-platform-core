'use client';

import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AuditLogger, AuditCategory, AuditSeverity } from '@/lib/security/auditLogger';
import EnhancedMFA, { MFAStatus } from '@/lib/security/mfa';
import { SessionFingerprint } from '@/lib/security/sessionFingerprint';
import { isFeatureEnabled } from '@/lib/features/featureFlags';
import { useAuth } from '@/context/AuthContext';
import { MFASetup } from './MFASetup';
import { MFAChallenge } from './MFAChallenge';

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  description: string;
  actionLabel?: string;
  action?: () => void;
  dismissable?: boolean;
}

/**
 * Security Alerts Component
 * 
 * This component displays security alerts to users based on their security status.
 * It integrates with the MFA, SessionFingerprinting, and AuditLogger modules to
 * provide real-time security alerts and recommendations.
 */
export function SecurityAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMFASetup, setShowMFASetup] = useState<boolean>(false);
  const [showMFAChallenge, setShowMFAChallenge] = useState<boolean>(false);
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [sessionValid, setSessionValid] = useState<boolean>(true);
  
  // Check security status on mount
  useEffect(() => {
    async function checkSecurityStatus() {
      if (!user) return;
      
      setLoading(true);
      const alerts: SecurityAlert[] = [];
      
      try {
        // 1. Check MFA status
        const mfaEnabled = await isFeatureEnabled('enable-mfa');
        if (mfaEnabled) {
          const status = await EnhancedMFA.getMFAStatus();
          setMfaStatus(status);
          
          // Alert if MFA is not enabled but should be
          if (!status.enabled && EnhancedMFA.shouldEnforceMFA(user)) {
            alerts.push({
              id: 'mfa-required',
              type: 'warning',
              title: 'Multi-Factor Authentication Required',
              description: 'Your account requires additional security. Please set up multi-factor authentication.',
              actionLabel: 'Set Up MFA',
              action: () => setShowMFASetup(true),
              dismissable: false
            });
          }
        }
        
        // 2. Check session fingerprint
        const fingerprintEnabled = await isFeatureEnabled('enable-session-fingerprinting');
        if (fingerprintEnabled) {
          const { valid, reason } = await SessionFingerprint.validate();
          setSessionValid(valid);
          
          if (!valid) {
            alerts.push({
              id: 'suspicious-session',
              type: 'error',
              title: 'Suspicious Session Detected',
              description: 'Your session appears to be compromised. Please verify your identity.',
              actionLabel: 'Verify Identity',
              action: () => setShowMFAChallenge(true),
              dismissable: false
            });
            
            // Log suspicious session
            AuditLogger.logAuth(
              'suspicious_session',
              'warning',
              `Suspicious session detected: ${reason || 'unknown reason'}`,
              { userId: user.id }
            );
          }
        }
        
        // 3. Check for recovery codes running low
        if (mfaStatus?.enabled && mfaStatus.recoveryCodesRemaining < 3) {
          alerts.push({
            id: 'low-recovery-codes',
            type: 'warning',
            title: 'Recovery Codes Running Low',
            description: `You have only ${mfaStatus.recoveryCodesRemaining} recovery codes remaining. Consider generating new ones.`,
            actionLabel: 'Generate New Codes',
            action: () => setShowMFASetup(true),
            dismissable: true
          });
        }
        
        setAlerts(alerts);
      } catch (error) {
        console.error('Error checking security status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkSecurityStatus();
  }, [user]);
  
  // Dismiss an alert
  const dismissAlert = (id: string) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
  };
  
  // Handle MFA setup completion
  const handleMFASetupComplete = async () => {
    setShowMFASetup(false);
    
    // Refresh MFA status
    try {
      const status = await EnhancedMFA.getMFAStatus();
      setMfaStatus(status);
      
      // Remove MFA required alert if MFA is now enabled
      if (status.enabled) {
        dismissAlert('mfa-required');
        
        // Add success alert
        setAlerts(prev => [
          ...prev,
          {
            id: 'mfa-setup-success',
            type: 'success',
            title: 'MFA Setup Complete',
            description: 'Multi-factor authentication has been successfully enabled for your account.',
            dismissable: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error refreshing MFA status:', error);
    }
  };
  
  // Handle MFA challenge completion
  const handleMFAChallengeComplete = (success: boolean) => {
    setShowMFAChallenge(false);
    
    if (success) {
      // Remove suspicious session alert
      dismissAlert('suspicious-session');
      setSessionValid(true);
      
      // Add success alert
      setAlerts(prev => [
        ...prev,
        {
          id: 'verification-success',
          type: 'success',
          title: 'Identity Verified',
          description: 'Your identity has been successfully verified.',
          dismissable: true
        }
      ]);
      
      // Log successful verification
      AuditLogger.logAuth(
        'identity_verified',
        'success',
        'User successfully verified identity after suspicious session',
        { userId: user?.id }
      );
    } else {
      // Log failed verification
      AuditLogger.logAuth(
        'identity_verification_failed',
        'failure',
        'User failed to verify identity after suspicious session',
        { userId: user?.id }
      );
    }
  };
  
  // If no alerts and not loading, return null
  if (!loading && alerts.length === 0) {
    return null;
  }
  
  return (
    <>
      <div className="space-y-3 mb-6">
        {alerts.map(alert => (
          <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : undefined}>
            <AlertTitle>{alert.title}</AlertTitle>
            <div className="flex justify-between items-start mt-1">
              <AlertDescription>{alert.description}</AlertDescription>
              <div className="flex space-x-2 ml-4 mt-1">
                {alert.action && alert.actionLabel && (
                  <Button 
                    size="sm" 
                    variant={alert.type === 'error' ? 'default' : 'outline'}
                    onClick={alert.action}
                  >
                    {alert.actionLabel}
                  </Button>
                )}
                {alert.dismissable && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>
      
      {/* MFA Setup Dialog */}
      {showMFASetup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <MFASetup 
              onComplete={handleMFASetupComplete}
              onCancel={() => setShowMFASetup(false)}
            />
          </div>
        </div>
      )}
      
      {/* MFA Challenge Dialog */}
      {showMFAChallenge && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <MFAChallenge 
              onComplete={handleMFAChallengeComplete}
              title="Verify Your Identity"
              description="Your session appears to be suspicious. Please verify your identity to continue."
            />
          </div>
        </div>
      )}
    </>
  );
}