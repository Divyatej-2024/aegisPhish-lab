import fs from "node:fs/promises";
import path from "node:path";

const randomItem = (arr, index) => arr[index % arr.length];
const pad = (n) => n.toString().padStart(2, "0");

const now = new Date("2026-04-02T00:00:00.000Z");
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

const users = [];
const sessions = [];
const accounts = [];
const verifications = [];
const twoFactor = [];
const ctfChallenges = [];
const ctfSubmissions = [];
const labScenarios = [];
const labRuns = [];
const labEvents = [];
const phishCampaigns = [];
const phishTargets = [];
const phishEvents = [];
const simLevels = [];
const simRuns = [];
const simActions = [];

const names = [
  "Divya Tej",
  "Samira Khan",
  "Liam O'Connor",
  "Aisha Patel",
  "Noah Kim",
  "Olivia Brooks",
  "Ethan Wright",
  "Maya Chen",
  "Arjun Singh",
  "Zara Ali",
];
const departments = ["Finance", "HR", "Sales", "IT", "Legal"];
const roles = ["user", "user", "user", "user", "admin"];

for (let i = 0; i < 50; i += 1) {
  const id = `user_${i + 1}`;
  const name = randomItem(names, i);
  const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}${i + 1}@aegisphish.com`;
  const createdAt = daysAgo(10 - (i % 6));
  const updatedAt = daysAgo(2 - (i % 2));

  users.push({
    id,
    name,
    email,
    emailVerified: i % 3 !== 0,
    twoFactorEnabled: i % 4 === 0,
    role: randomItem(roles, i),
    banned: i % 17 === 0,
    banReason: i % 17 === 0 ? "Policy violation" : null,
    banExpires: i % 17 === 0 ? daysAgo(-10) : null,
    image: null,
    createdAt,
    updatedAt,
  });

  accounts.push({
    id: `acct_${i + 1}`,
    accountId: `firebase:${id}`,
    providerId: "password",
    userId: id,
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    password: "hashed:***",
    createdAt,
    updatedAt,
  });

  if (i % 2 === 0) {
    sessions.push({
      id: `sess_${i + 1}`,
      expiresAt: daysAgo(-7),
      token: `sess_live_${i + 1}`,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      ipAddress: `203.0.113.${(i % 50) + 10}`,
      userAgent: "Chrome 146 / Windows",
      impersonatedBy: null,
      userId: id,
    });
  }

  if (i % 5 === 0) {
    twoFactor.push({
      id: `2fa_${i + 1}`,
      userId: id,
      secret: "base32:***",
      backupCodes: "codes:***",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(2),
    });
  }
}

for (let i = 0; i < 10; i += 1) {
  verifications.push({
    id: `ver_${i + 1}`,
    identifier: `verify:${users[i].email}`,
    value: `${900000 + i}`,
    expiresAt: daysAgo(-1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  });
}

const baseCtf = [
  ["osint-invisible-note", "Invisible Note", "OSINT", 50],
  ["crypto-base64-drop", "Base64 Drop", "Crypto", 75],
  ["web-cookie-crumbs", "Cookie Crumbs", "Web", 100],
  ["forensics-artifact", "Artifact Decode", "Forensics", 125],
  ["logic-shifted-signal", "Shifted Signal", "Logic", 150],
  ["attack-chain-sim", "Attack Chain (Simulated)", "Incident Analysis", 175],
];

baseCtf.forEach((entry, idx) => {
  ctfChallenges.push({
    id: `ctf_${idx + 1}`,
    slug: entry[0],
    title: entry[1],
    description: "CTF challenge description",
    hint: "Hint text",
    category: entry[2],
    points: entry[3],
    flagHash: `sha256:${idx + 1}`,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(7),
  });
});

for (let i = 0; i < 50; i += 1) {
  const challenge = randomItem(ctfChallenges, i);
  const user = users[i % users.length];
  ctfSubmissions.push({
    id: `ctfsub_${i + 1}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    challengeId: challenge.id,
    correct: i % 4 !== 0,
    flagHash: challenge.flagHash,
    submittedAt: daysAgo(1),
  });
}

const scenarioSeeds = [
  {
    slug: "invoice-fraud-triage",
    title: "Invoice Fraud Triage",
    summary: "Spot red flags in a payment change request and choose the safest response.",
    category: "Business Email Compromise",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    tags: ["email", "finance", "social-engineering"],
    type: "email-triage",
    steps: {
      intro: "Vendor claims banking details changed.",
      artifact: {
        from: "ap@northwind-suppliers.com",
        replyTo: "northwind-ap@outlook-mail.com",
        subject: "Urgent: Updated payment details",
        body: "Please use new account details attached.",
        attachments: ["APRIL_INVOICE_UPDATE.pdf"],
      },
      questions: [
        {
          prompt: "Most suspicious indicator?",
          options: ["Urgent tone", "Reply-to mismatch", "Attachment", "Short message"],
          correctIndex: 1,
          explanation: "Reply-to mismatch is a strong signal.",
        },
      ],
    },
  },
  {
    slug: "mfa-fatigue-attack",
    title: "MFA Fatigue Attack",
    summary: "Handle repeated MFA prompts without enabling takeover.",
    category: "Authentication",
    difficulty: "Beginner",
    estimatedMinutes: 6,
    tags: ["mfa", "identity", "alerts"],
    type: "mfa-fatigue",
    steps: {
      intro: "You receive a burst of MFA prompts.",
      artifact: { prompts: 6, timeWindow: "2 minutes", location: "Berlin" },
      questions: [
        {
          prompt: "What should you do first?",
          options: ["Approve one", "Ignore", "Report + reset password", "Disable MFA"],
          correctIndex: 2,
          explanation: "Report and reset credentials.",
        },
      ],
    },
  },
  {
    slug: "qr-code-payroll",
    title: "QR Payroll Update",
    summary: "Evaluate a QR code payroll request.",
    category: "QR Phishing",
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    tags: ["qr", "mobile", "payroll"],
    type: "qr-phish",
    steps: {
      intro: "HR asks to scan QR code.",
      artifact: { sender: "hr@company-payroll.com", qrLabel: "Scan to update", urlPreview: "http://payroll-update" },
      questions: [
        {
          prompt: "Highest risk?",
          options: ["Payroll target", "HTTP link", "Sensitive data", "All of the above"],
          correctIndex: 3,
          explanation: "All risk factors apply.",
        },
      ],
    },
  },
];

