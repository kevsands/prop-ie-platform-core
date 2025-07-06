import { NextRequest, NextResponse } from "next/server";
import { initializeDb, contractors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Define interface for contractor data
interface ContractorData {
  name: string;
  specialty: string;
  contactEmail: string;
  contactPhone: string;
  developerId: string;
  rating?: number;
  status?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get("developerId");
    const specialty = searchParams.get("specialty");

    // For demo purposes, return mock data
    const mockContractors = [
      {
        id: "1",
        name: "Dublin Builders Ltd",
        specialty: "general_construction",
        contactEmail: "info@dublinbuilders.ie",
        contactPhone: "+353 1 234 5678",
        rating: 4.8,
        developerId: "3",
        status: "active",
        createdAt: "2025-01-10T08:30:00Z",
        updatedAt: "2025-01-10T08:30:00Z",
      },
      {
        id: "2",
        name: "Elite Electrical Services",
        specialty: "electrical",
        contactEmail: "contact@eliteelectrical.ie",
        contactPhone: "+353 1 876 5432",
        rating: 4.7,
        developerId: "3",
        status: "active",
        createdAt: "2025-01-15T10:45:00Z",
        updatedAt: "2025-01-15T10:45:00Z",
      },
      {
        id: "3",
        name: "Premium Plumbing",
        specialty: "plumbing",
        contactEmail: "info@premiumplumbing.ie",
        contactPhone: "+353 1 567 8901",
        rating: 4.5,
        developerId: "3",
        status: "active",
        createdAt: "2025-01-20T14:15:00Z",
        updatedAt: "2025-01-20T14:15:00Z",
      },
      {
        id: "4",
        name: "Emerald Landscaping",
        specialty: "landscaping",
        contactEmail: "projects@emeraldlandscaping.ie",
        contactPhone: "+353 1 345 6789",
        rating: 4.9,
        developerId: "3",
        status: "active",
        createdAt: "2025-02-05T09:20:00Z",
        updatedAt: "2025-02-05T09:20:00Z",
      },
      {
        id: "5",
        name: "Superior Interiors",
        specialty: "interior_design",
        contactEmail: "design@superiorinteriors.ie",
        contactPhone: "+353 1 654 3210",
        rating: 4.6,
        developerId: "3",
        status: "active",
        createdAt: "2025-02-12T11:30:00Z",
        updatedAt: "2025-02-12T11:30:00Z",
      },
    ];

    if (developerId && specialty) {
      const filteredContractors = mockContractors.filter(
        (c) => c.developerId === developerId && c.specialty === specialty,
      );
      return NextResponse.json(filteredContractors);
    } else if (developerId) {
      const developerContractors = mockContractors.filter(
        (c) => c.developerId === developerId,
      );
      return NextResponse.json(developerContractors);
    } else if (specialty) {
      const specialtyContractors = mockContractors.filter(
        (c) => c.specialty === specialty,
      );
      return NextResponse.json(specialtyContractors);
    }

    return NextResponse.json(mockContractors);
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContractorData;
    const { name, specialty, contactEmail, contactPhone, developerId } = body;

    // Validate input
    if (!name || !specialty || !contactEmail || !contactPhone || !developerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // For demo purposes, return success with mock data
    const contractorId = uuidv4();
    const now = new Date().toISOString();

    return NextResponse.json(
      {
        id: contractorId,
        name,
        specialty,
        contactEmail,
        contactPhone,
        rating: null,
        developerId,
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contractor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
