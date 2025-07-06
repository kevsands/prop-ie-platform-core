/**
 * Buyer Search Preferences API
 * Handles persistent search preferences for both authenticated and guest users
 */

import { NextRequest, NextResponse } from 'next/server';
import { buyerSearchPreferencesService } from '@/lib/services/buyer-search-preferences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action');
    const isGuest = searchParams.get('guest') === 'true';

    // Get buyer preferences
    if (action === 'preferences' && buyerId && !isGuest) {
      const preferences = buyerSearchPreferencesService.getBuyerPreferences(buyerId);
      
      if (!preferences) {
        return NextResponse.json(
          { error: 'Preferences not found for buyer' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: preferences
      });
    }

    // Get guest session data
    if (action === 'guest-session' && sessionId) {
      const session = buyerSearchPreferencesService.getGuestSession(sessionId);
      
      if (!session) {
        return NextResponse.json(
          { error: 'Guest session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: session
      });
    }

    // Get personalized recommendations
    if (action === 'recommendations') {
      const identifier = buyerId || sessionId;
      const limit = parseInt(searchParams.get('limit') || '10');
      
      if (!identifier) {
        return NextResponse.json(
          { error: 'buyerId or sessionId required for recommendations' },
          { status: 400 }
        );
      }

      const recommendations = await buyerSearchPreferencesService.getPersonalizedRecommendations(
        identifier,
        isGuest,
        limit
      );

      return NextResponse.json({
        success: true,
        data: recommendations
      });
    }

    // Get search analytics for buyer
    if (action === 'analytics' && buyerId && !isGuest) {
      const analytics = buyerSearchPreferencesService.getSearchAnalytics(buyerId);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Analytics not found for buyer' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analytics
      });
    }

    // Get preference insights
    if (action === 'insights' && buyerId && !isGuest) {
      const insights = await buyerSearchPreferencesService.generatePreferenceInsights(buyerId);
      
      return NextResponse.json({
        success: true,
        data: insights
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in buyer preferences API:', error);
    return NextResponse.json(
      { error: 'Failed to process preferences request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, buyerId, sessionId, preferences, fingerprint } = body;

    // Update buyer preferences
    if (action === 'update-preferences' && buyerId) {
      if (!preferences) {
        return NextResponse.json(
          { error: 'Preferences data required' },
          { status: 400 }
        );
      }

      const updatedPreferences = await buyerSearchPreferencesService.updateBuyerPreferences(
        buyerId,
        preferences,
        sessionId
      );

      return NextResponse.json({
        success: true,
        data: updatedPreferences,
        message: 'Preferences updated successfully'
      });
    }

    // Track guest session
    if (action === 'track-guest' && sessionId) {
      if (!preferences || !fingerprint) {
        return NextResponse.json(
          { error: 'Preferences and fingerprint required for guest tracking' },
          { status: 400 }
        );
      }

      const guestSession = await buyerSearchPreferencesService.trackGuestSession(
        sessionId,
        preferences,
        fingerprint
      );

      return NextResponse.json({
        success: true,
        data: guestSession,
        message: 'Guest session tracked successfully'
      });
    }

    // Record property viewing
    if (action === 'record-viewing') {
      const { identifier, viewing, isGuest } = body;
      
      if (!identifier || !viewing) {
        return NextResponse.json(
          { error: 'Identifier and viewing data required' },
          { status: 400 }
        );
      }

      await buyerSearchPreferencesService.recordPropertyViewing(
        identifier,
        viewing,
        isGuest || false
      );

      return NextResponse.json({
        success: true,
        message: 'Property viewing recorded successfully'
      });
    }

    // Create saved search
    if (action === 'create-saved-search' && buyerId) {
      const { search } = body;
      
      if (!search) {
        return NextResponse.json(
          { error: 'Search data required' },
          { status: 400 }
        );
      }

      const savedSearch = await buyerSearchPreferencesService.createSavedSearch(
        buyerId,
        search
      );

      return NextResponse.json({
        success: true,
        data: savedSearch,
        message: 'Saved search created successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing required fields' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in buyer preferences POST API:', error);
    return NextResponse.json(
      { error: 'Failed to process preferences request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId, sessionId, action } = body;

    // Convert guest session to buyer account
    if (action === 'convert-guest-session' && buyerId && sessionId) {
      const guestSession = buyerSearchPreferencesService.getGuestSession(sessionId);
      
      if (!guestSession) {
        return NextResponse.json(
          { error: 'Guest session not found' },
          { status: 404 }
        );
      }

      // Update buyer preferences with guest session data
      const updatedPreferences = await buyerSearchPreferencesService.updateBuyerPreferences(
        buyerId,
        guestSession.preferences,
        sessionId
      );

      return NextResponse.json({
        success: true,
        data: updatedPreferences,
        message: 'Guest session converted to buyer account successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing required fields' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in buyer preferences PUT API:', error);
    return NextResponse.json(
      { error: 'Failed to process preferences request' },
      { status: 500 }
    );
  }
}