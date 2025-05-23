
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './error-boundary.stories';

// Get all stories using composeStories
const { Default, WithError, WithCustomFallback } = composeStories(stories);

describe('ErrorBoundary Stories', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Default error boundary without error', () => {
    render(<Default />);
    expect(screen.getByText(/This is wrapped in an error boundary/i)).toBeInTheDocument();
  });

  it('renders error state when error occurs', () => {
    // Suppress console errors for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<WithError />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('renders custom fallback when error occurs', () => {
    // Check if WithCustomFallback story exists
    if (WithCustomFallback) {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<WithCustomFallback />);
      expect(screen.getByText(/Custom error message/i)).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    }
  });
});
