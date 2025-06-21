'use client';

import UniversalRegistrationForm from '@/components/enterprise/UniversalRegistrationForm';

export default function RegisterPage() {
  // This page now serves as the unified registration entry point
  // All registration traffic is directed to the enterprise universal form
  
  return <UniversalRegistrationForm />;
}