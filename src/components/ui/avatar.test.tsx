
import React from 'react';
import { render, screen } from '@testing-library/react';
import avatar from './avatar';

describe('avatar', () => {
  it('renders without crashing', () => {
    render(<avatar />);
  });

  it('displays the correct title', () => {
    render(<avatar />);
    expect(screen.getByText(/avatar/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
