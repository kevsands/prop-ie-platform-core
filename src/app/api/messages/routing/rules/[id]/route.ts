// API for individual routing rule operations
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/messages/routing/rules/[id] - Update routing rule
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ruleId = params.id;
    const body = await request.json();

    console.log(`[Routing Rules] Updating rule ${ruleId}:`, body);

    // In production, update in database
    // const updatedRule = await prisma.routingRule.update({
    //   where: { id: ruleId },
    //   data: {
    //     ...body,
    //     updatedAt: new Date()
    //   }
    // });

    // Mock successful update
    const mockUpdatedRule = {
      id: ruleId,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      rule: mockUpdatedRule,
      message: `Routing rule updated successfully`
    });

  } catch (error: any) {
    console.error('Update routing rule error:', error);
    return NextResponse.json(
      { error: 'Failed to update routing rule' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/routing/rules/[id] - Delete routing rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ruleId = params.id;

    console.log(`[Routing Rules] Deleting rule ${ruleId}`);

    // In production, delete from database
    // await prisma.routingRule.delete({
    //   where: { id: ruleId }
    // });

    return NextResponse.json({
      success: true,
      message: `Routing rule deleted successfully`
    });

  } catch (error: any) {
    console.error('Delete routing rule error:', error);
    return NextResponse.json(
      { error: 'Failed to delete routing rule' },
      { status: 500 }
    );
  }
}

// GET /api/messages/routing/rules/[id] - Get single routing rule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ruleId = params.id;

    console.log(`[Routing Rules] Fetching rule ${ruleId}`);

    // In production, fetch from database
    // const rule = await prisma.routingRule.findUnique({
    //   where: { id: ruleId }
    // });

    // Mock rule data
    const mockRule = {
      id: ruleId,
      name: 'Sample Rule',
      description: 'Sample routing rule',
      isActive: true,
      priority: 5,
      conditions: [],
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggerCount: 0,
      successRate: 0,
      createdBy: 'current_user'
    };

    return NextResponse.json({
      success: true,
      rule: mockRule
    });

  } catch (error: any) {
    console.error('Get routing rule error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routing rule' },
      { status: 500 }
    );
  }
}