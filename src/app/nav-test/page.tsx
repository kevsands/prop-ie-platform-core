import React from 'react';
'use client';

export default function NavTest() {
  return (
    <div>
      <div style={ backgroundColor: 'red', padding: '20px', marginTop: '80px' }>
        <h1>Navigation Test</h1>
        <p>If you see this red box below the navigation, the navigation is working.</p>
        <p>The navigation should be a fixed bar at the top of the page.</p>
      </div>
    </div>
  );
}