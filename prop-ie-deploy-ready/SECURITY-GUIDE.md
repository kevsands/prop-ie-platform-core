# Security Guide for PropIE AWS App

This document outlines security best practices and measures implemented in the PropIE AWS App to prevent malicious code, protect user data, and maintain application integrity.

## Recent Security Incident

The application recently experienced a security incident involving a malicious npm package that caused redirects to a suspicious domain. For details about this incident and the remediation steps taken, see [SECURITY-INCIDENT-REPORT.md](./SECURITY-INCIDENT-REPORT.md).

## Security Measures Implemented

### 1. Content Security Policy (CSP)

A Content Security Policy has been implemented in `next.config.js` to prevent various types of attacks including:
- Cross-site scripting (XSS)
- Clickjacking
- Data injection attacks
- Malicious redirects

```javascript
// In next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
        },
        // Other security headers...
      ],
    },
  ];
}
```

### 2. NPM Security Configuration

The project uses strict npm configuration to enhance dependency security:

```
// .npmrc
legacy-peer-deps=true
strict-peer-dependencies=false
audit=true
fund=false
package-lock=true
save-exact=true
engine-strict=true
```

### 3. Security Linting

The project uses:
- `eslint-plugin-security` to detect common security issues in JavaScript code
- `eslint-plugin-no-unsanitized` to prevent DOM-based XSS vulnerabilities

Configuration is in `.eslintrc.security.json` and `eslint.config.mjs`

### 4. AWS Security Best Practices

For AWS Amplify resources, follow these security practices:

1. **IAM Policies**: Use the principle of least privilege for service roles
2. **API Security**: Implement proper authentication and authorization on API endpoints
3. **S3 Security**: Configure bucket policies to prevent public access
4. **Cognito**: Use secure password policies and MFA when possible
5. **Secrets Management**: Never commit sensitive information to the repo

## Dependency Management Guidelines

### 1. Adding New Dependencies

Before adding a new package:
- Verify the package source and author reputation
- Check GitHub stars, downloads, and last update dates
- Review open issues and security vulnerabilities
- Run `npm audit` on the package

### 2. Regular Auditing

- Run `npm audit` regularly to check for vulnerabilities
- Consider using automated tools like Snyk or Dependabot
- Keep dependencies updated, especially for security patches

### 3. Package Lockfiles

- Always commit lockfiles (package-lock.json) to the repository
- Use `save-exact=true` to prevent automatic version updates
- Consider using `npm ci` instead of `npm install` in CI/CD pipelines

## Code Security Guidelines

### 1. React/Next.js Security

- Avoid using `dangerouslySetInnerHTML` without proper sanitization
- Never pass user input directly to `eval()`, `Function()`, or similar
- Use Next.js's built-in `getServerSideProps` for secure data fetching
- Implement proper CSRF protection with Next.js API routes

### 2. Authentication and Authorization

- Implement proper authentication checks for protected routes
- Use middleware for consistent authorization
- Consider using JWT or session-based authentication
- Implement proper logout functionality

### 3. API Security

- Validate all input parameters with Zod or similar validators
- Implement rate limiting for public endpoints
- Add proper error handling that doesn't leak sensitive information
- Use HTTPS for all API communication

### 4. Data Sanitization

- Sanitize all user inputs before rendering or processing
- Use DOMPurify or similar libraries when handling HTML content
- Implement proper escaping for SQL queries (prepared statements)
- Validate file uploads for type, size, and content

## Security Testing

### 1. Recommended Tools

- **Static Analysis**: SonarQube, ESLint with security plugins
- **Dependency Scanning**: npm audit, Snyk, Dependabot
- **Dynamic Testing**: OWASP ZAP, Burp Suite
- **Compliance**: AWS Config Rules, Security Hub

### 2. Regular Checks

- Run security linters as part of CI/CD pipeline
- Perform dependency audits weekly or after adding new dependencies
- Conduct regular code reviews with security focus
- Consider periodic penetration testing

## Incident Response

In case of a security incident:

1. **Contain**: Isolate affected systems or components
2. **Investigate**: Determine the root cause and impact
3. **Remediate**: Fix vulnerabilities and remove malicious code
4. **Document**: Create detailed reports of incidents and fixes
5. **Prevent**: Update security measures to prevent similar issues

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Documentation](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [AWS Security Best Practices](https://docs.aws.amazon.com/wellarchitected/latest/framework/security.html)