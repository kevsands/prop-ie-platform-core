#!/usr/bin/env node

/**
 * Real Irish Property Transaction Tasks
 * 
 * Comprehensive task system based on actual Irish property law and practice
 * Implements real-world property transaction requirements for Ireland
 */

const REAL_IRISH_TASKS = {
  // BUYER TASKS (Authentic Irish First-Time Buyer Journey)
  BUYER: [
    {
      task_code: 'BUY-001',
      title: 'Register with Revenue for HTB (Help to Buy)',
      description: 'Register with Revenue.ie to claim Help to Buy scheme worth up to €30,000',
      category: 'FINANCIAL_PLANNING',
      task_type: 'REGISTRATION',
      estimated_duration_hours: 2.0,
      complexity: 'MODERATE',
      automation_level: 'semi_automated',
      dependencies: [],
      compliance_requirements: ['REVENUE_COMMISSIONERS', 'HTB_SCHEME_RULES'],
      ui_requirements: {
        element: 'Revenue.ie integration form',
        validation: 'HTB eligibility check',
        automation: 'Revenue MyAccount API integration'
      },
      stakeholder_notifications: ['REVENUE_COMMISSIONERS', 'MORTGAGE_BROKER']
    },
    {
      task_code: 'BUY-002',
      title: 'Mortgage Approval in Principle (AIP)',
      description: 'Obtain mortgage approval in principle from Irish bank or lender',
      category: 'FINANCIAL_PLANNING',
      task_type: 'FINANCIAL_APPLICATION',
      estimated_duration_hours: 4.0,
      complexity: 'COMPLEX',
      automation_level: 'semi_automated',
      dependencies: ['BUY-001'],
      compliance_requirements: ['CENTRAL_BANK_RULES', 'MORTGAGE_CREDIT_DIRECTIVE'],
      ui_requirements: {
        element: 'Bank API integration',
        validation: 'Affordability assessment',
        automation: 'Credit score check'
      },
      stakeholder_notifications: ['BANK_LENDING_OFFICER', 'MORTGAGE_BROKER']
    },
    {
      task_code: 'BUY-003',
      title: 'Property reservation and booking deposit',
      description: 'Reserve property with booking deposit (typically €5,000-€10,000)',
      category: 'PROPERTY',
      task_type: 'FINANCIAL_TRANSACTION',
      estimated_duration_hours: 1.0,
      complexity: 'SIMPLE',
      automation_level: 'fully_automated',
      dependencies: ['BUY-002'],
      compliance_requirements: ['PROPERTY_SERVICES_ACT', 'CONSUMER_PROTECTION'],
      ui_requirements: {
        element: 'Secure payment gateway',
        validation: 'Payment confirmation',
        automation: 'Escrow account setup'
      },
      stakeholder_notifications: ['DEVELOPER', 'ESTATE_AGENT', 'BUYER_SOLICITOR']
    },
    {
      task_code: 'BUY-004',
      title: 'Appoint qualified property solicitor',
      description: 'Select Law Society qualified solicitor for conveyancing',
      category: 'LEGAL_PROCESS',
      task_type: 'PROFESSIONAL_APPOINTMENT',
      estimated_duration_hours: 2.0,
      complexity: 'MODERATE',
      automation_level: 'semi_automated',
      dependencies: ['BUY-003'],
      compliance_requirements: ['LAW_SOCIETY_STANDARDS', 'PROFESSIONAL_INDEMNITY'],
      ui_requirements: {
        element: 'Law Society directory integration',
        validation: 'Solicitor qualification check',
        automation: 'Professional verification'
      },
      stakeholder_notifications: ['LAW_SOCIETY', 'BUYER_SOLICITOR']
    },
    {
      task_code: 'BUY-005',
      title: 'Building Survey and Structural Report',
      description: 'Commission professional building survey from qualified surveyor',
      category: 'INSPECTION',
      task_type: 'PROFESSIONAL_INSPECTION',
      estimated_duration_hours: 6.0,
      complexity: 'COMPLEX',
      automation_level: 'manual',
      dependencies: ['BUY-004'],
      compliance_requirements: ['BUILDING_REGULATIONS', 'PROFESSIONAL_STANDARDS'],
      ui_requirements: {
        element: 'Survey booking system',
        validation: 'Surveyor qualification check',
        automation: 'Report delivery system'
      },
      stakeholder_notifications: ['BUILDING_SURVEYOR', 'BUYER_SOLICITOR', 'MORTGAGE_LENDER']
    }
  ],

  // DEVELOPER TASKS (Irish Property Development Process)
  DEVELOPER: [
    {
      task_code: 'DEV-001',
      title: 'Planning Permission Application',
      description: 'Submit planning application to Local Planning Authority',
      category: 'COMPLIANCE',
      task_type: 'REGULATORY_APPLICATION',
      estimated_duration_hours: 40.0,
      complexity: 'COMPLEX',
      automation_level: 'semi_automated',
      dependencies: [],
      compliance_requirements: ['PLANNING_AND_DEVELOPMENT_ACT', 'LOCAL_AREA_PLAN'],
      ui_requirements: {
        element: 'Planning portal integration',
        validation: 'Application completeness check',
        automation: 'Document submission tracking'
      },
      stakeholder_notifications: ['PLANNING_AUTHORITY', 'LEAD_ARCHITECT', 'PLANNING_CONSULTANT']
    },
    {
      task_code: 'DEV-002',
      title: 'Fire Safety Certificate Application',
      description: 'Apply for Fire Safety Certificate from Building Control Authority',
      category: 'COMPLIANCE',
      task_type: 'SAFETY_CERTIFICATION',
      estimated_duration_hours: 20.0,
      complexity: 'COMPLEX',
      automation_level: 'semi_automated',
      dependencies: ['DEV-001'],
      compliance_requirements: ['BUILDING_CONTROL_REGULATIONS', 'FIRE_SAFETY_CODE'],
      ui_requirements: {
        element: 'Building Control portal',
        validation: 'Fire safety compliance',
        automation: 'Certificate tracking'
      },
      stakeholder_notifications: ['BUILDING_CONTROL', 'FIRE_OFFICER', 'ARCHITECT']
    },
    {
      task_code: 'DEV-003',
      title: 'BCAR Assigned Certifier Appointment',
      description: 'Appoint BCAR Assigned Certifier for Building Control compliance',
      category: 'COMPLIANCE',
      task_type: 'PROFESSIONAL_APPOINTMENT',
      estimated_duration_hours: 8.0,
      complexity: 'MODERATE',
      automation_level: 'manual',
      dependencies: ['DEV-002'],
      compliance_requirements: ['BUILDING_CONTROL_AMENDMENT_REGULATIONS', 'BCAR_SI_9'],
      ui_requirements: {
        element: 'BCAR certifier directory',
        validation: 'Certifier qualification check',
        automation: 'Appointment documentation'
      },
      stakeholder_notifications: ['BCAR_CERTIFIER', 'BUILDING_CONTROL', 'MAIN_CONTRACTOR']
    },
    {
      task_code: 'DEV-004',
      title: 'Commencement Notice Submission',
      description: 'Submit Commencement Notice to Building Control Authority',
      category: 'COMPLIANCE',
      task_type: 'REGULATORY_NOTICE',
      estimated_duration_hours: 4.0,
      complexity: 'MODERATE',
      automation_level: 'fully_automated',
      dependencies: ['DEV-003'],
      compliance_requirements: ['BUILDING_CONTROL_REGULATIONS', 'COMMENCEMENT_NOTICE_REQUIREMENTS'],
      ui_requirements: {
        element: 'Building Control submission portal',
        validation: 'Notice completeness check',
        automation: 'Automatic submission'
      },
      stakeholder_notifications: ['BUILDING_CONTROL', 'MAIN_CONTRACTOR', 'BCAR_CERTIFIER']
    },
    {
      task_code: 'DEV-005',
      title: 'NZEB Compliance Certification',
      description: 'Ensure Nearly Zero Energy Building compliance for new developments',
      category: 'COMPLIANCE',
      task_type: 'ENERGY_CERTIFICATION',
      estimated_duration_hours: 16.0,
      complexity: 'COMPLEX',
      automation_level: 'semi_automated',
      dependencies: ['DEV-004'],
      compliance_requirements: ['EU_ENERGY_PERFORMANCE_DIRECTIVE', 'IRISH_BUILDING_REGULATIONS'],
      ui_requirements: {
        element: 'Energy calculation system',
        validation: 'NZEB compliance check',
        automation: 'Energy performance calculation'
      },
      stakeholder_notifications: ['NZEB_CONSULTANT', 'BER_ASSESSOR', 'MEP_ENGINEER']
    }
  ],

  // SOLICITOR TASKS (Irish Conveyancing Process)
  SOLICITOR: [
    {
      task_code: 'SOL-001',
      title: 'Client AML/KYC Verification',
      description: 'Complete Anti-Money Laundering and Know Your Customer verification',
      category: 'COMPLIANCE',
      task_type: 'CLIENT_VERIFICATION',
      estimated_duration_hours: 2.0,
      complexity: 'MODERATE',
      automation_level: 'fully_automated',
      dependencies: [],
      compliance_requirements: ['CRIMINAL_JUSTICE_MONEY_LAUNDERING_ACT', 'LAW_SOCIETY_AML_HANDBOOK'],
      ui_requirements: {
        element: 'ID verification system',
        validation: 'AML compliance check',
        automation: 'Document scanning and verification'
      },
      stakeholder_notifications: ['COMPLIANCE_OFFICER', 'LAW_SOCIETY']
    },
    {
      task_code: 'SOL-002',
      title: 'Land Registry Title Investigation',
      description: 'Investigate title at Property Registration Authority (Land Registry)',
      category: 'LEGAL_PROCESS',
      task_type: 'TITLE_INVESTIGATION',
      estimated_duration_hours: 8.0,
      complexity: 'COMPLEX',
      automation_level: 'semi_automated',
      dependencies: ['SOL-001'],
      compliance_requirements: ['REGISTRATION_OF_TITLE_ACT', 'LAND_REGISTRATION_RULES'],
      ui_requirements: {
        element: 'Land Registry portal integration',
        validation: 'Title defect identification',
        automation: 'Folio download and analysis'
      },
      stakeholder_notifications: ['LAND_REGISTRY', 'PROPERTY_REGISTRATION_AUTHORITY']
    },
    {
      task_code: 'SOL-003',
      title: 'Planning Certificate and Compliance',
      description: 'Obtain Planning Certificate and verify planning compliance',
      category: 'COMPLIANCE',
      task_type: 'PLANNING_VERIFICATION',
      estimated_duration_hours: 4.0,
      complexity: 'MODERATE',
      automation_level: 'semi_automated',
      dependencies: ['SOL-002'],
      compliance_requirements: ['PLANNING_AND_DEVELOPMENT_ACT', 'LOCAL_GOVERNMENT_ACT'],
      ui_requirements: {
        element: 'Planning authority portal',
        validation: 'Planning compliance check',
        automation: 'Certificate retrieval'
      },
      stakeholder_notifications: ['LOCAL_AUTHORITY', 'PLANNING_AUTHORITY']
    },
    {
      task_code: 'SOL-004',
      title: 'Contract for Sale Review and Preparation',
      description: 'Review and prepare Contract for Sale under Irish law',
      category: 'LEGAL_PROCESS',
      task_type: 'CONTRACT_PREPARATION',
      estimated_duration_hours: 12.0,
      complexity: 'COMPLEX',
      automation_level: 'manual',
      dependencies: ['SOL-003'],
      compliance_requirements: ['SALE_OF_GOODS_ACT', 'CONTRACT_LAW', 'PROPERTY_LAW'],
      ui_requirements: {
        element: 'Contract drafting system',
        validation: 'Legal clause verification',
        automation: 'Standard clause insertion'
      },
      stakeholder_notifications: ['SELLER_SOLICITOR', 'BUYER', 'SELLER']
    },
    {
      task_code: 'SOL-005',
      title: 'Stamp Duty Calculation and Payment',
      description: 'Calculate and arrange payment of stamp duty to Revenue',
      category: 'FINANCIAL_PLANNING',
      task_type: 'TAX_CALCULATION',
      estimated_duration_hours: 3.0,
      complexity: 'MODERATE',
      automation_level: 'fully_automated',
      dependencies: ['SOL-004'],
      compliance_requirements: ['STAMP_DUTIES_CONSOLIDATION_ACT', 'REVENUE_PROCEDURES'],
      ui_requirements: {
        element: 'Stamp duty calculator',
        validation: 'Revenue rate verification',
        automation: 'ROS system integration'
      },
      stakeholder_notifications: ['REVENUE_COMMISSIONERS', 'BUYER', 'MORTGAGE_LENDER']
    }
  ],

  // ESTATE AGENT TASKS (Irish Property Sales Process)
  ESTATE_AGENT: [
    {
      task_code: 'AGT-001',
      title: 'PSRA License Verification',
      description: 'Verify Property Services Regulatory Authority license is current',
      category: 'COMPLIANCE',
      task_type: 'LICENSE_VERIFICATION',
      estimated_duration_hours: 0.5,
      complexity: 'SIMPLE',
      automation_level: 'fully_automated',
      dependencies: [],
      compliance_requirements: ['PROPERTY_SERVICES_ACT', 'PSRA_REGULATIONS'],
      ui_requirements: {
        element: 'PSRA verification system',
        validation: 'License status check',
        automation: 'Automatic renewal alerts'
      },
      stakeholder_notifications: ['PSRA', 'PROPERTY_SERVICES_REGULATORY_AUTHORITY']
    },
    {
      task_code: 'AGT-002',
      title: 'Property Listing with BER Certificate',
      description: 'Create property listing including mandatory BER certificate',
      category: 'SALES_MARKETING',
      task_type: 'PROPERTY_LISTING',
      estimated_duration_hours: 3.0,
      complexity: 'MODERATE',
      automation_level: 'semi_automated',
      dependencies: ['AGT-001'],
      compliance_requirements: ['EUROPEAN_COMMUNITIES_ENERGY_PERFORMANCE_REGULATIONS', 'ADVERTISING_STANDARDS'],
      ui_requirements: {
        element: 'Property listing portal',
        validation: 'BER certificate verification',
        automation: 'MLS integration'
      },
      stakeholder_notifications: ['BER_ASSESSOR', 'PROPERTY_OWNER', 'MARKETING_PLATFORMS']
    },
    {
      task_code: 'AGT-003',
      title: 'Viewing Coordination and Management',
      description: 'Coordinate property viewings and manage prospective buyer inquiries',
      category: 'SALES_MARKETING',
      task_type: 'VIEWING_MANAGEMENT',
      estimated_duration_hours: 8.0,
      complexity: 'MODERATE',
      automation_level: 'semi_automated',
      dependencies: ['AGT-002'],
      compliance_requirements: ['GDPR', 'PROPERTY_SERVICES_ACT'],
      ui_requirements: {
        element: 'Viewing scheduling system',
        validation: 'Data protection compliance',
        automation: 'Calendar integration'
      },
      stakeholder_notifications: ['PROSPECTIVE_BUYERS', 'PROPERTY_OWNER']
    },
    {
      task_code: 'AGT-004',
      title: 'Sale Agreement Facilitation',
      description: 'Facilitate sale agreement between buyer and seller',
      category: 'SALES_MARKETING',
      task_type: 'NEGOTIATION',
      estimated_duration_hours: 6.0,
      complexity: 'COMPLEX',
      automation_level: 'manual',
      dependencies: ['AGT-003'],
      compliance_requirements: ['PROPERTY_SERVICES_ACT', 'CONSUMER_PROTECTION'],
      ui_requirements: {
        element: 'Agreement management system',
        validation: 'Terms verification',
        automation: 'Document generation'
      },
      stakeholder_notifications: ['BUYER', 'SELLER', 'BUYER_SOLICITOR', 'SELLER_SOLICITOR']
    },
    {
      task_code: 'AGT-005',
      title: 'Commission and Fee Documentation',
      description: 'Document commission structure and fees in compliance with PSRA',
      category: 'FINANCIAL_PLANNING',
      task_type: 'FEE_DOCUMENTATION',
      estimated_duration_hours: 2.0,
      complexity: 'SIMPLE',
      automation_level: 'fully_automated',
      dependencies: ['AGT-004'],
      compliance_requirements: ['PROPERTY_SERVICES_ACT', 'PSRA_CODE_OF_PRACTICE'],
      ui_requirements: {
        element: 'Commission calculation system',
        validation: 'Fee structure compliance',
        automation: 'Invoice generation'
      },
      stakeholder_notifications: ['SELLER', 'ACCOUNTANT', 'PSRA']
    }
  ]
};

