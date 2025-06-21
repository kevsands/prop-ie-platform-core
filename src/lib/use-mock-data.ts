/**
 * Feature flag and utility for using mock data
 */

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Simple check for database availability
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    // Check if database URL is configured
    return !!process.env.DATABASE_URL;
  } catch {
    return false;
  }
}

export function shouldUseMockData(): boolean {
  return USE_MOCK_DATA;
}