'use client';

/**
 * Multi-Factor Authentication Module (Wrapper for compatibility)
 * 
 * This file is maintained for backward compatibility.
 * It re-exports all MFA functionality from the consolidated implementation
 * in the mfa/ directory.
 */

export * from './mfa/index';

// Re-export the MFAService object for legacy code
import { MFAService } from './mfa/index';
export default MFAService;