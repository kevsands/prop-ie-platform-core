-- CreateEnum
CREATE TYPE "MfaMethod" AS ENUM ('TOTP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "MfaTokenType" AS ENUM ('VERIFICATION', 'BACKUP');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 'QUANTITY_SURVEYOR', 'LEGAL', 'PROJECT_MANAGER', 'AGENT', 'SOLICITOR', 'CONTRACTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('PLANNING', 'APPROVED', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 'UNDER_CONSTRUCTION', 'READY', 'LAUNCHED', 'MARKETING', 'SALES', 'SELLING', 'HANDOVER', 'SOLD_OUT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'DUPLEX', 'SEMI_DETACHED', 'DETACHED', 'TERRACED', 'PENTHOUSE', 'COMMERCIAL', 'RETAIL', 'OFFICE');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('PLANNED', 'UNDER_CONSTRUCTION', 'COMPLETE', 'AVAILABLE', 'RESERVED', 'SALE_AGREED', 'SOLD', 'OCCUPIED');

-- CreateEnum
CREATE TYPE "OutdoorSpaceType" AS ENUM ('BALCONY', 'TERRACE', 'GARDEN', 'PATIO', 'ROOF_TERRACE', 'YARD');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('LIVING_ROOM', 'KITCHEN', 'DINING_ROOM', 'BEDROOM', 'BATHROOM', 'EN_SUITE', 'STUDY', 'UTILITY', 'HALL', 'LANDING', 'STORAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomizationCategory" AS ENUM ('KITCHEN', 'BATHROOM', 'FLOORING', 'DOORS', 'WINDOWS', 'PAINT', 'ELECTRICAL', 'HEATING', 'STORAGE', 'FIXTURES', 'EXTERIOR', 'SMART_HOME', 'APPLIANCES', 'LIGHTING', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomizationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'EXPIRED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('ENQUIRY', 'VIEWING_SCHEDULED', 'VIEWED', 'INTERESTED', 'RESERVATION', 'PENDING_APPROVAL', 'RESERVATION_APPROVED', 'CONTRACT_ISSUED', 'CONTRACT_SIGNED', 'DEPOSIT_PAID', 'MORTGAGE_APPROVED', 'CLOSING', 'COMPLETED', 'HANDED_OVER', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('ENQUIRY', 'VIEWING_SCHEDULED', 'VIEWED', 'INTERESTED', 'OFFER_MADE', 'OFFER_ACCEPTED', 'RESERVATION_PENDING', 'RESERVED', 'SALE_AGREED', 'CONTRACTS_ISSUED', 'CONTRACTS_SIGNED', 'MORTGAGE_APPLIED', 'MORTGAGE_APPROVED', 'FUNDS_RELEASED', 'COMPLETION_PENDING', 'COMPLETED', 'HANDED_OVER', 'CANCELLED', 'WITHDRAWN', 'FALLEN_THROUGH');

-- CreateEnum
CREATE TYPE "TransactionStage" AS ENUM ('INITIAL_ENQUIRY', 'PROPERTY_VIEWING', 'OFFER_NEGOTIATION', 'RESERVATION', 'LEGAL_PROCESSING', 'MORTGAGE_APPLICATION', 'CONTRACT_EXCHANGE', 'PRE_COMPLETION', 'COMPLETION', 'POST_COMPLETION');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'RESERVATION', 'ASSIGNMENT', 'INVESTOR_PURCHASE');

-- CreateEnum
CREATE TYPE "TransactionEventType" AS ENUM ('STATUS_CHANGE', 'STAGE_CHANGE', 'DOCUMENT_UPLOADED', 'DOCUMENT_SIGNED', 'PAYMENT_RECEIVED', 'PAYMENT_REFUNDED', 'VIEWING_SCHEDULED', 'VIEWING_COMPLETED', 'OFFER_MADE', 'OFFER_ACCEPTED', 'OFFER_REJECTED', 'RESERVATION_CONFIRMED', 'CONTRACT_ISSUED', 'CONTRACT_SIGNED', 'CONTRACT_EXCHANGED', 'MORTGAGE_UPDATE', 'HTB_UPDATE', 'CUSTOMIZATION_SELECTED', 'TASK_CREATED', 'TASK_COMPLETED', 'ISSUE_RAISED', 'ISSUE_RESOLVED', 'NOTE_ADDED', 'COMMUNICATION_SENT', 'MILESTONE_REACHED');

-- CreateEnum
CREATE TYPE "TransactionDocumentType" AS ENUM ('IDENTIFICATION', 'PROOF_OF_ADDRESS', 'PROOF_OF_FUNDS', 'BANK_STATEMENT', 'PAYSLIP', 'EMPLOYMENT_LETTER', 'RESERVATION_FORM', 'SALES_CONTRACT', 'MORTGAGE_OFFER', 'HTB_APPROVAL', 'SURVEY_REPORT', 'VALUATION_REPORT', 'BER_CERTIFICATE', 'TITLE_DEED', 'COMPLETION_CERTIFICATE', 'SNAG_LIST', 'WARRANTY', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionDocumentCategory" AS ENUM ('KYC_AML', 'FINANCIAL', 'LEGAL', 'PROPERTY', 'MORTGAGE', 'HTB', 'COMPLETION', 'WARRANTY');

-- CreateEnum
CREATE TYPE "TransactionDocumentStatus" AS ENUM ('PENDING', 'UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SIGNED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionPaymentType" AS ENUM ('BOOKING_DEPOSIT', 'RESERVATION_FEE', 'CONTRACT_DEPOSIT', 'STAGE_PAYMENT', 'BALANCE_PAYMENT', 'CUSTOMIZATION_PAYMENT', 'LEGAL_FEE', 'STAMP_DUTY', 'REGISTRATION_FEE', 'MORTGAGE_DEPOSIT', 'HTB_DEPOSIT', 'REFUND', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionPaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHEQUE', 'CASH', 'MORTGAGE_DRAWDOWN', 'HTB_SCHEME', 'CRYPTO', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionTaskCategory" AS ENUM ('DOCUMENTATION', 'FINANCIAL', 'LEGAL', 'PROPERTY_INSPECTION', 'MORTGAGE', 'HTB', 'CUSTOMIZATION', 'COMMUNICATION', 'COMPLIANCE', 'ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "TransactionTaskPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TransactionTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TransactionMilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "CommunicationType" AS ENUM ('EMAIL', 'SMS', 'PHONE_CALL', 'VIDEO_CALL', 'MEETING', 'NOTE', 'LETTER', 'NOTIFICATION');

-- CreateEnum
CREATE TYPE "CommunicationDirection" AS ENUM ('INBOUND', 'OUTBOUND', 'INTERNAL');

-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('DRAFT', 'SENT', 'DELIVERED', 'READ', 'REPLIED', 'BOUNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('STATUS_UPDATE', 'DOCUMENT_REQUEST', 'PAYMENT_REMINDER', 'TASK_ASSIGNMENT', 'MILESTONE_REACHED', 'ISSUE_ALERT', 'DEADLINE_REMINDER', 'GENERAL_UPDATE');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionIssueCategory" AS ENUM ('DOCUMENTATION', 'PAYMENT', 'LEGAL', 'TECHNICAL', 'COMMUNICATION', 'COMPLIANCE', 'PROPERTY', 'MORTGAGE', 'HTB', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionIssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TransactionIssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "ConveyancingStatus" AS ENUM ('NEW', 'INSTRUCTION_RECEIVED', 'DUE_DILIGENCE', 'CONTRACT_PREP', 'CONTRACT_ISSUED', 'CONTRACT_NEGOTIATION', 'CONTRACT_SIGNED', 'DEPOSIT_RECEIVED', 'COMPLETION_PENDING', 'COMPLETED', 'ABORTED');

-- CreateEnum
CREATE TYPE "ConveyancingType" AS ENUM ('PURCHASE', 'SALE', 'REMORTGAGE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('DUE_DILIGENCE', 'CONTRACT_PREPARATION', 'SEARCHES', 'FINANCIAL', 'COMPLIANCE', 'COMMUNICATION', 'COMPLETION');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ConveyancingDocumentType" AS ENUM ('CONTRACT', 'TITLE_DEED', 'SEARCH_RESULT', 'AML_CHECK', 'PROOF_OF_FUNDS', 'IDENTITY_VERIFICATION', 'MORTGAGE_OFFER', 'BUILDING_REPORT', 'PLANNING_PERMISSION', 'CORRESPONDENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ConveyancingDocumentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FINAL');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('GENERAL', 'LEGAL', 'CLIENT_COMMUNICATION', 'INTERNAL', 'WARNING');

-- CreateEnum
CREATE TYPE "AMLStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REFERRED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('PENDING', 'CLEAR', 'HIT', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'UNACCEPTABLE');

-- CreateEnum
CREATE TYPE "FundSource" AS ENUM ('SALARY', 'SAVINGS', 'INVESTMENT', 'INHERITANCE', 'GIFT', 'PROPERTY_SALE', 'BUSINESS_INCOME', 'LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('PROFESSIONAL_FEE', 'DISBURSEMENT', 'SEARCH_FEE', 'REGISTRATION_FEE', 'STAMP_DUTY', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'INVOICED', 'PAID', 'WAIVED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'SENT', 'VIEWED', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'VIRTUAL_TOUR', 'FLOOR_PLAN');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BROCHURE', 'PRICE_LIST', 'SPECIFICATION', 'CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "AmenityType" AS ENUM ('SHOPPING', 'EDUCATION', 'TRANSPORT', 'HEALTHCARE', 'LEISURE', 'DINING');

-- CreateEnum
CREATE TYPE "ViewingStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'CONVERTED_TO_SALE');

-- CreateEnum
CREATE TYPE "DevelopmentUnitStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SALE_AGREED', 'SOLD', 'COMPLETED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DevelopmentReservationStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "ViewingType" AS ENUM ('PHYSICAL', 'VIRTUAL', 'SHOW_HOUSE', 'OPEN_DAY');

-- CreateEnum
CREATE TYPE "AmenityCategory" AS ENUM ('RECREATION', 'COMMUNITY', 'CHILDREN', 'LANDSCAPE', 'SECURITY', 'PARKING', 'TRANSPORT', 'UTILITIES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "roles" "UserRole"[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "kycStatus" "KYCStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "organization" TEXT,
    "position" TEXT,
    "avatar" TEXT,
    "preferences" JSONB,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "metadata" JSONB,
    "locationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MfaSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "method" "MfaMethod" NOT NULL DEFAULT 'TOTP',
    "secret" TEXT,
    "backupCodes" TEXT[],
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MfaSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MfaToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "MfaTokenType" NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MfaToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "conditions" JSONB,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaveDate" TIMESTAMP(3),

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentJourneyPhase" TEXT NOT NULL DEFAULT 'planning',
    "financialDetails" JSONB,
    "preferences" JSONB,
    "governmentSchemes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "reservationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agreementSigned" BOOLEAN NOT NULL DEFAULT false,
    "agreementDocument" TEXT,
    "expiryDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortgageTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "lenderName" TEXT,
    "amount" DOUBLE PRECISION,
    "aipDate" TIMESTAMP(3),
    "aipExpiryDate" TIMESTAMP(3),
    "formalOfferDate" TIMESTAMP(3),
    "conditions" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MortgageTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnagList" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnagList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnagItem" (
    "id" TEXT NOT NULL,
    "snagListId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "images" TEXT[],
    "developerNotes" TEXT,
    "fixedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "saleId" TEXT,

    CONSTRAINT "SnagItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePackItem" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "issuer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "eircode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Ireland',
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Development" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "developerId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "status" "DevelopmentStatus" NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "marketingStatus" JSONB NOT NULL,
    "salesStatus" JSONB NOT NULL,
    "constructionStatus" JSONB NOT NULL,
    "complianceStatus" JSONB NOT NULL,
    "timelineId" TEXT,
    "financialsId" TEXT,
    "mainImage" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "sitePlanUrl" TEXT,
    "brochureUrl" TEXT,
    "virtualTourUrl" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "features" TEXT[],
    "amenities" TEXT[],
    "buildingSpecs" JSONB,
    "buildingType" TEXT,
    "completionDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "publishedDate" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "awards" TEXT[],

    CONSTRAINT "Development_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTimeline" (
    "id" TEXT NOT NULL,
    "planningSubmissionDate" TIMESTAMP(3) NOT NULL,
    "planningDecisionDate" TIMESTAMP(3),
    "constructionStartDate" TIMESTAMP(3),
    "constructionEndDate" TIMESTAMP(3),
    "marketingLaunchDate" TIMESTAMP(3),
    "salesLaunchDate" TIMESTAMP(3),

    CONSTRAINT "ProjectTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "status" "MilestoneStatus" NOT NULL,
    "timelineId" TEXT NOT NULL,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestoneDependency" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,

    CONSTRAINT "ProjectMilestoneDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitTypeId" TEXT,
    "unitNumber" TEXT,
    "name" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" DOUBLE PRECISION NOT NULL,
    "floors" INTEGER NOT NULL,
    "parkingSpaces" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "status" "UnitStatus" NOT NULL,
    "berRating" TEXT NOT NULL,
    "features" TEXT[],
    "primaryImage" TEXT NOT NULL,
    "images" TEXT[],
    "floorplans" TEXT[],
    "virtualTourUrl" TEXT,
    "block" TEXT,
    "floor" INTEGER,
    "aspect" TEXT,
    "availableFrom" TIMESTAMP(3),
    "reservationEndDate" TIMESTAMP(3),
    "lastViewed" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitOutdoorSpace" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "type" "OutdoorSpaceType" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "orientation" TEXT,
    "description" TEXT,
    "features" TEXT[],
    "images" TEXT[],

    CONSTRAINT "UnitOutdoorSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitRoom" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "features" TEXT[],
    "images" TEXT[],

    CONSTRAINT "UnitRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitCustomizationOption" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "category" "CustomizationCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseOption" BOOLEAN NOT NULL,
    "additionalCost" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "modelPath" TEXT,
    "installationTimeframe" INTEGER,
    "supplierInfo" JSONB,
    "specificationDetails" TEXT,
    "dimensions" JSONB,
    "technicalRequirements" TEXT,
    "maintenanceInfo" TEXT,
    "warrantyPeriod" INTEGER,

    CONSTRAINT "UnitCustomizationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitCustomizationOptionAlternative" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "alternativeOptionId" TEXT NOT NULL,

    CONSTRAINT "UnitCustomizationOptionAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitCustomizationOptionRequirement" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "requiredOptionId" TEXT NOT NULL,

    CONSTRAINT "UnitCustomizationOptionRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitCustomizationOptionIncompatibility" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "incompatibleOptionId" TEXT NOT NULL,

    CONSTRAINT "UnitCustomizationOptionIncompatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomizationSelection" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "status" "CustomizationStatus" NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "submittedDate" TIMESTAMP(3),
    "approvedDate" TIMESTAMP(3),
    "deadlineDate" TIMESTAMP(3),
    "meetingBooked" BOOLEAN NOT NULL DEFAULT false,
    "meetingDate" TIMESTAMP(3),
    "transactionId" TEXT,

    CONSTRAINT "CustomizationSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedOption" (
    "id" TEXT NOT NULL,
    "selectionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "color" TEXT,
    "finish" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SelectedOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedByName" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "tags" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "relatedTo" JSONB,
    "metadata" JSONB,
    "signatureRequired" BOOLEAN NOT NULL DEFAULT false,
    "signatureStatus" TEXT,
    "organizationId" TEXT,
    "developmentId" TEXT,
    "unitId" TEXT,
    "saleId" TEXT,
    "approvedById" TEXT,
    "reservationId" TEXT,
    "mortgageTrackingId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "changes" TEXT,
    "size" INTEGER NOT NULL,
    "checksum" TEXT,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentWorkflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "documentTypes" TEXT[],
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "DocumentWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentWorkflowStage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "timeoutDays" INTEGER,
    "notifyOnEntry" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnExit" BOOLEAN NOT NULL DEFAULT false,
    "workflowId" TEXT NOT NULL,

    CONSTRAINT "DocumentWorkflowStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApproverConfig" (
    "id" TEXT NOT NULL,
    "approverType" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "approverName" TEXT,
    "requirementType" TEXT NOT NULL,
    "canDelegate" BOOLEAN NOT NULL DEFAULT false,
    "stageId" TEXT NOT NULL,

    CONSTRAINT "ApproverConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fieldType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "defaultValue" TEXT,
    "validationRegex" TEXT,
    "validationMessage" TEXT,
    "stageId" TEXT NOT NULL,

    CONSTRAINT "DocumentCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentWorkflowInstance" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "currentStageId" TEXT,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "customFieldValues" JSONB,
    "notes" TEXT,

    CONSTRAINT "DocumentWorkflowInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentWorkflowHistory" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "enteredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DocumentWorkflowHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentApproval" (
    "id" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "delegatedToId" TEXT,

    CONSTRAINT "DocumentApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSignature" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "signerId" TEXT NOT NULL,
    "signatureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signatureImageUrl" TEXT,
    "signaturePosition" JSONB,
    "signatureMethod" TEXT NOT NULL,
    "ipAddress" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationMethod" TEXT,
    "certificateUrl" TEXT,

    CONSTRAINT "DocumentSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellingAgentId" TEXT,
    "solicitorId" TEXT,
    "buyerSolicitorId" TEXT,
    "status" "SaleStatus" NOT NULL,
    "contractStatus" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "customizationCost" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "completionDate" TIMESTAMP(3),
    "handoverDate" TIMESTAMP(3),
    "keyCollectionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "metadata" JSONB,
    "tags" TEXT[],
    "developmentId" TEXT NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleStatusHistory" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "previousStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "SaleStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleTimeline" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "initialEnquiryDate" TIMESTAMP(3),
    "firstViewingDate" TIMESTAMP(3),
    "reservationDate" TIMESTAMP(3),
    "reservationExpiryDate" TIMESTAMP(3),
    "contractIssuedDate" TIMESTAMP(3),
    "contractReturnDeadline" TIMESTAMP(3),
    "contractReturnedDate" TIMESTAMP(3),
    "depositDueDate" TIMESTAMP(3),
    "depositPaidDate" TIMESTAMP(3),
    "mortgageApprovalDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "fundsDisbursedDate" TIMESTAMP(3),
    "saleCompletedDate" TIMESTAMP(3),
    "handoverDate" TIMESTAMP(3),
    "keyCollectionDate" TIMESTAMP(3),
    "warrantyStartDate" TIMESTAMP(3),
    "warrantyEndDate" TIMESTAMP(3),

    CONSTRAINT "SaleTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "initialAmount" DOUBLE PRECISION NOT NULL,
    "initialAmountPercentage" DOUBLE PRECISION NOT NULL,
    "initialPaidDate" TIMESTAMP(3),
    "balanceAmount" DOUBLE PRECISION NOT NULL,
    "balanceDueDate" TIMESTAMP(3),
    "balancePaidDate" TIMESTAMP(3),
    "totalPaid" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "receiptDocumentIds" TEXT[],

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortgageDetails" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "lender" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "term" INTEGER NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "approvalInPrincipleDate" TIMESTAMP(3),
    "finalApprovalDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "broker" TEXT,
    "brokerFee" DOUBLE PRECISION,
    "loanType" TEXT NOT NULL,
    "documentIds" TEXT[],
    "notes" TEXT,
    "applicationDate" TIMESTAMP(3),
    "offerExpiryDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "drawdownDate" TIMESTAMP(3),

    CONSTRAINT "MortgageDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HTBDetails" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "approvalDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "claimSubmissionDate" TIMESTAMP(3),
    "claimPaymentDate" TIMESTAMP(3),
    "documentIds" TEXT[],
    "notes" TEXT,
    "accessCode" TEXT,
    "claimCode" TEXT,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "HTBDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleNote" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,

    CONSTRAINT "SaleNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleTask" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "notifyBeforeDays" INTEGER,
    "isReminderSent" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" JSONB,

    CONSTRAINT "SaleTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "specializations" TEXT[],
    "status" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "insuranceDetails" JSONB,
    "professionalBio" TEXT,
    "website" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "vatNumber" TEXT,
    "companyNumber" TEXT NOT NULL,
    "establishedDate" TIMESTAMP(3),
    "insuranceDetails" JSONB,
    "certifications" TEXT[],
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceArea" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "cities" TEXT[],

    CONSTRAINT "ServiceArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "dateObtained" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "certificateDocumentId" TEXT,
    "verificationUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalDocument" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProfessionalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalAppointment" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "contractDocumentId" TEXT,
    "feeStructure" JSONB,
    "responsibilities" TEXT[],
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalAssignment" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalReview" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "developmentId" TEXT,
    "saleId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "response" TEXT,
    "responseDate" TIMESTAMP(3),

    CONSTRAINT "ProfessionalReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plannedStartDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "projectManagerId" TEXT NOT NULL,
    "assignedCertifierId" TEXT,
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "constructionStage" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPhase" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "plannedStartDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "documentIds" TEXT[],

    CONSTRAINT "ProjectPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPhaseDependency" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ProjectPhaseDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone2" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "isKeyMilestone" BOOLEAN NOT NULL DEFAULT false,
    "notifyStakeholders" BOOLEAN NOT NULL DEFAULT true,
    "responsiblePartyId" TEXT NOT NULL,
    "verificationMethod" TEXT NOT NULL,
    "completionCriteria" TEXT[],
    "documentIds" TEXT[],

    CONSTRAINT "ProjectMilestone2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestoneDependency2" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,

    CONSTRAINT "ProjectMilestoneDependency2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseId" TEXT,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "plannedStartDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION NOT NULL,
    "actualHours" DOUBLE PRECISION,
    "progressPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relatedTo" JSONB,
    "tags" TEXT[],
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "isOnCriticalPath" BOOLEAN NOT NULL DEFAULT false,
    "parentTaskId" TEXT,
    "attachmentIds" TEXT[],

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,

    CONSTRAINT "ProjectTaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentIds" TEXT[],
    "mentions" TEXT[],
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "conveyancingTaskId" TEXT,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRisk" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "probability" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "identifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identifiedById" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,
    "mitigationStrategy" TEXT NOT NULL,
    "mitigationTaskIds" TEXT[],
    "contingencyPlan" TEXT NOT NULL,
    "contingencyBudget" DOUBLE PRECISION,
    "earlyWarningIndicators" TEXT[],
    "affectedAreas" TEXT[],
    "riskRegisterRanking" INTEGER NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectIssue" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "reportedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportedById" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "resolvedDate" TIMESTAMP(3),
    "resolutionDetails" TEXT,
    "impact" TEXT NOT NULL,
    "rootCause" TEXT,
    "preventativeMeasures" TEXT,
    "relatedRiskIds" TEXT[],
    "resolutionTaskIds" TEXT[],
    "affectedUnitIds" TEXT[],
    "documentIds" TEXT[],
    "isEscalated" BOOLEAN NOT NULL DEFAULT false,
    "escalationLevel" INTEGER,
    "escalatedToId" TEXT,

    CONSTRAINT "ProjectIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueComment" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentIds" TEXT[],
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),

    CONSTRAINT "IssueComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructionLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "weather" JSONB NOT NULL,
    "crews" JSONB[],
    "equipment" JSONB[],
    "workCompleted" JSONB[],
    "materials" JSONB[],
    "delays" JSONB[],
    "visitors" JSONB[],
    "safetyIncidents" JSONB[],
    "qualityIssues" JSONB[],
    "notes" TEXT NOT NULL,
    "photoIds" TEXT[],
    "nextDayPlan" TEXT NOT NULL,
    "issues" TEXT[],
    "submittedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedById" TEXT,
    "approvedTimestamp" TIMESTAMP(3),

    CONSTRAINT "ConstructionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "inspectorRole" TEXT NOT NULL,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "completed" TIMESTAMP(3),
    "location" TEXT NOT NULL,
    "unitId" TEXT,
    "status" TEXT NOT NULL,
    "result" TEXT,
    "notes" TEXT NOT NULL,
    "photoIds" TEXT[],
    "documentIds" TEXT[],
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "followUpInspectionId" TEXT,
    "isReinspection" BOOLEAN NOT NULL DEFAULT false,
    "previousInspectionId" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionFinding" (
    "id" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "photoIds" TEXT[],
    "assignedToId" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "closedDate" TIMESTAMP(3),
    "closedById" TEXT,
    "verificationRequired" BOOLEAN NOT NULL DEFAULT false,
    "verifiedById" TEXT,
    "verifiedDate" TIMESTAMP(3),

    CONSTRAINT "InspectionFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "visibleTo" TEXT[],
    "attachmentIds" TEXT[],
    "affectedPhaseIds" TEXT[],
    "affectedMilestoneIds" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "virtualMeetingLink" TEXT,
    "organizerId" TEXT NOT NULL,
    "recurrence" JSONB,
    "documentIds" TEXT[],
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAttendee" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "attended" BOOLEAN,

    CONSTRAINT "MeetingAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "presenterId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "documentIds" TEXT[],
    "status" TEXT NOT NULL,

    CONSTRAINT "AgendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingMinutes" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "attendees" TEXT[],
    "absentees" TEXT[],
    "discussions" JSONB[],
    "approvedById" TEXT,
    "approvedDate" TIMESTAMP(3),
    "distributedOn" TIMESTAMP(3),
    "distributedTo" TEXT[],

    CONSTRAINT "MeetingMinutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingActionItem" (
    "id" TEXT NOT NULL,
    "minutesId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completedDate" TIMESTAMP(3),
    "notes" TEXT,
    "relatedTaskId" TEXT,

    CONSTRAINT "MeetingActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthAndSafetyPlan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "approvedById" TEXT NOT NULL,
    "approvedDate" TIMESTAMP(3) NOT NULL,
    "lastReviewDate" TIMESTAMP(3) NOT NULL,
    "nextReviewDate" TIMESTAMP(3) NOT NULL,
    "responsiblePersonId" TEXT NOT NULL,
    "riskAssessmentIds" TEXT[],

    CONSTRAINT "HealthAndSafetyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "isOnSite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyInspection" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "items" JSONB[],
    "issues" JSONB[],
    "score" INTEGER,
    "notes" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "documentIds" TEXT[],

    CONSTRAINT "SafetyInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyIncident" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "involved" TEXT[],
    "witnesses" TEXT[],
    "injuries" JSONB[],
    "immediateActions" TEXT NOT NULL,
    "rootCause" TEXT,
    "preventativeMeasures" TEXT,
    "reportedById" TEXT NOT NULL,
    "reportedDate" TIMESTAMP(3) NOT NULL,
    "reportNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "investigationFindings" TEXT,
    "correctiveActions" JSONB[],
    "documentIds" TEXT[],
    "reportedToAuthorities" BOOLEAN NOT NULL DEFAULT false,
    "reportedToAuthoritiesDate" TIMESTAMP(3),
    "authorityReference" TEXT,

    CONSTRAINT "SafetyIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trainer" TEXT NOT NULL,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "attendees" JSONB[],
    "documentIds" TEXT[],
    "notes" TEXT,

    CONSTRAINT "TrainingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolboxTalk" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "presenterId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attendees" TEXT[],
    "signatures" TEXT[],
    "documentIds" TEXT[],
    "notes" TEXT,

    CONSTRAINT "ToolboxTalk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitIds" TEXT[],
    "investmentType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "equity" DOUBLE PRECISION,
    "ownershipStructure" TEXT,
    "expectedReturn" DOUBLE PRECISION NOT NULL,
    "projectedIRR" DOUBLE PRECISION,
    "projectMultiple" DOUBLE PRECISION,
    "commitmentDate" TIMESTAMP(3) NOT NULL,
    "fundingDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "exitDate" TIMESTAMP(3),
    "investmentVehicleId" TEXT,
    "legalEntity" TEXT,
    "coInvestorIds" TEXT[],
    "investmentAgreementId" TEXT NOT NULL,
    "termSheetId" TEXT,
    "documentIds" TEXT[],
    "currentValue" DOUBLE PRECISION NOT NULL,
    "valuationDate" TIMESTAMP(3) NOT NULL,
    "totalReturns" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribution" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "distributionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "distributionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paymentReference" TEXT,
    "documentIds" TEXT[],
    "taxWithheld" DOUBLE PRECISION,
    "netAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentUpdate" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "metrics" JSONB NOT NULL,
    "documentIds" TEXT[],
    "sentToInvestors" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgements" JSONB[],

    CONSTRAINT "InvestmentUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentOpportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "minimumInvestment" DOUBLE PRECISION NOT NULL,
    "targetRaise" DOUBLE PRECISION NOT NULL,
    "maxRaise" DOUBLE PRECISION NOT NULL,
    "totalRaised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "investmentType" TEXT NOT NULL,
    "projectedReturns" JSONB NOT NULL,
    "launchDate" TIMESTAMP(3) NOT NULL,
    "closingDate" TIMESTAMP(3) NOT NULL,
    "constructionStartDate" TIMESTAMP(3),
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "estimatedExitDate" TIMESTAMP(3) NOT NULL,
    "highlights" TEXT[],
    "riskFactors" TEXT[],
    "images" TEXT[],
    "brochureUrl" TEXT,
    "financialProjectionsUrl" TEXT,
    "investmentStructure" TEXT NOT NULL,
    "feesStructure" JSONB NOT NULL,
    "documentIds" TEXT[],
    "visibleTo" TEXT NOT NULL,
    "selectedInvestorIds" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "interestedInvestors" JSONB[],
    "commitments" JSONB[],
    "createdById" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorWatchlistUnit" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "InvestorWatchlistUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "objectives" TEXT[],
    "successCriteria" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "actualSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "performance" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "assignedToIds" TEXT[],
    "approvedById" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "tags" TEXT[],

    CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingChannel" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "actualSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER,
    "inquiries" INTEGER NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costPerInquiry" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costPerImpression" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "trackingCodes" TEXT[],
    "trackingUrls" TEXT[],
    "platform" TEXT,
    "targetAudience" TEXT,
    "audienceSize" INTEGER,
    "geographicFocus" TEXT[],
    "notes" TEXT,
    "tags" TEXT[],

    CONSTRAINT "MarketingChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingActivity" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plannedStartDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "budget" DOUBLE PRECISION NOT NULL,
    "actualSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assignedToIds" TEXT[],
    "externalVendors" TEXT[],
    "metrics" JSONB,
    "results" TEXT,
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreativeAsset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "description" TEXT,
    "usedIn" JSONB NOT NULL,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "createdBy" TEXT NOT NULL,
    "designer" TEXT,
    "agency" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "versionNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedDate" TIMESTAMP(3),
    "rightsInformation" TEXT,
    "usage" TEXT NOT NULL,
    "usageRights" TEXT,
    "tags" TEXT[],
    "dimensions" TEXT,
    "size" INTEGER,
    "thumbnailUrl" TEXT,

    CONSTRAINT "CreativeAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "campaignId" TEXT,
    "channel" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "assignedToId" TEXT,
    "interestedInDevelopmentIds" TEXT[],
    "interestedInUnitIds" TEXT[],
    "propertyType" TEXT[],
    "bedrooms" INTEGER[],
    "budget" JSONB,
    "desiredMoveInDate" TIMESTAMP(3),
    "firstContactDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastContactDate" TIMESTAMP(3),
    "nextFollowUpDate" TIMESTAMP(3),
    "documentIds" TEXT[],
    "notes" TEXT[],
    "convertedToSaleId" TEXT,
    "conversionDate" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadStatusHistory" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LeadStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadInteraction" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "duration" INTEGER,
    "documentIds" TEXT[],
    "location" TEXT,
    "outcome" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "followUpAssignedToId" TEXT,
    "sentiment" TEXT,
    "tags" TEXT[],

    CONSTRAINT "LeadInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Viewing" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "attendees" JSONB[],
    "location" TEXT NOT NULL,
    "meetingPoint" TEXT,
    "virtualMeetingLink" TEXT,
    "privateParkingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "specialRequirements" TEXT,
    "feedback" JSONB,
    "followUp" JSONB NOT NULL,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentDate" TIMESTAMP(3),
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "confirmationSentDate" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Viewing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserRoleMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'ENQUIRY',
    "stage" "TransactionStage" NOT NULL DEFAULT 'INITIAL_ENQUIRY',
    "type" "TransactionType" NOT NULL DEFAULT 'PURCHASE',
    "buyerId" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "agentId" TEXT,
    "solicitorId" TEXT,
    "buyerSolicitorId" TEXT,
    "agreedPrice" DOUBLE PRECISION,
    "depositPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstandingBalance" DOUBLE PRECISION,
    "enquiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewingDate" TIMESTAMP(3),
    "reservationDate" TIMESTAMP(3),
    "contractDate" TIMESTAMP(3),
    "mortgageApprovalDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "handoverDate" TIMESTAMP(3),
    "mortgageRequired" BOOLEAN NOT NULL DEFAULT true,
    "mortgageApproved" BOOLEAN NOT NULL DEFAULT false,
    "mortgageProvider" TEXT,
    "mortgageAmount" DOUBLE PRECISION,
    "mortgageReference" TEXT,
    "helpToBuyUsed" BOOLEAN NOT NULL DEFAULT false,
    "htbAmount" DOUBLE PRECISION,
    "htbReference" TEXT,
    "htbApplicationDate" TIMESTAMP(3),
    "htbApprovalDate" TIMESTAMP(3),
    "contractsSent" BOOLEAN NOT NULL DEFAULT false,
    "contractsSigned" BOOLEAN NOT NULL DEFAULT false,
    "contractsExchanged" BOOLEAN NOT NULL DEFAULT false,
    "titleDeeds" TEXT,
    "kycCompleted" BOOLEAN NOT NULL DEFAULT false,
    "amlCheckCompleted" BOOLEAN NOT NULL DEFAULT false,
    "sourceOfFundsVerified" BOOLEAN NOT NULL DEFAULT false,
    "customizationDeadline" TIMESTAMP(3),
    "customizationsLocked" BOOLEAN NOT NULL DEFAULT false,
    "preferredContactMethod" TEXT NOT NULL DEFAULT 'email',
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "referralSource" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionEvent" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "eventType" "TransactionEventType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "performedBy" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "TransactionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDocument" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionDocumentType" NOT NULL,
    "category" "TransactionDocumentCategory" NOT NULL,
    "status" "TransactionDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "tags" TEXT[],
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" TEXT NOT NULL DEFAULT 'buyer',
    "requiresSignature" BOOLEAN NOT NULL DEFAULT false,
    "signedBy" TEXT[],
    "signedAt" TIMESTAMP(3)[],
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedBy" TEXT,
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "TransactionDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionPayment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "type" "TransactionPaymentType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "TransactionPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT NOT NULL,
    "fromAccount" TEXT,
    "toAccount" TEXT,
    "bankReference" TEXT,
    "processingFee" DOUBLE PRECISION,
    "netAmount" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "clearedDate" TIMESTAMP(3),
    "description" TEXT,
    "invoiceNumber" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionTask" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "TransactionTaskCategory" NOT NULL,
    "priority" "TransactionTaskPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "TransactionTaskStatus" NOT NULL DEFAULT 'PENDING',
    "assignedTo" TEXT,
    "assignedBy" TEXT,
    "dueDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "dependsOn" TEXT[],
    "blockedBy" TEXT[],
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "automationRule" TEXT,
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionMilestone" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stage" "TransactionStage" NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "TransactionMilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "requiredTasks" TEXT[],
    "requiredDocs" TEXT[],
    "requiredPayments" TEXT[],
    "targetDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "autoComplete" BOOLEAN NOT NULL DEFAULT false,
    "completionRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionCommunication" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "type" "CommunicationType" NOT NULL,
    "direction" "CommunicationDirection" NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "ccIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "status" "CommunicationStatus" NOT NULL DEFAULT 'SENT',
    "readAt" TIMESTAMP(3),
    "channel" TEXT NOT NULL,
    "threadId" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionCommunication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionNotification" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "recipient" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "channels" TEXT[] DEFAULT ARRAY['IN_APP']::TEXT[],
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "pushSent" BOOLEAN NOT NULL DEFAULT false,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "nextRetryAt" TIMESTAMP(3),
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionIssue" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TransactionIssueCategory" NOT NULL,
    "severity" "TransactionIssueSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "TransactionIssueStatus" NOT NULL DEFAULT 'OPEN',
    "reportedBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "resolvedBy" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "resolution" TEXT,
    "rootCause" TEXT,
    "preventiveMeasures" TEXT,
    "impactedStage" "TransactionStage",
    "impactedTasks" TEXT[],
    "estimatedDelay" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionTimeline" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "firstContactDate" TIMESTAMP(3),
    "propertyViewingDate" TIMESTAMP(3),
    "offerMadeDate" TIMESTAMP(3),
    "offerAcceptedDate" TIMESTAMP(3),
    "reservationDate" TIMESTAMP(3),
    "contractIssuedDate" TIMESTAMP(3),
    "contractSignedDate" TIMESTAMP(3),
    "mortgageAppliedDate" TIMESTAMP(3),
    "mortgageApprovedDate" TIMESTAMP(3),
    "exchangeDate" TIMESTAMP(3),
    "completionDueDate" TIMESTAMP(3),
    "completionActualDate" TIMESTAMP(3),
    "keysHandoverDate" TIMESTAMP(3),
    "moveInDate" TIMESTAMP(3),
    "enquiryToViewingDays" INTEGER,
    "viewingToOfferDays" INTEGER,
    "offerToReservationDays" INTEGER,
    "reservationToContractDays" INTEGER,
    "contractToMortgageDays" INTEGER,
    "mortgageToExchangeDays" INTEGER,
    "exchangeToCompletionDays" INTEGER,
    "totalDurationDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConveyancingCase" (
    "id" TEXT NOT NULL,
    "caseReference" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "ConveyancingStatus" NOT NULL DEFAULT 'NEW',
    "type" "ConveyancingType" NOT NULL DEFAULT 'PURCHASE',
    "solicitorId" TEXT NOT NULL,
    "buyerId" TEXT,
    "sellerId" TEXT,
    "agentId" TEXT,
    "propertyAddress" TEXT NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "stampDuty" DOUBLE PRECISION,
    "instructionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposedCompletion" TIMESTAMP(3),
    "actualCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyancingCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConveyancingTask" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "TaskCategory" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "assignedTo" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "dependsOn" TEXT[],
    "blockedBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyancingTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConveyancingDocument" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "taskId" TEXT,
    "name" TEXT NOT NULL,
    "type" "ConveyancingDocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" "ConveyancingDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "accessControl" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyancingDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConveyancingNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NoteType" NOT NULL DEFAULT 'GENERAL',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyancingNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AMLCheck" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "AMLStatus" NOT NULL DEFAULT 'PENDING',
    "idVerificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "idDocuments" JSONB[],
    "addressVerificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "addressDocuments" JSONB[],
    "pepCheckStatus" "CheckStatus" NOT NULL DEFAULT 'PENDING',
    "sanctionsCheckStatus" "CheckStatus" NOT NULL DEFAULT 'PENDING',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "riskFactors" JSONB,
    "completedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AMLCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceOfFunds" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "source" "FundSource" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "documents" JSONB[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceOfFunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalFee" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "FeeCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 0.23,
    "vatAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConveyancingInvoice" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "vatAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issuedDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "lineItems" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyancingInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" DOUBLE PRECISION NOT NULL,
    "type" "PropertyType" NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "priceFrom" DOUBLE PRECISION NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "availableUnits" INTEGER NOT NULL DEFAULT 0,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleOfAccommodation" (
    "id" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleOfAccommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorPlan" (
    "id" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentMedia" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentDocument" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "type" "AmenityType" NOT NULL,
    "name" TEXT NOT NULL,
    "distance" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customization" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "additionalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentUnit" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "block" TEXT,
    "floor" INTEGER NOT NULL,
    "status" "DevelopmentUnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "orientation" TEXT,
    "aspect" TEXT,
    "viewType" TEXT,
    "balconyArea" DOUBLE PRECISION,
    "terraceArea" DOUBLE PRECISION,
    "gardenArea" DOUBLE PRECISION,
    "estimatedCompletionDate" TIMESTAMP(3),
    "actualCompletionDate" TIMESTAMP(3),
    "customizationDeadline" TIMESTAMP(3),
    "floorplanVariation" TEXT,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentAmenity" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AmenityCategory" NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completionDate" TIMESTAMP(3),
    "estimatedCompletionDate" TIMESTAMP(3),
    "features" TEXT[],
    "openingHours" JSONB,
    "rules" TEXT[],
    "images" TEXT[],
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentViewing" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitId" TEXT,
    "viewerId" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 30,
    "status" "ViewingStatus" NOT NULL DEFAULT 'REQUESTED',
    "type" "ViewingType" NOT NULL,
    "notes" TEXT,
    "feedback" JSONB,
    "interestedLevel" INTEGER,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentViewing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentReservation" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "depositPaidDate" TIMESTAMP(3),
    "status" "DevelopmentReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "agreedPrice" DOUBLE PRECISION NOT NULL,
    "specialConditions" TEXT[],
    "referenceNumber" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentSale" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "agreedPrice" DOUBLE PRECISION NOT NULL,
    "deposit" JSONB NOT NULL,
    "contractSigned" BOOLEAN NOT NULL DEFAULT false,
    "contractSignedDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "keysHandedOver" BOOLEAN NOT NULL DEFAULT false,
    "handoverDate" TIMESTAMP(3),
    "solicitor" TEXT,
    "mortgageProvider" TEXT,
    "mortgageApproved" BOOLEAN NOT NULL DEFAULT false,
    "stampDutyPaid" BOOLEAN NOT NULL DEFAULT false,
    "htbUsed" BOOLEAN NOT NULL DEFAULT false,
    "htbAmount" DOUBLE PRECISION,
    "referenceNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyView" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSchedule" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UnitToViewing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UnitToViewing_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CustomizationSelectionToDocument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CustomizationSelectionToDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserKycDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserKycDocuments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentToProjectMilestone" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentToProjectMilestone_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CreativeAssetToMarketingCampaign" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CreativeAssetToMarketingCampaign_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CreativeAssetToMarketingChannel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CreativeAssetToMarketingChannel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CreativeAssetToMarketingActivity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CreativeAssetToMarketingActivity_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "AuthLog_userId_idx" ON "AuthLog"("userId");

-- CreateIndex
CREATE INDEX "AuthLog_eventType_idx" ON "AuthLog"("eventType");

-- CreateIndex
CREATE INDEX "AuthLog_timestamp_idx" ON "AuthLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "MfaSettings_userId_key" ON "MfaSettings"("userId");

-- CreateIndex
CREATE INDEX "MfaToken_userId_idx" ON "MfaToken"("userId");

-- CreateIndex
CREATE INDEX "MfaToken_token_idx" ON "MfaToken"("token");

-- CreateIndex
CREATE INDEX "MfaToken_expiresAt_idx" ON "MfaToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProfile_userId_key" ON "BuyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MortgageTracking_userId_key" ON "MortgageTracking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Development_slug_key" ON "Development"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Development_timelineId_key" ON "Development"("timelineId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMilestoneDependency_milestoneId_dependsOnId_key" ON "ProjectMilestoneDependency"("milestoneId", "dependsOnId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitCustomizationOptionAlternative_optionId_alternativeOpti_key" ON "UnitCustomizationOptionAlternative"("optionId", "alternativeOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitCustomizationOptionRequirement_optionId_requiredOptionI_key" ON "UnitCustomizationOptionRequirement"("optionId", "requiredOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitCustomizationOptionIncompatibility_optionId_incompatibl_key" ON "UnitCustomizationOptionIncompatibility"("optionId", "incompatibleOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentWorkflowInstance_documentId_key" ON "DocumentWorkflowInstance"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleTimeline_saleId_key" ON "SaleTimeline"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_saleId_key" ON "Deposit"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "MortgageDetails_saleId_key" ON "MortgageDetails"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "HTBDetails_saleId_key" ON "HTBDetails"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPhaseDependency_phaseId_dependsOnId_key" ON "ProjectPhaseDependency"("phaseId", "dependsOnId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMilestoneDependency2_milestoneId_dependsOnId_key" ON "ProjectMilestoneDependency2"("milestoneId", "dependsOnId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTaskDependency_taskId_dependsOnId_key" ON "ProjectTaskDependency"("taskId", "dependsOnId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingMinutes_meetingId_key" ON "MeetingMinutes"("meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthAndSafetyPlan_projectId_key" ON "HealthAndSafetyPlan"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorWatchlistUnit_investorId_unitId_key" ON "InvestorWatchlistUnit"("investorId", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleMapping_userId_role_key" ON "UserRoleMapping"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_referenceNumber_key" ON "Transaction"("referenceNumber");

-- CreateIndex
CREATE INDEX "Transaction_buyerId_idx" ON "Transaction"("buyerId");

-- CreateIndex
CREATE INDEX "Transaction_unitId_idx" ON "Transaction"("unitId");

-- CreateIndex
CREATE INDEX "Transaction_developmentId_idx" ON "Transaction"("developmentId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_stage_idx" ON "Transaction"("stage");

-- CreateIndex
CREATE INDEX "Transaction_referenceNumber_idx" ON "Transaction"("referenceNumber");

-- CreateIndex
CREATE INDEX "TransactionEvent_transactionId_idx" ON "TransactionEvent"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionEvent_eventType_idx" ON "TransactionEvent"("eventType");

-- CreateIndex
CREATE INDEX "TransactionEvent_performedAt_idx" ON "TransactionEvent"("performedAt");

-- CreateIndex
CREATE INDEX "TransactionDocument_transactionId_idx" ON "TransactionDocument"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionDocument_type_idx" ON "TransactionDocument"("type");

-- CreateIndex
CREATE INDEX "TransactionDocument_status_idx" ON "TransactionDocument"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionPayment_reference_key" ON "TransactionPayment"("reference");

-- CreateIndex
CREATE INDEX "TransactionPayment_transactionId_idx" ON "TransactionPayment"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionPayment_status_idx" ON "TransactionPayment"("status");

-- CreateIndex
CREATE INDEX "TransactionPayment_reference_idx" ON "TransactionPayment"("reference");

-- CreateIndex
CREATE INDEX "TransactionTask_transactionId_idx" ON "TransactionTask"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionTask_status_idx" ON "TransactionTask"("status");

-- CreateIndex
CREATE INDEX "TransactionTask_assignedTo_idx" ON "TransactionTask"("assignedTo");

-- CreateIndex
CREATE INDEX "TransactionTask_dueDate_idx" ON "TransactionTask"("dueDate");

-- CreateIndex
CREATE INDEX "TransactionMilestone_transactionId_idx" ON "TransactionMilestone"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionMilestone_stage_idx" ON "TransactionMilestone"("stage");

-- CreateIndex
CREATE INDEX "TransactionMilestone_order_idx" ON "TransactionMilestone"("order");

-- CreateIndex
CREATE INDEX "TransactionCommunication_transactionId_idx" ON "TransactionCommunication"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionCommunication_type_idx" ON "TransactionCommunication"("type");

-- CreateIndex
CREATE INDEX "TransactionCommunication_threadId_idx" ON "TransactionCommunication"("threadId");

-- CreateIndex
CREATE INDEX "TransactionCommunication_createdAt_idx" ON "TransactionCommunication"("createdAt");

-- CreateIndex
CREATE INDEX "TransactionNotification_transactionId_idx" ON "TransactionNotification"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionNotification_recipient_idx" ON "TransactionNotification"("recipient");

-- CreateIndex
CREATE INDEX "TransactionNotification_status_idx" ON "TransactionNotification"("status");

-- CreateIndex
CREATE INDEX "TransactionNotification_createdAt_idx" ON "TransactionNotification"("createdAt");

-- CreateIndex
CREATE INDEX "TransactionIssue_transactionId_idx" ON "TransactionIssue"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionIssue_status_idx" ON "TransactionIssue"("status");

-- CreateIndex
CREATE INDEX "TransactionIssue_category_idx" ON "TransactionIssue"("category");

-- CreateIndex
CREATE INDEX "TransactionIssue_severity_idx" ON "TransactionIssue"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionTimeline_transactionId_key" ON "TransactionTimeline"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ConveyancingCase_caseReference_key" ON "ConveyancingCase"("caseReference");

-- CreateIndex
CREATE UNIQUE INDEX "AMLCheck_caseId_key" ON "AMLCheck"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "ConveyancingInvoice_invoiceNumber_key" ON "ConveyancingInvoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_developmentId_name_key" ON "UnitType"("developmentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleOfAccommodation_unitTypeId_room_key" ON "ScheduleOfAccommodation"("unitTypeId", "room");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentUnit_developmentId_unitNumber_key" ON "DevelopmentUnit"("developmentId", "unitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentReservation_referenceNumber_key" ON "DevelopmentReservation"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentSale_referenceNumber_key" ON "DevelopmentSale"("referenceNumber");

-- CreateIndex
CREATE INDEX "PropertyView_unitId_idx" ON "PropertyView"("unitId");

-- CreateIndex
CREATE INDEX "PropertyView_createdAt_idx" ON "PropertyView"("createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_unitId_idx" ON "Inquiry"("unitId");

-- CreateIndex
CREATE INDEX "Inquiry_userId_idx" ON "Inquiry"("userId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "AnalyticsSchedule_developerId_idx" ON "AnalyticsSchedule"("developerId");

-- CreateIndex
CREATE INDEX "AnalyticsSchedule_nextRun_idx" ON "AnalyticsSchedule"("nextRun");

-- CreateIndex
CREATE INDEX "_UnitToViewing_B_index" ON "_UnitToViewing"("B");

-- CreateIndex
CREATE INDEX "_CustomizationSelectionToDocument_B_index" ON "_CustomizationSelectionToDocument"("B");

-- CreateIndex
CREATE INDEX "_UserKycDocuments_B_index" ON "_UserKycDocuments"("B");

-- CreateIndex
CREATE INDEX "_DocumentToProjectMilestone_B_index" ON "_DocumentToProjectMilestone"("B");

-- CreateIndex
CREATE INDEX "_ProjectToTeam_B_index" ON "_ProjectToTeam"("B");

-- CreateIndex
CREATE INDEX "_CreativeAssetToMarketingCampaign_B_index" ON "_CreativeAssetToMarketingCampaign"("B");

-- CreateIndex
CREATE INDEX "_CreativeAssetToMarketingChannel_B_index" ON "_CreativeAssetToMarketingChannel"("B");

-- CreateIndex
CREATE INDEX "_CreativeAssetToMarketingActivity_B_index" ON "_CreativeAssetToMarketingActivity"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthLog" ADD CONSTRAINT "AuthLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MfaSettings" ADD CONSTRAINT "MfaSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MfaToken" ADD CONSTRAINT "MfaToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerProfile" ADD CONSTRAINT "BuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageTracking" ADD CONSTRAINT "MortgageTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnagList" ADD CONSTRAINT "SnagList_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnagList" ADD CONSTRAINT "SnagList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnagItem" ADD CONSTRAINT "SnagItem_snagListId_fkey" FOREIGN KEY ("snagListId") REFERENCES "SnagList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnagItem" ADD CONSTRAINT "SnagItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePackItem" ADD CONSTRAINT "HomePackItem_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Development" ADD CONSTRAINT "Development_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Development" ADD CONSTRAINT "Development_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Development" ADD CONSTRAINT "Development_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "ProjectTimeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "ProjectTimeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestoneDependency" ADD CONSTRAINT "ProjectMilestoneDependency_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "ProjectMilestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestoneDependency" ADD CONSTRAINT "ProjectMilestoneDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "ProjectMilestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitOutdoorSpace" ADD CONSTRAINT "UnitOutdoorSpace_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitRoom" ADD CONSTRAINT "UnitRoom_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOption" ADD CONSTRAINT "UnitCustomizationOption_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOptionAlternative" ADD CONSTRAINT "UnitCustomizationOptionAlternative_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOptionAlternative" ADD CONSTRAINT "UnitCustomizationOptionAlternative_alternativeOptionId_fkey" FOREIGN KEY ("alternativeOptionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOptionRequirement" ADD CONSTRAINT "UnitCustomizationOptionRequirement_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOptionRequirement" ADD CONSTRAINT "UnitCustomizationOptionRequirement_requiredOptionId_fkey" FOREIGN KEY ("requiredOptionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOptionIncompatibility" ADD CONSTRAINT "UnitCustomizationOptionIncompatibility_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitCustomizationOptionIncompatibility" ADD CONSTRAINT "UnitCustomizationOptionIncompatibility_incompatibleOptionI_fkey" FOREIGN KEY ("incompatibleOptionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomizationSelection" ADD CONSTRAINT "CustomizationSelection_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomizationSelection" ADD CONSTRAINT "CustomizationSelection_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedOption" ADD CONSTRAINT "SelectedOption_selectionId_fkey" FOREIGN KEY ("selectionId") REFERENCES "CustomizationSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedOption" ADD CONSTRAINT "SelectedOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_mortgageTrackingId_fkey" FOREIGN KEY ("mortgageTrackingId") REFERENCES "MortgageTracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflowStage" ADD CONSTRAINT "DocumentWorkflowStage_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "DocumentWorkflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApproverConfig" ADD CONSTRAINT "ApproverConfig_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "DocumentWorkflowStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentCustomField" ADD CONSTRAINT "DocumentCustomField_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "DocumentWorkflowStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflowInstance" ADD CONSTRAINT "DocumentWorkflowInstance_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflowInstance" ADD CONSTRAINT "DocumentWorkflowInstance_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "DocumentWorkflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflowHistory" ADD CONSTRAINT "DocumentWorkflowHistory_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "DocumentWorkflowInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorkflowHistory" ADD CONSTRAINT "DocumentWorkflowHistory_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "DocumentWorkflowStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentApproval" ADD CONSTRAINT "DocumentApproval_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "DocumentWorkflowHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSignature" ADD CONSTRAINT "DocumentSignature_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_sellingAgentId_fkey" FOREIGN KEY ("sellingAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleStatusHistory" ADD CONSTRAINT "SaleStatusHistory_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleStatusHistory" ADD CONSTRAINT "SaleStatusHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTimeline" ADD CONSTRAINT "SaleTimeline_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageDetails" ADD CONSTRAINT "MortgageDetails_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HTBDetails" ADD CONSTRAINT "HTBDetails_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleNote" ADD CONSTRAINT "SaleNote_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTask" ADD CONSTRAINT "SaleTask_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceArea" ADD CONSTRAINT "ServiceArea_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalDocument" ADD CONSTRAINT "ProfessionalDocument_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalAppointment" ADD CONSTRAINT "ProfessionalAppointment_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalAppointment" ADD CONSTRAINT "ProfessionalAppointment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalAssignment" ADD CONSTRAINT "ProfessionalAssignment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalReview" ADD CONSTRAINT "ProfessionalReview_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPhase" ADD CONSTRAINT "ProjectPhase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPhaseDependency" ADD CONSTRAINT "ProjectPhaseDependency_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPhaseDependency" ADD CONSTRAINT "ProjectPhaseDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "ProjectPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone2" ADD CONSTRAINT "ProjectMilestone2_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone2" ADD CONSTRAINT "ProjectMilestone2_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestoneDependency2" ADD CONSTRAINT "ProjectMilestoneDependency2_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "ProjectMilestone2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestoneDependency2" ADD CONSTRAINT "ProjectMilestoneDependency2_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "ProjectMilestone2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "ProjectPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "ProjectTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTaskDependency" ADD CONSTRAINT "ProjectTaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ProjectTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTaskDependency" ADD CONSTRAINT "ProjectTaskDependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "ProjectTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ProjectTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_conveyancingTaskId_fkey" FOREIGN KEY ("conveyancingTaskId") REFERENCES "ConveyancingTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRisk" ADD CONSTRAINT "ProjectRisk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIssue" ADD CONSTRAINT "ProjectIssue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "ProjectIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionLog" ADD CONSTRAINT "ConstructionLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionFinding" ADD CONSTRAINT "InspectionFinding_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendee" ADD CONSTRAINT "MeetingAttendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingMinutes" ADD CONSTRAINT "MeetingMinutes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingActionItem" ADD CONSTRAINT "MeetingActionItem_minutesId_fkey" FOREIGN KEY ("minutesId") REFERENCES "MeetingMinutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthAndSafetyPlan" ADD CONSTRAINT "HealthAndSafetyPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_planId_fkey" FOREIGN KEY ("planId") REFERENCES "HealthAndSafetyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyInspection" ADD CONSTRAINT "SafetyInspection_planId_fkey" FOREIGN KEY ("planId") REFERENCES "HealthAndSafetyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyIncident" ADD CONSTRAINT "SafetyIncident_planId_fkey" FOREIGN KEY ("planId") REFERENCES "HealthAndSafetyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_planId_fkey" FOREIGN KEY ("planId") REFERENCES "HealthAndSafetyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolboxTalk" ADD CONSTRAINT "ToolboxTalk_planId_fkey" FOREIGN KEY ("planId") REFERENCES "HealthAndSafetyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentUpdate" ADD CONSTRAINT "InvestmentUpdate_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOpportunity" ADD CONSTRAINT "InvestmentOpportunity_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorWatchlistUnit" ADD CONSTRAINT "InvestorWatchlistUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingChannel" ADD CONSTRAINT "MarketingChannel_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingActivity" ADD CONSTRAINT "MarketingActivity_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingActivity" ADD CONSTRAINT "MarketingActivity_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "MarketingChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadStatusHistory" ADD CONSTRAINT "LeadStatusHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_solicitorId_fkey" FOREIGN KEY ("solicitorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEvent" ADD CONSTRAINT "TransactionEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDocument" ADD CONSTRAINT "TransactionDocument_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionPayment" ADD CONSTRAINT "TransactionPayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTask" ADD CONSTRAINT "TransactionTask_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMilestone" ADD CONSTRAINT "TransactionMilestone_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionCommunication" ADD CONSTRAINT "TransactionCommunication_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionNotification" ADD CONSTRAINT "TransactionNotification_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTimeline" ADD CONSTRAINT "TransactionTimeline_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyancingTask" ADD CONSTRAINT "ConveyancingTask_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyancingDocument" ADD CONSTRAINT "ConveyancingDocument_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyancingDocument" ADD CONSTRAINT "ConveyancingDocument_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ConveyancingTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyancingNote" ADD CONSTRAINT "ConveyancingNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AMLCheck" ADD CONSTRAINT "AMLCheck_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceOfFunds" ADD CONSTRAINT "SourceOfFunds_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalFee" ADD CONSTRAINT "LegalFee_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyancingInvoice" ADD CONSTRAINT "ConveyancingInvoice_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "ConveyancingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitType" ADD CONSTRAINT "UnitType_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleOfAccommodation" ADD CONSTRAINT "ScheduleOfAccommodation_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorPlan" ADD CONSTRAINT "FloorPlan_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentMedia" ADD CONSTRAINT "DevelopmentMedia_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentDocument" ADD CONSTRAINT "DevelopmentDocument_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenity" ADD CONSTRAINT "Amenity_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customization" ADD CONSTRAINT "Customization_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnit" ADD CONSTRAINT "DevelopmentUnit_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnit" ADD CONSTRAINT "DevelopmentUnit_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentAmenity" ADD CONSTRAINT "DevelopmentAmenity_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentViewing" ADD CONSTRAINT "DevelopmentViewing_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentViewing" ADD CONSTRAINT "DevelopmentViewing_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "DevelopmentUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentViewing" ADD CONSTRAINT "DevelopmentViewing_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentViewing" ADD CONSTRAINT "DevelopmentViewing_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentReservation" ADD CONSTRAINT "DevelopmentReservation_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentReservation" ADD CONSTRAINT "DevelopmentReservation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "DevelopmentUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentReservation" ADD CONSTRAINT "DevelopmentReservation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentSale" ADD CONSTRAINT "DevelopmentSale_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentSale" ADD CONSTRAINT "DevelopmentSale_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "DevelopmentUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentSale" ADD CONSTRAINT "DevelopmentSale_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyView" ADD CONSTRAINT "PropertyView_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToViewing" ADD CONSTRAINT "_UnitToViewing_A_fkey" FOREIGN KEY ("A") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToViewing" ADD CONSTRAINT "_UnitToViewing_B_fkey" FOREIGN KEY ("B") REFERENCES "Viewing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomizationSelectionToDocument" ADD CONSTRAINT "_CustomizationSelectionToDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomizationSelection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomizationSelectionToDocument" ADD CONSTRAINT "_CustomizationSelectionToDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserKycDocuments" ADD CONSTRAINT "_UserKycDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserKycDocuments" ADD CONSTRAINT "_UserKycDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToProjectMilestone" ADD CONSTRAINT "_DocumentToProjectMilestone_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToProjectMilestone" ADD CONSTRAINT "_DocumentToProjectMilestone_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectMilestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreativeAssetToMarketingCampaign" ADD CONSTRAINT "_CreativeAssetToMarketingCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "CreativeAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreativeAssetToMarketingCampaign" ADD CONSTRAINT "_CreativeAssetToMarketingCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreativeAssetToMarketingChannel" ADD CONSTRAINT "_CreativeAssetToMarketingChannel_A_fkey" FOREIGN KEY ("A") REFERENCES "CreativeAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreativeAssetToMarketingChannel" ADD CONSTRAINT "_CreativeAssetToMarketingChannel_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketingChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreativeAssetToMarketingActivity" ADD CONSTRAINT "_CreativeAssetToMarketingActivity_A_fkey" FOREIGN KEY ("A") REFERENCES "CreativeAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreativeAssetToMarketingActivity" ADD CONSTRAINT "_CreativeAssetToMarketingActivity_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketingActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
