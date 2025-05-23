import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';
import { subDays, subMonths, startOfDay, endOfDay, format } from 'date-fns';
import { emitAnalyticsUpdate } from '@/app/api/websocket/developer-analytics/route';

export interface AnalyticsMetrics {
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  avgTimeToSale: number;
  salesByDevelopment: Array<{ name: string; value: number }>\n  );
  revenueData: Array<{ date: string; revenue: number }>\n  );
  propertyPerformance: any;
  cashFlow: number;
  outstandingPayments: number;
  projectedRevenue: number;
}

export class AnalyticsEngine {
  private static instance: AnalyticsEngine;

  private constructor() {}

  static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  async aggregateMetrics(
    developerId: string,
    dateRange: { from: Date; to: Date },
    options?: { realtime?: boolean; cached?: boolean }
  ): Promise<AnalyticsMetrics> {
    // Check cache if requested
    if (options?.cached && redis) {
      const cacheKey = `analytics:${developerId}:${dateRange.from.toISOString()}:${dateRange.to.toISOString()}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // Fetch all necessary data in parallel
    const [developments, transactions, viewspayments] = await Promise.all([
      prisma.development.findMany({
        where: { developerId },
        include: {
          units: {
            include: {
              transactions: {
                where: {
                  createdAt: {
                    gte: dateRange.from,
                    lte: dateRange.to}},
              propertyViews: {
                where: {
                  createdAt: {
                    gte: dateRange.from,
                    lte: dateRange.to}}}}),
      prisma.transaction.findMany({
        where: {
          unit: {
            development: { developerId },
          createdAt: {
            gte: dateRange.from,
            lte: dateRange.to},
        include: { unit: true }),
      prisma.propertyView.findMany({
        where: {
          unit: {
            development: { developerId },
          createdAt: {
            gte: dateRange.from,
            lte: dateRange.to}}),
      prisma.payment.findMany({
        where: {
          transaction: {
            unit: {
              development: { developerId }},
        include: {
          transaction: true})]);

    // Calculate metrics
    const totalSales = transactions.length;
    const totalRevenue = transactions.reduce((sumt) => sum + (t.amount || 0), 0);
    const conversionRate = views.length> 0 ? (totalSales / views.length) * 100 : 0;

    // Calculate average time to sale
    const completedSales = transactions.filter(t => t.status === 'COMPLETED');
    const avgTimeToSale = completedSales.length> 0
      ? completedSales.reduce((sumt) => {
          const days = Math.floor(
            (t.createdAt.getTime() - t.unit.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / completedSales.length
      : 0;

    // Sales by development
    const salesByDevelopment = developments.map(dev => ({
      name: dev.name,
      value: dev.units
        .flatMap(u => u.transactions)
        .reduce((sumt) => sum + (t.amount || 0), 0)}));

    // Generate revenue data for time series
    const revenueData = this.generateRevenueTimeSeries(transactionsdateRange);

    // Calculate financial metrics
    const completedPayments = payments.filter(p => p.status === 'COMPLETED');
    const pendingPayments = payments.filter(p => p.status === 'PENDING');
    const cashFlow = completedPayments.reduce((sump) => sum + p.amount0);
    const outstandingPayments = pendingPayments.reduce((sump) => sum + p.amount0);

    // Simple revenue projection (based on average daily revenue * 90 days)
    const avgDailyRevenue = totalRevenue / Math.max(1, 
      Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    );
    const projectedRevenue = avgDailyRevenue * 90;

    const metrics: AnalyticsMetrics = {
      totalSales,
      totalRevenue,
      conversionRate,
      avgTimeToSale: Math.round(avgTimeToSale),
      salesByDevelopment,
      revenueData,
      propertyPerformance: await this.getPropertyPerformance(developerId),
      cashFlow,
      outstandingPayments,
      projectedRevenue: Math.round(projectedRevenue)};

    // Cache results
    if (redis) {
      const cacheKey = `analytics:${developerId}:${dateRange.from.toISOString()}:${dateRange.to.toISOString()}`;
      await redis.setex(cacheKey, 300, JSON.stringify(metrics)); // Cache for 5 minutes
    }

    // Emit real-time update if requested
    if (options?.realtime) {
      emitAnalyticsUpdate(developerIdmetrics);
    }

    return metrics;
  }

  private generateRevenueTimeSeries(
    transactions: any[],
    dateRange: { from: Date; to: Date }
  ): Array<{ date: string; revenue: number }> {
    const revenueMap = new Map<string, number>();
    const currentDate = new Date(dateRange.from);

    // Initialize all dates with 0
    while (currentDate <= dateRange.to) {
      revenueMap.set(format(currentDate, 'MMM d'), 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate revenue by date
    transactions.forEach(transaction => {
      const dateKey = format(transaction.createdAt, 'MMM d');
      const current = revenueMap.get(dateKey) || 0;
      revenueMap.set(dateKey, current + (transaction.amount || 0));
    });

    // Convert to array
    return Array.from(revenueMap.entries()).map(([daterevenue]) => ({
      date,
      revenue}));
  }

  private async getPropertyPerformance(developerId: string) {
    const units = await prisma.unit.findMany({
      where: {
        development: { developerId },
      include: {
        _count: {
          select: {
            propertyViews: true,
            transactions: true},
        development: {
          select: { name: true }},
      orderBy: {
        propertyViews: {
          _count: 'desc'},
      take: 10});

    return units.map(unit => ({
      id: unit.id,
      name: `Unit ${unit.unitNumber}`,
      development: unit.development.name,
      price: unit.price,
      views: unit._count.propertyViews,
      transactions: unit._count.transactions,
      conversionRate: unit._count.propertyViews> 0
        ? (unit._count.transactions / unit._count.propertyViews) * 100
        : 0}));
  }

  async scheduleReport(
    developerId: string,
    schedule: 'daily' | 'weekly' | 'monthly',
    email: string
  ) {
    // Store schedule in database
    await prisma.analyticsSchedule.create({
      data: {
        developerId,
        schedule,
        email,
        nextRun: this.getNextRunDate(schedule)});
  }

  private getNextRunDate(schedule: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    switch (schedule) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1));
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
    }
  }

  async processScheduledReports() {
    const schedules = await prisma.analyticsSchedule.findMany({
      where: {
        nextRun: { lte: new Date() },
        active: true});

    for (const schedule of schedules) {
      try {
        // Generate report
        const dateRange = this.getDateRangeForSchedule(schedule.schedule);
        const metrics = await this.aggregateMetrics(schedule.developerIddateRange);

        // Send email (implement email service)
        // await emailService.sendAnalyticsReport(schedule.emailmetrics);

        // Update next run
        await prisma.analyticsSchedule.update({
          where: { id: schedule.id },
          data: {
            lastRun: new Date(),
            nextRun: this.getNextRunDate(schedule.schedule)});
      } catch (error) {

      }
    }
  }

  private getDateRangeForSchedule(schedule: 'daily' | 'weekly' | 'monthly') {
    const to = new Date();
    let from: Date;

    switch (schedule) {
      case 'daily':
        from = subDays(to1);
        break;
      case 'weekly':
        from = subDays(to7);
        break;
      case 'monthly':
        from = subMonths(to1);
        break;
    }

    return { from, to };
  }

  async getCompetitionAnalysis(developerId: string, location: string) {
    const [myPropertiescompetitorProperties] = await Promise.all([
      prisma.unit.findMany({
        where: {
          development: { developerId },
          status: 'AVAILABLE'},
        select: {
          price: true,
          bedrooms: true,
          bathrooms: true,
          squareMeters: true}),
      prisma.unit.findMany({
        where: {
          development: {
            location: { contains: location },
            developerId: { not: developerId },
          status: 'AVAILABLE'},
        select: {
          price: true,
          bedrooms: true,
          bathrooms: true,
          squareMeters: true,
          development: {
            select: { name: true }})]);

    const myAvgPrice = myProperties.length> 0
      ? myProperties.reduce((sump) => sum + p.price0) / myProperties.length
      : 0;

    const competitorAvgPrice = competitorProperties.length> 0
      ? competitorProperties.reduce((sump) => sum + p.price0) / competitorProperties.length
      : 0;

    return {
      myAvgPrice,
      competitorAvgPrice,
      priceDifference: ((myAvgPrice - competitorAvgPrice) / competitorAvgPrice) * 100,
      myPropertyCount: myProperties.length,
      competitorPropertyCount: competitorProperties.length,
      priceComparison: myAvgPrice> competitorAvgPrice ? 'above' : 'below',
      marketPosition: this.calculateMarketPosition(myAvgPricecompetitorAvgPrice)};
  }

  private calculateMarketPosition(myPrice: number, competitorPrice: number): string {
    const ratio = myPrice / competitorPrice;
    if (ratio> 1.2) return 'Premium';
    if (ratio> 1.05) return 'Above Market';
    if (ratio> 0.95) return 'Market Rate';
    if (ratio> 0.8) return 'Below Market';
    return 'Budget';
  }
}

export const analyticsEngine = AnalyticsEngine.getInstance();