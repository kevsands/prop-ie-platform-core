'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { toast, ToastProvider, ToastViewport } from './toast';
import { Button } from './button';

/**
 * # Toast Component
 * 
 * Toast notifications provide brief messages about app processes without interrupting the user experience.
 * 
 * ## Features
 * - Multiple variants (default, success, error, warning, info)
 * - Customizable duration
 * - Automatic dismissal
 * - Ability to add actions
 * 
 * ## Usage
 * 
 * First, add the ToastProvider to your app:
 * 
 * ```tsx
 * // In your layout component
 * <ToastProvider>
 *   {children}
 *   <ToastViewport />
 * </ToastProvider>
 * ```
 * 
 * Then use the toast API to show notifications:
 * 
 * ```tsx
 * // Show a success toast
 * toast.success({
 *   title: 'Success',
 *   description: 'Your changes have been saved'
 * });
 * 
 * // Show an error toast
 * toast.error({
 *   title: 'Error',
 *   description: 'Could not save changes'
 * });
 * ```
 */
const meta = {
  title: 'UI/Toast',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast notification system for user feedback',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ToastDemo component to showcase toast functionality
 */
const ToastDemo = ({ variant }: { variant?: 'default' | 'success' | 'error' | 'warning' | 'info' }) => {
  const [count, setCount] = useState(0);
  
  const showToast = () => {
    const title = `${variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : 'Notification'} Toast`;
    const description = `This is a ${variant || 'default'} toast notification (${count + 1})`;
    
    if (variant === 'success') {
      toast.success({ title, description });
    } else if (variant === 'error') {
      toast.error({ title, description });
    } else if (variant === 'warning') {
      toast.warning({ title, description });
    } else if (variant === 'info') {
      toast.info({ title, description });
    } else {
      toast.show({ title, description });
    }
    
    setCount(prev => prev + 1);
  };
  
  return (
    <div className="p-4 flex flex-col items-center">
      <ToastProvider>
        <Button onClick={showToast}>
          Show {variant || 'default'} toast
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          Click the button to trigger a toast notification
        </p>
        <ToastViewport />
      </ToastProvider>
    </div>
  );
};

/**
 * Default toast notification
 */
export const Default: Story = {
  render: () => <ToastDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};

/**
 * Success toast notification
 */
export const Success: Story = {
  render: () => <ToastDemo variant="success" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};

/**
 * Error toast notification
 */
export const Error: Story = {
  render: () => <ToastDemo variant="error" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};

/**
 * Warning toast notification
 */
export const Warning: Story = {
  render: () => <ToastDemo variant="warning" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};

/**
 * Info toast notification
 */
export const Info: Story = {
  render: () => <ToastDemo variant="info" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};

/**
 * Toast with custom action
 */
export const WithAction: Story = {
  render: () => {
    const ToastWithAction = () => {
      const showToastWithAction = () => {
        toast.info({
          title: 'Update available',
          description: 'A new version is available. Update now?',
          action: (
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">Later</Button>
              <Button size="sm">Update</Button>
            </div>
          ),
          duration: 10000, // Longer duration for action toasts
        });
      };
      
      return (
        <div className="p-4 flex flex-col items-center">
          <ToastProvider>
            <Button onClick={showToastWithAction}>
              Show toast with action
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              Click the button to trigger a toast with an action
            </p>
            <ToastViewport />
          </ToastProvider>
        </div>
      );
    };
    
    return <ToastWithAction />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};