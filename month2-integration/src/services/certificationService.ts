import { PrismaClient, UserRole } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

/**
 * Irish Professional Certifications Registry
 * Comprehensive system for managing Irish property industry certifications
 */

// Irish Professional Certifications
export const IRISH_CERTIFICATIONS = {
  // Energy & Sustainability Certifications
  BER_ASSESSOR: {
    name: 'BER Assessor',
    issuingBody: 'SEAI',
    fullName: 'Building Energy Rating Assessor',
    validityPeriod: 5, // years
    renewalRequired: true,
    applicableRoles: [UserRole.BER_ASSESSOR],
    scope: ['Residential', 'Commercial', 'Public Buildings'],
    description: 'Qualified to carry out Building Energy Rating assessments',
  },
  
  NZEB_CONSULTANT: {
    name: 'NZEB Consultant',
    issuingBody: 'SEAI',
    fullName: 'Nearly Zero Energy Building Consultant',
    validityPeriod: 5,
    renewalRequired: true,
    applicableRoles: [UserRole.NZEB_CONSULTANT, UserRole.SUSTAINABILITY_CONSULTANT],
    scope: ['NZEB Design', 'NZEB Verification', 'Energy Performance'],
    description: 'Qualified to design and verify Nearly Zero Energy Buildings',
  },

  // Building Control & Compliance
  BCAR_CERTIFIER: {
    name: 'BCAR Certifier',
    issuingBody: 'BCAR',
    fullName: 'Building Control Amendment Regulations Certifier',
    validityPeriod: null, // No expiry
    renewalRequired: false,
    applicableRoles: [UserRole.BCAR_CERTIFIER],
    scope: ['Structural Certification', 'Fire Safety Certification', 'Disability Access Certification'],
    description: 'Qualified to provide statutory certification under BCAR',
  },

  FIRE_SAFETY_CERT: {
    name: 'Fire Safety Certificate',
    issuingBody: 'BCAR',
    fullName: 'Fire Safety Certificate Design',
    validityPeriod: null,
    renewalRequired: false,
    applicableRoles: [UserRole.FIRE_SAFETY_CONSULTANT, UserRole.BCAR_CERTIFIER],
    scope: ['Fire Safety Design', 'Means of Escape', 'Fire Protection Systems'],
    description: 'Qualified to design fire safety systems and means of escape',
  },

  DISABILITY_ACCESS_CERT: {
    name: 'Disability Access Certificate',
    issuingBody: 'BCAR',
    fullName: 'Disability Access Certificate Design',
    validityPeriod: null,
    renewalRequired: false,
    applicableRoles: [UserRole.ACCESSIBILITY_CONSULTANT, UserRole.BCAR_CERTIFIER],
    scope: ['Universal Design', 'Accessibility Compliance', 'Part M Compliance'],
    description: 'Qualified to design accessible buildings and compliance with Part M',
  },

  // Professional Body Memberships
  RIAI_MEMBERSHIP: {
    name: 'RIAI Membership',
    issuingBody: 'RIAI',
    fullName: 'Royal Institute of Architects of Ireland',
    validityPeriod: 1, // Annual renewal
    renewalRequired: true,
    applicableRoles: [UserRole.ARCHITECT, UserRole.LEAD_ARCHITECT, UserRole.DESIGN_ARCHITECT, UserRole.TECHNICAL_ARCHITECT],
    scope: ['Architectural Practice', 'Building Design', 'Project Management'],
    description: 'Professional membership of the Royal Institute of Architects of Ireland',
  },

  ENGINEERS_IRELAND: {
    name: 'Engineers Ireland',
    issuingBody: 'Engineers Ireland',
    fullName: 'Engineers Ireland Professional Membership',
    validityPeriod: 1,
    renewalRequired: true,
    applicableRoles: [UserRole.ENGINEER, UserRole.STRUCTURAL_ENGINEER, UserRole.CIVIL_ENGINEER, UserRole.MEP_ENGINEER, UserRole.ENVIRONMENTAL_ENGINEER],
    scope: ['Engineering Practice', 'Structural Design', 'Civil Engineering', 'MEP Design'],
    description: 'Professional membership of Engineers Ireland',
  },

  LAW_SOCIETY_MEMBERSHIP: {
    name: 'Law Society Membership',
    issuingBody: 'Law Society of Ireland',
    fullName: 'Law Society of Ireland Solicitor',
    validityPeriod: 1,
    renewalRequired: true,
    applicableRoles: [UserRole.SOLICITOR, UserRole.BUYER_SOLICITOR, UserRole.DEVELOPER_SOLICITOR],
    scope: ['Legal Practice', 'Conveyancing', 'Property Law'],
    description: 'Qualified solicitor with Law Society of Ireland',
  },

  // Surveying Qualifications
  SCSI_MEMBERSHIP: {
    name: 'SCSI Membership',
    issuingBody: 'SCSI',
    fullName: 'Society of Chartered Surveyors Ireland',
    validityPeriod: 1,
    renewalRequired: true,
    applicableRoles: [UserRole.QUANTITY_SURVEYOR, UserRole.BUILDING_SURVEYOR, UserRole.PROPERTY_VALUER],
    scope: ['Quantity Surveying', 'Building Surveying', 'Property Valuation'],
    description: 'Professional membership of the Society of Chartered Surveyors Ireland',
  },

  // Warranty & Insurance
  HOMEBOND_ADMIN: {
    name: 'HomeBond Administrator',
    issuingBody: 'HomeBond',
    fullName: 'HomeBond Warranty Scheme Administrator',
    validityPeriod: 2,
    renewalRequired: true,
    applicableRoles: [UserRole.HOMEBOND_ADMINISTRATOR],
    scope: ['Warranty Administration', 'New Home Inspections', 'Defect Resolution'],
    description: 'Qualified to administer HomeBond warranty scheme',
  },

  // Planning & Development
  PLANNING_CERT: {
    name: 'Planning Consultant',
    issuingBody: 'Irish Planning Institute',
    fullName: 'Irish Planning Institute Membership',
    validityPeriod: 1,
    renewalRequired: true,
    applicableRoles: [UserRole.PLANNING_CONSULTANT],
    scope: ['Planning Applications', 'Development Control', 'Environmental Impact'],
    description: 'Qualified planning consultant with Irish Planning Institute',
  },

  // Estate Agency
  ESTATE_AGENT_LICENSE: {
    name: 'Estate Agent License',
    issuingBody: 'Property Services Regulatory Authority',
    fullName: 'Property Services Regulatory Authority License',
    validityPeriod: 3,
    renewalRequired: true,
    applicableRoles: [UserRole.ESTATE_AGENT, UserRole.ESTATE_AGENT_MANAGER],
    scope: ['Estate Agency', 'Property Sales', 'Property Management'],
    description: 'Licensed estate agent with PSRA',
  },
} as const;

