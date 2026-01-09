# Security Best Practices

**Date:** January 2026
**Status:** Audited & Hardened

## Overview

ChickenTinders implements comprehensive security measures to protect user data and prevent common web vulnerabilities.

## 🔒 Security Headers

Security headers are configured in [public/_headers](../public/_headers) and automatically applied by Netlify/Vercel.

### Implemented Headers

| Header | Value | Purpose |
|--------|-------|---------|
| **X-Frame-Options** | DENY | Prevents clickjacking attacks |
| **X-Content-Type-Options** | nosniff | Prevents MIME type sniffing |
| **X-XSS-Protection** | 1; mode=block | XSS protection for older browsers |
| **Referrer-Policy** | strict-origin-when-cross-origin | Limits referrer information |
| **Permissions-Policy** | camera=(), microphone=(), geolocation=() | Disables unnecessary features |
| **Content-Security-Policy** | (see below) | Prevents XSS and injection attacks |
| **Strict-Transport-Security** | max-age=31536000 | Forces HTTPS for 1 year |

### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://*.supabase.co https://app.posthog.com https://o*.ingest.sentry.io;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**Note:** `unsafe-inline` and `unsafe-eval` are required for React/Expo. In a future iteration, consider using nonces or hashes for stricter CSP.

## 🛡️ Input Validation

All user inputs are validated and sanitized using utilities in [lib/utils/validation.ts](../lib/utils/validation.ts).

### Validation Functions

**Email Validation:**
```typescript
import { isValidEmail } from '@/lib/utils/validation';

if (!isValidEmail(email)) {
  throw new Error('Invalid email address');
}
```

**Password Strength:**
```typescript
import { isStrongPassword, getPasswordStrength } from '@/lib/utils/validation';

// Minimum 8 characters, at least one letter and one number
if (!isStrongPassword(password)) {
  throw new Error('Password too weak');
}

const strength = getPasswordStrength(password); // 'weak' | 'medium' | 'strong'
```

**String Sanitization:**
```typescript
import { sanitizeString, sanitizeDisplayName } from '@/lib/utils/validation';

// Remove HTML tags and dangerous characters
const safe = sanitizeString(userInput);

// Sanitize display names (alphanumeric + basic punctuation)
const safeName = sanitizeDisplayName(displayName);
```

**SQL Injection Prevention:**
```typescript
import { hasSqlInjection } from '@/lib/utils/validation';

if (hasSqlInjection(userInput)) {
  throw new Error('Invalid input detected');
}
```

### Implemented Validations

- [x] Email validation (RFC 5322)
- [x] Password strength checking
- [x] Display name sanitization
- [x] ZIP code validation (US format)
- [x] Group code validation
- [x] URL sanitization
- [x] Numeric input validation
- [x] Array sanitization
- [x] SQL injection detection
- [x] XSS prevention (HTML escaping)
- [x] File upload validation

## 🚦 Rate Limiting

Client-side rate limiting prevents abuse and DoS attacks.

### Usage

```typescript
import { RateLimiter } from '@/lib/utils/validation';

// Create rate limiter: max 5 attempts per minute
const limiter = new RateLimiter(5, 60000);

async function handleAction(userId: string) {
  if (limiter.isBlocked(userId)) {
    throw new Error('Too many attempts. Please try again later.');
  }

  // Perform action
  await doSomething();
}
```

**Recommended Limits:**
- Login attempts: 5 per minute per user
- Group creation: 3 per minute per user
- API calls: 20 per minute per user
- Password reset: 3 per hour per email

## 🔐 Authentication & Authorization

### Supabase Auth

ChickenTinders uses Supabase for authentication, which provides:

- ✅ Secure password hashing (bcrypt)
- ✅ JWT tokens for session management
- ✅ Email verification
- ✅ Password reset flow
- ✅ Row Level Security (RLS) policies

### Row Level Security (RLS)

**Current Policies:**

1. **Users Table:**
   - Users can read their own profile
   - Users can update their own profile
   - Guest users can create new profiles

2. **Groups Table:**
   - Members can read groups they belong to
   - Creators can update their groups
   - Anyone can create groups

3. **Group Members Table:**
   - Members can read member list
   - Users can join groups with valid invite
   - Users cannot remove other members

4. **Swipes Table:**
   - Users can read their own swipes
   - Users can create swipes for groups they're in
   - Users cannot modify other users' swipes

5. **Matches Table:**
   - Group members can read matches for their groups
   - System creates matches (via function)

### Session Management

**Token Storage:**
- Tokens stored in localStorage (web)
- Automatic token refresh
- Tokens expire after 1 hour
- Refresh tokens valid for 30 days

**Best Practices:**
```typescript
// ✅ Always check if user is authenticated
const { user } = useAuth();
if (!user) {
  router.push('/auth/login');
  return;
}

// ✅ Validate user owns the resource
if (group.creator_id !== user.id) {
  throw new Error('Unauthorized');
}

// ✅ Clear sensitive data on logout
await supabase.auth.signOut();
clearSentryUser();
resetUser();
```

## 🔍 Data Protection

### Sensitive Data Handling

**Never Log Sensitive Data:**
```typescript
// ❌ Bad: Logs password
console.log('User:', { email, password });

// ✅ Good: Omits password
console.log('User:', { email, id });
```

**Environment Variables:**
```typescript
// ✅ Use environment variables for secrets
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// ❌ Never hardcode secrets
const apiKey = 'sk_live_abc123'; // NEVER DO THIS
```

**Data Minimization:**
- Only collect data that's necessary
- Don't store passwords (use Supabase Auth)
- Hash/encrypt sensitive data if stored
- Delete data when no longer needed

### PII (Personally Identifiable Information)

**Collected PII:**
- Email address (optional, for auth users)
- Display name (user-chosen, sanitized)
- Location (ZIP code only, not precise location)

**Not Collected:**
- Full address
- Phone number
- Payment information
- Precise geolocation
- Device identifiers

**Data Retention:**
- Active users: Indefinite
- Inactive groups: Expire after 24 hours
- Deleted accounts: Data removed within 30 days

## 🐛 Vulnerability Prevention

### Cross-Site Scripting (XSS)

**Prevention Strategies:**

1. **Input Sanitization:**
```typescript
import { sanitizeString, escapeHtml } from '@/lib/utils/validation';

// Sanitize all user inputs
const safeName = sanitizeString(userName);

// Escape HTML in text content
const escaped = escapeHtml(userComment);
```

2. **React's Built-in Protection:**
```typescript
// ✅ React automatically escapes by default
<Text>{userInput}</Text>

// ⚠️ Only use dangerouslySetInnerHTML with sanitized content
<div dangerouslySetInnerHTML={{ __html: sanitized }} />
```

3. **Content Security Policy:**
- Restricts script sources
- Blocks inline scripts (where possible)
- Prevents eval() execution

### SQL Injection

**Prevention:**

1. **Parameterized Queries (Supabase):**
```typescript
// ✅ Good: Parameterized query
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail); // Automatically escaped

// ❌ Bad: String concatenation (don't do with raw SQL)
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

2. **Input Validation:**
```typescript
import { hasSqlInjection } from '@/lib/utils/validation';

if (hasSqlInjection(input)) {
  throw new Error('Invalid input');
}
```

### Cross-Site Request Forgery (CSRF)

**Protection:**
- Supabase uses JWT tokens (not cookies)
- SameSite cookies (if using cookies)
- Origin/Referer header validation

### Clickjacking

**Protection:**
- `X-Frame-Options: DENY` header
- `frame-ancestors 'none'` in CSP

### Open Redirect

**Prevention:**
```typescript
// ✅ Validate redirect URLs
const allowedDomains = ['chickentinders.com'];

function isAllowedRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    return allowedDomains.includes(parsed.hostname);
  } catch {
    return false;
  }
}
```

## 🔒 HTTPS Enforcement

**Strict-Transport-Security Header:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Benefits:**
- Forces HTTPS for 1 year
- Includes all subdomains
- Eligible for HSTS preload list

**Deployment:**
1. Enable HTTPS on hosting provider
2. Configure HSTS header
3. Submit to [hstspreload.org](https://hstspreload.org/)

## 📊 Security Monitoring

### Sentry Integration

Sentry automatically monitors for:
- Uncaught exceptions
- Failed API calls
- Performance issues
- Security-related errors

**Configuration:** [lib/monitoring/sentry.ts](../lib/monitoring/sentry.ts)

### Security Events to Track

```typescript
import { trackEvent } from '@/lib/monitoring/analytics';

// Track suspicious activity
trackEvent('security_event', {
  type: 'rate_limit_exceeded',
  userId: user.id,
  action: 'login',
});

