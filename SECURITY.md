# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Aegis Phish Lab, please email security@aegisphish.com instead of using the issue tracker.

### Please include:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Impact assessment
- Suggested fix (if you have one)

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |
| 0.9.x   | ❌ No     |

## Security Best Practices

When using Aegis Phish Lab in production:

1. **Use strong JWT secrets** (minimum 32 characters)
2. **Enable HTTPS/TLS** for all connections
3. **Keep dependencies updated** regularly
4. **Use environment variables** for sensitive data
5. **Implement database backups** with encryption
6. **Monitor access logs** for suspicious activity
7. **Set up intrusion detection** systems
8. **Regular security audits** recommended
9. **Keep OS and runtime updated**
10. **Use WAF** (Web Application Firewall) in production

## Dependencies

We actively monitor dependencies for vulnerabilities:

```bash
# Check for vulnerabilities
go list -json -m all | nancy sleuth  # Backend
pnpm audit                            # Frontend
```

## Responsible Disclosure

We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge contributions to our security.

## Security Headers

Production deployment should include:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Compliance

Aegis Phish Lab is designed with security in mind and is working towards:
- SOC 2 Type II compliance
- GDPR compliance
- CCPA compliance
- ISO 27001 alignment
