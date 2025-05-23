
import React from 'react';
import { render, screen } from '@testing-library/react';
import sheet from './sheet';

describe('sheet', () => {
  it('renders without crashing', () => {
    render(<sheet />);
  });

  it('displays the correct title', () => {
    render(<sheet />);
    expect(screen.getByText(/sheet/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
