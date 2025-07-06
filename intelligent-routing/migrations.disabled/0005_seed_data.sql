-- Seed data for PropIE AWS Platform
-- PostgreSQL 13+ compatible

BEGIN;

-- Insert basic permissions
INSERT INTO permissions (name, description)
VALUES
    ('user.create', 'Create new users'),
    ('user.read', 'View user information'),
    ('user.update', 'Update user information'),
    ('user.delete', 'Delete users'),
    ('development.create', 'Create new development projects'),
    ('development.read', 'View development information'),
    ('development.update', 'Update development information'),
    ('development.delete', 'Delete developments'),
    ('unit.create', 'Create new housing units'),
    ('unit.read', 'View unit information'),
    ('unit.update', 'Update unit information'),
    ('unit.delete', 'Delete units'),
    ('sale.create', 'Create new sales'),
    ('sale.read', 'View sale information'),
    ('sale.update', 'Update sale information'),
    ('sale.delete', 'Delete sales'),
    ('document.create', 'Create new documents'),
    ('document.read', 'View documents'),
    ('document.update', 'Update documents'),
    ('document.delete', 'Delete documents'),
    ('finance.view', 'View financial information'),
    ('finance.create', 'Create financial records'),
    ('finance.update', 'Update financial information'),
    ('finance.delete', 'Delete financial records'),
    ('htb.process', 'Process Help to Buy claims'),
    ('analytics.view', 'View analytics and reports'),
    ('admin.access', 'Access admin panel'),
    ('customization.create', 'Create customization options'),
    ('customization.update', 'Update customization options'),
    ('customization.delete', 'Delete customization options'),
    ('security.manage', 'Manage security settings');

-- Assign permissions to roles
-- ADMIN role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'ADMIN', id FROM permissions;

-- DEVELOPER role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'DEVELOPER', id FROM permissions WHERE name IN (
    'user.read',
    'development.create', 'development.read', 'development.update',
    'unit.create', 'unit.read', 'unit.update', 'unit.delete',
    'sale.read', 'sale.update',
    'document.create', 'document.read', 'document.update',
    'finance.view', 'finance.create', 'finance.update',
    'htb.process',
    'analytics.view',
    'customization.create', 'customization.update', 'customization.delete'
);

-- BUYER role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'BUYER', id FROM permissions WHERE name IN (
    'development.read',
    'unit.read',
    'sale.read',
    'document.read',
    'document.create'
);

-- AGENT role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'AGENT', id FROM permissions WHERE name IN (
    'user.read',
    'development.read',
    'unit.read',
    'sale.create', 'sale.read', 'sale.update',
    'document.read', 'document.create',
    'customization.read'
);

-- SOLICITOR role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'SOLICITOR', id FROM permissions WHERE name IN (
    'development.read',
    'unit.read',
    'sale.read', 'sale.update',
    'document.read', 'document.create', 'document.update'
);

-- INVESTOR role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'INVESTOR', id FROM permissions WHERE name IN (
    'development.read',
    'unit.read',
    'finance.view',
    'analytics.view'
);

-- Demo admin user
INSERT INTO users (
    email, first_name, last_name, phone, role, status, kyc_status,
    two_factor_enabled, terms_accepted, terms_accepted_at
)
VALUES (
    'admin@propie.example', 'Admin', 'User', '+35312345678', 'ADMIN', 'ACTIVE', 'VERIFIED',
    TRUE, TRUE, NOW()
);

-- Demo developer user
INSERT INTO users (
    email, first_name, last_name, phone, role, status, kyc_status,
    two_factor_enabled, terms_accepted, terms_accepted_at
)
VALUES (
    'developer@propie.example', 'Developer', 'User', '+35312345679', 'DEVELOPER', 'ACTIVE', 'VERIFIED',
    TRUE, TRUE, NOW()
);

-- Demo buyer user
INSERT INTO users (
    email, first_name, last_name, phone, role, status, kyc_status,
    two_factor_enabled, terms_accepted, terms_accepted_at
)
VALUES (
    'buyer@propie.example', 'Buyer', 'User', '+35312345680', 'BUYER', 'ACTIVE', 'VERIFIED',
    FALSE, TRUE, NOW()
);

