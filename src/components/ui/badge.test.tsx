
import React from 'react';
import { render, screen } from '@testing-library/react';
import badge from './badge';

describe('badge', () => {
  it('renders without crashing', () => {
    render(<badge />);
  });

  it('displays the correct title', () => {
    render(<badge />);
    expect(screen.getByText(/badge/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
