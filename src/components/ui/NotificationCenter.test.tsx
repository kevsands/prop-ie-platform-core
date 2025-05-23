
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationCenter from './NotificationCenter';

describe('NotificationCenter', () => {
  it('renders without crashing', () => {
    render(<NotificationCenter />);
  });

  it('displays the correct title', () => {
    render(<NotificationCenter />);
    expect(screen.getByText(/NotificationCenter/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
