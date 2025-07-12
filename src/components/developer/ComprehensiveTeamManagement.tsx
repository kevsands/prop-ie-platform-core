'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Building, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Calendar,
  Briefcase,
  Shield,
  Award,
  Target,
  Activity,
  Edit,
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  Settings,
  Bell,
  UserCheck,
  FileText,
  Globe,
  Zap,
  Euro,
  BarChart3,
  MapPin,
  Home,
  Hammer,
  PenTool,
  HardHat,
  Calculator,
  Scale,
  TreePine,
  Lightbulb,
  Wrench,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';
import EnterpriseFinancialControlSystem from './EnterpriseFinancialControlSystem';
import EnterpriseCollaborationHub from './EnterpriseCollaborationHub';

// Professional specialist types - comprehensive 25+ categories
export const PROFESSIONAL_TYPES = {
  // Design & Planning Team (8 specialists)
  DESIGN: {
    LEAD_ARCHITECT: { 
      id: 'lead_architect', 
      name: 'Brady Hughes Consulting', 
      icon: Building, 
      category: 'Design & Planning',
      description: 'Lead Architect - Overall design coordination, planning applications',
      costPercentage: 1.5,
      typicalFee: '€3,000-€8,000 per unit',
      keyResponsibilities: ['Design coordination', 'Planning applications', 'Building regulations', 'PSDP Services'],
      certifications: ['RIAI', 'ARB Registration'],
      insurance: 'Professional Indemnity €2M+',
      contacts: ['Brian Hughes', 'Helen O\'Donnell'],
      currentProject: 'Fitzgerald Gardens - 96 Units'
    },
    LANDSCAPE_ARCHITECT: { 
      id: 'landscape_architect', 
      name: 'Gannon Landscape Architecture', 
      icon: TreePine, 
      category: 'Design & Planning',
      description: 'Site planning, amenities, sustainability',
      costPercentage: 0.5,
      typicalFee: '€1,000-€3,000 per unit',
      keyResponsibilities: ['Site planning', 'Amenity design', 'Sustainability', 'Public open space'],
      certifications: ['ILAI', 'Landscape Institute'],
      insurance: 'Professional Indemnity €1M+',
      contacts: ['Jonathan Gannon'],
      currentProject: 'Fitzgerald Gardens Landscape Design'
    },
    URBAN_DESIGNER: { 
      id: 'urban_designer', 
      name: 'Urban Designer', 
      icon: MapPin, 
      category: 'Design & Planning',
      description: 'Masterplanning, place-making, community integration',
      costPercentage: 0.3,
      typicalFee: '€500-€2,000 per unit',
      keyResponsibilities: ['Masterplanning', 'Place-making', 'Community integration'],
      certifications: ['RTPI', 'IAIA'],
      insurance: 'Professional Indemnity €1M+'
    },
    INTERIOR_DESIGNER: { 
      id: 'interior_designer', 
      name: 'Interior Designer', 
      icon: Home, 
      category: 'Design & Planning',
      description: 'Show homes, marketing suites, common areas',
      costPercentage: 0.2,
      typicalFee: '€300-€1,000 per unit',
      keyResponsibilities: ['Show home design', 'Marketing suites', 'Common areas'],
      certifications: ['IIDA', 'IDI'],
      insurance: 'Professional Indemnity €500k+'
    },
    SUSTAINABILITY_CONSULTANT: { 
      id: 'sustainability_consultant', 
      name: 'Sustainability Consultant', 
      icon: Lightbulb, 
      category: 'Design & Planning',
      description: 'NZEB compliance, renewable energy',
      costPercentage: 0.4,
      typicalFee: '€500-€1,500 per unit',
      keyResponsibilities: ['NZEB compliance', 'Renewable energy', 'Energy modeling'],
      certifications: ['IGBC', 'BRE'],
      insurance: 'Professional Indemnity €1M+'
    },
    PLANNING_CONSULTANT: { 
      id: 'planning_consultant', 
      name: 'Planning Consultant', 
      icon: FileText, 
      category: 'Design & Planning',
      description: 'Local authority liaison, appeals, conditions',
      costPercentage: 0.8,
      typicalFee: '€1,000-€3,000 per unit',
      keyResponsibilities: ['Planning applications', 'Appeals', 'Condition compliance'],
      certifications: ['RTPI', 'IPI'],
      insurance: 'Professional Indemnity €1M+'
    },
    CONSERVATION_ARCHITECT: { 
      id: 'conservation_architect', 
      name: 'Conservation Architect', 
      icon: Shield, 
      category: 'Design & Planning',
      description: 'Heritage buildings, protected structures',
      costPercentage: 0.3,
      typicalFee: '€500-€2,000 per unit',
      keyResponsibilities: ['Heritage assessment', 'Protected structures', 'Conservation'],
      certifications: ['RIAI', 'ICOMOS'],
      insurance: 'Professional Indemnity €2M+'
    },
    BIM_MANAGER: { 
      id: 'bim_manager', 
      name: 'BIM Manager', 
      icon: Globe, 
      category: 'Design & Planning',
      description: 'Digital coordination, clash detection, data management',
      costPercentage: 0.4,
      typicalFee: '€500-€1,200 per unit',
      keyResponsibilities: ['BIM coordination', 'Clash detection', 'Digital delivery'],
      certifications: ['Autodesk Certified', 'buildingSMART'],
      insurance: 'Professional Indemnity €1M+'
    }
  },

  // Engineering Team (6 specialists)
  ENGINEERING: {
    CIVIL_ENGINEER: { 
      id: 'civil_engineer', 
      name: 'Brady Hughes Consulting', 
      icon: MapPin, 
      category: 'Engineering',
      description: 'Civil engineering services integrated with architectural role',
      costPercentage: 0.0,
      typicalFee: 'Included in Architect fee (€228,000 total)',
      keyResponsibilities: [
        'Civil engineering design',
        'Site infrastructure planning', 
        'Road and drainage design',
        'Utility connection coordination',
        'Planning application civil elements',
        'FI response coordination'
      ],
      certifications: ['Engineers Ireland', 'Chartered Engineer'],
      insurance: 'Professional Indemnity €2M+',
      contacts: ['Brian Hughes', 'Helen O\'Donnell'],
      currentProject: 'Fitzgerald Gardens Infrastructure - Combined with Architect role',
      note: 'Civil Engineering services provided by Brady Hughes as part of comprehensive service'
    },
    STRUCTURAL_ENGINEER: { 
      id: 'structural_engineer', 
      name: 'Doherty Finegan Kelly Ltd (DFK)', 
      icon: Building, 
      category: 'Engineering',
      description: 'Structural designs, drawings, fire & DAC certification',
      costPercentage: 2.1,
      typicalFee: '€64,100 total (Phase 1 - 39 units)',
      keyResponsibilities: [
        'Structural general arrangement drawings',
        'House designs (25 units @ €800/unit)',
        'Duplex designs (14 units @ €1000/unit)', 
        'Block plan drawings (7 blocks @ €2000/block)',
        'Fire construction standard drawings',
        'DAC construction information',
        'Inspection and certification services',
        'Construction stage certifications'
      ],
      certifications: [
        'C.Eng, M.I.Struct.E (Francis Doherty)',
        'C.Eng, M.I.Struct.E, M.I.E.I (Emmet Finegan)', 
        'C.Eng, M.I.Struct.E, M.I.E.I (Cathal Kelly)'
      ],
      insurance: 'Professional Indemnity (full coverage)',
      contacts: [
        'Francis Doherty (Director)',
        'Emmet Finegan (Director)', 
        'Cathal Kelly (Director)',
        'Liam Murphy (Regional Director)'
      ],
      address: 'Botanic Court, 30-32 Botanic Road, Glasnevin, Dublin 9',
      phone: '01-8301852',
      email: 'efinegan@dfk.ie',
      website: 'www.dfk.ie',
      currentProject: 'Fitzgerald Gardens Phase 1 - 25 Houses + 14 Duplex units',
      contractDetails: {
        structuralHouses: 20000,
        gaDrawings: 14000, 
        duplexUnits: 14000,
        constructionCertification: 10500,
        dacCertification: 5600,
        totalFee: 64100,
        paymentTerms: '30 days from invoice',
        latePaymentPenalty: '7% above ECB rate',
        engagementConditions: 'ACEI SE 9202 Standards'
      }
    },
    MECHANICAL_ENGINEER: { 
      id: 'mechanical_engineer', 
      name: 'A.M Rogers + Associates (Balrath MSG Ltd)', 
      icon: Wrench, 
      category: 'Engineering',
      description: 'M&E Services, BER, Site Services & Certification',
      costPercentage: 1.2,
      typicalFee: '€25,670 total (Phase 1 - 27 units)',
      keyResponsibilities: [
        'M&E design services and coordination',
        'Site services design (ESB, EIR, Virgin Media)',
        'Building Energy Analysis & BER certification',
        'Part L & Part F compliance documentation',
        'Construction stage inspections',
        'Design certification on completion',
        'Utilities applications and coordination'
      ],
      certifications: ['Engineers Ireland', 'CIBSE'],
      insurance: 'Professional Indemnity €6.5M',
      currentProject: 'Fitzgerald Gardens Ph 1 - 27 units (2 duplex, 4 house types)',
      contractDetails: {
        proposalNumber: '2440 Rev 01',
        designServices: 14355,
        berAndSiteServices: 11315,
        totalFee: 25670,
        siteVisitRate: 550,
        hourlyRates: {
          engineeringDirector: 125,
          seniorEngineer: 95,
          intermediateEngineer: 65,
          juniorEngineer: 40
        }
      }
    },
    ELECTRICAL_ENGINEER: { 
      id: 'electrical_engineer', 
      name: 'A.M Rogers + Associates (Balrath MSG Ltd)', 
      icon: Zap, 
      category: 'Engineering',
      description: 'Combined with Mechanical - Full M&E package delivery',
      costPercentage: 0.0,
      typicalFee: 'Included in M&E package (€25,670 total)',
      keyResponsibilities: [
        'Electrical design and coordination',
        'Power distribution and lighting design',
        'Public lighting design',
        'Communications infrastructure',
        'ESB connection applications',
        'Site electrical coordination'
      ],
      certifications: ['Engineers Ireland', 'IET'],
      insurance: 'Professional Indemnity €6.5M',
      currentProject: 'Included in M&E package with A.M Rogers',
      note: 'Electrical services delivered as part of comprehensive M&E package'
    },
    FIRE_SAFETY_ENGINEER: { 
      id: 'fire_safety_engineer', 
      name: 'Fire Safety Engineer', 
      icon: Shield, 
      category: 'Engineering',
      description: 'Fire strategy, escape routes, systems design',
      costPercentage: 0.5,
      typicalFee: '€800-€2,000 per unit',
      keyResponsibilities: ['Fire strategy', 'Escape routes', 'Fire systems'],
      certifications: ['Engineers Ireland', 'IFE'],
      insurance: 'Professional Indemnity €2M+'
    },
    ACOUSTIC_ENGINEER: { 
      id: 'acoustic_engineer', 
      name: 'Acoustic Engineer', 
      icon: Bell, 
      category: 'Engineering',
      description: 'Sound insulation, environmental noise',
      costPercentage: 0.3,
      typicalFee: '€400-€1,000 per unit',
      keyResponsibilities: ['Sound insulation', 'Environmental noise', 'Acoustic design'],
      certifications: ['Institute of Acoustics', 'Engineers Ireland'],
      insurance: 'Professional Indemnity €1M+'
    }
  },

  // Construction & Safety Team (5 specialists)
  CONSTRUCTION: {
    PSCS: { 
      id: 'pscs', 
      name: 'PSCS (Project Supervisor Construction Stage)', 
      icon: HardHat, 
      category: 'Construction & Safety',
      description: 'Safety compliance during construction',
      costPercentage: 0.6,
      typicalFee: '€1,000-€2,500 per unit',
      keyResponsibilities: ['Construction safety', 'Safety file maintenance', 'Compliance'],
      certifications: ['CIF Safety', 'PSCS Certification'],
      insurance: 'Professional Indemnity €2M+'
    },
    PSDP: { 
      id: 'psdp', 
      name: 'PSDP (Project Supervisor Design Process)', 
      icon: PenTool, 
      category: 'Construction & Safety',
      description: 'Design stage safety coordination',
      costPercentage: 0.4,
      typicalFee: '€600-€1,500 per unit',
      keyResponsibilities: ['Design safety coordination', 'Safety file creation', 'Risk assessment'],
      certifications: ['CIF Safety', 'PSDP Certification'],
      insurance: 'Professional Indemnity €2M+'
    },
    ASSIGNED_CERTIFIER: { 
      id: 'assigned_certifier', 
      name: 'Assigned Certifier', 
      icon: CheckCircle, 
      category: 'Construction & Safety',
      description: 'Building regulations compliance and certification',
      costPercentage: 0.8,
      typicalFee: '€1,200-€3,000 per unit',
      keyResponsibilities: ['Building regulations', 'Compliance certification', 'Inspections'],
      certifications: ['RIAI', 'Engineers Ireland', 'RICS'],
      insurance: 'Professional Indemnity €2M+'
    },
    HEALTH_SAFETY_COORDINATOR: { 
      id: 'health_safety_coordinator', 
      name: 'Health & Safety Coordinator', 
      icon: Shield, 
      category: 'Construction & Safety',
      description: 'Site safety management, training',
      costPercentage: 0.5,
      typicalFee: '€800-€2,000 per unit',
      keyResponsibilities: ['Site safety', 'Training coordination', 'Safety audits'],
      certifications: ['NISO', 'IOSH', 'CIF Safety'],
      insurance: 'Professional Indemnity €1M+'
    },
    TIMBER_FRAME_SPECIALIST: { 
      id: 'timber_frame_specialist', 
      name: 'Specialist Timber Frame Contractor', 
      icon: Home, 
      category: 'Construction & Safety',
      description: 'Timber frame walls, party walls, and structural systems',
      costPercentage: 12.0,
      typicalFee: '€171,191 for Block 1 timber frame works',
      keyResponsibilities: [
        'Factory fitted foil breather membrane on structural sheeting',
        'CLS C16 treated timber frame construction',
        'Insulation between studs installation', 
        'Airtight vapour control layer (VCL) on OSB3 sheeting',
        'Window and door opening formation with air tightness membrane',
        'Party wall construction with acoustic insulation',
        'U-value compliance to current Building Regulations',
        'Shop drawings submission and architectural approval',
        'Quality control and installation supervision'
      ],
      certifications: ['Timber Frame Certification', 'CIF Membership'],
      insurance: 'Public Liability €6M+',
      currentProject: 'Block 1 - 386m² external walls, 246m² party walls',
      specializations: {
        externalWalls: 'Exceeding 300mm wide - €443.50/m²',
        partyWalls: 'Acoustic rated with mineral wool core',
        qualityStandards: 'Current Building Regulations compliance',
        airTightness: 'Membrane installation around all openings'
      }
    },
    CONSTRUCTION_MANAGER: { 
      id: 'construction_manager', 
      name: 'Meegan Builders', 
      icon: Hammer, 
      category: 'Construction & Safety',
      description: 'Main contractor - Multi-phase construction delivery (Active Contract)',
      costPercentage: 85.0,
      typicalFee: '€7,151,197 total contract (all phases)',
      keyResponsibilities: [
        'Preliminaries and site setup (€491,500)',
        'Site development works (€2,043,796)', 
        'Substructures and foundations (€362,848)',
        'External works and landscaping (€200,076)',
        'Building works - 7 block types (€4,052,976)',
        'Monthly progress valuations',
        'Quality control and programme management',
        'Health & safety compliance'
      ],
      certifications: ['CIF Membership', 'Construction Skills Certification'],
      insurance: 'Public Liability €10M+',
      currentProject: 'Fitzgerald Gardens Phase 1 - In Progress',
      contractStatus: 'Active Construction - Valuation #3 Completed',
      managedBy: 'Brady Hughes Consulting',
      contractDetails: {
        totalValue: 7151197,
        phase1Breakdown: {
          preliminaries: 491500,
          siteDevelopment: 2043796,
          substructures: 362848,
          externalWorks: 200076,
          buildingWorks: 4052976
        },
        blockTypes: {
          'Block Type 1': 650664,
          'Block Type 2': 463670,
          'Block Type 3': 594273,
          'Block Type 4': 463670,
          'Block Type 5': 650664,
          'Block Type 6': 645070,
          'Block Type 7': 584965
        },
        paymentTerms: {
          valuationFrequency: 'Monthly',
          retentionRate: 0.03,
          materialsOnSite: true,
          variationsTracked: true
        },
        currentValuation: {
          number: 3,
          claimAmount: 720750.98,
          assessedAmount: 611885.86,
          retention: -18356.58,
          materialsOnSite: 107300.00,
          variations: 4124.90,
          previouslyPaid: -214905.45,
          paymentDue: 485923.83
        },
        blockTypeBreakdown: {
          'Block Type 1 (4 Houses)': {
            description: '4Nr houses - Mix of Type 2, 3, and 4 configuration',
            totalValue: 650664,
            elementsIncluded: [
              'External walls structure (€34,818.66 brickwork)',
              'Internal walls structure (€8,035.02 partitions)', 
              'Stairs and ramps (€11,562 timber construction)',
              'Roof structure and finishes (€25,000+ incl. tiles)',
              'Windows and doors (€26,123.45 for Type D5 door)',
              'Mechanical installation (€83,490.63)',
              'Electrical installation (€24,200)',
              'Kitchen fittings (€19,580 for 4 kitchens)',
              'Sanitary fittings (€12,474 for all bathrooms)',
              'Finishes and decorating (€35,000+ walls, floors, ceilings)'
            ],
            qualityStandards: {
              brickwork: 'Cumbrian Hall red brick with white mortar',
              windows: 'Munster Joinery uPVC in Silver 7001',
              insulation: 'U-values to current Building Regulations',
              heating: 'Heat pump systems with thermostatic controls',
              airTightness: 'Target: <2m³/hr/m² at 50Pa pressure test',
              berRating: 'BER assessment required on completion'
            }
          }
        }
      }
    }
  },

  // Technical & Environmental Team (6 specialists)
  TECHNICAL: {
    GEOTECHNICAL_ENGINEER: { 
      id: 'geotechnical_engineer', 
      name: 'Geotechnical Engineer', 
      icon: MapPin, 
      category: 'Technical & Environmental',
      description: 'Ground investigations, foundation design',
      costPercentage: 0.4,
      typicalFee: '€600-€1,500 per unit',
      keyResponsibilities: ['Ground investigation', 'Foundation design', 'Soil analysis'],
      certifications: ['Engineers Ireland', 'IGS'],
      insurance: 'Professional Indemnity €2M+'
    },
    ENVIRONMENTAL_CONSULTANT: { 
      id: 'environmental_consultant', 
      name: 'Environmental Consultant', 
      icon: TreePine, 
      category: 'Technical & Environmental',
      description: 'EIA, ecology, contamination assessment',
      costPercentage: 0.3,
      typicalFee: '€400-€1,200 per unit',
      keyResponsibilities: ['Environmental impact', 'Ecology assessment', 'Contamination'],
      certifications: ['IEMA', 'CIEEM'],
      insurance: 'Professional Indemnity €1M+'
    },
    ARCHAEOLOGY_CONSULTANT: { 
      id: 'archaeology_consultant', 
      name: 'Archaeology Consultant', 
      icon: Shield, 
      category: 'Technical & Environmental',
      description: 'Site surveys, excavation monitoring',
      costPercentage: 0.2,
      typicalFee: '€200-€800 per unit',
      keyResponsibilities: ['Archaeological survey', 'Excavation monitoring', 'Heritage assessment'],
      certifications: ['IAI', 'CIfA'],
      insurance: 'Professional Indemnity €1M+'
    },
    UTILITY_ENGINEERS: { 
      id: 'utility_engineers', 
      name: 'Utility Engineers', 
      icon: Zap, 
      category: 'Technical & Environmental',
      description: 'ESB, gas, telecoms coordination',
      costPercentage: 0.5,
      typicalFee: '€700-€2,000 per unit',
      keyResponsibilities: ['Utility coordination', 'Connection design', 'Service planning'],
      certifications: ['Engineers Ireland', 'Utility specific'],
      insurance: 'Professional Indemnity €1M+'
    },
    TRANSPORT_CONSULTANT: { 
      id: 'transport_consultant', 
      name: 'Transport Consultant', 
      icon: MapPin, 
      category: 'Technical & Environmental',
      description: 'Traffic impact, parking, accessibility',
      costPercentage: 0.3,
      typicalFee: '€400-€1,000 per unit',
      keyResponsibilities: ['Traffic impact', 'Parking design', 'Accessibility'],
      certifications: ['Engineers Ireland', 'CIHT'],
      insurance: 'Professional Indemnity €1M+'
    },
    WASTE_MANAGEMENT_COORDINATOR: { 
      id: 'waste_management_coordinator', 
      name: 'Waste Management Coordinator', 
      icon: Target, 
      category: 'Technical & Environmental',
      description: 'Construction and operational waste',
      costPercentage: 0.2,
      typicalFee: '€200-€600 per unit',
      keyResponsibilities: ['Waste management', 'Recycling strategy', 'Compliance'],
      certifications: ['IWMA', 'EPA Registration'],
      insurance: 'Professional Indemnity €500k+'
    }
  },

  // Legal & Financial Team (4 specialists)
  LEGAL_FINANCIAL: {
    PROJECT_SOLICITOR: { 
      id: 'project_solicitor', 
      name: 'Project Solicitor', 
      icon: Scale, 
      category: 'Legal & Financial',
      description: 'Contracts, land assembly, legal compliance',
      costPercentage: 0.8,
      typicalFee: '€1,000-€3,000 per unit',
      keyResponsibilities: ['Contract preparation', 'Legal compliance', 'Land assembly'],
      certifications: ['Law Society of Ireland', 'Solicitor'],
      insurance: 'Professional Indemnity €2M+'
    },
    QUANTITY_SURVEYOR: { 
      id: 'quantity_surveyor', 
      name: 'Project Quantity Surveyor (EL Assessment)', 
      icon: Calculator, 
      category: 'Legal & Financial',
      description: 'Monthly valuation assessments, cost control, contract administration',
      costPercentage: 1.0,
      typicalFee: 'Included in project management (Brady Hughes oversight)',
      keyResponsibilities: [
        'Monthly contractor valuation assessments',
        'Review of Meegan Builders monthly claims',
        'Professional assessment vs contractor claims',
        'Retention and payment certification',
        'Materials on site verification',
        'Variations assessment and approval',
        'Cost control and budget monitoring',
        'Contract administration'
      ],
      certifications: ['RICS', 'SCSI'],
      insurance: 'Professional Indemnity €2M+',
      currentProject: 'Fitzgerald Gardens - Active monthly assessments',
      assessmentProcess: {
        frequency: 'Monthly',
        latestValuation: {
          number: 3,
          contractorClaim: 720750.98,
          professionalAssessment: 611885.86,
          variance: -108865.12,
          variancePercentage: -15.1,
          assessmentNotes: 'Professional assessment lower than contractor claim by 15.1%'
        },
        retentionManagement: {
          rate: 0.03,
          currentRetention: 18356.58,
          totalRetentionHeld: 'Calculated monthly'
        },
        materialsTracking: {
          currentOnSite: 107300.00,
          verificationRequired: true
        }
      }
    },
    FINANCIAL_ADVISOR: { 
      id: 'financial_advisor', 
      name: 'Financial Advisor', 
      icon: Euro, 
      category: 'Legal & Financial',
      description: 'Development appraisal, funding structures',
      costPercentage: 0.3,
      typicalFee: '€400-€1,200 per unit',
      keyResponsibilities: ['Development appraisal', 'Funding structures', 'Financial modeling'],
      certifications: ['CFA', 'ACCA', 'Banking qualifications'],
      insurance: 'Professional Indemnity €1M+'
    },
    TAX_ADVISOR: { 
      id: 'tax_advisor', 
      name: 'Tax Advisor', 
      icon: FileText, 
      category: 'Legal & Financial',
      description: 'VAT planning, capital allowances, reliefs',
      costPercentage: 0.2,
      typicalFee: '€200-€800 per unit',
      keyResponsibilities: ['VAT planning', 'Capital allowances', 'Tax reliefs'],
      certifications: ['ACCA', 'ACA', 'CTA'],
      insurance: 'Professional Indemnity €1M+'
    }
  },

  // Specialist Sub-Contractors (3 specialists)
  SPECIALIST_CONTRACTORS: {
    WINDOW_DOOR_SUPPLIER: { 
      id: 'window_door_supplier', 
      name: 'Munster Joinery', 
      icon: Home, 
      category: 'Specialist Contractors',
      description: 'uPVC windows and doors - Ultra-Tech series',
      costPercentage: 2.5,
      typicalFee: '€26,123.45 for Type D5 door + windows (Block 1)',
      keyResponsibilities: [
        'External door and frame sets supply and installation',
        'Double glazed low E argon filled units',
        'uPVC frames in Silver 7001 colour',
        'Multi-point locking systems',
        'U-value compliance (doors: 1.4W/m²K, windows: 1.2W/m²K)',
        'Solar factor 0.73 achievement',
        'Heavy duty ironmongery supply',
        'Installation and weatherproofing',
        'Performance testing and certification'
      ],
      certifications: ['CE Marking', 'NSAI Approval'],
      insurance: 'Product Liability €5M+',
      currentProject: 'Block 1 - Various door types D1, D3, D5 and window types W1-W12',
      productRange: {
        doors: 'Ultra-Tech series with level access',
        windows: 'uPVC Silver 7001 with side hung opening',
        glazing: 'Double glazed low E argon filled',
        hardware: 'Heavy duty matching ironmongery'
      }
    },
    KITCHEN_SPECIALIST: { 
      id: 'kitchen_specialist', 
      name: 'Kitchen Solutions Ltd', 
      icon: CreditCard, 
      category: 'Specialist Contractors',
      description: 'Domestic kitchen fittings and appliances',
      costPercentage: 1.5,
      typicalFee: '€19,580 for 4 complete kitchens (Block 1)',
      keyResponsibilities: [
        'L-shaped kitchen design and installation',
        'Melamine worktops with 150mm up stands',
        'Integrated extractor hoods (Turboair Continental)',
        'Under cabinet LED lighting (Robus triangular)',
        'High density particle board carcases (EN 13986)',
        'Blum Soft Close drawer systems',
        'Sapphire Sinks 1.5 bowl stainless steel',
        'Carron Phoenix Opus chrome mixer taps',
        '5 year guarantee on all products'
      ],
      certifications: ['Kitchen Specialists Association', 'Blum Certified'],
      insurance: 'Product Liability €2M+',
      currentProject: 'Block 1 - 4 unique kitchen configurations per house type',
      kitchenBreakdown: {
        house1: '3750mm + 2400mm L-shaped - €5,225',
        house2: '3445mm + 1200mm L-shaped - €4,675', 
        house3: '3445mm + 1200mm L-shaped - €4,675',
        house4: '3600mm + 1800mm L-shaped - €5,005'
      }
    },
    SANITARY_SPECIALIST: { 
      id: 'sanitary_specialist', 
      name: 'Bathroom Solutions Ireland', 
      icon: Home, 
      category: 'Specialist Contractors',
      description: 'Sanitary fittings and bathroom installations',
      costPercentage: 1.0,
      typicalFee: '€12,474 for all bathroom fittings (Block 1)',
      keyResponsibilities: [
        'Strata wash basins with pedestal options',
        'Verona fully shrouded water closets',
        'Kristal low profile shower trays with doors',
        'Lotus single end baths with screens',
        'Coolflow thermostatic shower systems',
        'Chrome mixer taps and fittings',
        'Silver back mirror installation',
        'Silicone sealing (BS5889 Type B with fungicide)',
        'Compliance with sanitary ware schedule'
      ],
      certifications: ['Plumbing Contractors Association', 'Water Industry'],
      insurance: 'Public Liability €3M+',
      currentProject: 'Block 1 - 13 WCs, multiple shower configurations, 4 baths',
      fittingBreakdown: {
        washBasins: '13 units - various Strata models',
        showers: '5 units - different tray sizes (800x800 to 1300x800)',
        baths: '4 units - 1700x700mm with thermostatic systems',
        accessories: 'Mirrors, waste systems, bottle traps'
      }
    }
  },

  // Sales & Marketing Team (3 specialists)
  SALES_MARKETING: {
    SALES_DIRECTOR: { 
      id: 'sales_director', 
      name: 'Sales Director', 
      icon: TrendingUp, 
      category: 'Sales & Marketing',
      description: 'Sales strategy, pricing, customer journey',
      costPercentage: 0.8,
      typicalFee: '€1,000-€3,000 per unit',
      keyResponsibilities: ['Sales strategy', 'Pricing strategy', 'Customer journey'],
      certifications: ['Property qualifications', 'Sales management'],
      insurance: 'Professional Indemnity €1M+'
    },
    MARKETING_MANAGER: { 
      id: 'marketing_manager', 
      name: 'Marketing Manager', 
      icon: Globe, 
      category: 'Sales & Marketing',
      description: 'Digital marketing, content, lead generation',
      costPercentage: 0.5,
      typicalFee: '€600-€2,000 per unit',
      keyResponsibilities: ['Digital marketing', 'Content strategy', 'Lead generation'],
      certifications: ['Digital marketing', 'CIM', 'Google Ads'],
      insurance: 'Professional Indemnity €500k+'
    },
    CUSTOMER_EXPERIENCE_MANAGER: { 
      id: 'customer_experience_manager', 
      name: 'Customer Experience Manager', 
      icon: UserCheck, 
      category: 'Sales & Marketing',
      description: 'Buyer journey, after-sales service',
      costPercentage: 0.3,
      typicalFee: '€400-€1,200 per unit',
      keyResponsibilities: ['Customer journey', 'After-sales service', 'Quality management'],
      certifications: ['Customer service', 'Quality management'],
      insurance: 'Professional Indemnity €500k+'
    }
  }
};

