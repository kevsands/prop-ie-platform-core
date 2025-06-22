/**
 * Professional Role Assignment Service
 * 
 * Handles dynamic role assignment, verification, and management
 * Integrates with the professional role database schema
 */

import { Database } from 'sqlite3';
import { UserRole, Permission, ProfessionalPermissionService } from '@/lib/permissions/ProfessionalPermissionMatrix';
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';

export interface RoleAssignmentRequest {
  userId: string;
  roleType: UserRole;
  assignmentType: 'primary' | 'secondary';
  requestedBy: string;
  justification: string;
  requiredCertifications?: string[];
  experienceEvidence?: string[];
}

export interface RoleVerificationResult {
  eligible: boolean;
  score: number;
  missingRequirements: string[];
  recommendations: string[];
  autoApprove: boolean;
}

export interface RoleAssignment {
  id: string;
  userId: string;
  roleType: UserRole;
  assignmentType: 'primary' | 'secondary';
  isActive: boolean;
  eligibilityVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  eligibilityScore: number;
  missingRequirements: string[];
  activityStatus: 'active' | 'inactive' | 'suspended';
  lastActivityDate?: Date;
  totalProjects: number;
  successRate?: number;
  clientRating?: number;
  assignedDate: Date;
}

class RoleAssignmentService {
  private db: Database;

  constructor() {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/app/database/propie_production.db'
      : './database/propie_development.db';
    this.db = new Database(dbPath);
  }

  /**
   * Broadcast role assignment events in real-time
   */
  private broadcastRoleAssignmentEvent(
    eventType: 'role_requested' | 'role_approved' | 'role_rejected' | 'role_updated',
    data: any
  ): void {
    try {
      const notificationData = {
        notificationId: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId,
        type: 'role_assignment',
        title: this.getRoleEventTitle(eventType, data.roleType),
        message: this.getRoleEventMessage(eventType, data),
        priority: eventType === 'role_approved' ? 'high' : 'medium',
        timestamp: new Date().toISOString(),
        roleData: data
      };

      // Trigger server-side event
      realTimeServerManager.triggerEvent('role_assigned', data);

      // Broadcast to the specific user
      realTimeServerManager.broadcastToUsers([data.userId], 'notification', notificationData);

      // Broadcast to admins and managers for approval workflows
      if (eventType === 'role_requested') {
        realTimeServerManager.broadcastToRoles(
          ['ADMIN', 'PROJECT_MANAGER', 'DEVELOPMENT_PROJECT_MANAGER'],
          'notification',
          {
            ...notificationData,
            title: `Role Request: ${data.roleType}`,
            message: `${data.userDisplayName || data.userId} has requested ${data.roleType} role assignment`,
            actionRequired: true,
            approvalData: {
              assignmentId: data.assignmentId,
              requestedRole: data.roleType,
              userId: data.userId,
              justification: data.justification
            }
          }
        );
      }

      console.log(`📡 Broadcasted role assignment event: ${eventType} for ${data.userId} -> ${data.roleType}`);
    } catch (error) {
      console.error('Failed to broadcast role assignment event:', error);
    }
  }

  private getRoleEventTitle(eventType: string, roleType: string): string {
    const titles = {
      'role_requested': `Role Request: ${roleType}`,
      'role_approved': `Role Approved: ${roleType}`,
      'role_rejected': `Role Request Rejected: ${roleType}`,
      'role_updated': `Role Updated: ${roleType}`
    };
    return titles[eventType] || 'Role Assignment Update';
  }

  private getRoleEventMessage(eventType: string, data: any): string {
    const messages = {
      'role_requested': `Your request for ${data.roleType} role has been submitted for approval`,
      'role_approved': `Congratulations! Your ${data.roleType} role has been approved and activated`,
      'role_rejected': `Your request for ${data.roleType} role has been rejected. ${data.rejectionReason || ''}`,
      'role_updated': `Your ${data.roleType} role permissions have been updated`
    };
    return messages[eventType] || 'Your role assignment has been updated';
  }

