export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ContactPageData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  offices: Office[];
  faqs: FAQItem[];
  socialLinks: SocialLink[];
  ctaTitle: string;
  ctaText: string;
}

export interface ContactComponentProps {
  data?: ContactPageData;
  isLoading?: boolean;
}

export interface ContactHeroProps {
  title: string;
  subtitle: string;
  image?: string;
}

export interface ContactInfoProps {
  email: string;
  phone: string;
  address: string;
}

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>\n  );
}

export interface MapProps {
  offices: Office[];
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  defaultZoom?: number;
}

export interface OfficeMarkerProps {
  office: Office;
}

export interface OfficesListProps {
  offices: Office[];
}

export interface OfficeItemProps {
  office: Office;
  onHover?: () => void;
}

export interface FAQListProps {
  faqs: FAQItem[];
}

export interface FAQItemProps {
  faq: FAQItem;
  isOpen?: boolean;
  onToggle?: () => void;
}

export interface SocialCtaProps {
  title: string;
  text: string;
  socialLinks: SocialLink[];
}

// Leaflet map specific types
export interface MapOptions {
  center: [numbernumber];
  zoom: number;
  scrollWheelZoom?: boolean;
}

export interface MarkerOptions {
  position: [numbernumber];
  icon?: any;
  popup?: string;
}