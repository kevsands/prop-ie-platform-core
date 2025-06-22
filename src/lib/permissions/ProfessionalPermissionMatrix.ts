/**
 * Professional Permission Matrix
 * 
 * Week 3 Implementation: Enhanced Role-Based Access Control
 * Comprehensive permission system for 49 professional roles
 */

export enum Permission {
  // User Management
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  
  // Professional Role Management
  VIEW_PROFESSIONAL_PROFILES = 'view_professional_profiles',
  EDIT_PROFESSIONAL_PROFILES = 'edit_professional_profiles',
  ASSIGN_PROFESSIONAL_ROLES = 'assign_professional_roles',
  VERIFY_CERTIFICATIONS = 'verify_certifications',
  MANAGE_ASSOCIATIONS = 'manage_associations',
  
  // Development Management
  VIEW_DEVELOPMENTS = 'view_developments',
  CREATE_DEVELOPMENTS = 'create_developments',
  EDIT_DEVELOPMENTS = 'edit_developments',
  DELETE_DEVELOPMENTS = 'delete_developments',
  MANAGE_DEVELOPMENT_TIMELINE = 'manage_development_timeline',
  APPROVE_DEVELOPMENT_PHASES = 'approve_development_phases',
  
  // Transaction Management
  VIEW_TRANSACTIONS = 'view_transactions',
  CREATE_TRANSACTIONS = 'create_transactions',
  EDIT_TRANSACTIONS = 'edit_transactions',
  APPROVE_TRANSACTIONS = 'approve_transactions',
  CANCEL_TRANSACTIONS = 'cancel_transactions',
  
  // Task Management
  VIEW_TASKS = 'view_tasks',
  CREATE_TASKS = 'create_tasks',
  ASSIGN_TASKS = 'assign_tasks',
  COMPLETE_TASKS = 'complete_tasks',
  APPROVE_TASKS = 'approve_tasks',
  VIEW_ALL_TASKS = 'view_all_tasks',
  ORCHESTRATE_WORKFLOWS = 'orchestrate_workflows',
  
  // Document Management
  VIEW_DOCUMENTS = 'view_documents',
  UPLOAD_DOCUMENTS = 'upload_documents',
  EDIT_DOCUMENTS = 'edit_documents',
  DELETE_DOCUMENTS = 'delete_documents',
  APPROVE_DOCUMENTS = 'approve_documents',
  CERTIFY_DOCUMENTS = 'certify_documents',
  
  // Financial Management
  VIEW_FINANCIAL_DATA = 'view_financial_data',
  EDIT_FINANCIAL_DATA = 'edit_financial_data',
  APPROVE_PAYMENTS = 'approve_payments',
  MANAGE_INVOICES = 'manage_invoices',
  VIEW_HTB_DATA = 'view_htb_data',
  PROCESS_HTB_CLAIMS = 'process_htb_claims',
  
  // Legal Operations
  ACCESS_LEGAL_DOCUMENTS = 'access_legal_documents',
  DRAFT_CONTRACTS = 'draft_contracts',
  REVIEW_CONTRACTS = 'review_contracts',
  EXECUTE_CONTRACTS = 'execute_contracts',
  MANAGE_TITLE_DEEDS = 'manage_title_deeds',
  CONDUCT_SEARCHES = 'conduct_searches',
  
  // Property Management
  VIEW_PROPERTIES = 'view_properties',
  LIST_PROPERTIES = 'list_properties',
  EDIT_PROPERTY_DETAILS = 'edit_property_details',
  MANAGE_VIEWINGS = 'manage_viewings',
  SCHEDULE_INSPECTIONS = 'schedule_inspections',
  CONDUCT_VALUATIONS = 'conduct_valuations',
  