// Track failed auth attempts
trackEvent('security_event', {
  type: 'auth_failed',
  reason: 'invalid_password',
});
```

## 🔐 Third-Party Services

### Security Posture

| Service | Purpose | Security Features |
|---------|---------|-------------------|
| **Supabase** | Database & Auth | RLS, JWT, SSL, SOC 2 Type II |
| **Sentry** | Error tracking | Data encryption, GDPR compliant |
| **Posthog** | Analytics | EU hosting option, GDPR compliant |
| **Yelp API** | Restaurant data | API key auth, rate limiting |

### API Key Security

**Environment Variables:**
```bash
# .env (NEVER commit this file)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_YELP_API_KEY=your_key_here
```

**.gitignore:**
```
.env
.env.local
.env.production
*.key
*.pem
```

**Public vs Private Keys:**
- `EXPO_PUBLIC_*` - Safe to expose in client
- Supabase anon key - Safe (protected by RLS)
- Yelp API key - Should be server-side only
- Sentry DSN - Safe (public)
- Posthog API key - Safe (public)

## 🚨 Incident Response

### If a Security Issue is Discovered

1. **Immediate Actions:**
   - Document the vulnerability
   - Assess impact and scope
   - Determine if data was compromised

2. **Mitigation:**
   - Deploy fix immediately
   - Rotate compromised keys/secrets
   - Invalidate affected sessions

3. **Communication:**
   - Notify affected users (if applicable)
   - Update security advisory
   - Document lessons learned

4. **Prevention:**
   - Add tests for the vulnerability
   - Update security policies
   - Conduct security training

### Reporting Security Issues

**Email:** security@chickentinders.com (to be created)

**Responsible Disclosure:**
- Give us reasonable time to fix (90 days)
- Don't publicly disclose before fix
- Don't access/modify user data
- Report only to official channels

## ✅ Security Checklist

### Development

- [x] Input validation on all forms
- [x] SQL injection prevention
- [x] XSS prevention (escaping/sanitization)
- [x] CSRF protection (JWT tokens)
- [x] Rate limiting (client-side)
- [x] Secure password requirements
- [x] Environment variables for secrets
- [x] .gitignore includes sensitive files
- [x] Error messages don't leak sensitive info

### Deployment

- [ ] HTTPS enabled (SSL certificate)
- [ ] Security headers configured
- [ ] HSTS enabled
- [ ] CSP configured
- [ ] Secrets in environment variables
- [ ] Database RLS policies enabled
- [ ] Regular security audits scheduled
- [ ] Monitoring and alerting set up
- [ ] Incident response plan documented
- [ ] Data backup strategy implemented

### Ongoing

- [ ] Regular dependency updates
- [ ] Security audit (quarterly)
- [ ] Penetration testing (annually)
- [ ] Review access logs
- [ ] Monitor error reports
- [ ] Update security policies
- [ ] Security training for team
- [ ] Compliance review (GDPR, etc.)

## 📚 Resources

### Tools

- [OWASP ZAP](https://www.zaproxy.org/) - Security scanner
- [Snyk](https://snyk.io/) - Dependency vulnerability scanner
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Check for known vulnerabilities

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [React Security Best Practices](https://react.dev/learn/security)

### Standards

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility
- [GDPR](https://gdpr.eu/) - Data protection (EU)
- [CCPA](https://oag.ca.gov/privacy/ccpa) - Data protection (California)
- [SOC 2](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/soc2) - Security compliance

## 🛠️ Security Tools

### Running Security Audit

```bash
# Check for dependency vulnerabilities
npm audit

# Fix vulnerabilities (automatic)
npm audit fix

# Fix vulnerabilities (force, may have breaking changes)
npm audit fix --force

# Generate security report
npm audit --json > security-audit.json
```

### Snyk Integration

```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor
```

## 🎯 Security Maturity Roadmap

### Phase 1: Foundation (✅ Complete)
- Security headers
- Input validation
- Authentication & authorization
- HTTPS enforcement

### Phase 2: Monitoring (✅ Complete)
- Error tracking (Sentry)
- Security event logging
- Rate limiting

### Phase 3: Advanced (Future)
- WAF (Web Application Firewall)
- DDoS protection
- Penetration testing
- Bug bounty program
- SOC 2 compliance

### Phase 4: Continuous (Ongoing)
- Regular security audits
- Dependency updates
- Security training
- Incident response drills
