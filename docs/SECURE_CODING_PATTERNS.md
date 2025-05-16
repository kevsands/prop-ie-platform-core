# Secure Coding Patterns for Next.js and React

This guide provides secure coding patterns and best practices for common operations in Next.js and React applications. Following these patterns will help prevent security vulnerabilities in your codebase.

## Table of Contents

1. [Authentication](#authentication)
2. [Data Validation](#data-validation)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Form Handling](#form-handling)
6. [Rendering User Content](#rendering-user-content)
7. [URL Handling](#url-handling)
8. [File Operations](#file-operations)
9. [Error Handling](#error-handling)
10. [Secrets Management](#secrets-management)

## Authentication

### Secure Token Storage

**❌ Avoid:**
```javascript
// Storing tokens in localStorage
const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Reading token directly from localStorage
const getToken = () => localStorage.getItem('authToken');
```

**✅ Recommended:**
```javascript
// Using HTTP-only cookies (in API route)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Authenticate user...
    const token = generateToken(user);
    
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`,
    ]);
    
    res.status(200).json({ success: true });
  }
}
```

### Authentication Checks

**❌ Avoid:**
```javascript
// Client-side only auth checks
function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <DashboardContent />;
}
```

**✅ Recommended:**
```javascript
// Server-side authentication with Next.js
// In pages/dashboard.js or app/dashboard/page.js
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
  
  return {
    props: {
      user: session.user,
    },
  };
}

// For App Router (middleware.ts)
export function middleware(request) {
  const token = request.cookies.get('token');
  
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
```

### Proper Logout

**❌ Avoid:**
```javascript
// Just clearing local storage
const logout = () => {
  localStorage.removeItem('token');
  navigate('/login');
};
```

**✅ Recommended:**
```javascript
// Full logout process
const logout = async () => {
  try {
    // Call server to invalidate session/token
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    // Clear any client state
    queryClient.clear();
    
    // Redirect to login
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// In API route (pages/api/auth/logout.js)
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Clear the cookie
    res.setHeader('Set-Cookie', [
      'token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    ]);
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## Data Validation

### Client-side Validation

**❌ Avoid:**
```javascript
// Only client-side validation
function RegistrationForm() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple client-side validation
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    
    // Submit data...
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    });
  };
  
  // Rest of component...
}
```

**✅ Recommended:**
```javascript
// Client-side validation with Zod + server-side validation
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema that will be reused on server and client
export const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UserSchema)
  });
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }
      
      // Handle success...
    } catch (error) {
      // Handle error...
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      
      <button type="submit">Register</button>
    </form>
  );
}

// API route (server-side validation)
import { UserSchema } from '@/schemas/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Validate with the same schema
      const validatedData = UserSchema.parse(req.body);
      
      // Process valid data...
      
      res.status(200).json({ success: true });
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### Query Parameter Validation

**❌ Avoid:**
```javascript
// Unvalidated query parameters
function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);
  
  // Rest of component...
}
```

**✅ Recommended:**
```javascript
// Validated query parameters
import { z } from 'zod';

const ProductQuerySchema = z.object({
  id: z.string().uuid('Invalid product ID')
});

function ProductPage() {
  const router = useRouter();
  const [validationError, setValidationError] = useState(null);
  
  useEffect(() => {
    if (!router.isReady) return;
    
    try {
      // Validate query parameters
      const { id } = ProductQuerySchema.parse(router.query);
      fetchProduct(id);
    } catch (error) {
      setValidationError('Invalid product ID');
      console.error('Query validation error:', error);
    }
  }, [router.isReady, router.query]);
  
  if (validationError) {
    return <div>Error: {validationError}</div>;
  }
  
  // Rest of component...
}

// Even better: validate in getServerSideProps
export async function getServerSideProps(context) {
  try {
    const { id } = ProductQuerySchema.parse(context.query);
    
    const product = await fetchProduct(id);
    
    return {
      props: { product }
    };
  } catch (error) {
    return {
      notFound: true // Return 404 page
    };
  }
}
```

## State Management

### Secure State Handling

**❌ Avoid:**
```javascript
// Storing sensitive data in client state
function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    creditCardNumber: '1234-5678-9012-3456',
    ssn: '123-45-6789'
  });
  
  // Rest of component...
}
```

**✅ Recommended:**
```javascript
// Only store necessary data in client state
function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    // No sensitive data stored in client state
  });
  
  // For operations requiring sensitive data, make API calls instead
  const updatePaymentMethod = async (paymentDetails) => {
    const response = await fetch('/api/user/payment-method', {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    
    // Handle response...
  };
  
  // Rest of component...
}
```

### Preventing State Leakage

**❌ Avoid:**
```javascript
// Global state without access control
const globalState = createGlobalState({
  userProfile: null,
  adminDashboardData: null,
  systemSettings: null
});

function AdminDashboard() {
  const { adminDashboardData, setAdminDashboardData } = useGlobalState();
  
  // Any component can access admin data!
  
  // Rest of component...
}
```

**✅ Recommended:**
```javascript
// Scoped state with access control
import { useSession } from 'next-auth/react';

// Regular user state
const userState = createStore({
  profile: null,
  preferences: null
});

// Admin state - separate from user state
const adminState = createStore({
  dashboardData: null,
  systemSettings: null
});

function AdminDashboard() {
  const { data: session } = useSession();
  const { dashboardData, setDashboardData } = useAdminState();
  
  // Check role before allowing access
  if (!session || session.user.role !== 'admin') {
    return <AccessDenied />;
  }
  
  // Rest of component for authenticated admins...
}

// Custom hook with role checking
function useAdminState() {
  const { data: session } = useSession();
  
  // Block access to state for non-admins
  if (!session || session.user.role !== 'admin') {
    return {
      dashboardData: null,
      setDashboardData: () => {
        console.error('Unauthorized access attempt to admin state');
      }
    };
  }
  
  // Only admins get real state access
  return adminState();
}
```

## API Integration

### Secure API Calls

**❌ Avoid:**
```javascript
// Unvalidated API calls
async function fetchData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}

