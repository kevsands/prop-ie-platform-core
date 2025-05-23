
import React from 'react';
import { render, screen } from '@testing-library/react';
import FirstTimeBuyerPromotion from './FirstTimeBuyerPromotion';

describe('FirstTimeBuyerPromotion', () => {
  it('renders without crashing', () => {
    render(<FirstTimeBuyerPromotion />);
  });

  it('displays the correct title', () => {
    render(<FirstTimeBuyerPromotion />);
    expect(screen.getByText(/FirstTimeBuyerPromotion/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
