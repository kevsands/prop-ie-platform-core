"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ProjectDashboard,
  DrawingManager,
  TaskBoard,
  ModelViewer,
  CommentThread
} from '@/components/collaboration';

export default function CollaborationDemoPage() {
  const demoProjectId = 'demo-project-123';
  const currentUserId = 'current-user-123';
  const currentUserName = 'Demo User';

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Collaboration Tools Demo</h1>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="drawings">Drawings</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="3d-model">3D Model</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProjectDashboard projectId={demoProjectId} />
        </TabsContent>

        <TabsContent value="drawings">
          <DrawingManager projectId={demoProjectId} />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskBoard projectId={demoProjectId} />
        </TabsContent>

        <TabsContent value="3d-model">
          <ModelViewer projectId={demoProjectId} />
        </TabsContent>

        <TabsContent value="comments">
          <div className="max-w-4xl mx-auto">
            <CommentThread
              resourceType="project"
              resourceId={demoProjectId}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}