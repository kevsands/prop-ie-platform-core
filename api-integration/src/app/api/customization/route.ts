// src/app/api/customization/route.ts
import { NextRequest, NextResponse } from 'next/server';
import MongoClient from '@/lib/mongodb';
import DataService, { Customization } from '@/lib/data-service';
import * as mongodb from '@/lib/mongodb-helper';

// Define User type to avoid property 'user' error
interface User {
  userId: string;
  username: string;
  email?: string;
  attributes?: Record<string, any>;
}

// Define interface for consultation request
interface ConsultationRequest {
  propertyId: string;
  customizationId: string;
  consultationData?: {
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
    [key: string]: any;
  };
}

// Define interface for finalization request
interface FinalizationRequest {
  customizationId: string;
  notes?: string;
  [key: string]: any;
}

/**
 * Get customization data for a property
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const customizationId = searchParams.get('customizationId');
    
    if (!propertyId && !customizationId) {
      return NextResponse.json({ error: 'Either propertyId or customizationId must be provided' }, { status: 400 });
    }
    
    // Get authenticated user
    let userInfo: User | null = null;
    try {
      userInfo = await DataService.getCurrentUser();
      if (!userInfo) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    let customizationData;
    
    if (customizationId) {
      // Get specific customization
      try {
        customizationData = await DataService.getCustomization(customizationId);
      } catch (error) {
        console.error(`Error fetching customization ${customizationId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch customization' }, { status: 500 });
      }
    } else if (propertyId) {
      // Get latest customization for property
      try {
        customizationData = await DataService.getCustomization(propertyId);
      } catch (error) {
        console.error(`Error fetching customization for property ${propertyId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch customization' }, { status: 500 });
      }
    }
    
    if (!customizationData) {
      return NextResponse.json({ message: 'No customization found' }, { status: 404 });
    }
    
    // Check if the customization belongs to the user
    if (customizationData.userId !== userInfo.userId) {
      return NextResponse.json({ error: 'Not authorized to access this customization' }, { status: 403 });
    }
    
    return NextResponse.json(customizationData);
  } catch (error) {
    console.error('Error in customization GET:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

/**
 * Save customization data
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    let userInfo: User | null = null;
    try {
      userInfo = await DataService.getCurrentUser();
      if (!userInfo) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate request body is an object
    if (!requestBody || typeof requestBody !== 'object' || Array.isArray(requestBody)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 });
    }
    
    // Type assertion after validation
    const typedRequestBody = requestBody as Record<string, any>;
    
    // Validate required fields
    if (!typedRequestBody.propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }
    
    // Prepare customization data
    const customizationData: Customization = {
      ...typedRequestBody,
      userId: userInfo.userId,
      propertyId: typedRequestBody.propertyId, // Ensure propertyId is included
      updatedAt: new Date().toISOString(),
      selectedOptions: typedRequestBody.selectedOptions || {} // Ensure selectedOptions is included
    };
    
    try {
      const result = await DataService.saveCustomization(customizationData);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error saving customization:', error);
      return NextResponse.json({ error: 'Failed to save customization' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in customization POST:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

/**
 * Request a consultation
 */
export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    let userInfo: User | null = null;
    try {
      userInfo = await DataService.getCurrentUser();
      if (!userInfo) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate request body is an object
    if (!requestBody || typeof requestBody !== 'object' || Array.isArray(requestBody)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 });
    }
    
    // Type assertion after validation
    const typedRequestBody = requestBody as Record<string, any>;
    
    // Validate required fields
    if (!typedRequestBody.propertyId || !typedRequestBody.customizationId) {
      return NextResponse.json({ 
        error: 'propertyId and customizationId are required' 
      }, { status: 400 });
    }
    
    // Create consultation request
    const consultationRequest = typedRequestBody as ConsultationRequest;
    const consultationData = consultationRequest.consultationData || {};

    // Ensure consultationData is not undefined before passing to requestConsultation
    const consultationDataToSend: Record<string, any> = {
      preferredDate: consultationData.preferredDate,
      preferredTime: consultationData.preferredTime,
      notes: consultationData.notes
    };
    
    const result = await DataService.requestConsultation(
      consultationRequest.propertyId,
      consultationRequest.customizationId,
      consultationDataToSend
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in consultation PUT:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

/**
 * Finalize customization
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    let userInfo: User | null = null;
    try {
      userInfo = await DataService.getCurrentUser();
      if (!userInfo) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate request body is an object
    if (!requestBody || typeof requestBody !== 'object' || Array.isArray(requestBody)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 });
    }
    
    // Type assertion after validation
    const typedRequestBody = requestBody as Record<string, any>;
    
    // Validate required fields
    if (!typedRequestBody.customizationId) {
      return NextResponse.json({ error: 'customizationId is required' }, { status: 400 });
    }
    
    // Create finalization request
    const finalizationRequest: FinalizationRequest = {
      customizationId: typedRequestBody.customizationId,
      notes: typedRequestBody.notes
    };
    
    try {
      // Verify the customization belongs to the user
      const customization = await DataService.getCustomization(finalizationRequest.customizationId);
      if (!customization) {
        return NextResponse.json({ error: 'Customization not found' }, { status: 404 });
      }
      
      if (customization.userId !== userInfo.userId) {
        return NextResponse.json({ 
          error: 'Not authorized to finalize this customization' 
        }, { status: 403 });
      }
      
      // Get existing customization to preserve selectedOptions
      const existingCustomization = await DataService.getCustomization(finalizationRequest.customizationId);
      
      // Create update data with the Customization interface
      const updateData: Partial<Customization> = {
        ...typedRequestBody,
        updatedAt: new Date().toISOString(),
        status: 'FINALIZED'
      };
      
      const result = await DataService.saveCustomization(updateData);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error finalizing customization:', error);
      return NextResponse.json({ error: 'Failed to finalize customization' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in customization PATCH:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}