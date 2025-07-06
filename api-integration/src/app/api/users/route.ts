import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/users-production";
// TODO: Add authentication when auth system is configured

/**
 * GET handler for users endpoint
 * Retrieves users with optional filtering
 * 
 * - GET /api/users - Get all users with optional filters (role, search)
 * - GET /api/users?id=xyz - Get a specific user by ID
 * - GET /api/users?email=xyz - Get a specific user by email
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add session checking when auth is configured
    // const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    
    // Check if requesting a specific user
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    
    // If ID is provided, get user by ID
    if (id) {
      const user = await userService.getUserById(id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    
    // If email is provided, get user by email
    if (email) {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    
    // Otherwise, get all users with optional filters
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    
    // Check if user has permission to list all users
    // Implement proper permission check based on your app's requirements
    // For demo purposes, allow access to demo accounts
    
    const filters: { role?: string; search?: string } = {};
    if (role) filters.role = role;
    if (search) filters.search = search;
    
    const users = await userService.getUsers(filters);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in users GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for users endpoint
 * Creates a new user
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add session checking when auth is configured
    // const session = await getServerSession();
    const body = await request.json();
    
    // Validate required fields
    const { name, email, password, role, firstName, lastName } = body;
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Use provided firstName/lastName or parse from name
    const userFirstName = firstName || (name ? name.split(' ')[0] : '');
    const userLastName = lastName || (name ? name.split(' ').slice(1).join(' ') : '');
    
    // Check if the role is valid
    const validRoles = ["buyer", "solicitor", "developer", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }
    
    // TODO: Check if admin permission is required when auth is configured
    // For development, we're allowing user creation
    
    // Create the user
    try {
      const newUser = await userService.createUser({
        cognitoUserId: `temp_${Date.now()}`, // TODO: Replace with real Cognito user ID when auth is configured
        email,
        firstName: userFirstName,
        lastName: userLastName,
        phone: body.phone,
        roles: [role.toUpperCase() as any], // Convert to enum format
        organization: body.organization,
        position: body.position,
      });
      
      return NextResponse.json(newUser, { status: 201 });
    } catch (err: any) {
      if (err.message === "User with this email already exists") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error in users POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for users endpoint
 * Updates an existing user
 * Requires the user ID in the query params (?id=xyz)
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: Add session checking when auth is configured
    // const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Get existing user to check permissions
    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // TODO: Check permissions when auth is configured
    // For development, we're allowing updates
    
    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { id: _, createdAt, updatedAt, ...updateData } = body;
    
    // Update the user
    const updatedUser = await userService.updateUser(id, updateData);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in users PUT handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for users endpoint
 * Deletes a user
 * Requires the user ID in the query params (?id=xyz)
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add session checking when auth is configured
    // const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Get existing user to check permissions
    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // TODO: Check permissions when auth is configured
    // For development, we're allowing deletions
    
    // Delete the user
    const deleted = await userService.deleteUser(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in users DELETE handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}