import {
  User,
  Development,
  Unit,
  Sale,
  Document,
  DevelopmentFinance,
  Budget,
  CashFlow,
  CustomizationOption,
  CustomizationSelection,
  Transaction
} from '../types';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

/**
 * Database mapper functions for converting between database models and domain models
 * Provides type-safe mapping for PropIE AWS platform entities
 */

/**
 * Map database user object to domain User model
 * @param dbUser Database user object
 * @returns Domain User model
 */
export function mapUser(dbUser: any): User {
  if (!dbUser) return null;
  
  return {
    id: dbUser.id,
    cognitoId: dbUser.cognito_id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    phone: dbUser.phone,
    profileImageUrl: dbUser.profile_image_url,
    role: dbUser.role,
    status: dbUser.status,
    kycStatus: dbUser.kyc_status,
    twoFactorEnabled: dbUser.two_factor_enabled,
    lastLogin: dbUser.last_login,
    metadata: dbUser.metadata,
    termsAccepted: dbUser.terms_accepted,
    termsAcceptedAt: dbUser.terms_accepted_at,
    marketingConsent: dbUser.marketing_consent,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  };
}

/**
 * Map domain User model to database user object
 * @param user Domain User model
 * @returns Database user object
 */
export function mapUserToDb(user: User): any {
  return {
    cognito_id: user.cognitoId,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    profile_image_url: user.profileImageUrl,
    role: user.role,
    status: user.status,
    kyc_status: user.kycStatus,
    two_factor_enabled: user.twoFactorEnabled,
    metadata: user.metadata,
    terms_accepted: user.termsAccepted,
    terms_accepted_at: user.termsAcceptedAt,
    marketing_consent: user.marketingConsent
  };
}

/**
 * Map database development object to domain Development model
 * @param dbDevelopment Database development object
 * @returns Domain Development model
 */
export function mapDevelopment(dbDevelopment: any): Development {
  if (!dbDevelopment) return null;
  
  // Extract location fields from joined query
  const location = dbDevelopment.address_line_1 ? {
    id: dbDevelopment.location_id,
    addressLine1: dbDevelopment.address_line_1,
    addressLine2: dbDevelopment.address_line_2,
    city: dbDevelopment.city,
    county: dbDevelopment.county,
    state: dbDevelopment.state,
    postalCode: dbDevelopment.postal_code,
    country: dbDevelopment.country,
    latitude: dbDevelopment.latitude,
    longitude: dbDevelopment.longitude,
    geocoded: dbDevelopment.geocoded
  } : null;
  
  return {
    id: dbDevelopment.id,
    name: dbDevelopment.name,
    code: dbDevelopment.code,
    description: dbDevelopment.description,
    status: dbDevelopment.status,
    developerId: dbDevelopment.developer_id,
    location,
    totalUnits: dbDevelopment.total_units,
    availableUnits: dbDevelopment.available_units,
    reservedUnits: dbDevelopment.reserved_units,
    soldUnits: dbDevelopment.sold_units,
    buildStartDate: dbDevelopment.build_start_date,
    buildEndDate: dbDevelopment.build_end_date,
    salesStartDate: dbDevelopment.sales_start_date,
    estimatedCompletionDate: dbDevelopment.estimated_completion_date,
    brochureUrl: dbDevelopment.brochure_url,
    websiteUrl: dbDevelopment.website_url,
    featuredImageUrl: dbDevelopment.featured_image_url,
    galleryImages: dbDevelopment.gallery_images,
    sitePlanUrl: dbDevelopment.site_plan_url,
    virtualTourUrl: dbDevelopment.virtual_tour_url,
    floorplans: dbDevelopment.floorplans,
    amenities: dbDevelopment.amenities,
    features: dbDevelopment.features,
    metadata: dbDevelopment.metadata,
    createdAt: dbDevelopment.created_at,
    updatedAt: dbDevelopment.updated_at
  };
}

