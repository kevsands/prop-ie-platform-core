3.2 PostgreSQL Schema for Financial Data
sql-- PostgreSQL Schema for Financial Data

-- Properties Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    address JSONB NOT NULL,
    base_price DECIMAL(12, 2) NOT NULL,
    current_price DECIMAL(12, 2) NOT NULL,
    price_history JSONB,
    status VARCHAR(50) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    development_id INT REFERENCES developments(id),
    floor_area DECIMAL(8, 2),
    bedrooms SMALLINT,
    bathrooms SMALLINT,
    features JSONB,
    estimated_completion_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Customization Financial Entries Table
CREATE TABLE customization_financials (
    id SERIAL PRIMARY KEY,
    customization_id VARCHAR(100) UNIQUE NOT NULL,
    property_id INT REFERENCES properties(id),
    user_id VARCHAR(100) NOT NULL,
    total_cost DECIMAL(12, 2) NOT NULL,
    margin_amount DECIMAL(12, 2),
    margin_percentage DECIMAL(5, 2),
    status VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50),
    payment_schedule JSONB,
    contract_status VARCHAR(50),
    contract_addendum_id VARCHAR(100),
    finalized_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Customization Line Items Table
CREATE TABLE customization_line_items (
    id SERIAL PRIMARY KEY,
    customization_financial_id INT REFERENCES customization_financials(id),
    option_id VARCHAR(100) NOT NULL,
    option_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    margin_amount DECIMAL(10, 2),
    margin_percentage DECIMAL(5, 2),
    room VARCHAR(100),
    category VARCHAR(100),
    supplier_id VARCHAR(100),
    purchase_order_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Property Price Modifications Table
CREATE TABLE property_price_modifications (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(id),
    previous_price DECIMAL(12, 2) NOT NULL,
    new_price DECIMAL(12, 2) NOT NULL,
    modification_amount DECIMAL(12, 2) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    reference_id VARCHAR(100),
    reference_type VARCHAR(50),
    authorized_by VARCHAR(100),
    effective_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Supplier Costs Table
CREATE TABLE supplier_costs (
    id SERIAL PRIMARY KEY,
    supplier_id VARCHAR(100) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    retail_price DECIMAL(10, 2) NOT NULL,
    margin_percentage DECIMAL(5, 2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    volume_discount_tiers JSONB,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(supplier_id, item_id, effective_from)
);

-- Invoice Table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    property_id INT REFERENCES properties(id),
    user_id VARCHAR(100) NOT NULL,
    customization_financial_id INT REFERENCES customization_financials(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    issued_date DATE NOT NULL,
    paid_date DATE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_development_id ON properties(development_id);
CREATE INDEX idx_customization_financials_user_id ON customization_financials(user_id);
CREATE INDEX idx_customization_financials_property_id ON customization_financials(property_id);
CREATE INDEX idx_customization_financials_status ON customization_financials(status);
CREATE INDEX idx_customization_line_items_customization_id ON customization_line_items(customization_financial_id);
CREATE INDEX idx_property_price_modifications_property_id ON property_price_modifications(property_id);
CREATE INDEX idx_supplier_costs_item_id ON supplier_costs(item_id);
CREATE INDEX idx_invoices_property_id ON invoices(property_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);