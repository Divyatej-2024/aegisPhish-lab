import prisma from "@aegisPhish-lab/db";

export type SimStep = {
  title: string;
  prompt: string;
  email: {
    from: string;
    replyTo?: string;
    subject: string;
    body: string;
    attachments?: string[];
    linkText?: string;
    linkUrl?: string;
  };
  actions: {
    type: "report" | "click" | "reply" | "download" | "ignore";
    label: string;
    score: number;
    feedback: string;
  }[];
};

export type SimLevelSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  difficulty: string;
  order: number;
  steps: SimStep[];
};

const LEVELS: SimLevelSeed[] = [
  {
    slug: "payroll-password-reset",
    title: "Payroll Password Reset",
    summary: "A payroll portal forces a reset after a suspicious login alert.",
    category: "Credential Phish",
    difficulty: "Beginner",
    order: 1,
    steps: [
      {
        title: "Suspicious Payroll Alert",
        prompt: "What is the safest response?",
        email: {
          from: "payroll@company-payroll.com",
          replyTo: "payroll-helpdesk@support-mail.com",
          subject: "Action required: Reset payroll password",
          body:
            "We detected suspicious sign-ins on your payroll profile. Reset your password within 2 hours to avoid lockout.",
          linkText: "Reset payroll password",
          linkUrl: "http://company-payroll.com-reset.verify-user.com",
        },
        actions: [
          {
            type: "report",
            label: "Report to SOC and verify via intranet",
            score: 3,
            feedback: "Correct. Use official portals and report suspicious messages.",
          },
          {
            type: "click",
            label: "Click the link to reset quickly",
            score: -2,
            feedback: "Risky. The URL is mismatched and uses an unsafe domain.",
          },
          {
            type: "reply",
            label: "Reply asking for confirmation",
            score: -1,
            feedback: "Not ideal. Attackers can control replies.",
          },
          {
            type: "ignore",
            label: "Ignore and continue working",
            score: -1,
            feedback: "Ignoring might delay a real issue. Verify through official channels.",
          },
        ],
      },
      {
        title: "Follow-up Message from \"IT Support\"",
        prompt: "A follow-up asks for your MFA code to finalize remediation. What should you do?",
        email: {
          from: "it-support@company-security.net",
          replyTo: "security-response@company-security.net",
          subject: "Final verification needed to unlock payroll",
          body:
            "Thanks for your quick response. Reply with the 6-digit MFA code from your authenticator so we can finalize the account unlock.",
        },
        actions: [
          {
            type: "report",
            label: "Report this as social engineering and call IT via service desk",
            score: 3,
            feedback: "Correct. Legitimate IT teams should never ask for one-time MFA codes.",
          },
          {
            type: "reply",
            label: "Reply with the MFA code to speed up the fix",
            score: -3,
            feedback: "Critical mistake. Sharing MFA codes enables immediate account takeover.",
          },
          {
            type: "ignore",
            label: "Ignore the message and take no action",
            score: -1,
            feedback: "Safer than sharing codes, but you should still report and verify through official channels.",
          },
        ],
      },
    ],
  },
  {
    slug: "executive-wire-request",
    title: "Executive Wire Request",
    summary: "A CFO requests a wire transfer for a confidential acquisition.",
    category: "Business Email Compromise",
    difficulty: "Intermediate",
    order: 2,
    steps: [
      {
        title: "CFO Urgent Wire",
        prompt: "How should you proceed?",
        email: {
          from: "cfo-office@company.com",
          replyTo: "cfo-office@company.com",
          subject: "Confidential: urgent wire transfer today",
          body:
            "We need a same-day wire for a strategic deal. I will send details once you confirm you are available.",
        },
        actions: [
          {
            type: "report",
            label: "Escalate to finance lead and verify via phone",
            score: 3,
            feedback: "Correct. Use known channels and approvals for high-risk requests.",
          },
          {
            type: "reply",
            label: "Confirm availability and await instructions",
            score: -1,
            feedback: "Risky. High-value transactions require verification before engagement.",
          },
          {
            type: "ignore",
            label: "Ignore because it looks suspicious",
            score: 0,
            feedback: "Better to verify and report rather than ignore.",
          },
        ],
      },
      {
        title: "Bank Details Sent in Second Email",
        prompt: "The sender now provides offshore transfer details and asks you to bypass approval due to secrecy.",
        email: {
          from: "cfo-office@company.com",
          subject: "Use this account only - confidential deal",
          body:
            "Please skip standard approval workflow. This acquisition is sensitive and must remain confidential until legal sign-off.",
        },
        actions: [
          {
            type: "report",
            label: "Pause transfer, trigger BEC process, and require dual authorization",
            score: 3,
            feedback: "Correct. High-risk payment requests require independent verification and controls.",
          },
          {
            type: "click",
            label: "Open attached instructions and process urgently",
            score: -2,
            feedback: "Risky. Attackers use urgency plus secrecy to bypass payment safeguards.",
          },
          {
            type: "reply",
            label: "Reply requesting verbal confirmation from CFO",
            score: 1,
            feedback: "Better than processing directly, but official escalation and dual approval is stronger.",
          },
        ],
      },
    ],
  },
  {
    slug: "cloud-doc-share",
    title: "Cloud Document Share",
    summary: "A shared document claims to contain updated HR policies.",
    category: "Attachment Phish",
    difficulty: "Intermediate",
    order: 3,
    steps: [
      {
        title: "Shared Policies Doc",
        prompt: "Choose the safest action.",
        email: {
          from: "hr@company-helpdesk.com",
          subject: "Updated policy pack - review today",
          body:
            "HR has updated the employee handbook. Download the pack and confirm receipt before end of day.",
          attachments: ["PolicyPack.zip"],
        },
        actions: [
          {
            type: "report",
            label: "Report and verify on the HR portal",
            score: 3,
            feedback: "Correct. Verify using trusted internal sources.",
          },
          {
            type: "download",
            label: "Download the attachment to review",
            score: -2,
            feedback: "Unsafe. Compressed attachments are common malware delivery methods.",
          },
          {
            type: "ignore",
            label: "Ignore the email",
            score: -1,
            feedback: "Ignoring can delay important policy updates. Verify safely instead.",
          },
        ],
      },
      {
        title: "Reminder with Link to \"View in Browser\"",
        prompt: "A reminder includes a shortened link and asks for immediate policy acknowledgement.",
        email: {
          from: "hr-notify@company-helpdesk.com",
          subject: "Reminder: policy sign-off pending",
          body:
            "Open the policy portal and submit acknowledgement before 5 PM today to avoid access restrictions.",
          linkText: "Open policy portal",
          linkUrl: "http://bit.ly/policy-ack-urgent",
        },
        actions: [
          {
            type: "report",
            label: "Report message and access HR policy via known intranet URL",
            score: 3,
            feedback: "Correct. Use trusted internal URLs instead of shortened links.",
          },
          {
            type: "click",
            label: "Click link and sign in to complete acknowledgement",
            score: -2,
            feedback: "Unsafe. Shortened HTTP links are a common credential phishing technique.",
          },
          {
            type: "ignore",
            label: "Ignore reminder until tomorrow",
            score: -1,
            feedback: "Not ideal. Verify quickly through trusted systems and report suspicious prompts.",
          },
        ],
      },
    ],
  },
];

export const ensureSimLevels = async () => {
  await Promise.all(
    LEVELS.map((level) =>
      prisma.simLevel.upsert({
        where: { slug: level.slug },
        update: {
          title: level.title,
          summary: level.summary,
          category: level.category,
          difficulty: level.difficulty,
          order: level.order,
          content: level,
        },
        create: {
          slug: level.slug,
          title: level.title,
          summary: level.summary,
          category: level.category,
          difficulty: level.difficulty,
          order: level.order,
          content: level,
        },
      }),
    ),
  );
};

export const scoreAction = (actionType: string, level: SimLevelSeed, stepIndex: number) => {
  const step = level.steps[stepIndex];
  if (!step) return { score: 0, feedback: "No step found." };
  const action = step.actions.find((item) => item.type === actionType);
  if (!action) return { score: 0, feedback: "Unknown action." };
  return { score: action.score, feedback: action.feedback };
};
