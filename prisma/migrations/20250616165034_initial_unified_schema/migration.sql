-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 'QUANTITY_SURVEYOR', 'LEGAL', 'PROJECT_MANAGER', 'AGENT', 'SOLICITOR', 'CONTRACTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('PLANNING', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 'MARKETING', 'SALES', 'HANDOVER', 'COMPLETED');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('APARTMENT', 'DUPLEX', 'SEMI_DETACHED', 'DETACHED', 'TERRACED', 'PENTHOUSE', 'COMMERCIAL', 'RETAIL', 'OFFICE');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('PLANNED', 'UNDER_CONSTRUCTION', 'COMPLETE', 'AVAILABLE', 'RESERVED', 'SALE_AGREED', 'SOLD', 'OCCUPIED');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('ENQUIRY', 'VIEWING_SCHEDULED', 'VIEWED', 'INTERESTED', 'RESERVATION', 'PENDING_APPROVAL', 'RESERVATION_APPROVED', 'CONTRACT_ISSUED', 'CONTRACT_SIGNED', 'DEPOSIT_PAID', 'MORTGAGE_APPROVED', 'CLOSING', 'COMPLETED', 'HANDED_OVER', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BuyerPhase" AS ENUM ('PLANNING', 'FINANCING', 'PROPERTY_SEARCH', 'RESERVATION', 'LEGAL_PROCESS', 'CONSTRUCTION', 'COMPLETION', 'POST_PURCHASE');

-- CreateEnum
CREATE TYPE "MortgageStatus" AS ENUM ('PREPARING', 'SUBMITTED', 'INFO_REQUESTED', 'UNDERWRITING', 'DECLINED', 'APPROVED_IN_PRINCIPLE', 'VALUATION_PENDING', 'VALUATION_COMPLETE', 'FINAL_APPROVAL', 'MORTGAGE_OFFER', 'EXPIRED', 'DRAWDOWN', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'CONVERTED_TO_SALE', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED', 'SCHEDULED', 'PROCESSING', 'RECONCILED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'CHECK', 'DIRECT_DEBIT', 'ELECTRONIC_TRANSFER', 'WIRE_TRANSFER', 'ESCROW', 'OTHER');

-- CreateEnum
CREATE TYPE "FundingType" AS ENUM ('DEVELOPMENT_LOAN', 'SENIOR_DEBT', 'MEZZANINE_DEBT', 'EQUITY_INVESTMENT', 'CROWDFUNDING', 'GRANT', 'PRESALES', 'JOINT_VENTURE', 'CONSTRUCTION_LOAN', 'BRIDGE_LOAN', 'INTERNAL_FUNDING', 'VENTURE_DEBT', 'OTHER');

