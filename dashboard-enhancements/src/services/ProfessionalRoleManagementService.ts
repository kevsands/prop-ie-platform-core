/**
 * Professional Role Management Service
 * 
 * Manages the complete 49-role professional ecosystem for Irish property transactions
 * Implements role assignment, certification tracking, and professional coordination
 * 
 * Week 3 Implementation: Professional Role Integration
 * Phase 1, Month 1 - Foundation Enhancement
 */

import { PrismaClient, UserRole, User } from '@prisma/client';

export interface ProfessionalAssignmentRequest {
  userId: string;
  primaryRole: UserRole;
  secondaryRoles?: UserRole[];
  certifications?: ProfessionalCertificationData[];
  associations?: ProfessionalAssociationData[];
  specializations?: ProfessionalSpecializationData[];
}

export interface ProfessionalCertificationData {
  certificationName: string;
  issuingBody: string;
  certificationNumber?: string;
  issueDate: Date;
  expiryDate?: Date;
  scope?: string;
  specializations?: string[];
}

export interface ProfessionalAssociationData {
  associationName: string;
  membershipType: string;
  membershipNumber?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface ProfessionalSpecializationData {
  specializationArea: string;
  proficiencyLevel: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  experienceYears?: number;
  description?: string;
  keyProjects?: string[];
}

export interface ProfessionalCapabilityAssessment {
  userId: string;
  availableRoles: UserRole[];
  missingCertifications: string[];
  expiredCertifications: string[];
  recommendedSpecializations: string[];
  eligibilityScore: number;
}

class ProfessionalRoleManagementService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Professional Role Definitions
   * Complete 49-role ecosystem mapping
   */
  private readonly PROFESSIONAL_ROLE_DEFINITIONS = {
    // Primary Transaction Roles (Buyer Ecosystem)
    BUYER_SOLICITOR: {
      name: 'Buyer Solicitor',
      category: 'Legal',
      requiredCertifications: ['Law Society Practising Certificate'],
      requiredAssociations: ['Law Society of Ireland'],
      typicalSpecializations: ['Conveyancing', 'Property Law', 'Commercial Law']
    },
    BUYER_MORTGAGE_BROKER: {
      name: 'Buyer Mortgage Broker',
      category: 'Financial',
      requiredCertifications: ['CBI Authorization', 'QFA Qualification'],
      requiredAssociations: ['Brokers Ireland', 'PIBA'],
      typicalSpecializations: ['Residential Mortgages', 'First Time Buyer', 'Investment Mortgages']
    },
    BUYER_SURVEYOR: {
      name: 'Property Surveyor',
      category: 'Professional Services',
      requiredCertifications: ['SCSI Membership'],
      requiredAssociations: ['Society of Chartered Surveyors Ireland'],
      typicalSpecializations: ['Structural Survey', 'Valuation', 'Building Survey']
    },
    BUYER_FINANCIAL_ADVISOR: {
      name: 'Financial Advisor',
      category: 'Financial',
      requiredCertifications: ['QFA', 'RPA', 'CIP'],
      requiredAssociations: ['PIBA', 'Life Insurance Association'],
      typicalSpecializations: ['Investment Planning', 'Pension Planning', 'Insurance Planning']
    },
    BUYER_INSURANCE_BROKER: {
      name: 'Insurance Broker',
      category: 'Financial',
      requiredCertifications: ['CBI Authorization'],
      requiredAssociations: ['Insurance Institute of Ireland'],
      typicalSpecializations: ['Property Insurance', 'Life Insurance', 'Mortgage Protection']
    },

    // Developer Ecosystem Roles
    DEVELOPER_SOLICITOR: {
      name: 'Developer Solicitor',
      category: 'Legal',
      requiredCertifications: ['Law Society Practising Certificate'],
      requiredAssociations: ['Law Society of Ireland'],
      typicalSpecializations: ['Development Law', 'Planning Law', 'Commercial Conveyancing']
    },
    DEVELOPMENT_SALES_AGENT: {
      name: 'Development Sales Agent',
      category: 'Sales',
      requiredCertifications: ['PSRA License'],
      requiredAssociations: ['Institute of Professional Auctioneers & Valuers'],
      typicalSpecializations: ['New Homes Sales', 'Off Plan Sales', 'Investment Sales']
    },
    DEVELOPMENT_PROJECT_MANAGER: {
      name: 'Development Project Manager',
      category: 'Construction',
      requiredCertifications: ['Engineers Ireland', 'RIAI', 'CIOB'],
      requiredAssociations: ['Engineers Ireland', 'RIAI', 'CIOB'],
      typicalSpecializations: ['Project Management', 'Construction Management', 'Development Management']
    },

    // Design and Construction Professionals
    LEAD_ARCHITECT: {
      name: 'Lead Architect',
      category: 'Design',
      requiredCertifications: ['RIAI Membership'],
      requiredAssociations: ['Royal Institute of the Architects of Ireland'],
      typicalSpecializations: ['Residential Design', 'Commercial Design', 'Sustainable Design']
    },
    STRUCTURAL_ENGINEER: {
      name: 'Structural Engineer',
      category: 'Engineering',
      requiredCertifications: ['Engineers Ireland Membership'],
      requiredAssociations: ['Engineers Ireland'],
      typicalSpecializations: ['Structural Design', 'Foundation Design', 'Seismic Design']
    },
    CIVIL_ENGINEER: {
      name: 'Civil Engineer',
      category: 'Engineering',
      requiredCertifications: ['Engineers Ireland Membership'],
      requiredAssociations: ['Engineers Ireland'],
      typicalSpecializations: ['Infrastructure Design', 'Road Design', 'Drainage Design']
    },

    // Compliance and Certification Specialists
    BER_ASSESSOR: {
      name: 'BER Assessor',
      category: 'Compliance',
      requiredCertifications: ['SEAI BER Assessor'],
      requiredAssociations: ['SEAI'],
      typicalSpecializations: ['Energy Assessment', 'NZEB Assessment', 'Retrofit Assessment']
    },
    BCAR_CERTIFIER: {
      name: 'BCAR Certifier',
      category: 'Compliance',
      requiredCertifications: ['BCAR Assigned Certifier'],
      requiredAssociations: ['Engineers Ireland', 'RIAI'],
      typicalSpecializations: ['Building Control', 'Compliance Certification', 'Fire Safety']
    },
    FIRE_SAFETY_CONSULTANT: {
      name: 'Fire Safety Consultant',
      category: 'Compliance',
      requiredCertifications: ['Fire Safety Certification'],
      requiredAssociations: ['Institution of Fire Engineers'],
      typicalSpecializations: ['Fire Safety Design', 'Fire Risk Assessment', 'Evacuation Planning']
    }
  };

