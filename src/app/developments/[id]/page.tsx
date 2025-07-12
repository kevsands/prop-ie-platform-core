/**
 * Universal Development Detail Page
 * Shows detailed information about any development with real-time unit listings
 * Data synchronized with developer portal and enterprise database
 */

import { Metadata } from 'next';
import { developmentsService } from '@/lib/services/developments-prisma';
import DevelopmentDetailClient from '@/components/developments/DevelopmentDetailClientSimple';

interface Props {
  params: {
    id: string;
  };
}

// Dynamic route - no static generation needed
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const development = await developmentsService.getDevelopmentById(resolvedParams.id);
    
    if (!development) {
      return {
        title: 'Development Not Found - PROP.ie',
        description: 'The requested development could not be found.',
      };
    }

    return {
      title: `${development.name} - ${development.location} | PROP.ie`,
      description: `${development.description}. Starting from €${development.startingPrice?.toLocaleString() || 'TBD'}. ${development.totalUnits} units available.`,
      openGraph: {
        title: `${development.name} - ${development.location}`,
        description: development.description,
        images: development.mainImage ? [development.mainImage] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for development:', resolvedParams.id, error);
    return {
      title: 'Development - PROP.ie',
      description: 'Premium residential development in Ireland.',
    };
  }
}

export default async function UniversalDevelopmentPage({ params }: Props) {
  const resolvedParams = await params;
  const developmentId = resolvedParams.id;

  return <DevelopmentDetailClient initialDevelopmentId={developmentId} />;
}