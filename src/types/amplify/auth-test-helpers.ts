/**
 * Implementation of helper functions for Amplify Auth test mocks
 */

import { AuthUser, SignInResult, SignUpResult } from './auth';
import { TestSignInResult, TestSignUpResult, TestAuthUser } from './auth-test';

// Type assertion helper for converting TestSignInResult to SignInResult
export function toSignInResult(result: TestSignInResult): SignInResult {
  return result as unknown as SignInResult;
}

// Type assertion helper for converting TestSignUpResult to SignUpResult
export function toSignUpResult(result: TestSignUpResult): SignUpResult {
  return {
    ...result,
    nextStep: result.nextStep || { signUpStep: 'DONE' }
  } as SignUpResult;
}

// Type assertion helper for converting TestAuthUser to AuthUser
export function toAuthUser(user: TestAuthUser): AuthUser {
  return {
    ...user,
    roles: user.roles || []
  } as AuthUser;
}