  /**
   * Assign professional roles to a user with comprehensive validation
   */
  async assignProfessionalRoles(request: ProfessionalAssignmentRequest): Promise<{
    success: boolean;
    user: User;
    warnings: string[];
    errors: string[];
  }> {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Validate primary role
      const roleDefinition = this.PROFESSIONAL_ROLE_DEFINITIONS[request.primaryRole as keyof typeof this.PROFESSIONAL_ROLE_DEFINITIONS];
      if (!roleDefinition) {
        errors.push(`Unknown professional role: ${request.primaryRole}`);
        return { success: false, user: null as any, warnings, errors };
      }

      // Start transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Update user with primary professional role
        const user = await tx.user.update({
          where: { id: request.userId },
          data: {
            roles: {
              set: [request.primaryRole, ...(request.secondaryRoles || [])]
            }
          },
          include: {
            professionalAssociations: true,
            professionalCertifications: true,
            professionalSpecializations: true
          }
        });

        // Add professional associations
        if (request.associations) {
          for (const association of request.associations) {
            await tx.professionalAssociation.create({
              data: {
                userId: request.userId,
                associationName: association.associationName,
                membershipType: association.membershipType,
                membershipNumber: association.membershipNumber,
                startDate: association.startDate,
                endDate: association.endDate,
                isActive: association.isActive
              }
            });
          }
        }

        // Add professional certifications
        if (request.certifications) {
          for (const certification of request.certifications) {
            await tx.professionalCertification.create({
              data: {
                userId: request.userId,
                certificationName: certification.certificationName,
                issuingBody: certification.issuingBody,
                certificationNumber: certification.certificationNumber,
                issueDate: certification.issueDate,
                expiryDate: certification.expiryDate,
                scope: certification.scope,
                specializations: certification.specializations || []
              }
            });
          }
        }

        // Add professional specializations
        if (request.specializations) {
          for (const specialization of request.specializations) {
            await tx.professionalSpecialization.create({
              data: {
                userId: request.userId,
                specializationArea: specialization.specializationArea,
                proficiencyLevel: specialization.proficiencyLevel,
                experienceYears: specialization.experienceYears,
                description: specialization.description,
                keyProjects: specialization.keyProjects || []
              }
            });
          }
        }

        return user;
      });

      // Validate role requirements
      const assessment = await this.assessProfessionalCapability(request.userId);
      if (assessment.missingCertifications.length > 0) {
        warnings.push(`Missing required certifications: ${assessment.missingCertifications.join(', ')}`);
      }
      if (assessment.expiredCertifications.length > 0) {
        warnings.push(`Expired certifications: ${assessment.expiredCertifications.join(', ')}`);
      }

      return {
        success: true,
        user: result,
        warnings,
        errors
      };

    } catch (error) {
      errors.push(`Failed to assign professional roles: ${error}`);
      return { success: false, user: null as any, warnings, errors };
    }
  }

  /**
   * Assess professional capability and eligibility for roles
   */
  async assessProfessionalCapability(userId: string): Promise<ProfessionalCapabilityAssessment> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalAssociations: true,
        professionalCertifications: true,
        professionalSpecializations: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const availableRoles: UserRole[] = [];
    const missingCertifications: string[] = [];
    const expiredCertifications: string[] = [];
    const recommendedSpecializations: string[] = [];
    let eligibilityScore = 0;

    // Assess each professional role
    for (const [roleKey, roleDefinition] of Object.entries(this.PROFESSIONAL_ROLE_DEFINITIONS)) {
      let roleEligible = true;
      let roleScore = 0;

      // Check required certifications
      for (const reqCert of roleDefinition.requiredCertifications) {
        const hasCert = user.professionalCertifications.some(cert => 
          cert.certificationName.includes(reqCert) && cert.isActive
        );
        if (hasCert) {
          roleScore += 20;
        } else {
          roleEligible = false;
          missingCertifications.push(reqCert);
        }
      }

      // Check required associations
      for (const reqAssoc of roleDefinition.requiredAssociations) {
        const hasAssoc = user.professionalAssociations.some(assoc => 
          assoc.associationName.includes(reqAssoc) && assoc.isActive
        );
        if (hasAssoc) {
          roleScore += 15;
        } else {
          roleEligible = false;
        }
      }

      // Check specializations
      const hasRelevantSpecializations = user.professionalSpecializations.some(spec =>
        roleDefinition.typicalSpecializations.some(typSpec => 
          spec.specializationArea.includes(typSpec)
        )
      );
      if (hasRelevantSpecializations) {
        roleScore += 10;
      } else {
        recommendedSpecializations.push(...roleDefinition.typicalSpecializations);
      }

      if (roleEligible) {
        availableRoles.push(roleKey as UserRole);
        eligibilityScore += roleScore;
      }
    }

    // Check for expired certifications
    const expired = user.professionalCertifications.filter(cert => 
      cert.expiryDate && cert.expiryDate < new Date()
    );
    expiredCertifications.push(...expired.map(cert => cert.certificationName));

    return {
      userId,
      availableRoles,
      missingCertifications: [...new Set(missingCertifications)],
      expiredCertifications,
      recommendedSpecializations: [...new Set(recommendedSpecializations)],
      eligibilityScore: Math.round(eligibilityScore / Object.keys(this.PROFESSIONAL_ROLE_DEFINITIONS).length)
    };
  }

  /**
   * Get all professional roles with their definitions
   */
  getProfessionalRoleDefinitions() {
    return this.PROFESSIONAL_ROLE_DEFINITIONS;
  }

  /**
   * Get professionals by role and availability
   */
  async getProfessionalsByRole(role: UserRole, options?: {
    location?: string;
    availability?: string;
    certificationRequired?: string;
    maxResults?: number;
  }): Promise<User[]> {
    const whereClause: any = {
      roles: {
        has: role
      }
    };

    if (options?.certificationRequired) {
      whereClause.professionalCertifications = {
        some: {
          certificationName: {
            contains: options.certificationRequired,
            mode: 'insensitive'
          },
          isActive: true
        }
      };
    }

    return await this.prisma.user.findMany({
      where: whereClause,
      include: {
        professionalAssociations: true,
        professionalCertifications: true,
        professionalSpecializations: true
      },
      take: options?.maxResults || 50
    });
  }

  /**
   * Validate professional credentials
   */
  async validateProfessionalCredentials(userId: string): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalAssociations: true,
        professionalCertifications: true,
        professionalSpecializations: true
      }
    });

    if (!user) {
      return { isValid: false, issues: ['User not found'], recommendations: [] };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for expired certifications
    const expiredCerts = user.professionalCertifications.filter(cert => 
      cert.expiryDate && cert.expiryDate < new Date()
    );
    if (expiredCerts.length > 0) {
      issues.push(`${expiredCerts.length} expired certification(s)`);
      recommendations.push('Renew expired certifications');
    }

    // Check for inactive associations
    const inactiveAssocs = user.professionalAssociations.filter(assoc => !assoc.isActive);
    if (inactiveAssocs.length > 0) {
      issues.push(`${inactiveAssocs.length} inactive professional association(s)`);
      recommendations.push('Reactivate professional associations');
    }

    // Check role coverage
    const assessment = await this.assessProfessionalCapability(userId);
    if (assessment.availableRoles.length === 0) {
      issues.push('No eligible professional roles');
      recommendations.push('Obtain required certifications and association memberships');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Close database connection
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

export default ProfessionalRoleManagementService;