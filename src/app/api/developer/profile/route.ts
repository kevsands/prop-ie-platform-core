/**
 * API Route: /api/developer/profile
 * Developer profile management endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { developerProfileService } from '@/lib/services/developer-profile-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'cmc6bsi2y0000y3q4d3rxvihw'; // Default developer user

    console.log('[DEVELOPER PROFILE API] Fetching profile for user:', userId);

    const profile = await developerProfileService.getProfileByUserId(userId);

    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Developer profile retrieved successfully'
    });

  } catch (error: any) {
    console.error('[DEVELOPER PROFILE API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch developer profile',
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updateData } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    console.log('[DEVELOPER PROFILE API] Updating profile for user:', userId);

    const updatedProfile = await developerProfileService.updateProfile(userId, updateData);

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Developer profile updated successfully'
    });

  } catch (error: any) {
    console.error('[DEVELOPER PROFILE API] Update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update developer profile',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, profileData } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    console.log('[DEVELOPER PROFILE API] Creating profile for user:', userId);

    const newProfile = await developerProfileService.createProfile(userId, profileData);

    return NextResponse.json({
      success: true,
      data: newProfile,
      message: 'Developer profile created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('[DEVELOPER PROFILE API] Create error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create developer profile',
      message: error.message
    }, { status: 500 });
  }
}