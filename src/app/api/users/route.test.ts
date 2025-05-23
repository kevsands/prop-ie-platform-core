
import { POST, GET } from './users';
import { NextRequest } from 'next/server';

describe('users API', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/users');
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('handles POST requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' })
    });
    const response = await POST(request);
    expect(response.status).toBeLessThanOrEqual(201);
  });
});
