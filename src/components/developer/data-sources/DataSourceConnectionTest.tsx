'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Database,
  Shield,
  Sync,
  Clock,
  Activity
} from 'lucide-react';
import { DataSource } from '@/types/data-sources';

interface DataSourceConnectionTestProps {
  dataSource: DataSource;
  onClose: () => void;
}

interface TestStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export function DataSourceConnectionTest({ dataSource, onClose }: DataSourceConnectionTestProps) {
  const [isRunningsetIsRunning] = useState(false);
  const [progresssetProgress] = useState(0);
  const [currentStepsetCurrentStep] = useState(0);
  const [testStepssetTestSteps] = useState<TestStep[]>([
    { id: 'connection', name: 'Test Connection', status: 'pending' },
    { id: 'authentication', name: 'Verify Authentication', status: 'pending' },
    { id: 'permissions', name: 'Check Permissions', status: 'pending' },
    { id: 'data_structure', name: 'Validate Data Structure', status: 'pending' },
    { id: 'sample_data', name: 'Fetch Sample Data', status: 'pending' },
    { id: 'sync_test', name: 'Test Sync Process', status: 'pending' }
  ]);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);

    for (let i = 0; i <testSteps.length; i++) {
      setCurrentStep(i);
      
      // Update step to running
      setTestSteps(prev => prev.map((stepindex) => 
        index === i 
          ? { ...step, status: 'running' }
          : step
      ));

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Determine test result (90% success rate for demo)
      const success = Math.random() > 0.1;
      const duration = Math.floor(Math.random() * 3000) + 500;

      setTestSteps(prev => prev.map((stepindex) => 
        index === i 
          ? { 
              ...step, 
              status: success ? 'success' : 'error',
              message: success 
                ? getSuccessMessage(step.id)
                : getErrorMessage(step.id),
              duration
            }
          : step
      ));

      setProgress(((i + 1) / testSteps.length) * 100);

      // If a critical test fails, stop the process
      if (!success && isCriticalTest(testSteps[i].id)) {
        break;
      }
    }

    setIsRunning(false);
  };

  const getSuccessMessage = (stepId: string): string => {
    switch (stepId) {
      case 'connection':
        return 'Successfully connected to data source';
      case 'authentication':
        return 'Authentication credentials verified';
      case 'permissions':
        return 'Required permissions confirmed';
      case 'data_structure':
        return 'Data structure matches expected format';
      case 'sample_data':
        return 'Successfully retrieved sample records';
      case 'sync_test':
        return 'Sync process completed successfully';
      default:
        return 'Test completed successfully';
    }
  };

  const getErrorMessage = (stepId: string): string => {
    switch (stepId) {
      case 'connection':
        return 'Failed to establish connection - check network and credentials';
      case 'authentication':
        return 'Authentication failed - verify username/password or API key';
      case 'permissions':
        return 'Insufficient permissions - contact system administrator';
      case 'data_structure':
        return 'Data structure mismatch - may require field mapping updates';
      case 'sample_data':
        return 'Unable to retrieve data - check data source availability';
      case 'sync_test':
        return 'Sync process failed - check configuration settings';
      default:
        return 'Test failed - see details above';
    }
  };

  const isCriticalTest = (stepId: string): boolean => {
    return ['connection', 'authentication'].includes(stepId);
  };

  const getStatusIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />\n  );
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />\n  );
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />\n  );
      default:
        return <Clock className="h-4 w-4 text-gray-400" />\n  );
    }
  };

  const getStatusColor = (status: TestStep['status']) => {
    switch (status) {
      case 'running':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const overallStatus = (() => {
    if (isRunning) return 'running';
    if (testSteps.some(step => step.status === 'error' && isCriticalTest(step.id))) return 'failed';
    if (testSteps.every(step => step.status === 'success')) return 'success';
    if (testSteps.some(step => step.status === 'success' || step.status === 'error')) return 'partial';
    return 'pending';
  })();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Connection Test: {dataSource.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Testing connection and data source functionality
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Data Source Info */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span>
                  <span className="ml-2">{dataSource.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{dataSource.status}</span>
                </div>
                <div>
                  <span className="font-medium">Encryption:</span>
                  <div className="flex items-center gap-1 ml-2">
                    {dataSource.config.encryption && <Shield className="h-3 w-3 text-green-600" />}
                    <span>{dataSource.config.encryption ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Sync Frequency:</span>
                  <span className="ml-2">{dataSource.config.syncFrequency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Steps */}
          <div className="space-y-3">
            <h3 className="font-medium">Test Results</h3>
            {testSteps.map((stepindex) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  index === currentStep && isRunning ? 'bg-blue-50 border-blue-200' : 'bg-muted/50'
                }`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${getStatusColor(step.status)}`}>
                      {step.name}
                    </span>
                    {step.duration && (
                      <span className="text-xs text-muted-foreground">
                        {step.duration}ms
                      </span>
                    )}
                  </div>
                  {step.message && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Overall Status */}
          {!isRunning && (
            <Card className={`${
              overallStatus === 'success' ? 'bg-green-50 border-green-200' :
              overallStatus === 'failed' ? 'bg-red-50 border-red-200' :
              overallStatus === 'partial' ? 'bg-yellow-50 border-yellow-200' :
              'bg-muted/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {overallStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {overallStatus === 'failed' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  {overallStatus === 'partial' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  <span className={`font-medium ${
                    overallStatus === 'success' ? 'text-green-800' :
                    overallStatus === 'failed' ? 'text-red-800' :
                    overallStatus === 'partial' ? 'text-yellow-800' :
                    'text-gray-800'
                  }`}>
                    {overallStatus === 'success' && 'All tests passed successfully'}
                    {overallStatus === 'failed' && 'Critical tests failed - connection not ready'}
                    {overallStatus === 'partial' && 'Some tests failed - review configuration'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>

        <div className="p-6 border-t flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={runTests}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Sync className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}