
import React from 'react';
import { render, screen } from '@testing-library/react';
import MicrosoftIntegration from './MicrosoftIntegration';

describe('MicrosoftIntegration', () => {
  it('renders without crashing', () => {
    render(<MicrosoftIntegration />);
  });

  it('displays the correct title', () => {
    render(<MicrosoftIntegration />);
    expect(screen.getByText(/MicrosoftIntegration/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
