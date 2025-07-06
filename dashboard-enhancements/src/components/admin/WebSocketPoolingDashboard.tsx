/**
 * WebSocket Connection Pooling Dashboard
 * 
 * Advanced monitoring dashboard for WebSocket connection pools
 * with real-time metrics and scaling controls
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Server, Users, Zap, TrendingUp, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface PoolMetrics {
  totalConnections: number;
  activeConnections: number;
  connectionsPerSecond: number;
  messagesPerSecond: number;
  averageLatency: number;
  connectionUptime: number;
  errorRate: number;
  poolUtilization: number;
  poolCount: number;
}

interface PoolStatus {
  poolId: string;
  connections: number;
  maxConnections: number;
  utilization: number;
  healthyConnections: number;
  isShuttingDown: boolean;
  metrics: any;
}

interface HealthData {
  isHealthy: boolean;
  utilization: number;
  errorRate: number;
  totalConnections: number;
  activeConnections: number;
  recommendations: string[];
}

export default function WebSocketPoolingDashboard() {
  const [metrics, setMetrics] = useState<PoolMetrics | null>(null);
  const [pools, setPools] = useState<PoolStatus[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAllData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchAllData = async () => {
    try {
      const [metricsRes, poolsRes, healthRes] = await Promise.all([
        fetch('/api/realtime/pooling?action=stats'),
        fetch('/api/realtime/pooling?action=pools'),
        fetch('/api/realtime/pooling?action=health')
      ]);

      const [metricsData, poolsData, healthData] = await Promise.all([
        metricsRes.json(),
        poolsRes.json(),
        healthRes.json()
      ]);

      if (metricsData.success) {
        setMetrics(metricsData.data);
        updateHistoricalData(metricsData.data);
      }
      
      if (poolsData.success) {
        setPools(poolsData.data.pools);
      }
      
      if (healthData.success) {
        setHealth(healthData.data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch pooling data:', error);
      setIsLoading(false);
    }
  };

  const updateHistoricalData = (newMetrics: PoolMetrics) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistoricalData(prev => {
      const updated = [...prev, { 
        time: timestamp, 
        ...newMetrics 
      }].slice(-20); // Keep last 20 data points
      return updated;
    });
  };

  const createNewPool = async () => {
    try {
      const poolId = `pool_${Date.now()}`;
      const response = await fetch('/api/realtime/pooling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId,
          maxConnections: 1000,
          maxConnectionsPerUser: 10
        })
      });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Failed to create pool:', error);
    }
  };

  const removePool = async (poolId: string) => {
    try {
      const response = await fetch(`/api/realtime/pooling?poolId=${poolId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Failed to remove pool:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading connection pool metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WebSocket Connection Pooling</h2>
          <p className="text-muted-foreground">
            Monitor and manage extreme scale WebSocket connections
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Auto" : "Manual"}
          </Button>
          <Button onClick={fetchAllData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {health.isHealthy ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              )}
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{health.totalConnections}</div>
                <div className="text-sm text-muted-foreground">Total Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{health.activeConnections}</div>
                <div className="text-sm text-muted-foreground">Active Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{health.utilization.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Pool Utilization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{health.errorRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Error Rate</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommendations</h4>
              {health.recommendations.map((rec, index) => (
                <div key={index} className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {rec}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pools">Pool Management</TabsTrigger>
          <TabsTrigger value="metrics">Real-time Metrics</TabsTrigger>
          <TabsTrigger value="scaling">Scaling Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalConnections}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.activeConnections} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pool Count</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.poolCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {pools.filter(p => !p.isShuttingDown).length} healthy
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages/Sec</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.messagesPerSecond.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.connectionsPerSecond.toFixed(1)} conn/sec
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.averageLatency.toFixed(0)}ms</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.errorRate.toFixed(1)}% error rate
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {historicalData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Connection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="totalConnections" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                      name="Total Connections"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activeConnections" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.3}
                      name="Active Connections"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pools" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Connection Pools</h3>
            <Button onClick={createNewPool}>
              <Server className="h-4 w-4 mr-2" />
              Create Pool
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <Card key={pool.poolId}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    {pool.poolId}
                    <Badge variant={pool.isShuttingDown ? "destructive" : "default"}>
                      {pool.isShuttingDown ? "Shutting Down" : "Active"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Utilization</span>
                      <span>{pool.utilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={pool.utilization} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium">{pool.connections}</div>
                      <div className="text-muted-foreground">Connections</div>
                    </div>
                    <div>
                      <div className="font-medium">{pool.healthyConnections}</div>
                      <div className="text-muted-foreground">Healthy</div>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removePool(pool.poolId)}
                    disabled={pool.isShuttingDown}
                    className="w-full"
                  >
                    Remove Pool
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {historicalData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Latency Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="averageLatency" 
                        stroke="#ff7300" 
                        name="Avg Latency (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="errorRate" 
                        stroke="#dc2626" 
                        fill="#dc2626" 
                        fillOpacity={0.3}
                        name="Error Rate (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Messages Per Second</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="messagesPerSecond" 
                        fill="#10b981" 
                        name="Messages/Sec"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pool Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="poolUtilization" 
                        stroke="#8b5cf6" 
                        name="Utilization (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Scaling Configuration
              </CardTitle>
              <CardDescription>
                Configure automatic scaling parameters for connection pools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Auto-scaling Thresholds</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Scale up at:</span>
                      <span className="font-medium">80% utilization</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scale down at:</span>
                      <span className="font-medium">30% utilization</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max pools:</span>
                      <span className="font-medium">10 pools</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min pools:</span>
                      <span className="font-medium">2 pools</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Load Balancing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Strategy:</span>
                      <span className="font-medium">Least Connections</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health checks:</span>
                      <span className="font-medium">Every 30s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection timeout:</span>
                      <span className="font-medium">60s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max per user:</span>
                      <span className="font-medium">10 connections</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Current Scaling Status</h4>
                <p className="text-sm text-muted-foreground">
                  System is operating within normal parameters. Auto-scaling is active and 
                  monitoring connection loads. No manual intervention required.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}