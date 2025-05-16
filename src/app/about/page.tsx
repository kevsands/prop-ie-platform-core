import { Metadata } from 'next';
import { 
  AboutPageData, 
  TeamMember, 
  CompanyValue, 
  TimelineItem 
} from '@/types/about';
import AboutPageClient from '@/components/about/AboutPageClient';

// Define metadata for the page
export const metadata: Metadata = {
  title: 'About Us | Prop - Premier Property Developers in Ireland',
  description: 'Learn about Prop, Ireland\'s leading property developer. Discover our mission, values, team, and the story behind our commitment to creating exceptional homes.',
  keywords: 'property developer, homes in Ireland, sustainable development, property development company, Irish property developer',
};

// Sample data for the About page
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'CEO & Founder',
    bio: 'John brings over 20 years of experience in real estate development and has led the company from its inception to becoming one of Ireland\'s premier property developers.',
    image: '/images/developments/fitzgerald-gardens/1.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/',
      twitter: 'https://twitter.com/',
      email: 'john@prop.ie'
    }
  },
  {
    id: '2',
    name: 'Sarah O\'Connor',
    role: 'Chief Operating Officer',
    bio: 'With a background in construction management and sustainable development, Sarah ensures all projects meet the highest standards of quality and sustainability.',
    image: '/images/developments/fitzgerald-gardens/2.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/',
      email: 'sarah@prop.ie'
    }
  },
  {
    id: '3',
    name: 'Michael Kennedy',
    role: 'Head of Architecture',
    bio: 'Michael leads our architectural team with a focus on innovative design that balances aesthetics, functionality, and environmental impact.',
    image: '/images/developments/fitzgerald-gardens/3.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/',
      email: 'michael@prop.ie'
    }
  },
  {
    id: '4',
    name: 'Emma Murphy',
    role: 'Director of Sustainability',
    bio: 'Emma ensures all our developments meet the highest environmental standards, focusing on energy efficiency and sustainable materials.',
    image: '/images/developments/fitzgerald-gardens/4.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/',
      email: 'emma@prop.ie'
    }
  }
];

const companyValues: CompanyValue[] = [
  {
    id: '1',
    title: 'Quality',
    description: 'We never compromise on quality. Every home we build is crafted with attention to detail and built to last.',
    icon: 'quality'
  },
  {
    id: '2',
    title: 'Innovation',
    description: 'We embrace new technologies and innovative design practices to create homes that meet modern lifestyle needs.',
    icon: 'innovation'
  },
  {
    id: '3',
    title: 'Sustainability',
    description: 'Environmental responsibility is at the heart of everything we do, from design to construction.',
    icon: 'sustainability'
  },
  {
    id: '4',
    title: 'Community',
    description: 'We don\'t just build houses; we create communities where people love to live.',
    icon: 'community'
  }
];

const timeline: TimelineItem[] = [
  {
    id: '1',
    year: '2010',
    title: 'Company Founded',
    description: 'Prop was established with a vision to transform the Irish property development industry.',
    milestones: ['First office opened in Dublin', 'Initial team of 5 people']
  },
  {
    id: '2',
    year: '2012',
    title: 'First Development',
    description: 'Completed our first major residential development in Cork.',
    milestones: ['50 homes delivered', 'Innovation award for sustainable design']
  },
  {
    id: '3',
    year: '2015',
    title: 'National Expansion',
    description: 'Expanded operations across Ireland with projects in Galway and Limerick.',
    milestones: ['500+ homes completed', 'Team grew to 50+ employees']
  },
  {
    id: '4',
    year: '2018',
    title: 'Sustainability Focus',
    description: 'Launched our Green Building Initiative, committing to carbon-neutral developments.',
    milestones: ['First passive house development', 'ISO 14001 certification']
  },
  {
    id: '5',
    year: '2020',
    title: 'Digital Transformation',
    description: 'Introduced virtual home tours and online customization options.',
    milestones: ['Launched online platform', 'Digital sales increased by 200%']
  },
  {
    id: '6',
    year: '2023',
    title: 'Future Ready',
    description: 'Continuing to innovate with smart home technology and sustainable building practices.',
    milestones: ['1000+ homes built', 'Carbon neutral operations achieved']
  }
];

const partnerships = [
  {
    id: '1',
    name: 'Enterprise Ireland',
    logo: '/images/partnerships/enterprise-ireland.png'
  },
  {
    id: '2',
    name: 'Sustainable Energy Authority of Ireland',
    logo: '/images/partnerships/seai.png'
  },
  {
    id: '3',
    name: 'Irish Green Building Council',
    logo: '/images/partnerships/igbc.png'
  },
  {
    id: '4',
    name: 'Construction Industry Federation',
    logo: '/images/partnerships/cif.png'
  }
];

const testimonials = [
  {
    id: '1',
    name: 'Mary Johnson',
    role: 'Homeowner',
    content: 'The quality of our new home exceeded all expectations. The team at Prop made the entire process seamless.',
    image: '/images/testimonials/testimonial-1.jpg'
  },
  {
    id: '2',
    name: 'Patrick O\'Brien',
    role: 'Business Partner',
    content: 'Working with Prop has been a pleasure. Their commitment to quality and innovation is unmatched.',
    image: '/images/testimonials/testimonial-2.jpg'
  }
];

const statisticsData = {
  metrics: {
    homesBuilt: 1000,
    happyFamilies: 950,
    sustainabilityRating: 98,
    employeeCount: 75
  },
  awards: [
    {
      id: '1',
      title: 'Best Developer 2023',
      organization: 'Irish Property Awards'
    },
    {
      id: '2',
      title: 'Sustainability Excellence',
      organization: 'Green Building Council'
    }
  ]
};

const aboutPageData: AboutPageData = {
  hero: {
    title: 'Building Tomorrow\'s Communities Today',
    subtitle: 'Prop is Ireland\'s leading property developer, committed to creating exceptional homes that enhance lives and build sustainable communities.',
    backgroundImage: '/images/about/hero-bg.jpg'
  },
  mission: {
    title: 'Our Mission',
    content: 'To create exceptional living spaces that combine innovative design, sustainable practices, and community-focused development. We believe in building not just homes, but lasting communities where families can thrive.',
    highlights: [
      'Quality construction that stands the test of time',
      'Sustainable development practices',
      'Community-centered design approach',
      'Innovative home technology integration'
    ]
  },
  values: companyValues,
  team: teamMembers,
  timeline: timeline,
  statistics: statisticsData,
  partnerships: partnerships,
  testimonials: testimonials,
  cta: {
    title: 'Ready to Find Your Dream Home?',
    description: 'Explore our current developments and find the perfect home for your family.',
    primaryButton: {
      text: 'View Properties',
      link: '/properties'
    },
    secondaryButton: {
      text: 'Contact Us',
      link: '/contact'
    }
  }
};

export default function AboutPage() {
  return <AboutPageClient data={aboutPageData} />;
}