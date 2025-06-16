export interface ExternalSystemConnection {
  id: string;
  systemType: 'procore' | 'buildertrend' | 'sage' | 'quickbooks' | 'planswift' | 'bluebeam' | 'custom';
  name: string;
  config: ConnectionConfig;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  dataMapping: DataMapping;
  credentials: EncryptedCredentials;
}

export interface ConnectionConfig {
  baseUrl?: string;
  version?: string;
  timeout?: number;
  retryAttempts?: number;
  rateLimit?: {
    requests: number;
    window: number; // milliseconds
  };
  webhooks?: {
    enabled: boolean;
    url?: string;
    events: string[];
  };
}

export interface DataMapping {
  projects: FieldMapping[];
  costs: FieldMapping[];
  schedules: FieldMapping[];
  documents: FieldMapping[];
  contacts: FieldMapping[];
  custom: FieldMapping[];
}

export interface FieldMapping {
  externalField: string;
  internalField: string;
  transform?: string; // JavaScript function for data transformation
  validation?: string; // Validation rules
  required: boolean;
  defaultValue?: any;
}

export interface EncryptedCredentials {
  type: 'api_key' | 'oauth' | 'basic_auth';
  data: string; // Encrypted credential data
  expiresAt?: Date;
  refreshToken?: string;
}

export interface SyncOperation {
  id: string;
  connectionId: string;
  operation: 'full_sync' | 'incremental_sync' | 'push_changes' | 'pull_changes';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  recordsTotal: number;
  errors: SyncError[];
  metadata: any;
}

export interface SyncError {
  type: 'authentication' | 'rate_limit' | 'data_validation' | 'network' | 'unknown';
  message: string;
  details?: any;
  retryable: boolean;
}

class IntegrationService {
  private connections: Map<string, ExternalSystemConnection> = new Map();
  private syncOperations: Map<string, SyncOperation> = new Map();

  // Connection Management
  async createConnection(connectionData: Partial<ExternalSystemConnection>): Promise<string> {
    const connectionId = `conn_${Date.now()}`;
    
    // Validate connection data
    if (!connectionData.systemType || !connectionData.name) {
      throw new Error('System type and name are required');
    }

    // Encrypt credentials
    const encryptedCredentials = await this.encryptCredentials(connectionData.credentials!);

    const connection: ExternalSystemConnection = {
      id: connectionId,
      systemType: connectionData.systemType,
      name: connectionData.name,
      config: connectionData.config || this.getDefaultConfig(connectionData.systemType),
      status: 'disconnected',
      syncFrequency: connectionData.syncFrequency || 'daily',
      dataMapping: connectionData.dataMapping || this.getDefaultMapping(connectionData.systemType),
      credentials: encryptedCredentials
    };

    this.connections.set(connectionIdconnection);

    console.log('🔗 CONNECTION CREATED');
    console.log('System:', connection.systemType);
    console.log('Name:', connection.name);
    console.log('ID:', connectionId);

    return connectionId;
  }

  async testConnection(connectionId: string): Promise<{
    success: boolean;
    message: string;
    capabilities?: string[];
  }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    console.log('🧪 TESTING CONNECTION');
    console.log('System:', connection.systemType);
    console.log('URL:', connection.config.baseUrl);

    try {
      // Decrypt credentials for testing
      const credentials = await this.decryptCredentials(connection.credentials);
      
      // Perform connection test based on system type
      const testResult = await this.performConnectionTest(connectioncredentials);
      
      if (testResult.success) {
        // Update connection status
        connection.status = 'connected';
        this.connections.set(connectionIdconnection);
      }

      return testResult;
    } catch (error) {
      console.error('Connection test failed:', error);
      connection.status = 'error';
      this.connections.set(connectionIdconnection);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  // Data Synchronization
  async startSync(connectionId: string, operation: SyncOperation['operation'] = 'full_sync'): Promise<string> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    if (connection.status !== 'connected') {
      throw new Error('Connection is not active');
    }

    const syncId = `sync_${Date.now()}`;
    const syncOperation: SyncOperation = {
      id: syncId,
      connectionId,
      operation,
      status: 'pending',
      startTime: new Date(),
      recordsProcessed: 0,
      recordsTotal: 0,
      errors: [],
      metadata: {}
    };

    this.syncOperations.set(syncIdsyncOperation);

    console.log('🔄 SYNC STARTED');
    console.log('Connection:', connection.name);
    console.log('Operation:', operation);
    console.log('Sync ID:', syncId);

    // Start async sync process
    this.executeSyncOperation(syncId).catch(error => {
      console.error('Sync operation failed:', error);
      this.updateSyncStatus(syncId, 'failed', [
        {
          type: 'unknown',
          message: error.message,
          retryable: true
        }
      ]);
    });

    return syncId;
  }

