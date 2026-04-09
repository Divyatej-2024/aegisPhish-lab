import { config as loadEnv } from "dotenv";

import { PrismaClient } from "../prisma/generated/client";

loadEnv({ path: "../../backend/server/.env" });
loadEnv();

const prisma = new PrismaClient();

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const ids = {
  admin: "9a2d7b6a-8f0b-4f1f-9c7b-2b2d8f1a0001",
  analyst: "9a2d7b6a-8f0b-4f1f-9c7b-2b2d8f1a0002",
  employee: "9a2d7b6a-8f0b-4f1f-9c7b-2b2d8f1a0003",
  campaign: "2f6c0c40-2a6e-4ae1-9b20-30b060f70001",
  targetA: "2f6c0c40-2a6e-4ae1-9b20-30b060f70002",
  targetB: "2f6c0c40-2a6e-4ae1-9b20-30b060f70003",
  targetC: "2f6c0c40-2a6e-4ae1-9b20-30b060f70004",
  eventOpen: "2f6c0c40-2a6e-4ae1-9b20-30b060f70005",
  eventClick: "2f6c0c40-2a6e-4ae1-9b20-30b060f70006",
  eventReport: "2f6c0c40-2a6e-4ae1-9b20-30b060f70007",
  simLevel: "6f1bcb61-9ab9-4d2e-8b8a-1a8de5ac0001",
  simRun: "6f1bcb61-9ab9-4d2e-8b8a-1a8de5ac0002",
  simAction: "6f1bcb61-9ab9-4d2e-8b8a-1a8de5ac0003",
  labScenario: "4b9c7f0a-1b4f-4e55-97b3-0bb0a1c40001",
  labRun: "4b9c7f0a-1b4f-4e55-97b3-0bb0a1c40002",
  labEvent: "4b9c7f0a-1b4f-4e55-97b3-0bb0a1c40003",
  ctfChallenge: "8a2f1d88-3b57-4b3f-8c3a-9e9a0a900001",
  ctfSubmission: "8a2f1d88-3b57-4b3f-8c3a-9e9a0a900002",
  session: "a2c19f23-7b4e-4f6a-8a1b-1f5a1a110001",
  accountAdmin: "a2c19f23-7b4e-4f6a-8a1b-1f5a1a110002",
  accountAnalyst: "a2c19f23-7b4e-4f6a-8a1b-1f5a1a110003",
};

