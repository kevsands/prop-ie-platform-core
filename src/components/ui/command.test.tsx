
import React from 'react';
import { render, screen } from '@testing-library/react';
import command from './command';

describe('command', () => {
  it('renders without crashing', () => {
    render(<command />);
  });

  it('displays the correct title', () => {
    render(<command />);
    expect(screen.getByText(/command/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