  async getSyncStatus(syncId: string): Promise<SyncOperation | null> {
    return this.syncOperations.get(syncId) || null;
  }

  async getConnectionStatus(connectionId: string): Promise<ExternalSystemConnection | null> {
    return this.connections.get(connectionId) || null;
  }

  // Data Transformation
  async transformData(
    data: any, 
    mapping: FieldMapping[], 
    direction: 'inbound' | 'outbound'
  ): Promise<any> {
    const transformed: any = {};

    for (const fieldMap of mapping) {
      try {
        const sourceField = direction === 'inbound' ? fieldMap.externalField : fieldMap.internalField;
        const targetField = direction === 'inbound' ? fieldMap.internalField : fieldMap.externalField;
        
        let value = this.getNestedValue(datasourceField);
        
        // Apply transformation if specified
        if (fieldMap.transform && value !== undefined) {
          value = this.applyTransformation(value, fieldMap.transform);
        }
        
        // Apply default value if needed
        if (value === undefined && fieldMap.defaultValue !== undefined) {
          value = fieldMap.defaultValue;
        }
        
        // Validate if required
        if (fieldMap.required && (value === undefined || value === null)) {
          throw new Error(`Required field ${targetField} is missing`);
        }
        
        if (value !== undefined) {
          this.setNestedValue(transformedtargetFieldvalue);
        }
      } catch (error) {
        console.warn(`Field transformation failed for ${fieldMap.externalField}:`, error);
      }
    }

    return transformed;
  }

  // Private helper methods
  private async encryptCredentials(credentials: EncryptedCredentials): Promise<EncryptedCredentials> {
    // In a real implementation, this would use proper encryption
    return {
      ...credentials,
      data: btoa(credentials.data) // Simple base64 encoding for demo
    };
  }

  private async decryptCredentials(credentials: EncryptedCredentials): Promise<any> {
    // In a real implementation, this would decrypt properly
    return {
      type: credentials.type,
      data: atob(credentials.data)
    };
  }

  private getDefaultConfig(systemType: string): ConnectionConfig {
    const configs: Record<string, ConnectionConfig> = {
      procore: {
        baseUrl: 'https://api.procore.com',
        version: 'v1.0',
        timeout: 30000,
        retryAttempts: 3,
        rateLimit: { requests: 100, window: 60000 }
      },
      buildertrend: {
        baseUrl: 'https://api.buildertrend.net',
        version: 'v1.0',
        timeout: 30000,
        retryAttempts: 3,
        rateLimit: { requests: 50, window: 60000 }
      },
      sage: {
        baseUrl: 'https://api.sage.com',
        version: 'v3.1',
        timeout: 45000,
        retryAttempts: 2,
        rateLimit: { requests: 200, window: 60000 }
      },
      quickbooks: {
        baseUrl: 'https://sandbox-quickbooks.api.intuit.com',
        version: 'v3',
        timeout: 30000,
        retryAttempts: 3,
        rateLimit: { requests: 500, window: 60000 }
      }
    };

    return configs[systemType] || {
      timeout: 30000,
      retryAttempts: 3,
      rateLimit: { requests: 100, window: 60000 }
    };
  }

  private getDefaultMapping(systemType: string): DataMapping {
    const mappings: Record<string, DataMapping> = {
      procore: {
        projects: [
          { externalField: 'name', internalField: 'development.name', required: true },
          { externalField: 'number', internalField: 'development.projectNumber', required: false },
          { externalField: 'address', internalField: 'development.address', required: false }
        ],
        costs: [
          { externalField: 'cost_code', internalField: 'boqItem.category', required: true },
          { externalField: 'description', internalField: 'boqItem.description', required: true },
          { externalField: 'budgeted_amount', internalField: 'boqItem.amount', required: true }
        ],
        schedules: [],
        documents: [],
        contacts: [],
        custom: []
      }
    };

    return mappings[systemType] || {
      projects: [],
      costs: [],
      schedules: [],
      documents: [],
      contacts: [],
      custom: []
    };
  }

