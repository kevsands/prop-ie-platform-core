'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DeveloperPlatformRedirect() {
  useEffect(() => {
    window.location.href = '/solutions/developers';
  }, []);

  return null;
}