import { NextRequest, NextResponse } from 'next/server';
import { rosieIntegrationService } from '@/services/ROSIeIntegrationService';

interface HTBStatus {
  userId: string;
  active: boolean;
  eligible: boolean;
  claimCode?: string;
  status: string;
  nextAction?: string;
  pendingCompletion: boolean;
  lastKnownStatus?: string;
  applicationDate?: Date;
  approvalDate?: Date;
  claimAmount?: number;
  propertyId?: string;
  rosiReference?: string;
  completionCertificate?: string;
  timeline: HTBTimelineEvent[];
  requirements: HTBRequirement[];
}

interface HTBTimelineEvent {
  id: string;
  date: Date;
  event: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  documents?: string[];
}

interface HTBRequirement {
  id: string;
  requirement: string;
  status: 'completed' | 'pending' | 'not_applicable';
  description: string;
  dueDate?: Date;
}

// In-memory storage for demo (replace with database in production)
const htbStatuses: Map<string, HTBStatus> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get stored status or create default
    let htbStatus = htbStatuses.get(userId);
    
    if (!htbStatus) {
      htbStatus = createDefaultHTBStatus(userId);
      htbStatuses.set(userId, htbStatus);
    }

    // If user has active claim, sync with ROS.ie
    if (htbStatus.claimCode) {
      try {
        const rosieUpdate = await rosieIntegrationService.getHTBClaimStatus(htbStatus.claimCode);
        
        // Update status from ROS.ie
        htbStatus.status = mapROSIeStatus(rosieUpdate.status);
        htbStatus.rosiReference = rosieUpdate.rosiReference;
        htbStatus.nextAction = determineNextAction(htbStatus.status);
        htbStatus.pendingCompletion = rosieUpdate.completionDate ? false : htbStatus.pendingCompletion;
        
        if (rosieUpdate.completionCertificate) {
          htbStatus.completionCertificate = rosieUpdate.completionCertificate;
        }

        // Update timeline if status changed
        updateTimeline(htbStatus, rosieUpdate);
        
        htbStatuses.set(userId, htbStatus);
      } catch (error) {
        console.warn('Could not sync with ROS.ie:', error);
      }
    }

    return NextResponse.json(htbStatus);
  } catch (error) {
    console.error('Error fetching HTB status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch HTB status' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const updates = await request.json();
    
    let htbStatus = htbStatuses.get(userId);
    if (!htbStatus) {
      htbStatus = createDefaultHTBStatus(userId);
    }

    // Update fields
    Object.assign(htbStatus, updates);
    
    htbStatuses.set(userId, htbStatus);

    return NextResponse.json(htbStatus);
  } catch (error) {
    console.error('Error updating HTB status:', error);
    return NextResponse.json(
      { error: 'Failed to update HTB status' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    
    // Create new HTB application
    const htbStatus: HTBStatus = {
      userId,
      active: true,
      eligible: true,
      claimCode: body.claimCode,
      status: 'Application Submitted',
      nextAction: 'Awaiting Revenue Review',
      pendingCompletion: false,
      applicationDate: new Date(),
      claimAmount: body.claimAmount,
      propertyId: body.propertyId,
      timeline: [
        {
          id: 'timeline-1',
          date: new Date(),
          event: 'Application Submitted',
          description: 'HTB application submitted to Revenue Commissioners',
          status: 'completed'
        }
      ],
      requirements: createDefaultRequirements()
    };

    htbStatuses.set(userId, htbStatus);

    return NextResponse.json(htbStatus, { status: 201 });
  } catch (error) {
    console.error('Error creating HTB application:', error);
    return NextResponse.json(
      { error: 'Failed to create HTB application' },
      { status: 500 }
    );
  }
}

function createDefaultHTBStatus(userId: string): HTBStatus {
  // Check if user is eligible (for demo purposes)
  const isEligible = userId.includes('buyer') || userId.includes('first-time');
  
  return {
    userId,
    active: false,
    eligible: isEligible,
    status: isEligible ? 'Eligible' : 'Not Eligible',
    nextAction: isEligible ? 'Submit Application' : undefined,
    pendingCompletion: false,
    timeline: [],
    requirements: isEligible ? createDefaultRequirements() : []
  };
}

function createDefaultRequirements(): HTBRequirement[] {
  return [
    {
      id: 'req-1',
      requirement: 'First-time buyer verification',
      status: 'completed',
      description: 'Confirm you are a first-time buyer'
    },
    {
      id: 'req-2',
      requirement: 'Income verification',
      status: 'pending',
      description: 'Provide proof of income for the last 12 months'
    },
    {
      id: 'req-3',
      requirement: 'Property purchase agreement',
      status: 'pending',
      description: 'Submit signed purchase agreement'
    },
    {
      id: 'req-4',
      requirement: 'Mortgage approval',
      status: 'pending',
      description: 'Obtain mortgage approval in principle'
    }
  ];
}

function mapROSIeStatus(rosieStatus: string): string {
  const statusMap: { [key: string]: string } = {
    'submitted': 'Application Submitted',
    'under_review': 'Under Review',
    'approved': 'Approved',
    'claim_code_issued': 'Claim Code Issued',
    'funds_requested': 'Funds Requested',
    'funds_released': 'Funds Released',
    'completed': 'Completed',
    'rejected': 'Rejected'
  };

  return statusMap[rosieStatus] || rosieStatus;
}

function determineNextAction(status: string): string {
  const actionMap: { [key: string]: string } = {
    'Application Submitted': 'Awaiting Revenue Review',
    'Under Review': 'Revenue processing application',
    'Approved': 'Apply for claim code with solicitor',
    'Claim Code Issued': 'Submit claim code to developer',
    'Funds Requested': 'Awaiting fund release',
    'Funds Released': 'Complete property purchase',
    'Completed': 'HTB process complete',
    'Rejected': 'Review rejection reasons'
  };

  return actionMap[status] || 'Contact support for guidance';
}

function updateTimeline(htbStatus: HTBStatus, rosieUpdate: any): void {
  const timelineMap: { [key: string]: string } = {
    'under_review': 'Application Under Review',
    'approved': 'Application Approved',
    'claim_code_issued': 'Claim Code Issued',
    'funds_requested': 'Funds Requested from Revenue',
    'funds_released': 'Funds Released',
    'completed': 'HTB Process Completed'
  };

  const eventName = timelineMap[rosieUpdate.status];
  if (eventName && !htbStatus.timeline.find(t => t.event === eventName)) {
    htbStatus.timeline.push({
      id: `timeline-${Date.now()}`,
      date: new Date(),
      event: eventName,
      description: `Status updated via ROS.ie integration`,
      status: 'completed'
    });

    // Sort timeline by date
    htbStatus.timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

// Initialize with demo data for development
if (process.env.NODE_ENV === 'development') {
  htbStatuses.set('buyer-001', {
    userId: 'buyer-001',
    active: true,
    eligible: true,
    claimCode: 'HTB2024001234',
    status: 'Approved',
    nextAction: 'Apply for claim code with solicitor',
    pendingCompletion: false,
    lastKnownStatus: 'approved',
    applicationDate: new Date('2024-01-15'),
    approvalDate: new Date('2024-02-01'),
    claimAmount: 30000,
    propertyId: 'prop-fitzgerald-unit-12',
    rosiReference: 'ROS-HTB-2024-001234',
    timeline: [
      {
        id: 'timeline-1',
        date: new Date('2024-01-15'),
        event: 'Application Submitted',
        description: 'HTB application submitted to Revenue Commissioners',
        status: 'completed'
      },
      {
        id: 'timeline-2',
        date: new Date('2024-01-20'),
        event: 'Application Under Review',
        description: 'Revenue Commissioners reviewing application',
        status: 'completed'
      },
      {
        id: 'timeline-3',
        date: new Date('2024-02-01'),
        event: 'Application Approved',
        description: 'HTB application approved - €30,000 granted',
        status: 'completed'
      },
      {
        id: 'timeline-4',
        date: new Date('2024-06-15'),
        event: 'Claim Code Application',
        description: 'Apply for claim code with solicitor',
        status: 'current'
      }
    ],
    requirements: [
      {
        id: 'req-1',
        requirement: 'First-time buyer verification',
        status: 'completed',
        description: 'Confirmed as first-time buyer'
      },
      {
        id: 'req-2',
        requirement: 'Income verification',
        status: 'completed',
        description: 'Income documentation verified'
      },
      {
        id: 'req-3',
        requirement: 'Property purchase agreement',
        status: 'completed',
        description: 'Purchase agreement for Fitzgerald Gardens submitted'
      },
      {
        id: 'req-4',
        requirement: 'Mortgage approval',
        status: 'completed',
        description: 'Mortgage approved - €270,000'
      }
    ]
  });
}