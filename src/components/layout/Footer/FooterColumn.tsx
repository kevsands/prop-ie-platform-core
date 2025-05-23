import React from 'react';
import { FooterLink } from './types';
import FooterLinkComponent from './FooterLink';

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="space-y-4 footer-column">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
        {title}
      </h3>
      <nav aria-label={`${title} navigation`}>
        <ul className="space-y-3">
          {links.map((link: any) => (
            <li key={link.href}>
              <FooterLinkComponent href={link.href} ariaLabel={link.ariaLabel}>
                {link.label}
              </FooterLinkComponent>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FooterColumn;