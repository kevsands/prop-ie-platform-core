/**
 * Testing Dashboard for Development Teams
 * 
 * This dashboard provides a central location for development teams to:
 * - View test coverage statistics
 * - Monitor test performance
 * - View failing tests
 * - Analyze performance regression trends
 * - Access detailed test reports
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  CheckCircle, XCircle, AlertTriangle, Clock, TrendingUp, TrendingDown, 
  RefreshCw, Search, FileText, ChevronRight
} from 'lucide-react';

// Types
interface CoverageMetric {
  name: string;
  value: number;
  target: number;
  status: 'success' | 'warning' | 'danger';
}

interface PerformanceMetric {
  name: string;
  currentValue: number;
  previousValue: number;
  change: number;
  threshold: number;
  status: 'improved' | 'degraded' | 'stable';
}

interface TestResult {
  name: string;
  component: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  errorMessage?: string;
}

interface CoverageHistory {
  date: string;
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

// Sample data (in a real app, these would be fetched from an API)
const coverageMetrics: CoverageMetric[] = [
  { name: 'Statements', value: 84, target: 80, status: 'success' },
  { name: 'Branches', value: 72, target: 75, status: 'warning' },
  { name: 'Functions', value: 88, target: 80, status: 'success' },
  { name: 'Lines', value: 86, target: 80, status: 'success' }];

const performanceMetrics: PerformanceMetric[] = [
  { 
    name: 'Homepage Render', 
    currentValue: 210, 
    previousValue: 250, 
    change: -16, 
    threshold: 300,
    status: 'improved' 
  },
  { 
    name: 'Property Search', 
    currentValue: 520, 
    previousValue: 480, 
    change: 8, 
    threshold: 600,
    status: 'degraded' 
  },
  { 
    name: 'Login Flow', 
    currentValue: 350, 
    previousValue: 345, 
    change: 1, 
    threshold: 400,
    status: 'stable' 
  },
  { 
    name: 'Dashboard Load', 
    currentValue: 430, 
    previousValue: 500, 
    change: -14, 
    threshold: 500,
    status: 'improved' 
  }];

const failedTests: TestResult[] = [
  { 
    name: 'should handle auth token refresh', 
    component: 'AuthContext', 
    status: 'failed', 
    duration: 245,
    errorMessage: 'Expected refresh to be called but it was not called'
  },
  { 
    name: 'should handle property search with filters', 
    component: 'PropertySearch', 
    status: 'failed', 
    duration: 189,
    errorMessage: 'Timeout waiting for search results to load'
  }];

const recentTests: TestResult[] = [
  { name: 'should render login form', component: 'LoginForm', status: 'passed', duration: 145 },
  { name: 'should validate user input', component: 'RegisterForm', status: 'passed', duration: 210 },
  { name: 'should display property details', component: 'PropertyDetail', status: 'passed', duration: 270 },
  { name: 'should load property images', component: 'PropertyGallery', status: 'passed', duration: 330 },
  { name: 'should handle auth token refresh', component: 'AuthContext', status: 'failed', duration: 245 },
  { name: 'should handle property search with filters', component: 'PropertySearch', status: 'failed', duration: 189 },
  { name: 'should lazy load dashboard components', component: 'BuyerDashboard', status: 'passed', duration: 420 },
  { name: 'should handle form submission', component: 'ContactForm', status: 'passed', duration: 185 }];

const coverageHistory: CoverageHistory[] = [
  { date: '2025-04-01', statements: 70, branches: 61, functions: 72, lines: 74 },
  { date: '2025-04-08', statements: 75, branches: 64, functions: 78, lines: 77 },
  { date: '2025-04-15', statements: 78, branches: 67, functions: 82, lines: 80 },
  { date: '2025-04-22', statements: 80, branches: 68, functions: 83, lines: 82 },
  { date: '2025-04-29', statements: 82, branches: 70, functions: 85, lines: 84 },
  { date: '2025-05-03', statements: 84, branches: 72, functions: 88, lines: 86 }];

const performanceHistory = [
  { date: '2025-04-01', homepage: 280, search: 620, login: 390, dashboard: 520 },
  { date: '2025-04-08', homepage: 270, search: 580, login: 380, dashboard: 490 },
  { date: '2025-04-15', homepage: 250, search: 560, login: 370, dashboard: 470 },
  { date: '2025-04-22', homepage: 240, search: 540, login: 360, dashboard: 450 },
  { date: '2025-04-29', homepage: 230, search: 520, login: 350, dashboard: 440 },
  { date: '2025-05-03', homepage: 210, search: 520, login: 350, dashboard: 430 }];

// Color constants
const colors = {
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  improved: '#10b981',
  degraded: '#ef4444',
  stable: '#6b7280',
  passed: '#10b981',
  failed: '#ef4444',
  skipped: '#6b7280',
  primary: '#3b82f6',
  statements: '#3b82f6',
  branches: '#8b5cf6',
  functions: '#ec4899',
  lines: '#14b8a6'};

// Get status color
const getStatusColor = (status: string): string => {
  return colors[status] || colors.primary;
};

// Format duration in ms to readable string
const formatDuration = (ms: number): string => {
  if (ms <1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

// Format percentage change
const formatChange = (change: number): string => {
  return change>= 0 ? `+${change}%` : `${change}%`;
};

// Dashboard Component
const TestDashboard: React.FC = () => {
  const [activeTabsetActiveTab] = useState('overview');
  const [isLoadingsetIsLoading] = useState(false);
  const [lastUpdatedsetLastUpdated] = useState(new Date());

  // In a real app, this would fetch data from an API
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coverage Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} />
                  Coverage Summary
                </CardTitle>
                <CardDescription>
                  Overall test coverage metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coverageMetrics.map((metric: any) => (
                    <div key={metric.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{metric.value}%</span>
                          <Badge 
                            className={`bg-${metric.status === 'success' ? 'green' : metric.status === 'warning' ? 'yellow' : 'red'}-100 text-${metric.status === 'success' ? 'green' : metric.status === 'warning' ? 'yellow' : 'red'}-800`}
                            style={ 
                              backgroundColor: `${getStatusColor(metric.status)}20`,
                              color: getStatusColor(metric.status)
                            }
                          >
                            {metric.status === 'success' ? 'Meets Target' : metric.status === 'warning' ? 'Near Target' : 'Below Target'}
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={metric.value} 
                        max={100} 
                        className="h-2"
                        indicatorClassName="bg-primary" 
                        style={ 
                          '--progress-background': '#e5e7eb',
                          '--progress-foreground': getStatusColor(metric.status)
                        } as React.CSSProperties}
                      />
                      <p className="text-xs text-gray-500">Target: {metric.target}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
                  View Full Report
                  <ChevronRight size={16} />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  Performance Summary
                </CardTitle>
                <CardDescription>
                  Key user journey performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric: any) => (
                    <div key={metric.name} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{metric.name}</p>
                        <p className="text-xs text-gray-500">Threshold: {metric.threshold}ms</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-sm font-bold">{metric.currentValue}ms</span>
                          <Badge
                            className="flex items-center gap-1"
                            style={ 
                              backgroundColor: `${getStatusColor(metric.status)}20`,
                              color: getStatusColor(metric.status)
                            }
                          >
                            {metric.status === 'improved' ? (
                              <TrendingDown size={12} />
                            ) : metric.status === 'degraded' ? (
                              <TrendingUp size={12} />
                            ) : (
                              <div className="w-3 h-[2px] bg-current" />
                            )}
                            {formatChange(metric.change)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Previous: {metric.previousValue}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
                  View Performance Tests
                  <ChevronRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Failed Tests Section */}
          <Card className={failedTests.length> 0 ? 'border-red-200' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle size={18} color={colors.failed} />
                Failed Tests
              </CardTitle>
              <CardDescription>
                {failedTests.length> 0 
                  ? `${failedTests.length} tests are currently failing`
                  : 'All tests are passing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {failedTests.length> 0 ? (
                <div className="space-y-4">
                  {failedTests.map((testindex: any) => (
                    <Alert key={index} className="bg-red-50 border-red-200">
                      <AlertTitle className="flex items-center gap-2 font-bold">
                        <XCircle size={16} className="text-red-500" />
                        {test.component}: {test.name}
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <p className="text-red-600">{test.errorMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {formatDuration(test.duration)}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-lg font-medium text-gray-900">All tests are passing</p>
                    <p className="text-sm text-gray-500">
                      {recentTests.length} tests ran successfully in the last build
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {failedTests.length> 0 && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
                  Debug Failed Tests
                  <ChevronRight size={16} />
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Coverage Trends</CardTitle>
              <CardDescription>
                Test coverage metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={coverageHistory}
                    margin={ top: 5, right: 30, left: 20, bottom: 5 }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="statements" 
                      stroke={colors.statements} 
                      activeDot={ r: 8 } 
                      name="Statements"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="branches" 
                      stroke={colors.branches} 
                      name="Branches"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="functions" 
                      stroke={colors.functions} 
                      name="Functions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lines" 
                      stroke={colors.lines} 
                      name="Lines"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Coverage Tab */}
        <TabsContent value="coverage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Coverage Details</CardTitle>
              <CardDescription>
                Detailed breakdown of test coverage by module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {coverageMetrics.map((metric: any) => (
                    <Card key={metric.name} className="p-4">
                      <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                      <p className="text-3xl font-bold" style={ color: getStatusColor(metric.status) }>
                        {metric.value}%
                      </p>
                      <div className="flex items-center mt-2">
                        <Progress 
                          value={metric.value} 
                          max={100} 
                          className="h-1 flex-1"
                          style={ 
                            '--progress-background': '#e5e7eb',
                            '--progress-foreground': getStatusColor(metric.status)
                          } as React.CSSProperties}
                        />
                        <span className="text-xs ml-2 text-gray-500">Target: {metric.target}%</span>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Coverage chart would go here */}
                <div className="h-80 mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Auth Components', statements: 92, branches: 84, functions: 94, lines: 93 },
                        { name: 'UI Components', statements: 88, branches: 76, functions: 90, lines: 89 },
                        { name: 'Services', statements: 86, branches: 78, functions: 84, lines: 85 },
                        { name: 'API Clients', statements: 80, branches: 72, functions: 82, lines: 81 },
                        { name: 'Utils', statements: 94, branches: 88, functions: 96, lines: 95 },
                        { name: 'Contexts', statements: 82, branches: 64, functions: 88, lines: 80 },
                        { name: 'Security', statements: 90, branches: 86, functions: 92, lines: 91 }]}
                      margin={ top: 20, right: 30, left: 20, bottom: 5 }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="statements" name="Statements" fill={colors.statements} />
                      <Bar dataKey="branches" name="Branches" fill={colors.branches} />
                      <Bar dataKey="functions" name="Functions" fill={colors.functions} />
                      <Bar dataKey="lines" name="Lines" fill={colors.lines} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Open Full Coverage Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key user journey performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceHistory}
                    margin={ top: 5, right: 30, left: 20, bottom: 5 }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="homepage" 
                      stroke="#3b82f6" 
                      name="Homepage (ms)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="search" 
                      stroke="#8b5cf6" 
                      name="Property Search (ms)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="login" 
                      stroke="#ec4899" 
                      name="Login Flow (ms)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dashboard" 
                      stroke="#14b8a6" 
                      name="Dashboard Load (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Performance</h3>
                <div className="divide-y">
                  {performanceMetrics.map((metric: any) => (
                    <div key={metric.name} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <div className="flex items-center mt-1">
                          <Badge
                            className="flex items-center gap-1"
                            style={ 
                              backgroundColor: `${getStatusColor(metric.status)}20`,
                              color: getStatusColor(metric.status)
                            }
                          >
                            {metric.status === 'improved' ? (
                              <TrendingDown size={12} />
                            ) : metric.status === 'degraded' ? (
                              <TrendingUp size={12} />
                            ) : (
                              <div className="w-3 h-[2px] bg-current" />
                            )}
                            {formatChange(metric.change)}
                          </Badge>
                          <span className="text-xs ml-2 text-gray-500">
                            From {metric.previousValue}ms to {metric.currentValue}ms
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{metric.currentValue}ms</p>
                        <p className="text-xs text-gray-500">
                          Threshold: {metric.threshold}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Run Performance Tests</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Test Results Tab */}
        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Latest test runs and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <Card className="p-4 flex-1 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} className="text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Passed</p>
                        <p className="text-2xl font-bold text-green-600">
                          {recentTests.filter(t => t.status === 'passed').length}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 flex-1 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                      <XCircle size={24} className="text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Failed</p>
                        <p className="text-2xl font-bold text-red-600">
                          {recentTests.filter(t => t.status === 'failed').length}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 flex-1 bg-gray-50 border-gray-200">
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                        <p className="text-xl font-bold text-gray-600">
                          {formatDuration(
                            recentTests.reduce((sumtest: any) => sum + test.duration0) / recentTests.length
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-3 bg-gray-50 font-medium text-gray-600">Test</th>
                        <th className="text-left py-2 px-3 bg-gray-50 font-medium text-gray-600">Component</th>
                        <th className="text-left py-2 px-3 bg-gray-50 font-medium text-gray-600">Status</th>
                        <th className="text-right py-2 px-3 bg-gray-50 font-medium text-gray-600">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentTests.map((testindex: any) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-3">{test.name}</td>
                          <td className="py-3 px-3">{test.component}</td>
                          <td className="py-3 px-3">
                            <Badge
                              className="inline-flex items-center gap-1"
                              style={ 
                                backgroundColor: `${getStatusColor(test.status)}20`,
                                color: getStatusColor(test.status)
                              }
                            >
                              {test.status === 'passed' ? (
                                <CheckCircle size={12} />
                              ) : test.status === 'failed' ? (
                                <XCircle size={12} />
                              ) : (
                                <Clock size={12} />
                              )}
                              {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-right font-mono">
                            {formatDuration(test.duration)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All Tests</Button>
              <Button>Run Tests</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestDashboard;