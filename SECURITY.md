# Security Policy

## 🔒 Reporting Security Vulnerabilities

We take the security of CareerSU seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:
- **Security Team**: security@careersu.com
- **Response Time**: Within 48 hours

### What to Include

Please include the following information in your report:

1. **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
2. **Full path of affected source file(s)**
3. **Location of the affected source code** (tag/branch/commit or direct URL)
4. **Step-by-step instructions to reproduce the issue**
5. **Proof-of-concept or exploit code** (if possible)
6. **Impact of the vulnerability**
7. **Suggested fix** (if you have one)

### What to Expect

1. **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
2. **Updates**: We'll send you regular updates about our progress
3. **Verification**: We'll work with you to validate and reproduce the issue
4. **Fix Development**: We'll develop and test a fix
5. **Disclosure**: We'll publicly disclose the vulnerability after the fix is deployed
6. **Credit**: We'll credit you in our security advisories (if you wish)

---

## 🛡️ Security Measures

### Authentication & Authorization

- **Authentication Provider**: Clerk (SOC 2 Type II certified)
- **Password Requirements**: Minimum 8 characters, complexity rules enforced
- **Session Management**: Secure HTTP-only cookies
- **JWT Tokens**: Short-lived tokens with refresh mechanism
- **Multi-Factor Authentication**: Supported via Clerk
- **OAuth Providers**: Google, GitHub, LinkedIn

### Data Protection

- **Encryption at Rest**: All sensitive data encrypted in Convex database
- **Encryption in Transit**: TLS 1.3 enforced for all connections
- **API Keys**: Stored in environment variables, never in code
- **Secrets Management**: Convex environment variables for backend secrets
- **PII Handling**: Minimal collection, encrypted storage, GDPR compliant

### Input Validation

- **Frontend Validation**: Zod schemas for all forms
- **Backend Validation**: Convex validators for all mutations
- **XSS Protection**: React's built-in XSS protection + Content Security Policy
- **SQL Injection**: N/A (using Convex, not SQL)
- **CSRF Protection**: SameSite cookies + CSRF tokens

### Infrastructure Security

- **Hosting**: Vercel (SOC 2 Type II, ISO 27001)
- **Backend**: Convex (SOC 2 Type II, GDPR compliant)
- **CDN**: Cloudflare for DDoS protection
- **Monitoring**: Real-time error tracking with Sentry
- **Backups**: Automated daily backups of Convex data

### API Security

- **Rate Limiting**: Implemented at Convex level
- **Authentication**: Required for all protected endpoints
- **Authorization**: Role-based access control (RBAC)
- **Input Sanitization**: All inputs sanitized before processing
- **Error Messages**: Generic errors to prevent information leakage

### Dependencies

- **Automated Updates**: Dependabot for dependency monitoring
- **Vulnerability Scanning**: npm audit runs on every PR
- **License Compliance**: Only using MIT/Apache/BSD licensed packages
- **Version Pinning**: Exact versions in package.json

---

## 🔐 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes            |
| < 1.0   | ❌ No             |

---

## 🚨 Known Security Considerations

### Current Implementation

1. **AI API Keys**: OpenAI keys stored in Convex environment (secure)
2. **User Data**: Stored in Convex with encryption at rest
3. **File Uploads**: Not yet implemented (planned with virus scanning)
4. **Email Verification**: Handled by Clerk (secure)

### Planned Security Enhancements

1. **Content Security Policy**: Stricter CSP headers
2. **Subresource Integrity**: For CDN resources
3. **Security Headers**: Implement all OWASP recommended headers
4. **Penetration Testing**: Annual third-party security audits
5. **Bug Bounty Program**: Launch public bug bounty (Q2 2025)

---

## 🔍 Security Best Practices for Contributors

### Code Review Checklist

- [ ] No hardcoded secrets or API keys
- [ ] All user inputs are validated
- [ ] SQL injection not possible (using Convex)
- [ ] XSS vulnerabilities checked
- [ ] Authentication required for protected routes
- [ ] Authorization checks implemented
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up to date
- [ ] No console.log with sensitive data

### Secure Coding Guidelines

```typescript
// ✅ GOOD: Environment variables for secrets
const openaiKey = process.env.OPENAI_API_KEY;

// ❌ BAD: Hardcoded secrets
const openaiKey = "sk-abc123...";

// ✅ GOOD: Input validation
const result = loginSchema.safeParse(userInput);
if (!result.success) {
  throw new Error("Invalid input");
}

// ❌ BAD: No validation
const user = await db.get(userInput.id);

// ✅ GOOD: Generic error messages
throw new Error("Authentication failed");

// ❌ BAD: Leaking information
throw new Error(`User ${email} not found in database`);

// ✅ GOOD: Authorization check
if (ctx.userId !== documentOwnerId) {
  throw new Error("Unauthorized");
}

// ❌ BAD: No authorization
return await ctx.db.get(documentId);
```

---

## 🔐 Security Headers

Our production deployment includes the following security headers:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; ...
```

---

## 📋 Compliance

### GDPR (General Data Protection Regulation)

- ✅ Right to access data
- ✅ Right to deletion
- ✅ Right to data portability
- ✅ Privacy policy published
- ✅ Cookie consent (via Clerk)
- ✅ Data processing agreement with Convex

### CCPA (California Consumer Privacy Act)

- ✅ Privacy policy with CCPA disclosures
- ✅ Do Not Sell My Personal Information option
- ✅ Data deletion requests honored

### SOC 2 Type II

- ✅ Using SOC 2 certified providers (Clerk, Convex, Vercel)
- ⏳ Internal SOC 2 certification planned (Q3 2025)

---

## 🔄 Incident Response Plan

### In Case of Security Incident

1. **Detect**: Automated monitoring alerts security team
2. **Assess**: Determine severity and scope
3. **Contain**: Isolate affected systems
4. **Eradicate**: Remove the threat
5. **Recover**: Restore normal operations
6. **Review**: Post-incident analysis
7. **Notify**: Inform affected users (if required by law)

### Contact During Incident

- **Emergency**: security@careersu.com
- **Phone**: +1-XXX-XXX-XXXX (24/7 hotline)

---

## 📚 Resources

### Security Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Convex Security Best Practices](https://docs.convex.dev/security)
- [Clerk Security Docs](https://clerk.com/docs/security)
- [React Security Best Practices](https://react.dev/learn/security)

### Security Tools We Use

- **Dependabot**: Automated dependency updates
- **npm audit**: Vulnerability scanning
- **Sentry**: Error tracking and monitoring
- **Convex Dashboard**: Real-time monitoring

---

## 🏆 Security Hall of Fame

We recognize and thank security researchers who help us keep CareerSU secure:

- *Your name could be here!*

---

## 📞 Contact

- **Security Team**: security@careersu.com
- **General Inquiries**: team@careersu.com
- **PGP Key**: [Download](https://careersu.com/pgp-key.asc)

---

**Last Updated**: November 7, 2025
**Version**: 1.0
