
import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyerDashboardLayout from './BuyerDashboardLayout';

describe('BuyerDashboardLayout', () => {
  it('renders without crashing', () => {
    render(<BuyerDashboardLayout />);
  });

  it('displays the correct title', () => {
    render(<BuyerDashboardLayout />);
    expect(screen.getByText(/BuyerDashboardLayout/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
