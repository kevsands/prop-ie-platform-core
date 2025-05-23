import React from 'react';
import Link from 'next/link';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  href, 
  children, 
  ariaLabel,
  className = '' 
}) => {
  return (
    <Link
      href={href}
      className={`
        text-gray-300 hover:text-white 
        transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800
        rounded-sm px-1 -mx-1
        ${className}
      `}
      aria-label={ariaLabel}
      data-testid={`footer-link-${href}`}
    >
      {children}
    </Link>
  );
};

export default FooterLink;