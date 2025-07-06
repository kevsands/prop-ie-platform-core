import { NextRequest, NextResponse } from 'next/server';

/**
 * FitzgeraldGardens project overview data endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Mock data for demonstration purposes
    const projectData = {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      location: 'Drogheda, Co. Louth',
      status: 'In Progress',
      description: 'Luxury residential development with 45 units',
      features: [
        'Energy-efficient design',
        'Community garden spaces',
        'Close to schools and amenities',
        'High-quality finishes'
      ],
      timeline: {
        startDate: '2022-06-15',
        targetCompletionDate: '2023-12-31',
        currentPhase: 'Construction',
        percentComplete: 68
      },
      units: {
        total: 45,
        available: 13,
        reserved: 5,
        sold: 27
      }
    };

    return NextResponse.json(projectData);
  } catch (error) {
    console.error('Error fetching project data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project data' },
      { status: 500 }
    );
  }
}