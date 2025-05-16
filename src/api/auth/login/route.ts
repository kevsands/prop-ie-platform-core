import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as { email: string; password: string };

    // Mock validation (replace with real auth logic)
    if (email === 'user@example.com' && password === 'password123') {
      return NextResponse.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 'user-id',
          name: 'User Name',
          email,
          role: 'admin'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}