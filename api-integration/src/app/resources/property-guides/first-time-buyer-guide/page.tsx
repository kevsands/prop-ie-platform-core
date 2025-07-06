'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Table of contents component
const TableOfContents = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'saving-deposit', title: 'Saving for a Deposit' },
    { id: 'mortgage-approval', title: 'Getting Mortgage Approval' },
    { id: 'help-to-buy', title: 'Help-to-Buy Scheme' },
    { id: 'property-search', title: 'Property Search' },
    { id: 'making-offer', title: 'Making an Offer' },
    { id: 'legal-process', title: 'Legal Process' },
    { id: 'closing', title: 'Closing & Moving In' },
    { id: 'checklist', title: 'First-Time Buyer Checklist' },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contents</h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block py-1 px-2 rounded text-sm ${
                activeSection === section.id
                  ? 'bg-[#2B5273] text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <a
          href="#download-pdf"
          className="flex items-center text-[#2B5273] font-medium hover:underline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF Guide
        </a>
      </div>
    </div>
  );
};

// Related guide component
const RelatedGuide = ({ title, href, category }: { title: string; href: string; category: string }) => (
  <Link href={href} className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="text-xs font-medium text-[#2B5273]">{category}</div>
    <h4 className="font-medium text-gray-900 mt-1">{title}</h4>
  </Link>
);

