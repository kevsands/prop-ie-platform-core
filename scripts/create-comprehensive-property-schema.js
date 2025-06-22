/**
 * Comprehensive Property Schema Creation Script
 * 
 * Extends the basic Development and Unit tables to support all the rich property data
 * currently provided by mock services, enabling full database integration
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Direct SQLite connection
const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new sqlite3.Database(dbPath);

/**
 * Enhanced database schema for comprehensive property management
 */
const schemaDefinitions = {
  // Enhanced Developments table with comprehensive fields
  developments_enhanced: `
    CREATE TABLE IF NOT EXISTS developments_enhanced (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'planning',
      status_color TEXT DEFAULT 'blue-500',
      price_range_min INTEGER,
      price_range_max INTEGER,
      price_range_display TEXT,
      bedrooms_available TEXT DEFAULT '[]', -- JSON array of available bedroom counts
      bathrooms_typical INTEGER DEFAULT 2,
      square_feet_typical INTEGER,
      features TEXT DEFAULT '[]', -- JSON array of development features
      amenities TEXT DEFAULT '[]', -- JSON array of development amenities
      energy_rating TEXT DEFAULT 'B2',
      availability_status TEXT,
      deposit_amount INTEGER,
      deposit_display TEXT,
      showing_dates TEXT DEFAULT '[]', -- JSON array of showing dates
      floor_plans TEXT DEFAULT '[]', -- JSON array of floor plan objects
      virtual_tour_url TEXT,
      brochure_url TEXT,
      launch_date DATE,
      completion_date DATE,
      total_units INTEGER DEFAULT 0,
      available_units INTEGER DEFAULT 0,
      sold_units INTEGER DEFAULT 0,
      reserved_units INTEGER DEFAULT 0,
      developer_id TEXT,
      developer_name TEXT,
      architect_name TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      sales_office_address TEXT,
      marketing_suite_open BOOLEAN DEFAULT false,
      coordinates_lat REAL,
      coordinates_lng REAL,
      nearby_amenities TEXT DEFAULT '[]', -- JSON array of nearby amenities
      transport_links TEXT DEFAULT '[]', -- JSON array of transport links
      schools_nearby TEXT DEFAULT '[]', -- JSON array of nearby schools
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,

  // Enhanced Properties/Units table with comprehensive fields
  properties_enhanced: `
    CREATE TABLE IF NOT EXISTS properties_enhanced (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      development_id TEXT NOT NULL,
      development_name TEXT NOT NULL,
      project_id TEXT,
      project_name TEXT,
      project_slug TEXT,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      area REAL, -- Square meters
      floor_area REAL, -- Internal floor area
      garden_area REAL, -- Garden area if applicable
      unit_number TEXT,
      floor_number INTEGER,
      status TEXT NOT NULL DEFAULT 'available',
      type TEXT NOT NULL, -- apartment, house, duplex, etc.
      property_category TEXT, -- new_build, resale, etc.
      parking_spaces INTEGER DEFAULT 0,
      garage BOOLEAN DEFAULT false,
      balcony BOOLEAN DEFAULT false,
      garden BOOLEAN DEFAULT false,
      terrace BOOLEAN DEFAULT false,
      en_suite BOOLEAN DEFAULT false,
      features TEXT DEFAULT '[]', -- JSON array of property features
      amenities TEXT DEFAULT '[]', -- JSON array of property amenities
      images TEXT DEFAULT '[]', -- JSON array of image URLs
      main_image TEXT,
      floor_plan TEXT, -- Floor plan image URL
      floor_plan_3d TEXT, -- 3D floor plan URL
      virtual_tour_url TEXT,
      energy_rating TEXT DEFAULT 'B2',
      ber_number TEXT,
      heating_type TEXT DEFAULT 'gas',
      construction_year INTEGER,
      completion_date DATE,
      move_in_date DATE,
      orientation TEXT, -- north, south, east, west, etc.
      view_description TEXT, -- garden view, sea view, etc.
      furnishing TEXT DEFAULT 'unfurnished',
      pets_allowed BOOLEAN DEFAULT false,
      smoking_allowed BOOLEAN DEFAULT false,
      is_new BOOLEAN DEFAULT true,
      is_reduced BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      is_premium BOOLEAN DEFAULT false,
      reduced_from_price INTEGER,
      reduction_amount INTEGER,
      reduction_percentage REAL,
      status_color TEXT DEFAULT 'green-600',
      htb_eligible BOOLEAN DEFAULT true,
      htb_grant_amount INTEGER,
      mortgage_example TEXT, -- JSON object with mortgage calculation
      stamp_duty_amount INTEGER,
      legal_fees_estimate INTEGER,
      management_fee_annual INTEGER,
      service_charge_annual INTEGER,
      property_tax_annual INTEGER,
      insurance_estimate_annual INTEGER,
      total_monthly_costs INTEGER,
      rental_potential INTEGER, -- Estimated rental income per month
      investment_yield REAL, -- Estimated annual yield percentage
      price_per_sqm INTEGER, -- Price per square meter
      last_price_update DATE,
      viewing_times TEXT DEFAULT '[]', -- JSON array of available viewing times
      reservation_fee INTEGER DEFAULT 5000,
      booking_deposit INTEGER DEFAULT 10000,
      stage_payments TEXT DEFAULT '[]', -- JSON array of stage payment schedule
      completion_payment INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (development_id) REFERENCES developments_enhanced(id)
    )
  `,

  // Property Images table for multiple images per property
  property_images: `
    CREATE TABLE IF NOT EXISTS property_images (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      image_type TEXT DEFAULT 'gallery', -- gallery, main, floor_plan, virtual_tour
      caption TEXT,
      alt_text TEXT,
      display_order INTEGER DEFAULT 0,
      is_main BOOLEAN DEFAULT false,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties_enhanced(id) ON DELETE CASCADE
    )
  `,

  // Property Features table for structured feature management
  property_features: `
    CREATE TABLE IF NOT EXISTS property_features (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      feature_category TEXT NOT NULL, -- kitchen, bathroom, technology, outdoor, etc.
      feature_name TEXT NOT NULL,
      feature_description TEXT,
      feature_value TEXT, -- For quantifiable features
      is_premium BOOLEAN DEFAULT false,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties_enhanced(id) ON DELETE CASCADE
    )
  `,

  // Development Floor Plans table
  development_floor_plans: `
    CREATE TABLE IF NOT EXISTS development_floor_plans (
      id TEXT PRIMARY KEY,
      development_id TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      plan_type TEXT NOT NULL, -- type_a, type_b, etc.
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      square_feet REAL,
      square_meters REAL,
      image_url TEXT,
      pdf_url TEXT,
      description TEXT,
      price_from INTEGER,
      price_to INTEGER,
      available_units INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT false,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (development_id) REFERENCES developments_enhanced(id) ON DELETE CASCADE
    )
  `,

  // Property Enquiries table
  property_enquiries: `
    CREATE TABLE IF NOT EXISTS property_enquiries (
      id TEXT PRIMARY KEY,
      property_id TEXT,
      development_id TEXT,
      enquiry_type TEXT NOT NULL, -- viewing, brochure, callback, etc.
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT,
      preferred_contact_method TEXT DEFAULT 'email',
      preferred_viewing_time TEXT,
      message TEXT,
      status TEXT DEFAULT 'new', -- new, contacted, scheduled, completed
      assigned_to TEXT, -- Staff member handling enquiry
      follow_up_date DATE,
      source TEXT DEFAULT 'website', -- website, referral, walk-in, etc.
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties_enhanced(id),
      FOREIGN KEY (development_id) REFERENCES developments_enhanced(id)
    )
  `,

  // Property Reservations table
  property_reservations: `
    CREATE TABLE IF NOT EXISTS property_reservations (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      buyer_id TEXT,
      buyer_name TEXT NOT NULL,
      buyer_email TEXT NOT NULL,
      buyer_phone TEXT,
      solicitor_name TEXT,
      solicitor_contact TEXT,
      mortgage_broker TEXT,
      reservation_fee_paid INTEGER,
      reservation_date DATE NOT NULL,
      reservation_expiry DATE,
      status TEXT DEFAULT 'active', -- active, extended, cancelled, converted
      payment_method TEXT,
      payment_reference TEXT,
      special_conditions TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties_enhanced(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id)
    )
  `,

  // Property Analytics table for tracking views, enquiries, etc.
  property_analytics: `
    CREATE TABLE IF NOT EXISTS property_analytics (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      development_id TEXT NOT NULL,
      date DATE NOT NULL,
      page_views INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      enquiries INTEGER DEFAULT 0,
      viewing_requests INTEGER DEFAULT 0,
      brochure_downloads INTEGER DEFAULT 0,
      virtual_tour_views INTEGER DEFAULT 0,
      floor_plan_views INTEGER DEFAULT 0,
      phone_clicks INTEGER DEFAULT 0,
      email_clicks INTEGER DEFAULT 0,
      social_shares INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties_enhanced(id),
      FOREIGN KEY (development_id) REFERENCES developments_enhanced(id),
      UNIQUE(property_id, date)
    )
  `
};

/**
 * Create indexes for better query performance
 */
const indexDefinitions = [
  'CREATE INDEX IF NOT EXISTS idx_properties_development_id ON properties_enhanced(development_id)',
  'CREATE INDEX IF NOT EXISTS idx_properties_status ON properties_enhanced(status)',
  'CREATE INDEX IF NOT EXISTS idx_properties_price ON properties_enhanced(price)',
  'CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties_enhanced(bedrooms)',
  'CREATE INDEX IF NOT EXISTS idx_properties_type ON properties_enhanced(type)',
  'CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties_enhanced(slug)',
  'CREATE INDEX IF NOT EXISTS idx_developments_status ON developments_enhanced(status)',
  'CREATE INDEX IF NOT EXISTS idx_developments_location ON developments_enhanced(location)',
  'CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id)',
  'CREATE INDEX IF NOT EXISTS idx_property_features_property_id ON property_features(property_id)',
  'CREATE INDEX IF NOT EXISTS idx_floor_plans_development_id ON development_floor_plans(development_id)',
  'CREATE INDEX IF NOT EXISTS idx_enquiries_property_id ON property_enquiries(property_id)',
  'CREATE INDEX IF NOT EXISTS idx_enquiries_status ON property_enquiries(status)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON property_reservations(property_id)',
  'CREATE INDEX IF NOT EXISTS idx_reservations_status ON property_reservations(status)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_property_date ON property_analytics(property_id, date)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_development_date ON property_analytics(development_id, date)'
];

/**
 * Execute schema creation
 */
async function createComprehensivePropertySchema() {
  console.log('🚀 Creating Comprehensive Property Database Schema...\n');
  
  try {
    // Create all tables
    console.log('📋 Creating enhanced property tables...');
    
    for (const [tableName, schema] of Object.entries(schemaDefinitions)) {
      console.log(`   Creating table: ${tableName}`);
      await executeSQL(schema);
    }
    
    console.log('✅ All property tables created successfully\n');
    
    // Create indexes
    console.log('🔍 Creating performance indexes...');
    
    for (const index of indexDefinitions) {
      await executeSQL(index);
    }
    
    console.log('✅ All indexes created successfully\n');
    
    // Verify schema creation
    console.log('🔍 Verifying schema creation...');
    await verifySchemaCreation();
    
    console.log('🎉 Comprehensive Property Schema Creation Complete!\n');
    console.log('📊 Summary:');
    console.log(`   • Enhanced property tables: ${Object.keys(schemaDefinitions).length}`);
    console.log(`   • Performance indexes: ${indexDefinitions.length}`);
    console.log(`   • Features supported: Property management, enquiries, reservations, analytics`);
    console.log(`   • Database ready for: Real property data integration`);
    
  } catch (error) {
    console.error('💥 Schema creation failed:', error);
    throw error;
  }
}

/**
 * Execute SQL statement
 */
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

/**
 * Verify schema creation by checking table existence
 */
async function verifySchemaCreation() {
  const tables = Object.keys(schemaDefinitions);
  
  for (const tableName of tables) {
    const exists = await checkTableExists(tableName);
    if (exists) {
      console.log(`   ✅ ${tableName}: Created successfully`);
    } else {
      console.log(`   ❌ ${tableName}: Creation failed`);
    }
  }
}

/**
 * Check if table exists
 */
function checkTableExists(tableName) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
    
    db.get(sql, [tableName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
}

/**
 * Error handling and cleanup
 */
async function main() {
  try {
    await createComprehensivePropertySchema();
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

// Execute the schema creation
if (require.main === module) {
  main();
}

module.exports = {
  createComprehensivePropertySchema,
  schemaDefinitions,
  indexDefinitions
};