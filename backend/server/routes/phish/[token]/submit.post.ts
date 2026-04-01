import { createError, readBody, setHeader } from "h3";
import prisma from "@aegisPhish-lab/db";

import { getRequestMeta, hashSensitive } from "../../../utils/phish";

const renderTrainingPage = () => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Phishing Simulation</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "Inter", "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        background: #0f172a;
        color: #f8fafc;
        min-height: 100vh;
        display: grid;
        place-items: center;
      }
      .card {
        width: min(520px, 92vw);
        background: #111827;
        border: 1px solid #1f2937;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 35px 60px -40px rgba(15, 23, 42, 0.8);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 1.4rem;
      }
      p {
        color: #cbd5f5;
        line-height: 1.5;
      }
      ul {
        padding-left: 18px;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This was a phishing simulation.</h1>
      <p>
        No credentials were stored. Use this moment to pause, inspect the sender,
        and verify the URL before signing in.
      </p>
      <ul>
        <li>Check domain spelling and HTTPS certificate</li>
        <li>Hover to inspect links before clicking</li>
        <li>Report suspicious messages to the security team</li>
      </ul>
    </div>
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
  });

  if (!target) {
    throw createError({ statusCode: 404, statusMessage: "Invalid tracking token." });
  }

  const body = await readBody(event);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const { ipAddress, userAgent } = getRequestMeta(event);

  await prisma.phishEvent.create({
    data: {
      campaignId: target.campaignId,
      targetId: target.id,
      type: "submit",
      ipAddress,
      userAgent,
      metadata: {
        email: email || null,
        passwordHash: password ? hashSensitive(password) : null,
        passwordLength: password ? password.length : 0,
      },
    },
  });

  await prisma.phishTarget.update({
    where: { id: target.id },
    data: { status: "submitted" },
  });

  setHeader(event, "Content-Type", "text/html; charset=utf-8");
  return renderTrainingPage();
});
