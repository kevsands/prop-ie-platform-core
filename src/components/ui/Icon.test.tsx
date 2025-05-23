
import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from './Icon';

describe('Icon', () => {
  it('renders without crashing', () => {
    render(<Icon />);
  });

  it('displays the correct title', () => {
    render(<Icon />);
    expect(screen.getByText(/Icon/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
