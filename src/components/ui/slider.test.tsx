
import React from 'react';
import { render, screen } from '@testing-library/react';
import slider from './slider';

describe('slider', () => {
  it('renders without crashing', () => {
    render(<slider />);
  });

  it('displays the correct title', () => {
    render(<slider />);
    expect(screen.getByText(/slider/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