  private async performConnectionTest(
    connection: ExternalSystemConnection, 
    credentials: any
  ): Promise<{ success: boolean; message: string; capabilities?: string[] }> {
    // Simulate connection test based on system type
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // 85% success rate for demo
    const success = Math.random() > 0.15;

    if (success) {
      const capabilities = this.getSystemCapabilities(connection.systemType);
      return {
        success: true,
        message: 'Connection successful',
        capabilities
      };
    } else {
      const errors = [
        'Invalid API key',
        'Network timeout',
        'Rate limit exceeded',
        'Insufficient permissions',
        'Service unavailable'
      ];
      return {
        success: false,
        message: errors[Math.floor(Math.random() * errors.length)]
      };
    }
  }

  private getSystemCapabilities(systemType: string): string[] {
    const capabilities: Record<string, string[]> = {
      procore: ['projects', 'budgets', 'schedules', 'documents', 'change_orders'],
      buildertrend: ['projects', 'customers', 'estimates', 'schedules', 'photos'],
      sage: ['jobs', 'costs', 'payroll', 'equipment', 'vendors'],
      quickbooks: ['items', 'customers', 'estimates', 'invoices', 'time_activities']
    };

    return capabilities[systemType] || [];
  }

  private async executeSyncOperation(syncId: string): Promise<void> {
    const syncOp = this.syncOperations.get(syncId);
    if (!syncOp) return;

    const connection = this.connections.get(syncOp.connectionId);
    if (!connection) return;

    try {
      // Update status to running
      this.updateSyncStatus(syncId, 'running');

      // Simulate sync process
      const totalRecords = Math.floor(Math.random() * 2000) + 500;
      syncOp.recordsTotal = totalRecords;

      for (let i = 0; i <totalRecords; i += 50) {
        // Simulate processing in batches
        await new Promise(resolve => setTimeout(resolve200));
        
        syncOp.recordsProcessed = Math.min(i + 50totalRecords);
        this.syncOperations.set(syncIdsyncOp);
        
        // Simulate occasional errors (5% chance)
        if (Math.random() <0.05) {
          syncOp.errors.push({
            type: 'data_validation',
            message: `Validation error in record ${i}`,
            retryable: true
          });
        }
      }

      // Complete sync
      syncOp.status = 'completed';
      syncOp.endTime = new Date();
      connection.lastSync = new Date();
      connection.status = 'connected';

      this.syncOperations.set(syncIdsyncOp);
      this.connections.set(connection.idconnection);

      console.log('✅ SYNC COMPLETED');
      console.log('Records processed:', syncOp.recordsProcessed);
      console.log('Errors:', syncOp.errors.length);

    } catch (error) {
      this.updateSyncStatus(syncId, 'failed', [
        {
          type: 'unknown',
          message: error instanceof Error ? error.message : 'Unknown error',
          retryable: true
        }
      ]);
    }
  }

  private updateSyncStatus(
    syncId: string, 
    status: SyncOperation['status'], 
    errors?: SyncError[]
  ): void {
    const syncOp = this.syncOperations.get(syncId);
    if (syncOp) {
      syncOp.status = status;
      if (errors) {
        syncOp.errors.push(...errors);
      }
      if (status === 'completed' || status === 'failed') {
        syncOp.endTime = new Date();
      }
      this.syncOperations.set(syncIdsyncOp);
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((currentkey) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((currentkey) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private applyTransformation(value: any, transformFunction: string): any {
    try {
      // Simple transformation functions for demo
      switch (transformFunction) {
        case 'toUpperCase':
          return typeof value === 'string' ? value.toUpperCase() : value;
        case 'toLowerCase':
          return typeof value === 'string' ? value.toLowerCase() : value;
        case 'parseFloat':
          return parseFloat(value);
        case 'parseInt':
          return parseInt(value);
        case 'toString':
          return String(value);
        default:
          return value;
      }
    } catch (error) {
      console.warn('Transformation failed:', error);
      return value;
    }
  }
}

export const integrationService = new IntegrationService();