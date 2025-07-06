module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended',
    'plugin:react-security/recommended',
    'next/core-web-vitals'
  ],
  plugins: [
    '@typescript-eslint',
    'security',
    'react-security',
    'no-unsanitized'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // React security rules
    'react-security/no-dangerously-set-innerhtml': 'error',
    'react-security/no-find-dom-node': 'error',
    'react-security/no-ref': 'warn',

    // No unsanitized rules (prevent XSS)
    'no-unsanitized/method': 'error',
    'no-unsanitized/property': 'error',

    // General security rules
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-object-injection': 'warn', // Can cause false positives, so warn instead of error
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-unsafe-regex': 'error',

    // React-specific rules
    'react/no-danger': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
    'react/jsx-pascal-case': 'error', // Prevents potential confusion with HTML elements

    // Best practices for Next.js
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-sync-scripts': 'error',

    // JavaScript security best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-useless-escape': 'error',

    // Custom security rules
    'no-alert': 'error', // Prevents usage of window.alert
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Allows console.warn/error for warnings
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='setTimeout'][arguments.length<2]",
        message: 'setTimeout must always be called with two arguments.'
      },
      {
        selector: "CallExpression[callee.name='setInterval'][arguments.length<2]",
        message: 'setInterval must always be called with two arguments.'
      },
      {
        selector: "CallExpression[callee.object.name='window'][callee.property.name='open']",
        message: 'window.open is potentially unsafe and should be avoided.'
      },
      {
        selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
        message: 'document.write is unsafe and should be avoided.'
      },
      {
        selector: "AssignmentExpression[left.property.name='innerHTML']",
        message: 'innerHTML is unsafe and should be avoided. Use textContent or a React component instead.'
      },
      {
        selector: "AssignmentExpression[left.property.name='outerHTML']",
        message: 'outerHTML is unsafe and should be avoided. Use a React component instead.'
      }
    ],

    // Custom rules for preventing redirection attacks
    'no-restricted-properties': [
      'error',
      {
        object: 'window',
        property: 'location',
        message: 'Use Next.js router or a controlled component for navigation instead.'
      },
      {
        object: 'document',
        property: 'location',
        message: 'Use Next.js router or a controlled component for navigation instead.'
      },
      {
        object: 'location',
        property: 'href',
        message: 'Direct assignment to location.href is unsafe. Use Next.js router instead.'
      }
    ]
  },
  // Specific overrides for certain file patterns
  overrides: [
    {
      files: ['**/pages/**', '**/app/**'],
      rules: {
        // Stricter rules for pages and app directories
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'next/script',
                importNames: ['Script'],
                message: 'Ensure Script components are used securely. Add a nonce when possible.'
              }
            ]
          }
        ]
      }
    }
  ]
};