-- Demo agent user
INSERT INTO users (
    email, first_name, last_name, phone, role, status, kyc_status,
    two_factor_enabled, terms_accepted, terms_accepted_at
)
VALUES (
    'agent@propie.example', 'Agent', 'User', '+35312345681', 'AGENT', 'ACTIVE', 'VERIFIED',
    FALSE, TRUE, NOW()
);

-- Demo solicitor user
INSERT INTO users (
    email, first_name, last_name, phone, role, status, kyc_status,
    two_factor_enabled, terms_accepted, terms_accepted_at
)
VALUES (
    'solicitor@propie.example', 'Solicitor', 'User', '+35312345682', 'SOLICITOR', 'ACTIVE', 'VERIFIED',
    FALSE, TRUE, NOW()
);

-- Demo investor user
INSERT INTO users (
    email, first_name, last_name, phone, role, status, kyc_status,
    two_factor_enabled, terms_accepted, terms_accepted_at
)
VALUES (
    'investor@propie.example', 'Investor', 'User', '+35312345683', 'INVESTOR', 'ACTIVE', 'VERIFIED',
    TRUE, TRUE, NOW()
);

-- Sample location
INSERT INTO locations (
    address_line_1, city, postal_code, country, latitude, longitude, geocoded
)
VALUES (
    '123 Development Street', 'Dublin', 'D01 ABC1', 'Ireland', 53.3498, -6.2603, TRUE
);

-- Sample development
INSERT INTO developments (
    name, code, description, status, developer_id, location_id,
    total_units, available_units, build_start_date, build_end_date,
    sales_start_date, estimated_completion_date
)
VALUES (
    'Fitzgerald Gardens', 'FG001', 
    'A premium residential development featuring modern homes with sustainable design and community amenities.',
    'UNDER_CONSTRUCTION', 
    (SELECT id FROM users WHERE email = 'developer@propie.example'), 
    (SELECT id FROM locations WHERE address_line_1 = '123 Development Street'),
    50, 50, 
    '2024-01-15', '2025-06-30', 
    '2024-03-01', '2025-06-30'
);

-- Sample development timelines
INSERT INTO development_timelines (
    development_id, name, description, start_date, end_date, status
)
VALUES (
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Planning Phase', 'Initial planning and design phase', 
    '2023-10-01', '2023-12-31', 'COMPLETED'
),
(
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Construction Phase 1', 'Foundation and structural work', 
    '2024-01-15', '2024-05-31', 'IN_PROGRESS'
),
(
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Construction Phase 2', 'Interior work and finishing', 
    '2024-06-01', '2024-12-31', 'PENDING'
),
(
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Sales Phase', 'Units available for purchase', 
    '2024-03-01', '2025-06-30', 'IN_PROGRESS'
),
(
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Completion and Handover', 'Final inspections and unit handovers', 
    '2025-01-01', '2025-06-30', 'PENDING'
);

-- Sample unit (Type A)
INSERT INTO units (
    development_id, name, unit_number, description, type, status,
    bedrooms, bathrooms, total_area, indoor_area, outdoor_area,
    parking_spaces, base_price, current_price, deposit_percentage,
    completion_percentage, estimated_completion_date
)
VALUES (
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Type A - 3 Bedroom Semi-Detached', 'A1', 
    'Spacious 3-bedroom semi-detached home with modern finishes and garden.',
    'HOUSE', 'UNDER_CONSTRUCTION',
    3, 2, 125.00, 110.00, 15.00, 
    1, 425000.00, 425000.00, 10.00,
    35, '2025-03-15'
),
(
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Type A - 3 Bedroom Semi-Detached', 'A2', 
    'Spacious 3-bedroom semi-detached home with modern finishes and garden.',
    'HOUSE', 'UNDER_CONSTRUCTION',
    3, 2, 125.00, 110.00, 15.00, 
    1, 425000.00, 425000.00, 10.00,
    35, '2025-03-15'
);

