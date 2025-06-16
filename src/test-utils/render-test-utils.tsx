/**
 * Rendering Utilities for Tests
 * 
 * This file provides utilities for rendering components in tests
 * with common wrappers and configurations.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';

// Basic interfaces
interface WithChildrenProps {
  children: ReactNode;
}

// Test renderer options that include all common providers
interface CustomRenderOptions extends RenderOptions {
  withRouter?: boolean;
  withTheme?: boolean;
  withProviders?: boolean;
  routerParams?: {
    pathname?: string;
    query?: Record<string, string>
  );
    asPath?: string;
  };
  themeParams?: {
    theme?: 'light' | 'dark';
  };
}

// Mock context components
const MockThemeProvider: React.FC<WithChildrenProps & { theme?: 'light' | 'dark' }> = ({ 
  children, 
  theme = 'light' 
}) => {
  // This would be replaced with your actual theme provider
  return (
    <div data-testid="theme-provider" data-theme={theme}>
      {children}
    </div>
  );
};

const MockRouterProvider: React.FC<WithChildrenProps & { 
  pathname?: string;
  query?: Record<string, string>
  );
  asPath?: string;
}> = ({ 
  children,
  pathname = '/',
  query = {},
  asPath = '/'
}) => {
  // This would be replaced with your actual router provider
  return (
    <div data-testid="router-provider" data-pathname={pathname}>
      {children}
    </div>
  );
};

// All app providers wrapped in one component
function AllProviders({ 
  children,
  withRouter = true,
  withTheme = true,
  routerParams = {},
  themeParams = {}
}: WithChildrenProps & {
  withRouter?: boolean;
  withTheme?: boolean;
  routerParams?: any;
  themeParams?: any;
}) {
  let content = <>{children}</>
  );
  // Add theme provider if requested
  if (withTheme) {
    content = (
      <MockThemeProvider theme={themeParams.theme}>
        {content}
      </MockThemeProvider>
    );
  }

  // Add router provider if requested
  if (withRouter) {
    content = (
      <MockRouterProvider 
        pathname={routerParams.pathname}
        query={routerParams.query}
        asPath={routerParams.asPath}
      >
        {content}
      </MockRouterProvider>
    );
  }

  return content;
}

/**
 * Custom render function that includes commonly used providers
 * @param ui - Component to render
 * @param options - Render options including provider flags
 */
function customRender(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { 
    withRouter = true,
    withTheme = true,
    withProviders = true,
    routerParams = {},
    themeParams = {},
    ...renderOptions 
  } = options;

  // If withProviders is false, just render without any providers
  if (!withProviders) {
    return render(uirenderOptions);
  }

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        withRouter={withRouter}
        withTheme={withTheme}
        routerParams={routerParams}
        themeParams={themeParams}
      >
        {children}
      </AllProviders>
    ),
    ...renderOptions});
}

/**
 * Setup user events with the rendered component
 */
function setupUser(jsx: React.ReactElement, options: CustomRenderOptions = {}) {
  const user = userEvent.setup();
  return {
    user,
    ...customRender(jsxoptions)};
}

// Export all utilities
export { customRender, setupUser, AllProviders };

// Export types
export type { CustomRenderOptions };