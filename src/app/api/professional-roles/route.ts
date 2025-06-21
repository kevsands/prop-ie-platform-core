/**
 * Professional Roles API
 * 
 * Provides endpoints for managing the 49-role professional ecosystem
 * Week 3 Implementation: Professional Role Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import ProfessionalRoleManagementService from '@/services/ProfessionalRoleManagementService';

const roleService = new ProfessionalRoleManagementService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    switch (action) {
      case 'definitions':
        // Get all professional role definitions
        const definitions = roleService.getProfessionalRoleDefinitions();
        return NextResponse.json({
          success: true,
          data: definitions,
          meta: {
            totalRoles: Object.keys(definitions).length,
            categories: [...new Set(Object.values(definitions).map(d => d.category))]
          }
        });

      case 'assess':
        // Assess professional capability for a user
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for assessment' },
            { status: 400 }
          );
        }
        
        const assessment = await roleService.assessProfessionalCapability(userId);
        return NextResponse.json({
          success: true,
          data: assessment
        });

      case 'validate':
        // Validate professional credentials
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for validation' },
            { status: 400 }
          );
        }
        
        const validation = await roleService.validateProfessionalCredentials(userId);
        return NextResponse.json({
          success: true,
          data: validation
        });

      case 'by-role':
        // Get professionals by role
        if (!role) {
          return NextResponse.json(
            { success: false, error: 'role is required' },
            { status: 400 }
          );
        }
        
        const professionals = await roleService.getProfessionalsByRole(role as any);
        return NextResponse.json({
          success: true,
          data: professionals,
          meta: {
            count: professionals.length,
            role
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Professional roles API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'assign':
        // Assign professional roles to a user
        const result = await roleService.assignProfessionalRoles(data);
        return NextResponse.json({
          success: result.success,
          data: result.user,
          warnings: result.warnings,
          errors: result.errors
        }, { status: result.success ? 200 : 400 });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Professional roles API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Update professional profile
    const result = await roleService.assignProfessionalRoles({
      userId,
      ...updateData
    });

    return NextResponse.json({
      success: result.success,
      data: result.user,
      warnings: result.warnings,
      errors: result.errors
    }, { status: result.success ? 200 : 400 });

  } catch (error) {
    console.error('Professional roles API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}