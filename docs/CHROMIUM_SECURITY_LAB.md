# AegisPhish Lab: Chromium Security Lab

## Purpose

Add a browser-security learning and validation area to AegisPhish Lab without replacing the existing Next.js, Go/Gin, and PostgreSQL application.

The lab is for authorised education and testing. Initial exercises must run against a local fixture application or an explicitly approved test environment. Do not target public websites, real users, or production accounts.

## Product pillars

1. Cybersecurity awareness: explain phishing indicators, suspicious links, safe reporting, and defensive email controls.
2. IT operations: organisation and department administration, role-aware workflows, audit records, and incident learning.
3. Applied AI: explainable analysis of supplied sample content, guided learning recommendations, and human-reviewed reports.
4. Chromium security: browser behaviour, web platform protections, privacy, and repeatable tests using Chromium.

## Chromium module

### Learning areas

- Chromium process model: browser, renderer, network and utility processes; explain site isolation conceptually.
- Browser security boundaries: same-origin policy, sandboxing, permissions, secure contexts and content security policy.
- DevTools: inspect requests, response headers, console messages, storage and cookie attributes.
- Privacy: explain cookies, third-party storage, permissions, referrers and fingerprinting at a defensive level.
- Extensions: review permission declarations, content-script scope and least-privilege design.
- Automation: use Playwright with its Chromium browser to test the local fixture and verify defensive headers.

### Initial safe exercises

1. Inspect response headers on a local demo page and explain CSP, HSTS, X-Content-Type-Options and Referrer-Policy.
2. Compare cookie settings on a local fixture: Secure, HttpOnly, SameSite and Path.
3. Demonstrate the same-origin policy with two localhost origins and benign sample data.
4. Verify that a restrictive Content Security Policy blocks an intentionally harmless inline script in the fixture.
5. Use Playwright to check that the fixture has expected headers, accessible controls and no console errors.

No exercise should collect passwords, capture session tokens, exploit real websites, bypass browser protections, or distribute a browser extension. Use synthetic accounts and disposable local data only.

## Proposed implementation boundaries

- Frontend: add a Chromium Lab section with learning cards, exercise instructions and results.
- Backend: expose read-only lesson metadata initially. Do not introduce remote browsing or arbitrary URL scanning in the first release.
- Database: store lesson completion and non-sensitive aggregate progress only. Avoid raw browsing histories, credentials, session cookies, and unnecessary IP addresses.
- AI: explain provided sample headers or URLs with cited indicators and uncertainty. Require human review; do not claim that a model verdict proves a site is safe or malicious.
- Automation: run Playwright against the local fixture in CI, not against arbitrary user-supplied public targets.

## Existing repository observations

- The application already uses Next.js 15, Go/Gin and PostgreSQL.
- The backend currently models roles as admin, trainer and employee. New permissions must use these actual role values unless a deliberate, tested migration changes the model.
- Campaign tracking currently accepts open, click and submit events and stores user, IP address and user-agent fields. The product should not collect submitted credentials. Prefer a future migration to non-sensitive training-interaction events and documented retention controls.
- Campaign HTTP handlers already scope campaign reads and writes to the authenticated organisation. Preserve tenant scoping in every new endpoint.
- The CI workflow previously watched main and production, while the repository default branch is master. CI now includes master so default-branch pushes and pull requests are tested.

## Delivery sequence

1. Establish reliable CI on master and production.
2. Add a local-only Chromium fixture and Playwright smoke tests.
3. Add the Chromium Lab learning UI and read-only lesson API.
4. Add privacy-conscious progress tracking.
5. Add explainable AI assistance for sample content, with tests and human review.
6. Review access control, tenant isolation, data retention, accessibility and deployment before release.

## Acceptance criteria for the first Chromium increment

- All browser exercises run against localhost fixtures.
- Playwright launches Chromium in CI and checks the expected security headers.
- No credentials, authentication tokens or real browsing histories are collected.
- Existing authentication, organisation and campaign workflows remain unchanged.
- Backend tests and frontend production build pass before merge.
