
import React from 'react';
import { render, screen } from '@testing-library/react';
import spinner from './spinner';

describe('spinner', () => {
  it('renders without crashing', () => {
    render(<spinner />);
  });

  it('displays the correct title', () => {
    render(<spinner />);
    expect(screen.getByText(/spinner/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
