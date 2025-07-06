# Security Code Review Checklist for React/Next.js Applications

This document provides a comprehensive security-focused code review checklist specifically tailored for React and Next.js applications. Use this checklist when reviewing code to identify and address security issues before they make it to production.

## Authentication & Authorization

- [ ] **Token handling**
  - [ ] Tokens are stored securely (HTTP-only cookies preferred over localStorage)
  - [ ] Access tokens have appropriate expiry times
  - [ ] Refresh token mechanism is implemented securely
  - [ ] Logout functionality properly clears all tokens

- [ ] **Authentication flows**
  - [ ] Login endpoints use proper rate limiting
  - [ ] Multi-factor authentication is properly implemented (if applicable)
  - [ ] Password reset flows are secure (time-limited tokens, email verification)
  - [ ] Registration process includes proper validation

- [ ] **Protected routes**
  - [ ] Server-side authentication checks are in place (`getServerSideProps`, middleware, or API routes)
  - [ ] Client-side redirects are used as UX improvements, not security controls
  - [ ] Role-based access control is correctly implemented

## Data Validation & Sanitization

- [ ] **Input validation**
  - [ ] All user inputs have proper validation (preferably with Zod or similar)
  - [ ] Validation occurs server-side, not just client-side
  - [ ] Input size limits are enforced to prevent DoS attacks
  - [ ] Validation error messages don't leak sensitive information

- [ ] **Output encoding**
  - [ ] User-generated content is properly encoded before display
  - [ ] No use of `dangerouslySetInnerHTML` without proper sanitization
  - [ ] HTML sanitization is used when rendering user-generated markdown or rich text

- [ ] **Query parameters & URL handling**
  - [ ] URL parameters are validated and sanitized
  - [ ] No sensitive data is exposed in URLs
  - [ ] Dynamic routes have proper parameter validation

## React-specific Security

- [ ] **Component security**
  - [ ] No use of `eval()` or similar dynamic code execution functions
  - [ ] No direct DOM manipulation outside of React's rendering cycle
  - [ ] No use of `innerHTML` or other unsafe DOM properties
  - [ ] Custom hooks follow the Rules of Hooks

- [ ] **State management**
  - [ ] Sensitive data is not stored in client-side state
  - [ ] State updates are handled safely (no direct state mutation)
  - [ ] Forms implement proper CSRF protection
  - [ ] No leaking of state between different users/sessions

- [ ] **Rendering & Props**
  - [ ] No unsafe attribute assignments from user input (e.g., `href`, `src`)
  - [ ] Props are properly validated with TypeScript or PropTypes
  - [ ] User-controlled values are not used directly in `style` attributes
  - [ ] Safe usage of dynamic imports and lazy loading

## Next.js-specific Security

- [ ] **API routes**
  - [ ] Proper authentication and authorization in API routes
  - [ ] API rate limiting is implemented
  - [ ] Appropriate HTTP methods are enforced
  - [ ] Error responses don't leak sensitive information

- [ ] **Middleware**
  - [ ] Security-relevant middleware is correctly configured
  - [ ] Middleware runs on all appropriate paths
  - [ ] Security headers are properly set

- [ ] **Server-side rendering**
  - [ ] Sensitive data isn't exposed in initial props
  - [ ] No secrets or credentials leaking to client-side
  - [ ] `getServerSideProps` and `getStaticProps` implement proper error handling

- [ ] **Routing**
  - [ ] No open redirects in navigation logic
  - [ ] Route params are properly validated
  - [ ] 404 and error pages are properly implemented

## Data Handling & API Security

- [ ] **API calls**
  - [ ] API endpoints have proper error handling
  - [ ] Timeouts are implemented on all API calls
  - [ ] API responses are validated before use
  - [ ] Sensitive data is not logged to console

- [ ] **Fetch & Axios usage**
  - [ ] Credentials mode is properly set
  - [ ] Appropriate headers are used (Content-Type, Authorization)
  - [ ] URLs in fetch calls don't contain sensitive data
  - [ ] No hardcoded API keys or tokens in client-side code

- [ ] **File uploads & downloads**
  - [ ] File uploads have proper validation (type, size, content)
  - [ ] Downloads use safe Content-Disposition headers
  - [ ] File operations occur server-side, not client-side

## Secure Coding Patterns

- [ ] **Safe use of dependencies**
  - [ ] All dependencies are from trusted sources
  - [ ] Dependencies are kept up-to-date
  - [ ] Third-party scripts have integrity hashes

- [ ] **Error handling**
  - [ ] Error boundaries are used to catch and handle errors
  - [ ] No sensitive information in error messages shown to users
  - [ ] Proper error logging with appropriate detail levels

- [ ] **Secrets management**
  - [ ] No hardcoded secrets, API keys, or credentials in code
  - [ ] Environment variables are properly used
  - [ ] Proper use of `.env` files (no committed secrets)

- [ ] **Client-side security**
  - [ ] No sensitive calculations that should be server-side
  - [ ] No business logic that could be bypassed client-side
  - [ ] CSP nonces are used with inline scripts (if applicable)

## Examples of Good vs. Bad Patterns

### Authentication

❌ **Bad**:
```javascript
// Storing tokens in localStorage
localStorage.setItem('token', response.token);

// Client-side only auth check
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Redirect to="/login" />;
};
```

✅ **Good**:
```javascript
// Using HTTP-only cookies
// In API route:
res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict`);

// Server-side authentication in Next.js
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: { user: session.user } };
}
```

### Content Rendering

❌ **Bad**:
```jsx
// Directly using dangerouslySetInnerHTML with unsanitized data
function Comment({ data }) {
  return <div dangerouslySetInnerHTML={{ __html: data.comment }} />;
}
```

✅ **Good**:
```jsx
// Using a sanitization library
import DOMPurify from 'dompurify';

function Comment({ data }) {
  const sanitizedComment = DOMPurify.sanitize(data.comment);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedComment }} />;
}

// Even better: Use a markdown library that handles sanitization
import ReactMarkdown from 'react-markdown';

function Comment({ data }) {
  return <ReactMarkdown>{data.comment}</ReactMarkdown>;
}
```

### API Calls

❌ **Bad**:
```jsx
// Not validating or handling errors properly
const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  setData(data);
};
```

✅ **Good**:
```jsx
// Proper error handling and validation
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    
    // Validate response data with Zod
    const validatedData = DataSchema.parse(data);
    setData(validatedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Failed to load data. Please try again.');
  }
};
```

### URL Handling

❌ **Bad**:
```jsx
// Potential open redirect vulnerability
function Redirect() {
  const { redirect } = useRouter().query;
  
  useEffect(() => {
    if (redirect) {
      window.location.href = redirect;
    }
  }, [redirect]);
  
  return <div>Redirecting...</div>;
}
```

✅ **Good**:
```jsx
// Safe redirect handling
function Redirect() {
  const { redirect } = useRouter().query;
  const router = useRouter();
  
  useEffect(() => {
    if (redirect && typeof redirect === 'string') {
      // Only allow relative URLs or specific domains
      if (redirect.startsWith('/') || isAllowedDomain(redirect)) {
        router.push(redirect);
      } else {
        // Log attempted redirect to suspicious domain
        console.error('Attempted redirect to unauthorized domain:', redirect);
        router.push('/error?code=invalid_redirect');
      }
    }
  }, [redirect, router]);
  
  return <div>Redirecting...</div>;
}

function isAllowedDomain(url) {
  try {
    const urlObj = new URL(url);
    const allowedDomains = ['example.com', 'sub.example.com'];
    return allowedDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
}
```

## Pull Request Security Review Process

1. **Automated checks**: Ensure all security-focused linting and automated tests pass
2. **Manual review**: A designated reviewer should explicitly check items on this list
3. **Threat modeling**: For significant changes, consider potential attack vectors
4. **Documentation**: Security-relevant changes should include updated documentation
5. **Follow-up**: Flag any potential issues that may require further investigation

## Additional Resources

- [OWASP Top 10 for React](https://github.com/OWASP/owasp-top-10-for-frontend)
- [Next.js Security Documentation](https://nextjs.org/docs/authentication)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Web Security Guide by Google](https://developers.google.com/web/fundamentals/security)