-- Sample unit (Type B)
INSERT INTO units (
    development_id, name, unit_number, description, type, status,
    bedrooms, bathrooms, total_area, indoor_area, outdoor_area,
    parking_spaces, base_price, current_price, deposit_percentage,
    completion_percentage, estimated_completion_date
)
VALUES (
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Type B - 4 Bedroom Detached', 'B1', 
    'Luxurious 4-bedroom detached home with premium finishes and large garden.',
    'HOUSE', 'UNDER_CONSTRUCTION',
    4, 3, 170.00, 150.00, 20.00, 
    2, 550000.00, 550000.00, 10.00,
    30, '2025-04-30'
);

-- Sample unit (Type C)
INSERT INTO units (
    development_id, name, unit_number, description, type, status,
    bedrooms, bathrooms, total_area, indoor_area, outdoor_area,
    parking_spaces, base_price, current_price, deposit_percentage,
    completion_percentage, estimated_completion_date
)
VALUES (
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Type C - 2 Bedroom Apartment', 'C1', 
    'Modern 2-bedroom apartment with balcony and open-plan living area.',
    'APARTMENT', 'UNDER_CONSTRUCTION',
    2, 2, 85.00, 80.00, 5.00, 
    1, 325000.00, 325000.00, 10.00,
    40, '2025-02-28'
),
(
    (SELECT id FROM developments WHERE code = 'FG001'),
    'Type C - 2 Bedroom Apartment', 'C2', 
    'Modern 2-bedroom apartment with balcony and open-plan living area.',
    'APARTMENT', 'UNDER_CONSTRUCTION',
    2, 2, 85.00, 80.00, 5.00, 
    1, 325000.00, 325000.00, 10.00,
    40, '2025-02-28'
);

-- Sample unit rooms for Type A
INSERT INTO unit_rooms (
    unit_id, name, type, area, dimensions
)
VALUES (
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'Living Room', 'LIVING', 25.00, '{"width": 5.0, "length": 5.0, "height": 2.7}'
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'Kitchen/Dining', 'KITCHEN', 20.00, '{"width": 5.0, "length": 4.0, "height": 2.7}'
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'Master Bedroom', 'BEDROOM', 16.00, '{"width": 4.0, "length": 4.0, "height": 2.7}'
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'Bedroom 2', 'BEDROOM', 12.00, '{"width": 3.0, "length": 4.0, "height": 2.7}'
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'Bedroom 3', 'BEDROOM', 10.00, '{"width": 2.5, "length": 4.0, "height": 2.7}'
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'Main Bathroom', 'BATHROOM', 6.00, '{"width": 2.0, "length": 3.0, "height": 2.7}'
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'En-suite', 'BATHROOM', 4.00, '{"width": 2.0, "length": 2.0, "height": 2.7}'
);

-- Sample customization options for Type A
INSERT INTO unit_customization_options (
    unit_id, category, name, description, price, is_default
)
VALUES (
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'KITCHEN', 'Standard Kitchen', 'High-quality fitted kitchen with standard appliances', 0.00, TRUE
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'KITCHEN', 'Premium Kitchen', 'Luxury fitted kitchen with premium appliances and island', 8500.00, FALSE
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'FLOORING', 'Standard Flooring', 'Quality laminate flooring throughout', 0.00, TRUE
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'FLOORING', 'Premium Hardwood', 'Premium hardwood flooring throughout living areas', 6500.00, FALSE
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'BATHROOM', 'Standard Bathroom', 'Modern bathroom suite with standard fixtures', 0.00, TRUE
),
(
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'BATHROOM', 'Premium Bathroom', 'Luxury bathroom with premium fixtures and tiling', 4500.00, FALSE
);

-- Sample development finance
INSERT INTO development_finance (
    development_id, total_budget, total_cost_to_date, projected_profit, projected_margin,
    currency, reporting_period_start, reporting_period_end
)
VALUES (
    (SELECT id FROM developments WHERE code = 'FG001'),
    18500000.00, 6500000.00, 4500000.00, 20.00,
    'EUR', '2024-01-01', '2024-12-31'
);

-- Sample funding sources
INSERT INTO funding_sources (
    development_finance_id, name, type, provider, total_amount,
    interest_rate, start_date, end_date, currency
)
VALUES (
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Primary Development Loan', 'DEVELOPMENT_LOAN', 'First National Bank', 15000000.00,
    4.5, '2023-12-01', '2025-12-31', 'EUR'
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Equity Investment', 'EQUITY_INVESTMENT', 'Property Ventures Ltd', 3500000.00,
    NULL, '2023-11-01', '2025-12-31', 'EUR'
);