  // Compliance & Certification
  CONDUCT_BER_ASSESSMENTS = 'conduct_ber_assessments',
  ISSUE_CERTIFICATIONS = 'issue_certifications',
  APPROVE_BUILDING_CONTROL = 'approve_building_control',
  CONDUCT_FIRE_SAFETY_ASSESSMENTS = 'conduct_fire_safety_assessments',
  MANAGE_REGULATORY_COMPLIANCE = 'manage_regulatory_compliance',
  
  // Sales & Marketing
  MANAGE_SALES_PIPELINE = 'manage_sales_pipeline',
  CREATE_MARKETING_MATERIALS = 'create_marketing_materials',
  MANAGE_RESERVATIONS = 'manage_reservations',
  PROCESS_SALES = 'process_sales',
  MANAGE_CUSTOMER_RELATIONSHIPS = 'manage_customer_relationships',
  
  // Engineering & Technical
  CREATE_TECHNICAL_DRAWINGS = 'create_technical_drawings',
  APPROVE_STRUCTURAL_DESIGNS = 'approve_structural_designs',
  CONDUCT_SITE_INSPECTIONS = 'conduct_site_inspections',
  CERTIFY_CONSTRUCTION = 'certify_construction',
  MANAGE_TECHNICAL_SPECIFICATIONS = 'manage_technical_specifications',
  
  // Administrative
  VIEW_SYSTEM_LOGS = 'view_system_logs',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
  GENERATE_REPORTS = 'generate_reports',
  EXPORT_DATA = 'export_data',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  
  // Communication
  SEND_NOTIFICATIONS = 'send_notifications',
  MANAGE_COMMUNICATIONS = 'manage_communications',
  ACCESS_PROFESSIONAL_DIRECTORY = 'access_professional_directory',
  COORDINATE_TEAMS = 'coordinate_teams'
}

export enum UserRole {
  // Core Roles
  DEVELOPER = 'DEVELOPER',
  BUYER = 'BUYER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
  
  // Legal Professionals
  BUYER_SOLICITOR = 'BUYER_SOLICITOR',
  DEVELOPER_SOLICITOR = 'DEVELOPER_SOLICITOR',
  SOLICITOR = 'SOLICITOR',
  LEGAL = 'LEGAL',
  
  // Financial Professionals
  BUYER_MORTGAGE_BROKER = 'BUYER_MORTGAGE_BROKER',
  BUYER_FINANCIAL_ADVISOR = 'BUYER_FINANCIAL_ADVISOR',
  BUYER_INSURANCE_BROKER = 'BUYER_INSURANCE_BROKER',
  MORTGAGE_LENDER = 'MORTGAGE_LENDER',
  MORTGAGE_UNDERWRITER = 'MORTGAGE_UNDERWRITER',
  
  // Property Professionals
  ESTATE_AGENT = 'ESTATE_AGENT',
  DEVELOPMENT_SALES_AGENT = 'DEVELOPMENT_SALES_AGENT',
  PROPERTY_VALUER = 'PROPERTY_VALUER',
  BUYER_SURVEYOR = 'BUYER_SURVEYOR',
  BUILDING_SURVEYOR = 'BUILDING_SURVEYOR',
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  
  // Design Professionals
  LEAD_ARCHITECT = 'LEAD_ARCHITECT',
  DESIGN_ARCHITECT = 'DESIGN_ARCHITECT',
  TECHNICAL_ARCHITECT = 'TECHNICAL_ARCHITECT',
  LANDSCAPE_ARCHITECT = 'LANDSCAPE_ARCHITECT',
  
  // Engineering Professionals
  STRUCTURAL_ENGINEER = 'STRUCTURAL_ENGINEER',
  CIVIL_ENGINEER = 'CIVIL_ENGINEER',
  MEP_ENGINEER = 'MEP_ENGINEER',
  ENVIRONMENTAL_ENGINEER = 'ENVIRONMENTAL_ENGINEER',
  ENGINEER = 'ENGINEER',
  
