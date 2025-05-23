
import React from 'react';
import { render, screen } from '@testing-library/react';
import alert-dialog from './alert-dialog';

describe('alert-dialog', () => {
  it('renders without crashing', () => {
    render(<alert-dialog />);
  });

  it('displays the correct title', () => {
    render(<alert-dialog />);
    expect(screen.getByText(/alert-dialog/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
