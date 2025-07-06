-- PropIE Platform v3 - Sample Data
-- Sample data for testing and demo purposes

-- Insert sample locations
INSERT INTO locations (id, address, city, county, eircode, created_at) VALUES
('loc-001', 'Phoenix Park, Dublin', 'Dublin', 'Dublin', 'D02', NOW()),
('loc-002', 'Cork Harbour, Cork', 'Cork', 'Cork', 'T12', NOW()),
('loc-003', 'Galway Bay, Galway', 'Galway', 'Galway', 'H91', NOW()),
('loc-004', 'Limerick City Centre', 'Limerick', 'Limerick', 'V94', NOW()),
('loc-005', 'Waterford Riverside', 'Waterford', 'Waterford', 'X91', NOW()),
('loc-006', 'Kilkenny Castle Area', 'Kilkenny', 'Kilkenny', 'R95', NOW()),
('loc-007', 'Drogheda Town Centre', 'Drogheda', 'Louth', 'A92', NOW()),
('loc-008', 'Dundalk Bay Area', 'Dundalk', 'Louth', 'A91', NOW());

-- Insert sample developers as users first
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, location_id, status, kyc_status, organization, position, created_at) VALUES
('dev-user-001', 'dublin@developments.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dublin', 'Developments', '+353851111001', 'loc-001', 'ACTIVE', 'APPROVED', 'Dublin Developments Ltd', 'Director', NOW()),
('dev-user-002', 'munster@properties.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Munster', 'Properties', '+353851111002', 'loc-002', 'ACTIVE', 'APPROVED', 'Munster Properties', 'Director', NOW()),
('dev-user-003', 'atlantic@homes.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Atlantic', 'Homes', '+353851111003', 'loc-003', 'ACTIVE', 'APPROVED', 'Atlantic Homes', 'Director', NOW()),
('dev-user-004', 'shannon@development.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Shannon', 'Development', '+353851111004', 'loc-004', 'ACTIVE', 'APPROVED', 'Shannon Development Group', 'Director', NOW()),
('dev-user-005', 'suir@valley.ie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Suir', 'Valley', '+353851111005', 'loc-005', 'ACTIVE', 'APPROVED', 'Suir Valley Homes', 'Director', NOW());

-- Insert sample developments
INSERT INTO developments (id, name, slug, developer_id, location_id, description, status, total_units, website_url, is_published, published_at, created_at) VALUES
('dev-001', 'Phoenix Park Residences', 'phoenix-park-residences', 'dev-user-001', 'loc-001', 'Luxury apartments overlooking Phoenix Park with modern amenities and excellent transport links.', 'SELLING', 120, 'https://phoenixpark.ie', 1, NOW(), NOW()),
('dev-002', 'Cork Harbour Views', 'cork-harbour-views', 'dev-user-002', 'loc-002', 'Contemporary waterfront development with stunning harbour views and premium finishes.', 'SELLING', 85, 'https://corkviews.ie', 1, NOW(), NOW()),
('dev-003', 'Galway Bay Gardens', 'galway-bay-gardens', 'dev-user-003', 'loc-003', 'Sustainable family homes in a peaceful setting near Galway Bay with excellent schools nearby.', 'SELLING', 60, 'https://galwaygardens.ie', 1, NOW(), NOW()),
('dev-004', 'Limerick City Central', 'limerick-city-central', 'dev-user-004', 'loc-004', 'Modern urban living in the heart of Limerick with retail and office spaces.', 'SELLING', 95, 'https://limerickcentral.ie', 1, NOW(), NOW()),
('dev-005', 'Waterford Riverside', 'waterford-riverside', 'dev-user-005', 'loc-005', 'Riverside apartments and townhouses with beautiful river views and walking trails.', 'PLANNING', 70, 'https://waterfordriverside.ie', 1, NOW(), NOW());

