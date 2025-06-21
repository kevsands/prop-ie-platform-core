#!/usr/bin/env node
// Improve test coverage

const fs = require('fs');
const path = require('path');

console.log('Improving test coverage...\n');

// 1. Create test templates for missing components
const testTemplate = (componentName) => `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
  });

  it('displays the correct title', () => {
    render(<${componentName} />);
    expect(screen.getByText(/${componentName}/i)).toBeInTheDocument();
  });

  // Add more specific tests based on component functionality
});
`;

const apiTestTemplate = (routeName) => `
import { POST, GET } from './${routeName}';
import { NextRequest } from 'next/server';

describe('${routeName} API', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/${routeName}');
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('handles POST requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/${routeName}', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' })
    });
    const response = await POST(request);
    expect(response.status).toBeLessThanOrEqual(201);
  });
});
`;

// Check for components without tests
const componentsDir = path.join('src', 'components');
const componentDirs = ['ui', 'auth', 'buyer', 'developer', 'property'];

componentDirs.forEach(dir => {
  const fullPath = path.join(componentsDir, dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    
    files.forEach(file => {
      if (file.endsWith('.tsx') && !file.includes('.test.')) {
        const componentName = file.replace('.tsx', '');
        const testFile = file.replace('.tsx', '.test.tsx');
        const testPath = path.join(fullPath, testFile);
        
        if (!fs.existsSync(testPath)) {
          fs.writeFileSync(testPath, testTemplate(componentName));
          console.log(`✅ Created test for ${componentName}`);
        }
      }
    });
  }
});

// Create API tests
const apiDir = path.join('src', 'app', 'api');
const apiRoutes = ['auth', 'properties', 'users', 'payments'];

apiRoutes.forEach(route => {
  const testPath = path.join(apiDir, route, `route.test.ts`);
  if (!fs.existsSync(testPath)) {
    fs.writeFileSync(testPath, apiTestTemplate(route));
    console.log(`✅ Created API test for ${route}`);
  }
});

// Create integration test
const integrationTest = `
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '@/app/page';

describe('Integration Tests', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  it('full user journey from homepage to property view', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    );

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText(/properties/i)).toBeInTheDocument();
    });

    // Click on a property
    const propertyCard = screen.getAllByRole('article')[0];
    await userEvent.click(propertyCard);

    // Verify navigation
    await waitFor(() => {
      expect(screen.getByText(/property details/i)).toBeInTheDocument();
    });
  });
});
`;

fs.writeFileSync(path.join('__tests__', 'integration', 'user-journey.test.tsx'), integrationTest);
console.log('✅ Created integration test');

// Update jest config for coverage thresholds
const jestConfig = JSON.parse(fs.readFileSync('jest.config.json', 'utf8'));
jestConfig.coverageThreshold = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
};

fs.writeFileSync('jest.config.json', JSON.stringify(jestConfig, null, 2));
console.log('✅ Updated jest config with coverage thresholds');

console.log('\nTest coverage improvements complete!');
console.log('Run "npm test -- --coverage" to check coverage.');