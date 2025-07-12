/**
 * Fitzgerald Gardens Development Page
 * Public-facing page that displays live unit availability synchronized with developer management
 * Updates in real-time with unit management, sales, and developer portal changes
 */

import { Metadata } from 'next';
import { developmentsService } from '@/lib/services/developments-prisma';
import DevelopmentsPage from '@/components/pages/developments/DevelopmentsPage';

// Fixed development ID for Fitzgerald Gardens
const FITZGERALD_GARDENS_ID = 'fitzgerald-gardens';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const development = await developmentsService.getDevelopmentById(FITZGERALD_GARDENS_ID);
    
    if (!development) {
      return {
        title: 'Fitzgerald Gardens - Development Not Found | PROP.ie',
        description: 'Fitzgerald Gardens development information is currently unavailable.',
      };
    }

    const unitCount = development.totalUnits || 0;
    const startingPrice = development.startingPrice || 320000; // Default based on API data

    return {
      title: `${development.name} - ${development.location} | New Homes in Drogheda | PROP.ie`,
      description: `${development.description || 'Premium residential development in Drogheda with 2, 3 and 4 bedroom homes.'}. Starting from €${startingPrice.toLocaleString()}. ${unitCount} units available. Live availability updates.`,
      keywords: 'Fitzgerald Gardens, Drogheda, new homes, property development, 2 bedroom, 3 bedroom, 4 bedroom, apartments, PROP.ie',
      openGraph: {
        title: `${development.name} - Premium Homes in ${development.location}`,
        description: `${development.description || 'Premium residential development in Drogheda.'}. Starting from €${startingPrice.toLocaleString()}.`,
        images: development.mainImage ? [
          {
            url: development.mainImage,
            width: 1200,
            height: 630,
            alt: `${development.name} - Exterior view`,
          }
        ] : [
          {
            url: '/images/developments/fitzgerald-gardens/main-hero.jpg',
            width: 1200,
            height: 630,
            alt: 'Fitzgerald Gardens - Premium development in Drogheda',
          }
        ],
        type: 'website',
        locale: 'en_IE',
        siteName: 'PROP.ie',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${development.name} - New Homes in Drogheda`,
        description: `Premium development starting from €${startingPrice.toLocaleString()}. Live availability.`,
        images: development.mainImage ? [development.mainImage] : ['/images/developments/fitzgerald-gardens/main-hero.jpg'],
      },
      alternates: {
        canonical: '/developments/fitzgerald-gardens',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata for Fitzgerald Gardens:', error);
    return {
      title: 'Fitzgerald Gardens - Premium Homes in Drogheda | PROP.ie',
      description: 'Premium residential development in Drogheda with 2, 3 and 4 bedroom homes. Starting from €320,000. Live availability updates from developer management system.',
      openGraph: {
        title: 'Fitzgerald Gardens - Premium Homes in Drogheda',
        description: 'Premium residential development in Drogheda. Live availability updates.',
        images: ['/images/developments/fitzgerald-gardens/main-hero.jpg'],
      },
    };
  }
}

export default function FitzgeraldGardensPage() {
  // Use the DevelopmentDetailClient with the fixed development ID
  // This component handles all the real-time sync with:
  // - /developer/projects/fitzgerald-gardens/unit-management
  // - /developer/sales/fitzgerald-gardens  
  // - /developer/properties/availability
  return (
    <div className="min-h-screen bg-white">
      {/* Pass the development ID to the client component for real-time updates */}
      <DevelopmentsPage developmentId={FITZGERALD_GARDENS_ID} />
      
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Fitzgerald Gardens",
            "description": "Premium residential development in Drogheda with 2, 3 and 4 bedroom homes",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Drogheda",
              "addressCountry": "IE"
            },
            "offers": {
              "@type": "Offer",
              "priceRange": "€320,000 - €430,000",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            },
            "url": "https://prop.ie/developments/fitzgerald-gardens",
            "image": "/images/developments/fitzgerald-gardens/main-hero.jpg"
          })
        }}
      />
    </div>
  );
}