/**
 * Map domain Development model to database development object
 * @param development Domain Development model
 * @returns Database development object
 */
export function mapDevelopmentToDb(development: Development): any {
  const dbDevelopment: any = {
    name: development.name,
    code: development.code,
    description: development.description,
    status: development.status,
    developer_id: development.developerId,
    total_units: development.totalUnits,
    available_units: development.availableUnits,
    reserved_units: development.reservedUnits,
    sold_units: development.soldUnits,
    build_start_date: development.buildStartDate,
    build_end_date: development.buildEndDate,
    sales_start_date: development.salesStartDate,
    estimated_completion_date: development.estimatedCompletionDate,
    brochure_url: development.brochureUrl,
    website_url: development.websiteUrl,
    featured_image_url: development.featuredImageUrl,
    gallery_images: development.galleryImages,
    site_plan_url: development.sitePlanUrl,
    virtual_tour_url: development.virtualTourUrl,
    floorplans: development.floorplans,
    amenities: development.amenities,
    features: development.features,
    metadata: development.metadata
  };
  
  // Add location data if provided
  if (development.location) {
    dbDevelopment.location = {
      address_line_1: development.location.addressLine1,
      address_line_2: development.location.addressLine2,
      city: development.location.city,
      county: development.location.county,
      state: development.location.state,
      postal_code: development.location.postalCode,
      country: development.location.country
    };
  }
  
  return dbDevelopment;
}

/**
 * Map database unit object to domain Unit model
 * @param dbUnit Database unit object
 * @returns Domain Unit model
 */
export function mapUnit(dbUnit: any): Unit {
  if (!dbUnit) return null;
  
  // Extract location fields from joined query
  const location = dbUnit.address_line_1 ? {
    id: dbUnit.location_id,
    addressLine1: dbUnit.address_line_1,
    addressLine2: dbUnit.address_line_2,
    city: dbUnit.city,
    county: dbUnit.county,
    state: dbUnit.state,
    postalCode: dbUnit.postal_code,
    country: dbUnit.country,
    latitude: dbUnit.latitude,
    longitude: dbUnit.longitude,
    geocoded: dbUnit.geocoded
  } : null;
  
  return {
    id: dbUnit.id,
    developmentId: dbUnit.development_id,
    name: dbUnit.name,
    unitNumber: dbUnit.unit_number,
    description: dbUnit.description,
    type: dbUnit.type,
    status: dbUnit.status,
    location,
    floorNumber: dbUnit.floor_number,
    bedrooms: dbUnit.bedrooms,
    bathrooms: dbUnit.bathrooms,
    totalArea: dbUnit.total_area,
    indoorArea: dbUnit.indoor_area,
    outdoorArea: dbUnit.outdoor_area,
    parkingSpaces: dbUnit.parking_spaces,
    basePrice: dbUnit.base_price,
    currentPrice: dbUnit.current_price,
    depositAmount: dbUnit.deposit_amount,
    depositPercentage: dbUnit.deposit_percentage,
    completionPercentage: dbUnit.completion_percentage,
    estimatedCompletionDate: dbUnit.estimated_completion_date,
    actualCompletionDate: dbUnit.actual_completion_date,
    floorPlanUrl: dbUnit.floor_plan_url,
    virtualTourUrl: dbUnit.virtual_tour_url,
    mainImageUrl: dbUnit.main_image_url,
    galleryImages: dbUnit.gallery_images,
    features: dbUnit.features,
    energyRating: dbUnit.energy_rating,
    isFeatured: dbUnit.is_featured,
    isCustomizable: dbUnit.is_customizable,
    customizationDeadline: dbUnit.customization_deadline,
    metadata: dbUnit.metadata,
    createdAt: dbUnit.created_at,
    updatedAt: dbUnit.updated_at
  };
}

/**
 * Map domain Unit model to database unit object
 * @param unit Domain Unit model
 * @returns Database unit object
 */