export type CertificationType = keyof typeof IRISH_CERTIFICATIONS;

// Certification validation schema
export const CertificationValidationSchema = z.object({
  certificationType: z.string(),
  certificationNumber: z.string().optional(),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  scope: z.array(z.string()).optional(),
  verificationDocument: z.string().optional(),
});

/**
 * Irish Certification Service
 * Manages professional certifications specific to the Irish property industry
 */
export class IrishCertificationService {
  
  /**
   * Get all available certifications for a professional role
   */
  getAvailableCertifications(role: UserRole): Array<{
    type: string;
    details: typeof IRISH_CERTIFICATIONS[CertificationType];
  }> {
    return Object.entries(IRISH_CERTIFICATIONS)
      .filter(([_, cert]) => cert.applicableRoles.includes(role))
      .map(([type, details]) => ({ type, details }));
  }

  /**
   * Validate if a certification is required for a role
   */
  isCertificationRequired(role: UserRole, certificationType: string): boolean {
    const cert = IRISH_CERTIFICATIONS[certificationType as CertificationType];
    return cert?.applicableRoles.includes(role) || false;
  }

  /**
   * Check if certification is expired
   */
  isCertificationExpired(issueDate: Date, certificationType: string): boolean {
    const cert = IRISH_CERTIFICATIONS[certificationType as CertificationType];
    if (!cert.renewalRequired || !cert.validityPeriod) {
      return false; // No expiry
    }

    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + cert.validityPeriod);
    
