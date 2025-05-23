/**
 * Unit tests for LoginForm component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  signIn: jest.fn()}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()}));

// Mock toast notifications
const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast })}));

describe('LoginForm', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush});
  });

  it('should render login form with all fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false});
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'You have been logged in successfully'});
    });
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    expect(signIn).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'notanemail');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    expect(signIn).not.toHaveBeenCalled();
  });

  it('should handle login errors', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Invalid credentials'});
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive'});
    });
  });

  it('should handle two-factor authentication', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'RequiresTwoFactor'});
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Two-Factor Code')).toBeInTheDocument();
      expect(screen.getByText('Enter your 6-digit authentication code')).toBeInTheDocument();
    });
  });

  it('should submit with two-factor code', async () => {
    (signIn as jest.Mock)
      .mockResolvedValueOnce({ ok: false, error: 'RequiresTwoFactor' })
      .mockResolvedValueOnce({ ok: true });
    
    const user = userEvent.setup();

    render(<LoginForm />);

    // First login attempt
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Enter 2FA code
    await waitFor(() => {
      expect(screen.getByLabelText('Two-Factor Code')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Two-Factor Code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => {
      expect(signIn).toHaveBeenLastCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        twoFactorCode: '123456',
        redirect: false});
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Toggle password visibility');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should handle remember me checkbox', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const rememberMe = screen.getByRole('checkbox', { name: 'Remember me' });
    
    expect(rememberMe).not.toBeChecked();
    await user.click(rememberMe);
    expect(rememberMe).toBeChecked();
  });

  it('should disable form during submission', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should show loading spinner during submission', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('should navigate to forgot password page', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByText('Forgot password?'));
    
    expect(mockPush).toHaveBeenCalledWith('/auth/forgot-password');
  });

  it('should redirect to custom path if provided', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<LoginForm redirectTo="/properties" />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/properties');
    });
  });

  it('should clear errors when typing', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    // Submit empty form to trigger errors
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(screen.getByLabelText('Email'), 't');

    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});