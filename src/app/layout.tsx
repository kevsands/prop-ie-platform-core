// src/app/layout.tsx
import React from "react";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Providers from "./Providers";
import PerformanceProvider from "@/components/performance/PerformanceProvider";
// import ServiceWorkerRegistration from "@/components/performance/ServiceWorkerRegistration";
import { APIErrorBoundary } from "@/components/error-boundaries";

// Initialize fonts with performance optimizations
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true
});

const lora = Lora({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
  preload: true,
  adjustFontFallback: true
});

// Define viewport metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e3347',
  userScalable: true
};

// Define application metadata with enhanced SEO and PWA support
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Prop.ie',
    default: 'Prop.ie - Interactive Property Platform',
  },
  description: 'Interactive property and real estate platform for developments in Ireland',
  keywords: ['property', 'real estate', 'ireland', 'development', 'housing'],
  authors: [
    { name: 'Prop.ie Team' }
  ],
  creator: 'Prop.ie',
  publisher: 'Prop.ie',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
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
  openGraph: {
    title: 'Prop.ie - Interactive Property Platform',
    description: 'Interactive property and real estate platform for developments in Ireland',
    url: 'https://www.prop.ie/',
    siteName: 'Prop.ie',
    locale: 'en_IE',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prop.ie - Interactive Property Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop.ie - Interactive Property Platform',
    description: 'Interactive property and real estate platform for developments in Ireland',
    creator: '@prop_ie',
    images: ['/twitter-image.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  }
};

/**
 * Root Layout Component (Server Component by default in Next.js App Router)
 * 
 * This component provides the HTML structure and applies the font classes.
 * It also includes the ClientLayout component which provides the navigation and footer.
 * Now it also includes the Providers component to set up QueryClient.
 * Enhanced with performance monitoring and service worker registration.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} font-sans bg-background text-foreground`}>
      <body className={inter.className}>
        <Providers>
          {/* <PerformanceProvider> */}
            {/* <ServiceWorkerRegistration /> */}
            <APIErrorBoundary 
              config={{
                name: 'Global API Error Boundary',
                retryEnabled: true,
                maxRetries: 3,
                showTechnicalDetails: process.env.NODE_ENV === 'development'
              }}
            >
              <ClientLayout>
                {children}
              </ClientLayout>
            </APIErrorBoundary>
          {/* </PerformanceProvider> */}
        </Providers>
      </body>
    </html>
  );
}