-- Financial database schema for PropIE AWS Platform
-- PostgreSQL 13+ compatible

BEGIN;

-- Enable necessary extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Audit timestamp function if not already created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_modified_column') THEN
        CREATE OR REPLACE FUNCTION update_modified_column() 
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    END IF;
END$$;

-- Currency enum
CREATE TYPE currency_code AS ENUM (
    'EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'SEK', 'NZD'
);

-- Transaction status enum
CREATE TYPE transaction_status AS ENUM (
    'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'AUTHORIZED'
);

-- Transaction type enum
CREATE TYPE transaction_type AS ENUM (
    'DEPOSIT', 'PAYMENT', 'REFUND', 'FEE', 'ADJUSTMENT', 'TRANSFER', 'CHARGE', 'CREDIT'
);

-- Payment method enum
CREATE TYPE payment_method AS ENUM (
    'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK', 'DIRECT_DEBIT'
);

-- Funding type enum
CREATE TYPE funding_type AS ENUM (
    'DEVELOPMENT_LOAN', 'EQUITY_INVESTMENT', 'MEZZANINE_FINANCE', 'GRANT', 'INTERNAL_FUNDING'
);

-- Financial period types
CREATE TYPE financial_period AS ENUM (
    'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'
);

---------------------
-- DEVELOPMENT FINANCE --
---------------------

-- Development Finance
CREATE TABLE "development_finance" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_id" UUID NOT NULL REFERENCES "developments"("id") ON DELETE CASCADE,
    "total_budget" DECIMAL(15, 2) NOT NULL,
    "total_cost_to_date" DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "projected_profit" DECIMAL(15, 2),
    "projected_margin" DECIMAL(5, 2),
    "currency" currency_code NOT NULL DEFAULT 'EUR',
    "last_updated_by" UUID REFERENCES "users"("id"),
    "reporting_period_start" DATE,
    "reporting_period_end" DATE,
    "financial_summary" JSONB,
    "is_locked" BOOLEAN NOT NULL DEFAULT FALSE,
    "locked_by" UUID REFERENCES "users"("id"),
    "locked_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_id")
);

-- Funding Sources
CREATE TABLE "funding_sources" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "type" funding_type NOT NULL,
    "provider" VARCHAR(255),
    "contact_name" VARCHAR(255),
    "contact_email" VARCHAR(255),
    "total_amount" DECIMAL(15, 2) NOT NULL,
    "interest_rate" DECIMAL(5, 3),
    "fee_amount" DECIMAL(12, 2),
    "fee_percentage" DECIMAL(5, 2),
    "start_date" DATE,
    "end_date" DATE,
    "drawdown_schedule" JSONB,
    "repayment_schedule" JSONB,
    "terms_summary" TEXT,
    "documents" JSONB, -- References to document IDs
    "currency" currency_code NOT NULL DEFAULT 'EUR',
    "is_secured" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Drawdowns
CREATE TABLE "drawdowns" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "funding_source_id" UUID NOT NULL REFERENCES "funding_sources"("id") ON DELETE CASCADE,
    "amount" DECIMAL(15, 2) NOT NULL,
    "date" DATE NOT NULL,
    "reference" VARCHAR(100),
    "description" TEXT,
    "status" transaction_status NOT NULL DEFAULT 'PENDING',
    "completed_date" TIMESTAMP WITH TIME ZONE,
    "approved_by" UUID REFERENCES "users"("id"),
    "notes" TEXT,
    "documents" JSONB, -- References to document IDs
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Repayments
CREATE TABLE "repayments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "funding_source_id" UUID NOT NULL REFERENCES "funding_sources"("id") ON DELETE CASCADE,
    "amount" DECIMAL(15, 2) NOT NULL,
    "interest_amount" DECIMAL(12, 2),
    "principal_amount" DECIMAL(12, 2),
    "date" DATE NOT NULL,
    "reference" VARCHAR(100),
    "description" TEXT,
    "status" transaction_status NOT NULL DEFAULT 'PENDING',
    "completed_date" TIMESTAMP WITH TIME ZONE,
    "payment_method" payment_method,
    "notes" TEXT,
    "documents" JSONB, -- References to document IDs
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-----------------------
-- BUDGETING SYSTEM --
-----------------------