export default function FirstTimeBuyerGuidePage() {
  const [activeSection, setActiveSection] = useState('introduction');
  
  // Update active section based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/resources" className="text-gray-500 hover:text-gray-700">
              Resources
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href="/resources/property-guides" className="text-gray-500 hover:text-gray-700">
              Property Guides
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium">First-Time Buyer Guide</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center text-sm mb-4">
          <span className="bg-[#2B5273] text-white px-2 py-1 rounded">Buying</span>
          <span className="text-gray-500 ml-4">Published: April 10, 2024</span>
          <span className="text-gray-500 ml-4">15 min read</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Complete Guide for First-Time Buyers in Ireland
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Everything you need to know about purchasing your first home in Ireland, from saving for a deposit to closing the deal.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="lg:w-2/3">
          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src="/images/resources/first-time-buyer.jpg"
                alt="First-time home buyers"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Buying your first home is one of life's most significant milestones. It's exciting, but can also be overwhelming, especially in Ireland's dynamic property market. This comprehensive guide will walk you through each step of the process, helping you navigate the complexities with confidence.
            </p>
            <p className="text-gray-700 mb-4">
              Ireland's property market has seen significant changes in recent years, with rising prices in urban centers and increasing demand for quality housing. For first-time buyers, this presents both challenges and opportunities. Government schemes like Help-to-Buy can provide valuable assistance, and understanding the entire process will help you make informed decisions.
            </p>
            <p className="text-gray-700">
              This guide breaks down the journey into manageable steps, providing practical advice at each stage - from saving your deposit to getting the keys to your new home.
            </p>
          </section>

          {/* Saving for a Deposit */}
          <section id="saving-deposit" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Saving for a Deposit</h2>
            <p className="text-gray-700 mb-4">
              The first hurdle for most first-time buyers is saving for a deposit. In Ireland, you'll typically need a deposit of at least 10% of the property's value, though this can be lower for certain new builds under the Help-to-Buy scheme.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How much deposit do you need?</h3>
            <div className="bg-blue-50 p-5 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Deposit requirements in Ireland:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>First-time buyers: Minimum 10% deposit for properties</li>
                <li>New builds with Help-to-Buy: Potentially as low as 5% effective deposit</li>
                <li>Second-hand homes: 10% minimum deposit</li>
                <li><strong>Example:</strong> For a €300,000 property, you'll need at least €30,000 saved</li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Effective Saving Strategies</h3>
            <p className="text-gray-700 mb-4">
              Saving such a substantial amount requires discipline and strategy. Here are some effective approaches:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>Set up a dedicated savings account</strong> - Preferably one with limited access to reduce temptation</li>
              <li><strong>Automate your savings</strong> - Set up a standing order to transfer money on payday</li>
              <li><strong>Use government schemes</strong> - Consider the Help-to-Buy scheme if eligible</li>
              <li><strong>Cut unnecessary expenses</strong> - Review subscriptions, dining out, and other discretionary spending</li>
              <li><strong>Consider moving temporarily</strong> - Moving back with family or sharing accommodation can accelerate savings</li>
              <li><strong>Look for additional income sources</strong> - Side jobs, overtime, or selling unused items</li>
            </ul>
            
            <div className="bg-gray-100 p-5 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Pro Tip: The 50/30/20 Budget Rule</h4>
              <p className="text-gray-700">
                A popular budgeting method is the 50/30/20 rule: 50% of your income goes to necessities, 30% to wants, and 20% to savings and debt repayment. If you're saving for a house, consider adjusting this to increase the savings portion.
              </p>
            </div>
          </section>

          {/* Getting Mortgage Approval */}
          <section id="mortgage-approval" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Mortgage Approval</h2>
            <p className="text-gray-700 mb-4">
              Before you start viewing properties, it's crucial to understand how much you can borrow. This means getting mortgage approval in principle, which gives you a clear budget for your house hunt.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Mortgage Lending Rules in Ireland</h3>
            <p className="text-gray-700 mb-4">
              In Ireland, mortgage lending is regulated by the Central Bank, which imposes limits on how much you can borrow:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>First-time buyers can borrow up to 3.5 times their annual gross income</li>
              <li>Some exceptions may apply, but these are limited and at the lender's discretion</li>
              <li>Your ability to repay (affordability) is also assessed based on your current expenses</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Steps to Mortgage Approval</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>Gather necessary documents</strong> - These typically include:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-600">
                  <li>6 months of bank statements</li>
                  <li>6 months of savings statements</li>
                  <li>6 months of loan statements</li>
                  <li>Payslips for the last 3-6 months</li>
                  <li>Employment detail summary (formerly P60) for the last 2 years</li>
                  <li>Proof of identity and address</li>
                  <li>Self-employed: 3 years of audited accounts</li>
                </ul>
              </li>
              <li className="pt-2"><strong>Compare mortgage lenders</strong> - Research different banks and mortgage providers to find the best rates and terms</li>
              <li><strong>Apply for approval in principle</strong> - This is a statement from a lender indicating how much they're willing to lend you</li>
              <li><strong>Understand the terms offered</strong> - Pay attention to:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-600">
                  <li>Interest rate (fixed vs variable)</li>
                  <li>Term length (typically 25-35 years)</li>
                  <li>Any special conditions or cash back offers</li>
                </ul>
              </li>
            </ol>
            
            <div className="bg-green-50 p-5 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Example: Mortgage Calculation</h4>
              <p className="text-gray-700 mb-3">
                Combined annual income: €70,000<br />
                Maximum mortgage (3.5 × income): €245,000<br />
                With a 10% deposit of €27,222<br />
                Property budget: €272,222
              </p>
              <p className="text-gray-700 italic">
                Note: This is a simplified example. Your actual borrowing power will depend on various factors including other financial commitments.
              </p>
            </div>
            
            <Link href="/resources/calculators/mortgage-calculator" className="inline-flex items-center text-[#2B5273] font-medium hover:underline">
              Try our mortgage calculator
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </section>

          {/* More sections would follow - truncated for brevity */}
          <section id="help-to-buy" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Help-to-Buy Scheme</h2>
            <p className="text-gray-700">
              The Help-to-Buy (HTB) scheme is a tax rebate designed to help first-time buyers get the deposit needed to buy or build a new home. Learn more in our detailed article.
            </p>
            <Link href="/resources/property-guides/help-to-buy-explained" className="inline-flex items-center mt-4 text-[#2B5273] font-medium hover:underline">
              Read our Help-to-Buy guide
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </section>

          {/* Call to action */}
          <div className="bg-[#2B5273] text-white p-8 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Need personalized advice?</h3>
            <p className="mb-4">
              Our property experts can help you navigate the first-time buyer journey with personalized guidance.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-white text-[#2B5273] px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="lg:sticky lg:top-24">
            <TableOfContents activeSection={activeSection} />
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Guides</h3>
              <div className="space-y-3">
                <RelatedGuide 
                  title="Help-to-Buy Scheme Explained" 
                  href="/resources/property-guides/help-to-buy-explained" 
                  category="Finance"
                />
                <RelatedGuide 
                  title="Ultimate Property Viewing Checklist" 
                  href="/resources/property-guides/property-viewing-checklist" 
                  category="Buying"
                />
                <RelatedGuide 
                  title="Understanding Mortgage Types" 
                  href="/resources/property-guides/mortgage-types" 
                  category="Finance"
                />
                <RelatedGuide 
                  title="Legal Process When Buying a Home" 
                  href="/resources/property-guides/legal-process" 
                  category="Legal"
                />
              </div>
              <Link href="/resources/property-guides" className="inline-flex items-center mt-4 text-[#2B5273] font-medium hover:underline">
                View all guides
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Expert Help</h3>
              <p className="text-gray-700 mb-4">
                Our mortgage advisors can help you find the best rates and guide you through the application process.
              </p>
              <Link 
                href="/contact"
                className="block w-full bg-[#2B5273] text-white text-center px-4 py-2 rounded-md font-medium hover:bg-[#1E3142] transition-colors"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 