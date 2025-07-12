/**
 * Ballymakenny View Development Page
 * Beautiful brochure-style page showcasing house types, CGI renders, and specifications
 */

import { Metadata } from 'next';
import DevelopmentsPage from '@/components/pages/developments/DevelopmentsPage';

export const metadata: Metadata = {
  title: 'Ballymakenny View - Premium Homes in Drogheda | PROP.ie',
  description: 'Ballymakenny View offers stunning 3 & 4 bedroom homes with modern design and premium finishes. House Type A & B available. Beautiful location in Drogheda.',
  keywords: 'Ballymakenny View, Drogheda, new homes, property development, 3 bedroom, 4 bedroom, House Type A, House Type B, PROP.ie',
  openGraph: {
    title: 'Ballymakenny View - Premium Homes in Drogheda',
    description: 'Stunning new homes with modern design and premium finishes in Drogheda.',
    images: [
      {
        url: '/images/developments/Ballymakenny-View/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Ballymakenny View - Premium development in Drogheda',
      }
    ],
    type: 'website',
    locale: 'en_IE',
    siteName: 'PROP.ie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ballymakenny View - Premium Homes in Drogheda',
    description: 'Stunning new homes with modern design and premium finishes.',
    images: ['/images/developments/Ballymakenny-View/hero.jpg'],
  },
  alternates: {
    canonical: '/developments/ballymakenny-view',
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

export default function BallymakennViewPage() {
  return (
    <div className="min-h-screen bg-white">
      <DevelopmentsPage developmentId="ballymakenny-view" />
      
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Ballymakenny View",
            "description": "Premium residential development in Drogheda with 3 & 4 bedroom homes",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Drogheda",
              "addressCountry": "IE"
            },
            "offers": {
              "@type": "Offer",
              "priceRange": "€350,000 - €480,000",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            },
            "url": "https://prop.ie/developments/ballymakenny-view",
            "image": "/images/developments/Ballymakenny-View/hero.jpg"
          })
        }}
      />
    </div>
  );
}