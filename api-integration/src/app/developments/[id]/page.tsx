/**
 * Universal Development Detail Page
 * Shows detailed information about any development with real-time unit listings
 * Data synchronized with developer portal and database
 */

import { Metadata } from 'next';
import DevelopmentDetailClient from '@/components/developments/DevelopmentDetailClient';

// Sample developments data for static generation
const developmentsData = {
  'ellwood-bloom': {
    id: 'ellwood-bloom',
    name: 'Ellwood Bloom',
    location: 'Celbridge, Co. Kildare',
    description: 'Modern apartments in the heart of Celbridge',
    startingPrice: 285000,
    unitsAvailable: 8,
    totalUnits: 68,
    completionDate: 'Q2 2025',
    heroImage: '/images/developments/ellwood-bloom/hero.jpg'
  },
  'ellwood': {
    id: 'ellwood',
    name: 'Ellwood',
    location: 'Drogheda, Co. Louth',
    description: 'Contemporary apartment living in Drogheda',
    startingPrice: 285000,
    unitsAvailable: 8,
    totalUnits: 24,
    completionDate: 'Q2 2025',
    heroImage: '/images/developments/ellwood/hero.jpg'
  },
  'ballymakenny-view': {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View',
    location: 'Drogheda, Co. Louth',
    description: 'Modern family homes in a convenient location with excellent amenities',
    startingPrice: 350000,
    unitsAvailable: 6,
    totalUnits: 16,
    completionDate: 'Q3 2025',
    heroImage: '/images/developments/ballymakenny-view/hero.jpg'
  },
  'fitzgerald-gardens': {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    location: 'Dublin 8',
    description: 'Contemporary living in Dublin city',
    startingPrice: 350000,
    unitsAvailable: 12,
    totalUnits: 45,
    completionDate: 'Q3 2025',
    heroImage: '/images/developments/fitzgerald-gardens/hero.jpg'
  }
};

// Using shared UnitCard component from '@/components/units'

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(developmentsData).map((id) => ({
    id: id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const development = developmentsData[resolvedParams.id as keyof typeof developmentsData];
  
  if (!development) {
    return {
      title: 'Development Not Found - PROP.ie',
      description: 'The requested development could not be found.',
    };
  }

  return {
    title: `${development.name} - ${development.location} | PROP.ie`,
    description: `${development.description}. Starting from €${development.startingPrice.toLocaleString()}. ${development.unitsAvailable} units available.`,
    openGraph: {
      title: `${development.name} - ${development.location}`,
      description: development.description,
      images: development.heroImage ? [development.heroImage] : undefined,
    },
  };
}

export default async function UniversalDevelopmentPage({ params }: Props) {
  const resolvedParams = await params;
  const developmentId = resolvedParams.id;

  return <DevelopmentDetailClient initialDevelopmentId={developmentId} />;
}