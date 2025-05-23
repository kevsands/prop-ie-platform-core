import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for project creation
const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  projectType: z.enum(["RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "INDUSTRIAL", "INSTITUTIONAL", "RENOVATION", "INTERIOR", "LANDSCAPE"]),
  location: z.string(),
  clientName: z.string(),
  clientContact: z.string().optional(),
  siteArea: z.number().positive().optional(),
  buildingArea: z.number().positive().optional(),
  budget: z.number().positive().optional(),
  startDate: z.string().datetime(),
  targetDate: z.string().datetime().optional()});

// Schema for project update
const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string(),
  status: z.enum(["CONCEPT", "SCHEMATIC_DESIGN", "DESIGN_DEVELOPMENT", "CONSTRUCTION_DOCS", "BIDDING", "CONSTRUCTION", "COMPLETED", "ON_HOLD", "CANCELLED"]).optional(),
  completedDate: z.string().datetime().optional()});

// Helper function to create initial phases (mocked)
async function createInitialPhases(projectId: string, projectType: string) {

  // In a real implementation, this would create phases in the database
}

// GET /api/projects - Get all projects or filtered projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Build filter object
    const filter: any = {};

    // Filter by type
    const projectType = searchParams.get("projectType");
    if (projectType) {
      filter.projectType = projectType;
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      filter.status = status;
    }

    // Filter by owner or member (for non-admin users)
    if (!["ADMIN", "ARCHITECT_ADMIN"].includes(session.user.role || "")) {
      filter.OR = [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } }];
    }

    // Search by name or client
    const search = searchParams.get("search");

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Mock projects data since there's no archProject model in Prisma yet
    const mockProjects = [
      {
        id: "project-1",
        name: "Modern Residential Tower",
        description: "Luxury residential tower with 200 units and premium amenities",
        projectType: "RESIDENTIAL",
        status: "DESIGN_DEVELOPMENT",
        location: "Dublin City Center",
        clientName: "Dublin Development Ltd",
        clientContact: "john@dublindev.com",
        siteArea: 5000,
        buildingArea: 25000,
        budget: 75000000,
        startDate: new Date("2023-03-15"),
        targetDate: new Date("2025-06-30"),
        createdAt: new Date("2023-02-10"),
        updatedAt: new Date("2023-10-05"),
        ownerId: "user-1",
        owner: {
          id: "user-1",
          email: "architect@example.com",
          firstName: "Jane",
          lastName: "Architect"
        },
        members: [
          {
            role: "PROJECT_MANAGER",
            joinedAt: new Date("2023-02-15"),
            user: {
              id: "user-2",
              email: "manager@example.com",
              firstName: "John",
              lastName: "Manager",
              avatar: null
            }
          },
          {
            role: "DESIGNER",
            joinedAt: new Date("2023-02-18"),
            user: {
              id: "user-3",
              email: "designer@example.com",
              firstName: "Sam",
              lastName: "Designer",
              avatar: null
            }
          }
        ],
        phases: [
          {
            id: "phase-1",
            name: "Concept Design",
            phase: "CONCEPT",
            status: "COMPLETED",
            startDate: new Date("2023-03-15"),
            endDate: new Date("2023-05-30")
          },
          {
            id: "phase-2",
            name: "Schematic Design",
            phase: "SCHEMATIC_DESIGN",
            status: "COMPLETED",
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-09-30")
          },
          {
            id: "phase-3",
            name: "Design Development",
            phase: "DESIGN_DEVELOPMENT",
            status: "IN_PROGRESS",
            startDate: new Date("2023-10-01"),
            endDate: new Date("2024-03-30")
          }
        ],
        files: [
          {
            id: "file-1",
            name: "Project Brief.pdf",
            type: "DOCUMENT",
            uploadedAt: new Date("2023-02-15")
          },
          {
            id: "file-2",
            name: "Site Analysis.pdf",
            type: "DOCUMENT",
            uploadedAt: new Date("2023-03-10")
          }
        ],
        drawings: [
          {
            id: "drawing-1",
            title: "Floor Plan - Level 1",
            number: "A-101",
            type: "FLOOR_PLAN",
            status: "APPROVED",
            version: 3
          },
          {
            id: "drawing-2",
            title: "Elevations - North & South",
            number: "A-201",
            type: "ELEVATION",
            status: "APPROVED",
            version: 2
          }
        ],
        models: [
          {
            id: "model-1",
            name: "Main Building Model",
            type: "BIM",
            status: "CURRENT",
            version: 5
          }
        ],
        _count: {
          files: 12,
          drawings: 45,
          models: 3,
          reviews: 8,
          issues: 15,
          comments: 67
        }
      },
      {
        id: "project-2",
        name: "Commercial Office Block",
        description: "Sustainable office building with retail on ground floor",
        projectType: "COMMERCIAL",
        status: "SCHEMATIC_DESIGN",
        location: "Cork Business District",
        clientName: "Cork Commercial Properties",
        clientContact: "mary@corkcommercial.com",
        siteArea: 3500,
        buildingArea: 18000,
        budget: 45000000,
        startDate: new Date("2023-05-20"),
        targetDate: new Date("2025-04-15"),
        createdAt: new Date("2023-04-10"),
        updatedAt: new Date("2023-09-20"),
        ownerId: "user-1",
        owner: {
          id: "user-1",
          email: "architect@example.com",
          firstName: "Jane",
          lastName: "Architect"
        },
        members: [
          {
            role: "STRUCTURAL_ENGINEER",
            joinedAt: new Date("2023-04-25"),
            user: {
              id: "user-4",
              email: "engineer@example.com",
              firstName: "Mike",
              lastName: "Engineer",
              avatar: null
            }
          }
        ],
        phases: [
          {
            id: "phase-4",
            name: "Concept Design",
            phase: "CONCEPT",
            status: "COMPLETED",
            startDate: new Date("2023-05-20"),
            endDate: new Date("2023-07-30")
          },
          {
            id: "phase-5",
            name: "Schematic Design",
            phase: "SCHEMATIC_DESIGN",
            status: "IN_PROGRESS",
            startDate: new Date("2023-08-01"),
            endDate: null
          }
        ],
        files: [
          {
            id: "file-3",
            name: "Project Requirements.pdf",
            type: "DOCUMENT",
            uploadedAt: new Date("2023-04-20")
          }
        ],
        drawings: [
          {
            id: "drawing-3",
            title: "Site Plan",
            number: "A-001",
            type: "SITE_PLAN",
            status: "APPROVED",
            version: 1
          }
        ],
        models: [],
        _count: {
          files: 8,
          drawings: 12,
          models: 0,
          reviews: 3,
          issues: 7,
          comments: 25
        }
      }
    ];

    // Apply filtering to mock data
    let filteredProjects = [...mockProjects];

    // Apply owner/member filter for non-admin users
    if (filter.OR) {
      filteredProjects = filteredProjects.filter(p => 
        p.ownerId === session.user.id || 
        p.members.some(m => m.user.id === session.user.id)
      );
    }

    if (projectType) {
      filteredProjects = filteredProjects.filter(p => p.projectType === projectType);
    }

    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.clientName.toLowerCase().includes(searchLower) || 
        p.location.toLowerCase().includes(searchLower)
      );
    }

    // Sort mock data
    filteredProjects.sort((a: any, b: any) => {
      const aValue = (a as any)[sortBy] || '';
      const bValue = (b as any)[sortBy] || '';

      if (sortOrder === 'asc') {
        return aValue> bValue ? 1 : -1;
      } else {
        return aValue <bValue ? 1 : -1;
      }
    });

    // Paginate mock data
    const paginatedProjects = filteredProjects.slice(skip, skip + limit);
    const total = filteredProjects.length;

    // Add computed fields
    const enrichedProjects = paginatedProjects.map(project => {
      const currentPhase = project.phases.find(p => p.status === "IN_PROGRESS") || 
                        project.phases[project.phases.length - 1];

      const completedPhases = project.phases.filter(p => p.status === "COMPLETED").length;
      const totalPhases = project.phases.length;
      const progress = totalPhases> 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

      return {
        ...project,
        currentPhase,
        progress,
        teamSize: project.members.length};
    });

    return NextResponse.json({
      data: enrichedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)});
  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check authorization - only architects and admins can create projects
    if (!session.user.role || !["ARCHITECT", "ARCHITECT_USER", "ARCHITECT_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body: any = await request.json();

    // Validate input
    const validatedData = createProjectSchema.parse(body);

    // Mock project creation since there's no archProject model in Prisma yet
    const mockProject = {
      id: `project-${Date.now()}`,
      ...validatedData,
      status: "CONCEPT",
      ownerId: session.user.id,
      owner: {
        id: session.user.id || "user-1",
        email: session.user.email || "user@example.com",
        firstName: "First",
        lastName: "Last",
      startDate: new Date(validatedData.startDate),
      targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create initial project phases (mocked)
    await createInitialPhases(mockProject.id, mockProject.projectType);

    return NextResponse.json({
      data: mockProject,
      message: "Project created successfully", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update a project
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: any = await request.json();

    // Validate input
    const validatedData = updateProjectSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Mock project update
    return NextResponse.json({
      data: {
        id,
        ...updateData,
        updatedAt: new Date()
      },
      message: "Project updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check project ID
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Mock project deletion
    return NextResponse.json({
      message: "Project deleted successfully");
  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}