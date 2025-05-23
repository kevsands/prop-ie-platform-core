
import React from 'react';
import { render, screen } from '@testing-library/react';
import accordion from './accordion';

describe('accordion', () => {
  it('renders without crashing', () => {
    render(<accordion />);
  });

  it('displays the correct title', () => {
    render(<accordion />);
    expect(screen.getByText(/accordion/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
