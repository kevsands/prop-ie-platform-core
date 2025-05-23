
import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyerDashboard from './BuyerDashboard';

describe('BuyerDashboard', () => {
  it('renders without crashing', () => {
    render(<BuyerDashboard />);
  });

  it('displays the correct title', () => {
    render(<BuyerDashboard />);
    expect(screen.getByText(/BuyerDashboard/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