// Error-prone error handling
async function submitForm(data) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return await response.json();
}
```

**✅ Recommended:**
```javascript
// Validated API calls with proper error handling
import { z } from 'zod';

const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
  createdAt: z.string().transform(str => new Date(str))
});

async function fetchData(userId) {
  try {
    // Parameter validation
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }
    
    const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
      credentials: 'include', // Include cookies for auth
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const rawData = await response.json();
    
    // Validate response data
    const validatedData = UserResponseSchema.parse(rawData);
    return validatedData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// With React Query for better caching and error handling
function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchData(userId),
    enabled: !!userId,
    retry: (failureCount, error) => {
      // Don't retry on 404 or 401
      if (error.status === 404 || error.status === 401) {
        return false;
      }
      return failureCount < 3;
    }
  });
}
```

### API Request Timeouts

**❌ Avoid:**
```javascript
// No timeout handling
async function fetchLargeData() {
  const response = await fetch('/api/large-data');
  const data = await response.json();
  return data;
}
```

**✅ Recommended:**
```javascript
// With timeout handling
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Usage
try {
  const data = await fetchWithTimeout('/api/large-data', {}, 5000);
  // Handle data
} catch (error) {
  // Handle timeout or other errors
}
```

## Form Handling

### Secure Form Submission

**❌ Avoid:**
```javascript
// No CSRF protection
function LoginForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data)),
      headers: { 'Content-Type': 'application/json' }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

**✅ Recommended:**
```javascript
// With CSRF protection and secure practices
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema)
  });
  
  const onSubmit = async (data) => {
    try {
      // Get CSRF token from cookie or meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div>
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          type="email"
          autoComplete="username"
          {...register('email')}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      
      <button type="submit">Login</button>
    </form>
  );
}

// In Next.js API route with CSRF protection
import { csrf } from 'nextjs-csrf';

const csrfConfig = {
  cookieName: 'csrf-token',
  secretKey: process.env.CSRF_SECRET_KEY,
};

export default csrf(csrfConfig)(async function handler(req, res) {
  if (req.method === 'POST') {
    // Process login...
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
});
```

### Rate Limiting Form Submissions

**❌ Avoid:**
```javascript
// No rate limiting
function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit form...
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

**✅ Recommended:**
```javascript
// With client-side + server-side rate limiting
import { useState } from 'react';
import { useSubmitLimiter } from '@/hooks/useSubmitLimiter';