scenarioSeeds.forEach((scenario, idx) => {
  labScenarios.push({
    id: `lab_${idx + 1}`,
    ...scenario,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  });
});

for (let i = 0; i < 20; i += 1) {
  const scenario = randomItem(labScenarios, i);
  const user = users[i % users.length];
  labRuns.push({
    id: `labrun_${i + 1}`,
    scenarioId: scenario.id,
    userId: user.id,
    status: i % 3 === 0 ? "completed" : "in_progress",
    score: i % 3 === 0 ? 1 : null,
    answers: i % 3 === 0 ? { answers: [1], graded: [], total: 1 } : null,
    startedAt: daysAgo(2),
    completedAt: i % 3 === 0 ? daysAgo(2) : null,
  });
  labEvents.push({
    id: `labevt_${i + 1}`,
    runId: `labrun_${i + 1}`,
    type: "start",
    metadata: { source: "training-page" },
    createdAt: daysAgo(2),
  });
}

for (let i = 0; i < 10; i += 1) {
  phishCampaigns.push({
    id: `camp_${i + 1}`,
    name: `Campaign ${pad(i + 1)}`,
    description: "Phishing simulation",
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "draft" : "completed",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  });
}

for (let i = 0; i < 200; i += 1) {
  const campaign = randomItem(phishCampaigns, i);
  const user = users[i % users.length];
  phishTargets.push({
    id: `target_${i + 1}`,
    campaignId: campaign.id,
    email: user.email,
    name: user.name,
    department: randomItem(departments, i),
    token: `token_${i + 1}`,
    status: i % 4 === 0 ? "submitted" : i % 4 === 1 ? "clicked" : "pending",
    sentAt: daysAgo(3),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  });
}

for (let i = 0; i < 2000; i += 1) {
  const target = randomItem(phishTargets, i);
  const type = i % 3 === 0 ? "open" : i % 3 === 1 ? "click" : "submit";
  phishEvents.push({
    id: `phevt_${i + 1}`,
    campaignId: target.campaignId,
    targetId: target.id,
    type,
    ipAddress: `198.51.100.${(i % 200) + 1}`,
    userAgent: "Chrome 146 / Windows",
    metadata: type === "submit" ? { email: target.email, passwordHash: "sha256:***", passwordLength: 10 } : null,
    createdAt: daysAgo(2),
  });
}

const simLevelSeeds = [
  {
    slug: "payroll-password-reset",
    title: "Payroll Password Reset",
    summary: "A payroll portal forces a reset after a suspicious login alert.",
    category: "Credential Phish",
    difficulty: "Beginner",
    order: 1,
  },
  {
    slug: "executive-wire-request",
    title: "Executive Wire Request",
    summary: "A CFO requests a wire transfer for a confidential acquisition.",
    category: "Business Email Compromise",
    difficulty: "Intermediate",
    order: 2,
  },
  {
    slug: "cloud-doc-share",
    title: "Cloud Document Share",
    summary: "A shared document claims to contain updated HR policies.",
    category: "Attachment Phish",
    difficulty: "Intermediate",
    order: 3,
  },
];

simLevelSeeds.forEach((level, idx) => {
  simLevels.push({
    id: `simlvl_${idx + 1}`,
    ...level,
    content: {
      ...level,
      steps: [
        {
          title: "Scenario Step",
          prompt: "Choose the safest action.",
          email: {
            from: "alerts@security.com",
            subject: "Security notice",
            body: "Please review the attached notice.",
            attachments: ["Notice.pdf"],
          },
          actions: [
            { type: "report", label: "Report to SOC", score: 3, feedback: "Correct." },
            { type: "click", label: "Click the link", score: -2, feedback: "Risky." },
          ],
        },
      ],
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  });
});

for (let i = 0; i < 12; i += 1) {
  const level = randomItem(simLevels, i);
  const user = users[i % users.length];
  simRuns.push({
    id: `simrun_${i + 1}`,
    levelId: level.id,
    userId: user.id,
    status: i % 2 === 0 ? "completed" : "in_progress",
    score: i % 2 === 0 ? 2 : 0,
    startedAt: daysAgo(1),
    completedAt: i % 2 === 0 ? daysAgo(1) : null,
  });
  simActions.push({
    id: `simact_${i + 1}`,
    runId: `simrun_${i + 1}`,
    stepIndex: 0,
    type: "report",
    label: "Report to SOC",
    score: 3,
    metadata: { note: "Reported", prediction: { label: "phishing", confidence: 0.8 }, feedback: "Correct." },
    createdAt: daysAgo(1),
  });
}

const seed = {
  users,
  sessions,
  accounts,
  verifications,
  twoFactor,
  ctfChallenges,
  ctfSubmissions,
  labScenarios,
  labRuns,
  labEvents,
  phishCampaigns,
  phishTargets,
  phishEvents,
  simLevels,
  simRuns,
  simActions,
};

const outPath = path.resolve(process.cwd(), "data/seed.json");
await fs.writeFile(outPath, JSON.stringify(seed, null, 2), "utf-8");
console.log(`Seed generated at ${outPath}`);
