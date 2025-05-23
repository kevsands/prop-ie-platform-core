
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
  });

  it('displays the correct title', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/LoadingSpinner/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
