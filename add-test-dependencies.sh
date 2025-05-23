#!/bin/bash

# Add missing test dependencies

echo "📦 Adding test dependencies..."

# Performance testing
npm install --save-dev @playwright/test autocannon

# Test utilities
npm install --save-dev @faker-js/faker jest-mock-extended

# Additional testing tools
npm install --save-dev msw node-mocks-http speakeasy

echo "✅ Test dependencies added successfully!"