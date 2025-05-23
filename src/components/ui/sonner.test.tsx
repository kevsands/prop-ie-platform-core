
import React from 'react';
import { render, screen } from '@testing-library/react';
import sonner from './sonner';

describe('sonner', () => {
  it('renders without crashing', () => {
    render(<sonner />);
  });

  it('displays the correct title', () => {
    render(<sonner />);
    expect(screen.getByText(/sonner/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
