'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LockClosedIcon,
  KeyIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ServerIcon,
  CloudIcon,
  FolderIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CogIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  WifiIcon,
  ClockIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  FingerPrintIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useEncryption } from '@/hooks/useEncryption';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface EncryptionKey {
  id: string;
  name: string;
  type: 'MASTER' | 'DATA' | 'DOCUMENT' | 'BACKUP' | 'TRANSIT';
  algorithm: 'AES-256' | 'RSA-4096' | 'ECDSA' | 'CHACHA20';
  status: 'ACTIVE' | 'ROTATING' | 'EXPIRED' | 'COMPROMISED';
  createdAt: Date;
  lastRotated: Date;
  nextRotation: Date;
  usageCount: number;
  dataEncrypted: number; // in MB
  strength: number; // 0-100
  compliance: {
    gdpr: boolean;
    pci: boolean;
    hipaa: boolean;
    sox: boolean;
  };
}

interface EncryptedData {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'DATABASE' | 'FILE' | 'MESSAGE' | 'BACKUP';
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET';
  encryptedAt: Date;
  keyId: string;
  size: number;
  owner: string;
  accessLog: AccessEntry[];
  integrityHash: string;
  compressionRatio: number;
}

interface AccessEntry {
  id: string;
  userId: string;
  action: 'ENCRYPT' | 'DECRYPT' | 'VIEW' | 'SHARE';
  timestamp: Date;
  ipAddress: string;
  success: boolean;
  reason?: string;
}

interface EncryptionPolicy {
  id: string;
  name: string;
  dataTypes: string[];
  minimumKeyLength: number;
  algorithms: string[];
  rotationPeriod: number; // days
  retentionPeriod: number; // days
  autoEncrypt: boolean;
  compliance: string[];
}

