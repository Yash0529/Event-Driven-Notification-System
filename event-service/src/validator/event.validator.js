import { z } from 'zod';

const eventSchema = z.object({
  type: z.enum(["ORDER_PLACED", "PAYMENT_FAILED", "WELCOME"]),
  userId: z.string().min(1),
  idempotencyKey: z.string().min(8),
  payload: z.object({}).passthrough(),
  priority: z.number().int().min(1).max(10).default(5),
  scheduledFor: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  ttlSeconds: z.number().positive().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).default("PENDING"),
  category:z.enum(["OTP","TRANSACTIONAL","SYSTEM","MARKETING"]).default("SYSTEM"),
  channel:z.enum(["EMAIL","PUSH","SMS"]).default("EMAIL"),

});

export default eventSchema;