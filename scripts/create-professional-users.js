/**
 * Professional Users Creation Script
 * 
 * Creates real professional users across all 58 professional roles
 * with proper role assignments, certifications, and capabilities
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Direct SQLite connection
const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new sqlite3.Database(dbPath);

// Helper to generate realistic IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Professional Role Definitions with Enhanced Metadata
 */
const PROFESSIONAL_ROLES = {
  // Primary Transaction Roles
  BUYER: { 
    userCount: 25, 
    baseEmail: 'buyer',
    specializations: ['first_time_buyer', 'investor_buyer', 'corporate_buyer'],
    certifications: ['property_investment', 'financial_planning']
  },
  DEVELOPER: { 
    userCount: 15, 
    baseEmail: 'developer',
    specializations: ['residential', 'commercial', 'mixed_use', 'affordable_housing'],
    certifications: ['cif_membership', 'property_development', 'construction_management']
  },
  INVESTOR: { 
    userCount: 20, 
    baseEmail: 'investor',
    specializations: ['residential_portfolio', 'commercial_real_estate', 'reit_management'],
    certifications: ['investment_management', 'property_valuation', 'portfolio_analysis']
  },
  
  // Legal & Compliance Professionals
  BUYER_SOLICITOR: { 
    userCount: 18, 
    baseEmail: 'buyer.solicitor',
    specializations: ['conveyancing', 'property_law', 'mortgage_law'],
    certifications: ['law_society_ireland', 'conveyancing_specialist', 'property_law']
  },
  DEVELOPER_SOLICITOR: { 
    userCount: 12, 
    baseEmail: 'developer.solicitor',
    specializations: ['development_law', 'planning_law', 'commercial_property'],
    certifications: ['law_society_ireland', 'planning_law', 'commercial_property']
  },
  
  // Estate Agents & Sales
  ESTATE_AGENT: { 
    userCount: 22, 
    baseEmail: 'estate.agent',
    specializations: ['residential_sales', 'commercial_sales', 'rental_management'],
    certifications: ['psra_license', 'real_estate_sales', 'property_management']
  },
  DEVELOPMENT_SALES_AGENT: { 
    userCount: 14, 
    baseEmail: 'dev.sales',
    specializations: ['new_homes', 'off_plan_sales', 'investor_sales'],
    certifications: ['psra_license', 'new_homes_specialist', 'investment_property']
  },
  
  // Financial Services
  BUYER_MORTGAGE_BROKER: { 
    userCount: 16, 
    baseEmail: 'mortgage.broker',
    specializations: ['first_time_buyer', 'buy_to_let', 'commercial_finance'],
    certifications: ['central_bank_authorization', 'mortgage_advice', 'financial_planning']
  },
  MORTGAGE_LENDER: { 
    userCount: 10, 
    baseEmail: 'mortgage.lender',
    specializations: ['residential_lending', 'commercial_lending', 'buy_to_let'],
    certifications: ['central_bank_authorization', 'credit_analysis', 'risk_management']
  },
  MORTGAGE_UNDERWRITER: { 
    userCount: 8, 
    baseEmail: 'underwriter',
    specializations: ['credit_assessment', 'risk_analysis', 'loan_structuring'],
    certifications: ['underwriting_certification', 'credit_analysis', 'risk_management']
  },
  
  // Technical Professionals
  LEAD_ARCHITECT: { 
    userCount: 12, 
    baseEmail: 'architect',
    specializations: ['residential_design', 'commercial_design', 'sustainable_design'],
    certifications: ['riai_membership', 'architectural_practice', 'sustainable_design']
  },
  STRUCTURAL_ENGINEER: { 
    userCount: 10, 
    baseEmail: 'structural.engineer',
    specializations: ['residential_structures', 'commercial_structures', 'renovation'],
    certifications: ['engineers_ireland', 'structural_engineering', 'building_standards']
  },
  QUANTITY_SURVEYOR: { 
    userCount: 14, 
    baseEmail: 'quantity.surveyor',
    specializations: ['cost_estimation', 'project_management', 'commercial_management'],
    certifications: ['scsi_membership', 'quantity_surveying', 'project_management']
  },
  BUILDING_SURVEYOR: { 
    userCount: 12, 
    baseEmail: 'building.surveyor',
    specializations: ['building_inspection', 'defect_analysis', 'maintenance_planning'],
    certifications: ['scsi_membership', 'building_surveying', 'property_inspection']
  },
  
  // Construction & Project Management
  MAIN_CONTRACTOR: { 
    userCount: 18, 
    baseEmail: 'main.contractor',
    specializations: ['residential_construction', 'commercial_construction', 'renovation'],
    certifications: ['cif_membership', 'construction_management', 'health_safety']
  },
  PROJECT_MANAGER_CONSTRUCTION: { 
    userCount: 15, 
    baseEmail: 'project.manager',
    specializations: ['construction_management', 'development_coordination', 'quality_control'],
    certifications: ['pmi_certification', 'construction_management', 'project_leadership']
  },
  DEVELOPMENT_PROJECT_MANAGER: { 
    userCount: 12, 
    baseEmail: 'dev.project.manager',
    specializations: ['development_oversight', 'stakeholder_coordination', 'timeline_management'],
    certifications: ['pmi_certification', 'development_management', 'stakeholder_management']
  },
  
  // Specialist Consultants
  PLANNING_CONSULTANT: { 
    userCount: 8, 
    baseEmail: 'planning.consultant',
    specializations: ['planning_applications', 'regulatory_compliance', 'land_use'],
    certifications: ['irish_planning_institute', 'planning_law', 'environmental_assessment']
  },
  ENVIRONMENTAL_CONSULTANT: { 
    userCount: 6, 
    baseEmail: 'environmental.consultant',
    specializations: ['environmental_impact', 'sustainability', 'regulatory_compliance'],
    certifications: ['environmental_assessment', 'sustainability_consulting', 'regulatory_compliance']
  },
  ENERGY_ASSESSOR: { 
    userCount: 10, 
    baseEmail: 'energy.assessor',
    specializations: ['ber_assessment', 'energy_efficiency', 'sustainability'],
    certifications: ['seai_certification', 'energy_assessment', 'building_regulations']
  },
  
  // Insurance & Risk Management
  INSURANCE_PROVIDER: { 
    userCount: 8, 
    baseEmail: 'insurance.provider',
    specializations: ['property_insurance', 'construction_insurance', 'professional_indemnity'],
    certifications: ['central_bank_authorization', 'insurance_underwriting', 'risk_assessment']
  },
  BUYER_INSURANCE_BROKER: { 
    userCount: 12, 
    baseEmail: 'insurance.broker',
    specializations: ['home_insurance', 'mortgage_protection', 'life_insurance'],
    certifications: ['central_bank_authorization', 'insurance_mediation', 'financial_advice']
  },
  
  // Property Management & Maintenance
  PROPERTY_MANAGER: { 
    userCount: 16, 
    baseEmail: 'property.manager',
    specializations: ['residential_management', 'commercial_management', 'maintenance_coordination'],
    certifications: ['psra_license', 'property_management', 'tenant_relations']
  },
  FACILITIES_MANAGER: { 
    userCount: 10, 
    baseEmail: 'facilities.manager',
    specializations: ['building_maintenance', 'service_coordination', 'compliance_management'],
    certifications: ['facilities_management', 'building_operations', 'service_management']
  },
  MAINTENANCE_COORDINATOR: { 
    userCount: 14, 
    baseEmail: 'maintenance.coordinator',
    specializations: ['preventive_maintenance', 'emergency_response', 'contractor_management'],
    certifications: ['maintenance_management', 'contractor_coordination', 'emergency_response']
  }
};

