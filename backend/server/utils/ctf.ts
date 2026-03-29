import crypto from "node:crypto";

import prisma from "@aegisPhish-lab/db";

export type CtfChallengeSeed = {
  slug: string;
  title: string;
  description: string;
  hint?: string;
  category: string;
  points: number;
  flag: string;
};

const CHALLENGES: CtfChallengeSeed[] = [
  {
    slug: "osint-invisible-note",
    title: "Invisible Note",
    description: "Find the hidden flag left in the page source.",
    hint: "Right-click the page and view source.",
    category: "OSINT",
    points: 50,
    flag: "CTF{source_sleuth}",
  },
  {
    slug: "crypto-base64-drop",
    title: "Base64 Drop",
    description: "Decode the base64 payload to recover the flag.",
    hint: "Use any base64 decoder.",
    category: "Crypto",
    points: 75,
    flag: "CTF{base64_mastery}",
  },
  {
    slug: "web-cookie-crumbs",
    title: "Cookie Crumbs",
    description: "Set a cookie named ap_ctf_token with value trustno1.",
    hint: "DevTools > Application > Cookies.",
    category: "Web",
    points: 100,
    flag: "CTF{cookie_monster}",
  },
  {
    slug: "forensics-artifact",
    title: "Artifact Decode",
    description: "Recover the flag embedded in the hex artifact.",
    hint: "Hex decode the payload.",
    category: "Forensics",
    points: 125,
    flag: "CTF{hex_hunter}",
  },
  {
    slug: "logic-shifted-signal",
    title: "Shifted Signal",
    description: "Decrypt the Caesar-shifted message to get the flag.",
    hint: "Shift letters backward by 7.",
    category: "Logic",
    points: 150,
    flag: "CTF{logic_shift_master}",
  },
  {
    slug: "attack-chain-sim",
    title: "Attack Chain (Simulated)",
    description:
      "Review the fictional incident notes and identify the technique used to pivot from phishing to internal access.",
    hint: "The answer is the technique name in the notes.",
    category: "Incident Analysis",
    points: 175,
    flag: "CTF{attack_chain_sim}",
  },
];

export const hashFlag = (flag: string) =>
  crypto.createHash("sha256").update(flag).digest("hex");

export const ensureCtfChallenges = async () => {
  await Promise.all(
    CHALLENGES.map((challenge) =>
      prisma.ctfChallenge.upsert({
        where: { slug: challenge.slug },
        update: {
          title: challenge.title,
          description: challenge.description,
          hint: challenge.hint ?? null,
          category: challenge.category,
          points: challenge.points,
          flagHash: hashFlag(challenge.flag),
        },
        create: {
          slug: challenge.slug,
          title: challenge.title,
          description: challenge.description,
          hint: challenge.hint ?? null,
          category: challenge.category,
          points: challenge.points,
          flagHash: hashFlag(challenge.flag),
        },
      }),
    ),
  );
};

export const getChallengeSeeds = () => CHALLENGES;
