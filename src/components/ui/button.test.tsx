
import React from 'react';
import { render, screen } from '@testing-library/react';
import button from './button';

describe('button', () => {
  it('renders without crashing', () => {
    render(<button />);
  });

  it('displays the correct title', () => {
    render(<button />);
    expect(screen.getByText(/button/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