function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom hook to limit submissions
  const { canSubmit, trackSubmission, attempts, timeRemaining } = useSubmitLimiter({
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minute
    key: 'login-form'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit) {
      return; // Don't allow submission
    }
    
    setIsSubmitting(true);
    trackSubmission(); // Track this attempt
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        // Handle error...
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {!canSubmit && (
        <div className="error">
          Too many login attempts. Please wait {Math.ceil(timeRemaining / 1000)} seconds.
        </div>
      )}
      
      <button type="submit" disabled={isSubmitting || !canSubmit}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// useSubmitLimiter.js
export function useSubmitLimiter({ maxAttempts, windowMs, key }) {
  const storageKey = `ratelimit-${key}`;
  
  const [attempts, setAttempts] = useState(() => {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return 0;
      
      const { attempts, timestamp } = JSON.parse(stored);
      
      // Check if rate limit window has passed
      if (Date.now() - timestamp > windowMs) {
        return 0;
      }
      
      return attempts;
    } catch (e) {
      return 0;
    }
  });
  
  const [lastAttempt, setLastAttempt] = useState(() => {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return 0;
      
      const { timestamp } = JSON.parse(stored);
      return timestamp;
    } catch (e) {
      return 0;
    }
  });
  
  const canSubmit = attempts < maxAttempts;
  const timeRemaining = Math.max(0, windowMs - (Date.now() - lastAttempt));
  
  const trackSubmission = () => {
    const now = Date.now();
    
    // Reset if outside window
    const newAttempts = (now - lastAttempt > windowMs) ? 1 : attempts + 1;
    
    setAttempts(newAttempts);
    setLastAttempt(now);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({
        attempts: newAttempts,
        timestamp: now
      }));
    }
  };
  
  return { canSubmit, trackSubmission, attempts, timeRemaining };
}

// Server-side middleware for rate limiting
import rateLimit from 'express-rate-limit';

// Create limiter middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit headers
});

