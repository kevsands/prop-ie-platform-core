'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ScreenReaderText, LiveRegion } from './ScreenReaderText';
import { Button } from '../ui/button';

/**
 * # Screen Reader Components
 * 
 * These components improve accessibility for screen reader users by providing
 * additional context and announcements that might not be visually apparent.
 * 
 * ## Components
 * - `ScreenReaderText`: Text only visible to screen readers
 * - `LiveRegion`: Dynamic announcements for screen readers
 * 
 * ## Usage
 * 
 * Use `ScreenReaderText` for static content that should be announced:
 * ```tsx
 * <button>
 *   <IconX />
 *   <ScreenReaderText>Close dialog</ScreenReaderText>
 * </button>
 * ```
 * 
 * Use `LiveRegion` for dynamic content that changes:
 * ```tsx
 * <LiveRegion>
 *   {message}
 * </LiveRegion>
 * ```
 */
const meta = {
  title: 'Accessibility/ScreenReaderText',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Components that enhance screen reader accessibility',
      },
    },
    a11y: { disable: false },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Text that is only visible to screen readers
 */
export const HiddenText: Story = {
  render: () => (
    <div className="p-6 max-w-md bg-white rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Screen Reader Example</h2>
      
      <p className="mb-4">
        The following button has text that is only visible to screen readers.
        Turn on your screen reader to hear the additional context.
      </p>
      
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Close menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 6L6 18"></path>
            <path d="M6 6L18 18"></path>
          </svg>
          <ScreenReaderText>Close menu</ScreenReaderText>
        </button>
        
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Settings"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <ScreenReaderText>Settings</ScreenReaderText>
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <p className="font-medium">Developer Note:</p>
        <p className="text-sm mt-1">
          The screen reader text is not visible, but screen readers will announce the text.
          This is especially useful for icon-only buttons, ensuring they have proper accessible names.
        </p>
      </div>
    </div>
  ),
};

/**
 * Dynamic announcements with LiveRegion
 */
export const LiveAnnouncements: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');
    
    const incrementCounter = () => {
      const newCount = count + 1;
      setCount(newCount);
      setMessage(`Counter incremented to ${newCount}`);
    };
    
    const decrementCounter = () => {
      const newCount = count - 1;
      setCount(newCount);
      setMessage(`Counter decremented to ${newCount}`);
    };
    
    return (
      <div className="p-6 max-w-md bg-white rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Live Region Example</h2>
        
        <p className="mb-4">
          The following counter will announce changes to screen readers.
          Turn on your screen reader and click the buttons to hear the announcements.
        </p>
        
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded mb-4">
          <Button 
            variant="outline" 
            onClick={decrementCounter}
            aria-label="Decrease count"
          >
            -
          </Button>
          
          <span className="font-bold text-xl" aria-live="polite">
            {count}
          </span>
          
          <Button 
            variant="outline" 
            onClick={incrementCounter}
            aria-label="Increase count"
          >
            +
          </Button>
          
          <LiveRegion>
            {message}
          </LiveRegion>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="font-medium">Developer Note:</p>
          <p className="text-sm mt-1">
            The LiveRegion component is not visible but will announce content changes
            to screen readers. This helps users know what's happening when content changes
            dynamically without a page reload.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Different politeness levels for announcements
 */
export const PolitenessLevels: Story = {
  render: () => {
    const [politeMessage, setPoliteMessage] = useState('');
    const [assertiveMessage, setAssertiveMessage] = useState('');
    
    const announcePolite = () => {
      setPoliteMessage(`Polite announcement at ${new Date().toLocaleTimeString()}`);
    };
    
    const announceAssertive = () => {
      setAssertiveMessage(`Assertive announcement at ${new Date().toLocaleTimeString()}`);
    };
    
    return (
      <div className="p-6 max-w-md bg-white rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Announcement Politeness Levels</h2>
        
        <div className="space-y-4">
          <div>
            <p className="mb-2">
              Polite announcements (default) - wait until user is idle:
            </p>
            <Button variant="outline" onClick={announcePolite}>
              Make polite announcement
            </Button>
            <LiveRegion politeness="polite">
              {politeMessage}
            </LiveRegion>
          </div>
          
          <div>
            <p className="mb-2">
              Assertive announcements - interrupt user immediately:
            </p>
            <Button variant="destructive" onClick={announceAssertive}>
              Make assertive announcement
            </Button>
            <LiveRegion politeness="assertive">
              {assertiveMessage}
            </LiveRegion>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="font-medium">When to use each politeness level:</p>
          <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
            <li>
              <strong>Polite (default)</strong>: Use for non-critical updates like "3 new messages"
            </li>
            <li>
              <strong>Assertive</strong>: Use sparingly for critical information like error messages or alerts
            </li>
          </ul>
        </div>
      </div>
    );
  },
};