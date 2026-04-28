import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { SocAlert } from "./generateAlert";

const LOG_FILE_PATH = resolve(process.cwd(), "logs", "phishing_events.log");

export const getAlertLogPath = () => LOG_FILE_PATH;

export const logPhishingEvent = async (alert: SocAlert) => {
  const payload = {
    timestamp: alert.timestamp,
    severity: alert.severity,
    event_type: alert.event_type,
    user: alert.user ?? null,
    source: alert.source,
    rule_triggered: alert.reasons.map((reason) => reason.code),
    confidence: alert.confidence,
    correlation_id: alert.correlation_id ?? null,
    mitre_technique: alert.mitre_technique,
  };

  await mkdir(dirname(LOG_FILE_PATH), { recursive: true });
  await appendFile(LOG_FILE_PATH, `${JSON.stringify(payload)}\n`, "utf8");
};