// Apply to API route
export default function handler(req, res) {
  return loginLimiter(req, res, () => {
    if (req.method === 'POST') {
      // Process login...
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
```

## Rendering User Content

### Safe Content Rendering

**❌ Avoid:**
```javascript
// Unsafe rendering of user-provided content
function Comment({ comment }) {
  return (
    <div className="comment">
      <div dangerouslySetInnerHTML={{ __html: comment.content }} />
    </div>
  );
}
```

**✅ Recommended:**
```javascript
// Safe rendering with proper sanitization
import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked with security in mind
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

// Set defaults for secure rendering
marked.use({ 
  gfm: true,
  breaks: true,
  pedantic: false,
  sanitize: false, // We'll use DOMPurify instead for more control
  silent: false
});

function Comment({ comment }) {
  const renderContent = () => {
    if (!comment.content) return null;
    
    try {
      // Convert markdown to HTML
      const rawHtml = marked.parse(comment.content);
      
      // Sanitize HTML with specific allowed tags
      const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: [['target', '_blank'], ['rel', 'noopener noreferrer']],
        USE_PROFILES: { html: true }
      });
      
      return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    } catch (error) {
      console.error('Error rendering content:', error);
      return <div className="error">Error rendering content</div>;
    }
  };
  
  return (
    <div className="comment">
      <h3>{comment.author}</h3>
      <div className="content">{renderContent()}</div>
      <span className="date">{new Date(comment.date).toLocaleDateString()}</span>
    </div>
  );
}
```

### Safe Attribute Handling

**❌ Avoid:**
```javascript
// User-controlled attributes without validation
function UserProfile({ profile }) {
  return (
    <div className="profile">
      <h2>{profile.name}</h2>
      <img src={profile.avatar} alt={profile.name} />
      <a href={profile.website}>Visit Website</a>
    </div>
  );
}
```

**✅ Recommended:**
```javascript
// Safe attribute handling
function UserProfile({ profile }) {
  // Sanitize URL attributes
  const sanitizeUrl = (url) => {
    if (!url) return '';
    
    try {
      const parsed = new URL(url);
      
      // Only allow http and https protocols
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        console.warn(`Blocked unsafe URL: ${url}`);
        return '';
      }
      
      return url;
    } catch (e) {
      // Not a valid URL
      console.warn(`Invalid URL: ${url}`);
      return '';
    }
  };
  
  // Avatar URL validation
  const safeAvatarUrl = profile.avatar 
    ? sanitizeUrl(profile.avatar) 
    : '/default-avatar.png';
  
  // Website URL validation
  const safeWebsiteUrl = sanitizeUrl(profile.website);
  
  return (
    <div className="profile">
      <h2>{profile.name}</h2>
      
      <img 
        src={safeAvatarUrl} 
        alt={profile.name} 
        onError={(e) => { e.target.src = '/default-avatar.png'; }}
      />
      
      {safeWebsiteUrl && (
        <a 
          href={safeWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </a>
      )}
    </div>
  );
}
```

## URL Handling

### Safe URL Navigation

**❌ Avoid:**
```javascript
// Unsafe URL handling
function Redirect() {
  const router = useRouter();
  const { url } = router.query;
  
  useEffect(() => {
    if (url) {
      window.location.href = url;
    }
  }, [url]);
  
  return <div>Redirecting...</div>;
}
```

**✅ Recommended:**
```javascript
// Safe URL handling
function Redirect() {
  const router = useRouter();
  const { url } = router.query;
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!url) return;
    
    // Only allow relative URLs or specific domains
    const isSafeUrl = (urlString) => {
      try {
        // Check if it's a relative URL
        if (urlString.startsWith('/')) return true;
        
        const url = new URL(urlString);
        
        // List of allowed domains
        const allowedDomains = [
          'example.com',
          'www.example.com',
          'api.example.com'
        ];
        
        return allowedDomains.includes(url.hostname);
      } catch {
        return false;
      }
    };
    
    if (isSafeUrl(url)) {
      // Use Next.js router for relative URLs
      if (url.startsWith('/')) {
        router.push(url);
      } else {
        // Use window.location only for vetted external URLs
        window.location.href = url;
      }
    } else {
      setError('Redirect to disallowed URL prevented');
      console.error(`Blocked redirect to unsafe URL: ${url}`);
    }
  }, [url, router]);
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return <div>Redirecting...</div>;
}
```

### Dynamic Route Parameters

**❌ Avoid:**
```javascript
// Unvalidated dynamic route parameters
function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);
  
  // Rest of component...
}
```

**✅ Recommended:**
```javascript
// Validated dynamic route parameters
function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  
  useEffect(() => {
    if (!id) return;
    
    // Validate ID format (e.g., UUID, numeric ID, slug)
    const isValidId = (id) => {
      // Example validation for numeric ID
      return /^\d+$/.test(id);
      
      // Or for UUID
      // return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      // Or for slug
      // return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
    };
    
    if (isValidId(id)) {
      fetch(`/api/products/${encodeURIComponent(id)}`)
        .then(res => {
          if (!res.ok) throw new Error('Product not found');
          return res.json();
        })
        .then(data => setProduct(data))
        .catch(err => setError(err.message));
    } else {
      setError('Invalid product ID');
      router.push('/products'); // Redirect to products list
    }
  }, [id, router]);
  
  // Rest of component with error handling...
}

// Even better: server-side validation
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  // Validate ID format
  if (!/^\d+$/.test(id)) {
    return {
      notFound: true // Return 404 page
    };
  }
  
  try {
    const product = await fetchProduct(id);
    
    if (!product) {
      return { notFound: true };
    }
    
    return {
      props: { product }
    };
  } catch (error) {
    return {
      props: { error: 'Failed to load product' }
    };
  }
}
```

## File Operations

### Secure File Uploads

**❌ Avoid:**
```javascript
// Unsafe file upload handling
function FileUpload() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  );
}

// Server-side handling without proper validation
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const formData = await parseFormData(req);
    const file = formData.file;
    
    const filePath = path.join(process.cwd(), 'public/uploads', file.name);
    
    // Write file directly
    fs.writeFileSync(filePath, file.data);
    
    res.status(200).json({ success: true, path: `/uploads/${file.name}` });
  }
}
```

**✅ Recommended:**
```javascript
// Safe file upload handling
import { useState } from 'react';
import { z } from 'zod';

// Define file validation schema
const FileSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max
    { message: 'File size must be less than 5MB' }
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
    { message: 'Only JPEG, PNG, WebP images and PDF files are allowed' }
  )
});

function FileUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const validateFile = (selectedFile) => {
    try {
      FileSchema.parse({ file: selectedFile });
      setFile(selectedFile);
      setError('');
    } catch (validationError) {
      setError(validationError.errors[0].message);
      setFile(null);
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    validateFile(selectedFile);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setLoading(true);
    setProgress(0);
    
    try {
      // Create upload form
      const formData = new FormData();
      formData.append('file', file);
      
      // Generate file hash for integrity check
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      formData.append('checksum', hashHex);
      
      // Use fetch with upload progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          // Handle success
        } else {
          setError('Upload failed: ' + xhr.statusText);
        }
        setLoading(false);
      });
      
      xhr.addEventListener('error', () => {
        setError('Network error during upload');
        setLoading(false);
      });
      
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (error) {
      setError('Upload failed: ' + error.message);
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Select file</label>
        <input 
          id="file"
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp,application/pdf"
        />
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {file && (
        <div className="file-info">
          <p>Name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )}
      
      {loading && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
          <span>{progress}%</span>
        </div>
      )}
      
      <button 
        type="submit"
        disabled={!file || loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

// Server-side handler with proper validation
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse form data
    const form = new formidable.IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: (part) => {
        // Filter for allowed file types
        return part.mimetype && ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(part.mimetype);
      }
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = files.file[0];
    
    // Security: Validate file again server-side
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    // Verify file size
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large' });
    }
    
    // Generate safe filename
    const ext = path.extname(file.originalFilename);
    const timestamp = Date.now();
    const safeFilename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}${ext}`;
    
    // Calculate checksum for integrity verification
    const fileBuffer = fs.readFileSync(file.filepath);
    const checksum = createHash('sha256').update(fileBuffer).digest('hex');
    
    // Verify checksum matches client claim
    if (fields.checksum && fields.checksum[0] !== checksum) {
      return res.status(400).json({ error: 'File integrity check failed' });
    }
    
    // Define upload directory - outside public folder for security
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const destPath = path.join(uploadDir, safeFilename);
    
    // Copy file to destination
    fs.copyFileSync(file.filepath, destPath);
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    // Track upload in database (recommended)
    await saveUploadRecord({
      filename: safeFilename,
      originalName: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      path: destPath,
      checksum,
      userId: req.session.userId // If using authentication
    });
    
    // Return success but don't expose direct file path
    // Instead, set up a separate endpoint to serve files securely
    res.status(200).json({ 
      success: true, 
      fileId: 'file-123' // Database ID or reference
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
```

### Secure File Downloads

**❌ Avoid:**
```javascript
// Unsafe file downloading
export default function handler(req, res) {
  const { filename } = req.query;
  
  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  fs.createReadStream(filePath).pipe(res);
}
```

**✅ Recommended:**
```javascript
// Secure file downloading
export default async function handler(req, res) {
  // Require authentication first
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Use a file ID rather than filename
  const { fileId } = req.query;
  
  if (!fileId || typeof fileId !== 'string' || !/^[a-zA-Z0-9-_]+$/.test(fileId)) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }
  
  try {
    // Look up file in database
    const fileRecord = await getFileById(fileId);
    
    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check permissions
    const canAccessFile = await userCanAccessFile(session.user.id, fileRecord.id);
    if (!canAccessFile) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate file path (make sure it's in the right directory)
    const uploadDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, fileRecord.filename);
    
    // Check that the path doesn't navigate outside the uploads directory
    if (!filePath.startsWith(uploadDir)) {
      console.error('Path traversal attempt:', filePath);
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check file exists
    if (!fs.existsSync(filePath)) {
      console.error('File missing from disk:', filePath);
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set appropriate content type
    const contentType = fileRecord.mimetype || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // Set secure download headers
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileRecord.originalName)}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Stream file to response
    const stream = fs.createReadStream(filePath);
    stream.on('error', (error) => {
      console.error('Error streaming file:', error);
      // Handling error after headers have been sent
      res.end();
    });
    
    stream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}
```

## Error Handling

### Secure Error Management

**❌ Avoid:**
```javascript
// Unsafe error handling
function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        console.error('Error details:', err);
        setError(`Failed to load user: ${err.message}`);
      });
  }, []);
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  // Rest of component...
}

// API route with sensitive error details
export default async function handler(req, res) {
  try {
    const user = await getUserFromDatabase(req.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: `Database error: ${error.message}`,
      stack: error.stack,
      query: error.query // Might expose SQL query!
    });
  }
}
```