    return new Date() > expiryDate;
  }

  /**
   * Get certification expiry date
   */
  getCertificationExpiryDate(issueDate: Date, certificationType: string): Date | null {
    const cert = IRISH_CERTIFICATIONS[certificationType as CertificationType];
    if (!cert.renewalRequired || !cert.validityPeriod) {
      return null; // No expiry
    }

    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + cert.validityPeriod);
    
    return expiryDate;
  }

  /**
   * Verify professional qualifications for specific Irish requirements
   */
  async verifyIrishProfessionalQualifications(
    userId: string,
    requiredCertifications: CertificationType[]
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalCertifications: {
          where: { isActive: true }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const verificationResults = {
      userId,
      userRole: user.role,
      qualifications: [] as any[],
      overall: true,
      issues: [] as string[]
    };

    for (const requiredCert of requiredCertifications) {
      const certDetails = IRISH_CERTIFICATIONS[requiredCert];
      const userCert = user.professionalCertifications.find(
        cert => cert.certificationName === certDetails.name
      );

      const qualification = {
        type: requiredCert,
        required: true,
        held: !!userCert,
        valid: false,
        expired: false,
        details: certDetails
      };

      if (userCert) {
        const isExpired = this.isCertificationExpired(userCert.issueDate, requiredCert);
        qualification.valid = !isExpired;
        qualification.expired = isExpired;
        
        if (isExpired) {
          verificationResults.issues.push(
            `${certDetails.name} certification expired on ${userCert.expiryDate}`
          );
          verificationResults.overall = false;
        }
      } else {
        verificationResults.issues.push(
          `Missing required certification: ${certDetails.name}`
        );
        verificationResults.overall = false;
      }

      verificationResults.qualifications.push(qualification);
    }

    return verificationResults;
  }

  /**
   * Get renewal requirements for user's certifications
   */
  async getCertificationRenewalRequirements(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalCertifications: {
          where: { isActive: true }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const renewalRequirements = [];
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    for (const cert of user.professionalCertifications) {
      const certType = Object.entries(IRISH_CERTIFICATIONS).find(
        ([_, details]) => details.name === cert.certificationName
      )?.[0] as CertificationType;

      if (certType) {
        const certDetails = IRISH_CERTIFICATIONS[certType];
        const expiryDate = this.getCertificationExpiryDate(cert.issueDate, certType);

        if (expiryDate && certDetails.renewalRequired) {
          const isExpired = today > expiryDate;
          const isExpiringSoon = expiryDate <= threeMonthsFromNow;

          if (isExpired || isExpiringSoon) {
            renewalRequirements.push({
              certification: cert,
              details: certDetails,
              expiryDate,
              status: isExpired ? 'expired' : 'expiring_soon',
              daysUntilExpiry: Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            });
          }
        }
      }
    }

    return renewalRequirements;
  }

  /**
   * Get recommended certifications for a professional role
   */
  getRecommendedCertifications(role: UserRole) {
    const availableCerts = this.getAvailableCertifications(role);
    
    // Define essential vs optional certifications based on role
    const essential = [];
    const recommended = [];
    const optional = [];

    for (const { type, details } of availableCerts) {
      // Essential certifications (legally required)
      if (type === 'BER_ASSESSOR' && role === UserRole.BER_ASSESSOR) {
        essential.push({ type, details, reason: 'Legally required to perform BER assessments' });
      } else if (type === 'BCAR_CERTIFIER' && role === UserRole.BCAR_CERTIFIER) {
        essential.push({ type, details, reason: 'Legally required for BCAR certification' });
      } else if (type === 'LAW_SOCIETY_MEMBERSHIP' && [UserRole.SOLICITOR, UserRole.BUYER_SOLICITOR, UserRole.DEVELOPER_SOLICITOR].includes(role)) {
        essential.push({ type, details, reason: 'Required to practice as a solicitor in Ireland' });
      } else if (type === 'ESTATE_AGENT_LICENSE' && [UserRole.ESTATE_AGENT, UserRole.ESTATE_AGENT_MANAGER].includes(role)) {
        essential.push({ type, details, reason: 'Required to operate as an estate agent in Ireland' });
      } 
      // Recommended certifications (professional standards)
      else if (type === 'RIAI_MEMBERSHIP' && [UserRole.ARCHITECT, UserRole.LEAD_ARCHITECT].includes(role)) {
        recommended.push({ type, details, reason: 'Professional recognition and standards' });
      } else if (type === 'ENGINEERS_IRELAND' && [UserRole.ENGINEER, UserRole.STRUCTURAL_ENGINEER].includes(role)) {
        recommended.push({ type, details, reason: 'Professional recognition and standards' });
      } else if (type === 'SCSI_MEMBERSHIP' && [UserRole.QUANTITY_SURVEYOR, UserRole.BUILDING_SURVEYOR].includes(role)) {
        recommended.push({ type, details, reason: 'Professional recognition and standards' });
      }
      // Optional certifications (additional qualifications)
      else {
        optional.push({ type, details, reason: 'Additional specialization' });
      }
    }

    return {
      essential,
      recommended,
      optional,
      summary: {
        totalAvailable: availableCerts.length,
        essentialCount: essential.length,
        recommendedCount: recommended.length,
        optionalCount: optional.length
      }
    };
  }
}

export const irishCertificationService = new IrishCertificationService();