/**
 * Export real Irish property tasks for database seeding
 */
module.exports = {
  REAL_IRISH_TASKS,
  
  /**
   * Get all tasks formatted for database insertion
   */
  getAllTasks() {
    const allTasks = [];
    
    Object.keys(REAL_IRISH_TASKS).forEach(role => {
      REAL_IRISH_TASKS[role].forEach(task => {
        allTasks.push({
          ...task,
          primary_professional_role: role === 'SOLICITOR' ? 'BUYER_SOLICITOR' : role,
          secondary_professional_roles: JSON.stringify([]),
          requires_professional_certification: JSON.stringify(task.compliance_requirements || []),
          requires_professional_association: JSON.stringify([]),
          category: task.category,
          subcategory: null,
          persona: role,
          discipline: this.getDiscipline(role),
          task_type: task.task_type,
          priority: 'medium',
          dependency_codes: JSON.stringify(task.dependencies || []),
          ui_requirements: JSON.stringify(task.ui_requirements || {}),
          compliance_requirements: JSON.stringify(task.compliance_requirements || []),
          stakeholder_notifications: JSON.stringify(task.stakeholder_notifications || []),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      });
    });
    
    return allTasks;
  },
  
  /**
   * Get discipline for role
   */
  getDiscipline(role) {
    const disciplines = {
      'BUYER': 'Property_Acquisition',
      'DEVELOPER': 'Property_Development',
      'SOLICITOR': 'Legal_Conveyancing',
      'ESTATE_AGENT': 'Property_Sales'
    };
    return disciplines[role] || 'General';
  },
  
  /**
   * Get task count by role
   */
  getTaskCounts() {
    return {
      BUYER: REAL_IRISH_TASKS.BUYER.length,
      DEVELOPER: REAL_IRISH_TASKS.DEVELOPER.length,
      SOLICITOR: REAL_IRISH_TASKS.SOLICITOR.length,
      ESTATE_AGENT: REAL_IRISH_TASKS.ESTATE_AGENT.length,
      total: Object.values(REAL_IRISH_TASKS).reduce((sum, tasks) => sum + tasks.length, 0)
    };
  }
};

// If run directly, show task summary
if (require.main === module) {
  const counts = module.exports.getTaskCounts();
  console.log('🇮🇪 Real Irish Property Transaction Tasks:');
  console.log(`   Buyer Tasks: ${counts.BUYER}`);
  console.log(`   Developer Tasks: ${counts.DEVELOPER}`);
  console.log(`   Solicitor Tasks: ${counts.SOLICITOR}`);
  console.log(`   Estate Agent Tasks: ${counts.ESTATE_AGENT}`);
  console.log(`   Total Tasks: ${counts.total}`);
  console.log('');
  console.log('✅ All tasks based on actual Irish property law and regulations');
}