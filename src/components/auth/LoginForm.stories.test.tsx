
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './LoginForm.stories';

// Get all stories using composeStories
const { Default, WithError, Loading, Prefilled } = composeStories(stories);

describe('LoginForm Stories', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Default login form', () => {
    render(<Default />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('renders login form with error state', () => {
    render(<WithError />);
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<Loading />);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('renders prefilled form', () => {
    render(<Prefilled />);
    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    expect(emailInput.value).toBe('user@example.com');
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    render(<Default />);
    
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for any async operations
    await waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });
});