export function mapUnitToDb(unit: Unit): any {
  return {
    development_id: unit.developmentId,
    name: unit.name,
    unit_number: unit.unitNumber,
    description: unit.description,
    type: unit.type,
    status: unit.status,
    floor_number: unit.floorNumber,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    total_area: unit.totalArea,
    indoor_area: unit.indoorArea,
    outdoor_area: unit.outdoorArea,
    parking_spaces: unit.parkingSpaces,
    base_price: unit.basePrice,
    current_price: unit.currentPrice,
    deposit_amount: unit.depositAmount,
    deposit_percentage: unit.depositPercentage,
    completion_percentage: unit.completionPercentage,
    estimated_completion_date: unit.estimatedCompletionDate,
    actual_completion_date: unit.actualCompletionDate,
    floor_plan_url: unit.floorPlanUrl,
    virtual_tour_url: unit.virtualTourUrl,
    main_image_url: unit.mainImageUrl,
    gallery_images: unit.galleryImages,
    features: unit.features,
    energy_rating: unit.energyRating,
    is_featured: unit.isFeatured,
    is_customizable: unit.isCustomizable,
    customization_deadline: unit.customizationDeadline,
    metadata: unit.metadata
  };
}

/**
 * Map database sale object to domain Sale model
 * @param dbSale Database sale object
 * @returns Domain Sale model
 */
export function mapSale(dbSale: any): Sale {
  if (!dbSale) return null;
  
  // Map unit data if present in joined query
  const unit = dbSale.unit_id ? {
    id: dbSale.unit_id,
    name: dbSale.unit_name || dbSale.name,
    unitNumber: dbSale.unit_number
  } : null;
  
  return {
    id: dbSale.id,
    unitId: dbSale.unit_id,
    unit,
    buyerId: dbSale.buyer_id,
    buyerName: dbSale.buyer_first_name && dbSale.buyer_last_name 
      ? `${dbSale.buyer_first_name} ${dbSale.buyer_last_name}`
      : null,
    agentId: dbSale.agent_id,
    solicitorId: dbSale.solicitor_id,
    status: dbSale.status,
    inquiryDate: dbSale.inquiry_date,
    reservationDate: dbSale.reservation_date,
    contractSentDate: dbSale.contract_sent_date,
    contractSignedDate: dbSale.contract_signed_date,
    depositPaidDate: dbSale.deposit_paid_date,
    completionDate: dbSale.completion_date,
    cancellationDate: dbSale.cancellation_date,
    cancellationReason: dbSale.cancellation_reason,
    salePrice: dbSale.sale_price,
    depositAmount: dbSale.deposit_amount,
    helpToBuyAmount: dbSale.help_to_buy_amount,
    mortgageAmount: dbSale.mortgage_amount,
    cashAmount: dbSale.cash_amount,
    customizationTotal: dbSale.customization_total,
    hasMortgage: dbSale.has_mortgage,
    hasHelpToBuy: dbSale.has_help_to_buy,
    notes: dbSale.notes,
    developmentName: dbSale.development_name,
    developmentId: dbSale.development_id,
    metadata: dbSale.metadata,
    createdAt: dbSale.created_at,
    updatedAt: dbSale.updated_at
  };
}

/**
 * Map domain Sale model to database sale object
 * @param sale Domain Sale model
 * @returns Database sale object
 */
export function mapSaleToDb(sale: Sale): any {
  return {
    unit_id: sale.unitId,
    buyer_id: sale.buyerId,
    agent_id: sale.agentId,
    solicitor_id: sale.solicitorId,
    status: sale.status,
    inquiry_date: sale.inquiryDate,
    reservation_date: sale.reservationDate,
    contract_sent_date: sale.contractSentDate,
    contract_signed_date: sale.contractSignedDate,
    deposit_paid_date: sale.depositPaidDate,
    completion_date: sale.completionDate,
    cancellation_date: sale.cancellationDate,
    cancellation_reason: sale.cancellationReason,
    sale_price: sale.salePrice,
    deposit_amount: sale.depositAmount,
    help_to_buy_amount: sale.helpToBuyAmount,
    mortgage_amount: sale.mortgageAmount,
    cash_amount: sale.cashAmount,
    customization_total: sale.customizationTotal,
    has_mortgage: sale.hasMortgage,
    has_help_to_buy: sale.hasHelpToBuy,
    notes: sale.notes,
    metadata: sale.metadata
  };
}