-- Insert sample properties
INSERT INTO properties (id, title, slug, property_type, development_id, location_id, price, bedrooms, bathrooms, floor_area_sqm, ber_rating, description, status, is_featured, is_published, published_at, created_at) VALUES
('prop-001', 'Phoenix Park 2-Bed Apartment', 'phoenix-park-2-bed-apartment', 'APARTMENT', 'dev-001', 'loc-001', 425000, 2, 2, 75, 'A3', 'Stunning 2-bedroom apartment with park views, modern kitchen, and private balcony. Perfect for first-time buyers with Help-to-Buy eligibility.', 'AVAILABLE', 1, 1, NOW(), NOW()),
('prop-002', 'Phoenix Park 3-Bed Apartment', 'phoenix-park-3-bed-apartment', 'APARTMENT', 'dev-001', 'loc-001', 495000, 3, 2, 95, 'A2', 'Spacious 3-bedroom apartment with premium finishes, two bathrooms, and large living area overlooking Phoenix Park.', 'AVAILABLE', 1, 1, NOW(), NOW()),
('prop-003', 'Cork Harbour 1-Bed Studio', 'cork-harbour-1-bed-studio', 'APARTMENT', 'dev-002', 'loc-002', 285000, 1, 1, 55, 'A3', 'Modern studio apartment with harbour views, perfect for young professionals or investors. HTB eligible.', 'AVAILABLE', 0, 1, NOW(), NOW()),
('prop-004', 'Cork Harbour 2-Bed Penthouse', 'cork-harbour-2-bed-penthouse', 'APARTMENT', 'dev-002', 'loc-002', 650000, 2, 2, 110, 'A1', 'Luxury penthouse with panoramic harbour views, premium appliances, and private terrace.', 'AVAILABLE', 1, 1, NOW(), NOW()),
('prop-005', 'Galway Bay Family Home', 'galway-bay-family-home', 'HOUSE', 'dev-003', 'loc-003', 385000, 3, 2, 120, 'A3', 'Beautiful 3-bedroom family home with garden, driveway, and walking distance to schools. HTB eligible.', 'AVAILABLE', 1, 1, NOW(), NOW()),
('prop-006', 'Galway Bay 4-Bed House', 'galway-bay-4-bed-house', 'HOUSE', 'dev-003', 'loc-003', 475000, 4, 3, 145, 'A2', 'Spacious 4-bedroom family home with large garden, modern kitchen, and double garage. Perfect for growing families.', 'AVAILABLE', 0, 1, NOW(), NOW()),
('prop-007', 'Limerick City 2-Bed Duplex', 'limerick-city-2-bed-duplex', 'DUPLEX', 'dev-004', 'loc-004', 325000, 2, 2, 85, 'A3', 'Contemporary duplex in city center with roof terrace, modern amenities, and excellent transport links.', 'AVAILABLE', 1, 1, NOW(), NOW()),
('prop-008', 'Limerick City 3-Bed Townhouse', 'limerick-city-3-bed-townhouse', 'TOWNHOUSE', 'dev-004', 'loc-004', 395000, 3, 2, 105, 'A2', 'Stylish townhouse with private garden, modern kitchen, and close to shops and restaurants.', 'AVAILABLE', 0, 1, NOW(), NOW()),
('prop-009', 'Waterford River View Apartment', 'waterford-river-view-apartment', 'APARTMENT', 'dev-005', 'loc-005', 315000, 2, 1, 70, 'A3', 'Bright 2-bedroom apartment with river views, balcony, and access to riverside walking trails.', 'AVAILABLE', 1, 1, NOW(), NOW()),
('prop-010', 'Dublin City Center Studio', 'dublin-city-center-studio', 'APARTMENT', NULL, 'loc-001', 275000, 1, 1, 45, 'B1', 'Compact city center studio perfect for professionals, walking distance to all amenities.', 'AVAILABLE', 0, 1, NOW(), NOW()),
('prop-011', 'Cork Suburban House', 'cork-suburban-house', 'HOUSE', NULL, 'loc-002', 445000, 3, 2, 115, 'A3', 'Family home in quiet suburban area with garden, garage, and excellent schools nearby.', 'AVAILABLE', 0, 1, NOW(), NOW()),
('prop-012', 'Galway Student Accommodation', 'galway-student-accommodation', 'APARTMENT', NULL, 'loc-003', 225000, 1, 1, 40, 'B2', 'Purpose-built student accommodation near NUIG, ideal for investment or student living.', 'AVAILABLE', 0, 1, NOW(), NOW());

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, location_id, status, kyc_status, created_at) VALUES
('user-002', 'john.buyer@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Buyer', '+353851234568', 'loc-001', 'ACTIVE', 'PENDING_REVIEW', NOW()),
('user-003', 'mary.developer@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mary', 'Developer', '+353851234569', 'loc-002', 'ACTIVE', 'APPROVED', NOW()),
('user-004', 'sarah.investor@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Investor', '+353851234570', 'loc-003', 'ACTIVE', 'APPROVED', NOW());

-- Insert user roles
INSERT INTO user_roles (id, user_id, role, assigned_at) VALUES
('role-001', 'dev-user-001', 'ADMIN', NOW()),
('role-002', 'dev-user-001', 'DEVELOPER', NOW()),
('role-003', 'user-002', 'BUYER', NOW()),
('role-004', 'user-003', 'DEVELOPER', NOW()),
('role-005', 'user-004', 'INVESTOR', NOW()),
('role-006', 'user-004', 'BUYER', NOW()),
('role-007', 'dev-user-002', 'DEVELOPER', NOW()),
('role-008', 'dev-user-003', 'DEVELOPER', NOW()),
('role-009', 'dev-user-004', 'DEVELOPER', NOW()),
('role-010', 'dev-user-005', 'DEVELOPER', NOW());

-- Insert sample HTB applications
INSERT INTO htb_applications (id, user_id, property_id, property_price, annual_income, is_first_time_buyer, is_owner_occupier, relief_amount, application_status, submission_date, created_at) VALUES
('htb-001', 'user-002', 'prop-001', 425000, 65000, 1, 1, 30000, 'SUBMITTED', NOW(), NOW()),
('htb-002', 'user-002', 'prop-005', 385000, 65000, 1, 1, 30000, 'APPROVED', NOW(), NOW());

-- Insert sample transactions
INSERT INTO transactions (id, property_id, buyer_id, seller_id, transaction_type, amount, status, booking_deposit, closing_date, created_at) VALUES
('txn-001', 'prop-001', 'user-002', 'user-003', 'PURCHASE', 425000, 'PENDING', 5000, DATE_ADD(NOW(), INTERVAL 60 DAY), NOW()),
('txn-002', 'prop-005', 'user-004', 'user-003', 'RESERVATION', 385000, 'RESERVED', 2000, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW());

-- Update property image URLs (placeholder)
UPDATE properties SET 
main_image_url = '/assets/images/placeholder-property.jpg'
WHERE id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005', 'prop-006', 'prop-007', 'prop-008', 'prop-009', 'prop-010', 'prop-011', 'prop-012');