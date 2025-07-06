// __tests__/mocks/components.tsx
import React from 'react';

// Mock the LoginForm component
jest.mock('../../src/components/auth/LoginForm', () => {
  return {
    __esModule: true,
    default: function MockLoginForm() {
      return (
        <div data-testid="login-form">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
          <button type="submit">Sign in</button>
        </div>
      );
    }
  };
});

// Mock the RegisterForm component
jest.mock('../../src/components/auth/RegisterForm', () => {
  return {
    __esModule: true,
    default: function MockRegisterForm() {
      return (
        <div data-testid="register-form">
          <label htmlFor="firstName">First name</label>
          <input type="text" id="firstName" />
          <label htmlFor="lastName">Last name</label>
          <input type="text" id="lastName" />
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
          <label htmlFor="confirmPassword">Confirm password</label>
          <input type="password" id="confirmPassword" />
          <button type="submit">Create account</button>
        </div>
      );
    }
  };
});