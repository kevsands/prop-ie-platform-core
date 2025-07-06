# Security Incident Report

## Date: May 2, 2025

## Issue Summary

A malicious package was detected in the PropIE AWS app that caused redirects to a suspicious domain (coaufu.com). This was identified during Lighthouse testing where the application redirected users from the legitimate domain to a phishing URL.

## Root Cause

The issue was caused by a malicious npm package named "src" (version 1.0.0) that was added to the project dependencies. This package contained a vulnerable version of the "underscore" library (1.6.0) with a critical vulnerability allowing arbitrary code execution.

The package appears to have been added recently and was not detected by standard security measures.

## Detection

The issue was detected during Lighthouse testing, which generated a report showing that requests to the application were being redirected to "coaufu.com/xr.php" with a suspicious parameter string.

## Impact

The malicious redirect could have potentially:
- Exposed users to phishing attacks
- Stolen credentials or sensitive information
- Damaged the reputation of the PropIE platform
- Led to further system compromise

## Remediation Steps Taken

1. Identified the malicious "src" package through npm audit and dependency analysis
2. Removed the package using `npm uninstall src --save`
3. Verified all dependencies with `npm audit` to ensure no other vulnerabilities remained
4. Added improved security headers to next.config.js to prevent future redirect attacks
5. Updated .npmrc with stricter security settings to prevent similar issues
6. Created this security incident report for documentation

## Additional Security Improvements

1. Security headers were added to Next.js configuration including:
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Referrer-Policy

2. NPM configuration improvements:
   - Added audit=true to ensure audits run automatically
   - Added save-exact=true to prevent automatic version upgrades
   - Added engine-strict=true for better dependency control

## Recommendations for Future Prevention

1. **Package Management:**
   - Implement a whitelist policy for npm dependencies
   - Consider using npm workspaces or yarn resolutions to control nested dependencies
   - Regularly audit dependencies with tools like npm audit, Snyk, or SonarQube

2. **Build Pipeline:**
   - Add lockfile security scanning to CI/CD pipelines
   - Implement automated security testing before deployment
   - Consider using tools like Dependabot for managed dependency updates

3. **Infrastructure:**
   - Monitor DNS settings for unauthorized changes
   - Implement Content-Security-Policy reporting to detect injection attempts
   - Consider Web Application Firewall (WAF) to prevent suspicious redirects

4. **Development Practices:**
   - Train developers on supply chain attack risks
   - Implement code review processes focused on security concerns
   - Create guidelines for adding new dependencies

## Conclusion

This security incident was successfully resolved by removing the malicious package and implementing additional security measures. The application should now be monitored for any similar issues, and the preventative measures described above should be put in place to reduce the risk of future incidents.