async function resetData() {
  await prisma.phishEvent.deleteMany();
  await prisma.phishTarget.deleteMany();
  await prisma.phishCampaign.deleteMany();

  await prisma.simAction.deleteMany();
  await prisma.simRun.deleteMany();
  await prisma.simLevel.deleteMany();

  await prisma.labEvent.deleteMany();
  await prisma.labRun.deleteMany();
  await prisma.labScenario.deleteMany();

  await prisma.ctfSubmission.deleteMany();
  await prisma.ctfChallenge.deleteMany();

  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.twoFactor.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  if (process.env.SEED_RESET === "true") {
    await resetData();
  }

  await prisma.user.upsert({
    where: { email: "ava.chen@aegisphish.com" },
    update: { name: "Ava Chen", emailVerified: true, role: "admin" },
    create: {
      id: ids.admin,
      name: "Ava Chen",
      email: "ava.chen@aegisphish.com",
      emailVerified: true,
      role: "admin",
    },
  });
  await prisma.user.upsert({
    where: { email: "malik.patel@aegisphish.com" },
    update: { name: "Malik Patel", emailVerified: true, role: "analyst" },
    create: {
      id: ids.analyst,
      name: "Malik Patel",
      email: "malik.patel@aegisphish.com",
      emailVerified: true,
      role: "analyst",
    },
  });
  await prisma.user.upsert({
    where: { email: "riley.gomez@aegisphish.com" },
    update: { name: "Riley Gomez", emailVerified: true, role: "user" },
    create: {
      id: ids.employee,
      name: "Riley Gomez",
      email: "riley.gomez@aegisphish.com",
      emailVerified: true,
      role: "user",
    },
  });

  await prisma.account.upsert({
    where: { id: ids.accountAdmin },
    update: {},
    create: {
      id: ids.accountAdmin,
      accountId: "ava.chen@aegisphish.com",
      providerId: "credentials",
      userId: ids.admin,
    },
  });
  await prisma.account.upsert({
    where: { id: ids.accountAnalyst },
    update: {},
    create: {
      id: ids.accountAnalyst,
      accountId: "malik.patel@aegisphish.com",
      providerId: "credentials",
      userId: ids.analyst,
    },
  });

  await prisma.phishCampaign.upsert({
    where: { id: ids.campaign },
    update: {
      name: "Payroll Reset Drill",
      description: "Quarterly simulation for finance and operations teams.",
      status: "active",
    },
    create: {
      id: ids.campaign,
      name: "Payroll Reset Drill",
      description: "Quarterly simulation for finance and operations teams.",
      status: "active",
    },
  });

  await prisma.phishTarget.upsert({
    where: { id: ids.targetA },
    update: { status: "clicked", sentAt: daysAgo(8) },
    create: {
      id: ids.targetA,
      campaignId: ids.campaign,
      email: "riley.gomez@aegisphish.com",
      name: "Riley Gomez",
      department: "Operations",
      token: "demo-token-riley",
      status: "clicked",
      sentAt: daysAgo(8),
    },
  });
  await prisma.phishTarget.upsert({
    where: { id: ids.targetB },
    update: { status: "reported", sentAt: daysAgo(8) },
    create: {
      id: ids.targetB,
      campaignId: ids.campaign,
      email: "taylor.hall@aegisphish.com",
      name: "Taylor Hall",
      department: "Finance",
      token: "demo-token-taylor",
      status: "reported",
      sentAt: daysAgo(8),
    },
  });
  await prisma.phishTarget.upsert({
    where: { id: ids.targetC },
    update: { status: "ignored", sentAt: daysAgo(8) },
    create: {
      id: ids.targetC,
      campaignId: ids.campaign,
      email: "harper.lee@aegisphish.com",
      name: "Harper Lee",
      department: "Support",
      token: "demo-token-harper",
      status: "ignored",
      sentAt: daysAgo(8),
    },
  });

  await prisma.phishEvent.upsert({
    where: { id: ids.eventOpen },
    update: {},
    create: {
      id: ids.eventOpen,
      campaignId: ids.campaign,
      targetId: ids.targetA,
      type: "open",
      ipAddress: "203.0.113.10",
      userAgent: "Mozilla/5.0",
      createdAt: daysAgo(8),
    },
  });
  await prisma.phishEvent.upsert({
    where: { id: ids.eventClick },
    update: {},
    create: {
      id: ids.eventClick,
      campaignId: ids.campaign,
      targetId: ids.targetA,
      type: "click",
      ipAddress: "203.0.113.10",
      userAgent: "Mozilla/5.0",
      createdAt: daysAgo(8),
    },
  });
  await prisma.phishEvent.upsert({
    where: { id: ids.eventReport },
    update: {},
    create: {
      id: ids.eventReport,
      campaignId: ids.campaign,
      targetId: ids.targetB,
      type: "report",
      ipAddress: "198.51.100.44",
      userAgent: "Mozilla/5.0",
      createdAt: daysAgo(7),
    },
  });

  await prisma.simLevel.upsert({
    where: { id: ids.simLevel },
    update: {},
    create: {
      id: ids.simLevel,
      slug: "invoice-phish-101",
      title: "Invoice Phish 101",
      summary: "Spot the red flags in a fake vendor invoice.",
      category: "phishing",
      difficulty: "easy",
      order: 1,
      content: {
        intro: "Review the email and choose the safest action.",
        steps: [
          {
            prompt: "A vendor requests payment detail changes.",
            options: ["Verify sender", "Pay immediately", "Forward to IT"],
          },
        ],
      },
    },
  });

  await prisma.simRun.upsert({
    where: { id: ids.simRun },
    update: { score: 86, status: "completed" },
    create: {
      id: ids.simRun,
      levelId: ids.simLevel,
      userId: ids.employee,
      status: "completed",
      score: 86,
      startedAt: daysAgo(6),
      completedAt: daysAgo(6),
    },
  });

  await prisma.simAction.upsert({
    where: { id: ids.simAction },
    update: {},
    create: {
      id: ids.simAction,
      runId: ids.simRun,
      stepIndex: 0,
      type: "choice",
      label: "Verify sender",
      score: 10,
      createdAt: daysAgo(6),
    },
  });

  await prisma.labScenario.upsert({
    where: { id: ids.labScenario },
    update: {},
    create: {
      id: ids.labScenario,
      slug: "helpdesk-imposter",
      title: "Helpdesk Imposter",
      summary: "Handle a fake MFA reset request safely.",
      category: "social-engineering",
      difficulty: "medium",
      estimatedMinutes: 12,
      tags: ["mfa", "support"],
      type: "interactive",
      steps: [
        { prompt: "Requester claims lockout.", answer: "Verify identity" },
        { prompt: "Request comes from unknown email.", answer: "Escalate" },
      ],
    },
  });

  await prisma.labRun.upsert({
    where: { id: ids.labRun },
    update: { score: 92, status: "completed" },
    create: {
      id: ids.labRun,
      scenarioId: ids.labScenario,
      userId: ids.employee,
      status: "completed",
      score: 92,
      answers: [{ step: 1, response: "Verify identity" }],
      startedAt: daysAgo(5),
      completedAt: daysAgo(5),
    },
  });

  await prisma.labEvent.upsert({
    where: { id: ids.labEvent },
    update: {},
    create: {
      id: ids.labEvent,
      runId: ids.labRun,
      type: "answer",
      metadata: { step: 1, correct: true },
      createdAt: daysAgo(5),
    },
  });

  await prisma.ctfChallenge.upsert({
    where: { id: ids.ctfChallenge },
    update: {},
    create: {
      id: ids.ctfChallenge,
      slug: "phish-header-hunt",
      title: "Phish Header Hunt",
      description: "Identify the forged header in an email chain.",
      hint: "Check the reply-to domain.",
      category: "email-analysis",
      points: 100,
      flagHash: "demo-flag-hash",
    },
  });

  await prisma.ctfSubmission.upsert({
    where: { id: ids.ctfSubmission },
    update: { correct: true },
    create: {
      id: ids.ctfSubmission,
      userId: ids.employee,
      userName: "Riley Gomez",
      userEmail: "riley.gomez@aegisphish.com",
      challengeId: ids.ctfChallenge,
      correct: true,
      flagHash: "demo-flag-hash",
    },
  });

  await prisma.session.upsert({
    where: { id: ids.session },
    update: { expiresAt: daysAgo(-3) },
    create: {
      id: ids.session,
      userId: ids.admin,
      token: "demo-session-token",
      expiresAt: daysAgo(-3),
      ipAddress: "198.51.100.14",
      userAgent: "Mozilla/5.0",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
