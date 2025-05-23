
import React from 'react';
import { render, screen } from '@testing-library/react';
import toaster from './toaster';

describe('toaster', () => {
  it('renders without crashing', () => {
    render(<toaster />);
  });

  it('displays the correct title', () => {
    render(<toaster />);
    expect(screen.getByText(/toaster/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