  // Construction Professionals
  MAIN_CONTRACTOR = 'MAIN_CONTRACTOR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPMENT_PROJECT_MANAGER = 'DEVELOPMENT_PROJECT_MANAGER',
  PROJECT_MANAGER_CONSTRUCTION = 'PROJECT_MANAGER_CONSTRUCTION',
  SITE_FOREMAN = 'SITE_FOREMAN',
  CONTRACTOR = 'CONTRACTOR',
  
  // Compliance & Certification
  BER_ASSESSOR = 'BER_ASSESSOR',
  NZEB_CONSULTANT = 'NZEB_CONSULTANT',
  SUSTAINABILITY_CONSULTANT = 'SUSTAINABILITY_CONSULTANT',
  BCAR_CERTIFIER = 'BCAR_CERTIFIER',
  FIRE_SAFETY_CONSULTANT = 'FIRE_SAFETY_CONSULTANT',
  ACCESSIBILITY_CONSULTANT = 'ACCESSIBILITY_CONSULTANT',
  
  // Quality & Assurance
  QUALITY_ASSURANCE_INSPECTOR = 'QUALITY_ASSURANCE_INSPECTOR',
  STRUCTURAL_WARRANTY_INSPECTOR = 'STRUCTURAL_WARRANTY_INSPECTOR',
  HOMEBOND_ADMINISTRATOR = 'HOMEBOND_ADMINISTRATOR',
  HEALTH_SAFETY_OFFICER = 'HEALTH_SAFETY_OFFICER',
  
  // Regulatory & Government
  LOCAL_AUTHORITY_OFFICER = 'LOCAL_AUTHORITY_OFFICER',
  BUILDING_CONTROL_OFFICER = 'BUILDING_CONTROL_OFFICER',
  LAND_REGISTRY_OFFICER = 'LAND_REGISTRY_OFFICER',
  REVENUE_OFFICER = 'REVENUE_OFFICER',
  
  // Specialized Services
  QUANTITY_SURVEYOR = 'QUANTITY_SURVEYOR',
  PLANNING_CONSULTANT = 'PLANNING_CONSULTANT',
  TAX_ADVISOR = 'TAX_ADVISOR',
  CONVEYANCING_SPECIALIST = 'CONVEYANCING_SPECIALIST',
  INSURANCE_UNDERWRITER = 'INSURANCE_UNDERWRITER',
  
  // Management & Admin
  DEVELOPMENT_MARKETING_MANAGER = 'DEVELOPMENT_MARKETING_MANAGER',
  DEVELOPMENT_FINANCIAL_CONTROLLER = 'DEVELOPMENT_FINANCIAL_CONTROLLER',
  ESTATE_AGENT_MANAGER = 'ESTATE_AGENT_MANAGER',
  AGENT = 'AGENT'
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  inheritFrom?: UserRole[];
  restrictions?: {
    canOnlyViewOwnData?: boolean;
    canOnlyEditOwnData?: boolean;
    requiresApproval?: Permission[];
    geographical?: string[];
    projectTypes?: string[];
  };
}

