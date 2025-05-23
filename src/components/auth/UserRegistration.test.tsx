
import React from 'react';
import { render, screen } from '@testing-library/react';
import UserRegistration from './UserRegistration';

describe('UserRegistration', () => {
  it('renders without crashing', () => {
    render(<UserRegistration />);
  });

  it('displays the correct title', () => {
    render(<UserRegistration />);
    expect(screen.getByText(/UserRegistration/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
