// Simple React.cache polyfill for Next.js 15.3.1
// This file is a helper to ensure React.cache is available consistently
// across different environments

// This module patches React to ensure cache is available
// It's needed because Next.js uses React.cache in some environments
// but it's not consistently available across all React versions

const React = require('react');

// Only add cache if it doesn't exist
if (!React.cache) {
  console.log('Adding React.cache polyfill');
  // Basic in-memory cache implementation
  React.cache = function cache(fn) {
    const cacheMap = new Map();
  
    const cachedFn = (...args) => {
      const key = JSON.stringify(args);
      if (cacheMap.has(key)) {
        return cacheMap.get(key);
      }
      
      const result = fn(...args);
      cacheMap.set(key, result);
      return result;
    };
  
    return cachedFn;
  };
}

module.exports = React;