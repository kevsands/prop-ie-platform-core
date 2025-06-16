'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  ShieldCheck, 
  Smartphone, 
  History, 
  AlertCircle, 
  UserCheck, 
  Shield, 
  Lock, 
  Settings
} from 'lucide-react';
import Link from 'next/link';
import SecurityMonitoringDashboard from './SecurityMonitoringDashboard';
import TrustedDevices from './TrustedDevices';

interface SecuritySettingProps {
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  onToggle: () => void;
  href?: string;
}

const SecuritySetting: React.FC<SecuritySettingProps> = ({ 
  title, 
  description, 
  enabled, 
  icon, 
  onToggle,
  href 
}) => {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg mb-4">
      <div className="flex">
        <div className="mr-4 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <label className="inline-flex items-center mr-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={enabled} 
            onChange={onToggle} 
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300">
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : ''}`}></div>
          </div>
        </label>
        {href && (
          <Link href={href} className="text-blue-600 hover:underline text-sm">
            Configure
          </Link>
        )}
      </div>
    </div>
  );
};

export interface SecurityFeatures {
  mfa: boolean;
  sessionFingerprinting: boolean;
  deviceTrust: boolean;
  auditLogging: boolean;
  securityAlerts: boolean;
  ipBlocking: boolean;
  enhancedLoginProtection: boolean;
}

interface EnhancedSecurityDashboardProps {
  initialFeatures?: Partial<SecurityFeatures>
  );
  onFeaturesChange?: (features: SecurityFeatures) => void;
}

const EnhancedSecurityDashboard: React.FC<EnhancedSecurityDashboardProps> = ({ 
  initialFeatures = {}, 
  onFeaturesChange 
}) => {
  const [activeTabsetActiveTab] = useState('overview');
  const [securityScoresetSecurityScore] = useState(85);

  // Use initialFeatures with defaults for unspecified features
  const [featuressetFeatures] = useState<SecurityFeatures>({
    mfa: true,
    sessionFingerprinting: true,
    deviceTrust: initialFeatures.deviceTrust ?? true,
    auditLogging: initialFeatures.auditLogging ?? true,
    securityAlerts: initialFeatures.securityAlerts ?? true,
    ipBlocking: initialFeatures.ipBlocking ?? false,
    enhancedLoginProtection: initialFeatures.enhancedLoginProtection ?? false,
    ...initialFeatures
  });

  // Toggle feature and update security score
  const toggleFeature = (feature: keyof SecurityFeatures) => {
    const updatedFeatures = {
      ...features,
      [feature]: !features[feature]
    };

    setFeatures(updatedFeatures);

    // Notify parent component if callback provided
    if (onFeaturesChange) {
      onFeaturesChange(updatedFeatures);
    }

    // Update security score
    updateSecurityScore(updatedFeatures);
  };

  // Calculate security score based on enabled features
  const updateSecurityScore = (updatedFeatures: SecurityFeatures) => {
    // Weights for each security feature (out of 100)
    const weights = {
      mfa: 25,
      sessionFingerprinting: 15,
      deviceTrust: 15,
      auditLogging: 10,
      securityAlerts: 10,
      ipBlocking: 15,
      enhancedLoginProtection: 10
    };

    // Calculate score
    const score = Object.entries(updatedFeatures).reduce((total, [featureenabled]) => {
      return total + (enabled ? weights[feature as keyof SecurityFeatures] : 0);
    }, 0);

    setSecurityScore(score);
  };

  // Get security score color
  const getScoreColor = () => {
    if (securityScore>= 80) return 'text-green-600';
    if (securityScore>= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get security level text
  const getSecurityLevel = () => {
    if (securityScore>= 80) return 'Strong';
    if (securityScore>= 60) return 'Good';
    if (securityScore>= 40) return 'Basic';
    return 'Weak';
  };

  // Security recommendations based on disabled features
  const getRecommendations = () => {
    const recommendations = [];

    if (!features.mfa) {
      recommendations.push({
        title: 'Enable Multi-Factor Authentication',
        description: 'Add an additional layer of security to your account by requiring a second verification step when signing in.'
      });
    }

    if (!features.deviceTrust) {
      recommendations.push({
        title: 'Enable Device Trust',
        description: 'Verify your trusted devices to make sign-in easier on devices you use regularly.'
      });
    }

    if (!features.ipBlocking) {
      recommendations.push({
        title: 'Enable IP Blocking',
        description: 'Automatically block suspicious IP addresses that attempt to access your account.'
      });
    }

    if (!features.enhancedLoginProtection) {
      recommendations.push({
        title: 'Enable Enhanced Login Protection',
        description: 'Add additional security checks during sign-in based on location and device changes.'
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Security Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>
                  Your overall account security rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className={`text-4xl font-bold ${getScoreColor()}`}>
                    {securityScore}/100
                  </div>
                  <div className="text-lg mt-2">
                    {getSecurityLevel()} Security
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
                    <div 
                      className={`h-2.5 rounded-full ${
                        securityScore>= 80 ? 'bg-green-600' : 
                        securityScore>= 60 ? 'bg-yellow-500' : 
                        securityScore>= 40 ? 'bg-orange-500' : 'bg-red-600'
                      }`} 
                      style={ width: `${securityScore}%` }
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Security Features */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>
                  Active security protections on your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex items-center p-3 rounded-lg ${features.mfa ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <ShieldCheck className={`h-5 w-5 mr-2 ${features.mfa ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">Multi-Factor Auth</div>
                      <div className="text-xs text-gray-500">
                        {features.mfa ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center p-3 rounded-lg ${features.sessionFingerprinting ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <UserCheck className={`h-5 w-5 mr-2 ${features.sessionFingerprinting ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">Session Fingerprinting</div>
                      <div className="text-xs text-gray-500">
                        {features.sessionFingerprinting ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center p-3 rounded-lg ${features.deviceTrust ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <Smartphone className={`h-5 w-5 mr-2 ${features.deviceTrust ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">Device Trust</div>
                      <div className="text-xs text-gray-500">
                        {features.deviceTrust ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center p-3 rounded-lg ${features.auditLogging ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <History className={`h-5 w-5 mr-2 ${features.auditLogging ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">Audit Logging</div>
                      <div className="text-xs text-gray-500">
                        {features.auditLogging ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center p-3 rounded-lg ${features.securityAlerts ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <AlertCircle className={`h-5 w-5 mr-2 ${features.securityAlerts ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">Security Alerts</div>
                      <div className="text-xs text-gray-500">
                        {features.securityAlerts ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center p-3 rounded-lg ${features.ipBlocking ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <Shield className={`h-5 w-5 mr-2 ${features.ipBlocking ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">IP Blocking</div>
                      <div className="text-xs text-gray-500">
                        {features.ipBlocking ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {getRecommendations().length> 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>
                  Suggested actions to improve your account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecommendations().map((recommendationindex: any) => (
                    <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <div className="mr-3 mt-0.5">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800">{recommendation.title}</h3>
                        <p className="text-sm text-blue-700">{recommendation.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure the security features for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SecuritySetting 
                title="Multi-Factor Authentication" 
                description="Require a second verification step when signing in from new devices."
                enabled={features.mfa}
                icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('mfa')}
                href="/user/security/mfa"
              />

              <SecuritySetting 
                title="Session Fingerprinting" 
                description="Detect unusual changes in your session to prevent unauthorized access."
                enabled={features.sessionFingerprinting}
                icon={<UserCheck className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('sessionFingerprinting')}
              />

              <SecuritySetting 
                title="Device Trust" 
                description="Remember your trusted devices to make sign-in easier and more secure."
                enabled={features.deviceTrust}
                icon={<Smartphone className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('deviceTrust')}
                href="/user/security/devices"
              />

              <SecuritySetting 
                title="Audit Logging" 
                description="Keep detailed records of account activity and security events."
                enabled={features.auditLogging}
                icon={<History className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('auditLogging')}
              />

              <SecuritySetting 
                title="Security Alerts" 
                description="Receive notifications about suspicious activity on your account."
                enabled={features.securityAlerts}
                icon={<AlertCircle className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('securityAlerts')}
                href="/user/security/alerts"
              />

              <SecuritySetting 
                title="IP Blocking" 
                description="Automatically block suspicious IP addresses."
                enabled={features.ipBlocking}
                icon={<Shield className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('ipBlocking')}
              />

              <SecuritySetting 
                title="Enhanced Login Protection" 
                description="Add additional security checks during sign-in based on risk factors."
                enabled={features.enhancedLoginProtection}
                icon={<Lock className="h-6 w-6 text-blue-600" />}
                onToggle={() => toggleFeature('enhancedLoginProtection')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Security Options</CardTitle>
              <CardDescription>
                Additional security controls for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Link 
                    href="/user/security/recovery-codes" 
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Settings className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium">Recovery Codes</h3>
                        <p className="text-sm text-gray-500">
                          Manage recovery codes that can be used if you lose access to your other authentication methods.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                <div>
                  <Link 
                    href="/user/security/sessions" 
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <History className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium">Active Sessions</h3>
                        <p className="text-sm text-gray-500">
                          View and manage active sessions on your account.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <SecurityMonitoringDashboard />
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <TrustedDevices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSecurityDashboard;