
import { POST, GET } from './payments';
import { NextRequest } from 'next/server';

describe('payments API', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/payments');
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('handles POST requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/payments', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' })
    });
    const response = await POST(request);
    expect(response.status).toBeLessThanOrEqual(201);
  });
});