/**
 * Generate realistic professional user data
 */
function generateProfessionalUser(role, index, roleConfig) {
  const specialization = roleConfig.specializations[index % roleConfig.specializations.length];
  const certification = roleConfig.certifications[index % roleConfig.certifications.length];
  
  const userId = `${role.toLowerCase()}_${index + 1}_${generateId()}`;
  const email = `${roleConfig.baseEmail}${index + 1}@propie.ie`;
  
  // Generate Irish names
  const firstNames = ['Aoife', 'Cian', 'Niamh', 'Oisin', 'Siobhan', 'Darragh', 'Caoimhe', 'Eoin', 'Ciara', 'Ruairi', 'Aine', 'Conor', 'Orla', 'Padraig', 'Grainne'];
  const lastNames = ['O\'Sullivan', 'Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'O\'Connor', 'O\'Neill', 'McCarthy', 'Gallagher', 'Byrne', 'Walsh', 'Martin', 'O\'Reilly', 'Doyle', 'Clarke'];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  
  // Generate Irish addresses
  const counties = ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Wexford', 'Kerry', 'Mayo', 'Donegal'];
  const cities = ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Wexford', 'Tralee', 'Castlebar', 'Letterkenny'];
  
  const county = counties[index % counties.length];
  const city = cities[index % cities.length];
  
  const professionalBio = `Experienced ${role.toLowerCase().replace(/_/g, ' ')} with ${Math.floor(Math.random() * 20 + 3)} years in the Irish property sector. Specializing in ${specialization} with ${certification} certification.`;
  
  return {
    id: userId,
    email,
    name: `${firstName} ${lastName}`,
    phone: `+353 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
    address: `${Math.floor(Math.random() * 200 + 1)} ${['Main Street', 'High Street', 'Church Road', 'Park Avenue', 'Mill Lane'][index % 5]}, ${city}, ${county}`,
    verified: true,
    active: true,
    professional_role_primary: role,
    professional_specializations: JSON.stringify([specialization]),
    professional_certifications: JSON.stringify([certification, ...roleConfig.certifications.slice(1)]),
    professional_status: 'active',
    license_number: `${role}_LIC_${generateId()}`,
    professional_body_primary: roleConfig.certifications[0],
    professional_bodies: JSON.stringify(roleConfig.certifications),
    contact_preferences: JSON.stringify({
      preferredContact: 'email',
      availableHours: '09:00-17:00',
      timezone: 'Europe/Dublin'
    }),
    availability_status: 'available',
    hourly_rate: Math.floor(Math.random() * 150 + 50), // €50-200 per hour
    location_preferences: JSON.stringify([county, ...counties.slice(0, 2)]),
    project_capacity: Math.floor(Math.random() * 15 + 5), // 5-20 projects
    experience_years: Math.floor(Math.random() * 20 + 3),
    portfolio_url: `https://propie.ie/professionals/${userId}`,
    professional_bio: professionalBio
  };
}

