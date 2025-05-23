'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  BellRing,
  Plus,
  Settings,
  Trash2,
  Edit,
  Calendar,
  MapPin,
  Euro,
  Home,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Volume2,
  VolumeX,
  Check,
  X,
  Clock,
  Zap,
  Star,
  Heart,
  Building,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Target,
  Activity,
  ChevronRight,
  Save,
  Send,
  FileText,
  Download,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

interface PropertyAlertsManagerProps {
  userId?: string;
  onAlertCreated?: (alert: PropertyAlert) => void;
  onAlertDeleted?: (alertId: string) => void;
}

interface PropertyAlert {
  id: string;
  userId: string;
  name: string;
  type: 'price_drop' | 'new_listing' | 'price_change' | 'status_change' | 'open_house' | 'market_trend';
  criteria: AlertCriteria;
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
  channels: NotificationChannel[];
  status: 'active' | 'paused' | 'expired';
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
  expiresAt?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

interface AlertCriteria {
  locations?: string[];
  propertyTypes?: PropertyType[];
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  areaMin?: number;
  areaMax?: number;
  features?: string[];
  developers?: string[];
  priceDropPercentage?: number;
  daysOnMarket?: number;
  keywords?: string[];
  excludeKeywords?: string[];
}

interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in_app';
  enabled: boolean;
  settings?: {
    email?: string;
    phone?: string;
    sound?: boolean;
    vibrate?: boolean;
  };
}

interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: PropertyAlert['type'];
  defaultCriteria: AlertCriteria;
  popularityScore: number;
}

type PropertyType = 'apartment' | 'house' | 'townhouse' | 'penthouse' | 'studio' | 'duplex';

// Alert templates for quick setup
const alertTemplates: AlertTemplate[] = [
  {
    id: 'price-drop',
    name: 'Price Drop Alert',
    description: 'Get notified when properties drop in price',
    icon: <TrendingDown className="h-5 w-5" />,
    type: 'price_drop',
    defaultCriteria: { priceDropPercentage: 5 },
    popularityScore: 95
  },
  {
    id: 'new-listing',
    name: 'New Listing Alert',
    description: 'Be the first to know about new properties',
    icon: <Sparkles className="h-5 w-5" />,
    type: 'new_listing',
    defaultCriteria: {},
    popularityScore: 88
  },
  {
    id: 'open-house',
    name: 'Open House Alert',
    description: 'Never miss an open house event',
    icon: <Home className="h-5 w-5" />,
    type: 'open_house',
    defaultCriteria: {},
    popularityScore: 72
  },
  {
    id: 'status-change',
    name: 'Status Change Alert',
    description: 'Track when properties change status',
    icon: <Activity className="h-5 w-5" />,
    type: 'status_change',
    defaultCriteria: {},
    popularityScore: 65
  },
  {
    id: 'market-trend',
    name: 'Market Trend Alert',
    description: 'Stay informed about market movements',
    icon: <BarChart3 className="h-5 w-5" />,
    type: 'market_trend',
    defaultCriteria: {},
    popularityScore: 58
  }
];

// Common locations in Dublin
const dublinLocations = [
  'Dublin 1', 'Dublin 2', 'Dublin 3', 'Dublin 4', 'Dublin 6', 'Dublin 6W',
  'Dublin 7', 'Dublin 8', 'Dublin 9', 'Dublin 11', 'Dublin 12', 'Dublin 13',
  'Dublin 14', 'Dublin 15', 'Dublin 16', 'Dublin 17', 'Dublin 18', 'Dublin 20',
  'Dublin 22', 'Dublin 24', 'Dun Laoghaire', 'Blackrock', 'Sandyford', 'Stillorgan'
];

// Property features
const propertyFeatures = [
  'Parking', 'Garage', 'Garden', 'Balcony', 'Terrace', 'Sea View',
  'City View', 'Gym', 'Swimming Pool', 'Concierge', 'Security',
  'Pet Friendly', 'Furnished', 'Unfurnished', 'New Build', 'Period Property',
  'South Facing', 'Walk-in Wardrobe', 'En-suite', 'Home Office', 'Storage'
];

