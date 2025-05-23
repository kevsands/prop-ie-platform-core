
import { POST, GET } from './auth';
import { NextRequest } from 'next/server';

describe('auth API', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth');
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('handles POST requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' })
    });
    const response = await POST(request);
    expect(response.status).toBeLessThanOrEqual(201);
  });
});
