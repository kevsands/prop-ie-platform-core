// src/app/api/customization/options/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-helper';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getSupplierStockLevels } from '@/lib/supplierApi';

// Verify authentication helper async function asyncgetServerSession(authOptions);

    if (!session?.user) {
      return null;
    }

    return session.user;
  } catch (error) {

    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // User authentication - optional for browsing
    const user = await verifyAuth(request);

    // Get query parameters
    const searchParams = new URL(request.url).searchParams;
    const room = searchParams.get('room');
    const category = searchParams.get('category');
    const propertyId = searchParams.get('propertyId');

    if (!room || !category) {
      return NextResponse.json(
        { error: 'Room and category parameters are required' },
        { status: 400 }
      );
    }

    // Get database connection
    const { db } = await connectToDatabase();

    // Build query
    const query: Record<string, any> = { active: true };

    if (room) query.room = room;
    if (category) query.category = category;

    // Get property type if propertyId is provided
    let propertyType = 'standard';
    if (propertyId) {
      const property = await db.collection('properties').findOne({ 
        $or: [
          { _id: propertyId },
          { id: propertyId }
        ]
      });

      if (property) {
        propertyType = property.type;
      }
    }

    query.applicablePropertyTypes = propertyType;

    // Define option type
    interface CustomizationOption {
      id: string;
      name: string;
      price: number;
      unit: string;
      image?: string;
      description?: string;
      category: string;
      room: string;
      modelPath?: string;
      materialPath?: string;
      supplierItemId?: string;
      inStock?: boolean;
      leadTime?: number | null;
      lastStockCheck?: Date;
      customData?: Record<string, any>
  );
    }

    // Fetch options
    const options: CustomizationOption[] = await db
      .collection('customizationOptions')
      .find(query)
      .sort({ displayOrder: 1 })
      .toArray();

    // Check stock levels if required
    if (options.length> 0 && process.env.CHECK_STOCK_LEVELS === 'true') {
      // Get all supplier items
      const supplierItemIds = options
        .filter(opt => opt.supplierItemId)
        .map(opt => opt.supplierItemId as string);

      if (supplierItemIds.length> 0) {
        const stockLevels = await getSupplierStockLevels(supplierItemIds);

        // Enrich options with stock information
        options.forEach(option => {
          if (option.supplierItemId && stockLevels[option.supplierItemId]) {
            option.inStock = stockLevels[option.supplierItemId].available;
            option.leadTime = stockLevels[option.supplierItemId].leadTime;
            option.lastStockCheck = stockLevels[option.supplierItemId].updatedAt;
          } else {
            option.inStock = true; // Default to true if no stock info
            option.leadTime = null;
          }
        });
      }
    }

    // Format the response by category
    const formattedOptions: Record<string, any[]> = {};
    formattedOptions[category] = options.map(option => ({
      id: option.id,
      name: option.name,
      price: option.price,
      unit: option.unit,
      image: option.image,
      description: option.description,
      category: option.category,
      room: option.room,
      modelPath: option.modelPath,
      materialPath: option.materialPath,
      inStock: option.inStock,
      leadTime: option.leadTime,
      customData: option.customData || {}));

    return NextResponse.json(formattedOptions);
  } catch (error) {

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}