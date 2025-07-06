import { Metadata } from 'next';
import { 
  ContactPageData,
  Office,
  FAQItem,
  SocialLink
} from '@/types/contact';
import ContactPageClient from '@/components/contact/ContactPageClient';

// Define metadata for the page
export const metadata: Metadata = {
  title: 'Contact Us | Prop - Premier Property Developers in Ireland',
  description: 'Get in touch with Prop, Ireland\'s leading property developer. Contact our team for information about our developments, sales inquiries, or customer support.',
  keywords: 'contact property developer, property inquiries, new homes inquiry, development contact, Irish property contact',
};

// Sample data for the Contact page
const offices: Office[] = [
  {
    id: '1',
    name: 'Dublin Headquarters',
    address: '123 Business Park, Dublin 2, D02 AB12, Ireland',
    phone: '+353 1 234 5678',
    email: 'dublin@prop.ie',
    coordinates: {
      lat: 53.3498,
      lng: -6.2603
    },
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
  },
  {
    id: '2',
    name: 'Cork Office',
    address: '45 City Quarter, Cork, T12 RX8E, Ireland',
    phone: '+353 21 234 5678',
    email: 'cork@prop.ie',
    coordinates: {
      lat: 51.8979,
      lng: -8.4706
    },
    hours: 'Monday - Friday: 9:00 AM - 5:30 PM'
  },
  {
    id: '3',
    name: 'Galway Office',
    address: '78 Eyre Square, Galway, H91 FD83, Ireland',
    phone: '+353 91 234 5678',
    email: 'galway@prop.ie',
    coordinates: {
      lat: 53.2743,
      lng: -9.0514
    },
    hours: 'Monday - Friday: 9:00 AM - 5:30 PM'
  }
];

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'What types of properties do you develop?',
    answer: 'We develop a range of residential properties, including single-family homes, townhouses, apartments, and duplexes. Our developments range from urban apartment complexes to suburban neighborhoods.'
  },
  {
    id: '2',
    question: 'How do I reserve a property in one of your developments?',
    answer: 'You can reserve a property by contacting our sales team or visiting our sales office at the development location. A reservation typically requires a deposit and completion of our reservation form.'
  },
  {
    id: '3',
    question: 'Can I customize aspects of my new home?',
    answer: 'Yes, depending on the development phase and property type, we offer various customization options. These might include kitchen layouts, flooring choices, and interior finishes. Our sales team can provide details on available options for specific properties.'
  },
  {
    id: '4',
    question: 'Do you offer any guarantees with your properties?',
    answer: 'Yes, all our new homes come with a 10-year structural warranty. Additionally, appliances and systems are covered by manufacturers\' warranties. We also provide a customer care service for the first year to address any issues that might arise.'
  },
  {
    id: '5',
    question: 'What energy efficiency standards do your homes meet?',
    answer: 'All our new developments are built to achieve a minimum A3 Building Energy Rating (BER). This includes features such as high-efficiency heating systems, superior insulation, and energy-efficient windows and doors.'
  },
  {
    id: '6',
    question: 'How can I arrange a viewing of your show homes?',
    answer: 'You can schedule a viewing by calling our sales office, emailing us, or using the contact form on our website. We offer both in-person and virtual viewings for most of our developments.'
  }
];

const socialLinks: SocialLink[] = [
  {
    platform: 'Facebook',
    url: 'https://facebook.com/',
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/',
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/',
  }
];

const contactData: ContactPageData = {
  heroTitle: 'Get in Touch',
  heroSubtitle: "We're here to answer your questions and help you find your perfect home.",
  heroImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
  contactInfo: {
    email: 'info@prop.ie',
    phone: '+353 1 234 5678',
    address: '123 Business Park, Dublin 2, Ireland'
  },
  offices: offices,
  faqs: faqs,
  socialLinks: socialLinks,
  ctaTitle: 'Connect With Us',
  ctaText: 'Follow us on social media for the latest updates on our developments, events, and news.'
};

export default function ContactPage() {
  // Server component that passes data to the client component
  return <ContactPageClient data={contactData} />;
}