-- Budget Categories
CREATE TABLE "budget_categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "parent_id" UUID REFERENCES "budget_categories"("id"),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "name", "parent_id")
);

-- Development Budget
CREATE TABLE "development_budget" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "category_id" UUID NOT NULL REFERENCES "budget_categories"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "budgeted_amount" DECIMAL(15, 2) NOT NULL,
    "actual_amount" DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "variance_amount" DECIMAL(15, 2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
    "variance_percentage" DECIMAL(5, 2) GENERATED ALWAYS AS (CASE WHEN budgeted_amount <> 0 THEN ((budgeted_amount - actual_amount) / budgeted_amount) * 100 ELSE 0 END) STORED,
    "is_fixed_cost" BOOLEAN NOT NULL DEFAULT FALSE,
    "cost_per_unit" DECIMAL(12, 2),
    "contingency_percentage" DECIMAL(5, 2) DEFAULT 0,
    "contingency_amount" DECIMAL(12, 2) GENERATED ALWAYS AS (budgeted_amount * (contingency_percentage / 100)) STORED,
    "forecast_to_complete" DECIMAL(15, 2),
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "category_id", "name")
);

-- Budget Revisions
CREATE TABLE "budget_revisions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "revision_number" INTEGER NOT NULL,
    "revision_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "revised_by" UUID REFERENCES "users"("id"),
    "previous_budget_total" DECIMAL(15, 2) NOT NULL,
    "new_budget_total" DECIMAL(15, 2) NOT NULL,
    "variance_amount" DECIMAL(15, 2) GENERATED ALWAYS AS (new_budget_total - previous_budget_total) STORED,
    "variance_percentage" DECIMAL(5, 2) GENERATED ALWAYS AS (CASE WHEN previous_budget_total <> 0 THEN ((new_budget_total - previous_budget_total) / previous_budget_total) * 100 ELSE 0 END) STORED,
    "reason" TEXT NOT NULL,
    "approval_status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "approved_by" UUID REFERENCES "users"("id"),
    "approved_at" TIMESTAMP WITH TIME ZONE,
    "revision_details" JSONB, -- Details of changes
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "revision_number")
);

-- Financial Transactions
CREATE TABLE "financial_transactions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "budget_item_id" UUID REFERENCES "development_budget"("id"),
    "reference" VARCHAR(100),
    "description" TEXT NOT NULL,
    "amount" DECIMAL(15, 2) NOT NULL,
    "type" transaction_type NOT NULL,
    "status" transaction_status NOT NULL DEFAULT 'PENDING',
    "transaction_date" DATE NOT NULL,
    "payment_method" payment_method,
    "supplier" VARCHAR(255),
    "recipient" VARCHAR(255),
    "approved_by" UUID REFERENCES "users"("id"),
    "approved_at" TIMESTAMP WITH TIME ZONE,
    "invoice_reference" VARCHAR(100),
    "receipt_reference" VARCHAR(100),
    "notes" TEXT,
    "documents" JSONB, -- References to document IDs
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-------------------------
-- CASH FLOW PROJECTIONS --
-------------------------

-- Cash Flow Projections
CREATE TABLE "cash_flow_projections" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "period_type" financial_period NOT NULL DEFAULT 'MONTHLY',
    "currency" currency_code NOT NULL DEFAULT 'EUR',
    "is_approved" BOOLEAN NOT NULL DEFAULT FALSE,
    "approved_by" UUID REFERENCES "users"("id"),
    "approved_at" TIMESTAMP WITH TIME ZONE,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "name")
);

-- Cash Flow Categories
CREATE TABLE "cash_flow_categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL, -- INFLOW, OUTFLOW
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("name", "type")
);

