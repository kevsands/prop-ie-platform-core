import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from "path";
import { fileURLToPath } from 'url';

// Get the current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to resolve paths
function getAbsolutePath(value: string): string {
  return join(__dirname, '../node_modules', value);
}

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: true
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: ['../public'],
};

export default config;