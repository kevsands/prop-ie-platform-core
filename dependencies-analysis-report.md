# Dependencies and Code Paths Analysis Report

## General Statistics

- Total files analyzed: 1
- Circular dependencies found: 0
- Unused files: 1
- Duplicated packages: 0
- Unused declared dependencies: 138
- Missing dependencies: 0

## Circular Dependencies

No circular dependencies found.

## Unused Files

The following files are not imported by any other file (starting from the entry point):

- `src/pages/_app.tsx`

> **Note**: Some of these files might be used dynamically or via non-standard imports that couldn't be detected.

## Duplicated Packages

No package duplications found.

## Package.json Analysis

### Unused Declared Dependencies

The following dependencies are declared in package.json but not imported in the code:

- `@aws-amplify/api`
- `@aws-amplify/auth`
- `@aws-amplify/core`
- `@aws-amplify/storage`
- `@aws-amplify/ui-react`
- `@heroicons/react`
- `@hookform/resolvers`
- `@prisma/client`
- `@radix-ui/react-accordion`
- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-label`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-popover`
- `@radix-ui/react-progress`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-slider`
- `@radix-ui/react-slot`
- `@radix-ui/react-switch`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toast`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@radix-ui/react-tooltip`
- `@react-three/drei`
- `@react-three/fiber`
- `@tanstack/react-query`
- `@tanstack/react-query-devtools`
- `@types/bcryptjs`
- `@types/crypto-js`
- `aws-amplify`
- `axios`
- `bcryptjs`
- `buffer`
- `caniuse-lite`
- `chart.js`
- `class-variance-authority`
- `clsx`
- `cmdk`
- `cors`
- `crypto-browserify`
- `crypto-js`
- `date-fns`
- `drizzle-orm`
- `embla-carousel-react`
- `express`
- `framer-motion`
- `gsap`
- `helmet`
- `input-otp`
- `kafka-node`
- `leaflet`
- `lucide-react`
- `mongodb`
- `next`
- `next-auth`
- `next-themes`
- `pg`
- `prisma`
- `r3f-perf`
- `react`
- `react-chartjs-2`
- `react-day-picker`
- `react-dom`
- `react-error-boundary`
- `react-hook-form`
- `react-icons`
- `react-resizable-panels`
- `recharts`
- `socket.io-client`
- `sonner`
- `stream-browserify`
- `tailwind-merge`
- `tailwindcss-animate`
- `three`
- `uuid`
- `vaul`
- `winston`
- `zod`
- `@axe-core/puppeteer`
- `@cloudflare/workers-types`
- `@cyclonedx/cyclonedx-npm`
- `@next/bundle-analyzer`
- `@storybook/addon-a11y`
- `@storybook/addon-controls`
- `@storybook/addon-docs`
- `@storybook/addon-essentials`
- `@storybook/addon-interactions`
- `@storybook/addon-links`
- `@storybook/addon-onboarding`
- `@storybook/addon-storysource`
- `@storybook/blocks`
- `@storybook/react`
- `@storybook/react-vite`
- `@types/axios`
- `@types/cors`
- `@types/express`
- `@types/helmet`
- `@types/kafka-node`
- `@types/node`
- `@types/pg`
- `@types/react`
- `@types/react-dom`
- `@types/three`
- `chalk`
- `critters`
- `cross-env`
- `cypress`
- `cypress-axe`
- `cypress-browser-permissions`
- `cypress-file-upload`
- `cypress-localstorage-commands`
- `cypress-wait-until`
- `husky`
- `lighthouse-ci`
- `lint-staged`
- `madge`
- `msw`
- `ora`
- `postcss`
- `process`
- `prompts`
- `puppeteer`
- `storybook`
- `tailwindcss`
- `turbo`
- `wrangler`

> **Note**: Some of these might be used indirectly or in scripts not analyzed.

## Code Paths Analysis

### Heavily Imported Files

No files are imported by many other files.

### Isolated Modules

The following modules neither import nor are imported by other files (they might be unused or dynamically imported):

- `src/pages/_app.tsx`

### Leaf Components

The following files are imported by other files but don't import any project files themselves:

- `src/pages/_app.tsx`

## Recommendations

- Review and potentially remove unused files to reduce bundle size
- Review and potentially remove unused dependencies from package.json
