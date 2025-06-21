// Real-time Dashboard and Monitoring System
// Provides comprehensive analytics and monitoring for the PropIE platform

import db from '../database/enhanced-client'
import { analyzeDevelopmentFinancials } from '../financial/analysis-engine'

export interface DashboardMetrics {
  userMetrics: {
    totalActiveUsers: number
    newUsersThisMonth: number
    usersByRole: Record<string, number>
    activityDistribution: {
      active: number
      recent: number
      dormant: number
      inactive: number
    }
  }
  developmentMetrics: {
    totalDevelopments: number
    activeProjects: number
    completedProjects: number
    totalUnits: number
    availableUnits: number
    soldUnits: number
    averageUnitPrice: number
    totalSalesValue: number
    salesVelocity: number // units per month
  }
  financialMetrics: {
    monthlyRevenue: number
    monthlyTransactions: number
    averageTransactionSize: number
    currencyDistribution: Record<string, number>
    topPerformingDevelopments: Array<{
      id: string
      name: string
      salesValue: number
      unitsRemaining: number
    }>
  }
  performanceMetrics: {
    databaseHealth: {
      status: 'healthy' | 'warning' | 'critical'
      connectionCount: number
      slowQueries: number
      avgQueryTime: number
    }
    systemMetrics: {
      cacheHitRate: number
      errorRate: number
      dataQualityScore: number
    }
  }
}

export interface TrendData {
  period: string
  userGrowth: number[]
  revenue: number[]
  salesVolume: number[]
  newDevelopments: number[]
}

export class DashboardService {
  
  // Get comprehensive dashboard metrics
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [
      userMetrics,
      developmentMetrics, 
      financialMetrics,
      performanceMetrics
    ] = await Promise.all([
      this.getUserMetrics(),
      this.getDevelopmentMetrics(),
      this.getFinancialMetrics(),
      this.getPerformanceMetrics()
    ])

