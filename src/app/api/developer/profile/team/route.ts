/**
 * API Route: /api/developer/profile/team
 * Team member management for developer profiles
 */

import { NextRequest, NextResponse } from 'next/server';
import { developerProfileService } from '@/lib/services/developer-profile-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, memberData } = body;

    if (!userId || !memberData) {
      return NextResponse.json({
        success: false,
        error: 'User ID and member data are required'
      }, { status: 400 });
    }

    console.log('[TEAM API] Adding team member for user:', userId);

    const newMember = await developerProfileService.addTeamMember(userId, memberData);

    return NextResponse.json({
      success: true,
      data: newMember,
      message: 'Team member added successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('[TEAM API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add team member',
      message: error.message
    }, { status: 500 });
  }
}