
import React from 'react';
import { render, screen } from '@testing-library/react';
import textarea from './textarea';

describe('textarea', () => {
  it('renders without crashing', () => {
    render(<textarea />);
  });

  it('displays the correct title', () => {
    render(<textarea />);
    expect(screen.getByText(/textarea/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
