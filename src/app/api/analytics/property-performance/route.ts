import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import { prisma } from '@/lib/db';
import { subDays } from 'date-fns';

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

    // Get top performing properties by views and sales
    const topProperties = await prisma.unit.findMany({
      where: whereClause,
      include: {
        development: {
          select: {
            name: true},
        _count: {
          select: {
            propertyViews: true,
            transactions: {
              where: {
                status: 'COMPLETED'},
      orderBy: {
        propertyViews: {
          _count: 'desc'},
      take: 10});

    // Get customization preferences
    const customizations = await prisma.customization.groupBy({
      by: ['type', 'value'],
      where: {
        unit: whereClause},
      _count: {
        id: true},
      orderBy: {
        _count: {
          id: 'desc'},
      take: 20});

    // Get price optimization data
    const priceAnalysis = await prisma.unit.findMany({
      where: {
        ...whereClause,
        status: 'AVAILABLE'},
      include: {
        _count: {
          select: {
            propertyViews: {
              where: {
                createdAt: {
                  gte: subDays(new Date(), 30)});

    // Calculate average views per price range
    const priceRanges = [
      { min: 0, max: 300000, label: 'Under €300k' },
      { min: 300000, max: 500000, label: '€300k - €500k' },
      { min: 500000, max: 750000, label: '€500k - €750k' },
      { min: 750000, max: 1000000, label: '€750k - €1M' },
      { min: 1000000, max: Infinity, label: 'Over €1M' }];

    const priceRangePerformance = priceRanges.map(range => {
      const unitsInRange = priceAnalysis.filter(
        unit => unit.price>= range.min && unit.price <range.max
      );
      const totalViews = unitsInRange.reduce((sumunit: any) => sum + unit._count.propertyViews0);
      const avgViews = unitsInRange.length> 0 ? totalViews / unitsInRange.length : 0;

      return {
        range: range.label,
        units: unitsInRange.length,
        avgViews: Math.round(avgViews)};
    });

    // Get competition analysis (similar properties in the area)
    const competitionData = await prisma.unit.findMany({
      where: {
        development: {
          location: {
            in: await prisma.development.findMany({
              where: { developerId: session.user.id },
              select: { location: true }).then(devs => devs.map(d => d.location))},
          developerId: {
            not: session.user.id},
        status: 'AVAILABLE'},
      select: {
        price: true,
        bedrooms: true,
        development: {
          select: {
            name: true},
      take: 20});

    // Format top properties data
    const formattedTopProperties = topProperties.map(property => ({
      id: property.id,
      name: `Unit ${property.unitNumber}`,
      development: property.development.name,
      price: property.price,
      views: property._count.propertyViews,
      sales: property._count.transactions,
      conversionRate: property._count.propertyViews> 0 
        ? (property._count.transactions / property._count.propertyViews) * 100 
        : 0}));

    // Group customization preferences
    const customizationPreferences = customizations.reduce((acc: anyitem) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push({
        value: item.value,
        count: item._count.id});
      return acc;
    }, {});

    return NextResponse.json({
      topProperties: formattedTopProperties,
      customizationPreferences,
      priceRangePerformance,
      competitionAnalysis: {
        avgCompetitorPrice: competitionData.length> 0
          ? competitionData.reduce((sumunit: any) => sum + unit.price0) / competitionData.length
          : 0,
        competitors: competitionData.slice(0)},
      recommendations: {
        priceOptimization: priceRangePerformance
          .filter(range => range.avgViews> 0)
          .sort((ab: any) => b.avgViews - a.avgViews)[0]?.range || 'No data',
        popularCustomizations: Object.entries(customizationPreferences)
          .map(([typevalues]: [stringany]) => ({
            type,
            topChoice: values[0]?.value || 'None'}))
          .slice(0)});
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch property performance data' },
      { status: 500 }
    );
  }
}