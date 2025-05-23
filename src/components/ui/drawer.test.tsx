
import React from 'react';
import { render, screen } from '@testing-library/react';
import drawer from './drawer';

describe('drawer', () => {
  it('renders without crashing', () => {
    render(<drawer />);
  });

  it('displays the correct title', () => {
    render(<drawer />);
    expect(screen.getByText(/drawer/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
