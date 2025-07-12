/**
 * Ellwood Development Page
 * Beautiful brochure-style page showcasing this premium development
 */

import { Metadata } from 'next';
import DevelopmentsPage from '@/components/pages/developments/DevelopmentsPage';

export const metadata: Metadata = {
  title: 'Ellwood - Premium Development | PROP.ie',
  description: 'Ellwood offers contemporary living in a beautiful setting. Premium finishes and modern design throughout. Discover your perfect home.',
  keywords: 'Ellwood, new homes, property development, contemporary, premium, modern design, PROP.ie',
  openGraph: {
    title: 'Ellwood - Premium Development',
    description: 'Contemporary living in a beautiful setting with premium finishes.',
    images: [
      {
        url: '/images/developments/Ellwood-Logos/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Ellwood - Premium development',
      }
    ],
    type: 'website',
    locale: 'en_IE',
    siteName: 'PROP.ie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ellwood - Premium Development',
    description: 'Contemporary living with premium finishes and modern design.',
    images: ['/images/developments/Ellwood-Logos/hero.jpg'],
  },
  alternates: {
    canonical: '/developments/ellwood',
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

export default function EllwoodPage() {
  return (
    <div className="min-h-screen bg-white">
      <DevelopmentsPage developmentId="ellwood" />
      
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Ellwood",
            "description": "Premium residential development with contemporary living and beautiful setting",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            },
            "url": "https://prop.ie/developments/ellwood",
            "image": "/images/developments/Ellwood-Logos/hero.jpg"
          })
        }}
      />
    </div>
  );
}