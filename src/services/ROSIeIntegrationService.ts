interface ROSIeHTBClaim {
  claimCode: string;
  propertyId: string;
  buyerId: string;
  developerId: string;
  htbAmount: number;
  status: HTBClaimStatus;
  submittedDate: Date;
  completionDate?: Date;
  rosiReference: string;
  completionCertificate?: string;
}

interface ROSIeCompletionData {
  propertyId: string;
  completionDate: Date;
  completionCertificate: string;
  htbClaimsProcessed: ROSIeHTBClaim[];
  stakeholderNotifications: {
    buyerNotified: boolean;
    developerNotified: boolean;
    agentNotified: boolean;
    solicitorNotified: boolean;
  };
}

interface ROSIeIntegrationConfig {
  apiEndpoint: string;
  clientId: string;
  clientSecret: string;
  environment: 'production' | 'staging' | 'development';
}

class ROSIeIntegrationService {
  private config: ROSIeIntegrationConfig;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(config: ROSIeIntegrationConfig) {
    this.config = config;
  }

  async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error(`ROS.ie authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    } catch (error) {
      console.error('ROS.ie authentication error:', error);
      throw new Error('Failed to authenticate with ROS.ie');
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      await this.authenticate();
    }
  }

  async submitHTBClaimCode(claimCode: string, propertyId: string, developerId: string): Promise<ROSIeHTBClaim> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(`${this.config.apiEndpoint}/htb/claims/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim_code: claimCode,
          property_id: propertyId,
          developer_id: developerId
        })
      });

      if (!response.ok) {
        throw new Error(`HTB claim submission failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        claimCode: data.claim_code,
        propertyId: data.property_id,
        buyerId: data.buyer_id,
        developerId: data.developer_id,
        htbAmount: data.htb_amount,
        status: this.mapROSIeStatusToLocal(data.status),
        submittedDate: new Date(data.submitted_date),
        completionDate: data.completion_date ? new Date(data.completion_date) : undefined,
        rosiReference: data.rosi_reference,
        completionCertificate: data.completion_certificate
      };
    } catch (error) {
      console.error('HTB claim submission error:', error);
      throw new Error('Failed to submit HTB claim to ROS.ie');
    }
  }

  async getHTBClaimStatus(claimCode: string): Promise<ROSIeHTBClaim> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(`${this.config.apiEndpoint}/htb/claims/${claimCode}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTB claim status fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        claimCode: data.claim_code,
        propertyId: data.property_id,
        buyerId: data.buyer_id,
        developerId: data.developer_id,
        htbAmount: data.htb_amount,
        status: this.mapROSIeStatusToLocal(data.status),
        submittedDate: new Date(data.submitted_date),
        completionDate: data.completion_date ? new Date(data.completion_date) : undefined,
        rosiReference: data.rosi_reference,
        completionCertificate: data.completion_certificate
      };
    } catch (error) {
      console.error('HTB claim status fetch error:', error);
      throw new Error('Failed to fetch HTB claim status from ROS.ie');
    }
  }

  async getCompletionData(propertyId: string): Promise<ROSIeCompletionData | null> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(`${this.config.apiEndpoint}/properties/${propertyId}/completion`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (response.status === 404) {
        return null; // Property completion not found
      }

      if (!response.ok) {
        throw new Error(`Property completion data fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        propertyId: data.property_id,
        completionDate: new Date(data.completion_date),
        completionCertificate: data.completion_certificate,
        htbClaimsProcessed: data.htb_claims_processed.map((claim: any) => ({
          claimCode: claim.claim_code,
          propertyId: claim.property_id,
          buyerId: claim.buyer_id,
          developerId: claim.developer_id,
          htbAmount: claim.htb_amount,
          status: this.mapROSIeStatusToLocal(claim.status),
          submittedDate: new Date(claim.submitted_date),
          completionDate: claim.completion_date ? new Date(claim.completion_date) : undefined,
          rosiReference: claim.rosi_reference,
          completionCertificate: claim.completion_certificate
        })),
        stakeholderNotifications: data.stakeholder_notifications
      };
    } catch (error) {
      console.error('Property completion data fetch error:', error);
      throw new Error('Failed to fetch property completion data from ROS.ie');
    }
  }

  async processCompletionStatement(propertyId: string): Promise<void> {
    const completionData = await this.getCompletionData(propertyId);
    
    if (!completionData) {
      throw new Error(`No completion data found for property ${propertyId}`);
    }

    // Update local database with completion information
    await this.updateLocalCompletionRecords(completionData);

    // Notify relevant stakeholders
    await this.notifyStakeholders(completionData);
  }

  private async updateLocalCompletionRecords(completionData: ROSIeCompletionData): Promise<void> {
    // Update property completion status
    await fetch('/api/properties/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: completionData.propertyId,
        completionDate: completionData.completionDate,
        completionCertificate: completionData.completionCertificate,
        source: 'ROS.ie'
      })
    });

    // Update HTB claims status
    for (const claim of completionData.htbClaimsProcessed) {
      await fetch('/api/htb/claims/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimCode: claim.claimCode,
          status: claim.status,
          completionDate: claim.completionDate,
          rosiReference: claim.rosiReference,
          completionCertificate: claim.completionCertificate
        })
      });
    }
  }

  private async notifyStakeholders(completionData: ROSIeCompletionData): Promise<void> {
    const notifications = [];

    if (completionData.stakeholderNotifications.buyerNotified) {
      notifications.push(this.sendBuyerCompletionNotification(completionData));
    }

    if (completionData.stakeholderNotifications.developerNotified) {
      notifications.push(this.sendDeveloperCompletionNotification(completionData));
    }

    if (completionData.stakeholderNotifications.agentNotified) {
      notifications.push(this.sendAgentCompletionNotification(completionData));
    }

    if (completionData.stakeholderNotifications.solicitorNotified) {
      notifications.push(this.sendSolicitorCompletionNotification(completionData));
    }

    await Promise.all(notifications);
  }

  private async sendBuyerCompletionNotification(completionData: ROSIeCompletionData): Promise<void> {
    await fetch('/api/notifications/buyer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'PROPERTY_COMPLETION',
        propertyId: completionData.propertyId,
        completionDate: completionData.completionDate,
        htbClaimsProcessed: completionData.htbClaimsProcessed.length,
        message: 'Your property completion has been processed through ROS.ie'
      })
    });
  }

  private async sendDeveloperCompletionNotification(completionData: ROSIeCompletionData): Promise<void> {
    await fetch('/api/notifications/developer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'COMPLETION_PROCESSED',
        propertyId: completionData.propertyId,
        completionDate: completionData.completionDate,
        htbAmount: completionData.htbClaimsProcessed.reduce((sum, claim) => sum + claim.htbAmount, 0),
        message: 'Property completion and HTB claims processed via ROS.ie'
      })
    });
  }

  private async sendAgentCompletionNotification(completionData: ROSIeCompletionData): Promise<void> {
    await fetch('/api/notifications/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'COMPLETION_UPDATE',
        propertyId: completionData.propertyId,
        completionDate: completionData.completionDate,
        message: 'Property completion processed - commission calculations updated'
      })
    });
  }

  private async sendSolicitorCompletionNotification(completionData: ROSIeCompletionData): Promise<void> {
    await fetch('/api/notifications/solicitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'COMPLETION_CERTIFICATE',
        propertyId: completionData.propertyId,
        completionDate: completionData.completionDate,
        completionCertificate: completionData.completionCertificate,
        message: 'Completion certificate available from ROS.ie'
      })
    });
  }

  private mapROSIeStatusToLocal(rosieStatus: string): HTBClaimStatus {
    const statusMap: { [key: string]: HTBClaimStatus } = {
      'submitted': 'ACCESS_CODE_SUBMITTED',
      'processing': 'DEVELOPER_PROCESSING',
      'claim_code_issued': 'CLAIM_CODE_RECEIVED',
      'funds_requested': 'FUNDS_REQUESTED',
      'funds_released': 'FUNDS_RECEIVED',
      'deposit_applied': 'DEPOSIT_APPLIED',
      'completed': 'COMPLETED',
      'rejected': 'REJECTED'
    };

    return statusMap[rosieStatus] || 'INITIATED';
  }

  async syncAllHTBClaims(developerId: string): Promise<void> {
    await this.ensureAuthenticated();

    try {
      const response = await fetch(`${this.config.apiEndpoint}/htb/claims/developer/${developerId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTB claims sync failed: ${response.statusText}`);
      }

      const claims = await response.json();
      
      for (const claim of claims) {
        await this.updateLocalCompletionRecords({
          propertyId: claim.property_id,
          completionDate: claim.completion_date ? new Date(claim.completion_date) : new Date(),
          completionCertificate: claim.completion_certificate || '',
          htbClaimsProcessed: [claim],
          stakeholderNotifications: {
            buyerNotified: true,
            developerNotified: true,
            agentNotified: true,
            solicitorNotified: true
          }
        });
      }
    } catch (error) {
      console.error('HTB claims sync error:', error);
      throw new Error('Failed to sync HTB claims from ROS.ie');
    }
  }
}

// HTB Claim Status enum (matching existing types)
enum HTBClaimStatus {
  INITIATED = 'INITIATED',
  ACCESS_CODE_RECEIVED = 'ACCESS_CODE_RECEIVED',
  ACCESS_CODE_SUBMITTED = 'ACCESS_CODE_SUBMITTED',
  DEVELOPER_PROCESSING = 'DEVELOPER_PROCESSING',
  CLAIM_CODE_RECEIVED = 'CLAIM_CODE_RECEIVED',
  FUNDS_REQUESTED = 'FUNDS_REQUESTED',
  FUNDS_RECEIVED = 'FUNDS_RECEIVED',
  DEPOSIT_APPLIED = 'DEPOSIT_APPLIED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

// Singleton instance for the service
const rosieIntegrationService = new ROSIeIntegrationService({
  apiEndpoint: process.env.ROSIE_API_ENDPOINT || 'https://api.ros.ie',
  clientId: process.env.ROSIE_CLIENT_ID || '',
  clientSecret: process.env.ROSIE_CLIENT_SECRET || '',
  environment: (process.env.NODE_ENV as 'production' | 'staging' | 'development') || 'development'
});

export { ROSIeIntegrationService, rosieIntegrationService };
export type { ROSIeHTBClaim, ROSIeCompletionData, ROSIeIntegrationConfig };