/**
 * Map database document object to domain Document model
 * @param dbDocument Database document object
 * @returns Domain Document model
 */
export function mapDocument(dbDocument: any): Document {
  if (!dbDocument) return null;
  
  return {
    id: dbDocument.id,
    name: dbDocument.name,
    description: dbDocument.description,
    type: dbDocument.type,
    fileUrl: dbDocument.file_url,
    fileSize: dbDocument.file_size,
    fileType: dbDocument.file_type,
    version: dbDocument.version,
    status: dbDocument.status,
    entityType: dbDocument.entity_type,
    entityId: dbDocument.entity_id,
    uploadedBy: dbDocument.uploaded_by,
    approvedBy: dbDocument.approved_by,
    approvalDate: dbDocument.approval_date,
    expiryDate: dbDocument.expiry_date,
    isTemplate: dbDocument.is_template,
    templateVariables: dbDocument.template_variables,
    metadata: dbDocument.metadata,
    createdAt: dbDocument.created_at,
    updatedAt: dbDocument.updated_at
  };
}

/**
 * Map domain Document model to database document object
 * @param document Domain Document model
 * @returns Database document object
 */
export function mapDocumentToDb(document: Document): any {
  return {
    name: document.name,
    description: document.description,
    type: document.type,
    file_url: document.fileUrl,
    file_size: document.fileSize,
    file_type: document.fileType,
    version: document.version,
    status: document.status,
    entity_type: document.entityType,
    entity_id: document.entityId,
    uploaded_by: document.uploadedBy,
    approved_by: document.approvedBy,
    approval_date: document.approvalDate,
    expiry_date: document.expiryDate,
    is_template: document.isTemplate,
    template_variables: document.templateVariables,
    metadata: document.metadata
  };
}

/**
 * Map database development finance object to domain DevelopmentFinance model
 * @param dbFinance Database development finance object
 * @returns Domain DevelopmentFinance model
 */
export function mapDevelopmentFinance(dbFinance: any): DevelopmentFinance {
  if (!dbFinance) return null;
  
  return {
    id: dbFinance.id,
    developmentId: dbFinance.development_id,
    totalBudget: dbFinance.total_budget,
    totalCostToDate: dbFinance.total_cost_to_date,
    projectedProfit: dbFinance.projected_profit,
    projectedMargin: dbFinance.projected_margin,
    currency: dbFinance.currency,
    lastUpdatedBy: dbFinance.last_updated_by,
    reportingPeriodStart: dbFinance.reporting_period_start,
    reportingPeriodEnd: dbFinance.reporting_period_end,
    financialSummary: dbFinance.financial_summary,
    isLocked: dbFinance.is_locked,
    lockedBy: dbFinance.locked_by,
    lockedAt: dbFinance.locked_at,
    createdAt: dbFinance.created_at,
    updatedAt: dbFinance.updated_at
  };
}

/**
 * Map domain DevelopmentFinance model to database development finance object
 * @param finance Domain DevelopmentFinance model
 * @returns Database development finance object
 */
export function mapDevelopmentFinanceToDb(finance: DevelopmentFinance): any {
  return {
    development_id: finance.developmentId,
    total_budget: finance.totalBudget,
    total_cost_to_date: finance.totalCostToDate,
    projected_profit: finance.projectedProfit,
    projected_margin: finance.projectedMargin,
    currency: finance.currency,
    last_updated_by: finance.lastUpdatedBy,
    reporting_period_start: finance.reportingPeriodStart,
    reporting_period_end: finance.reportingPeriodEnd,
    financial_summary: finance.financialSummary,
    is_locked: finance.isLocked,
    locked_by: finance.lockedBy,
    locked_at: finance.lockedAt
  };
}

