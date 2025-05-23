import React from 'react';
'use client';

export default function SimpleTest() {
  return (
    <div style={ padding: '2rem' }>
      <h1>Simple Test Page</h1>
      <p>If you can see this, the app is working!</p>
      <ul>
        <li><a href="/first-time-buyers">First Time Buyers Page</a></li>
        <li><a href="/test-htb">Test HTB Page</a></li>
        <li><a href="/status">Status Page</a></li>
      </ul>
    </div>
  );
}