
-- PROP.ie Staging Test Data
-- Comprehensive test data for staging environment

-- Test Properties
INSERT INTO properties (id, title, address, price, status, developer_id, property_type, bedrooms, bathrooms, size_sqm, ber_rating, created_at) VALUES
('staging-prop-1', 'Staging Test Property - Dublin 2', '123 Test Street, Dublin 2', 450000, 'available', 'staging-dev-1', 'apartment', 2, 2, 85, 'B2', NOW()),
('staging-prop-2', 'Staging Test House - Cork', '456 Sample Avenue, Cork', 320000, 'available', 'staging-dev-1', 'house', 3, 2, 120, 'B1', NOW()),
('staging-prop-3', 'Staging Premium Apartment - Galway', '789 Demo Road, Galway', 380000, 'reserved', 'staging-dev-2', 'apartment', 2, 1, 75, 'A3', NOW());

-- Test Users
INSERT INTO users (id, email, first_name, last_name, role, status, created_at) VALUES
('staging-buyer-1', 'buyer.test@staging.prop.ie', 'John', 'TestBuyer', 'first-time-buyer', 'active', NOW()),
('staging-developer-1', 'developer.test@staging.prop.ie', 'Sarah', 'TestDeveloper', 'developer', 'active', NOW()),
('staging-agent-1', 'agent.test@staging.prop.ie', 'Mike', 'TestAgent', 'estate-agent', 'active', NOW()),
('staging-admin-1', 'admin.test@staging.prop.ie', 'Admin', 'TestUser', 'admin', 'active', NOW());

-- Test Projects
INSERT INTO projects (id, name, description, developer_id, location, total_units, price_range_min, price_range_max, completion_date, status) VALUES
('staging-project-1', 'Staging Gardens Development', 'Test development for staging environment', 'staging-developer-1', 'Dublin 4', 50, 400000, 650000, '2025-12-31', 'active'),
('staging-project-2', 'Test Valley Homes', 'Sample residential project', 'staging-developer-1', 'Cork City', 30, 280000, 420000, '2026-06-30', 'planning');

-- Test Transactions
INSERT INTO transactions (id, property_id, buyer_id, status, amount, transaction_type, created_at) VALUES
('staging-txn-1', 'staging-prop-1', 'staging-buyer-1', 'pending', 450000, 'purchase', NOW()),
('staging-txn-2', 'staging-prop-2', 'staging-buyer-1', 'draft', 320000, 'reservation', NOW());

-- Test HTB Applications
INSERT INTO htb_applications (id, user_id, property_id, application_amount, status, submitted_at) VALUES
('staging-htb-1', 'staging-buyer-1', 'staging-prop-1', 135000, 'submitted', NOW()),
('staging-htb-2', 'staging-buyer-1', 'staging-prop-2', 96000, 'draft', NOW());

-- Test Analytics Data
INSERT INTO analytics_events (id, event_type, user_id, property_id, metadata, created_at) VALUES
('staging-event-1', 'property_view', 'staging-buyer-1', 'staging-prop-1', '{"source": "search", "time_spent": 120}', NOW()),
('staging-event-2', 'property_favorite', 'staging-buyer-1', 'staging-prop-1', '{"action": "add"}', NOW()),
('staging-event-3', 'property_inquiry', 'staging-buyer-1', 'staging-prop-2', '{"message": "Staging test inquiry"}', NOW());

-- Staging-specific metadata
INSERT INTO staging_metadata (key, value, description, created_at) VALUES
('environment', 'staging', 'Current environment identifier', NOW()),
('test_data_version', '1.0.0', 'Version of staging test data', NOW()),
('last_refresh', NOW()::text, 'Last time staging data was refreshed', NOW()),
('staging_features', '{"mock_auth": true, "test_payments": true, "debug_mode": true}', 'Enabled staging features', NOW());

COMMENT ON TABLE staging_metadata IS 'Staging environment configuration and metadata';
