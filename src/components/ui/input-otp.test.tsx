
import React from 'react';
import { render, screen } from '@testing-library/react';
import input-otp from './input-otp';

describe('input-otp', () => {
  it('renders without crashing', () => {
    render(<input-otp />);
  });

  it('displays the correct title', () => {
    render(<input-otp />);
    expect(screen.getByText(/input-otp/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
