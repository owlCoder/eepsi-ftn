# Security Policy

This is a public development repository for the EEPSI FTN portal. The code has not undergone a formal penetration test, security audit or production hardening review.

## Reporting a vulnerability

**Do not publish exploit details, credentials, personal data, or proof-of-concept attacks in public issues.** Report security concerns privately via the repository's **Security → Report a vulnerability** feature if enabled. If private reporting is unavailable, contact the repository owner privately through their GitHub profile to arrange secure disclosure.

Please include:
- Affected feature or URL, version/commit SHA and expected vs. observed behavior.
- Reproduction steps using synthetic accounts/data only.
- Security impact and any mitigation suggestions.

Maintainers should acknowledge and triage reports privately, reproduce with test data and avoid making exploit details public until a fix is available.

## Supported versions

Security fixes are targeted at the current `main` branch. No released versions or long-term support branches are maintained yet.

## Production checklist

Before deploying:
- HTTPS/TLS, secure reverse proxy, properly scoped environment secrets and regular rotation.
- Infrastructure/edge IP and request rate limiting around `/api/auth/*` in addition to per-account DB throttling.
- Backup, encrypted storage where required, restore exercises, secure migrations and least-privilege MySQL accounts.
- Strong monitoring, audit retention policy, admin account management and incident response procedures.
- Review of data protection obligations and external material URLs.
- Independent permission testing, accessibility review and end-to-end coverage.

Never commit `.env`, private data, access tokens, logs with secrets or database backups.
