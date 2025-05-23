
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './toast.stories';

// Get all stories using composeStories
const { Default, Success, Error, Warning, WithAction, LongContent } = composeStories(stories);

describe('Toast Stories', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Default toast', () => {
    render(<Default />);
    expect(screen.getByText(/Default notification/i)).toBeInTheDocument();
  });

  it('renders Success toast with correct styling', () => {
    render(<Success />);
    expect(screen.getByText(/Success!/i)).toBeInTheDocument();
  });

  it('renders Error toast with correct styling', () => {
    render(<Error />);
    expect(screen.getByText(/Error occurred/i)).toBeInTheDocument();
  });

  it('renders Warning toast with correct styling', () => {
    render(<Warning />);
    expect(screen.getByText(/Warning/i)).toBeInTheDocument();
  });

  it('renders toast with action button', () => {
    render(<WithAction />);
    expect(screen.getByRole('button', { name: /Undo/i })).toBeInTheDocument();
  });

  it('renders toast with long content', () => {
    render(<LongContent />);
    expect(screen.getByText(/This is a longer notification/i)).toBeInTheDocument();
  });
});