export default function DataEncryptionService() {
  const {
    keys,
    encryptedData,
    policies,
    statistics,
    createKey,
    rotateKey,
    encryptData,
    decryptData,
    updatePolicy,
    scanForUnencrypted,
    generateReport
  } = useEncryption();

  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedKey, setSelectedKey] = useState<EncryptionKey | null>(null);
  const [encryptionMode, setEncryptionMode] = useState<'automatic' | 'manual'>('automatic');
  const [showKeyDetails, setShowKeyDetails] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleKeyRotation = async (keyId: string) => {
    try {
      await rotateKey(keyId);
      toast.success('Key rotation initiated successfully');
    } catch (error) {
      toast.error('Failed to rotate key');
    }
  };

  const handleDataEncryption = async (dataId: string, keyId: string) => {
    try {
      await encryptData(dataId, keyId);
      toast.success('Data encrypted successfully');
    } catch (error) {
      toast.error('Failed to encrypt data');
    }
  };

  const handleComplianceScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const unencrypted = await scanForUnencrypted();
      toast.success(`Scan complete. Found ${unencrypted.length} unencrypted items.`);
    } catch (error) {
      toast.error('Compliance scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const getKeyStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'ROTATING': return 'yellow';
      case 'EXPIRED': return 'orange';
      case 'COMPROMISED': return 'red';
      default: return 'gray';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'SECRET': return 'red';
      case 'CONFIDENTIAL': return 'orange';
      case 'INTERNAL': return 'yellow';
      case 'PUBLIC': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Encryption Service</h1>
          <p className="text-gray-600 mt-2">Enterprise-grade encryption for sensitive data protection</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Keys</p>
                  <p className="text-2xl font-bold">{keys.filter(k => k.status === 'ACTIVE').length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {keys.filter(k => k.status === 'ROTATING').length} rotating
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <KeyIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Encrypted Data</p>
                  <p className="text-2xl font-bold">{encryptedData.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(encryptedData.reduce((sum, d) => sum + d.size, 0) / 1024 / 1024).toFixed(1)} GB
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <LockClosedIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold">{statistics.complianceScore}%</p>
                  <Progress value={statistics.complianceScore} className="mt-2" />
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Key Strength</p>
                  <p className="text-2xl font-bold">{statistics.averageKeyStrength}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Average across all keys
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <BoltIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Alert */}
        {statistics.unencryptedCount > 0 && (
          <Alert className="mb-8">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Compliance Warning:</strong> {statistics.unencryptedCount} sensitive data items found without encryption.
              <Button size="sm" variant="link" onClick={handleComplianceScan}>
                Run Compliance Scan
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keys">Encryption Keys</TabsTrigger>
            <TabsTrigger value="data">Encrypted Data</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Encryption Status */}
            <Card>
              <CardHeader>
                <CardTitle>Encryption Status Overview</CardTitle>
                <CardDescription>Real-time encryption metrics and health status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Data Classification</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statistics.dataByClassification}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statistics.dataByClassification.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Encryption Activity</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={statistics.encryptionActivity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="encrypted" stroke="#10B981" name="Encrypted" />
                          <Line type="monotone" dataKey="decrypted" stroke="#3B82F6" name="Decrypted" />
                          <Line type="monotone" dataKey="rotated" stroke="#F59E0B" name="Keys Rotated" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Data</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose data to encrypt" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="documents">All Documents</SelectItem>
                          <SelectItem value="database">Database Records</SelectItem>
                          <SelectItem value="files">User Files</SelectItem>
                          <SelectItem value="custom">Custom Selection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Encryption Key</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select encryption key" />
                        </SelectTrigger>
                        <SelectContent>
                          {keys
                            .filter(k => k.status === 'ACTIVE')
                            .map(key => (
                              <SelectItem key={key.id} value={key.id}>
                                {key.name} ({key.algorithm})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <LockClosedIcon className="h-4 w-4 mr-2" />
                      Encrypt Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Rotation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <ArrowPathIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {keys.filter(k => new Date(k.nextRotation) <= new Date()).length} keys due for rotation
                      </p>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          keys
                            .filter(k => new Date(k.nextRotation) <= new Date())
                            .forEach(k => handleKeyRotation(k.id));
                        }}
                      >
                        Rotate All Due Keys
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Scan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <DocumentMagnifyingGlassIcon className="h-8 w-8 text-green-600" />
                      </div>
                      {isScanning ? (
                        <>
                          <p className="text-sm text-gray-600 mb-4">Scanning in progress...</p>
                          <Progress value={scanProgress} className="mb-4" />
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 mb-4">
                            Last scan: {format(statistics.lastScan, 'MMM dd, HH:mm')}
                          </p>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleComplianceScan}
                          >
                            Run Compliance Scan
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="keys" className="space-y-6">
            {/* Encryption Keys */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Encryption Keys</CardTitle>
                  <Button>
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keys.map(key => (
                    <Card key={key.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{key.name}</h4>
                              <Badge variant={getKeyStatusColor(key.status) as any}>
                                {key.status}
                              </Badge>
                              <Badge>{key.algorithm}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Type</p>
                                <p className="font-medium">{key.type}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Strength</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={key.strength} className="w-20 h-2" />
                                  <span>{key.strength}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-600">Data Encrypted</p>
                                <p className="font-medium">{(key.dataEncrypted / 1024).toFixed(1)} GB</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Next Rotation</p>
                                <p className="font-medium">{format(key.nextRotation, 'MMM dd')}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex gap-2">
                                {key.compliance.gdpr && <Badge variant="outline">GDPR</Badge>}
                                {key.compliance.pci && <Badge variant="outline">PCI</Badge>}
                                {key.compliance.hipaa && <Badge variant="outline">HIPAA</Badge>}
                                {key.compliance.sox && <Badge variant="outline">SOX</Badge>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedKey(key)}
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleKeyRotation(key.id)}
                              disabled={key.status === 'ROTATING'}
                            >
                              Rotate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {/* Encrypted Data */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Encrypted Data Repository</CardTitle>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classifications</SelectItem>
                        <SelectItem value="SECRET">Secret</SelectItem>
                        <SelectItem value="CONFIDENTIAL">Confidential</SelectItem>
                        <SelectItem value="INTERNAL">Internal</SelectItem>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {encryptedData.map(data => (
                    <Card key={data.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-${getClassificationColor(data.classification)}-100`}>
                              <FolderIcon className={`h-5 w-5 text-${getClassificationColor(data.classification)}-600`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{data.name}</h4>
                                <Badge variant={getClassificationColor(data.classification) as any}>
                                  {data.classification}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Type: {data.type} • Size: {(data.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Encrypted: {format(data.encryptedAt, 'MMM dd, yyyy')} • 
                                Owner: {data.owner}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {keys.find(k => k.id === data.keyId)?.name}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* View access log */}}
                            >
                              Access Log
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            {/* Encryption Policies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Encryption Policies</CardTitle>
                  <Button>
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Create Policy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map(policy => (
                    <Card key={policy.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{policy.name}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Data Types</p>
                                <p className="font-medium">{policy.dataTypes.join(', ')}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Algorithms</p>
                                <p className="font-medium">{policy.algorithms.join(', ')}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Key Rotation</p>
                                <p className="font-medium">Every {policy.rotationPeriod} days</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Auto-encrypt</p>
                                <Badge variant={policy.autoEncrypt ? 'success' : 'secondary'}>
                                  {policy.autoEncrypt ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {policy.compliance.map(comp => (
                                <Badge key={comp} variant="outline">{comp}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Switch
                              checked={policy.autoEncrypt}
                              onCheckedChange={(checked) => 
                                updatePolicy(policy.id, { autoEncrypt: checked })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            {/* Audit Log */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Encryption Audit Log</CardTitle>
                  <Button variant="outline">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Timestamp</th>
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Action</th>
                        <th className="text-left py-3 px-4">Resource</th>
                        <th className="text-left py-3 px-4">IP Address</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.recentActivity.map((activity, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            {format(activity.timestamp, 'MMM dd, HH:mm:ss')}
                          </td>
                          <td className="py-3 px-4 text-sm">{activity.user}</td>
                          <td className="py-3 px-4 text-sm">{activity.action}</td>
                          <td className="py-3 px-4 text-sm">{activity.resource}</td>
                          <td className="py-3 px-4 text-sm">{activity.ipAddress}</td>
                          <td className="py-3 px-4">
                            <Badge variant={activity.success ? 'success' : 'destructive'}>
                              {activity.success ? 'Success' : 'Failed'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Key Details Modal */}
      {selectedKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedKey(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Key Details</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedKey(null)}
                >
                  <XCircleIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Key Name</Label>
                  <p className="text-sm font-medium">{selectedKey.name}</p>
                </div>

                <div>
                  <Label>Algorithm</Label>
                  <Badge>{selectedKey.algorithm}</Badge>
                </div>

                <div>
                  <Label>Status</Label>
                  <Badge variant={getKeyStatusColor(selectedKey.status) as any}>
                    {selectedKey.status}
                  </Badge>
                </div>

                <div>
                  <Label>Created</Label>
                  <p className="text-sm">{format(selectedKey.createdAt, 'MMM dd, yyyy HH:mm')}</p>
                </div>

                <div>
                  <Label>Last Rotated</Label>
                  <p className="text-sm">{format(selectedKey.lastRotated, 'MMM dd, yyyy HH:mm')}</p>
                </div>

                <div>
                  <Label>Next Rotation</Label>
                  <p className="text-sm">{format(selectedKey.nextRotation, 'MMM dd, yyyy')}</p>
                </div>

                <div>
                  <Label>Usage Statistics</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Usage Count</p>
                      <p className="font-semibold">{selectedKey.usageCount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Data Encrypted</p>
                      <p className="font-semibold">{(selectedKey.dataEncrypted / 1024).toFixed(1)} GB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Compliance</Label>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(selectedKey.compliance).map(([standard, compliant]) => (
                      <Badge 
                        key={standard}
                        variant={compliant ? 'success' : 'secondary'}
                      >
                        {standard.toUpperCase()}: {compliant ? 'Yes' : 'No'}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedKey(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleKeyRotation(selectedKey.id)}>
                    Rotate Key
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}