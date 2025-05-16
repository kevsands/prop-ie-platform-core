import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

// Configure Storybook UI 
addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'PropIE UI Components',
    brandUrl: '/assets/prop-logo.jpg',
    brandTarget: '_self',
    colorPrimary: '#4f46e5', // Indigo color from Tailwind
    colorSecondary: '#3b82f6', // Blue color from Tailwind
  },
  sidebar: {
    showRoots: true,
  },
});