**✅ Recommended:**
```javascript
// Secure error handling
import { ErrorBoundary } from 'react-error-boundary';

// Client-side error handling
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong</h2>
      <p className="error-message">
        {/* Show generic message to user, not detailed error */}
        We couldn't load your profile. Please try again.
      </p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function UserProfile() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await fetch('/api/user');
      
      if (!res.ok) {
        // Parse error response
        const errorData = await res.json().catch(() => ({}));
        
        // Create error with appropriate user-facing message
        const error = new Error(errorData.message || 'Failed to load profile');
        
        // Add status for handling specific status codes
        error.status = res.status;
        
        // Add request ID for correlation if available
        if (res.headers.get('X-Request-ID')) {
          error.requestId = res.headers.get('X-Request-ID');
        }
        
        // Log detailed error for debugging (not exposed to user)
        console.error('API Error:', {
          status: res.status,
          endpoint: '/api/user',
          requestId: error.requestId,
          message: errorData.message,
          error: errorData.error
        });
        
        throw error;
      }
      
      return res.json();
    }
  });
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Handle error in component using a common pattern
  if (error) {
    // Different handling based on status code
    if (error.status === 401 || error.status === 403) {
      return (
        <div className="auth-error">
          <p>Please log in to view your profile.</p>
          <button onClick={() => router.push('/login')}>Log In</button>
        </div>
      );
    }
    
    if (error.status === 404) {
      return <p>Profile not found. Please create one.</p>;
    }
    
    // Generic error for other cases
    return (
      <div className="error-container">
        <p>Unable to load profile. Please try again.</p>
        {error.requestId && (
          <p className="error-reference">
            Reference ID: {error.requestId}
          </p>
        )}
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  
  // Rest of component with user data...
}

// Wrap component with error boundary
function UserProfilePage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset query cache or state when retrying
      }}
    >
      <UserProfile />
    </ErrorBoundary>
  );
}

// API route with secure error handling
export default async function handler(req, res) {
  // Generate request ID for error correlation
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-ID', requestId);
  
  try {
    // Check authentication first
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ 
        message: 'You must be logged in to access this resource',
        requestId
      });
    }
    
    const user = await getUserFromDatabase(session.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User profile not found',
        requestId
      });
    }
    
    // Return only necessary data
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      // Don't include sensitive fields like passwordHash, verificationTokens, etc.
    });
  } catch (error) {
    // Log detailed error for debugging (server-side only)
    console.error(`[${requestId}] User API Error:`, {
      userId: req.session?.user?.id,
      error: {
        message: error.message,
        stack: error.stack,
        ...error
      }
    });
    
    // Only return generic error to client
    res.status(500).json({ 
      message: 'An error occurred while fetching the profile',
      requestId
    });
  }
}
```

## Secrets Management

### Secure Environment Variables

**❌ Avoid:**
```javascript
// Hardcoded secrets
const API_KEY = 'ab12cd34ef56gh78ij90';

function PaymentProcessor() {
  const processPayment = async (paymentData) => {
    const response = await fetch('https://api.payment.com/v1/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(paymentData)
    });
    
    return response.json();
  };
  
  // Rest of component...
}

// Exposing server secrets to client
// In Next.js config (next.config.js)
module.exports = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  }
};
```

**✅ Recommended:**
```javascript
// Server-side environment variables
// In .env.local - Never commit this file
DATABASE_URL=postgres://username:password@localhost:5432/mydb
PAYMENT_API_KEY=ab12cd34ef56gh78ij90
JWT_SECRET=your-jwt-secret-key

// In .env.example - Commit this as an example
DATABASE_URL=postgres://username:password@localhost:5432/mydb
PAYMENT_API_KEY=your-payment-api-key
JWT_SECRET=your-jwt-secret-key

// Segregating client and server environment variables
// In next.config.js
module.exports = {
  env: {
    // Only expose client-safe variables with NEXT_PUBLIC_ prefix
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  }
};

// Using environment variables correctly
// In API route (server-side only)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Use server-side env variables
    const response = await fetch('https://api.payment.com/v1/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    
    // Return only what the client needs
    res.status(response.status).json({
      success: data.success,
      transactionId: data.id,
      status: data.status
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
}

// In client component
function PaymentForm() {
  // Access public variables safely
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  const handleSubmit = async (paymentData) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      // Handle response...
    } catch (error) {
      // Handle error...
    }
  };
  
  // Rest of component...
}
```

By following these secure coding patterns, you can significantly reduce the risk of common security vulnerabilities in your Next.js and React applications.