/**
 * Map database budget data to domain Budget model
 * @param dbBudget Database budget data (including categories and items)
 * @returns Domain Budget model
 */
export function mapBudget(dbBudget: any): Budget {
  if (!dbBudget) return null;
  
  return {
    categories: dbBudget.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      displayOrder: category.display_order,
      items: (category.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        budgetedAmount: item.budgeted_amount,
        actualAmount: item.actual_amount,
        varianceAmount: item.variance_amount,
        variancePercentage: item.variance_percentage,
        isFixedCost: item.is_fixed_cost,
        costPerUnit: item.cost_per_unit,
        contingencyPercentage: item.contingency_percentage,
        contingencyAmount: item.contingency_amount,
        forecastToComplete: item.forecast_to_complete,
        displayOrder: item.display_order,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))
    }))
  };
}

/**
 * Map database cash flow data to domain CashFlow model
 * @param dbCashFlow Database cash flow data
 * @returns Domain CashFlow model
 */
export function mapCashFlow(dbCashFlow: any): CashFlow {
  if (!dbCashFlow) return null;
  
  return {
    projection: {
      id: dbCashFlow.projection.id,
      name: dbCashFlow.projection.name,
      description: dbCashFlow.projection.description,
      startDate: dbCashFlow.projection.start_date,
      endDate: dbCashFlow.projection.end_date,
      periodType: dbCashFlow.projection.period_type,
      currency: dbCashFlow.projection.currency,
      isApproved: dbCashFlow.projection.is_approved,
      approvedBy: dbCashFlow.projection.approved_by,
      approvedAt: dbCashFlow.projection.approved_at,
      isActive: dbCashFlow.projection.is_active,
      createdAt: dbCashFlow.projection.created_at,
      updatedAt: dbCashFlow.projection.updated_at
    },
    periods: dbCashFlow.periods.map((period: any) => ({
      id: period.id,
      periodNumber: period.period_number,
      periodStartDate: period.period_start_date,
      periodEndDate: period.period_end_date,
      inflowsTotal: period.inflows_total,
      outflowsTotal: period.outflows_total,
      netCashFlow: period.net_cash_flow,
      openingBalance: period.opening_balance,
      closingBalance: period.closing_balance,
      isActual: period.is_actual,
      lineItems: (period.line_items || []).map((item: any) => ({
        id: item.id,
        categoryId: item.category_id,
        categoryName: item.category_name,
        categoryType: item.category_type,
        name: item.name,
        description: item.description,
        amount: item.amount,
        isActual: item.is_actual,
        transactionId: item.transaction_id,
        budgetItemId: item.budget_item_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })),
      createdAt: period.created_at,
      updatedAt: period.updated_at
    }))
  };
}

/**
 * Map database customization option to domain CustomizationOption model
 * @param dbOption Database customization option object
 * @returns Domain CustomizationOption model
 */
export function mapCustomizationOption(dbOption: any): CustomizationOption {
  if (!dbOption) return null;
  
  return {
    id: dbOption.id,
    unitId: dbOption.unit_id,
    category: dbOption.category,
    name: dbOption.name,
    description: dbOption.description,
    price: dbOption.price,
    imageUrl: dbOption.image_url,
    isDefault: dbOption.is_default,
    isPremium: dbOption.is_premium,
    availableFrom: dbOption.available_from,
    availableUntil: dbOption.available_until,
    stockLimited: dbOption.stock_limited,
    stockQuantity: dbOption.stock_quantity,
    metadata: dbOption.metadata,
    createdAt: dbOption.created_at,
    updatedAt: dbOption.updated_at
  };
}

/**
 * Map database customization selection to domain CustomizationSelection model
 * @param dbSelection Database customization selection object
 * @returns Domain CustomizationSelection model
 */
export function mapCustomizationSelection(dbSelection: any): CustomizationSelection {
  if (!dbSelection) return null;
  
  // Include option details if joined
  const option = dbSelection.name ? {
    id: dbSelection.customization_option_id,
    name: dbSelection.name,
    category: dbSelection.category,
    description: dbSelection.description
  } : null;
  
  return {
    id: dbSelection.id,
    saleId: dbSelection.sale_id,
    customizationOptionId: dbSelection.customization_option_id,
    customizationOption: option,
    quantity: dbSelection.quantity,
    priceAtSelection: dbSelection.price_at_selection,
    totalPrice: dbSelection.total_price,
    selectedAt: dbSelection.selected_at,
    status: dbSelection.status,
    notes: dbSelection.notes,
    createdAt: dbSelection.created_at,
    updatedAt: dbSelection.updated_at
  };
}

/**
 * Map database transaction to domain Transaction model
 * @param dbTransaction Database transaction object
 * @returns Domain Transaction model
 */
export function mapTransaction(dbTransaction: any): Transaction {
  if (!dbTransaction) return null;
  
  return {
    id: dbTransaction.id,
    developmentFinanceId: dbTransaction.development_finance_id,
    budgetItemId: dbTransaction.budget_item_id,
    reference: dbTransaction.reference,
    description: dbTransaction.description,
    amount: dbTransaction.amount,
    type: dbTransaction.type,
    status: dbTransaction.status,
    transactionDate: dbTransaction.transaction_date,
    paymentMethod: dbTransaction.payment_method,
    supplier: dbTransaction.supplier,
    recipient: dbTransaction.recipient,
    approvedBy: dbTransaction.approved_by,
    approvedAt: dbTransaction.approved_at,
    invoiceReference: dbTransaction.invoice_reference,
    receiptReference: dbTransaction.receipt_reference,
    notes: dbTransaction.notes,
    documents: dbTransaction.documents,
    metadata: dbTransaction.metadata,
    createdAt: dbTransaction.created_at,
    updatedAt: dbTransaction.updated_at
  };
}

/**
 * Map Prisma user object to domain User model
 * @param prismaUser Prisma user object
 * @returns Domain User model
 */
export function mapPrismaUserToUser(prismaUser: PrismaUser | any): User {
  if (!prismaUser) return null;
  
  // Convert role strings to UserRole enum values
  let roles = [];
  if (Array.isArray(prismaUser.roles)) {
    roles = prismaUser.roles;
  } else if (prismaUser.role) {
    // Handle case where role is a single string
    roles = [prismaUser.role];
  }
  
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    firstName: prismaUser.firstName || prismaUser.first_name || '',
    lastName: prismaUser.lastName || prismaUser.last_name || '',
    phone: prismaUser.phone,
    roles: roles,
    status: prismaUser.status,
    kycStatus: prismaUser.kycStatus || prismaUser.kyc_status || 'not_started',
    organization: prismaUser.organization,
    position: prismaUser.position,
    avatar: prismaUser.avatar || prismaUser.profileImageUrl || prismaUser.profile_image_url,
    preferences: prismaUser.preferences,
    created: prismaUser.created || prismaUser.createdAt || prismaUser.created_at || new Date(),
    lastActive: prismaUser.lastActive || prismaUser.lastActiveAt || new Date(),
    lastLogin: prismaUser.lastLogin || prismaUser.last_login,
    metadata: prismaUser.metadata || {}
  };
}

// Export all mappers
export default {
  mapUser,
  mapUserToDb,
  mapDevelopment,
  mapDevelopmentToDb,
  mapUnit,
  mapUnitToDb,
  mapSale,
  mapSaleToDb,
  mapDocument,
  mapDocumentToDb,
  mapDevelopmentFinance,
  mapDevelopmentFinanceToDb,
  mapBudget,
  mapCashFlow,
  mapCustomizationOption,
  mapCustomizationSelection,
  mapTransaction,
  mapPrismaUserToUser
};