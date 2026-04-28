import { createError } from "h3";
import { z } from "zod";

export const incidentResponseSchema = z.object({
  status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED"]),
  action: z.enum(["block sender", "alert user", "reset credentials"]),
});

const allowedTransitions: Record<"OPEN" | "INVESTIGATING" | "RESOLVED", Array<"OPEN" | "INVESTIGATING" | "RESOLVED">> = {
  OPEN: ["OPEN", "INVESTIGATING"],
  INVESTIGATING: ["INVESTIGATING", "RESOLVED"],
  RESOLVED: ["RESOLVED"],
};

export const assertValidStatusTransition = (
  currentStatus: "OPEN" | "INVESTIGATING" | "RESOLVED",
  nextStatus: "OPEN" | "INVESTIGATING" | "RESOLVED",
) => {
  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw createError({
      statusCode: 409,
      statusMessage: `Invalid status transition from ${currentStatus} to ${nextStatus}.`,
    });
  }
};
