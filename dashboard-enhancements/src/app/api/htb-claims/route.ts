import { NextRequest, NextResponse } from "next/server";
import { initializeDb, htbClaims } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // For demo purposes, return mock data
    const mockClaims = [
      {
        id: "1",
        userId: "1",
        propertyId: "1",
        claimCode: "HTB-2025-123456",
        status: "approved",
        amount: 30000,
        submissionDate: "2025-03-10T11:20:00Z",
        approvalDate: "2025-03-15T14:30:00Z",
        createdAt: "2025-03-10T11:20:00Z",
        updatedAt: "2025-03-15T14:30:00Z",
      },
      {
        id: "2",
        userId: "1",
        propertyId: "2",
        claimCode: "HTB-2025-789012",
        status: "pending",
        amount: 25000,
        submissionDate: "2025-04-05T09:45:00Z",
        approvalDate: null,
        createdAt: "2025-04-05T09:45:00Z",
        updatedAt: "2025-04-05T09:45:00Z",
      },
    ];

    if (userId) {
      const userClaims = mockClaims.filter((claim) => claim.userId === userId);
      return NextResponse.json(userClaims);
    }

    return NextResponse.json(mockClaims);
  } catch (error) {
    console.error("Error fetching HTB claims:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Define the expected request body type
interface HTBClaimRequestBody {
  userId: string;
  propertyId: string;
  claimCode: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HTBClaimRequestBody;
    const { userId, propertyId, claimCode, amount } = body;

    // Validate input
    if (!userId || !propertyId || !claimCode || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // For demo purposes, return success with mock data
    const claimId = uuidv4();
    const now = new Date().toISOString();

    return NextResponse.json(
      {
        id: claimId,
        userId,
        propertyId,
        claimCode,
        status: "pending",
        amount,
        submissionDate: now,
        approvalDate: null,
        createdAt: now,
        updatedAt: now,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating HTB claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