-- CreateEnum
CREATE TYPE "FundingStatus" AS ENUM ('PROPOSED', 'APPROVED', 'ACTIVE', 'FULLY_DRAWN', 'REPAID', 'CANCELLED', 'EXPIRED', 'PENDING_APPROVAL', 'PARTIALLY_DRAWN');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('EQUITY', 'DEBT', 'MEZZANINE', 'PREFERRED_EQUITY', 'JOINT_VENTURE', 'PRIVATE_PLACEMENT', 'SYNDICATION', 'FUND', 'REIT', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PROPOSED', 'OPEN', 'CLOSED', 'FULLY_SUBSCRIBED', 'ACTIVE', 'EXITED', 'DISTRESSED', 'DEFAULTED', 'RESTRUCTURED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "RiskRating" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ComponentStatus" AS ENUM ('PENDING', 'UPLOADED', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('BUYER', 'SELLER', 'BUYER_SOLICITOR', 'SELLER_SOLICITOR', 'AGENT', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "OutdoorSpaceType" AS ENUM ('BALCONY', 'TERRACE', 'GARDEN', 'PATIO', 'ROOF_TERRACE', 'YARD');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('LIVING_ROOM', 'KITCHEN', 'DINING_ROOM', 'BEDROOM', 'BATHROOM', 'EN_SUITE', 'STUDY', 'UTILITY', 'HALL', 'LANDING', 'STORAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomizationCategory" AS ENUM ('KITCHEN', 'BATHROOM', 'FLOORING', 'DOORS', 'WINDOWS', 'PAINT', 'ELECTRICAL', 'HEATING', 'STORAGE', 'FIXTURES', 'EXTERIOR', 'SMART_HOME', 'APPLIANCES', 'LIGHTING', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomizationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'EXPIRED', 'IN_PROGRESS', 'COMPLETED');

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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "BuyerJourneys" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "currentPhase" "BuyerPhase" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "targetMoveInDate" TIMESTAMP(3),
    "targetPropertyId" TEXT,
    "notes" TEXT,

    CONSTRAINT "BuyerJourneys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerPhaseHistory" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "phase" "BuyerPhase" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "completedTasks" JSONB,
    "notes" TEXT,

    CONSTRAINT "BuyerPhaseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerPreference" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "locations" TEXT[],
    "maxDistanceToWork" INTEGER,
    "maxDistanceToSchool" INTEGER,
    "minBedrooms" INTEGER,
    "maxBedrooms" INTEGER,
    "minBathrooms" INTEGER,
    "propertyTypes" TEXT[],
    "mustHaveFeatures" TEXT[],
    "niceToHaveFeatures" TEXT[],
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetInfo" (
    "id" TEXT NOT NULL,
    "preferenceId" TEXT NOT NULL,
    "maxTotalPrice" INTEGER NOT NULL,
    "maxMonthlyPayment" INTEGER,
    "estimatedDeposit" INTEGER NOT NULL,
    "includesHTB" BOOLEAN NOT NULL DEFAULT false,
    "htbAmount" INTEGER,
    "otherFundingSources" JSONB,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffordabilityCheck" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "grossAnnualIncome" INTEGER NOT NULL,
    "partnerIncome" INTEGER,
    "monthlyDebts" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "htbAmount" INTEGER,
    "maxMortgage" INTEGER NOT NULL,
    "maxPropertyPrice" INTEGER NOT NULL,
    "monthlyRepayment" INTEGER NOT NULL,
    "loanToValue" DOUBLE PRECISION NOT NULL,
    "debtToIncomeRatio" DOUBLE PRECISION NOT NULL,
    "lender" TEXT,
    "calculator" TEXT,
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffordabilityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortgageApplication" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "lender" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "applicationReference" TEXT,
    "status" "MortgageStatus" NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "fixedRatePeriod" INTEGER,
    "monthlyRepayment" INTEGER,
    "approvalDate" TIMESTAMP(3),
    "approvalExpiryDate" TIMESTAMP(3),
    "offerReceivedDate" TIMESTAMP(3),
    "offerValidUntil" TIMESTAMP(3),
    "brokerName" TEXT,
    "brokerContact" TEXT,
    "brokerFee" INTEGER,
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MortgageApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortgageDocument" (
    "id" TEXT NOT NULL,
    "mortgageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "verificationDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "MortgageDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyReservation" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationFee" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "termsUrl" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "paymentReference" TEXT,
    "paymentStatus" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "refundAmount" INTEGER,
    "refundDate" TIMESTAMP(3),
    "contractSentDate" TIMESTAMP(3),
    "contractSignedDate" TIMESTAMP(3),
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerEvent" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL,
    "location" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT,
    "developmentId" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentTime" TIMESTAMP(3),
    "notes" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerEvent_pkey" PRIMARY KEY ("id")
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
    "name" TEXT NOT NULL,
    "type" "UnitType" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "floors" INTEGER NOT NULL,
    "parkingSpaces" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "status" "UnitStatus" NOT NULL,
    "berRating" TEXT NOT NULL,
    "features" TEXT[],
    "primaryImage" TEXT NOT NULL,
    "images" TEXT[],
    "floorplans" TEXT[],
    "virtualTourUrl" TEXT,
    "unitNumber" TEXT,
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
    "journeyId" TEXT,
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
CREATE TABLE "HomePackDocument" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "manufacturer" TEXT,
    "modelNumber" TEXT,
    "serialNumber" TEXT,
    "purchaseDate" TEXT,
    "supplierContact" TEXT,
    "notes" TEXT,

    CONSTRAINT "HomePackDocument_pkey" PRIMARY KEY ("id")
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
    "fundingSourceId" TEXT,
    "budgetId" TEXT,
    "financialStatementId" TEXT,
    "investmentId" TEXT,

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
CREATE TABLE "DevelopmentFinance" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "projectCost" DECIMAL(12,2) NOT NULL,
    "projectCostCurrency" "CurrencyCode" NOT NULL,
    "reportingPeriod" TEXT NOT NULL,
    "lockedBy" TEXT,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentFinance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingSource" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FundingType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "interestRate" DECIMAL(5,2),
    "term" INTEGER,
    "termUnit" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "ltvRatio" DECIMAL(5,2),
    "ltcRatio" DECIMAL(5,2),
    "covenants" TEXT[],
    "securityType" TEXT,
    "providerName" TEXT NOT NULL,
    "providerContact" TEXT,
    "status" "FundingStatus" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "FundingSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drawdown" (
    "id" TEXT NOT NULL,
    "fundingSourceId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "purpose" TEXT NOT NULL,
    "notes" TEXT,
    "transactionId" TEXT,
    "conditions" TEXT[],

    CONSTRAINT "Drawdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repayment" (
    "id" TEXT NOT NULL,
    "fundingSourceId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "type" TEXT NOT NULL,
    "principalAmount" DECIMAL(12,2),
    "interestAmount" DECIMAL(12,2),
    "feesAmount" DECIMAL(12,2),
    "notes" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "Repayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentBudget" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalBudget" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "contingencyPercentage" DECIMAL(5,2) NOT NULL,
    "contingencyAmount" DECIMAL(12,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetCategory" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentCategoryId" TEXT,
    "plannedAmount" DECIMAL(12,2) NOT NULL,
    "actualAmount" DECIMAL(12,2) NOT NULL,
    "varianceAmount" DECIMAL(12,2) NOT NULL,
    "variancePercentage" DECIMAL(5,2) NOT NULL,
    "isMilestone" BOOLEAN NOT NULL DEFAULT false,
    "milestoneDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetLineItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "plannedAmount" DECIMAL(12,2) NOT NULL,
    "actualAmount" DECIMAL(12,2) NOT NULL,
    "varianceAmount" DECIMAL(12,2) NOT NULL,
    "variancePercentage" DECIMAL(5,2) NOT NULL,
    "responsible" TEXT,
    "invoices" TEXT[],
    "purchaseOrders" TEXT[],
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BudgetLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "status" "TransactionStatus" NOT NULL,
    "category" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "counterpartyName" TEXT NOT NULL,
    "counterpartyType" TEXT NOT NULL,
    "counterpartyId" TEXT,
    "budgetCategoryId" TEXT,
    "invoiceId" TEXT,
    "accountId" TEXT,
    "relatedTransactionId" TEXT,
    "tags" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialStatement" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialReturns" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "totalRevenue" DECIMAL(12,2) NOT NULL,
    "totalRevenueCurrency" "CurrencyCode" NOT NULL,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "totalCostCurrency" "CurrencyCode" NOT NULL,
    "grossProfit" DECIMAL(12,2) NOT NULL,
    "grossProfitCurrency" "CurrencyCode" NOT NULL,
    "grossMargin" DECIMAL(5,2) NOT NULL,
    "netProfit" DECIMAL(12,2) NOT NULL,
    "netProfitCurrency" "CurrencyCode" NOT NULL,
    "netMargin" DECIMAL(5,2) NOT NULL,
    "ror" DECIMAL(5,2) NOT NULL,
    "roi" DECIMAL(5,2) NOT NULL,
    "irr" DECIMAL(5,2) NOT NULL,
    "paybackPeriod" INTEGER NOT NULL,
    "profitOnCost" DECIMAL(5,2) NOT NULL,
    "breakEvenPoint" JSONB,
    "constructionStartDate" TIMESTAMP(3),
    "constructionEndDate" TIMESTAMP(3),
    "salesStartDate" TIMESTAMP(3),
    "salesEndDate" TIMESTAMP(3),
    "constructionDuration" INTEGER NOT NULL,
    "salesDuration" INTEGER NOT NULL,
    "npv" DECIMAL(12,2) NOT NULL,
    "npvCurrency" "CurrencyCode" NOT NULL,
    "sensitivity" JSONB,
    "lastCalculated" TIMESTAMP(3) NOT NULL,
    "calculatedBy" TEXT NOT NULL,

    CONSTRAINT "FinancialReturns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlowProjection" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "frequency" TEXT NOT NULL,
    "baseCurrency" "CurrencyCode" NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "assumptions" JSONB,

    CONSTRAINT "CashFlowProjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlowPeriod" (
    "id" TEXT NOT NULL,
    "cashFlowId" TEXT NOT NULL,
    "periodNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActual" BOOLEAN NOT NULL,
    "salesRevenue" DECIMAL(12,2) NOT NULL,
    "salesRevenueCurrency" "CurrencyCode" NOT NULL,
    "rentalIncome" DECIMAL(12,2) NOT NULL,
    "rentalIncomeCurrency" "CurrencyCode" NOT NULL,
    "fundingDrawdowns" DECIMAL(12,2) NOT NULL,
    "fundingDrawdownsCurrency" "CurrencyCode" NOT NULL,
    "otherInflows" DECIMAL(12,2) NOT NULL,
    "otherInflowsCurrency" "CurrencyCode" NOT NULL,
    "totalInflows" DECIMAL(12,2) NOT NULL,
    "totalInflowsCurrency" "CurrencyCode" NOT NULL,
    "landCosts" DECIMAL(12,2) NOT NULL,
    "landCostsCurrency" "CurrencyCode" NOT NULL,
    "constructionCosts" DECIMAL(12,2) NOT NULL,
    "constructionCostsCurrency" "CurrencyCode" NOT NULL,
    "professionalFees" DECIMAL(12,2) NOT NULL,
    "professionalFeesCurrency" "CurrencyCode" NOT NULL,
    "marketingCosts" DECIMAL(12,2) NOT NULL,
    "marketingCostsCurrency" "CurrencyCode" NOT NULL,
    "financeCosts" DECIMAL(12,2) NOT NULL,
    "financeCostsCurrency" "CurrencyCode" NOT NULL,
    "legalFees" DECIMAL(12,2) NOT NULL,
    "legalFeesCurrency" "CurrencyCode" NOT NULL,
    "contingencyCosts" DECIMAL(12,2) NOT NULL,
    "contingencyCostsCurrency" "CurrencyCode" NOT NULL,
    "taxPayments" DECIMAL(12,2) NOT NULL,
    "taxPaymentsCurrency" "CurrencyCode" NOT NULL,
    "otherOutflows" DECIMAL(12,2) NOT NULL,
    "otherOutflowsCurrency" "CurrencyCode" NOT NULL,
    "totalOutflows" DECIMAL(12,2) NOT NULL,
    "totalOutflowsCurrency" "CurrencyCode" NOT NULL,
    "netCashFlow" DECIMAL(12,2) NOT NULL,
    "netCashFlowCurrency" "CurrencyCode" NOT NULL,
    "cumulativeCashFlow" DECIMAL(12,2) NOT NULL,
    "cumulativeCashFlowCurrency" "CurrencyCode" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "CashFlowPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlowCategory" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "plannedAmount" DECIMAL(12,2) NOT NULL,
    "plannedAmountCurrency" "CurrencyCode" NOT NULL,
    "actualAmount" DECIMAL(12,2) NOT NULL,
    "actualAmountCurrency" "CurrencyCode" NOT NULL,
    "variance" DECIMAL(12,2) NOT NULL,
    "varianceCurrency" "CurrencyCode" NOT NULL,
    "variancePercentage" DECIMAL(5,2) NOT NULL,
    "parentCategoryId" TEXT,

    CONSTRAINT "CashFlowCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlowLineItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "plannedAmount" DECIMAL(12,2) NOT NULL,
    "plannedAmountCurrency" "CurrencyCode" NOT NULL,
    "actualAmount" DECIMAL(12,2) NOT NULL,
    "actualAmountCurrency" "CurrencyCode" NOT NULL,
    "variance" DECIMAL(12,2) NOT NULL,
    "varianceCurrency" "CurrencyCode" NOT NULL,
    "variancePercentage" DECIMAL(5,2) NOT NULL,
    "date" TIMESTAMP(3),
    "transactionId" TEXT,
    "budgetLineItemId" TEXT,
    "notes" TEXT,

    CONSTRAINT "CashFlowLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlowSummary" (
    "id" TEXT NOT NULL,
    "cashFlowId" TEXT NOT NULL,
    "totalInflows" DECIMAL(12,2) NOT NULL,
    "totalInflowsCurrency" "CurrencyCode" NOT NULL,
    "totalOutflows" DECIMAL(12,2) NOT NULL,
    "totalOutflowsCurrency" "CurrencyCode" NOT NULL,
    "netCashFlow" DECIMAL(12,2) NOT NULL,
    "netCashFlowCurrency" "CurrencyCode" NOT NULL,
    "peakNegativeCashFlow" DECIMAL(12,2) NOT NULL,
    "peakNegativeCashFlowCurrency" "CurrencyCode" NOT NULL,
    "peakNegativeCashFlowPeriod" INTEGER NOT NULL,
    "breakEvenPeriod" INTEGER NOT NULL,
    "cashFlowPositiveDate" TIMESTAMP(3),
    "periodsWithNegativeCashFlow" INTEGER NOT NULL,
    "periodsWithPositiveCashFlow" INTEGER NOT NULL,
    "npv" DECIMAL(12,2) NOT NULL,
    "npvCurrency" "CurrencyCode" NOT NULL,
    "irr" DECIMAL(5,2) NOT NULL,
    "paybackPeriod" INTEGER NOT NULL,
    "profitability" DECIMAL(5,2) NOT NULL,
    "volatilityIndex" DECIMAL(5,2) NOT NULL,
    "liquidityRatio" DECIMAL(5,2) NOT NULL,
    "inflowDistribution" JSONB NOT NULL,
    "outflowDistribution" JSONB NOT NULL,
    "lastCalculated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashFlowSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlowScenario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "baseScenarioId" TEXT NOT NULL,
    "modifiedAssumptions" JSONB NOT NULL,
    "netCashFlowDifference" DECIMAL(12,2) NOT NULL,
    "netCashFlowDifferenceCurrency" "CurrencyCode" NOT NULL,
    "netCashFlowDifferencePercentage" DECIMAL(5,2) NOT NULL,
    "npvDifference" DECIMAL(12,2) NOT NULL,
    "npvDifferenceCurrency" "CurrencyCode" NOT NULL,
    "npvDifferencePercentage" DECIMAL(5,2) NOT NULL,
    "irrDifference" DECIMAL(5,2) NOT NULL,
    "paybackPeriodDifference" INTEGER NOT NULL,
    "probabilityAssessment" DECIMAL(5,2),
    "scenarioSpecificMetrics" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashFlowScenario_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "SLPProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "developerId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SLPProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLPComponent" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "status" "ComponentStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "documentId" TEXT,
    "documentUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SLPComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLPHistory" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldStatus" "ComponentStatus",
    "newStatus" "ComponentStatus",
    "notes" TEXT,

    CONSTRAINT "SLPHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLPTransaction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SLPTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLPMilestone" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SLPMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLPParticipant" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SLPParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserRoleMapping_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProfile_userId_key" ON "BuyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerJourneys_buyerId_key" ON "BuyerJourneys"("buyerId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerPreference_journeyId_key" ON "BuyerPreference"("journeyId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetInfo_preferenceId_key" ON "BudgetInfo"("preferenceId");

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
CREATE UNIQUE INDEX "MortgageTracking_userId_key" ON "MortgageTracking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleTimeline_saleId_key" ON "SaleTimeline"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_saleId_key" ON "Deposit"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "MortgageDetails_saleId_key" ON "MortgageDetails"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "HTBDetails_saleId_key" ON "HTBDetails"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentWorkflowInstance_documentId_key" ON "DocumentWorkflowInstance"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentFinance_developmentId_key" ON "DevelopmentFinance"("developmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentBudget_financeId_key" ON "DevelopmentBudget"("financeId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialReturns_financeId_key" ON "FinancialReturns"("financeId");

-- CreateIndex
CREATE UNIQUE INDEX "CashFlowSummary_cashFlowId_key" ON "CashFlowSummary"("cashFlowId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorWatchlistUnit_investorId_unitId_key" ON "InvestorWatchlistUnit"("investorId", "unitId");

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
CREATE UNIQUE INDEX "UserRoleMapping_userId_role_key" ON "UserRoleMapping"("userId", "role");

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
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerProfile" ADD CONSTRAINT "BuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerJourneys" ADD CONSTRAINT "BuyerJourneys_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerJourneys" ADD CONSTRAINT "BuyerJourneys_targetPropertyId_fkey" FOREIGN KEY ("targetPropertyId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerPhaseHistory" ADD CONSTRAINT "BuyerPhaseHistory_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "BuyerJourneys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerPreference" ADD CONSTRAINT "BuyerPreference_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "BuyerJourneys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetInfo" ADD CONSTRAINT "BudgetInfo_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "BuyerPreference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffordabilityCheck" ADD CONSTRAINT "AffordabilityCheck_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "BuyerJourneys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageApplication" ADD CONSTRAINT "MortgageApplication_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "BuyerJourneys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageDocument" ADD CONSTRAINT "MortgageDocument_mortgageId_fkey" FOREIGN KEY ("mortgageId") REFERENCES "MortgageApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyReservation" ADD CONSTRAINT "PropertyReservation_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "BuyerJourneys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyReservation" ADD CONSTRAINT "PropertyReservation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerEvent" ADD CONSTRAINT "BuyerEvent_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "SelectedOption" ADD CONSTRAINT "SelectedOption_selectionId_fkey" FOREIGN KEY ("selectionId") REFERENCES "CustomizationSelection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedOption" ADD CONSTRAINT "SelectedOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "UnitCustomizationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageTracking" ADD CONSTRAINT "MortgageTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnagList" ADD CONSTRAINT "SnagList_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "BuyerJourneys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "HomePackDocument" ADD CONSTRAINT "HomePackDocument_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Document" ADD CONSTRAINT "Document_fundingSourceId_fkey" FOREIGN KEY ("fundingSourceId") REFERENCES "FundingSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "DevelopmentBudget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_financialStatementId_fkey" FOREIGN KEY ("financialStatementId") REFERENCES "FinancialStatement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "DevelopmentFinance" ADD CONSTRAINT "DevelopmentFinance_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingSource" ADD CONSTRAINT "FundingSource_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "DevelopmentFinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawdown" ADD CONSTRAINT "Drawdown_fundingSourceId_fkey" FOREIGN KEY ("fundingSourceId") REFERENCES "FundingSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repayment" ADD CONSTRAINT "Repayment_fundingSourceId_fkey" FOREIGN KEY ("fundingSourceId") REFERENCES "FundingSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentBudget" ADD CONSTRAINT "DevelopmentBudget_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "DevelopmentFinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetCategory" ADD CONSTRAINT "BudgetCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "DevelopmentBudget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetLineItem" ADD CONSTRAINT "BudgetLineItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BudgetCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "DevelopmentFinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialStatement" ADD CONSTRAINT "FinancialStatement_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "DevelopmentFinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialReturns" ADD CONSTRAINT "FinancialReturns_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "DevelopmentFinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlowProjection" ADD CONSTRAINT "CashFlowProjection_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "DevelopmentFinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlowPeriod" ADD CONSTRAINT "CashFlowPeriod_cashFlowId_fkey" FOREIGN KEY ("cashFlowId") REFERENCES "CashFlowProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlowCategory" ADD CONSTRAINT "CashFlowCategory_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "CashFlowPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlowLineItem" ADD CONSTRAINT "CashFlowLineItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CashFlowCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlowSummary" ADD CONSTRAINT "CashFlowSummary_cashFlowId_fkey" FOREIGN KEY ("cashFlowId") REFERENCES "CashFlowProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "SLPComponent" ADD CONSTRAINT "SLPComponent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "SLPProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLPHistory" ADD CONSTRAINT "SLPHistory_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "SLPComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLPTransaction" ADD CONSTRAINT "SLPTransaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "SLPProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLPMilestone" ADD CONSTRAINT "SLPMilestone_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "SLPTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLPParticipant" ADD CONSTRAINT "SLPParticipant_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "SLPTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
