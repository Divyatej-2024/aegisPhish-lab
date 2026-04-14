# Scenario Catalog

This file contains the sample and required scenarios for interview demos and project submissions.

## Required Scenario Coverage

Use this checklist when presenting the project:

- Simulation:
  - Credential phishing reset
  - BEC wire transfer
  - Attachment/document phishing
  - MFA-code social engineering follow-up
- Lab:
  - Email triage
  - MFA fatigue
  - QR phishing
  - Helpdesk impersonation
- CTF:
  - OSINT
  - Crypto decoding
  - Web artifact analysis
  - Forensics artifact decoding
  - Incident analysis

## Implemented Scenarios

## Simulation Levels (`/api/sim/levels`)

- `payroll-password-reset` (Credential Phish, Beginner)
  - Step 1: suspicious reset email with unsafe link
  - Step 2: fake IT follow-up asking for MFA code
- `executive-wire-request` (Business Email Compromise, Intermediate)
  - Step 1: urgent confidential CFO wire request
  - Step 2: bypass approval and transfer to attacker-provided account
- `cloud-doc-share` (Attachment Phish, Intermediate)
  - Step 1: fake HR attachment delivery
  - Step 2: shortened-link reminder for policy sign-off

## Lab Scenarios (`/api/lab/scenarios`)

- `invoice-fraud-triage` (Business Email Compromise, `email-triage`)
- `mfa-fatigue-attack` (Authentication, `mfa-fatigue`)
- `qr-code-payroll` (QR Phishing, `qr-phish`)
- `helpdesk-imposter-reset` (Social Engineering, `email-triage`)

## CTF Challenges (`/api/ctf/challenges`)

- `osint-invisible-note`
- `crypto-base64-drop`
- `web-cookie-crumbs`
- `forensics-artifact`
- `logic-shifted-signal`
- `attack-chain-sim`

## Sample API Requests

## Start simulation run

```http
POST /api/sim/runs
Content-Type: application/json

{
  "slug": "payroll-password-reset"
}
```

## Submit simulation action

```http
POST /api/sim/runs/:id/actions
Content-Type: application/json

{
  "stepIndex": 0,
  "type": "report",
  "label": "Report to SOC and verify via intranet",
  "note": "Domain mismatch and urgency signal detected."
}
```

## Start lab run

```http
POST /api/lab/runs
Content-Type: application/json

{
  "slug": "invoice-fraud-triage"
}
```

## Complete lab run

```http
POST /api/lab/runs/:id/complete
Content-Type: application/json

{
  "answers": [1, 2]
}
```

## Submit CTF flag

```http
POST /api/ctf/submit
Content-Type: application/json

{
  "slug": "attack-chain-sim",
  "flag": "CTF{attack_chain_sim}"
}
```

## New unified catalog endpoint

Use this route to fetch required matrix + implemented scenarios + sample requests in one response:

```http
GET /api/scenarios/catalog
```
