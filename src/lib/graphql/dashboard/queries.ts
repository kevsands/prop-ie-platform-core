/**
 * Dashboard GraphQL Queries
 * 
 * This file contains GraphQL queries related to dashboards for different user roles
 */

// Developer Dashboard Query - Comprehensive version
export const GET_DEVELOPER_DASHBOARD = /* GraphQL */ `
  query GetDeveloperDashboard {
    developerDashboard {
      # Development statistics
      developmentCount
      totalUnits
      unitsAvailable
      unitsSold
      salesValue
      
      # Financial statistics
      totalRevenue
      projectedRevenue
      costToDate
      projectedProfit
      profitMargin
      
      # Timeline statistics
      inProgressDevelopments
      completedDevelopments
      upcomingMilestones {
        id
        title
        date
        projectId
        projectName
        completed
        type
        description
      }
      
      # Sales statistics
      salesVelocity
      reservationsThisMonth
      completionsThisMonth
      
      # Document statistics
      pendingDocuments
      expiringDocuments
    }
  }
`;

// Filtered Developer Dashboard Query
export const GET_DEVELOPER_DASHBOARD_FOR_PROJECT = /* GraphQL */ `
  query GetDeveloperDashboardForProject($projectId: ID!) {
    developmentDashboard(id: $projectId) {
      # Basic info
      id
      name
      status
      location
      startDate
      projectedCompletionDate
      actualCompletionDate
      
      # Unit info
      totalUnits
      availableUnits
      reservedUnits
      soldUnits
      
      # Financial info
      totalBudget
      currentSpend
      projectedRevenue
      actualRevenue
      profitMargin
      
      # Progress info
      overallProgress
      constructionProgress
      salesProgress
      documentCompleteness
      
      # Timeline
      timeline {
        milestones {
          id
          title
          date
          completed
          description
        }
        currentPhase
        nextMilestone
        nextMilestoneDate
        delayedMilestones
      }
      
      # Sales data
      salesData {
        monthlySales {
          month
          units
          value
        }
        reservationsThisMonth
        completionsThisMonth
        salesVelocity
      }
      
      # Document stats
      documents {
        pending
        expiring
        completed
        rejected
        totalCount
      }
    }
  }
`;

// Sales Statistics Query with filters
export const GET_SALES_STATISTICS = /* GraphQL */ `
  query GetSalesStatistics($startDate: DateTime!, $endDate: DateTime!, $developmentId: ID) {
    salesStatistics(
      startDate: $startDate,
      endDate: $endDate,
      developmentId: $developmentId
    ) {
      salesByPeriod {
        period
        units
        value
      }
      totalUnits
      totalValue
      compareWithPrevious {
        percentageChange
        valueChange
        unitsChange
      }
      topPerformingDevelopments {
        id
        name
        units
        value
      }
      salesByPropertyType {
        type
        units
        value
      }
      conversionRate
    }
  }
`;

// Project List Query for Dashboard
export const GET_PROJECTS_FOR_DASHBOARD = /* GraphQL */ `
  query GetProjectsForDashboard {
    projects {
      items {
        id
        name
        status
        location
        completionPercentage
        unitCount
        salesCount
        lastUpdated
        nextMilestone {
          title
          date
        }
      }
      totalCount
    }
  }
`;

// Query for Project Alerts
export const GET_PROJECT_ALERTS = /* GraphQL */ `
  query GetProjectAlerts($projectId: ID) {
    projectAlerts(projectId: $projectId) {
      items {
        id
        title
        description
        severity
        createdAt
        category
        status
        relatedTo {
          type
          id
          name
        }
      }
      totalCount
    }
  }
`;

// Query for Dashboard Activities & Events
export const GET_DASHBOARD_ACTIVITIES = /* GraphQL */ `
  query GetDashboardActivities($limit: Int) {
    dashboardActivities(limit: $limit) {
      items {
        id
        type
        title
        description
        timestamp
        user {
          id
          name
          avatar
        }
        relatedTo {
          type
          id
          name
        }
      }
      totalCount
    }
  }
`;

// Query for Dashboard Events
export const GET_DASHBOARD_EVENTS = /* GraphQL */ `
  query GetDashboardEvents($startDate: DateTime, $endDate: DateTime) {
    dashboardEvents(startDate: $startDate, endDate: $endDate) {
      items {
        id
        title
        description
        startTime
        endTime
        location
        type
        relatedTo {
          type
          id
          name
        }
        attendees {
          id
          name
          avatar
          confirmed
        }
      }
      totalCount
    }
  }
`;

// Query for Dashboard User Preferences
export const GET_DASHBOARD_PREFERENCES = /* GraphQL */ `
  query GetDashboardPreferences {
    dashboardPreferences {
      layout
      visibleWidgets
      defaultFilters
      dashboardType
      refreshInterval
      theme
    }
  }
`;

// Query for dashboard documents requiring attention
export const GET_DOCUMENTS_REQUIRING_ATTENTION = /* GraphQL */ `
  query GetDocumentsRequiringAttention {
    documentsRequiringAttention {
      pending {
        id
        name
        type
        uploadedBy {
          id
          name
        }
        uploadedAt
        category
        status
      }
      expiring {
        id
        name
        type
        expiryDate
        daysRemaining
        category
        status
      }
      requiresSignature {
        id
        name
        type
        requestedBy {
          id
          name
        }
        requestedAt
        deadline
      }
    }
  }
`;