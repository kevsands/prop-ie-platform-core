'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProjectManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Project management is typically for developers and admins
  return (
    <ProtectedRoute requireRole={['developer', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}