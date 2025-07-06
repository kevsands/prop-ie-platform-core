import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { SocialLink } from './types';

interface SocialLinksProps {
  links: SocialLink[];
}

const iconMap = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  LinkedIn: Linkedin,
};

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <nav aria-label="Social media links">
      <ul className="flex items-center gap-4">
        {links.map((link) => {
          const Icon = iconMap[link.icon as keyof typeof iconMap];
          
          return (
            <li key={link.name}>
              <a
                href={link.href}
                className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                aria-label={link.ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`social-link-${link.name.toLowerCase()}`}
              >
                <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SocialLinks;