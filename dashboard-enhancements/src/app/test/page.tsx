'use client';

export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>If you can see this, the app is running!</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}