-- Cash Flow Periods
CREATE TABLE "cash_flow_periods" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "cash_flow_projection_id" UUID NOT NULL REFERENCES "cash_flow_projections"("id") ON DELETE CASCADE,
    "period_start_date" DATE NOT NULL,
    "period_end_date" DATE NOT NULL,
    "period_number" INTEGER NOT NULL,
    "inflows_total" DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "outflows_total" DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "net_cash_flow" DECIMAL(15, 2) GENERATED ALWAYS AS (inflows_total - outflows_total) STORED,
    "opening_balance" DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "closing_balance" DECIMAL(15, 2) GENERATED ALWAYS AS (opening_balance + (inflows_total - outflows_total)) STORED,
    "is_actual" BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE for historical periods with actual figures
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("cash_flow_projection_id", "period_number")
);

-- Cash Flow Line Items
CREATE TABLE "cash_flow_line_items" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "cash_flow_period_id" UUID NOT NULL REFERENCES "cash_flow_periods"("id") ON DELETE CASCADE,
    "category_id" UUID NOT NULL REFERENCES "cash_flow_categories"("id"),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15, 2) NOT NULL,
    "is_actual" BOOLEAN NOT NULL DEFAULT FALSE,
    "transaction_id" UUID REFERENCES "financial_transactions"("id"),
    "budget_item_id" UUID REFERENCES "development_budget"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cash Flow Scenarios
CREATE TABLE "cash_flow_scenarios" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "base_projection_id" UUID NOT NULL REFERENCES "cash_flow_projections"("id") ON DELETE CASCADE,
    "adjustments" JSONB NOT NULL, -- Category-based percentage or fixed adjustments
    "is_active" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_by" UUID REFERENCES "users"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "name")
);

------------------------
-- SALES AND REVENUE --
------------------------

-- Sale Financial Details
CREATE TABLE "sale_financials" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "base_price" DECIMAL(15, 2) NOT NULL,
    "customization_total" DECIMAL(15, 2) NOT NULL DEFAULT 0,
    "addons_total" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "discounts_total" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "final_price" DECIMAL(15, 2) NOT NULL,
    "deposit_required" DECIMAL(12, 2) NOT NULL,
    "deposit_paid" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "deposit_paid_date" TIMESTAMP WITH TIME ZONE,
    "balance_due" DECIMAL(15, 2) GENERATED ALWAYS AS (final_price - deposit_paid) STORED,
    "balance_due_date" DATE,
    "commission_amount" DECIMAL(12, 2),
    "commission_rate" DECIMAL(5, 2),
    "commission_paid" BOOLEAN NOT NULL DEFAULT FALSE,
    "commission_paid_date" TIMESTAMP WITH TIME ZONE,
    "payment_schedule" JSONB,
    "payment_history" JSONB,
    "refund_amount" DECIMAL(12, 2) DEFAULT 0,
    "refund_date" TIMESTAMP WITH TIME ZONE,
    "refund_reason" TEXT,
    "currency" currency_code NOT NULL DEFAULT 'EUR',
    "exchange_rate" DECIMAL(10, 6) DEFAULT 1,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("sale_id")
);

-- Price Modifications
CREATE TABLE "price_modifications" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID REFERENCES "sales"("id") ON DELETE CASCADE,
    "unit_id" UUID REFERENCES "units"("id") ON DELETE CASCADE,
    "type" VARCHAR(50) NOT NULL, -- DISCOUNT, PREMIUM, PROMOTION, ADJUSTMENT
    "amount" DECIMAL(12, 2),
    "percentage" DECIMAL(5, 2),
    "applied_to" VARCHAR(50) NOT NULL, -- BASE_PRICE, TOTAL_PRICE, CUSTOMIZATION, etc.
    "reason" TEXT NOT NULL,
    "authorized_by" UUID REFERENCES "users"("id"),
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT check_sale_or_unit CHECK (
        (sale_id IS NOT NULL AND unit_id IS NULL) OR
        (sale_id IS NULL AND unit_id IS NOT NULL)
    ),
    CONSTRAINT check_amount_or_percentage CHECK (
        (amount IS NOT NULL AND percentage IS NULL) OR
        (amount IS NULL AND percentage IS NOT NULL)
    )
);

-- Payment Transactions
CREATE TABLE "payment_transactions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "amount" DECIMAL(12, 2) NOT NULL,
    "type" transaction_type NOT NULL,
    "status" transaction_status NOT NULL DEFAULT 'PENDING',
    "payment_method" payment_method NOT NULL,
    "transaction_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "reference" VARCHAR(100),
    "description" TEXT,
    "payment_provider" VARCHAR(100),
    "payment_provider_reference" VARCHAR(100),
    "processed_by" UUID REFERENCES "users"("id"),
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE "invoices" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sale_id" UUID NOT NULL REFERENCES "sales"("id") ON DELETE CASCADE,
    "invoice_number" VARCHAR(50) UNIQUE NOT NULL,
    "amount" DECIMAL(15, 2) NOT NULL,
    "tax_amount" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15, 2) GENERATED ALWAYS AS (amount + tax_amount) STORED,
    "currency" currency_code NOT NULL DEFAULT 'EUR',
    "issue_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "invoice_items" JSONB NOT NULL,
    "billing_address" JSONB,
    "payment_instructions" TEXT,
    "notes" TEXT,
    "payment_id" UUID REFERENCES "payment_transactions"("id"),
    "document_id" UUID REFERENCES "documents"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-------------------------
-- INVESTMENT ANALYSIS --
-------------------------

-- Development Investment Analysis
CREATE TABLE "development_investment_analysis" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "calculation_date" DATE NOT NULL,
    "calculated_by" UUID REFERENCES "users"("id"),
    "total_development_cost" DECIMAL(15, 2) NOT NULL,
    "total_revenue" DECIMAL(15, 2) NOT NULL,
    "gross_development_value" DECIMAL(15, 2) NOT NULL,
    "profit" DECIMAL(15, 2) GENERATED ALWAYS AS (total_revenue - total_development_cost) STORED,
    "profit_margin" DECIMAL(5, 2) GENERATED ALWAYS AS (CASE WHEN total_revenue <> 0 THEN (total_revenue - total_development_cost) / total_revenue * 100 ELSE 0 END) STORED,
    "profit_on_cost" DECIMAL(5, 2) GENERATED ALWAYS AS (CASE WHEN total_development_cost <> 0 THEN (total_revenue - total_development_cost) / total_development_cost * 100 ELSE 0 END) STORED,
    "development_yield" DECIMAL(5, 2),
    "irr" DECIMAL(5, 2),
    "npv" DECIMAL(15, 2),
    "payback_period" DECIMAL(5, 2),
    "discount_rate" DECIMAL(5, 2),
    "cashflow_data" JSONB, -- Array of periodic cash flows
    "scenario_analysis" JSONB, -- Scenario comparisons
    "sensitivity_analysis" JSONB, -- Sensitivity data
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "calculation_date")
);

-- Risk Assessment
CREATE TABLE "financial_risk_assessment" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "assessment_date" DATE NOT NULL,
    "assessed_by" UUID REFERENCES "users"("id"),
    "overall_risk_rating" VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH
    "cost_overrun_risk" INTEGER NOT NULL, -- 1-10
    "sales_risk" INTEGER NOT NULL, -- 1-10
    "funding_risk" INTEGER NOT NULL, -- 1-10
    "timeline_risk" INTEGER NOT NULL, -- 1-10
    "regulatory_risk" INTEGER NOT NULL, -- 1-10
    "market_risk" INTEGER NOT NULL, -- 1-10
    "risk_factors" JSONB NOT NULL, -- Detailed explanations
    "mitigation_strategies" JSONB NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "assessment_date")
);

-- Financial Statements
CREATE TABLE "financial_statements" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "development_finance_id" UUID NOT NULL REFERENCES "development_finance"("id") ON DELETE CASCADE,
    "statement_type" VARCHAR(50) NOT NULL, -- INCOME_STATEMENT, BALANCE_SHEET, CASH_FLOW_STATEMENT
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "is_actual" BOOLEAN NOT NULL DEFAULT FALSE,
    "currency" currency_code NOT NULL DEFAULT 'EUR',
    "prepared_by" UUID REFERENCES "users"("id"),
    "approved_by" UUID REFERENCES "users"("id"),
    "statement_data" JSONB NOT NULL, -- Full statement data
    "notes" TEXT,
    "document_id" UUID REFERENCES "documents"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE("development_finance_id", "statement_type", "period_start", "period_end")
);