export const PROFESSIONAL_PERMISSION_MATRIX: RolePermissions[] = [
  // Administrative Roles
  {
    role: UserRole.ADMIN,
    permissions: Object.values(Permission), // Admin has all permissions
    restrictions: {}
  },
  
  // Developer Roles
  {
    role: UserRole.DEVELOPER,
    permissions: [
      Permission.VIEW_DEVELOPMENTS,
      Permission.CREATE_DEVELOPMENTS,
      Permission.EDIT_DEVELOPMENTS,
      Permission.MANAGE_DEVELOPMENT_TIMELINE,
      Permission.VIEW_TRANSACTIONS,
      Permission.CREATE_TRANSACTIONS,
      Permission.VIEW_TASKS,
      Permission.CREATE_TASKS,
      Permission.ASSIGN_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.VIEW_FINANCIAL_DATA,
      Permission.EDIT_FINANCIAL_DATA,
      Permission.VIEW_PROPERTIES,
      Permission.EDIT_PROPERTY_DETAILS,
      Permission.MANAGE_SALES_PIPELINE,
      Permission.MANAGE_RESERVATIONS,
      Permission.GENERATE_REPORTS,
      Permission.COORDINATE_TEAMS,
      Permission.MANAGE_COMMUNICATIONS,
      Permission.ACCESS_PROFESSIONAL_DIRECTORY
    ],
    restrictions: {
      canOnlyViewOwnData: true,
      canOnlyEditOwnData: true
    }
  },
  
  // Buyer Roles
  {
    role: UserRole.BUYER,
    permissions: [
      Permission.VIEW_DEVELOPMENTS,
      Permission.VIEW_PROPERTIES,
      Permission.VIEW_TRANSACTIONS,
      Permission.VIEW_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.MANAGE_VIEWINGS,
      Permission.VIEW_HTB_DATA,
      Permission.MANAGE_RESERVATIONS
    ],
    restrictions: {
      canOnlyViewOwnData: true,
      canOnlyEditOwnData: true
    }
  },
  
  // Legal Professionals
  {
    role: UserRole.BUYER_SOLICITOR,
    permissions: [
      Permission.VIEW_TRANSACTIONS,
      Permission.EDIT_TRANSACTIONS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.ACCESS_LEGAL_DOCUMENTS,
      Permission.DRAFT_CONTRACTS,
      Permission.REVIEW_CONTRACTS,
      Permission.EXECUTE_CONTRACTS,
      Permission.MANAGE_TITLE_DEEDS,
      Permission.CONDUCT_SEARCHES,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.VIEW_HTB_DATA,
      Permission.PROCESS_HTB_CLAIMS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      requiresApproval: [Permission.EXECUTE_CONTRACTS, Permission.CERTIFY_DOCUMENTS],
      canOnlyViewOwnData: false
    }
  },
  
  {
    role: UserRole.DEVELOPER_SOLICITOR,
    permissions: [
      Permission.VIEW_DEVELOPMENTS,
      Permission.VIEW_TRANSACTIONS,
      Permission.EDIT_TRANSACTIONS,
      Permission.ACCESS_LEGAL_DOCUMENTS,
      Permission.DRAFT_CONTRACTS,
      Permission.REVIEW_CONTRACTS,
      Permission.EXECUTE_CONTRACTS,
      Permission.MANAGE_TITLE_DEEDS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      requiresApproval: [Permission.EXECUTE_CONTRACTS],
      canOnlyViewOwnData: false
    }
  },
  
  // Financial Professionals
  {
    role: UserRole.BUYER_MORTGAGE_BROKER,
    permissions: [
      Permission.VIEW_FINANCIAL_DATA,
      Permission.EDIT_FINANCIAL_DATA,
      Permission.VIEW_HTB_DATA,
      Permission.PROCESS_HTB_CLAIMS,
      Permission.VIEW_TRANSACTIONS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.MANAGE_CUSTOMER_RELATIONSHIPS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      canOnlyViewOwnData: false,
      requiresApproval: [Permission.PROCESS_HTB_CLAIMS]
    }
  },
  
  // Property Professionals
  {
    role: UserRole.ESTATE_AGENT,
    permissions: [
      Permission.VIEW_PROPERTIES,
      Permission.LIST_PROPERTIES,
      Permission.EDIT_PROPERTY_DETAILS,
      Permission.MANAGE_VIEWINGS,
      Permission.MANAGE_SALES_PIPELINE,
      Permission.CREATE_MARKETING_MATERIALS,
      Permission.MANAGE_RESERVATIONS,
      Permission.PROCESS_SALES,
      Permission.MANAGE_CUSTOMER_RELATIONSHIPS,
      Permission.VIEW_TRANSACTIONS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS,
      Permission.ACCESS_PROFESSIONAL_DIRECTORY
    ],
    restrictions: {
      canOnlyViewOwnData: false
    }
  },
  
  {
    role: UserRole.BUYER_SURVEYOR,
    permissions: [
      Permission.VIEW_PROPERTIES,
      Permission.CONDUCT_VALUATIONS,
      Permission.SCHEDULE_INSPECTIONS,
      Permission.CONDUCT_SITE_INSPECTIONS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      requiresApproval: [Permission.CERTIFY_DOCUMENTS],
      canOnlyViewOwnData: false
    }
  },
  
  // Design Professionals
  {
    role: UserRole.LEAD_ARCHITECT,
    permissions: [
      Permission.VIEW_DEVELOPMENTS,
      Permission.EDIT_DEVELOPMENTS,
      Permission.CREATE_TECHNICAL_DRAWINGS,
      Permission.APPROVE_STRUCTURAL_DESIGNS,
      Permission.MANAGE_TECHNICAL_SPECIFICATIONS,
      Permission.VIEW_TASKS,
      Permission.CREATE_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.EDIT_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.COORDINATE_TEAMS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS,
      Permission.ACCESS_PROFESSIONAL_DIRECTORY
    ],
    restrictions: {
      requiresApproval: [Permission.APPROVE_STRUCTURAL_DESIGNS, Permission.CERTIFY_DOCUMENTS],
      canOnlyViewOwnData: false
    }
  },
  
  // Engineering Professionals
  {
    role: UserRole.STRUCTURAL_ENGINEER,
    permissions: [
      Permission.VIEW_DEVELOPMENTS,
      Permission.CREATE_TECHNICAL_DRAWINGS,
      Permission.APPROVE_STRUCTURAL_DESIGNS,
      Permission.CONDUCT_SITE_INSPECTIONS,
      Permission.CERTIFY_CONSTRUCTION,
      Permission.MANAGE_TECHNICAL_SPECIFICATIONS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      requiresApproval: [Permission.APPROVE_STRUCTURAL_DESIGNS, Permission.CERTIFY_CONSTRUCTION],
      canOnlyViewOwnData: false
    }
  },
  
  // Compliance & Certification Professionals
  {
    role: UserRole.BER_ASSESSOR,
    permissions: [
      Permission.CONDUCT_BER_ASSESSMENTS,
      Permission.ISSUE_CERTIFICATIONS,
      Permission.VIEW_PROPERTIES,
      Permission.CONDUCT_SITE_INSPECTIONS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.MANAGE_REGULATORY_COMPLIANCE,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      requiresApproval: [Permission.ISSUE_CERTIFICATIONS, Permission.CERTIFY_DOCUMENTS],
      canOnlyViewOwnData: false
    }
  },
  
  {
    role: UserRole.BCAR_CERTIFIER,
    permissions: [
      Permission.APPROVE_BUILDING_CONTROL,
      Permission.ISSUE_CERTIFICATIONS,
      Permission.CONDUCT_SITE_INSPECTIONS,
      Permission.CERTIFY_CONSTRUCTION,
      Permission.MANAGE_REGULATORY_COMPLIANCE,
      Permission.VIEW_DEVELOPMENTS,
      Permission.VIEW_TASKS,
      Permission.COMPLETE_TASKS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CERTIFY_DOCUMENTS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS
    ],
    restrictions: {
      requiresApproval: [Permission.APPROVE_BUILDING_CONTROL, Permission.CERTIFY_CONSTRUCTION],
      canOnlyViewOwnData: false
    }
  },
  
  // Construction Professionals
  {
    role: UserRole.PROJECT_MANAGER,
    permissions: [
      Permission.VIEW_DEVELOPMENTS,
      Permission.MANAGE_DEVELOPMENT_TIMELINE,
      Permission.VIEW_TASKS,
      Permission.CREATE_TASKS,
      Permission.ASSIGN_TASKS,
      Permission.ORCHESTRATE_WORKFLOWS,
      Permission.COORDINATE_TEAMS,
      Permission.VIEW_DOCUMENTS,
      Permission.UPLOAD_DOCUMENTS,
      Permission.CONDUCT_SITE_INSPECTIONS,
      Permission.GENERATE_REPORTS,
      Permission.MANAGE_COMMUNICATIONS,
      Permission.ACCESS_PROFESSIONAL_DIRECTORY,
      Permission.SEND_NOTIFICATIONS
    ],
    restrictions: {
      canOnlyViewOwnData: false
    }
  }
];

