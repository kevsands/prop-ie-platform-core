'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Simple login form submitted');
    console.log('Email:', email);
    console.log('Password:', password);
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Making API call to login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful:', data);
        setSuccess(`Login successful! Welcome ${data.user.email} (${data.user.role})`);
        
        // Store auth data in localStorage
        localStorage.setItem('authState', JSON.stringify({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        }));
        
        // Redirect to success page to confirm login is working
        setTimeout(() => {
          console.log('🔄 Redirecting to login success page...');
          router.push('/login-success');
        }, 1500);
        
      } else {
        const errorData = await response.json();
        console.log('❌ Login failed:', errorData);
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.log('💥 Exception:', err);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f7fafc',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: '#2d3748',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Simple Login Test
        </h1>

        {/* Test credentials */}
        <div style={{
          backgroundColor: '#ebf8ff',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#2b6cb0' }}>Test Credentials:</p>
          <p style={{ margin: '0.25rem 0', color: '#2c5282' }}>• buyer@example.com</p>
          <p style={{ margin: '0.25rem 0', color: '#2c5282' }}>• developer@example.com</p>
          <p style={{ margin: '0.25rem 0', color: '#2c5282' }}>• kevin@prop.ie (password: admin123)</p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#2c5282', fontSize: '0.75rem' }}>Any password works for test accounts</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fed7d7',
            color: '#c53030',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#c6f6d5',
            color: '#22543d',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#4a5568',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d2d6dc',
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2b6cb0'}
              onBlur={(e) => e.target.style.borderColor = '#d2d6dc'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#4a5568',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d2d6dc',
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2b6cb0'}
              onBlur={(e) => e.target.style.borderColor = '#d2d6dc'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#a0aec0' : '#2b6cb0',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#2c5282';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#2b6cb0';
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: '#718096'
        }}>
          <p>This is a simplified login that bypasses complex providers</p>
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}