-- Sample budget categories
INSERT INTO budget_categories (
    development_finance_id, name, description, display_order
)
VALUES (
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Land Acquisition', 'Costs related to purchasing the development site', 1
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Construction', 'Direct construction costs', 2
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Professional Fees', 'Architecture, engineering, and consulting fees', 3
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Marketing & Sales', 'Marketing campaigns and sales commissions', 4
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Finance Costs', 'Loan interest and financing fees', 5
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Contingency', 'Reserve for unexpected costs', 6
);

-- Sample budget items
INSERT INTO development_budget (
    development_finance_id, category_id, name, description, 
    budgeted_amount, actual_amount, is_fixed_cost, contingency_percentage, display_order
)
VALUES (
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Land Acquisition' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Land Purchase', 'Purchase of development site', 
    5000000.00, 5000000.00, TRUE, 0.00, 1
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Construction' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Foundation Work', 'Site preparation and foundation construction', 
    1800000.00, 1750000.00, FALSE, 5.00, 1
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Construction' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Structural Work', 'Structural framework construction', 
    3500000.00, 1200000.00, FALSE, 5.00, 2
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Construction' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Finishing Work', 'Interior and exterior finishing', 
    4000000.00, 0.00, FALSE, 7.50, 3
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Professional Fees' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Architectural Fees', 'Architectural design and consultation', 
    750000.00, 600000.00, TRUE, 0.00, 1
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Marketing & Sales' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Marketing Campaign', 'Advertising and promotional activities', 
    500000.00, 250000.00, FALSE, 10.00, 1
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Finance Costs' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'Loan Interest', 'Interest payments on development loan', 
    1350000.00, 450000.00, FALSE, 0.00, 1
),
(
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    (SELECT id FROM budget_categories WHERE name = 'Contingency' AND development_finance_id = (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001'))),
    'General Contingency', 'Reserve for unexpected costs', 
    1000000.00, 0.00, FALSE, 0.00, 1
);

-- Sample cash flow categories
INSERT INTO cash_flow_categories (name, type, display_order)
VALUES 
    ('Unit Sales', 'INFLOW', 1),
    ('Customization Income', 'INFLOW', 2),
    ('Loan Drawdowns', 'INFLOW', 3),
    ('Equity Investments', 'INFLOW', 4),
    ('Land Costs', 'OUTFLOW', 1),
    ('Construction Costs', 'OUTFLOW', 2),
    ('Professional Fees', 'OUTFLOW', 3),
    ('Marketing Expenses', 'OUTFLOW', 4),
    ('Loan Repayments', 'OUTFLOW', 5),
    ('Administrative Costs', 'OUTFLOW', 6);

-- Sample cash flow projection
INSERT INTO cash_flow_projections (
    development_finance_id, name, description, 
    start_date, end_date, period_type, currency, is_approved
)
VALUES (
    (SELECT id FROM development_finance WHERE development_id = (SELECT id FROM developments WHERE code = 'FG001')),
    'Standard Projection', 'Standard monthly cash flow projection for Fitzgerald Gardens', 
    '2024-01-01', '2025-12-31', 'MONTHLY', 'EUR', TRUE
);

-- Sample document workflow
INSERT INTO document_workflows (
    name, description, entity_type, required_documents
)
VALUES (
    'Sales Process Documents', 
    'Standard documents required during the sales process', 
    'SALE', 
    '["CONTRACT", "BROCHURE", "FLOOR_PLAN", "SPECIFICATION", "TERMS_AND_CONDITIONS"]'
);

-- Sample document workflow progress
INSERT INTO document_workflow_progress (
    workflow_id, entity_id, status, completed_documents, percentage_complete
)
VALUES (
    (SELECT id FROM document_workflows WHERE name = 'Sales Process Documents'),
    (SELECT id FROM units WHERE unit_number = 'A1'),
    'IN_PROGRESS',
    '[]',
    0
);

COMMIT;