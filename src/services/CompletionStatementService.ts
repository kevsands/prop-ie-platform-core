import { rosieIntegrationService } from './ROSIeIntegrationService';

interface CompletionStatement {
  id: string;
  propertyId: string;
  buyerId: string;
  developerId: string;
  agentId?: string;
  solicitorId?: string;
  completionDate: Date;
  totalPurchasePrice: number;
  depositPaid: number;
  mortgageAmount: number;
  htbAmount: number;
  balanceDue: number;
  legalFees: number;
  stampDuty: number;
  otherCosts: number;
  htbClaims: Array<{
    claimCode: string;
    amount: number;
    status: string;
    rosiReference?: string;
  }>;
  completionCertificate?: string;
  status: 'DRAFT' | 'SUBMITTED_TO_ROS' | 'PROCESSED' | 'COMPLETED';
  stakeholdersNotified: {
    buyer: boolean;
    developer: boolean;
    agent: boolean;
    solicitor: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface StakeholderNotification {
  type: 'EMAIL' | 'SMS' | 'PORTAL';
  recipient: string;
  subject: string;
  message: string;
  completionData: CompletionStatement;
}

class CompletionStatementService {
  async createCompletionStatement(data: {
    propertyId: string;
    buyerId: string;
    developerId: string;
    agentId?: string;
    solicitorId?: string;
    totalPurchasePrice: number;
    depositPaid: number;
    mortgageAmount: number;
    htbAmount: number;
    legalFees: number;
    stampDuty: number;
    otherCosts: number;
    htbClaimCodes: string[];
  }): Promise<CompletionStatement> {
    const balanceDue = data.totalPurchasePrice - data.depositPaid - data.mortgageAmount - data.htbAmount;

    const completionStatement: CompletionStatement = {
      id: `CS-${Date.now()}`,
      propertyId: data.propertyId,
      buyerId: data.buyerId,
      developerId: data.developerId,
      agentId: data.agentId,
      solicitorId: data.solicitorId,
      completionDate: new Date(),
      totalPurchasePrice: data.totalPurchasePrice,
      depositPaid: data.depositPaid,
      mortgageAmount: data.mortgageAmount,
      htbAmount: data.htbAmount,
      balanceDue,
      legalFees: data.legalFees,
      stampDuty: data.stampDuty,
      otherCosts: data.otherCosts,
      htbClaims: data.htbClaimCodes.map(code => ({
        claimCode: code,
        amount: data.htbAmount / data.htbClaimCodes.length,
        status: 'PENDING_SUBMISSION'
      })),
      status: 'DRAFT',
      stakeholdersNotified: {
        buyer: false,
        developer: false,
        agent: false,
        solicitor: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    await this.saveCompletionStatement(completionStatement);

    return completionStatement;
  }

  async submitToROSIe(completionStatementId: string): Promise<CompletionStatement> {
    const statement = await this.getCompletionStatement(completionStatementId);
    
    if (!statement) {
      throw new Error('Completion statement not found');
    }

    try {
      // Process each HTB claim through ROS.ie
      const processedClaims = [];
      
      for (const claim of statement.htbClaims) {
        try {
          const rosieResponse = await rosieIntegrationService.submitHTBClaimCode(
            claim.claimCode,
            statement.propertyId,
            statement.developerId
          );

          processedClaims.push({
            ...claim,
            status: 'SUBMITTED_TO_ROS',
            rosiReference: rosieResponse.rosiReference
          });
        } catch (error) {
          console.error(`Failed to submit HTB claim ${claim.claimCode} to ROS.ie:`, error);
          processedClaims.push({
            ...claim,
            status: 'SUBMISSION_FAILED'
          });
        }
      }

      // Update completion statement
      const updatedStatement: CompletionStatement = {
        ...statement,
        htbClaims: processedClaims,
        status: 'SUBMITTED_TO_ROS',
        updatedAt: new Date()
      };

      await this.saveCompletionStatement(updatedStatement);

      // Start monitoring for completion updates from ROS.ie
      this.monitorROSIeUpdates(updatedStatement);

      return updatedStatement;
    } catch (error) {
      console.error('Failed to submit completion statement to ROS.ie:', error);
      throw new Error('ROS.ie submission failed');
    }
  }

  private async monitorROSIeUpdates(statement: CompletionStatement): Promise<void> {
    // Monitor ROS.ie for completion updates
    setTimeout(async () => {
      try {
        const completionData = await rosieIntegrationService.getCompletionData(statement.propertyId);
        
        if (completionData) {
          await this.processROSIeCompletion(statement, completionData);
        } else {
          // Continue monitoring if no completion data yet
          this.monitorROSIeUpdates(statement);
        }
      } catch (error) {
        console.error('Error monitoring ROS.ie updates:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  private async processROSIeCompletion(
    statement: CompletionStatement,
    rosieData: any
  ): Promise<void> {
    // Update completion statement with ROS.ie data
    const updatedStatement: CompletionStatement = {
      ...statement,
      status: 'PROCESSED',
      completionCertificate: rosieData.completionCertificate,
      htbClaims: statement.htbClaims.map(claim => {
        const rosieMatch = rosieData.htbClaimsProcessed.find(
          (rosieClaim: any) => rosieClaim.claimCode === claim.claimCode
        );
        
        if (rosieMatch) {
          return {
            ...claim,
            status: 'COMPLETED',
            rosiReference: rosieMatch.rosiReference
          };
        }
        
        return claim;
      }),
      updatedAt: new Date()
    };

    await this.saveCompletionStatement(updatedStatement);

    // Notify all stakeholders
    await this.notifyStakeholders(updatedStatement);

    // Mark as completed
    await this.finalizeCompletion(updatedStatement);
  }

  private async notifyStakeholders(statement: CompletionStatement): Promise<void> {
    const notifications: StakeholderNotification[] = [];

    // Notify buyer
    if (statement.buyerId) {
      notifications.push({
        type: 'EMAIL',
        recipient: statement.buyerId,
        subject: 'Property Completion Confirmed',
        message: `Your property completion has been processed. Completion certificate is available.`,
        completionData: statement
      });
    }

    // Notify developer
    notifications.push({
      type: 'EMAIL',
      recipient: statement.developerId,
      subject: 'Property Completion Processed',
      message: `Property completion for ${statement.propertyId} has been processed through ROS.ie. HTB claims totaling €${statement.htbAmount.toLocaleString()} have been released.`,
      completionData: statement
    });

    // Notify agent
    if (statement.agentId) {
      notifications.push({
        type: 'EMAIL',
        recipient: statement.agentId,
        subject: 'Commission Update - Property Completed',
        message: `Property completion processed. Your commission calculations have been updated.`,
        completionData: statement
      });
    }

    // Notify solicitor
    if (statement.solicitorId) {
      notifications.push({
        type: 'EMAIL',
        recipient: statement.solicitorId,
        subject: 'Completion Certificate Available',
        message: `Completion certificate for ${statement.propertyId} is now available from ROS.ie.`,
        completionData: statement
      });
    }

    // Send all notifications
    await Promise.all(notifications.map(notification => this.sendNotification(notification)));

    // Update notification status
    await this.updateNotificationStatus(statement.id, {
      buyer: !!statement.buyerId,
      developer: true,
      agent: !!statement.agentId,
      solicitor: !!statement.solicitorId
    });
  }

  private async sendNotification(notification: StakeholderNotification): Promise<void> {
    try {
      // Send notification via appropriate channel
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: notification.type,
          recipient: notification.recipient,
          subject: notification.subject,
          message: notification.message,
          metadata: {
            completionStatementId: notification.completionData.id,
            propertyId: notification.completionData.propertyId,
            completionDate: notification.completionData.completionDate
          }
        })
      });

      console.log(`Notification sent to ${notification.recipient}: ${notification.subject}`);
    } catch (error) {
      console.error(`Failed to send notification to ${notification.recipient}:`, error);
    }
  }

  private async finalizeCompletion(statement: CompletionStatement): Promise<void> {
    const finalStatement: CompletionStatement = {
      ...statement,
      status: 'COMPLETED',
      updatedAt: new Date()
    };

    await this.saveCompletionStatement(finalStatement);

    // Update related records
    await this.updateRelatedRecords(finalStatement);

    console.log(`Completion statement ${statement.id} finalized for property ${statement.propertyId}`);
  }

  private async updateRelatedRecords(statement: CompletionStatement): Promise<void> {
    // Update property status
    await fetch(`/api/properties/${statement.propertyId}/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completionDate: statement.completionDate,
        completionCertificate: statement.completionCertificate,
        htbAmount: statement.htbAmount,
        status: 'COMPLETED'
      })
    });

    // Update buyer records
    await fetch(`/api/buyers/${statement.buyerId}/transactions/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: statement.propertyId,
        completionDate: statement.completionDate,
        finalAmount: statement.totalPurchasePrice
      })
    });

    // Update developer sales records
    await fetch(`/api/developers/${statement.developerId}/sales/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: statement.propertyId,
        salePrice: statement.totalPurchasePrice,
        htbAmount: statement.htbAmount,
        completionDate: statement.completionDate
      })
    });

    // Update agent commission records if applicable
    if (statement.agentId) {
      await fetch(`/api/agents/${statement.agentId}/commissions/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: statement.propertyId,
          salePrice: statement.totalPurchasePrice,
          completionDate: statement.completionDate
        })
      });
    }
  }

  private async saveCompletionStatement(statement: CompletionStatement): Promise<void> {
    // Save to database
    await fetch('/api/completion-statements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statement)
    });
  }

  private async getCompletionStatement(id: string): Promise<CompletionStatement | null> {
    try {
      const response = await fetch(`/api/completion-statements/${id}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching completion statement:', error);
      return null;
    }
  }

  private async updateNotificationStatus(
    completionStatementId: string,
    notifications: CompletionStatement['stakeholdersNotified']
  ): Promise<void> {
    await fetch(`/api/completion-statements/${completionStatementId}/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stakeholdersNotified: notifications })
    });
  }

  async getCompletionStatements(filters: {
    developerId?: string;
    propertyId?: string;
    status?: CompletionStatement['status'];
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<CompletionStatement[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.developerId) queryParams.set('developerId', filters.developerId);
    if (filters.propertyId) queryParams.set('propertyId', filters.propertyId);
    if (filters.status) queryParams.set('status', filters.status);
    if (filters.dateFrom) queryParams.set('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) queryParams.set('dateTo', filters.dateTo.toISOString());

    try {
      const response = await fetch(`/api/completion-statements?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch completion statements');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching completion statements:', error);
      return [];
    }
  }

  async generateCompletionReport(completionStatementId: string): Promise<any> {
    const statement = await this.getCompletionStatement(completionStatementId);
    
    if (!statement) {
      throw new Error('Completion statement not found');
    }

    return {
      completionStatement: statement,
      rosieIntegration: {
        status: statement.status === 'COMPLETED' ? 'SUCCESS' : 'PENDING',
        claimsProcessed: statement.htbClaims.filter(claim => claim.status === 'COMPLETED').length,
        totalHTBAmount: statement.htbAmount,
        certificateUrl: statement.completionCertificate
      },
      stakeholderNotifications: statement.stakeholdersNotified,
      financialSummary: {
        totalPrice: statement.totalPurchasePrice,
        deposit: statement.depositPaid,
        mortgage: statement.mortgageAmount,
        htbContribution: statement.htbAmount,
        fees: statement.legalFees + statement.stampDuty + statement.otherCosts,
        balanceDue: statement.balanceDue
      }
    };
  }
}

// Singleton instance
const completionStatementService = new CompletionStatementService();

export { CompletionStatementService, completionStatementService };
export type { CompletionStatement, StakeholderNotification };