-- Create indexes
CREATE INDEX idx_development_finance_development_id ON development_finance(development_id);
CREATE INDEX idx_funding_sources_development_finance_id ON funding_sources(development_finance_id);
CREATE INDEX idx_drawdowns_funding_source_id ON drawdowns(funding_source_id);
CREATE INDEX idx_repayments_funding_source_id ON repayments(funding_source_id);
CREATE INDEX idx_budget_categories_development_finance_id ON budget_categories(development_finance_id);
CREATE INDEX idx_development_budget_development_finance_id ON development_budget(development_finance_id);
CREATE INDEX idx_development_budget_category_id ON development_budget(category_id);
CREATE INDEX idx_budget_revisions_development_finance_id ON budget_revisions(development_finance_id);
CREATE INDEX idx_financial_transactions_development_finance_id ON financial_transactions(development_finance_id);
CREATE INDEX idx_financial_transactions_budget_item_id ON financial_transactions(budget_item_id);
CREATE INDEX idx_cash_flow_projections_development_finance_id ON cash_flow_projections(development_finance_id);
CREATE INDEX idx_cash_flow_periods_cash_flow_projection_id ON cash_flow_periods(cash_flow_projection_id);
CREATE INDEX idx_cash_flow_line_items_cash_flow_period_id ON cash_flow_line_items(cash_flow_period_id);
CREATE INDEX idx_cash_flow_line_items_category_id ON cash_flow_line_items(category_id);
CREATE INDEX idx_cash_flow_scenarios_development_finance_id ON cash_flow_scenarios(development_finance_id);
CREATE INDEX idx_sale_financials_sale_id ON sale_financials(sale_id);
CREATE INDEX idx_sale_financials_development_finance_id ON sale_financials(development_finance_id);
CREATE INDEX idx_price_modifications_sale_id ON price_modifications(sale_id);
CREATE INDEX idx_price_modifications_unit_id ON price_modifications(unit_id);
CREATE INDEX idx_payment_transactions_sale_id ON payment_transactions(sale_id);
CREATE INDEX idx_invoices_sale_id ON invoices(sale_id);
CREATE INDEX idx_development_investment_analysis_development_finance_id ON development_investment_analysis(development_finance_id);
CREATE INDEX idx_financial_risk_assessment_development_finance_id ON financial_risk_assessment(development_finance_id);
CREATE INDEX idx_financial_statements_development_finance_id ON financial_statements(development_finance_id);

-- Create triggers
CREATE TRIGGER set_timestamp_development_finance
BEFORE UPDATE ON development_finance
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_funding_sources
BEFORE UPDATE ON funding_sources
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_drawdowns
BEFORE UPDATE ON drawdowns
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_repayments
BEFORE UPDATE ON repayments
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_budget_categories
BEFORE UPDATE ON budget_categories
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_development_budget
BEFORE UPDATE ON development_budget
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_budget_revisions
BEFORE UPDATE ON budget_revisions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_financial_transactions
BEFORE UPDATE ON financial_transactions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_cash_flow_projections
BEFORE UPDATE ON cash_flow_projections
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_cash_flow_categories
BEFORE UPDATE ON cash_flow_categories
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_cash_flow_periods
BEFORE UPDATE ON cash_flow_periods
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_cash_flow_line_items
BEFORE UPDATE ON cash_flow_line_items
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_cash_flow_scenarios
BEFORE UPDATE ON cash_flow_scenarios
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_sale_financials
BEFORE UPDATE ON sale_financials
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_price_modifications
BEFORE UPDATE ON price_modifications
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_payment_transactions
BEFORE UPDATE ON payment_transactions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_invoices
BEFORE UPDATE ON invoices
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_development_investment_analysis
BEFORE UPDATE ON development_investment_analysis
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_financial_risk_assessment
BEFORE UPDATE ON financial_risk_assessment
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_financial_statements
BEFORE UPDATE ON financial_statements
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

COMMIT;