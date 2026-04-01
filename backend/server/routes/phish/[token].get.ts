import { createError, setHeader } from "h3";
import prisma from "@aegisPhish-lab/db";

import { getRequestMeta } from "../../utils/phish";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderLoginPage = (campaignName: string, token: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(campaignName)} - Secure Portal</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "Inter", "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        background: linear-gradient(135deg, #f8fafc, #eef2ff);
        min-height: 100vh;
        display: grid;
        place-items: center;
      }
      .shell {
        width: min(420px, 90vw);
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 30px 60px -40px rgba(15, 23, 42, 0.4);
      }
      h1 {
        margin: 0;
        font-size: 1.25rem;
      }
      p {
        color: #64748b;
        font-size: 0.9rem;
      }
      label {
        display: block;
        margin-top: 14px;
        font-size: 0.75rem;
        color: #475569;
      }
      input {
        width: 100%;
        margin-top: 6px;
        border: 1px solid #cbd5f5;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 0.9rem;
      }
      button {
        margin-top: 18px;
        width: 100%;
        border: none;
        background: #1e40af;
        color: white;
        padding: 12px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
      }
      .note {
        margin-top: 16px;
        font-size: 0.75rem;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <form class="shell" method="POST" action="/phish/${token}/submit">
      <h1>Secure Login Required</h1>
      <p>To view the protected document, sign in with your corporate credentials.</p>
      <label>
        Email
        <input name="email" type="email" autocomplete="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" autocomplete="current-password" required />
      </label>
      <button type="submit">Continue</button>
      <div class="note">Security notice: This portal uses MFA for sensitive accounts.</div>
    </form>
  </body>
</html>
`;

export default defineEventHandler(async (event) => {
  const token = event.context.params?.token;
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "Missing token." });
  }

  const target = await prisma.phishTarget.findUnique({
    where: { token },
    include: { campaign: true },
  });

  if (!target) {
    throw createError({ statusCode: 404, statusMessage: "Invalid tracking token." });
  }

  const { ipAddress, userAgent } = getRequestMeta(event);

  await prisma.phishEvent.create({
    data: {
      campaignId: target.campaignId,
      targetId: target.id,
      type: "click",
      ipAddress,
      userAgent,
    },
  });

  if (target.status !== "submitted") {
    await prisma.phishTarget.update({
      where: { id: target.id },
      data: { status: "clicked" },
    });
  }

  setHeader(event, "Content-Type", "text/html; charset=utf-8");
  return renderLoginPage(target.campaign?.name ?? "Secure", token);
});
