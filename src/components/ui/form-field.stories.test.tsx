
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './form-field.stories';

// Get all stories using composeStories
const { Default, WithError, WithDescription, Disabled, Required } = composeStories(stories);

describe('FormField Stories', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Default form field', () => {
    render(<Default />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });

  it('renders form field with error', () => {
    render(<WithError />);
    expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
  });

  it('renders form field with description', () => {
    render(<WithDescription />);
    expect(screen.getByText(/Enter your full name/i)).toBeInTheDocument();
  });

  it('renders disabled form field', () => {
    render(<Disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders required form field with asterisk', () => {
    render(<Required />);
    const label = screen.getByText(/\*/); // Look for asterisk
    expect(label).toBeInTheDocument();
  });
});
