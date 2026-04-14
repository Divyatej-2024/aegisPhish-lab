import prisma from "@aegisPhish-lab/db";

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type LabQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LabScenarioSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  tags: string[];
  type: "email-triage" | "mfa-fatigue" | "qr-phish";
  steps: {
    intro: string;
    artifact: Record<string, JsonValue>;
    questions: LabQuestion[];
  };
};

const SCENARIOS: LabScenarioSeed[] = [
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
      intro:
        "A vendor claims their banking details changed. Your job is to decide how to respond without leaking data.",
      artifact: {
        from: "ap@northwind-suppliers.com",
        replyTo: "northwind-ap@outlook-mail.com",
        subject: "Urgent: Updated payment details for April invoice",
        body:
          "Hi team, we switched banks. Please use the new account details attached and confirm once the April invoice is scheduled. We are on a tight deadline. Thanks!",
        attachments: ["APRIL_INVOICE_UPDATE.pdf"],
      },
      questions: [
        {
          prompt: "What is the most suspicious indicator?",
          options: [
            "The request is urgent",
            "The reply-to domain differs from the sender domain",
            "The email has an attachment",
            "The message is short",
          ],
          correctIndex: 1,
          explanation:
            "A mismatched reply-to domain is a strong sign of email spoofing or compromise.",
        },
        {
          prompt: "What is the safest next step?",
          options: [
            "Process the update immediately",
            "Reply asking for confirmation",
            "Call the vendor using a known number",
            "Forward to your manager and wait",
          ],
          correctIndex: 2,
          explanation: "Out-of-band verification prevents attackers from controlling the thread.",
        },
      ],
    },
  },
  {
    slug: "mfa-fatigue-attack",
    title: "MFA Fatigue Attack",
    summary: "Handle repeated MFA prompts without enabling account takeover.",
    category: "Authentication",
    difficulty: "Beginner",
    estimatedMinutes: 6,
    tags: ["mfa", "identity", "alerts"],
    type: "mfa-fatigue",
    steps: {
      intro:
        "You receive a burst of MFA push notifications while in a meeting. Decide how to respond.",
      artifact: {
        prompts: 6,
        timeWindow: "2 minutes",
        location: "Unrecognized device, Berlin",
      },
      questions: [
        {
          prompt: "What should you do first?",
          options: [
            "Approve one prompt to stop the alerts",
            "Ignore all prompts and continue working",
            "Report the prompts and reset your password",
            "Turn off MFA temporarily",
          ],
          correctIndex: 2,
          explanation:
            "Report the incident and reset credentials to stop credential stuffing and alert spam.",
        },
        {
          prompt: "Which control reduces MFA fatigue risk long term?",
          options: [
            "Longer session timeouts",
            "Number matching or phishing-resistant MFA",
            "Removing push notifications",
            "Disabling device trust",
          ],
          correctIndex: 1,
          explanation: "Number matching and phishing-resistant MFA prevent push bombing success.",
        },
      ],
    },
  },
  {
    slug: "qr-code-payroll",
    title: "QR Payroll Update",
    summary: "Evaluate a QR code request that claims to update payroll details.",
    category: "QR Phishing",
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    tags: ["qr", "mobile", "payroll"],
    type: "qr-phish",
    steps: {
      intro:
        "An HR email asks employees to scan a QR code to update direct deposit settings.",
      artifact: {
        sender: "hr@company-payroll.com",
        qrLabel: "Scan to update bank details",
        urlPreview: "http://payroll-update.company-payroll.com/login",
      },
      questions: [
        {
          prompt: "What is the highest risk in this message?",
          options: [
            "The message targets payroll information",
            "The link uses HTTP instead of HTTPS",
            "It asks for bank details immediately",
            "All of the above",
          ],
          correctIndex: 3,
          explanation: "Payroll phishing combines urgency, sensitive data, and insecure links.",
        },
        {
          prompt: "What is the best action?",
          options: [
            "Scan the QR code on a personal device",
            "Forward to coworkers for awareness",
            "Verify via the HR portal or known intranet link",
            "Reply asking HR to confirm",
          ],
          correctIndex: 2,
          explanation: "Use a trusted portal instead of the QR code link.",
        },
      ],
    },
  },
  {
    slug: "helpdesk-imposter-reset",
    title: "Helpdesk Imposter Reset",
    summary: "Validate identity safely when a caller requests urgent account recovery.",
    category: "Social Engineering",
    difficulty: "Advanced",
    estimatedMinutes: 10,
    tags: ["helpdesk", "identity", "verification"],
    type: "email-triage",
    steps: {
      intro:
        "A support ticket email asks for immediate password reset and includes pressure from a fake executive escalation.",
      artifact: {
        from: "it-helpdesk@company-supportdesk.com",
        subject: "Escalated reset request from COO office",
        ticketId: "HD-99124",
        body:
          "Employee is locked out before a board presentation. Reset the account and send temporary credentials to this thread.",
        escalationNote: "COO notified and waiting",
      },
      questions: [
        {
          prompt: "Which signal is the highest risk here?",
          options: [
            "The message has a ticket id",
            "The sender uses a lookalike support domain",
            "The request mentions the COO",
            "The issue is time-sensitive",
          ],
          correctIndex: 1,
          explanation: "Lookalike domains are common in internal impersonation attacks.",
        },
        {
          prompt: "What should happen before any reset action?",
          options: [
            "Send temporary credentials immediately",
            "Ask for employee birth date over email",
            "Perform identity verification through approved support workflow",
            "Forward the ticket to teammates and wait",
          ],
          correctIndex: 2,
          explanation:
            "Identity proofing via approved channels is mandatory for account recovery actions.",
        },
        {
          prompt: "What is the best escalation path if impersonation is suspected?",
          options: [
            "Close the ticket silently",
            "Escalate to SOC and preserve message evidence",
            "Reply to sender requesting government ID",
            "Reset password and force MFA change later",
          ],
          correctIndex: 1,
          explanation: "SOC escalation with evidence preservation improves containment and investigation.",
        },
      ],
    },
  },
];

export const ensureLabScenarios = async () => {
  await Promise.all(
    SCENARIOS.map((scenario) =>
      prisma.labScenario.upsert({
        where: { slug: scenario.slug },
        update: {
          title: scenario.title,
          summary: scenario.summary,
          category: scenario.category,
          difficulty: scenario.difficulty,
          estimatedMinutes: scenario.estimatedMinutes,
          tags: scenario.tags,
          type: scenario.type,
          steps: scenario.steps,
        },
        create: {
          slug: scenario.slug,
          title: scenario.title,
          summary: scenario.summary,
          category: scenario.category,
          difficulty: scenario.difficulty,
          estimatedMinutes: scenario.estimatedMinutes,
          tags: scenario.tags,
          type: scenario.type,
          steps: scenario.steps,
        },
      }),
    ),
  );
};

export const scoreScenario = (scenarioSteps: LabScenarioSeed["steps"], answers: number[]) => {
  const questions = scenarioSteps.questions;
  let score = 0;
  const graded = questions.map((question, index) => {
    const correct = answers[index] === question.correctIndex;
    if (correct) score += 1;
    return {
      prompt: question.prompt,
      selectedIndex: answers[index] ?? null,
      correctIndex: question.correctIndex,
      correct,
      explanation: question.explanation,
    };
  });

  return {
    score,
    total: questions.length,
    graded,
  };
};
