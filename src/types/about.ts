export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface TimelineItem {
  id: string;
  year: string | number;
  title: string;
  description: string;
  image?: string;
  milestones?: string[];
}

export interface AboutPageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  mission: {
    title: string;
    content: string;
    highlights: string[];
  };
  values: CompanyValue[];
  team: TeamMember[];
  timeline: TimelineItem[];
  statistics: {
    metrics: {
      homesBuilt: number;
      happyFamilies: number;
      sustainabilityRating: number;
      employeeCount: number;
    };
    awards: Array<{
      id: string;
      title: string;
      organization: string;
    }>;
  };
  partnerships: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    image: string;
  }>;
  cta: {
    title: string;
    description: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
  };
}

export interface AboutComponentProps {
  data?: AboutPageData;
  isLoading?: boolean;
}

export interface AboutHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

export interface AboutMissionProps {
  title: string;
  statement: string;
  image?: string;
}

export interface AboutTeamProps {
  members: TeamMember[];
}

export interface AboutTeamMemberProps {
  member: TeamMember;
}

export interface AboutValuesProps {
  values: CompanyValue[];
}

export interface AboutValueItemProps {
  value: CompanyValue;
}

export interface AboutTimelineProps {
  items: TimelineItem[];
}

export interface AboutTimelineItemProps {
  item: TimelineItem;
  index: number;
}

export interface AboutCtaProps {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}