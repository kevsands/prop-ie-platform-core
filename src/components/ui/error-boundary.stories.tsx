import React from 'react';
'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ErrorBoundary, withErrorBoundary } from './error-boundary';
import { Button } from './button';

/**
 * # Error Boundary Component
 * 
 * Error boundaries are React components that catch JavaScript errors in their child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 * 
 * ## Features
 * - Catches errors in component tree
 * - Provides fallback UI
 * - Development mode details for debugging
 * - Reset functionality
 * - HOC utility for wrapping components
 * 
 * ## Usage
 * 
 * ```tsx
 * // Basic usage
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 * 
 * // With custom fallback and error handler
 * <ErrorBoundary 
 *   fallback={<CustomErrorComponent />}
 *   onError={(error: any) => logErrorToService(error)}
 * >
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 * 
 * // Using the HOC
 * const SafeComponent = withErrorBoundary(UnsafeComponent, {
 *   fallback: <p>Something went wrong</p>,
 *   onError: (error: any) => logError(error),
 * });
 * ```
 */
const meta = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component that catches errors in its child component tree and displays a fallback UI'},
  tags: ['autodocs'],
  argTypes: {
    showReset: {
      control: 'boolean',
      description: 'Whether to show the reset button'},
    showHomeLink: {
      control: 'boolean',
      description: 'Whether to show the home link'},
    resetOnPropsChange: {
      control: 'boolean',
      description: 'Whether to reset the error state when props change'} satisfies Meta<typeof ErrorBoundary>
  );
export default meta;
type Story = StoryObj<typeof ErrorBoundary>
  );
/**
 * Component that throws an error
 */
const BuggyCounter = () => {
  const [countersetCounter] = useState(0);

  const handleClick = () => {
    setCounter(prevCounter => prevCounter + 1);
  };

  if (counter === 3) {
    throw new Error('I crashed when counter reached 3!');
  }

  return (
    <div className="p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Buggy Counter</h3>
      <p className="mb-4">Counter: {counter}</p>
      <p className="mb-4 text-sm text-gray-600">
        This component will crash when the counter reaches 3
      </p>
      <Button onClick={handleClick}>
        Increment
      </Button>
    </div>
  );
};

/**
 * Basic error boundary usage
 */
export const Basic: Story = {
  args: {
    showReset: true,
    showHomeLink: true},
  render: (args: any) => (
    <ErrorBoundary {...args}>
      <BuggyCounter />
    </ErrorBoundary>
  )};

/**
 * Error boundary with custom fallback
 */
export const CustomFallback: Story = {
  render: () => {
    const CustomErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg max-w-md">
        <h3 className="text-lg font-semibold text-red-800 mb-4">Something went wrong 🤕</h3>
        <p className="text-red-700 mb-4">{error.message}</p>
        <Button onClick={resetErrorBoundary} variant="outline">
          Try again
        </Button>
      </div>
    );

    return (
      <ErrorBoundary errorComponent={CustomErrorFallback}>
        <BuggyCounter />
      </ErrorBoundary>
    );
  };

/**
 * Using the withErrorBoundary HOC
 */
export const WithHOC: Story = {
  render: () => {
    const SafeCounter = withErrorBoundary(BuggyCounter, {
      showReset: true,
      showHomeLink: false,
      onError: (error: any) => });

    return <SafeCounter />\n  );
  };