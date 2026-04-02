import fs from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";
import { PrismaClient } from "../prisma/generated/client";

dotenv.config({
  path: path.resolve(process.cwd(), "../../backend/server/.env"),
});

type SeedData = {
  users?: any[];
  sessions?: any[];
  accounts?: any[];
  verifications?: any[];
  twoFactor?: any[];
  ctfChallenges?: any[];
  ctfSubmissions?: any[];
  labScenarios?: any[];
  labRuns?: any[];
  labEvents?: any[];
  phishCampaigns?: any[];
  phishTargets?: any[];
  phishEvents?: any[];
  simLevels?: any[];
  simRuns?: any[];
  simActions?: any[];
};

const prisma = new PrismaClient();

const loadSeedFile = async () => {
  const filePath = path.resolve(process.cwd(), "../../data/seed.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as SeedData;
};

const toDate = (value: unknown) => (typeof value === "string" ? new Date(value) : value);

const withDates = (item: Record<string, any>, keys: string[]) => {
  const next: Record<string, any> = { ...item };
  for (const key of keys) {
    if (key in next) next[key] = toDate(next[key]);
  }
  return next;
};

const upsertMany = async (
  model: { upsert: (args: any) => Promise<any> },
  items: any[] | undefined,
  dateKeys: string[] = [],
) => {
  if (!items || items.length === 0) return;
  for (const item of items) {
    if (!item?.id) continue;
    const data = withDates(item, dateKeys);
    const { id, ...rest } = data;
    await model.upsert({
      where: { id },
      update: rest,
      create: { id, ...rest },
    });
  }
};

const main = async () => {
  const seed = await loadSeedFile();

  await upsertMany(prisma.user, seed.users, ["createdAt", "updatedAt", "banExpires"]);
  await upsertMany(prisma.session, seed.sessions, ["createdAt", "updatedAt", "expiresAt"]);
  await upsertMany(prisma.account, seed.accounts, [
    "createdAt",
    "updatedAt",
    "accessTokenExpiresAt",
    "refreshTokenExpiresAt",
  ]);
  await upsertMany(prisma.verification, seed.verifications, ["createdAt", "updatedAt", "expiresAt"]);
  await upsertMany(prisma.twoFactor, seed.twoFactor, ["createdAt", "updatedAt"]);

  await upsertMany(prisma.ctfChallenge, seed.ctfChallenges, ["createdAt", "updatedAt"]);
  await upsertMany(prisma.ctfSubmission, seed.ctfSubmissions, ["submittedAt"]);

  await upsertMany(prisma.labScenario, seed.labScenarios, ["createdAt", "updatedAt"]);
  await upsertMany(prisma.labRun, seed.labRuns, ["startedAt", "completedAt"]);
  await upsertMany(prisma.labEvent, seed.labEvents, ["createdAt"]);

  await upsertMany(prisma.phishCampaign, seed.phishCampaigns, ["createdAt", "updatedAt"]);
  await upsertMany(prisma.phishTarget, seed.phishTargets, ["sentAt", "createdAt", "updatedAt"]);
  await upsertMany(prisma.phishEvent, seed.phishEvents, ["createdAt"]);

  await upsertMany(prisma.simLevel, seed.simLevels, ["createdAt", "updatedAt"]);
  await upsertMany(prisma.simRun, seed.simRuns, ["startedAt", "completedAt"]);
  await upsertMany(prisma.simAction, seed.simActions, ["createdAt"]);

  console.log("Seed complete.");
};

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