// Flatten all professional types for easy access
export const ALL_PROFESSIONAL_TYPES = Object.values(PROFESSIONAL_TYPES).reduce(
  (acc, category) => ({ ...acc, ...category }), 
  {}
);

interface TeamMember {
  id: string;
  name: string;
  role: keyof typeof ALL_PROFESSIONAL_TYPES;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending' | 'contract_negotiation';
  projects: string[];
  startDate: Date;
  contractValue: number;
  paymentSchedule: 'monthly' | 'milestone' | 'completion' | 'hourly';
  performance: {
    rating: number;
    completionRate: number;
    responseTime: number; // hours
    qualityScore: number;
  };
  certifications: {
    name: string;
    expiryDate: Date;
    verified: boolean;
  }[];
  insurance: {
    type: string;
    amount: number;
    expiryDate: Date;
    verified: boolean;
  }[];
  lastActivity: Date;
  upcomingDeadlines: {
    task: string;
    date: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

interface ComprehensiveTeamManagementProps {
  projectId?: string;
  mode?: 'overview' | 'project_specific';
}

export default function ComprehensiveTeamManagement({ 
  projectId, 
  mode = 'overview' 
}: ComprehensiveTeamManagementProps) {
  const [activeView, setActiveView] = useState<'overview' | 'specialists' | 'projects' | 'procurement' | 'financial' | 'collaboration' | 'analytics'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    return Object.entries(PROFESSIONAL_TYPES).map(([key, category]) => {
      const specialists = Object.values(category);
      const totalCostPercentage = specialists.reduce((sum, spec) => sum + spec.costPercentage, 0);
      const averageFee = specialists.reduce((sum, spec) => {
        const feeRange = spec.typicalFee.match(/€([\d,]+).*€([\d,]+)/);
        if (feeRange) {
          const min = parseInt(feeRange[1].replace(',', ''));
          const max = parseInt(feeRange[2].replace(',', ''));
          return sum + (min + max) / 2;
        }
        return sum;
      }, 0) / specialists.length;

      return {
        key,
        name: specialists[0].category,
        count: specialists.length,
        totalCostPercentage,
        averageFee,
        specialists: specialists.length
      };
    });
  }, []);

