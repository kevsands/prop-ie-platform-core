import type { Preview } from '@storybook/react';
import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../src/components/AuthProvider';
import { ToastProvider } from '../src/components/ui/toast';

// Import global styles for Tailwind
import '../src/styles/globals.css';

// Create React Query client for stories
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrap your stories with necessary providers
const withProviders = (Story: React.ComponentType) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <div className="p-6 bg-background min-h-[100vh]">
            <Story />
          </div>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f6f6f6' },
      ],
    },
    layout: 'centered',
    docs: {
      toc: true,
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
    },
    a11y: {
      // Optional a11y config
      config: {
        rules: [
          {
            id: 'color-contrast',
            reviewOnFail: true,
          },
        ],
      },
      // Only run a11y tests when requested in the story
      manual: true,
    },
  },
  decorators: [withProviders],
};

export default preview;