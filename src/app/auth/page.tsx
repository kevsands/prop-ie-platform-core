'use client';

import React from 'react';
import { AuthenticationFlow } from '@/features/auth/AuthenticationFlow';
import { AuthProvider } from '@/context/AuthContext';

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthenticationFlow />
    </AuthProvider>
  );
}