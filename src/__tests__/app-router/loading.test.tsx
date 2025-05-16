import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import for the custom matchers
import Loading from '../../app/properties/loading';

describe('Loading component', () => {
  it('should render loading skeleton', () => {
    render(<Loading />);
    
    // Check for the loading skeleton element
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
  
  it('should display correct loading message', () => {
    render(<Loading />);
    
    // Check for loading message text
    expect(screen.getByText(/Loading properties/i)).toBeInTheDocument();
  });
});