export default function PropertyAlertsManager({
  userId,
  onAlertCreated,
  onAlertDeleted
}: PropertyAlertsManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTabsetActiveTab] = useState('my-alerts');
  const [showCreateModalsetShowCreateModal] = useState(false);
  const [editingAlertsetEditingAlert] = useState<PropertyAlert | null>(null);

  // Form state for creating/editing alerts
  const [alertFormsetAlertForm] = useState({
    name: '',
    type: 'new_listing' as PropertyAlert['type'],
    criteria: {} as AlertCriteria,
    frequency: 'instant' as PropertyAlert['frequency'],
    channels: [
      { type: 'email', enabled: true },
      { type: 'push', enabled: true },
      { type: 'sms', enabled: false },
      { type: 'in_app', enabled: true }
    ] as NotificationChannel[],
    priority: 'medium' as PropertyAlert['priority'],
    tags: [] as string[]
  });

  // Fetch user alerts
  const { data: alerts = [], isLoading, error } = useQuery<PropertyAlert[]>({
    queryKey: ['property-alerts', userId],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          userId: userId || 'user-123',
          name: 'Dublin 2 Price Drops',
          type: 'price_drop',
          criteria: {
            locations: ['Dublin 2'],
            priceDropPercentage: 5,
            propertyTypes: ['apartment', 'penthouse']
          },
          frequency: 'instant',
          channels: [
            { type: 'email', enabled: true },
            { type: 'push', enabled: true }
          ],
          status: 'active',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          triggerCount: 3,
          priority: 'high',
          tags: ['investment', 'urgent']
        },
        {
          id: '2',
          userId: userId || 'user-123',
          name: 'New Family Homes',
          type: 'new_listing',
          criteria: {
            propertyTypes: ['house', 'townhouse'],
            bedroomsMin: 3,
            features: ['Garden', 'Parking'],
            priceMax: 600000
          },
          frequency: 'daily',
          channels: [
            { type: 'email', enabled: true }
          ],
          status: 'active',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          triggerCount: 8,
          priority: 'medium',
          tags: ['family', 'primary residence']
        }
      ];
    },
    staleTime: 30000
  });

  // Create alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (alert: Omit<PropertyAlert, 'id' | 'createdAt' | 'triggerCount'>) => {
      // API call to create alert
      const response = await fetch('/api/property-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert as any)
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast({
        title: 'Alert Created',
        description: 'Your property alert has been set up successfully'
      });
      onAlertCreated?.(data as any);
      setShowCreateModal(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create alert',
        variant: 'destructive'
      });
    }
  });

  // Update alert mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, ...update }: Partial<PropertyAlert> & { id: string }) => {
      const response = await fetch(`/api/property-alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast({
        title: 'Alert Updated',
        description: 'Your alert has been updated successfully'
      });
      setEditingAlert(null);
    }
  });

  // Delete alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/property-alerts/${alertId}`, {
        method: 'DELETE'
      });
      return response.json();
    },
    onSuccess: (_: any, alertId: any) => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast({
        title: 'Alert Deleted',
        description: 'Your alert has been removed'
      });
      onAlertDeleted?.(alertId: any);
    }
  });

  // Toggle alert status
  const toggleAlertStatus = async (alert: PropertyAlert) => {
    const newStatus = alert.status === 'active' ? 'paused' : 'active';
    updateAlertMutation.mutate({
      id: alert.id,
      status: newStatus
    });
  };

  // Handle template selection
  const handleTemplateSelect = (template: AlertTemplate) => {
    setAlertForm({
      ...alertForm,
      name: template.name,
      type: template.type,
      criteria: template.defaultCriteria
    });
    setShowCreateModal(true);
  };

  // Reset form
  const resetForm = () => {
    setAlertForm({
      name: '',
      type: 'new_listing',
      criteria: {},
      frequency: 'instant',
      channels: [
        { type: 'email', enabled: true },
        { type: 'push', enabled: true },
        { type: 'sms', enabled: false },
        { type: 'in_app', enabled: true }
      ],
      priority: 'medium',
      tags: []
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!alertForm.name) {
      toast({
        title: 'Name Required',
        description: 'Please provide a name for your alert',
        variant: 'destructive'
      });
      return;
    }

    if (editingAlert) {
      updateAlertMutation.mutate({
        id: editingAlert.id,
        ...alertForm
      });
    } else {
      createAlertMutation.mutate({
        ...alertForm,
        userId: userId || 'user-123',
        status: 'active',
        triggerCount: 0
      });
    }
  };

  // Filter active alerts
  const activeAlerts = alerts.filter(alert: any => alert.status === 'active');
  const pausedAlerts = alerts.filter(alert: any => alert.status === 'paused');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Bell className="h-6 w-6 mr-2" />
            Property Alerts
          </h2>
          <p className="text-muted-foreground mt-1">
            Stay informed about properties that match your criteria
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-alerts" className="flex items-center">
            <BellRing className="h-4 w-4 mr-2" />
            My Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* My Alerts Tab */}
        <TabsContent value="my-alerts" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitoring your criteria
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alerts.reduce((sum: any, alert: any) => sum + alert.triggerCount0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Properties found this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Notification Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Badge variant="secondary">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Badge>
                  <Badge variant="secondary">
                    <Smartphone className="h-3 w-3 mr-1" />
                    Push
                  </Badge>
                  <Badge variant="secondary">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    SMS
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Alerts Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first alert to start monitoring properties
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Alert
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <motion.div
                  key={alert.id}
                  initial={ opacity: 0, y: 20 }
                  animate={ opacity: 1, y: 0 }
                  exit={ opacity: 0, y: -20 }
                >
                  <Card className={alert.status === 'paused' ? 'opacity-60' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{alert.name}</h3>
                            <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                              {alert.status === 'active' ? (
                                <PlayCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <PauseCircle className="h-3 w-3 mr-1" />
                              )}
                              {alert.status}
                            </Badge>
                            <Badge variant={
                              alert.priority === 'high' ? 'destructive' :
                              alert.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {alert.priority} priority
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {alert.criteria.locations?.join(', ') || 'All locations'}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {alert.criteria.propertyTypes?.join(', ') || 'All types'}
                                </span>
                              </div>
                              {alert.criteria.priceMin || alert.criteria.priceMax ? (
                                <div className="flex items-center text-sm">
                                  <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>
                                    €{alert.criteria.priceMin?.toLocaleString() || '0'} - 
                                    €{alert.criteria.priceMax?.toLocaleString() || '∞'}
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{alert.frequency} notifications</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {alert.triggerCount} matches
                                  {alert.lastTriggered && (
                                    <span className="text-muted-foreground">
                                      {' '}• Last: {formatDistanceToNow(alert.lastTriggered, { addSuffix: true })}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                {alert.channels.filter(c: any => c.enabled).map((channel: any) => (
                                  <Badge key={channel.type} variant="outline" className="text-xs">
                                    {channel.type === 'email' && <Mail className="h-3 w-3 mr-1" />}
                                    {channel.type === 'sms' && <MessageSquare className="h-3 w-3 mr-1" />}
                                    {channel.type === 'push' && <Smartphone className="h-3 w-3 mr-1" />}
                                    {channel.type === 'in_app' && <Bell className="h-3 w-3 mr-1" />}
                                    {channel.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {alert.tags && alert.tags.length> 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {alert.tags.map((tag: any) => (
                                <Badge key={tag: any} variant="secondary" className="text-xs">
                                  {tag: any}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleAlertStatus(alert: any)}
                          >
                            {alert.status === 'active' ? (
                              <PauseCircle className="h-4 w-4" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingAlert(alert: any);
                              setAlertForm({
                                name: alert.name,
                                type: alert.type,
                                criteria: alert.criteria,
                                frequency: alert.frequency,
                                channels: alert.channels,
                                priority: alert.priority,
                                tags: alert.tags || []
                              });
                              setShowCreateModal(true);
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAlertMutation.mutate(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertTemplates.map((template: any) => (
              <motion.div
                key={template.id}
                whileHover={ scale: 1.02 }
                whileTap={ scale: 0.98 }
              >
                <Card className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleTemplateSelect(template)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        {template.popularityScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Alert Combinations</CardTitle>
              <CardDescription>
                Most successful alert strategies used by other buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">First-Time Buyer Bundle</h4>
                  <Badge variant="default">Most Popular</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Perfect for first-time buyers looking for affordable homes
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">Price drops on apartments</Badge>
                  <Badge variant="outline">New builds under €400k</Badge>
                  <Badge variant="outline">Help-to-Buy eligible</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Create Bundle
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Investment Property Pack</h4>
                  <Badge variant="secondary">High ROI</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Focus on properties with strong rental potential
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">High-demand locations</Badge>
                  <Badge variant="outline">Near universities</Badge>
                  <Badge variant="outline">Price-to-rent ratio alerts</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Create Bundle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive property alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant alerts on your device
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for urgent alerts
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      See alerts within the app
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From</Label>
                    <Select defaultValue="22">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_: anyi) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To</Label>
                    <Select defaultValue="8">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_: anyi) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  No notifications will be sent during quiet hours
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alert Digest</h4>
                <RadioGroup defaultValue="instant">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant">Send alerts instantly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly">Hourly digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily digest at 9:00 AM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly digest on Mondays</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Limits</CardTitle>
              <CardDescription>
                Manage your alert quotas and usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Alerts</span>
                  <span className="font-medium">{activeAlerts.length} / 10</span>
                </div>
                <Progress value={(activeAlerts.length / 10) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Notifications</span>
                  <span className="font-medium">234 / 1000</span>
                </div>
                <Progress value={23.4} />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get unlimited alerts, advanced filters, and priority notifications
                </p>
                <Button className="mt-3" variant="outline">
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Alert Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={ opacity: 0 }
            animate={ opacity: 1 }
            exit={ opacity: 0 }
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={ scale: 0.95, opacity: 0 }
              animate={ scale: 1, opacity: 1 }
              exit={ scale: 0.95, opacity: 0 }
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {editingAlert ? 'Edit Alert' : 'Create New Alert'}
                </h2>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Alert Name */}
                  <div>
                    <Label>Alert Name</Label>
                    <Input
                      value={alertForm.name}
                      onChange={(e: React.MouseEvent) => setAlertForm({ ...alertForm, name: e.target.value })}
                      placeholder="e.g., Dublin 2 Apartments"
                      className="mt-1"
                    />
                  </div>

                  {/* Alert Type */}
                  <div>
                    <Label>Alert Type</Label>
                    <Select
                      value={alertForm.type}
                      onValueChange={(value: any) => setAlertForm({ ...alertForm, type: value as PropertyAlert['type'] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_listing">New Listings</SelectItem>
                        <SelectItem value="price_drop">Price Drops</SelectItem>
                        <SelectItem value="price_change">Price Changes</SelectItem>
                        <SelectItem value="status_change">Status Changes</SelectItem>
                        <SelectItem value="open_house">Open Houses</SelectItem>
                        <SelectItem value="market_trend">Market Trends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label>Locations</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {dublinLocations.map((location: any) => (
                        <label
                          key={location}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={alertForm.criteria.locations?.includes(location) || false}
                            onCheckedChange={(checked: any) => {
                              const locations = alertForm.criteria.locations || [];
                              setAlertForm({
                                ...alertForm,
                                criteria: {
                                  ...alertForm.criteria,
                                  locations: checked
                                    ? [...locationslocation]
                                    : locations.filter(l => l !== location)
                                }
                              });
                            }
                          />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
                    <Label>Property Types</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['apartment', 'house', 'townhouse', 'penthouse', 'studio', 'duplex'].map((type: any) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={alertForm.criteria.propertyTypes?.includes(type as PropertyType) || false}
                            onCheckedChange={(checked: any) => {
                              const types = alertForm.criteria.propertyTypes || [];
                              setAlertForm({
                                ...alertForm,
                                criteria: {
                                  ...alertForm.criteria,
                                  propertyTypes: checked
                                    ? [...types, type as PropertyType]
                                    : types.filter(t => t !== type)
                                }
                              });
                            }
                          />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>Price Range</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Min price"
                          value={alertForm.criteria.priceMin || ''}
                          onChange={(e: React.MouseEvent) => setAlertForm({
                            ...alertForm,
                            criteria: {
                              ...alertForm.criteria,
                              priceMin: Number(e.target.value) || undefined
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Max price"
                          value={alertForm.criteria.priceMax || ''}
                          onChange={(e: React.MouseEvent) => setAlertForm({
                            ...alertForm,
                            criteria: {
                              ...alertForm.criteria,
                              priceMax: Number(e.target.value) || undefined
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms and Bathrooms */}
                  <div>
                    <Label>Bedrooms & Bathrooms</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Min bedrooms"
                          value={alertForm.criteria.bedroomsMin || ''}
                          onChange={(e: React.MouseEvent) => setAlertForm({
                            ...alertForm,
                            criteria: {
                              ...alertForm.criteria,
                              bedroomsMin: Number(e.target.value) || undefined
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Min bathrooms"
                          value={alertForm.criteria.bathroomsMin || ''}
                          onChange={(e: React.MouseEvent) => setAlertForm({
                            ...alertForm,
                            criteria: {
                              ...alertForm.criteria,
                              bathroomsMin: Number(e.target.value) || undefined
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {propertyFeatures.map((feature: any) => (
                        <label
                          key={feature}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={alertForm.criteria.features?.includes(feature) || false}
                            onCheckedChange={(checked: any) => {
                              const features = alertForm.criteria.features || [];
                              setAlertForm({
                                ...alertForm,
                                criteria: {
                                  ...alertForm.criteria,
                                  features: checked
                                    ? [...featuresfeature]
                                    : features.filter(f => f !== feature)
                                }
                              });
                            }
                          />
                          <span className="text-sm">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <Label>Notification Channels</Label>
                    <div className="space-y-3 mt-2">
                      {alertForm.channels.map((channel: anyindex) => (
                        <div key={channel.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {channel.type === 'email' && <Mail className="h-4 w-4" />}
                            {channel.type === 'sms' && <MessageSquare className="h-4 w-4" />}
                            {channel.type === 'push' && <Smartphone className="h-4 w-4" />}
                            {channel.type === 'in_app' && <Bell className="h-4 w-4" />}
                            <span className="capitalize">{channel.type}</span>
                          </div>
                          <Switch
                            checked={channel.enabled}
                            onCheckedChange={(checked: any) => {
                              const channels = [...alertForm.channels];
                              channels[index].enabled = checked;
                              setAlertForm({ ...alertForm, channels });
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <Label>Notification Frequency</Label>
                    <Select
                      value={alertForm.frequency}
                      onValueChange={(value: any) => setAlertForm({ ...alertForm, frequency: value as PropertyAlert['frequency'] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                        <SelectItem value="monthly">Monthly Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div>
                    <Label>Alert Priority</Label>
                    <RadioGroup
                      value={alertForm.priority}
                      onValueChange={(value: any) => setAlertForm({ ...alertForm, priority: value as PropertyAlert['priority'] })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low">Low - Standard notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium - Priority notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high">High - Urgent notifications (may bypass quiet hours)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Tags (optional)</Label>
                    <Input
                      placeholder="Enter tags separated by commas"
                      value={alertForm.tags?.join(', ') || ''}
                      onChange={(e: React.MouseEvent) => setAlertForm({
                        ...alertForm,
                        tags: e.target.value.split(',').map(tag: any => tag.trim()).filter(Boolean)
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                  setEditingAlert(null);
                }>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingAlert ? 'Update Alert' : 'Create Alert'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}