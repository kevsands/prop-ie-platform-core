
import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyerDashboardSidebar from './BuyerDashboardSidebar';

describe('BuyerDashboardSidebar', () => {
  it('renders without crashing', () => {
    render(<BuyerDashboardSidebar />);
  });

  it('displays the correct title', () => {
    render(<BuyerDashboardSidebar />);
    expect(screen.getByText(/BuyerDashboardSidebar/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
