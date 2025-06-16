'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { FooterProps, FooterColumn, SocialLink } from './types';
import FooterColumnComponent from './FooterColumn';
import FooterLinkComponent from './FooterLink';
import SocialLinks from './SocialLinks';

const footerColumns: FooterColumn[] = [
  {
    title: 'Solutions',
    links: [
      { label: 'Home Buyers', href: '/buyers', ariaLabel: 'Solutions for home buyers' },
      { label: 'First Time Buyers', href: '/first-time-buyers', ariaLabel: 'First time buyer resources' },
      { label: 'Property Investors', href: '/investors', ariaLabel: 'Property investment solutions' },
      { label: 'Estate Agents', href: '/agents', ariaLabel: 'Resources for estate agents' },
      { label: 'Developers', href: '/developers', ariaLabel: 'Developer tools and services' },
      { label: 'Solicitors', href: '/solicitors', ariaLabel: 'Legal professional resources' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Mortgage Calculator', href: '/calculator', ariaLabel: 'Calculate your mortgage' },
      { label: 'Property Guides', href: '/guides', ariaLabel: 'Property buying guides' },
      { label: 'Market Reports', href: '/reports', ariaLabel: 'Real estate market reports' },
      { label: 'Stamp Duty Calculator', href: '/calculator/stamp-duty', ariaLabel: 'Calculate stamp duty' },
      { label: 'Help Centre', href: '/help', ariaLabel: 'Get help and support' },
      { label: 'Blog', href: '/blog', ariaLabel: 'Read our blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about', ariaLabel: 'Learn about PropIE' },
      { label: 'Careers', href: '/careers', ariaLabel: 'Career opportunities' },
      { label: 'Press', href: '/press', ariaLabel: 'Press and media resources' },
      { label: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
      { label: 'Partners', href: '/partners', ariaLabel: 'Our partners' },
      { label: 'Trust & Security', href: '/security', ariaLabel: 'Security information' },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: 'https://facebook.com/propie', icon: 'Facebook', ariaLabel: 'Follow us on Facebook' },
  { name: 'Twitter', href: 'https://twitter.com/propie', icon: 'Twitter', ariaLabel: 'Follow us on Twitter' },
  { name: 'Instagram', href: 'https://instagram.com/propie', icon: 'Instagram', ariaLabel: 'Follow us on Instagram' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/propie', icon: 'LinkedIn', ariaLabel: 'Connect on LinkedIn' },
];

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('footer-animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`relative overflow-hidden ${className}`}
      data-testid="footer"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>
      
      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Section */}
          <div className="py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Company Info */}
              <div className="lg:col-span-4 space-y-4">
                <Link href="/" className="inline-block group">
                  <Image 
                    src="/images/Prop Branding/Prop Master_Logo- White.png" 
                    alt="Prop.ie" 
                    width={160} 
                    height={54}
                    className="h-12 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                  />
                </Link>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-sm">
                  Ireland's leading property development platform, connecting buyers, developers, 
                  and investors with their perfect properties.
                </p>
                
                {/* Newsletter Signup - Shows on mobile only */}
                <div className="mt-6 md:hidden">
                  <h3 className="text-sm font-semibold text-white mb-3">Stay Updated</h3>
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      aria-label="Email address for newsletter"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                      aria-label="Subscribe to newsletter"
                    >
                      <Mail className="w-5 h-5 text-white" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Footer Columns */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {footerColumns.map((column) => (
                    <FooterColumnComponent
                      key={column.title}
                      title={column.title}
                      links={column.links}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-700"></div>

          {/* Secondary Footer */}
          <div className="py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <p className="text-sm text-gray-400 text-center sm:text-left">
                © 2026 PropIE Ltd. All rights reserved.
              </p>

              {/* Social Links */}
              <SocialLinks links={socialLinks} />
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-slate-700 pt-6 pb-8">
            <nav aria-label="Legal links">
              <ul className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-gray-400">
                <li>
                  <FooterLinkComponent href="/terms" ariaLabel="Terms and conditions">
                    Terms of Service
                  </FooterLinkComponent>
                </li>
                <li>
                  <FooterLinkComponent href="/privacy" ariaLabel="Privacy policy">
                    Privacy Policy
                  </FooterLinkComponent>
                </li>
                <li>
                  <FooterLinkComponent href="/cookies" ariaLabel="Cookie policy">
                    Cookie Policy
                  </FooterLinkComponent>
                </li>
                <li>
                  <FooterLinkComponent href="/gdpr" ariaLabel="GDPR compliance">
                    GDPR Compliance
                  </FooterLinkComponent>
                </li>
                <li>
                  <FooterLinkComponent href="/accessibility" ariaLabel="Accessibility statement">
                    Accessibility
                  </FooterLinkComponent>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.footer-animate-in) {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;