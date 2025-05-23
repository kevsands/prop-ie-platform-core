
import React from 'react';
import { render, screen } from '@testing-library/react';
import checkbox from './checkbox';

describe('checkbox', () => {
  it('renders without crashing', () => {
    render(<checkbox />);
  });

  it('displays the correct title', () => {
    render(<checkbox />);
    expect(screen.getByText(/checkbox/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
