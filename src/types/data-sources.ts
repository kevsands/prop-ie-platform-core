export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  config: DataSourceConfig;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type DataSourceType = 
  | 'project_management'  // Procore, Buildertrend, etc.
  | 'financial_system'    // Sage, QuickBooks, etc.
  | 'boq_software'        // CostX, Bluebeam, etc.
  | 'supplier_api'        // Material supplier APIs
  | 'database'            // Direct database connections
  | 'excel_file'          // Excel file uploads
  | 'api_endpoint'        // Custom API endpoints
  | 'erp_system';         // Enterprise resource planning

export type DataSourceStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'requires_auth'
  | 'syncing';

export interface DataSourceConfig {
  // Connection details
  connectionString?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  baseUrl?: string;
  
  // File-based sources
  filePath?: string;
  sheetNames?: string[];
  
  // Mapping configuration
  fieldMappings: FieldMapping[];
  
  // Sync settings
  syncFrequency: SyncFrequency;
  autoSync: boolean;
  
  // Security
  encryption: boolean;
  accessToken?: string;
  refreshToken?: string;
  
  // Validation
  requiresApproval: boolean;
  validationRules: ValidationRule[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string; // JavaScript function for data transformation
  required: boolean;
  validation?: string; // Validation regex or function
}

export type SyncFrequency = 
  | 'manual'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'realtime';

export interface ValidationRule {
  field: string;
  rule: 'required' | 'numeric' | 'currency' | 'date' | 'email' | 'custom';
  value?: string | number;
  message: string;
}

export interface DataSourceTemplate {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  icon: string;
  defaultConfig: Partial<DataSourceConfig>\n  );
  requiredFields: string[];
  documentation?: string;
}

// Project-specific data source integrations
export interface ProjectDataSource {
  projectId: string;
  dataSourceId: string;
  mapping: ProjectDataMapping;
  status: DataSourceStatus;
  lastSync?: Date;
  syncLog: SyncLogEntry[];
}

export interface ProjectDataMapping {
  boqData?: {
    itemsTable: string;
    variationsTable: string;
    approvalsTable: string;
  };
  financialData?: {
    costsTable: string;
    revenueTable: string;
    cashFlowTable: string;
  };
  projectData?: {
    detailsTable: string;
    milestonesTable: string;
    teamTable: string;
  };
}

export interface SyncLogEntry {
  timestamp: Date;
  type: 'success' | 'error' | 'warning';
  message: string;
  recordsAffected?: number;
  details?: any;
}

// Common data source templates
export const DATA_SOURCE_TEMPLATES: DataSourceTemplate[] = [
  {
    id: 'procore',
    name: 'Procore',
    type: 'project_management',
    description: 'Connect to Procore project management system',
    icon: 'building',
    defaultConfig: {
      syncFrequency: 'daily',
      requiresApproval: true,
      encryption: true,
      fieldMappings: [
        { sourceField: 'project_name', targetField: 'name', required: true },
        { sourceField: 'budget_total', targetField: 'budget', required: true },
        { sourceField: 'cost_codes', targetField: 'boqItems', required: true }
      ]
    },
    requiredFields: ['baseUrl', 'apiKey'],
    documentation: 'https://developers.procore.com/'
  },
  {
    id: 'sage',
    name: 'Sage Construction',
    type: 'financial_system',
    description: 'Connect to Sage construction accounting',
    icon: 'dollar-sign',
    defaultConfig: {
      syncFrequency: 'daily',
      requiresApproval: true,
      encryption: true
    },
    requiredFields: ['connectionString', 'username', 'password']
  },
  {
    id: 'costx',
    name: 'CostX',
    type: 'boq_software',
    description: 'Import BOQ data from CostX takeoff software',
    icon: 'calculator',
    defaultConfig: {
      syncFrequency: 'manual',
      requiresApproval: true
    },
    requiredFields: ['filePath']
  },
  {
    id: 'excel_upload',
    name: 'Excel File Upload',
    type: 'excel_file',
    description: 'Upload Excel files with project data',
    icon: 'file-spreadsheet',
    defaultConfig: {
      syncFrequency: 'manual',
      requiresApproval: true,
      validationRules: [
        { field: 'rate', rule: 'numeric', message: 'Rate must be a number' },
        { field: 'quantity', rule: 'numeric', message: 'Quantity must be a number' }
      ]
    },
    requiredFields: ['filePath', 'sheetNames']
  },
  {
    id: 'custom_api',
    name: 'Custom API',
    type: 'api_endpoint',
    description: 'Connect to custom API endpoint',
    icon: 'link',
    defaultConfig: {
      syncFrequency: 'hourly',
      requiresApproval: true,
      encryption: true
    },
    requiredFields: ['baseUrl', 'apiKey']
  }
];