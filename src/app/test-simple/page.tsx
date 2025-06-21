'use client';

import React, { useState } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('Ready to test');

  const testLogin = async () => {
    setMessage('Testing...');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'buyer@example.com', 
          password: 'test123' 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Login works! User: ${data.user.email}, Role: ${data.user.role}`);
      } else {
        const error = await response.json();
        setMessage(`❌ Login failed: ${error.error}`);
      }
    } catch (err) {
      setMessage(`💥 Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Simple Login Test</h1>
      <p>Status: {message}</p>
      <button 
        onClick={testLogin}
        style={{
          backgroundColor: '#2B5273',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Login API
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Manual Test:</h3>
        <p>1. Click the button above</p>
        <p>2. Should show "Login works!" if API is working</p>
        <p>3. Check browser console for any errors</p>
      </div>
    </div>
  );
}