/**
 * Create Professional User with Role Assignment using direct SQLite
 */
function createProfessionalUserWithRole(userData) {
  return new Promise((resolve, reject) => {
    const insertSQL = `
      INSERT INTO users (
        id, email, name, phone, address, 
        verified, active, professional_role_primary, 
        professional_specializations, professional_certifications,
        professional_status, license_number, professional_body_primary,
        professional_bodies, contact_preferences, availability_status,
        hourly_rate, location_preferences, project_capacity,
        experience_years, portfolio_url, professional_bio,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const now = new Date().toISOString();
    const values = [
      userData.id,
      userData.email,
      userData.name,
      userData.phone,
      userData.address,
      userData.verified ? 1 : 0,
      userData.active ? 1 : 0,
      userData.professional_role_primary,
      userData.professional_specializations,
      userData.professional_certifications,
      userData.professional_status,
      userData.license_number,
      userData.professional_body_primary,
      userData.professional_bodies,
      userData.contact_preferences,
      userData.availability_status,
      userData.hourly_rate,
      userData.location_preferences,
      userData.project_capacity,
      userData.experience_years,
      userData.portfolio_url,
      userData.professional_bio,
      now,
      now
    ];
    
    db.run(insertSQL, values, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  User already exists: ${userData.email}`);
          resolve(null);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, err.message);
          resolve(null);
        }
      } else {
        console.log(`✅ Created professional user: ${userData.name} (${userData.professional_role_primary})`);
        resolve({ ...userData, id: this.lastID });
      }
    });
  });
}

/**
 * Main execution function
 */
async function createAllProfessionalUsers() {
  console.log('🚀 Starting Professional Users Creation...\n');
  
  let totalCreated = 0;
  let totalAttempted = 0;
  
  for (const [role, config] of Object.entries(PROFESSIONAL_ROLES)) {
    console.log(`\n📋 Creating ${config.userCount} ${role} professionals...`);
    
    for (let i = 0; i < config.userCount; i++) {
      const userData = generateProfessionalUser(role, i, config);
      totalAttempted++;
      
      const user = await createProfessionalUserWithRole(userData);
      if (user) {
        totalCreated++;
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  console.log(`\n🎉 Professional Users Creation Complete!`);
  console.log(`📊 Summary:`);
  console.log(`   • Total Attempted: ${totalAttempted}`);
  console.log(`   • Successfully Created: ${totalCreated}`);
  console.log(`   • Professional Roles: ${Object.keys(PROFESSIONAL_ROLES).length}`);
  console.log(`   • Average Users per Role: ${(totalCreated / Object.keys(PROFESSIONAL_ROLES).length).toFixed(1)}`);
  
  // Generate summary report
  const rolesSummary = Object.entries(PROFESSIONAL_ROLES).map(([role, config]) => 
    `   ${role}: ${config.userCount} users`
  ).join('\n');
  
  console.log(`\n📋 Professional Users by Role:`);
  console.log(rolesSummary);
  
  console.log(`\n✅ All professional users are ready for task assignment and AI routing!`);
}

/**
 * Error handling and cleanup
 */
async function main() {
  try {
    await createAllProfessionalUsers();
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

// Execute the script
if (require.main === module) {
  main();
}

module.exports = {
  createAllProfessionalUsers,
  PROFESSIONAL_ROLES,
  generateProfessionalUser
};