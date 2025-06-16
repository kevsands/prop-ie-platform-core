import React from 'react';
'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  AccessibleInput, 
  RequiredLabel, 
  AccessibleFieldset, 
  FormErrorMessage 
} from './AccessibleForm';

/**
 * # Accessible Form Components
 * 
 * These components enhance form accessibility with proper ARIA attributes, 
 * keyboard navigation, error states, and screen reader support.
 * 
 * ## Features
 * - Properly associated labels and inputs
 * - ARIA attributes for validation states
 * - Screen reader announcements for errors
 * - Clear visual indication of required fields
 * 
 * ## Best Practices
 * - Always use explicit labels for form controls
 * - Group related inputs with fieldsets and legends
 * - Provide clear error messages
 * - Ensure all interactive elements are keyboard accessible
 */
const meta = {
  title: 'Accessibility/AccessibleForm',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible form components with proper ARIA attributes and screen reader support'},
    a11y: { disable: false },
  tags: ['autodocs']} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>\n  );
/**
 * Accessible input with label and error handling
 */
export const Input: Story = {
  render: () => {
    const [valuesetValue] = useState('');
    const [showErrorsetShowError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setShowError(false);
    };

    const handleValidate = () => {
      if (!value) {
        setShowError(true);
      } else {
        setShowError(false);
        alert('Input is valid: ' + value);
      }
    };

    return (
      <div className="p-6 max-w-md bg-white rounded-lg border">
        <AccessibleInput
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          value={value}
          onChange={handleChange}
          error={showError ? 'Email is required' : undefined}
          description="We'll never share your email with anyone else."
        />

        <Button 
          onClick={handleValidate} 
          className="mt-4"
        >
          Validate
        </Button>
      </div>
    );
  };

/**
 * Required field label with proper screen reader support
 */
export const RequiredFields: Story = {
  render: () => (
    <div className="p-6 max-w-md bg-white rounded-lg border">
      <div className="space-y-4">
        <div>
          <RequiredLabel required htmlFor="name">
            Full Name
          </RequiredLabel>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-required="true"
            />
          </div>
        </div>

        <div>
          <RequiredLabel htmlFor="company">
            Company (optional)
          </RequiredLabel>
          <div className="mt-1">
            <input
              id="company"
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )};

/**
 * Fieldset for grouping related form controls
 */
export const Fieldsets: Story = {
  render: () => (
    <div className="p-6 max-w-md bg-white rounded-lg border">
      <form className="space-y-6">
        <AccessibleFieldset legend="Contact Information">
          <div className="space-y-4">
            <AccessibleInput
              label="Full Name"
              id="name"
              required
            />

            <AccessibleInput
              label="Email Address"
              id="email"
              type="email"
              required
            />
          </div>
        </AccessibleFieldset>

        <AccessibleFieldset legend="Notification Preferences" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="email-notifications"
                name="notifications"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                defaultChecked
              />
              <label htmlFor="email-notifications" className="ml-3 text-sm text-gray-700">
                Email
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="sms-notifications"
                name="notifications"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="sms-notifications" className="ml-3 text-sm text-gray-700">
                SMS
              </label>
            </div>
          </div>
        </AccessibleFieldset>

        <Button type="button" className="mt-6">
          Save Preferences
        </Button>
      </form>
    </div>
  )};

/**
 * Form error messages with screen reader announcements
 */
export const ErrorMessages: Story = {
  render: () => (
    <div className="p-6 max-w-md bg-white rounded-lg border">
      <div className="space-y-6">
        <div>
          <RequiredLabel required htmlFor="username">
            Username
          </RequiredLabel>
          <div className="mt-1">
            <input
              id="username"
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              aria-invalid="true"
              aria-describedby="username-error"
            />
          </div>
          <FormErrorMessage 
            message="Username must be at least 3 characters" 
            fieldId="username" 
          />
        </div>

        <div>
          <RequiredLabel required htmlFor="password">
            Password
          </RequiredLabel>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              aria-invalid="true"
              aria-describedby="password-error"
            />
          </div>
          <FormErrorMessage 
            message="Password must contain at least 8 characters, including a number and a special character" 
            fieldId="password" 
          />
        </div>
      </div>
    </div>
  )};