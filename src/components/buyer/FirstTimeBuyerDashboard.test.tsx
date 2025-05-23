
import React from 'react';
import { render, screen } from '@testing-library/react';
import FirstTimeBuyerDashboard from './FirstTimeBuyerDashboard';

describe('FirstTimeBuyerDashboard', () => {
  it('renders without crashing', () => {
    render(<FirstTimeBuyerDashboard />);
  });

  it('displays the correct title', () => {
    render(<FirstTimeBuyerDashboard />);
    expect(screen.getByText(/FirstTimeBuyerDashboard/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
