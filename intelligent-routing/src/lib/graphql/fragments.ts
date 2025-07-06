/**
 * PropIE GraphQL Fragments
 * 
 * This file defines reusable GraphQL fragments that match component props,
 * promoting code reuse and consistency across the application.
 */

// Development fragments
export const developmentSummaryFragment = /* GraphQL */ `
  fragment DevelopmentSummary on DevelopmentSummary {
    id
    name
    slug
    status
    mainImage
    shortDescription
    totalUnits
    availableUnits
    priceRange
    location {
      city
      county
    }
    developer {
      id
      fullName
      email
      avatar
    }
  }
`;

export const developmentCardFragment = /* GraphQL */ `
  fragment DevelopmentCard on DevelopmentSummary {
    id
    name
    slug
    status
    mainImage
    shortDescription
    location {
      city
      county
    }
    totalUnits
    availableUnits
    priceRange
    features
    bedrooms
    bathrooms
    energyRating
    availability
    statusColor
  }
`;

export const developmentDetailsFragment = /* GraphQL */ `
  fragment DevelopmentDetails on Development {
    id
    name
    slug
    status
    description
    shortDescription
    mainImage
    images
    videos
    sitePlanUrl
    brochureUrl
    virtualTourUrl
    websiteUrl
    totalUnits
    availableUnits
    features
    amenities
    statusColor
    bedrooms
    bathrooms
    squareFeet
    energyRating
    availability
    depositAmount
    buildingType
    priceRange
    location {
      address
      addressLine1
      addressLine2
      city
      county
      eircode
      country
      longitude
      latitude
    }
    timeline {
      planningSubmissionDate
      planningDecisionDate
      constructionStartDate
      constructionEndDate
      marketingLaunchDate
      salesLaunchDate
    }
    salesStatus {
      totalUnits
      availableUnits
      reservedUnits
      saleAgreedUnits
      soldUnits
      salesVelocity
      targetPriceAverage
      actualPriceAverage
      projectedSelloutDate
    }
    developer {
      id
      fullName
      email
      avatar
      roles
    }
    tags
    showingDates
    units {
      id
      name
      type
      status
      price
      bedrooms
      bathrooms
      squareFeet
    }
  }
`;

// User fragments
export const userSummaryFragment = /* GraphQL */ `
  fragment UserSummary on UserSummary {
    id
    fullName
    email
    avatar
    roles
  }
`;

export const userDetailsFragment = /* GraphQL */ `
  fragment UserDetails on User {
    id
    email
    firstName
    lastName
    fullName
    phone
    roles
    status
    kycStatus
    organization
    position
    avatar
    lastActive
    lastLogin
  }
`;

// Financial fragments
export const financialMetricsFragment = /* GraphQL */ `
  fragment FinancialMetrics on FinancialMetrics {
    totalRevenue
    totalExpenses
    netProfit
    profitMargin
    roi
    cashOnHand
    outstandingInvoices
  }
`;

export const cashFlowFragment = /* GraphQL */ `
  fragment CashFlowItem on CashFlowItem {
    date
    income
    expenses
    balance
    category
    description
  }
`;

// Project timeline fragments
export const milestoneFragment = /* GraphQL */ `
  fragment MilestoneDetails on ProjectMilestone {
    id
    name
    description
    plannedDate
    actualDate
    status
    documents {
      id
      name
      url
    }
  }
`;

// Document fragments
export const documentFragment = /* GraphQL */ `
  fragment DocumentDetails on Document {
    id
    name
    description
    category
    status
    url
    created
    updated
    size
    fileType
    uploadedBy {
      id
      fullName
    }
  }
`;

// Sales fragments
export const salesStatusFragment = /* GraphQL */ `
  fragment SalesStatus on SalesStatus {
    totalUnits
    availableUnits
    reservedUnits
    saleAgreedUnits
    soldUnits
    salesVelocity
    targetPriceAverage
    actualPriceAverage
    projectedSelloutDate
  }
`;

// Property fragments
export const propertyCardFragment = /* GraphQL */ `
  fragment PropertyCard on Property {
    id
    name
    type
    status
    price
    bedrooms
    bathrooms
    area
    description
    mainImage
    location
    energyRating
    availability
  }
`;

export const propertyDetailsFragment = /* GraphQL */ `
  fragment PropertyDetails on Property {
    id
    name
    type
    status
    price
    bedrooms
    bathrooms
    area
    description
    features
    images
    floorPlan
    mainImage
    location
    energyRating
    availability
    depositAmount
    development {
      id
      name
      location {
        city
        county
      }
    }
    statusColor
  }
`;

// Dashboard fragments
export const dashboardMetricsFragment = /* GraphQL */ `
  fragment DashboardMetrics on DashboardMetrics {
    totalProjects
    activeProjects
    completedProjects
    totalUnits
    availableUnits
    reservedUnits
    soldUnits
    totalSales
    totalRevenue
    projectedRevenue
    conversionRate
  }
`;

export const developerProjectFragment = /* GraphQL */ `
  fragment DeveloperProject on DeveloperProject {
    id
    name
    status
    completionPercentage
    location
    propertyCount
    lastUpdated
  }
`;

export const projectSummaryFragment = /* GraphQL */ `
  fragment ProjectSummary on ProjectSummary {
    id
    name
    status
    category
    progress
    location
    startDate
    completionDate
    totalUnits
    soldUnits
    availableUnits
    reservedUnits
    lastUpdated
    thumbnail
  }
`;

export const salesMetricsFragment = /* GraphQL */ `
  fragment SalesMetrics on SalesMetrics {
    monthlySales {
      month
      year
      count
      value
    }
    salesByStatus {
      status
      count
      value
    }
    conversionRate
    averageTimeToSale
    hotLeads
  }
`;

export const timelineEventFragment = /* GraphQL */ `
  fragment TimelineEvent on TimelineEvent {
    id
    timestamp
    type
    title
    description
    user {
      id
      fullName
      avatar
    }
    project {
      id
      name
    }
    entityType
    entityId
  }
`;

export const financialOverviewFragment = /* GraphQL */ `
  fragment FinancialOverview on FinancialOverview {
    totalRevenue
    projectedRevenue
    expenses
    profit
    revenueByProject {
      projectId
      projectName
      revenue
      projected
    }
    revenueByMonth {
      month
      year
      revenue
      expenses
      profit
    }
    topPerformingProjects {
      id
      name
      revenue
      profitMargin
      unitsPerMonth
    }
  }
`;