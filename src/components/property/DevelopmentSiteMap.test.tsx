
import React from 'react';
import { render, screen } from '@testing-library/react';
import DevelopmentSiteMap from './DevelopmentSiteMap';

describe('DevelopmentSiteMap', () => {
  it('renders without crashing', () => {
    render(<DevelopmentSiteMap />);
  });

  it('displays the correct title', () => {
    render(<DevelopmentSiteMap />);
    expect(screen.getByText(/DevelopmentSiteMap/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
