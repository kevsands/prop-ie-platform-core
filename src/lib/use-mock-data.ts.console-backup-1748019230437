/**
 * Feature flag and utility for using mock data
 */

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                             process.env.NODE_ENV === 'development';

// Simple check for database availability
export async function isDatabaseAvailable(): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    // In development, always use mock data to avoid database dependency
    return false;
  }
  
  try {
    // In production, check if database URL is configured
    return !!process.env.DATABASE_URL;
  } catch {
    return false;
  }
}

export function shouldUseMockData(): boolean {
  return USE_MOCK_DATA;
}