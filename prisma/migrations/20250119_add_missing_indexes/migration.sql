-- Add missing indexes for foreign key fields to improve query performance

-- User model indexes
CREATE INDEX IF NOT EXISTS "User_locationId_idx" ON "User"("locationId");

-- MfaSettings indexes
CREATE INDEX IF NOT EXISTS "MfaSettings_userId_idx" ON "MfaSettings"("userId");

-- UserPermission indexes
CREATE INDEX IF NOT EXISTS "UserPermission_userId_idx" ON "UserPermission"("userId");

-- TeamMember indexes
CREATE INDEX IF NOT EXISTS "TeamMember_teamId_idx" ON "TeamMember"("teamId");
CREATE INDEX IF NOT EXISTS "TeamMember_userId_idx" ON "TeamMember"("userId");

-- BuyerProfile indexes
CREATE INDEX IF NOT EXISTS "BuyerProfile_userId_idx" ON "BuyerProfile"("userId");

-- Reservation indexes
CREATE INDEX IF NOT EXISTS "Reservation_propertyId_idx" ON "Reservation"("propertyId");
CREATE INDEX IF NOT EXISTS "Reservation_userId_idx" ON "Reservation"("userId");

-- MortgageTracking indexes
CREATE INDEX IF NOT EXISTS "MortgageTracking_userId_idx" ON "MortgageTracking"("userId");

-- SnagList indexes
CREATE INDEX IF NOT EXISTS "SnagList_propertyId_idx" ON "SnagList"("propertyId");
CREATE INDEX IF NOT EXISTS "SnagList_userId_idx" ON "SnagList"("userId");

-- SnagItem indexes
CREATE INDEX IF NOT EXISTS "SnagItem_snagListId_idx" ON "SnagItem"("snagListId");
CREATE INDEX IF NOT EXISTS "SnagItem_saleId_idx" ON "SnagItem"("saleId");

-- HomePackItem indexes
CREATE INDEX IF NOT EXISTS "HomePackItem_propertyId_idx" ON "HomePackItem"("propertyId");

-- Development indexes (critical for performance)
CREATE INDEX IF NOT EXISTS "Development_developerId_idx" ON "Development"("developerId");
CREATE INDEX IF NOT EXISTS "Development_locationId_idx" ON "Development"("locationId");
CREATE INDEX IF NOT EXISTS "Development_financialsId_idx" ON "Development"("financialsId");

-- Unit indexes (critical for performance)
CREATE INDEX IF NOT EXISTS "Unit_developmentId_idx" ON "Unit"("developmentId");
CREATE INDEX IF NOT EXISTS "Unit_unitTypeId_idx" ON "Unit"("unitTypeId");

-- Transaction indexes (critical for performance)
CREATE INDEX IF NOT EXISTS "Transaction_buyerId_idx" ON "Transaction"("buyerId");
CREATE INDEX IF NOT EXISTS "Transaction_developmentId_idx" ON "Transaction"("developmentId");
CREATE INDEX IF NOT EXISTS "Transaction_unitId_idx" ON "Transaction"("unitId");
CREATE INDEX IF NOT EXISTS "Transaction_agentId_idx" ON "Transaction"("agentId");
CREATE INDEX IF NOT EXISTS "Transaction_solicitorId_idx" ON "Transaction"("solicitorId");

-- Document indexes
CREATE INDEX IF NOT EXISTS "Document_developmentId_idx" ON "Document"("developmentId");
CREATE INDEX IF NOT EXISTS "Document_unitId_idx" ON "Document"("unitId");
CREATE INDEX IF NOT EXISTS "Document_uploadedById_idx" ON "Document"("uploadedById");
CREATE INDEX IF NOT EXISTS "Document_approvedById_idx" ON "Document"("approvedById");

-- Sale indexes
CREATE INDEX IF NOT EXISTS "Sale_developmentId_idx" ON "Sale"("developmentId");
CREATE INDEX IF NOT EXISTS "Sale_unitId_idx" ON "Sale"("unitId");
CREATE INDEX IF NOT EXISTS "Sale_buyerId_idx" ON "Sale"("buyerId");
CREATE INDEX IF NOT EXISTS "Sale_agentId_idx" ON "Sale"("agentId");

-- Investment indexes
CREATE INDEX IF NOT EXISTS "Investment_investorId_idx" ON "Investment"("investorId");
CREATE INDEX IF NOT EXISTS "Investment_developmentId_idx" ON "Investment"("developmentId");

-- Viewing indexes
CREATE INDEX IF NOT EXISTS "Viewing_propertyId_idx" ON "Viewing"("propertyId");
CREATE INDEX IF NOT EXISTS "Viewing_userId_idx" ON "Viewing"("userId");

-- PropertyView indexes (for analytics)
CREATE INDEX IF NOT EXISTS "PropertyView_unitId_idx" ON "PropertyView"("unitId");
CREATE INDEX IF NOT EXISTS "PropertyView_createdAt_idx" ON "PropertyView"("createdAt");

-- Inquiry indexes (for analytics)
CREATE INDEX IF NOT EXISTS "Inquiry_unitId_idx" ON "Inquiry"("unitId");
CREATE INDEX IF NOT EXISTS "Inquiry_userId_idx" ON "Inquiry"("userId");

-- Payment indexes (for financial queries)
CREATE INDEX IF NOT EXISTS "Payment_transactionId_idx" ON "Payment"("transactionId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "Transaction_status_stage_idx" ON "Transaction"("status", "stage");
CREATE INDEX IF NOT EXISTS "Unit_developmentId_status_idx" ON "Unit"("developmentId", "status");
CREATE INDEX IF NOT EXISTS "Development_developerId_status_idx" ON "Development"("developerId", "status");

-- Analytics performance indexes
CREATE INDEX IF NOT EXISTS "PropertyView_unitId_createdAt_idx" ON "PropertyView"("unitId", "createdAt");
CREATE INDEX IF NOT EXISTS "Transaction_developmentId_createdAt_idx" ON "Transaction"("developmentId", "createdAt");
CREATE INDEX IF NOT EXISTS "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");