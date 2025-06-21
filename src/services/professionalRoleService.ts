import { PrismaClient, UserRole, User } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Professional Role Assignment Schema
export const ProfessionalRoleAssignmentSchema = z.object({
  userId: z.string(),
  primaryRole: z.nativeEnum(UserRole),
  secondaryRoles: z.array(z.nativeEnum(UserRole)).optional(),
  specializations: z.array(z.string()).optional(),
});

export const ProfessionalCertificationSchema = z.object({
  userId: z.string(),
  certificationName: z.string(),
  issuingBody: z.string(),
  certificationNumber: z.string().optional(),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  scope: z.string().optional(),
  specializations: z.array(z.string()).optional(),
});

export const ProfessionalAssociationSchema = z.object({
  userId: z.string(),
  associationName: z.string(),
  membershipType: z.string(),
  membershipNumber: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export type ProfessionalRoleAssignment = z.infer<typeof ProfessionalRoleAssignmentSchema>;
export type ProfessionalCertificationInput = z.infer<typeof ProfessionalCertificationSchema>;
export type ProfessionalAssociationInput = z.infer<typeof ProfessionalAssociationSchema>;

/**
 * Professional Role Service
 * Manages the 49-role professional ecosystem with certification tracking,
 * association memberships, and multi-role assignments
 */
export class ProfessionalRoleService {
  
  /**
   * Assign professional roles to a user
   * Supports primary role + multiple secondary roles
   */
  async assignProfessionalRoles(assignment: ProfessionalRoleAssignment) {
    const validated = ProfessionalRoleAssignmentSchema.parse(assignment);
    
    // Update user with professional role information
    const updatedUser = await prisma.user.update({
      where: { id: validated.userId },
      data: {
        role: validated.primaryRole,
        // Note: Add professional_role_primary and professional_roles_secondary when schema is fully updated
      },
      include: {
        professionalAssociations: true,
        professionalCertifications: true,
        professionalSpecializations: true,
      }
    });

    // Create specializations if provided
    if (validated.specializations?.length) {
      await Promise.all(
        validated.specializations.map(specialization =>
          prisma.professionalSpecialization.upsert({
            where: {
              userId_specializationArea: {
                userId: validated.userId,
                specializationArea: specialization
              }
            },
            update: {
              proficiencyLevel: 'Advanced', // Default level
            },
            create: {
              userId: validated.userId,
              specializationArea: specialization,
              proficiencyLevel: 'Advanced',
            }
          })
        )
      );
    }

    return updatedUser;
  }

  /**
   * Add professional certification for a user
   */
  async addProfessionalCertification(certification: ProfessionalCertificationInput) {
    const validated = ProfessionalCertificationSchema.parse(certification);
    
    return await prisma.professionalCertification.create({
      data: {
        userId: validated.userId,
        certificationName: validated.certificationName,
        issuingBody: validated.issuingBody,
        certificationNumber: validated.certificationNumber,
        issueDate: validated.issueDate,
        expiryDate: validated.expiryDate,
        scope: validated.scope,
        specializations: validated.specializations || [],
        verificationStatus: 'verified',
      }
    });
  }

  /**
   * Add professional association membership for a user
   */
  async addProfessionalAssociation(association: ProfessionalAssociationInput) {
    const validated = ProfessionalAssociationSchema.parse(association);
    
    return await prisma.professionalAssociation.create({
      data: {
        userId: validated.userId,
        associationName: validated.associationName,
        membershipType: validated.membershipType,
        membershipNumber: validated.membershipNumber,
        startDate: validated.startDate,
        endDate: validated.endDate,
        isActive: !validated.endDate || validated.endDate > new Date(),
        verificationStatus: 'verified',
      }
    });
  }

  /**
   * Get user's complete professional profile
   */
  async getProfessionalProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalAssociations: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' }
        },
        professionalCertifications: {
          where: { isActive: true },
          orderBy: { issueDate: 'desc' }
        },
        professionalSpecializations: {
          orderBy: { created: 'desc' }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      basicInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        primaryRole: user.role,
      },
      professionalProfile: {
        associations: user.professionalAssociations,
        certifications: user.professionalCertifications,
        specializations: user.professionalSpecializations,
      }
    };
  }

  /**
   * Find professionals by role and certification
   */
  async findProfessionalsByRole(role: UserRole, requiredCertifications?: string[]) {
    const whereClause: any = {
      role: role,
      status: 'ACTIVE'
    };

    if (requiredCertifications?.length) {
      whereClause.professionalCertifications = {
        some: {
          certificationName: {
            in: requiredCertifications
          },
          isActive: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gt: new Date() } }
          ]
        }
      };
    }

    return await prisma.user.findMany({
      where: whereClause,
      include: {
        professionalAssociations: {
          where: { isActive: true }
        },
        professionalCertifications: {
          where: { isActive: true }
        },
        professionalSpecializations: true
      }
    });
  }

  /**
   * Validate professional qualifications for a specific task
   */
  async validateProfessionalQualifications(
    userId: string, 
    requiredRole: UserRole,
    requiredCertifications?: string[],
    requiredAssociations?: string[]
  ) {
    const user = await this.getProfessionalProfile(userId);
    
    const validations = {
      roleMatch: user.basicInfo.primaryRole === requiredRole,
      certifications: true,
      associations: true,
      overall: false
    };

    // Check certifications
    if (requiredCertifications?.length) {
      const userCertNames = user.professionalProfile.certifications.map(c => c.certificationName);
      validations.certifications = requiredCertifications.every(cert => 
        userCertNames.includes(cert)
      );
    }

    // Check associations
    if (requiredAssociations?.length) {
      const userAssocNames = user.professionalProfile.associations.map(a => a.associationName);
      validations.associations = requiredAssociations.every(assoc => 
        userAssocNames.includes(assoc)
      );
    }

    validations.overall = validations.roleMatch && validations.certifications && validations.associations;

    return validations;
  }

  /**
   * Get professional workflow templates for a role
   */
  async getProfessionalWorkflowTemplates(role: UserRole) {
    // This will integrate with the task orchestration system
    return await prisma.taskTemplate.findMany({
      where: {
        primaryProfessionalRole: role
      },
      orderBy: {
        category: 'asc'
      }
    });
  }

  /**
   * Create professional collaboration for a transaction
   */
  async createProfessionalCollaboration(
    transactionId: string,
    professionalRoles: Array<{
      role: UserRole;
      userId?: string;
      required: boolean;
      certificationRequirements?: string[];
    }>
  ) {
    // Implementation for creating professional collaboration matrix
    // This will coordinate the 49-role ecosystem for a specific transaction
    
    const collaboration = {
      transactionId,
      professionals: [] as any[],
      status: 'pending'
    };

    for (const roleReq of professionalRoles) {
      if (roleReq.userId) {
        // Specific professional assigned
        const isQualified = await this.validateProfessionalQualifications(
          roleReq.userId,
          roleReq.role,
          roleReq.certificationRequirements
        );
        
        if (!isQualified.overall && roleReq.required) {
          throw new Error(`Professional ${roleReq.userId} does not meet requirements for ${roleReq.role}`);
        }
        
        collaboration.professionals.push({
          userId: roleReq.userId,
          role: roleReq.role,
          status: 'assigned',
          qualified: isQualified.overall
        });
      } else {
        // Need to find qualified professional
        const availableProfessionals = await this.findProfessionalsByRole(
          roleReq.role,
          roleReq.certificationRequirements
        );
        
        collaboration.professionals.push({
          role: roleReq.role,
          status: 'searching',
          availableCount: availableProfessionals.length,
          required: roleReq.required
        });
      }
    }

    return collaboration;
  }
}

export const professionalRoleService = new ProfessionalRoleService();