export class ProfessionalPermissionService {
  /**
   * Check if a user with given roles has a specific permission
   */
  static hasPermission(userRoles: UserRole[], permission: Permission): boolean {
    return userRoles.some(role => {
      const rolePermissions = PROFESSIONAL_PERMISSION_MATRIX.find(rp => rp.role === role);
      return rolePermissions?.permissions.includes(permission) || false;
    });
  }
  
  /**
   * Get all permissions for a user with given roles
   */
  static getUserPermissions(userRoles: UserRole[]): Permission[] {
    const permissions = new Set<Permission>();
    
    userRoles.forEach(role => {
      const rolePermissions = PROFESSIONAL_PERMISSION_MATRIX.find(rp => rp.role === role);
      if (rolePermissions) {
        rolePermissions.permissions.forEach(permission => permissions.add(permission));
        
        // Handle inheritance
        if (rolePermissions.inheritFrom) {
          const inheritedPermissions = this.getUserPermissions(rolePermissions.inheritFrom);
          inheritedPermissions.forEach(permission => permissions.add(permission));
        }
      }
    });
    
    return Array.from(permissions);
  }
  
  /**
   * Check if a permission requires approval for given roles
   */
  static requiresApproval(userRoles: UserRole[], permission: Permission): boolean {
    return userRoles.some(role => {
      const rolePermissions = PROFESSIONAL_PERMISSION_MATRIX.find(rp => rp.role === role);
      return rolePermissions?.restrictions?.requiresApproval?.includes(permission) || false;
    });
  }
  