  const overviewMetrics = {
    totalSpecialistTypes: Object.keys(ALL_PROFESSIONAL_TYPES).length,
    totalCategories: Object.keys(PROFESSIONAL_TYPES).length,
    totalCostPercentage: Object.values(ALL_PROFESSIONAL_TYPES).reduce((sum, spec) => sum + spec.costPercentage, 0),
    activeProjects: projectId ? 1 : 4,
    teamMembers: 89, // Example active team members
    contractors: 23 // Example active contractors
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enterprise Team Management</h1>
            <p className="text-blue-100 text-lg">
              Comprehensive management of {overviewMetrics.totalSpecialistTypes} specialist types across {overviewMetrics.totalCategories} categories
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <Users className="mr-2" size={20} />
                <span className="font-medium">{overviewMetrics.teamMembers} Active Team Members</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2" size={20} />
                <span className="font-medium">{overviewMetrics.contractors} Contractors</span>
              </div>
              <div className="flex items-center">
                <Building className="mr-2" size={20} />
                <span className="font-medium">{overviewMetrics.activeProjects} Active Projects</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{overviewMetrics.totalCostPercentage.toFixed(1)}%</div>
            <div className="text-blue-200">Total Professional Costs</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Team Overview', icon: Users },
            { id: 'specialists', label: 'Professional Specialists', icon: UserCheck },
            { id: 'projects', label: 'Project Allocation', icon: Building },
            { id: 'procurement', label: 'Procurement & Tendering', icon: FileText },
            { id: 'financial', label: 'Financial Control', icon: CreditCard },
            { id: 'collaboration', label: 'Team Collaboration', icon: MessageSquare },
            { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Dashboard */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Category Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryStats.map((category) => (
              <div key={category.key} className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {category.specialists} specialists
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost Percentage:</span>
                    <span className="font-medium">{category.totalCostPercentage.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Fee/Unit:</span>
                    <span className="font-medium">€{Math.round(category.averageFee).toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-3 border-t space-y-2">
                    <button 
                      onClick={() => {
                        setSelectedCategory(category.key);
                        setActiveView('specialists');
                      }}
                      className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      View Specialists <ChevronRight size={14} />
                    </button>
                    {category.key === 'DESIGN' && (
                      <button 
                        onClick={() => window.open('/architect/coordination', '_blank')}
                        className="w-full text-gray-600 hover:text-gray-700 text-xs flex items-center justify-center gap-1 mt-1"
                      >
                        <Globe size={12} />
                        Architect Dashboard
                      </button>
                    )}
                    {category.key === 'ENGINEERING' && (
                      <button 
                        onClick={() => window.open('/engineer/coordination', '_blank')}
                        className="w-full text-gray-600 hover:text-gray-700 text-xs flex items-center justify-center gap-1 mt-1"
                      >
                        <Globe size={12} />
                        Engineer Dashboard
                      </button>
                    )}
                    {category.key === 'LEGAL_FINANCIAL' && (
                      <button 
                        onClick={() => window.open('/quantity-surveyor/cost-management', '_blank')}
                        className="w-full text-gray-600 hover:text-gray-700 text-xs flex items-center justify-center gap-1 mt-1"
                      >
                        <Globe size={12} />
                        QS Dashboard
                      </button>
                    )}
                    {category.key === 'CONSTRUCTION' && (
                      <button 
                        onClick={() => window.open('/project-manager/coordination', '_blank')}
                        className="w-full text-gray-600 hover:text-gray-700 text-xs flex items-center justify-center gap-1 mt-1"
                      >
                        <Globe size={12} />
                        PM Dashboard
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <UserPlus className="text-blue-600" size={20} />
                <div className="text-left">
                  <div className="font-medium">Add Team Member</div>
                  <div className="text-sm text-gray-600">Invite new specialist</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <FileText className="text-green-600" size={20} />
                <div className="text-left">
                  <div className="font-medium">Start Tender</div>
                  <div className="text-sm text-gray-600">Begin procurement process</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Calendar className="text-purple-600" size={20} />
                <div className="text-left">
                  <div className="font-medium">Schedule Meeting</div>
                  <div className="text-sm text-gray-600">Team coordination</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
                <BarChart3 className="text-orange-600" size={20} />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-gray-600">Performance insights</div>
                </div>
              </button>
            </div>
          </div>

          {/* Professional Dashboard Navigation */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Dashboards</h2>
            <p className="text-gray-600 mb-4">Access specialized dashboards for each professional category</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => window.open('/architect/coordination', '_blank')}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <Building className="text-blue-600 group-hover:text-blue-700" size={20} />
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-blue-700">Architect Dashboard</div>
                  <div className="text-sm text-gray-600">Design coordination</div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-blue-600 ml-auto" size={16} />
              </button>
              
              <button 
                onClick={() => window.open('/engineer/coordination', '_blank')}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
              >
                <Wrench className="text-green-600 group-hover:text-green-700" size={20} />
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-green-700">Engineer Dashboard</div>
                  <div className="text-sm text-gray-600">Engineering coordination</div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-green-600 ml-auto" size={16} />
              </button>
              
              <button 
                onClick={() => window.open('/quantity-surveyor/cost-management', '_blank')}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
              >
                <Calculator className="text-purple-600 group-hover:text-purple-700" size={20} />
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-purple-700">QS Dashboard</div>
                  <div className="text-sm text-gray-600">Cost management</div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-purple-600 ml-auto" size={16} />
              </button>
              
              <button 
                onClick={() => window.open('/project-manager/coordination', '_blank')}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group"
              >
                <Target className="text-orange-600 group-hover:text-orange-700" size={20} />
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-orange-700">PM Dashboard</div>
                  <div className="text-sm text-gray-600">Project coordination</div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-orange-600 ml-auto" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Specialists View */}
      {activeView === 'specialists' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Professional Specialists Directory</h2>
            <button 
              onClick={() => setShowAddTeamMember(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Specialist
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {Object.entries(PROFESSIONAL_TYPES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {Object.values(category)[0].category}
              </button>
            ))}
          </div>

          {/* Specialists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(ALL_PROFESSIONAL_TYPES)
              .filter(specialist => 
                selectedCategory === 'all' || 
                Object.values(PROFESSIONAL_TYPES[selectedCategory as keyof typeof PROFESSIONAL_TYPES] || {})
                  .some(s => s.id === specialist.id)
              )
              .map((specialist) => (
                <div key={specialist.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <specialist.icon className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{specialist.name}</h3>
                        <p className="text-sm text-gray-600">{specialist.category}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {specialist.costPercentage}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{specialist.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Typical Fee:</span>
                      <span className="font-medium">{specialist.typicalFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance Req:</span>
                      <span className="font-medium">{specialist.insurance}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(specialist.dashboardUrl, '_blank')}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                      >
                        <Globe size={14} />
                        Professional Dashboard
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Project Allocation System */}
      {activeView === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Multi-Project Team Allocation</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export Schedule
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} />
                Allocate Resources
              </button>
            </div>
          </div>

          {/* Active Projects Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Fitzgerald Gardens',
                stage: 'Construction',
                completion: 78,
                teamSize: 18,
                budget: 2800000,
                nextMilestone: 'Foundation Completion',
                dueDate: '2025-07-15',
                status: 'on-track'
              },
              {
                name: 'Ellwood Development',
                stage: 'Planning',
                completion: 25,
                teamSize: 12,
                budget: 3200000,
                nextMilestone: 'Planning Permission',
                dueDate: '2025-08-30',
                status: 'at-risk'
              },
              {
                name: 'Ballymakenny View',
                stage: 'Pre-Sales',
                completion: 45,
                teamSize: 8,
                budget: 1900000,
                nextMilestone: 'Sales Launch',
                dueDate: '2025-09-15',
                status: 'ahead'
              }
            ].map((project) => (
              <div key={project.name} className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'on-track' ? 'bg-green-100 text-green-800' :
                    project.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stage:</span>
                    <span className="font-medium">{project.stage}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Size:</span>
                    <span className="font-medium">{project.teamSize} members</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget:</span>
                    <span className="font-medium">€{project.budget.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="font-medium">{project.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'on-track' ? 'bg-green-500' :
                          project.status === 'at-risk' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-1">Next Milestone:</div>
                    <div className="font-medium text-gray-900">{project.nextMilestone}</div>
                    <div className="text-sm text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  Manage Team
                </button>
              </div>
            ))}
          </div>

          {/* Resource Allocation Matrix */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Project Resource Allocation</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Specialist Type</th>
                    <th className="text-center py-2 font-medium">Fitzgerald Gardens</th>
                    <th className="text-center py-2 font-medium">Ellwood Development</th>
                    <th className="text-center py-2 font-medium">Ballymakenny View</th>
                    <th className="text-center py-2 font-medium">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { type: 'Lead Architect', fg: 'John Smith', ell: 'Available', ball: 'Sarah Kelly', avail: 'High' },
                    { type: 'Structural Engineer', fg: 'Mike O\'Brien', ell: 'Mike O\'Brien', ball: 'Available', avail: 'Medium' },
                    { type: 'Quantity Surveyor', fg: 'Lisa Chen', ell: 'Required', ball: 'Lisa Chen', avail: 'Low' },
                    { type: 'PSCS', fg: 'Tom Wilson', ell: 'Not Required', ball: 'Available', avail: 'High' },
                    { type: 'Solicitor', fg: 'David Murphy', ell: 'David Murphy', ball: 'David Murphy', avail: 'Medium' }
                  ].map((resource, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{resource.type}</td>
                      <td className="py-3 text-center text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.fg === 'Available' ? 'bg-green-100 text-green-800' :
                          resource.fg === 'Required' ? 'bg-red-100 text-red-800' :
                          resource.fg === 'Not Required' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {resource.fg}
                        </span>
                      </td>
                      <td className="py-3 text-center text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.ell === 'Available' ? 'bg-green-100 text-green-800' :
                          resource.ell === 'Required' ? 'bg-red-100 text-red-800' :
                          resource.ell === 'Not Required' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {resource.ell}
                        </span>
                      </td>
                      <td className="py-3 text-center text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.ball === 'Available' ? 'bg-green-100 text-green-800' :
                          resource.ball === 'Required' ? 'bg-red-100 text-red-800' :
                          resource.ball === 'Not Required' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {resource.ball}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resource.avail === 'High' ? 'bg-green-100 text-green-800' :
                          resource.avail === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resource.avail}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Procurement & Tendering System */}
      {activeView === 'procurement' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Procurement & Tendering</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export RFPs
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Zap size={16} />
                Generate RFP with AI
              </button>
            </div>
          </div>

          {/* Procurement Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={20} className="text-blue-600" />
                <span className="font-medium text-blue-800">Active RFPs</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">8 awaiting responses</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-green-600" />
                <span className="font-medium text-green-800">Qualified Vendors</span>
              </div>
              <p className="text-2xl font-bold text-green-600">247</p>
              <p className="text-sm text-gray-600">89% response rate</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Euro size={20} className="text-purple-600" />
                <span className="font-medium text-purple-800">Cost Savings</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">€184k</p>
              <p className="text-sm text-gray-600">12.3% below budget</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-orange-600" />
                <span className="font-medium text-orange-800">Avg Response</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">4.2d</p>
              <p className="text-sm text-gray-600">23% faster than industry</p>
            </div>
          </div>

          {/* AI Scope Generation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Lightbulb className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">AI-Generated Scope of Works</h3>
                <p className="text-blue-700 mb-4">
                  Our AI analyzes project requirements, building regulations, and industry standards to generate comprehensive 
                  scope of works documents and RFP specifications tailored to Irish residential development.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Building Regulations Analysis</h4>
                    <p className="text-sm text-gray-600">Automatic compliance checking against Part A-M requirements</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">NZEB Requirements</h4>
                    <p className="text-sm text-gray-600">Integrated NZEB specification and renewable energy systems</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Cost Estimation</h4>
                    <p className="text-sm text-gray-600">Real-time market pricing with €/m² benchmarking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Procurement Processes */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Procurement Processes</h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Main Contractor - Fitzgerald Gardens Phase 2',
                  specialist: 'Construction Manager',
                  stage: 'Tender Evaluation',
                  responses: 8,
                  budget: 2800000,
                  deadline: '2025-07-20',
                  aiScore: 94,
                  status: 'evaluation'
                },
                {
                  title: 'Structural Engineering - Ellwood Development',
                  specialist: 'Structural Engineer',
                  stage: 'RFP Issued',
                  responses: 12,
                  budget: 180000,
                  deadline: '2025-07-15',
                  aiScore: 88,
                  status: 'active'
                },
                {
                  title: 'Landscape Architecture - Ballymakenny View',
                  specialist: 'Landscape Architect',
                  stage: 'Scope Generation',
                  responses: 0,
                  budget: 95000,
                  deadline: '2025-08-01',
                  aiScore: 96,
                  status: 'drafting'
                },
                {
                  title: 'Quantity Surveying - Multi-Project',
                  specialist: 'Quantity Surveyor',
                  stage: 'Contract Finalization',
                  responses: 5,
                  budget: 220000,
                  deadline: '2025-07-10',
                  aiScore: 91,
                  status: 'finalizing'
                }
              ].map((process, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{process.title}</h4>
                      <p className="text-sm text-gray-600">{process.specialist}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        process.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        process.status === 'evaluation' ? 'bg-yellow-100 text-yellow-800' :
                        process.status === 'drafting' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {process.stage}
                      </span>
                      <div className="mt-1 text-sm text-gray-600">
                        AI Score: {process.aiScore}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <div className="font-medium">€{process.budget.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Responses:</span>
                      <div className="font-medium">{process.responses} received</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Deadline:</span>
                      <div className="font-medium">{new Date(process.deadline).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Days Remaining:</span>
                      <div className="font-medium text-orange-600">
                        {Math.ceil((new Date(process.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                      Compare Bids
                    </button>
                    {process.status === 'drafting' && (
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                        Generate RFP
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Performance Analytics */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Performance Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Performing Contractors</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Murphy Construction Ltd', score: 96, projects: 8, onTime: 98, quality: 94 },
                    { name: 'O\'Brien Engineering', score: 94, projects: 12, onTime: 96, quality: 92 },
                    { name: 'Kelly Architecture', score: 93, projects: 6, projects: 15, onTime: 95, quality: 91 },
                    { name: 'Dublin Structural', score: 91, projects: 10, onTime: 94, quality: 88 }
                  ].map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-600">{vendor.projects} completed projects</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{vendor.score}%</div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Procurement Insights</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-900">Cost Optimization</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      AI recommends bundling M&E services for 8% cost reduction across projects
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-medium text-green-900">Quality Assurance</span>
                    </div>
                    <p className="text-sm text-green-700">
                      98% contractor satisfaction rate with current vetting process
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={16} className="text-yellow-600" />
                      <span className="font-medium text-yellow-900">Timeline Optimization</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Parallel tendering could reduce procurement cycle by 18 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Financial Control System */}
      {activeView === 'financial' && (
        <EnterpriseFinancialControlSystem 
          mode={mode}
          projectId={projectId}
        />
      )}

      {/* Enterprise Collaboration Hub */}
      {activeView === 'collaboration' && (
        <EnterpriseCollaborationHub 
          mode={mode}
          projectId={projectId}
        />
      )}

      {/* Advanced Performance Analytics */}
      {activeView === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Advanced Performance Analytics</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Settings size={16} />
                Configure KPIs
              </button>
            </div>
          </div>

          {/* Performance Overview Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <Target size={20} />
                <span className="font-medium">Overall Efficiency</span>
              </div>
              <p className="text-2xl font-bold">94.2%</p>
              <p className="text-sm opacity-90">+2.3% vs last quarter</p>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} />
                <span className="font-medium">On-Time Delivery</span>
              </div>
              <p className="text-2xl font-bold">87.8%</p>
              <p className="text-sm opacity-90">Industry avg: 72%</p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <Euro size={20} />
                <span className="font-medium">Cost Control</span>
              </div>
              <p className="text-2xl font-bold">96.1%</p>
              <p className="text-sm opacity-90">Within budget rate</p>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <Star size={20} />
                <span className="font-medium">Quality Score</span>
              </div>
              <p className="text-2xl font-bold">4.6/5</p>
              <p className="text-sm opacity-90">Client satisfaction</p>
            </div>
          </div>

          {/* Team Performance Matrix */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Specialist Category</th>
                    <th className="text-center py-2 font-medium">Team Members</th>
                    <th className="text-center py-2 font-medium">Efficiency</th>
                    <th className="text-center py-2 font-medium">Quality</th>
                    <th className="text-center py-2 font-medium">On-Time Rate</th>
                    <th className="text-center py-2 font-medium">Cost Performance</th>
                    <th className="text-center py-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { category: 'Design & Planning', members: 8, efficiency: 96, quality: 4.8, onTime: 94, cost: 98, trend: 'up' },
                    { category: 'Engineering', members: 6, efficiency: 93, quality: 4.6, onTime: 91, cost: 95, trend: 'up' },
                    { category: 'Construction & Safety', members: 5, efficiency: 91, quality: 4.4, onTime: 88, cost: 93, trend: 'stable' },
                    { category: 'Technical & Environmental', members: 6, efficiency: 89, quality: 4.5, onTime: 85, cost: 97, trend: 'down' },
                    { category: 'Legal & Financial', members: 4, efficiency: 97, quality: 4.9, onTime: 96, cost: 99, trend: 'up' },
                    { category: 'Sales & Marketing', members: 3, efficiency: 92, quality: 4.3, onTime: 89, cost: 94, trend: 'up' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{row.category}</td>
                      <td className="py-3 text-center">{row.members}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.efficiency >= 95 ? 'bg-green-100 text-green-800' :
                          row.efficiency >= 90 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {row.efficiency}%
                        </span>
                      </td>
                      <td className="py-3 text-center font-medium">{row.quality}/5</td>
                      <td className="py-3 text-center font-medium">{row.onTime}%</td>
                      <td className="py-3 text-center font-medium">{row.cost}%</td>
                      <td className="py-3 text-center">
                        {row.trend === 'up' && <TrendingUp size={16} className="text-green-600 mx-auto" />}
                        {row.trend === 'down' && <Activity size={16} className="text-red-600 mx-auto rotate-180" />}
                        {row.trend === 'stable' && <Activity size={16} className="text-gray-600 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Timeline Analysis */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline Analysis</h3>
              <div className="space-y-4">
                {[
                  {
                    project: 'Fitzgerald Gardens',
                    planned: 18,
                    actual: 16,
                    efficiency: 112,
                    status: 'ahead'
                  },
                  {
                    project: 'Ellwood Development',
                    planned: 24,
                    actual: 25,
                    efficiency: 96,
                    status: 'slight-delay'
                  },
                  {
                    project: 'Ballymakenny View',
                    planned: 15,
                    actual: 14,
                    efficiency: 107,
                    status: 'ahead'
                  }
                ].map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.project}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'ahead' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.efficiency}% efficiency
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Planned:</span>
                        <div className="font-medium">{project.planned} months</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <div className="font-medium">{project.actual} months</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Variance:</span>
                        <div className={`font-medium ${
                          project.actual < project.planned ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {project.actual < project.planned ? '-' : '+'}{Math.abs(project.actual - project.planned)} months
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Performance Index */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Performance Index</h3>
              <div className="space-y-4">
                {[
                  { category: 'Professional Fees', budget: 580000, actual: 562000, variance: -3.1 },
                  { category: 'Construction Costs', budget: 2800000, actual: 2756000, variance: -1.6 },
                  { category: 'Legal & Compliance', budget: 95000, actual: 98500, variance: 3.7 },
                  { category: 'Marketing & Sales', budget: 140000, actual: 133000, variance: -5.0 }
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.category}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.variance < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.variance > 0 ? '+' : ''}{item.variance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <div className="font-medium">€{item.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <div className="font-medium">€{item.actual.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Collaboration Insights */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Collaboration Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Communication Efficiency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time:</span>
                    <span className="font-medium">2.4h avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Meeting Efficiency:</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Issue Resolution:</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Resource Utilization</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Capacity:</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cross-Project Work:</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overtime Rate:</span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quality Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rework Rate:</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Satisfaction:</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Compliance Score:</span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Analytics & Recommendations */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">AI-Powered Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Resource Optimization</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      AI suggests reallocating 2 engineers from Ellwood to Fitzgerald Gardens for 15% efficiency gain
                    </p>
                    <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">
                      Apply Suggestion
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Timeline Prediction</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Current trajectory indicates Ballymakenny View completion 2 weeks ahead of schedule
                    </p>
                    <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                      View Details
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Cost Forecast</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Predicted 3.2% cost savings opportunity through optimized procurement scheduling
                    </p>
                    <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700">
                      Schedule Review
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Risk Assessment</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Low risk profile across all projects with 96% probability of on-time delivery
                    </p>
                    <button className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700">
                      Risk Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}