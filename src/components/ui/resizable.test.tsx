
import React from 'react';
import { render, screen } from '@testing-library/react';
import resizable from './resizable';

describe('resizable', () => {
  it('renders without crashing', () => {
    render(<resizable />);
  });

  it('displays the correct title', () => {
    render(<resizable />);
    expect(screen.getByText(/resizable/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