  /**
   * Request a new role assignment for a user
   */
  async requestRoleAssignment(request: RoleAssignmentRequest): Promise<{
    assignmentId: string;
    verificationResult: RoleVerificationResult;
    needsApproval: boolean;
  }> {
    try {
      // First, verify user eligibility for the role
      const verificationResult = await this.verifyRoleEligibility(request.userId, request.roleType);
      
      // Create role assignment record
      const assignmentId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const query = `
        INSERT INTO professional_role_assignments (
          id, user_id, role_type, assignment_type, assigned_date,
          eligibility_verified, eligibility_score, missing_requirements,
          activity_status, is_active
        ) VALUES (?, ?, ?, ?, date('now'), ?, ?, ?, 'active', ?)
      `;
      
      await new Promise<void>((resolve, reject) => {
        this.db.run(query, [
          assignmentId,
          request.userId,
          request.roleType,
          request.assignmentType,
          verificationResult.autoApprove,
          verificationResult.score,
          JSON.stringify(verificationResult.missingRequirements),
          verificationResult.autoApprove
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // If auto-approved, activate immediately
      if (verificationResult.autoApprove) {
        await this.activateRoleAssignment(assignmentId, 'system');
        
        // Broadcast auto-approval
        this.broadcastRoleAssignmentEvent('role_approved', {
          assignmentId,
          userId: request.userId,
          roleType: request.roleType,
          autoApproved: true,
          verificationScore: verificationResult.score
        });
      } else {
        // Broadcast role request for manual approval
        this.broadcastRoleAssignmentEvent('role_requested', {
          assignmentId,
          userId: request.userId,
          roleType: request.roleType,
          justification: request.justification,
          verificationScore: verificationResult.score,
          missingRequirements: verificationResult.missingRequirements
        });
      }

      return {
        assignmentId,
        verificationResult,
        needsApproval: !verificationResult.autoApprove
      };

    } catch (error) {
      console.error('Role assignment request failed:', error);
      throw error;
    }
  }

  /**
   * Verify if a user is eligible for a specific role
   */
  async verifyRoleEligibility(userId: string, roleType: UserRole): Promise<RoleVerificationResult> {
    try {
      const user = await this.getUserProfile(userId);
      const certifications = await this.getUserCertifications(userId);
      const specializations = await this.getUserSpecializations(userId);
      
      let score = 0;
      const missingRequirements: string[] = [];
      const recommendations: string[] = [];

      // Role-specific verification logic
      switch (roleType) {
        case UserRole.BUYER_SOLICITOR:
          score += this.verifyLegalProfessional(certifications, specializations, missingRequirements);
          break;
          
        case UserRole.STRUCTURAL_ENGINEER:
          score += this.verifyEngineer(certifications, specializations, missingRequirements);
          break;
          
        case UserRole.LEAD_ARCHITECT:
          score += this.verifyArchitect(certifications, specializations, missingRequirements);
          break;
          
        case UserRole.ESTATE_AGENT:
          score += this.verifyEstateAgent(certifications, specializations, missingRequirements);
          break;
          
        case UserRole.BER_ASSESSOR:
          score += this.verifyBERAssessor(certifications, specializations, missingRequirements);
          break;
          
        default:
          // General professional verification
          score += this.verifyGeneralProfessional(user, certifications, specializations, missingRequirements);
      }

      // Experience factor
      const experienceYears = user.experience_years || 0;
      if (experienceYears >= 5) score += 20;
      else if (experienceYears >= 2) score += 10;
      else missingRequirements.push('Minimum 2 years relevant experience required');

      // Education/certification completeness
      if (certifications.length === 0) {
        missingRequirements.push('Professional certifications required');
      } else {
        score += Math.min(certifications.length * 10, 30);
      }

      // Generate recommendations
      if (score < 60) {
        recommendations.push('Consider obtaining additional professional certifications');
        recommendations.push('Gain more relevant work experience');
      }
      
      if (specializations.length < 2) {
        recommendations.push('Develop specializations in your field');
      }

      return {
        eligible: score >= 60 && missingRequirements.length === 0,
        score,
        missingRequirements,
        recommendations,
        autoApprove: score >= 80 && missingRequirements.length === 0
      };

    } catch (error) {
      console.error('Role eligibility verification failed:', error);
      throw error;
    }
  }

  /**
   * Reject a role assignment
   */
  async rejectRoleAssignment(assignmentId: string, rejectedBy: string, rejectionReason?: string): Promise<void> {
    try {
      const query = `
        UPDATE professional_role_assignments 
        SET eligibility_verified = FALSE,
            verified_by = ?,
            verification_date = CURRENT_TIMESTAMP,
            is_active = FALSE,
            activity_status = 'inactive'
        WHERE id = ?
      `;
      
      await new Promise<void>((resolve, reject) => {
        this.db.run(query, [rejectedBy, assignmentId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Get assignment details for broadcasting
      const assignment = await new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM professional_role_assignments WHERE id = ?';
        this.db.get(query, [assignmentId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (assignment) {
        // Broadcast role rejection
        this.broadcastRoleAssignmentEvent('role_rejected', {
          assignmentId,
          userId: assignment.user_id,
          roleType: assignment.role_type,
          rejectedBy,
          rejectionReason: rejectionReason || 'Requirements not met',
          verificationScore: assignment.eligibility_score
        });
      }

    } catch (error) {
      console.error('Role assignment rejection failed:', error);
      throw error;
    }
  }

  /**
   * Approve a role assignment
   */
  async approveRoleAssignment(assignmentId: string, approvedBy: string, notes?: string): Promise<void> {
    try {
      const query = `
        UPDATE professional_role_assignments 
        SET eligibility_verified = TRUE,
            verified_by = ?,
            verification_date = CURRENT_TIMESTAMP,
            is_active = TRUE,
            activity_status = 'active'
        WHERE id = ?
      `;
      
      await new Promise<void>((resolve, reject) => {
        this.db.run(query, [approvedBy, assignmentId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Update user's primary role if this is a primary assignment
      await this.updateUserPrimaryRole(assignmentId);

      // Get assignment details for broadcasting
      const assignment = await new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM professional_role_assignments WHERE id = ?';
        this.db.get(query, [assignmentId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (assignment) {
        // Broadcast role approval
        this.broadcastRoleAssignmentEvent('role_approved', {
          assignmentId,
          userId: assignment.user_id,
          roleType: assignment.role_type,
          approvedBy,
          verificationScore: assignment.eligibility_score
        });
      }

    } catch (error) {
      console.error('Role assignment approval failed:', error);
      throw error;
    }
  }

  /**
   * Get all role assignments for a user
   */
  async getUserRoleAssignments(userId: string): Promise<RoleAssignment[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM professional_role_assignments 
        WHERE user_id = ? AND is_active = TRUE
        ORDER BY assignment_type, assigned_date DESC
      `;
      
      this.db.all(query, [userId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const assignments = rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            roleType: row.role_type as UserRole,
            assignmentType: row.assignment_type as 'primary' | 'secondary',
            isActive: row.is_active,
            eligibilityVerified: row.eligibility_verified,
            verificationDate: row.verification_date ? new Date(row.verification_date) : undefined,
            verifiedBy: row.verified_by,
            eligibilityScore: row.eligibility_score,
            missingRequirements: JSON.parse(row.missing_requirements || '[]'),
            activityStatus: row.activity_status,
            lastActivityDate: row.last_activity_date ? new Date(row.last_activity_date) : undefined,
            totalProjects: row.total_projects || 0,
            successRate: row.success_rate,
            clientRating: row.client_rating,
            assignedDate: new Date(row.assigned_date)
          }));
          resolve(assignments);
        }
      });
    });
  }

  /**
   * Get all users with a specific role
   */
  async getUsersWithRole(roleType: UserRole, activeOnly: boolean = true): Promise<RoleAssignment[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT pra.*, u.name, u.email, u.experience_years
        FROM professional_role_assignments pra
        JOIN users u ON pra.user_id = u.id
        WHERE pra.role_type = ?
      `;
      
      if (activeOnly) {
        query += ' AND pra.is_active = TRUE AND pra.activity_status = "active"';
      }
      
      query += ' ORDER BY pra.client_rating DESC, pra.success_rate DESC';
      
      this.db.all(query, [roleType], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const assignments = rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            roleType: row.role_type as UserRole,
            assignmentType: row.assignment_type as 'primary' | 'secondary',
            isActive: row.is_active,
            eligibilityVerified: row.eligibility_verified,
            verificationDate: row.verification_date ? new Date(row.verification_date) : undefined,
            verifiedBy: row.verified_by,
            eligibilityScore: row.eligibility_score,
            missingRequirements: JSON.parse(row.missing_requirements || '[]'),
            activityStatus: row.activity_status,
            lastActivityDate: row.last_activity_date ? new Date(row.last_activity_date) : undefined,
            totalProjects: row.total_projects || 0,
            successRate: row.success_rate,
            clientRating: row.client_rating,
            assignedDate: new Date(row.assigned_date),
            // Additional user info
            name: row.name,
            email: row.email,
            experienceYears: row.experience_years
          }));
          resolve(assignments);
        }
      });
    });
  }

  /**
   * Update role assignment performance metrics
   */
  async updateRolePerformance(
    assignmentId: string, 
    metrics: {
      projectsCompleted?: number;
      successRate?: number;
      clientRating?: number;
    }
  ): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      
      if (metrics.projectsCompleted !== undefined) {
        updates.push('total_projects = total_projects + ?');
        values.push(metrics.projectsCompleted);
      }
      
      if (metrics.successRate !== undefined) {
        updates.push('success_rate = ?');
        values.push(metrics.successRate);
      }
      
      if (metrics.clientRating !== undefined) {
        updates.push('client_rating = ?');
        values.push(metrics.clientRating);
      }
      
      updates.push('last_activity_date = CURRENT_TIMESTAMP');
      values.push(assignmentId);
      
      const query = `
        UPDATE professional_role_assignments 
        SET ${updates.join(', ')}
        WHERE id = ?
      `;
      
      await new Promise<void>((resolve, reject) => {
        this.db.run(query, values, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Get updated assignment details for broadcasting
      const assignment = await new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM professional_role_assignments WHERE id = ?';
        this.db.get(query, [assignmentId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (assignment) {
        // Broadcast role performance update
        this.broadcastRoleAssignmentEvent('role_updated', {
          assignmentId,
          userId: assignment.user_id,
          roleType: assignment.role_type,
          performanceMetrics: metrics,
          newRating: assignment.client_rating,
          newSuccessRate: assignment.success_rate,
          totalProjects: assignment.total_projects
        });
      }

    } catch (error) {
      console.error('Role performance update failed:', error);
      throw error;
    }
  }

  // Helper methods for role-specific verification

  private verifyLegalProfessional(certifications: any[], specializations: any[], missingRequirements: string[]): number {
    let score = 0;
    
    const hasLawDegree = certifications.some(cert => 
      cert.certification_name.toLowerCase().includes('law') || 
      cert.certification_name.toLowerCase().includes('solicitor')
    );
    
    if (hasLawDegree) {
      score += 40;
    } else {
      missingRequirements.push('Law degree or solicitor qualification required');
    }
    
    const hasPropertyLaw = specializations.some(spec => 
      spec.specialization_area.toLowerCase().includes('property') ||
      spec.specialization_area.toLowerCase().includes('conveyancing')
    );
    
    if (hasPropertyLaw) score += 20;
    
    return score;
  }

  private verifyEngineer(certifications: any[], specializations: any[], missingRequirements: string[]): number {
    let score = 0;
    
    const hasEngineeringDegree = certifications.some(cert => 
      cert.certification_name.toLowerCase().includes('engineering') ||
      cert.certification_name.toLowerCase().includes('engineer')
    );
    
    if (hasEngineeringDegree) {
      score += 40;
    } else {
      missingRequirements.push('Engineering degree or professional engineering qualification required');
    }
    
    return score;
  }

  private verifyArchitect(certifications: any[], specializations: any[], missingRequirements: string[]): number {
    let score = 0;
    
    const hasArchitectureDegree = certifications.some(cert => 
      cert.certification_name.toLowerCase().includes('architect') ||
      cert.certification_name.toLowerCase().includes('architecture')
    );
    
    if (hasArchitectureDegree) {
      score += 40;
    } else {
      missingRequirements.push('Architecture degree or professional architect qualification required');
    }
    
    return score;
  }

  private verifyEstateAgent(certifications: any[], specializations: any[], missingRequirements: string[]): number {
    let score = 0;
    
    const hasPropertyQualification = certifications.some(cert => 
      cert.certification_name.toLowerCase().includes('property') ||
      cert.certification_name.toLowerCase().includes('estate') ||
      cert.certification_name.toLowerCase().includes('real estate')
    );
    
    if (hasPropertyQualification) score += 30;
    
    return score;
  }

  private verifyBERAssessor(certifications: any[], specializations: any[], missingRequirements: string[]): number {
    let score = 0;
    
    const hasBERCertification = certifications.some(cert => 
      cert.certification_name.toLowerCase().includes('ber') ||
      cert.certification_name.toLowerCase().includes('energy')
    );
    
    if (hasBERCertification) {
      score += 50;
    } else {
      missingRequirements.push('BER assessor certification required');
    }
    
    return score;
  }

  private verifyGeneralProfessional(user: any, certifications: any[], specializations: any[], missingRequirements: string[]): number {
    let score = 20; // Base score for general professional
    
    // Add points for relevant experience
    if (user.experience_years > 10) score += 20;
    else if (user.experience_years > 5) score += 15;
    else if (user.experience_years > 2) score += 10;
    
    return score;
  }

  // Helper methods for database operations

  private async getUserProfile(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      this.db.get(query, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row || {});
      });
    });
  }

  private async getUserCertifications(userId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM professional_certifications WHERE user_id = ? AND is_active = TRUE';
      this.db.all(query, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  private async getUserSpecializations(userId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM professional_specializations WHERE user_id = ?';
      this.db.all(query, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  private async activateRoleAssignment(assignmentId: string, activatedBy: string): Promise<void> {
    const query = `
      UPDATE professional_role_assignments 
      SET is_active = TRUE, 
          eligibility_verified = TRUE,
          verified_by = ?,
          verification_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await new Promise<void>((resolve, reject) => {
      this.db.run(query, [activatedBy, assignmentId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  private async updateUserPrimaryRole(assignmentId: string): Promise<void> {
    // Get assignment details
    const assignment = await new Promise<any>((resolve, reject) => {
      const query = 'SELECT * FROM professional_role_assignments WHERE id = ?';
      this.db.get(query, [assignmentId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (assignment && assignment.assignment_type === 'primary') {
      // Update user's primary role
      const updateQuery = 'UPDATE users SET professional_role_primary = ? WHERE id = ?';
      await new Promise<void>((resolve, reject) => {
        this.db.run(updateQuery, [assignment.role_type, assignment.user_id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
}

export const roleAssignmentService = new RoleAssignmentService();
export default roleAssignmentService;