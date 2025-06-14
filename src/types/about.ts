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
}

export interface AboutPageData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  missionTitle: string;
  missionStatement: string;
  missionImage?: string;
  team: TeamMember[];
  values: CompanyValue[];
  timeline: TimelineItem[];
  ctaTitle: string;
  ctaText: string;
  ctaButtonText: string;
  ctaButtonLink: string;
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