'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  KeyIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  UserIcon,
  FolderIcon,
  DocumentTextIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon,
  GlobeAltIcon,
  ServerIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  CommandLineIcon,
  BeakerIcon,
  SignalIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TreeDataNode,
  Tree,
  Sunburst,
  Treemap,
  RadialBar,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAccessControl } from '@/hooks/useAccessControl';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'SYSTEM' | 'CUSTOM' | 'TEMPORARY';
  permissions: Permission[];
  users: string[];
  groups: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  createdAt: Date;
  modifiedAt: Date;
  expiresAt?: Date;
  priority: number;
  metadata: {
    department?: string;
    project?: string;
    compliance?: string[];
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

interface Permission {
  id: string;
  resource: string;
  actions: string[];
  conditions?: Condition[];
  effect: 'ALLOW' | 'DENY';
  scope: 'GLOBAL' | 'ORGANIZATION' | 'PROJECT' | 'RESOURCE';
}

interface Condition {
  type: 'TIME' | 'IP' | 'MFA' | 'LOCATION' | 'DEVICE' | 'CUSTOM';
  operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN';
  value: any;
}

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  groups: string[];
  department: string;
  lastActive: Date;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  mfaEnabled: boolean;
  accessLevel: 'BASIC' | 'STANDARD' | 'ELEVATED' | 'PRIVILEGED';
  sessions: Session[];
}

interface Session {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  startTime: Date;
  lastActivity: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
}

interface Group {
  id: string;
  name: string;
  description: string;
  type: 'DEPARTMENT' | 'PROJECT' | 'CUSTOM';
  members: string[];
  roles: string[];
  parent?: string;
  children?: string[];
  metadata: {
    owner?: string;
    purpose?: string;
    expiresAt?: Date;
  };
}

interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  priority: number;
  status: 'ACTIVE' | 'TESTING' | 'DISABLED';
  appliesTo: {
    users?: string[];
    groups?: string[];
    roles?: string[];
  };
  validFrom: Date;
  validUntil?: Date;
  compliance: string[];
}

interface PolicyRule {
  id: string;
  resource: string;
  actions: string[];
  effect: 'ALLOW' | 'DENY';
  conditions: Condition[];
  priority: number;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  reason?: string;
  ipAddress: string;
  device: string;
  metadata?: any;
}

