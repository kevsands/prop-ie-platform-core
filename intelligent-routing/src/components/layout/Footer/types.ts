// Footer component types and interfaces
export interface FooterLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  ariaLabel: string;
}

export interface FooterProps {
  className?: string;
}