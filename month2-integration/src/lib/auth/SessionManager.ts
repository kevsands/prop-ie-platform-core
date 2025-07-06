/**
 * Enterprise Session Management
 * Handles user sessions, token lifecycle, and security monitoring
 */

import { User, Session } from '@/types/auth';

interface SessionStorage {
  [sessionId: string]: Session;
}

interface UserSession {
  user: User;
  session: Session;
  lastActivity: Date;
  deviceInfo: {
    userAgent: string;
    ipAddress: string;
    platform: string;
  };
}

export class SessionManager {
  private sessions: Map<string, UserSession> = new Map();
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private readonly INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Create a new user session
   */
  createSession(
    user: User, 
    sessionId: string, 
    accessToken: string, 
    refreshToken: string,
    deviceInfo: { userAgent: string; ipAddress: string; platform: string }
  ): Session {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_TIMEOUT);

    const session: Session = {
      id: sessionId,
      userId: user.id,
      accessToken,
      refreshToken,
      expiresAt,
      createdAt: now,
      lastAccessedAt: now,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent
    };

    const userSession: UserSession = {
      user,
      session,
      lastActivity: now,
      deviceInfo
    };

    this.sessions.set(sessionId, userSession);

    console.log(`Session created for user ${user.id}: ${sessionId}`);
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): UserSession | null {
    const userSession = this.sessions.get(sessionId);
    
    if (!userSession) {
      return null;
    }

    // Check if session is expired
    if (this.isSessionExpired(userSession.session)) {
      this.deleteSession(sessionId);
      return null;
    }

    // Check for inactivity timeout
    if (this.isSessionInactive(userSession)) {
      this.deleteSession(sessionId);
      return null;
    }

    // Update last activity
    userSession.lastActivity = new Date();
    userSession.session.lastAccessedAt = new Date();

    return userSession;
  }

  /**
   * Update session tokens
   */
  updateSessionTokens(
    sessionId: string, 
    accessToken: string, 
    refreshToken: string
  ): boolean {
    const userSession = this.sessions.get(sessionId);
    
    if (!userSession) {
      return false;
    }

    userSession.session.accessToken = accessToken;
    userSession.session.refreshToken = refreshToken;
    userSession.session.lastAccessedAt = new Date();
    userSession.lastActivity = new Date();

    console.log(`Session tokens updated for session: ${sessionId}`);
    return true;
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    const userSession = this.sessions.get(sessionId);
    
    if (userSession) {
      console.log(`Session deleted for user ${userSession.user.id}: ${sessionId}`);
      this.sessions.delete(sessionId);
      return true;
    }
    
    return false;
  }

  /**
   * Delete all sessions for a user
   */
  deleteUserSessions(userId: string): number {
    let deletedCount = 0;
    
    for (const [sessionId, userSession] of this.sessions.entries()) {
      if (userSession.user.id === userId) {
        this.sessions.delete(sessionId);
        deletedCount++;
      }
    }

    console.log(`Deleted ${deletedCount} sessions for user ${userId}`);
    return deletedCount;
  }

  /**
   * Get all active sessions for a user
   */
  getUserSessions(userId: string): UserSession[] {
    const userSessions: UserSession[] = [];
    
    for (const userSession of this.sessions.values()) {
      if (userSession.user.id === userId && !this.isSessionExpired(userSession.session)) {
        userSessions.push(userSession);
      }
    }

    return userSessions;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    userCount: number;
  } {
    let activeSessions = 0;
    let expiredSessions = 0;
    const uniqueUsers = new Set<string>();

    for (const userSession of this.sessions.values()) {
      uniqueUsers.add(userSession.user.id);
      
      if (this.isSessionExpired(userSession.session) || this.isSessionInactive(userSession)) {
        expiredSessions++;
      } else {
        activeSessions++;
      }
    }

    return {
      totalSessions: this.sessions.size,
      activeSessions,
      expiredSessions,
      userCount: uniqueUsers.size
    };
  }

  /**
   * Check if session is expired
   */
  private isSessionExpired(session: Session): boolean {
    return new Date() > session.expiresAt;
  }

  /**
   * Check if session is inactive
   */
  private isSessionInactive(userSession: UserSession): boolean {
    const now = new Date();
    const timeSinceLastActivity = now.getTime() - userSession.lastActivity.getTime();
    return timeSinceLastActivity > this.INACTIVITY_TIMEOUT;
  }

  /**
   * Start cleanup timer to remove expired sessions
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 10 * 60 * 1000); // Run every 10 minutes
  }

  /**
   * Clean up expired and inactive sessions
   */
  private cleanupExpiredSessions(): void {
    let cleanedCount = 0;
    const sessionsToDelete: string[] = [];

    for (const [sessionId, userSession] of this.sessions.entries()) {
      if (this.isSessionExpired(userSession.session) || this.isSessionInactive(userSession)) {
        sessionsToDelete.push(sessionId);
      }
    }

    for (const sessionId of sessionsToDelete) {
      this.sessions.delete(sessionId);
      cleanedCount++;
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired/inactive sessions`);
    }
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Security: Check for suspicious activity
   */
  checkSuspiciousActivity(userId: string): {
    multipleSessions: boolean;
    multipleIPs: boolean;
    rapidLogins: boolean;
    details: any;
  } {
    const userSessions = this.getUserSessions(userId);
    const uniqueIPs = new Set(userSessions.map(s => s.session.ipAddress));
    
    // Check for recent rapid logins (more than 3 sessions in 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentSessions = userSessions.filter(s => s.session.createdAt > tenMinutesAgo);

    return {
      multipleSessions: userSessions.length > 3,
      multipleIPs: uniqueIPs.size > 2,
      rapidLogins: recentSessions.length > 3,
      details: {
        sessionCount: userSessions.length,
        uniqueIPCount: uniqueIPs.size,
        recentSessionCount: recentSessions.length,
        sessions: userSessions.map(s => ({
          sessionId: s.session.id,
          ipAddress: s.session.ipAddress,
          userAgent: s.session.userAgent,
          createdAt: s.session.createdAt,
          lastAccessedAt: s.session.lastAccessedAt
        }))
      }
    };
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();