export default function AccessControlManagement() {
  const {
    roles,
    permissions,
    users,
    groups,
    policies,
    auditLog,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    revokeRole,
    createPolicy,
    updatePolicy,
    evaluateAccess,
    generateReport
  } = useAccessControl();

  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testAccessResult, setTestAccessResult] = useState<any>(null);

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      await createRole(roleData);
      toast.success('Role created successfully');
      setShowCreateRole(false);
    } catch (error) {
      toast.error('Failed to create role');
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await assignRole(userId, roleId);
      toast.success('Role assigned successfully');
    } catch (error) {
      toast.error('Failed to assign role');
    }
  };

  const handleTestAccess = async (userId: string, resource: string, action: string) => {
    try {
      const result = await evaluateAccess(userId, resource, action);
      setTestAccessResult(result);
    } catch (error) {
      toast.error('Failed to evaluate access');
    }
  };

  const getRoleTypeColor = (type: string) => {
    switch (type) {
      case 'SYSTEM': return 'blue';
      case 'CUSTOM': return 'green';
      case 'TEMPORARY': return 'yellow';
      default: return 'gray';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'PRIVILEGED': return 'red';
      case 'ELEVATED': return 'orange';
      case 'STANDARD': return 'blue';
      case 'BASIC': return 'green';
      default: return 'gray';
    }
  };

  const metrics = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'ACTIVE').length,
    totalRoles: roles.length,
    activeRoles: roles.filter(r => r.status === 'ACTIVE').length,
    totalGroups: groups.length,
    activePolicies: policies.filter(p => p.status === 'ACTIVE').length,
    recentAccess: auditLog.filter(a => new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    deniedAccess: auditLog.filter(a => a.result === 'DENIED').length
  };

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Access Control Management</h1>
          <p className="text-gray-600 mt-2">Manage roles, permissions, and access policies</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{metrics.activeUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    of {metrics.totalUsers} total
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Roles</p>
                  <p className="text-2xl font-bold">{metrics.activeRoles}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    of {metrics.totalRoles} total
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <KeyIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Groups</p>
                  <p className="text-2xl font-bold">{metrics.totalGroups}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.activePolicies} active policies
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Access Attempts (24h)</p>
                  <p className="text-2xl font-bold">{metrics.recentAccess}</p>
                  <p className="text-xs text-red-500 mt-1">
                    {metrics.deniedAccess} denied
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="test">Test Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Access Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                  <CardDescription>Users by role type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Admin', value: users.filter(u => u.roles.includes('admin')).length },
                            { name: 'Developer', value: users.filter(u => u.roles.includes('developer')).length },
                            { name: 'Buyer', value: users.filter(u => u.roles.includes('buyer')).length },
                            { name: 'Solicitor', value: users.filter(u => u.roles.includes('solicitor')).length },
                            { name: 'Agent', value: users.filter(u => u.roles.includes('agent')).length }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2, 3, 4].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Activity</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: 'Mon', allowed: 450, denied: 12 },
                        { day: 'Tue', allowed: 520, denied: 18 },
                        { day: 'Wed', allowed: 480, denied: 15 },
                        { day: 'Thu', allowed: 510, denied: 20 },
                        { day: 'Fri', allowed: 590, denied: 25 },
                        { day: 'Sat', allowed: 320, denied: 8 },
                        { day: 'Sun', allowed: 280, denied: 5 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="allowed" stroke="#10B981" name="Allowed" />
                        <Line type="monotone" dataKey="denied" stroke="#EF4444" name="Denied" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hierarchy Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Access Hierarchy</CardTitle>
                <CardDescription>Role and permission relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={[
                        {
                          name: 'Admin',
                          children: [
                            { name: 'Full Access', size: 100 },
                            { name: 'System Config', size: 80 },
                            { name: 'User Management', size: 90 }
                          ]
                        },
                        {
                          name: 'Developer',
                          children: [
                            { name: 'Project Access', size: 85 },
                            { name: 'Code Deploy', size: 70 },
                            { name: 'Database Access', size: 60 }
                          ]
                        },
                        {
                          name: 'Buyer',
                          children: [
                            { name: 'Property View', size: 90 },
                            { name: 'Document Access', size: 70 },
                            { name: 'Transaction View', size: 65 }
                          ]
                        },
                        {
                          name: 'Solicitor',
                          children: [
                            { name: 'Legal Docs', size: 95 },
                            { name: 'Client Access', size: 80 },
                            { name: 'Case Management', size: 85 }
                          ]
                        }
                      ]}
                      dataKey="size"
                      stroke="#fff"
                      fill="#3B82F6"
                    />
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            {/* Roles Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Role Management</CardTitle>
                  <Button onClick={() => setShowCreateRole(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map(role => (
                    <Card key={role.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{role.name}</h4>
                              <Badge variant={getRoleTypeColor(role.type) as any}>
                                {role.type}
                              </Badge>
                              <Badge variant={role.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                {role.status}
                              </Badge>
                              {role.metadata.riskLevel && (
                                <Badge variant={
                                  role.metadata.riskLevel === 'HIGH' ? 'destructive' :
                                  role.metadata.riskLevel === 'MEDIUM' ? 'warning' :
                                  'default'
                                }>
                                  {role.metadata.riskLevel} Risk
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Permissions</p>
                                <p className="font-medium">{role.permissions.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Users</p>
                                <p className="font-medium">{role.users.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Groups</p>
                                <p className="font-medium">{role.groups.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Priority</p>
                                <p className="font-medium">{role.priority}</p>
                              </div>
                            </div>

                            {role.expiresAt && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-yellow-600">
                                <ClockIcon className="h-4 w-4" />
                                Expires: {format(role.expiresAt, 'MMM dd, yyyy')}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedRole(role)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* Edit role */}}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* Delete role */}}
                              disabled={role.type === 'SYSTEM'}
                            >
                              <TrashIcon className="h-4 w-4" />
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

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Access Management</CardTitle>
                  <div className="flex gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Roles</th>
                        <th className="text-left py-3 px-4">Access Level</th>
                        <th className="text-left py-3 px-4">Department</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user => {
                          if (filterType !== 'all' && user.status !== filterType.toUpperCase()) return false;
                          if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                              !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                          return true;
                        })
                        .map(user => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {user.roles.map(roleId => {
                                  const role = roles.find(r => r.id === roleId);
                                  return role ? (
                                    <Badge key={roleId} variant="outline">
                                      {role.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={getAccessLevelColor(user.accessLevel) as any}>
                                {user.accessLevel}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{user.department}</td>
                            <td className="py-3 px-4 text-sm">
                              {format(user.lastActive, 'MMM dd, HH:mm')}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={
                                user.status === 'ACTIVE' ? 'success' :
                                user.status === 'SUSPENDED' ? 'destructive' :
                                'warning'
                              }>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  Manage
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            {/* Access Policies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Access Policies</CardTitle>
                  <Button onClick={() => setShowCreatePolicy(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
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
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{policy.name}</h4>
                              <Badge variant={
                                policy.status === 'ACTIVE' ? 'success' :
                                policy.status === 'TESTING' ? 'warning' :
                                'secondary'
                              }>
                                {policy.status}
                              </Badge>
                              <Badge variant="outline">Priority: {policy.priority}</Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Rules</p>
                                <p className="font-medium">{policy.rules.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Applies to</p>
                                <p className="font-medium">
                                  {(policy.appliesTo.users?.length || 0) + 
                                   (policy.appliesTo.groups?.length || 0) + 
                                   (policy.appliesTo.roles?.length || 0)} entities
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Valid Until</p>
                                <p className="font-medium">
                                  {policy.validUntil ? format(policy.validUntil, 'MMM dd, yyyy') : 'No expiry'}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                              {policy.compliance.map(comp => (
                                <Badge key={comp} variant="outline">{comp}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={policy.status === 'ACTIVE'}
                              onCheckedChange={(checked) => 
                                updatePolicy(policy.id, { 
                                  status: checked ? 'ACTIVE' : 'DISABLED' 
                                })
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
                  <CardTitle>Access Audit Log</CardTitle>
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
                        <th className="text-left py-3 px-4">Result</th>
                        <th className="text-left py-3 px-4">IP Address</th>
                        <th className="text-left py-3 px-4">Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.map(entry => (
                        <tr key={entry.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            {format(entry.timestamp, 'MMM dd, HH:mm:ss')}
                          </td>
                          <td className="py-3 px-4 text-sm">{entry.user}</td>
                          <td className="py-3 px-4 text-sm">{entry.action}</td>
                          <td className="py-3 px-4 text-sm">{entry.resource}</td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              entry.result === 'SUCCESS' ? 'success' :
                              entry.result === 'DENIED' ? 'destructive' :
                              'secondary'
                            }>
                              {entry.result}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{entry.ipAddress}</td>
                          <td className="py-3 px-4 text-sm">{entry.device}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            {/* Access Testing */}
            <Card>
              <CardHeader>
                <CardTitle>Test Access Permissions</CardTitle>
                <CardDescription>Simulate access requests to test your policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>User</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Resource</Label>
                      <Input placeholder="e.g., projects/123/edit" />
                    </div>

                    <div>
                      <Label>Action</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Context</Label>
                      <Textarea 
                        placeholder="Additional context (JSON format)"
                        rows={4}
                      />
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleTestAccess('user123', 'projects/123', 'edit')}
                    >
                      Test Access
                    </Button>
                  </div>

                  <div>
                    {testAccessResult && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Test Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              {testAccessResult.allowed ? (
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                              ) : (
                                <XCircleIcon className="h-8 w-8 text-red-600" />
                              )}
                              <div>
                                <p className="text-lg font-semibold">
                                  Access {testAccessResult.allowed ? 'Granted' : 'Denied'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {testAccessResult.reason}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium">Evaluation Path:</p>
                              {testAccessResult.evaluationPath?.map((step: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm pl-4">
                                  <ArrowRightIcon className="h-3 w-3" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>

                            {testAccessResult.appliedPolicies && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Applied Policies:</p>
                                {testAccessResult.appliedPolicies.map((policy: any, index: number) => (
                                  <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                                    <p className="font-medium">{policy.name}</p>
                                    <p className="text-gray-600">{policy.effect}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Role Dialog */}
      {showCreateRole && (
        <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions and access rights
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Role Name</Label>
                <Input placeholder="e.g., Project Manager" />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the purpose and responsibilities of this role"
                  rows={3}
                />
              </div>

              <div>
                <Label>Role Type</Label>
                <RadioGroup defaultValue="CUSTOM">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CUSTOM" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TEMPORARY" id="temporary" />
                    <Label htmlFor="temporary">Temporary</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="projects-read" />
                    <Label htmlFor="projects-read">Read Projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="projects-write" />
                    <Label htmlFor="projects-write">Write Projects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="users-manage" />
                    <Label htmlFor="users-manage">Manage Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="reports-view" />
                    <Label htmlFor="reports-view">View Reports</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Risk Level</Label>
                <Select defaultValue="MEDIUM">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Compliance</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="gdpr" />
                    <Label htmlFor="gdpr">GDPR</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sox" />
                    <Label htmlFor="sox">SOX</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hipaa" />
                    <Label htmlFor="hipaa">HIPAA</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateRole(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleCreateRole({
                name: 'New Role',
                description: 'Description',
                type: 'CUSTOM',
                permissions: [],
                users: [],
                groups: [],
                status: 'ACTIVE',
                priority: 50,
                metadata: {}
              })}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>User Access Details</DialogTitle>
              <DialogDescription>
                Manage roles, permissions, and access settings for {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User Information</Label>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm"><strong>Name:</strong> {selectedUser.name}</p>
                    <p className="text-sm"><strong>Email:</strong> {selectedUser.email}</p>
                    <p className="text-sm"><strong>Department:</strong> {selectedUser.department}</p>
                    <p className="text-sm"><strong>Status:</strong> {selectedUser.status}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Security Settings</Label>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm"><strong>Access Level:</strong> {selectedUser.accessLevel}</p>
                    <p className="text-sm"><strong>MFA:</strong> {selectedUser.mfaEnabled ? 'Enabled' : 'Disabled'}</p>
                    <p className="text-sm"><strong>Last Active:</strong> {format(selectedUser.lastActive, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Assigned Roles</Label>
                <div className="space-y-2 mt-2">
                  {selectedUser.roles.map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return role ? (
                      <div key={roleId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          Revoke
                        </Button>
                      </div>
                    ) : null;
                  })}
                  <Button className="w-full" variant="outline">
                    Assign New Role
                  </Button>
                </div>
              </div>

              <div>
                <Label>Active Sessions</Label>
                <div className="space-y-2 mt-2">
                  {selectedUser.sessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-600">
                          {session.location} • {session.ipAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          Started: {format(session.startTime, 'MMM dd, HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={session.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {session.status}
                        </Badge>
                        {session.status === 'ACTIVE' && (
                          <Button size="sm" variant="ghost" className="mt-2">
                            Terminate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button variant="destructive">
                Suspend User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}