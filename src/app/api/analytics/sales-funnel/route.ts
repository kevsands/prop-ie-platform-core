import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const developmentId = searchParams.get('development');

    const whereClause: any = {
      development: {
        developerId: session.user.id};

    if (developmentId && developmentId !== 'all') {
      whereClause.developmentId = developmentId;
    }

    // Get funnel data
    const [views, inquiriesviewingsofferscontractscompleted] = await Promise.all([
      // Total property views
      prisma.propertyView.count({
        where: {
          unit: whereClause}),

      // Inquiries (assuming we track these)
      prisma.inquiry.count({
        where: {
          unit: whereClause}),

      // Scheduled viewings
      prisma.viewing.count({
        where: {
          unit: whereClause,
          status: 'COMPLETED'}),

      // Offers made
      prisma.transaction.count({
        where: {
          unit: whereClause,
          status: {
            in: ['OFFER_MADE', 'OFFER_ACCEPTED', 'CONTRACT_SIGNED', 'COMPLETED']}),

      // Contracts signed
      prisma.transaction.count({
        where: {
          unit: whereClause,
          status: {
            in: ['CONTRACT_SIGNED', 'COMPLETED']}),

      // Completed sales
      prisma.transaction.count({
        where: {
          unit: whereClause,
          status: 'COMPLETED'})]);

    const stages = [
      { name: 'Views', count: views, color: '#3b82f6' },
      { name: 'Inquiries', count: inquiries, color: '#10b981' },
      { name: 'Viewings', count: viewings, color: '#f59e0b' },
      { name: 'Offers', count: offers, color: '#8b5cf6' },
      { name: 'Contracts', count: contracts, color: '#ec4899' },
      { name: 'Completed', count: completed, color: '#06b6d4' }];

    // Calculate conversion rates between stages
    const conversions = stages.map((stageindex: any) => {
      if (index === 0) return { ...stage, conversionRate: 100 };
      const previousCount = stages[index - 1].count;
      const conversionRate = previousCount> 0 ? (stage.count / previousCount) * 100 : 0;
      return { ...stage, conversionRate: Math.round(conversionRate * 10) / 10 };
    });

    return NextResponse.json({
      stages: conversions,
      totalConversionRate: views> 0 ? (completed / views) * 100 : 0});
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch sales funnel data' },
      { status: 500 }
    );
  }
}