    return {
      userMetrics,
      developmentMetrics,
      financialMetrics,
      performanceMetrics
    }
  }

  // User analytics
  private static async getUserMetrics() {
    const userStats = await db.prisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN status = 'ACTIVE' AND last_active > now() - interval '30 days' THEN 1 END) as total_active_users,
        COUNT(CASE WHEN created >= date_trunc('month', now()) THEN 1 END) as new_users_this_month,
        jsonb_object_agg(
          role_counts.role, 
          role_counts.count
        ) as users_by_role
      FROM users u
      CROSS JOIN LATERAL (
        SELECT unnest(u.roles) as role
      ) as user_roles
      CROSS JOIN LATERAL (
        SELECT 
          user_roles.role,
          COUNT(*) as count
        FROM users u2
        CROSS JOIN LATERAL (SELECT unnest(u2.roles) as role) as ur2
        WHERE ur2.role = user_roles.role
        GROUP BY ur2.role
      ) as role_counts
      GROUP BY role_counts.role, role_counts.count
    `

    const activityDistribution = await db.prisma.$queryRaw`
      SELECT 
        activity_status,
        COUNT(*) as count
      FROM user_activity_analytics
      GROUP BY activity_status
    `

    const userStatsResult = Array.isArray(userStats) && userStats[0] ? userStats[0] : {}
    const activityResult = Array.isArray(activityDistribution) ? activityDistribution : []

    return {
      totalActiveUsers: Number(userStatsResult.total_active_users || 0),
      newUsersThisMonth: Number(userStatsResult.new_users_this_month || 0),
      usersByRole: userStatsResult.users_by_role || {},
      activityDistribution: activityResult.reduce((acc, item: any) => {
        acc[item.activity_status.toLowerCase()] = Number(item.count)
        return acc
      }, { active: 0, recent: 0, dormant: 0, inactive: 0 })
    }
  }

  // Development analytics
  private static async getDevelopmentMetrics() {
    const devStats = await db.prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_developments,
        COUNT(CASE WHEN status IN ('PLANNING', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 'MARKETING', 'SALES') THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_projects,
        COALESCE(SUM(total_units), 0) as total_units,
        COALESCE(SUM(available_units), 0) as available_units,
        COALESCE(SUM(sold_units), 0) as sold_units,
        COALESCE(AVG(avg_unit_price), 0) as average_unit_price,
        COALESCE(SUM(total_sales_value), 0) as total_sales_value
      FROM development_analytics
      WHERE status != 'CANCELLED'
    `

    const salesVelocity = await db.prisma.$queryRaw`
      SELECT 
        COUNT(*) / NULLIF(DATE_PART('day', MAX(u.updated_at) - MIN(u.updated_at)) / 30, 0) as velocity
      FROM units u
      WHERE u.status = 'SOLD' 
        AND u.updated_at >= now() - interval '6 months'
    `

    const devStatsResult = Array.isArray(devStats) && devStats[0] ? devStats[0] : {}
    const velocityResult = Array.isArray(salesVelocity) && salesVelocity[0] ? salesVelocity[0] : {}

    return {
      totalDevelopments: Number(devStatsResult.total_developments || 0),
      activeProjects: Number(devStatsResult.active_projects || 0),
      completedProjects: Number(devStatsResult.completed_projects || 0),
      totalUnits: Number(devStatsResult.total_units || 0),
      availableUnits: Number(devStatsResult.available_units || 0),
      soldUnits: Number(devStatsResult.sold_units || 0),
      averageUnitPrice: Number(devStatsResult.average_unit_price || 0),
      totalSalesValue: Number(devStatsResult.total_sales_value || 0),
      salesVelocity: Number(velocityResult.velocity || 0)
    }
  }

  // Financial analytics
  private static async getFinancialMetrics() {
    const financialStats = await db.prisma.$queryRaw`
      SELECT 
        COALESCE(SUM(CASE WHEN date >= date_trunc('month', now()) THEN amount ELSE 0 END), 0) as monthly_revenue,
        COUNT(CASE WHEN date >= date_trunc('month', now()) THEN 1 END) as monthly_transactions,
        COALESCE(AVG(amount), 0) as average_transaction_size,
        jsonb_object_agg(currency, currency_total) as currency_distribution
      FROM financial_transactions ft
      CROSS JOIN LATERAL (
        SELECT 
          ft.currency,
          SUM(ft2.amount) as currency_total
        FROM financial_transactions ft2
        WHERE ft2.currency = ft.currency 
          AND ft2.status = 'COMPLETED'
          AND ft2.date >= now() - interval '30 days'
        GROUP BY ft2.currency
      ) as currency_totals
      WHERE ft.status = 'COMPLETED'
        AND ft.date >= now() - interval '30 days'
      GROUP BY currency_totals.currency, currency_totals.currency_total
    `

    const topDevelopments = await db.prisma.$queryRaw`
      SELECT 
        da.id,
        da.name,
        da.total_sales_value as sales_value,
        da.available_units as units_remaining
      FROM development_analytics da
      WHERE da.total_sales_value > 0
      ORDER BY da.total_sales_value DESC
      LIMIT 5
    `

    const financialResult = Array.isArray(financialStats) && financialStats[0] ? financialStats[0] : {}
    const topDevsResult = Array.isArray(topDevelopments) ? topDevelopments : []

    return {
      monthlyRevenue: Number(financialResult.monthly_revenue || 0),
      monthlyTransactions: Number(financialResult.monthly_transactions || 0),
      averageTransactionSize: Number(financialResult.average_transaction_size || 0),
      currencyDistribution: financialResult.currency_distribution || {},
      topPerformingDevelopments: topDevsResult.map((dev: any) => ({
        id: dev.id,
        name: dev.name,
        salesValue: Number(dev.sales_value),
        unitsRemaining: Number(dev.units_remaining)
      }))
    }
  }

  // System performance metrics
  private static async getPerformanceMetrics() {
    const dbHealth = await db.healthCheck()
    
    const slowQueries = await db.prisma.$queryRaw`
      SELECT COUNT(*) as slow_query_count
      FROM pg_stat_statements
      WHERE mean_time > 1000
    `

    const slowQueryCount = Array.isArray(slowQueries) && slowQueries[0] ? Number(slowQueries[0].slow_query_count) : 0

    // Simplified data quality score
    const dataQualityScore = 95 // Placeholder - would calculate from actual violations

    return {
      databaseHealth: {
        status: (dbHealth.status === 'healthy' ? 
          (slowQueryCount > 10 ? 'warning' : 'healthy') : 'critical') as 'healthy' | 'warning' | 'critical',
        connectionCount: 0, // Would get from connection pool
        slowQueries: slowQueryCount,
        avgQueryTime: 0
      },
      systemMetrics: {
        cacheHitRate: 85, // Placeholder - would get from Redis
        errorRate: 0.5, // Placeholder - would get from error logs
        dataQualityScore
      }
    }
  }

  // Get trend data for charts
  static async getTrendData(periods: number = 12): Promise<TrendData> {
    const trendQuery = await db.prisma.$queryRaw`
      SELECT 
        to_char(month_series.month, 'YYYY-MM') as period,
        COALESCE(user_growth.new_users, 0) as user_growth,
        COALESCE(revenue.monthly_revenue, 0) as revenue,
        COALESCE(sales.sales_volume, 0) as sales_volume,
        COALESCE(developments.new_developments, 0) as new_developments
      FROM (
        SELECT generate_series(
          date_trunc('month', now()) - interval '${periods - 1} months',
          date_trunc('month', now()),
          interval '1 month'
        ) as month
      ) as month_series
      LEFT JOIN (
        SELECT 
          date_trunc('month', created) as month,
          COUNT(*) as new_users
        FROM users
        WHERE created >= date_trunc('month', now()) - interval '${periods} months'
        GROUP BY date_trunc('month', created)
      ) user_growth ON month_series.month = user_growth.month
      LEFT JOIN (
        SELECT 
          date_trunc('month', date) as month,
          SUM(amount) as monthly_revenue
        FROM financial_transactions
        WHERE status = 'COMPLETED' 
          AND date >= date_trunc('month', now()) - interval '${periods} months'
        GROUP BY date_trunc('month', date)
      ) revenue ON month_series.month = revenue.month
      LEFT JOIN (
        SELECT 
          date_trunc('month', u.updated_at) as month,
          COUNT(*) as sales_volume
        FROM units u
        WHERE u.status = 'SOLD' 
          AND u.updated_at >= date_trunc('month', now()) - interval '${periods} months'
        GROUP BY date_trunc('month', u.updated_at)
      ) sales ON month_series.month = sales.month
      LEFT JOIN (
        SELECT 
          date_trunc('month', created) as month,
          COUNT(*) as new_developments
        FROM developments
        WHERE created >= date_trunc('month', now()) - interval '${periods} months'
        GROUP BY date_trunc('month', created)
      ) developments ON month_series.month = developments.month
      ORDER BY month_series.month
    `

    const results = Array.isArray(trendQuery) ? trendQuery : []
    
    return {
      period: 'monthly',
      userGrowth: results.map((r: any) => Number(r.user_growth)),
      revenue: results.map((r: any) => Number(r.revenue)),
      salesVolume: results.map((r: any) => Number(r.sales_volume)),
      newDevelopments: results.map((r: any) => Number(r.new_developments))
    }
  }

  // Get development performance ranking
  static async getDevelopmentRankings() {
    return db.prisma.$queryRaw`
      SELECT 
        da.id,
        da.name,
        da.sales_percentage,
        da.total_sales_value,
        da.avg_unit_price,
        CASE 
          WHEN da.sales_percentage >= 90 THEN 'Excellent'
          WHEN da.sales_percentage >= 70 THEN 'Good'
          WHEN da.sales_percentage >= 50 THEN 'Average'
          WHEN da.sales_percentage >= 25 THEN 'Below Average'
          ELSE 'Poor'
        END as performance_rating,
        RANK() OVER (ORDER BY da.sales_percentage DESC) as sales_rank,
        RANK() OVER (ORDER BY da.total_sales_value DESC) as value_rank
      FROM development_analytics da
      WHERE da.status IN ('MARKETING', 'SALES', 'COMPLETED')
        AND da.total_units > 0
      ORDER BY da.sales_percentage DESC, da.total_sales_value DESC
    `
  }

  // Real-time alerts and notifications
  static async getActiveAlerts() {
    const alerts = []

    // Check for slow sales
    const slowSales = await db.prisma.$queryRaw`
      SELECT 
        da.id,
        da.name,
        da.sales_percentage,
        EXTRACT(days FROM now() - da.created) as days_since_launch
      FROM development_analytics da
      WHERE da.status IN ('MARKETING', 'SALES')
        AND da.sales_percentage < 20
        AND da.created < now() - interval '3 months'
    `

    if (Array.isArray(slowSales) && slowSales.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Slow Sales Alert',
        message: `${slowSales.length} developments with low sales performance`,
        data: slowSales
      })
    }

    // Simplified alerting (would be enhanced with actual monitoring data)
    // Check for system performance using basic metrics
    const queryMetrics = db.getQueryMetrics()
    const hasPerformanceIssues = Object.keys(queryMetrics).length === 0 // Placeholder logic
    
    if (hasPerformanceIssues) {
      alerts.push({
        type: 'warning',
        title: 'Performance Alert',
        message: 'System performance monitoring needed',
        data: { queryMetrics }
      })
    }

    return alerts
  }

  // Export data for reporting
  static async exportDashboardData(format: 'json' | 'csv' = 'json') {
    const metrics = await this.getDashboardMetrics()
    const trends = await this.getTrendData()
    const rankings = await this.getDevelopmentRankings()

    const exportData = {
      generated: new Date().toISOString(),
      metrics,
      trends,
      rankings: Array.isArray(rankings) ? rankings : []
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = [
        'Metric,Value',
        `Total Active Users,${metrics.userMetrics.totalActiveUsers}`,
        `Total Developments,${metrics.developmentMetrics.totalDevelopments}`,
        `Monthly Revenue,${metrics.financialMetrics.monthlyRevenue}`,
        `Average Unit Price,${metrics.developmentMetrics.averageUnitPrice}`,
        `Data Quality Score,${metrics.performanceMetrics.systemMetrics.dataQualityScore}`
      ].join('\n')

      return csvData
    }

    return exportData
  }
}

// Export dashboard functions
export const getDashboardMetrics = DashboardService.getDashboardMetrics.bind(DashboardService)
export const getTrendData = DashboardService.getTrendData.bind(DashboardService)
export const getDevelopmentRankings = DashboardService.getDevelopmentRankings.bind(DashboardService)
export const getActiveAlerts = DashboardService.getActiveAlerts.bind(DashboardService)
export const exportDashboardData = DashboardService.exportDashboardData.bind(DashboardService)