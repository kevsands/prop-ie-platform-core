
import { POST, GET } from './properties';
import { NextRequest } from 'next/server';

describe('properties API', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/properties');
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('handles POST requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/properties', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' })
    });
    const response = await POST(request);
    expect(response.status).toBeLessThanOrEqual(201);
  });
});
