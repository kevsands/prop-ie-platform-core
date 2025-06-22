/**
 * Professional Roles API Route
 * 
 * Week 3 Implementation: Professional Role Integration
 * API endpoints for managing professional roles, certifications, and permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import ProfessionalPermissionService, { Permission, UserRole } from '@/lib/permissions/ProfessionalPermissionMatrix';

const prisma = new PrismaClient();

// Request schemas
const AssignRolesSchema = z.object({
  userId: z.string(),
  primaryRole: z.nativeEnum(UserRole),
  secondaryRoles: z.array(z.nativeEnum(UserRole)).optional(),
  certifications: z.array(z.object({
    certificationName: z.string(),
    issuingBody: z.string(),
    certificationNumber: z.string().optional(),
    issueDate: z.coerce.date(),
    expiryDate: z.coerce.date().optional(),
    scope: z.string().optional(),
    specializations: z.array(z.string()).optional()
  })).optional(),
  associations: z.array(z.object({
    associationName: z.string(),
    membershipType: z.string(),
    membershipNumber: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    isActive: z.boolean().default(true)
  })).optional()
});

const PermissionCheckSchema = z.object({
  userRoles: z.array(z.nativeEnum(UserRole)),
  permission: z.nativeEnum(Permission)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'assign_roles':
        return await assignProfessionalRoles(body);
      case 'check_permission':
        return await checkPermission(body);
      case 'get_role_permissions':
        return await getRolePermissions(body);
      case 'validate_credentials':
        return await validateCredentials(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Professional roles API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'get_profile':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }
        return await getProfessionalProfile(userId);
      
      case 'search_professionals':
        return await searchProfessionals(searchParams);
      
      case 'get_role_definitions':
        return await getRoleDefinitions();
      
      case 'get_certification_providers':
        return await getCertificationProviders();
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Professional roles API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Assign professional roles to a user
async function assignProfessionalRoles(body: any) {
  try {
    const validated = AssignRolesSchema.parse(body);
    
    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user's primary role
      const user = await tx.user.update({
        where: { id: validated.userId },
        data: {
          // Store roles as JSON in roleData field for now
          roleData: JSON.stringify({
            primary: validated.primaryRole,
            secondary: validated.secondaryRoles || []
          })
        }
      });

      // Add professional certifications
      if (validated.certifications) {
        for (const cert of validated.certifications) {
          await tx.professionalCertification.create({
            data: {
              userId: validated.userId,
              certificationName: cert.certificationName,
              issuingBody: cert.issuingBody,
              certificationNumber: cert.certificationNumber,
              issueDate: cert.issueDate,
              expiryDate: cert.expiryDate,
              scope: cert.scope,
              specializations: cert.specializations || [],
              verificationStatus: 'pending',
              isActive: true
            }
          });
        }
      }

      // Add professional associations
      if (validated.associations) {
        for (const assoc of validated.associations) {
          await tx.professionalAssociation.create({
            data: {
              userId: validated.userId,
              associationName: assoc.associationName,
              membershipType: assoc.membershipType,
              membershipNumber: assoc.membershipNumber,
              startDate: assoc.startDate,
              endDate: assoc.endDate,
              isActive: assoc.isActive,
              verificationStatus: 'pending'
            }
          });
        }
      }

      return user;
    });

    // Check eligibility for assigned roles
    const userRoles = [validated.primaryRole, ...(validated.secondaryRoles || [])];
    const permissions = ProfessionalPermissionService.getUserPermissions(userRoles);
    
    return NextResponse.json({
      success: true,
      user: result,
      assignedRoles: userRoles,
      permissions: permissions,
      eligibilityWarnings: [] // TODO: Implement eligibility checking
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

// Check if user has specific permission
async function checkPermission(body: any) {
  try {
    const validated = PermissionCheckSchema.parse(body);
    
    const hasPermission = ProfessionalPermissionService.hasPermission(
      validated.userRoles,
      validated.permission
    );
    
    const requiresApproval = ProfessionalPermissionService.requiresApproval(
      validated.userRoles,
      validated.permission
    );
    
    const canOnlyViewOwnData = ProfessionalPermissionService.canOnlyViewOwnData(
      validated.userRoles
    );

    return NextResponse.json({
      hasPermission,
      requiresApproval,
      canOnlyViewOwnData,
      userRoles: validated.userRoles,
      permission: validated.permission
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

// Get permissions for a specific role
async function getRolePermissions(body: any) {
  try {
    const { role } = body;
    
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    const rolePermissions = ProfessionalPermissionService.getRolePermissions(role);
    const permissionSummary = ProfessionalPermissionService.getPermissionSummary(role);

    return NextResponse.json({
      role,
      permissions: rolePermissions,
      summary: permissionSummary
    });

  } catch (error) {
    throw error;
  }
}

// Get professional profile with roles and certifications
async function getProfessionalProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalCertifications: {
          where: { isActive: true },
          orderBy: { issueDate: 'desc' }
        },
        professionalAssociations: {
          where: { isActive: true },
          orderBy: { startDate: 'desc' }
        },
        professionalSpecializations: {
          orderBy: { created: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse role data
    let roles = { primary: null, secondary: [] };
    if (user.roleData) {
      try {
        roles = JSON.parse(user.roleData);
      } catch (e) {
        console.error('Error parsing role data:', e);
      }
    }

    // Calculate profile completeness
    let completeness = 0;
    if (roles.primary) completeness += 30;
    if (user.professionalCertifications.length > 0) completeness += 25;
    if (user.professionalAssociations.length > 0) completeness += 25;
    if (user.professionalSpecializations.length > 0) completeness += 20;

    // Check verification status
    const verificationStatus = user.professionalCertifications.every(cert => cert.verificationStatus === 'verified') &&
                              user.professionalAssociations.every(assoc => assoc.verificationStatus === 'verified')
                              ? 'verified' : 'pending';

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      },
      roles,
      certifications: user.professionalCertifications,
      associations: user.professionalAssociations,
      specializations: user.professionalSpecializations,
      profileCompletion: completeness,
      verificationStatus,
      permissions: roles.primary ? ProfessionalPermissionService.getUserPermissions([roles.primary, ...roles.secondary]) : []
    });

  } catch (error) {
    throw error;
  }
}

// Search for professionals
async function searchProfessionals(searchParams: URLSearchParams) {
  try {
    const role = searchParams.get('role');
    const location = searchParams.get('location');
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const whereClause: any = {
      roleData: {
        not: null
      }
    };

    // Add role filter
    if (role) {
      whereClause.roleData = {
        contains: role
      };
    }

    // Add location filter (simplified - in real implementation would use proper address fields)
    if (location) {
      whereClause.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { county: { contains: location, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        professionalCertifications: {
          where: { isActive: true }
        },
        professionalAssociations: {
          where: { isActive: true }
        },
        professionalSpecializations: true
      },
      take: limit
    });

    // Filter verified professionals if requested
    let filteredUsers = users;
    if (verifiedOnly) {
      filteredUsers = users.filter(user => 
        user.professionalCertifications.some(cert => cert.verificationStatus === 'verified')
      );
    }

    // Transform to professional directory format
    const professionals = filteredUsers.map(user => {
      let roles = { primary: null, secondary: [] };
      if (user.roleData) {
        try {
          roles = JSON.parse(user.roleData);
        } catch (e) {
          console.error('Error parsing role data:', e);
        }
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        primaryRole: roles.primary,
        secondaryRoles: roles.secondary,
        certifications: user.professionalCertifications,
        associations: user.professionalAssociations,
        specializations: user.professionalSpecializations.map(spec => spec.specializationArea),
        verificationStatus: user.professionalCertifications.every(cert => cert.verificationStatus === 'verified')
          ? 'verified' : 'pending'
      };
    });

    return NextResponse.json({
      professionals,
      total: professionals.length,
      filters: {
        role,
        location,
        verifiedOnly
      }
    });

  } catch (error) {
    throw error;
  }
}

// Get role definitions and requirements
async function getRoleDefinitions() {
  try {
    // This would normally come from a database or configuration
    const roleDefinitions = {
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
      // Add more role definitions as needed
    };

    return NextResponse.json({
      roles: roleDefinitions,
      totalRoles: Object.keys(roleDefinitions).length
    });

  } catch (error) {
    throw error;
  }
}

// Get certification providers
async function getCertificationProviders() {
  try {
    const providers = [
      {
        name: 'Royal Institute of the Architects of Ireland (RIAI)',
        type: 'professional_body',
        website: 'https://www.riai.ie',
        certifications: ['RIAI Membership', 'Chartered Architect', 'RIAI Accredited']
      },
      {
        name: 'Engineers Ireland',
        type: 'professional_body',
        website: 'https://www.engineersireland.ie',
        certifications: ['Chartered Engineer', 'Engineers Ireland Membership', 'CPD Certified']
      },
      {
        name: 'Law Society of Ireland',
        type: 'professional_body',
        website: 'https://www.lawsociety.ie',
        certifications: ['Practising Certificate', 'Conveyancing Certificate', 'Continuing Legal Education']
      },
      {
        name: 'Society of Chartered Surveyors Ireland (SCSI)',
        type: 'professional_body',
        website: 'https://www.scsi.ie',
        certifications: ['MSCSI', 'FSCSI', 'SCSI Accredited Valuer']
      },
      {
        name: 'Sustainable Energy Authority of Ireland (SEAI)',
        type: 'government_agency',
        website: 'https://www.seai.ie',
        certifications: ['BER Assessor', 'NZEB Assessor', 'Energy Auditor']
      }
    ];

    return NextResponse.json({
      providers,
      totalProviders: providers.length
    });

  } catch (error) {
    throw error;
  }
}

// Validate professional credentials
async function validateCredentials(body: any) {
  try {
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalCertifications: true,
        professionalAssociations: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
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

    // Check unverified items
    const unverifiedCerts = user.professionalCertifications.filter(cert => 
      cert.verificationStatus !== 'verified'
    );
    if (unverifiedCerts.length > 0) {
      issues.push(`${unverifiedCerts.length} unverified certification(s)`);
      recommendations.push('Complete certification verification process');
    }

    return NextResponse.json({
      isValid: issues.length === 0,
      issues,
      recommendations,
      summary: {
        totalCertifications: user.professionalCertifications.length,
        verifiedCertifications: user.professionalCertifications.filter(c => c.verificationStatus === 'verified').length,
        expiredCertifications: expiredCerts.length,
        totalAssociations: user.professionalAssociations.length,
        activeAssociations: user.professionalAssociations.filter(a => a.isActive).length
      }
    });

  } catch (error) {
    throw error;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update_certification':
        return await updateCertification(body);
      case 'verify_certification':
        return await verifyCertification(body);
      case 'update_association':
        return await updateAssociation(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Professional roles PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update certification
async function updateCertification(body: any) {
  try {
    const { certificationId, updates } = body;
    
    const certification = await prisma.professionalCertification.update({
      where: { id: certificationId },
      data: updates
    });

    return NextResponse.json({
      success: true,
      certification
    });

  } catch (error) {
    throw error;
  }
}

// Verify certification
async function verifyCertification(body: any) {
  try {
    const { certificationId, verificationStatus, verifiedBy } = body;
    
    const certification = await prisma.professionalCertification.update({
      where: { id: certificationId },
      data: {
        verificationStatus,
        // Add verification timestamp and verifier info if needed
      }
    });

    return NextResponse.json({
      success: true,
      certification
    });

  } catch (error) {
    throw error;
  }
}

// Update association
async function updateAssociation(body: any) {
  try {
    const { associationId, updates } = body;
    
    const association = await prisma.professionalAssociation.update({
      where: { id: associationId },
      data: updates
    });

    return NextResponse.json({
      success: true,
      association
    });

  } catch (error) {
    throw error;
  }
}