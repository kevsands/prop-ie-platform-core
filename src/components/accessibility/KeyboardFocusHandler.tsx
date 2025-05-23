'use client';

import React, { useEffect, useState } from 'react';

/**
 * KeyboardFocusHandler Component
 * 
 * An accessibility component that adds visual indicators when users navigate with keyboard.
 * It manages focus rings throughout the application, only showing focus outlines during
 * keyboard navigation and adds a "Skip to content" link.
 * 
 * Features:
 * - Detects keyboard vs mouse navigation
 * - Adds a `keyboard-navigation` class to the document body when keyboard is used
 * - Removes focus rings for mouse users
 * - Ensures users can navigate the site with keyboard only
 */
export default function KeyboardFocusHandler(): null {
  const [isKeyboardNavigationsetIsKeyboardNavigation] = useState(false);

  useEffect(() => {
    // Function to handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab key is pressed, indicating keyboard navigation
      if (event.key === 'Tab') {
        if (!isKeyboardNavigation) {
          setIsKeyboardNavigation(true);
          document.body.classList.add('keyboard-navigation');
        }
      }
    };

    // Function to handle mouse down, indicating mouse navigation
    const handleMouseDown = () => {
      if (isKeyboardNavigation) {
        setIsKeyboardNavigation(false);
        document.body.classList.remove('keyboard-navigation');
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Inject global styles for focus management if not already present
    if (!document.getElementById('keyboard-focus-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'keyboard-focus-styles';
      styleEl.innerHTML = `
        /* Hide focus outlines for non-keyboard users */
        *:focus {
          outline: none;
        }

        /* Show focus outlines only for keyboard users */
        body.keyboard-navigation *:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* Skip to content link */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 00);
          white-space: nowrap;
          border-width: 0;
        }

        .sr-only:focus {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          width: auto;
          height: auto;
          padding: 1rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
          background-color: white;
          color: black;
          border: 2px solid #2563eb;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isKeyboardNavigation]);

  // This component doesn't render anything visibly
  return null;
}