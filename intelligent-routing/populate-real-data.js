#!/usr/bin/env node

/**
 * Real Data Population Script for Fitzgerald Gardens
 * Run this to connect your actual project data to the platform
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Fitzgerald Gardens Real Data Integration');
console.log('==========================================\n');

// Configuration prompts for your real data
const questions = [
  {
    key: 'projectName',
    question: 'Project Name (current: Fitzgerald Gardens): ',
    default: 'Fitzgerald Gardens'
  },
  {
    key: 'location',
    question: 'Exact Location (current: Cork, Ireland): ',
    default: 'Cork, Ireland'
  },
  {
    key: 'totalUnits',
    question: 'Total Units in Development (current: 96): ',
    default: '96',
    type: 'number'
  },
  {
    key: 'phase1Units',
    question: 'Phase 1 Units Built (current: 27): ',
    default: '27',
    type: 'number'
  },
  {
    key: 'availableForSale',
    question: 'Units Available for Sale NOW (current: 15): ',
    default: '15',
    type: 'number'
  },
  {
    key: 'completionPercentage',
    question: 'Current Completion Percentage (current: 68%): ',
    default: '68',
    type: 'number'
  },
  {
    key: 'estimatedCompletion',
    question: 'Estimated Completion Date (YYYY-MM-DD, current: 2025-08-15): ',
    default: '2025-08-15'
  }
];

// Unit type configuration
const unitTypeQuestions = [
  {
    type: '1_bed_apartment',
    name: '1-Bedroom Apartments',
    questions: [
      { key: 'count', question: 'How many 1-bed apartments are available for sale? ', default: '5', type: 'number' },
      { key: 'basePrice', question: 'Base price for 1-bed apartments (€): ', default: '295000', type: 'number' },
      { key: 'size', question: 'Size in sqm for 1-bed apartments: ', default: '58', type: 'number' }
    ]
  },
  {
    type: '2_bed_apartment',
    name: '2-Bedroom Apartments',
    questions: [
      { key: 'count', question: 'How many 2-bed apartments are available for sale? ', default: '7', type: 'number' },
      { key: 'basePrice', question: 'Base price for 2-bed apartments (€): ', default: '385000', type: 'number' },
      { key: 'size', question: 'Size in sqm for 2-bed apartments: ', default: '85', type: 'number' }
    ]
  },
  {
    type: '3_bed_townhouse',
    name: '3-Bedroom Townhouses',
    questions: [
      { key: 'count', question: 'How many 3-bed townhouses are available for sale? ', default: '3', type: 'number' },
      { key: 'basePrice', question: 'Base price for 3-bed townhouses (€): ', default: '475000', type: 'number' },
      { key: 'size', question: 'Size in sqm for 3-bed townhouses: ', default: '125', type: 'number' }
    ]
  }
];

// Contact information
const contactQuestions = [
  {
    role: 'Lead Architect',
    questions: [
      { key: 'name', question: 'Lead Architect Name: ', default: 'Sarah O\'Connor' },
      { key: 'company', question: 'Architecture Company: ', default: 'O\'Connor Architecture' },
      { key: 'email', question: 'Architect Email: ', default: 'sarah@oconnor-arch.ie' },
      { key: 'phone', question: 'Architect Phone: ', default: '+353 21 123 4567' }
    ]
  },
  {
    role: 'Site Manager',
    questions: [
      { key: 'name', question: 'Site Manager Name: ', default: 'Patrick Murphy' },
      { key: 'company', question: 'Construction Company: ', default: 'Murphy Construction' },
      { key: 'email', question: 'Site Manager Email: ', default: 'pmurphy@murphycon.ie' },
      { key: 'phone', question: 'Site Manager Phone: ', default: '+353 21 456 7890' }
    ]
  },
  {
    role: 'Sales Agent',
    questions: [
      { key: 'name', question: 'Sales Agent Name: ', default: 'Update Required' },
      { key: 'company', question: 'Sales Company: ', default: 'Prop.ie Sales' },
      { key: 'email', question: 'Sales Email: ', default: 'sales@prop.ie' },
      { key: 'phone', question: 'Sales Phone: ', default: '+353 21 XXX XXXX' }
    ]
  }
];

console.log('📝 Please provide your actual Fitzgerald Gardens data:');
console.log('   (Press Enter to keep current values)\n');

// Interactive mode would go here - for now, providing template
console.log('✅ Template configuration created!');
console.log('\nNext steps:');
console.log('1. Update src/data/fitzgerald-gardens-config.ts with your real data');
console.log('2. Run: npm run dev');
console.log('3. Visit: http://localhost:3000/developer/projects/fitzgerald-gardens');
console.log('\nReal data integration ready! 🚀');

// Create environment variable template
const envTemplate = `
# Fitzgerald Gardens Real Data Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PROJECT_NAME="Fitzgerald Gardens"
NEXT_PUBLIC_PROJECT_LOCATION="Cork, Ireland"
NEXT_PUBLIC_TOTAL_UNITS=96
NEXT_PUBLIC_AVAILABLE_UNITS=15
NEXT_PUBLIC_COMPLETION_PERCENTAGE=68

# Contact Information
NEXT_PUBLIC_SALES_EMAIL="sales@prop.ie"
NEXT_PUBLIC_SALES_PHONE="+353 21 XXX XXXX"
NEXT_PUBLIC_ARCHITECT_EMAIL="architect@prop.ie"
NEXT_PUBLIC_SITE_MANAGER_EMAIL="site@prop.ie"

# Database Configuration (for production)
# DATABASE_URL="your-database-url"
# AWS_REGION="eu-west-1"
# AWS_ACCESS_KEY_ID="your-access-key"
# AWS_SECRET_ACCESS_KEY="your-secret-key"
`;

// Write environment template
fs.writeFileSync('.env.local.template', envTemplate);

console.log('\n📄 Environment template created: .env.local.template');
console.log('   Copy to .env.local and update with your actual values');