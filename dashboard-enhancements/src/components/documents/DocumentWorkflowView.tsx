'use client';

import React, { useState } from 'react';
import { Document as DocumentType, DocumentWorkflowStage as BaseDocumentWorkflowStage } from '@/types/document';
import { 
  DocumentWorkflowInstance, 
  DocumentWorkflowHistory, 
  DocumentApproval, 
  DocumentWorkflow,
  DocumentWorkflowStage as CoreDocumentWorkflowStage,
  ApproverConfig
} from '@/types/core/document';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { documentService } from '@/services/documentService';
import { format } from 'date-fns';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  User,
  AlertCircle,
  MessageSquare,
  CheckSquare,
  XSquare
} from 'lucide-react';

interface DocumentWorkflowViewProps {
  document: DocumentType;
  workflowInstance: DocumentWorkflowInstance | DocumentWorkflow;
}

const DocumentWorkflowView: React.FC<DocumentWorkflowViewProps> = ({
  document,
  workflowInstance
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Format date for display
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'PPP');
  };

  // Check if the workflow instance is a DocumentWorkflowInstance
  const isWorkflowInstance = (workflow: DocumentWorkflowInstance | DocumentWorkflow): workflow is DocumentWorkflowInstance => {
    return 'history' in workflow && 'customFieldValues' in workflow;
  };

  // Handle approval
  const handleApprove = async () => {
    if (!document.id || !isWorkflowInstance(workflowInstance) || !workflowInstance.id) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await documentService.approveWorkflowStage(
        document.id,
        workflowInstance.id,
        notes
      );
      
      if (result.success) {
        setSuccess('Document stage approved successfully');
        setNotes('');
      } else {
        setError(result.message || 'Failed to approve document stage');
      }
    } catch (err) {
      console.error('Error approving document stage:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!document.id || !isWorkflowInstance(workflowInstance) || !workflowInstance.id) return;
    if (!notes.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await documentService.rejectWorkflowStage(
        document.id,
        workflowInstance.id,
        notes
      );
      
      if (result.success) {
        setSuccess('Document stage rejected successfully');
        setNotes('');
      } else {
        setError(result.message || 'Failed to reject document stage');
      }
    } catch (err) {
      console.error('Error rejecting document stage:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can approve/reject
  const canApprove = () => {
    // In a real implementation, this would check if the current user
    // is an approver for the current stage
    return true;
  };

  // Get workflow status
  const getWorkflowStatus = () => {
    if (isWorkflowInstance(workflowInstance)) {
      return workflowInstance.status;
    }
    return 'in_progress';
  };

  // Get current stage
  const getCurrentStage = () => {
    if (isWorkflowInstance(workflowInstance)) {
      return workflowInstance.currentStage;
    }
    return workflowInstance.stages[0];
  };

  // Get workflow history
  const getWorkflowHistory = () => {
    if (isWorkflowInstance(workflowInstance)) {
      return workflowInstance.history;
    }
    return [];
  };

  // Get workflow name and description
  const getWorkflowName = () => {
    if (isWorkflowInstance(workflowInstance)) {
      return workflowInstance.workflow.name;
    }
    return workflowInstance.name;
  };

  const getWorkflowDescription = () => {
    if (isWorkflowInstance(workflowInstance)) {
      return workflowInstance.workflow.description;
    }
    return workflowInstance.description;
  };

  // Get workflow stages
  const getWorkflowStages = () => {
    if (isWorkflowInstance(workflowInstance)) {
      return workflowInstance.workflow.stages;
    }
    return workflowInstance.stages;
  };

  // Helper function to get approver display name
  const getApproverDisplayName = (approver: ApproverConfig | string) => {
    if (typeof approver === 'string') {
      return `Approver ${approver}`;
    }
    return approver.approverName || `Approver ${approver.approverId}`;
  };

  return (
    <div className="space-y-6">
      {/* Workflow Overview */}
      <div>
        <h3 className="text-sm font-medium mb-3">Workflow Status</h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-medium">{getWorkflowName()}</p>
                <p className="text-sm text-muted-foreground">{getWorkflowDescription()}</p>
              </div>
              <Badge 
                className={`mt-2 sm:mt-0 ${
                  getWorkflowStatus() === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : getWorkflowStatus() === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {getWorkflowStatus() === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {getWorkflowStatus() === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                {getWorkflowStatus() === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                {getWorkflowStatus().charAt(0).toUpperCase() + getWorkflowStatus().slice(1).replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Started</p>
                <p>{isWorkflowInstance(workflowInstance) ? formatDate(workflowInstance.startDate) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Stage</p>
                <p>{getCurrentStage()?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p>{isWorkflowInstance(workflowInstance) && workflowInstance.dueDate ? formatDate(workflowInstance.dueDate) : 'No deadline'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Workflow Stages */}
      <div>
        <h3 className="text-sm font-medium mb-3">Workflow Progress</h3>
        <div className="space-y-2">
          {getWorkflowStages().map((stage: BaseDocumentWorkflowStage | CoreDocumentWorkflowStage, index: number) => {
            // Find stage in history
            const historyEntry = isWorkflowInstance(workflowInstance) 
              ? workflowInstance.history.find(h => h.stage.id === stage.id)
              : null;
            const isCurrentStage = getCurrentStage()?.id === stage.id;
            const isPastStage = historyEntry && historyEntry.exitDate;
            const isFutureStage = !historyEntry && !isCurrentStage;
            
            return (
              <Card 
                key={stage.id}
                className={`${isCurrentStage ? 'border-blue-300 shadow-sm' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {isPastStage && historyEntry?.status === 'approved' && (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                      {isPastStage && historyEntry?.status === 'rejected' && (
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                      )}
                      {isCurrentStage && (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      {isFutureStage && (
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-base font-medium">{stage.name}</h4>
                        <div className="mt-1 sm:mt-0">
                          {isPastStage && (
                            <Badge 
                              className={historyEntry?.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : historyEntry?.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : historyEntry?.status === 'skipped'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {historyEntry?.status.charAt(0).toUpperCase() + historyEntry?.status.slice(1)}
                            </Badge>
                          )}
                          {isCurrentStage && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Current Stage
                            </Badge>
                          )}
                          {isFutureStage && (
                            <Badge variant="outline" className="text-gray-500">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                      
                      {/* Approvers */}
                      {(isCurrentStage || isPastStage) && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">Approvers:</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {stage.approvers.map((approver: ApproverConfig | string) => (
                              <Badge 
                                key={typeof approver === 'string' ? approver : approver.approverId} 
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <User className="h-3 w-3" />
                                {getApproverDisplayName(approver)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Approval Actions */}
      {isWorkflowInstance(workflowInstance) && canApprove() && (
        <div>
          <h3 className="text-sm font-medium mb-3">Actions</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="Add notes (required for rejection)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
                
                {error && (
                  <div className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="text-sm text-green-600 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-1" />
                    {success}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentWorkflowView;