"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface DropdownItem {
  label: string;
  href: string;
  tag?: string;
}

interface DropdownSection {
  section: string;
  links: DropdownItem[];
}

interface DropdownProps {
  title: string;
  items: DropdownSection[];
}

export default function MainNavbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/images/Prop Branding/Prop Master_Logo- White.png" 
                alt="Prop.ie" 
                width={120} 
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <DesktopDropdown 
                title="Solutions" 
                items={[
                  { section: "Home Buyers", links: [
                    { href: "/solutions/move-up-buyers", label: "Move-Up Buyers", tag: "Upgrade to your dream home" },
                    { href: "/solutions/home-buyers", label: "Home Buyers Resources", tag: "Tools and guides for all buyers" }
                  ]},
                  { section: "Investors", links: [
                    { href: "/solutions/professional-investors", label: "Professional Investors", tag: "Maximize your property portfolio" },
                    { href: "/solutions/institutional", label: "Institutional Investors", tag: "Large-scale property investment" }
                  ]},
                  { section: "Developers", links: [
                    { href: "/solutions/developer-hub", label: "Developer Hub", tag: "Tools and resources for developers" },
                    { href: "/solutions/project-management", label: "Project Management", tag: "Streamline your development projects" }
                  ]},
                  { section: "Professionals", links: [
                    { href: "/solutions/estate-agents", label: "Estate Agents", tag: "Property listing and management tools" },
                    { href: "/solutions/solicitors", label: "Solicitors", tag: "Document processing and conveyancing" },
                    { href: "/solutions/architects", label: "Architects", tag: "Design and planning resources" },
                    { href: "/solutions/engineers", label: "Engineers", tag: "Technical assessment tools" }
                  ]}
                ]} 
              />
              
              {/* Resources Dropdown */}
              <DesktopDropdown 
                title="Resources" 
                items={[
                  { section: "Guides & Tools", links: [
                    { href: "/resources/property-guides", label: "Property Guides", tag: "Comprehensive property information" },
                    { href: "/resources/calculators", label: "Calculators & Tools", tag: "Plan your finances" },
                    { href: "/resources/templates", label: "Document Templates", tag: "Ready-to-use legal documents" }
                  ]},
                  { section: "Market Information", links: [
                    { href: "/resources/market-reports", label: "Market Reports", tag: "Latest property market insights" },
                    { href: "/resources/regulations", label: "Regulations & Compliance", tag: "Stay compliant with current laws" }
                  ]},
                  { section: "Developer Resources", links: [
                    { href: "/resources/api-docs", label: "API Documentation", tag: "Integration guides for developers" },
                    { href: "/resources/webinars", label: "Webinars & Events", tag: "Educational opportunities" }
                  ]}
                ]} 
              />
              
              {/* Company Dropdown */}
              <DesktopDropdown 
                title="Company" 
                items={[
                  { section: "About", links: [
                    { href: "/company/about", label: "About Us", tag: "Our story and mission" },
                    { href: "/contact", label: "Contact Us", tag: "Get in touch with our team" }
                  ]},
                  { section: "Corporate", links: [
                    { href: "/company/careers", label: "Careers", tag: "Join our team" },
                    { href: "/company/press", label: "Press & Media", tag: "News and announcements" },
                    { href: "/company/testimonials", label: "Testimonials", tag: "What our clients say" }
                  ]}
                ]} 
              />
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={user?.role === 'developer' ? '/developer' : 
                        user?.role === 'buyer' ? '/buyer' : 
                        user?.role === 'solicitor' ? '/solicitor' : 
                        '/buyer'}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={signOut}
                  className="ml-4 bg-[#2B5273] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1E3A52]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="ml-4 bg-[#2B5273] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1E3A52]">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2B5273]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon */}
              <svg className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavSection title="Solutions">
              <MobileNavLink href="/solutions/first-time-buyers">First-Time Buyers</MobileNavLink>
              <MobileNavLink href="/solutions/professional-investors">Professional Investors</MobileNavLink>
              <MobileNavLink href="/solutions/developer-hub">Developer Hub</MobileNavLink>
              <MobileNavLink href="/solutions/solicitors">Solicitors</MobileNavLink>
            </MobileNavSection>
            
            <MobileNavSection title="Resources">
              <MobileNavLink href="/resources/property-guides">Property Guides</MobileNavLink>
              <MobileNavLink href="/resources/calculators">Calculators & Tools</MobileNavLink>
              <MobileNavLink href="/resources/market-reports">Market Reports</MobileNavLink>
            </MobileNavSection>
            
            <MobileNavSection title="Company">
              <MobileNavLink href="/company/about">About Us</MobileNavLink>
              <MobileNavLink href="/contact">Contact Us</MobileNavLink>
              <MobileNavLink href="/company/careers">Careers</MobileNavLink>
            </MobileNavSection>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-1">
              {isAuthenticated ? (
                <>
                  <MobileNavLink href={user?.role === 'developer' ? '/developer' : 
                                      user?.role === 'buyer' ? '/buyer' : 
                                      user?.role === 'solicitor' ? '/solicitor' : 
                                      '/buyer'}>
                    Dashboard
                  </MobileNavLink>
                  <button 
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/login">Login</MobileNavLink>
                  <MobileNavLink href="/register">Register</MobileNavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Desktop dropdown menu component
function DesktopDropdown({ title, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef} onMouseLeave={() => setIsOpen(false)}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-screen max-w-md rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
              {items.map((item, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{item.section}</h3>
                  <div className="mt-2 space-y-4">
                    {item.links.map((link, linkIndex) => (
                      <Link 
                        key={linkIndex}
                        href={link.href}
                        className="group flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150"
                      >
                        <div>
                          <p className="text-base font-medium text-gray-900 group-hover:text-[#2B5273]">{link.label}</p>
                          {link.tag && <p className="mt-1 text-sm text-gray-500">{link.tag}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile nav section component
function MobileNavSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
      >
        {title}
        <ChevronDown className={`h-5 w-5 transform ${isOpen ? 'rotate-180' : ''} transition-transform`} />
      </button>
      
      {isOpen && (
        <div className="pl-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Mobile nav link component
function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    >
      {children}
    </Link>
  );
} 