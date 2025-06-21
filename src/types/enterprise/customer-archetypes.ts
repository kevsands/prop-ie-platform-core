/**
 * Enterprise Customer Archetype Definitions
 * Comprehensive typing for all platform user types
 */

export type PrimaryRole = 
  | 'DEVELOPER' 
  | 'BUYER' 
  | 'PROFESSIONAL' 
  | 'CORPORATE';

export type DeveloperSubtype = 
  | 'PROPERTY_DEVELOPER' 
  | 'CONSTRUCTION_COMPANY' 
  | 'INVESTMENT_FUND' 
  | 'LAND_DEVELOPER';

export type BuyerSubtype = 
  | 'FIRST_TIME_IRISH' 
  | 'FIRST_TIME_EU' 
  | 'FIRST_TIME_NON_EU' 
  | 'EXPERIENCED_CASH' 
  | 'EXPERIENCED_TRADE_UP' 
  | 'INVESTOR_BTL' 
  | 'INVESTOR_INTERNATIONAL';

export type ProfessionalSubtype = 
  | 'SOLICITOR' 
  | 'ESTATE_AGENT' 
  | 'MORTGAGE_BROKER' 
  | 'SURVEYOR' 
  | 'FINANCIAL_ADVISOR';

export type CorporateSubtype = 
  | 'INSTITUTIONAL_INVESTOR' 
  | 'CORPORATE_RELOCATION' 
  | 'PENSION_FUND' 
  | 'REIT';

export interface CustomerArchetype {
  primaryRole: PrimaryRole;
  subtype: DeveloperSubtype | BuyerSubtype | ProfessionalSubtype | CorporateSubtype;
  geographicFocus: GeographicFocus;
  urgency: Urgency;
  experience: ExperienceLevel;
}

export type GeographicFocus = 
  | 'DUBLIN' 
  | 'CORK' 
  | 'GALWAY' 
  | 'NATIONAL' 
  | 'INTERNATIONAL';

export type Urgency = 
  | 'RESEARCHING' 
  | 'ACTIVE' 
  | 'URGENT' 
  | 'FUTURE';

export type ExperienceLevel = 
  | 'FIRST_TIME' 
  | 'SOME_EXPERIENCE' 
  | 'EXPERIENCED' 
  | 'EXPERT';

export interface ValueProposition {
  headline: string;
  benefits: string[];
  cta: string;
  icon: string;
}

export const ARCHETYPE_VALUE_PROPS: Record<string, ValueProposition> = {
  PROPERTY_DEVELOPER: {
    headline: "Sell Properties Faster with Premium Marketing",
    benefits: [
      "Reach qualified first-time buyers with €30k HTB grants",
      "Premium property listings with 3D tours & virtual staging",
      "Integrated sales pipeline with automated buyer nurturing",
      "Real-time market analytics & pricing optimization"
    ],
    cta: "Start Selling Today",
    icon: "Building2"
  },
  FIRST_TIME_IRISH: {
    headline: "Get Your €30,000 Help-to-Buy Grant",
    benefits: [
      "Instant HTB eligibility calculator",
      "Access to HTB-exclusive new builds",
      "First-time buyer specialist support",
      "Stamp duty relief guidance"
    ],
    cta: "Check My €30k Grant",
    icon: "PiggyBank"
  },
  EXPERIENCED_CASH: {
    headline: "Premium Properties for Cash Buyers",
    benefits: [
      "Off-market property access",
      "Fast-track purchase process",
      "Investment yield analysis",
      "Portfolio management tools"
    ],
    cta: "View Premium Properties",
    icon: "Banknote"
  },
  SOLICITOR: {
    headline: "Streamline Property Transactions",
    benefits: [
      "Digital conveyancing workflow",
      "Integrated client communication",
      "Automated compliance checking",
      "Transaction progress tracking"
    ],
    cta: "Modernize Your Practice",
    icon: "FileText"
  },
  ESTATE_AGENT: {
    headline: "Match Buyers to Properties Instantly",
    benefits: [
      "AI-powered buyer matching",
      "Automated property recommendations",
      "Commission tracking & analytics",
      "Client relationship management"
    ],
    cta: "Increase Your Sales",
    icon: "Home"
  }
};

export interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  condition?: (archetype: Partial<CustomerArchetype>) => boolean;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'number' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string; description?: string }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  helpText?: string;
  condition?: (formData: any) => boolean;
}

export interface OnboardingPath {
  archetype: CustomerArchetype;
  steps: RegistrationStep[];
  redirectUrl: string;
  estimatedTime: number; // minutes
}