  /**
   * Check if user can only view/edit their own data
   */
  static canOnlyViewOwnData(userRoles: UserRole[]): boolean {
    return userRoles.every(role => {
      const rolePermissions = PROFESSIONAL_PERMISSION_MATRIX.find(rp => rp.role === role);
      return rolePermissions?.restrictions?.canOnlyViewOwnData !== false;
    });
  }
  
  /**
   * Get role permissions with restrictions
   */
  static getRolePermissions(role: UserRole): RolePermissions | undefined {
    return PROFESSIONAL_PERMISSION_MATRIX.find(rp => rp.role === role);
  }
  
  /**
   * Check if user has required role for a specific permission
   */
  static hasRequiredRole(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }
  
  /**
   * Get all roles that have a specific permission
   */
  static getRolesWithPermission(permission: Permission): UserRole[] {
    return PROFESSIONAL_PERMISSION_MATRIX
      .filter(rp => rp.permissions.includes(permission))
      .map(rp => rp.role);
  }
  
  /**
   * Get permission summary for a role
   */
  static getPermissionSummary(role: UserRole): {
    role: UserRole;
    totalPermissions: number;
    canViewOwnData: boolean;
    canEditOwnData: boolean;
    requiresApproval: Permission[];
    restrictions: any;
  } {
    const rolePermissions = this.getRolePermissions(role);
    
    if (!rolePermissions) {
      throw new Error(`Role ${role} not found in permission matrix`);
    }
    
    return {
      role,
      totalPermissions: rolePermissions.permissions.length,
      canViewOwnData: rolePermissions.restrictions?.canOnlyViewOwnData !== false,
      canEditOwnData: rolePermissions.restrictions?.canOnlyEditOwnData !== false,
      requiresApproval: rolePermissions.restrictions?.requiresApproval || [],
      restrictions: rolePermissions.restrictions || {}
    };
  }
}

export default ProfessionalPermissionService;