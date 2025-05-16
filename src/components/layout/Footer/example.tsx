import React from 'react';
import Footer from './Footer';

// Example usage of the Footer component
const ExamplePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Page content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Example Page</h1>
          <p>Your page content goes here...</p>
        </div>
      </main>

      {/* Footer - always at the bottom */}
      <Footer />
    </div>
  );
};

// Example with custom styling
const CustomStyledFooter: React.FC = () => {
  return (
    <Footer className="border-t-4 border-blue-500" />
  );
};

// Example with custom footer data (would require modifying the component)
const CustomFooterData = {
  columns: [
    {
      title: 'Products',
      links: [
        { label: 'Platform', href: '/platform' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    // ... more columns
  ],
  socialLinks: [
    { name: 'GitHub', href: 'https://github.com/propie', icon: 'GitHub' },
    // ... more social links
  ],
};

export default ExamplePage;