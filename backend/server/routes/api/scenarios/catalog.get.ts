import prisma from "@aegisPhish-lab/db";

import { ensureCtfChallenges } from "../../../utils/ctf";
import { ensureLabScenarios } from "../../../utils/lab-scenarios";
import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureSimLevels } from "../../../utils/sim-levels";

const REQUIRED_SCENARIO_MATRIX = {
  simulation: [
    "credential-phish-reset",
    "bec-wire-transfer",
    "attachment-phish",
    "mfa-code-social-engineering",
  ],
  lab: [
    "email-triage",
    "mfa-fatigue",
    "qr-phish",
    "helpdesk-impersonation",
  ],
  ctf: [
    "osint",
    "crypto-decoding",
    "web-artifact",
    "forensics-artifact",
    "incident-analysis",
  ],
};

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);
  await Promise.all([ensureSimLevels(), ensureLabScenarios(), ensureCtfChallenges()]);

  const [simLevels, labScenarios, ctfChallenges] = await Promise.all([
    prisma.simLevel.findMany({
      orderBy: { order: "asc" },
      select: {
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        summary: true,
      },
    }),
    prisma.labScenario.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        type: true,
        summary: true,
      },
    }),
    prisma.ctfChallenge.findMany({
      orderBy: { points: "asc" },
      select: {
        slug: true,
        title: true,
        category: true,
        points: true,
      },
    }),
  ]);

  return {
    requiredMatrix: REQUIRED_SCENARIO_MATRIX,
    implemented: {
      simulation: simLevels,
      lab: labScenarios,
      ctf: ctfChallenges,
    },
    sampleRequests: {
      startSimulationRun: {
        method: "POST",
        path: "/api/sim/runs",
        body: { slug: "payroll-password-reset" },
      },
      submitSimulationAction: {
        method: "POST",
        path: "/api/sim/runs/:id/actions",
        body: {
          stepIndex: 0,
          type: "report",
          label: "Report to SOC and verify via intranet",
          note: "Domain mismatch and urgent tone observed.",
        },
      },
      startLabRun: {
        method: "POST",
        path: "/api/lab/runs",
        body: { slug: "invoice-fraud-triage" },
      },
      completeLabRun: {
        method: "POST",
        path: "/api/lab/runs/:id/complete",
        body: { answers: [1, 2] },
      },
      submitCtfFlag: {
        method: "POST",
        path: "/api/ctf/submit",
        body: { slug: "attack-chain-sim", flag: "CTF{attack_chain_sim}" },
      },
      createPhishingCampaign: {
        method: "POST",
        path: "/api/phish/campaigns",
        body: {
          name: "Quarterly Payroll Drill",
          description: "Credential phishing readiness exercise for operations and finance.",
          status: "draft",
          targets: [
            {
              name: "Riley Gomez",
              email: "riley.gomez@aegisphish.com",
              department: "Operations",
            },
          ],
        },
      },
    },
  };
});
