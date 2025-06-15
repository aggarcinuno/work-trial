import { z } from "zod";

export const SubmissionFormSchema = z.object({
  submission_id: z.string().uuid(),
  entry_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  ai_answer_long: z.string().nullable(),
  ai_answer_mc: z.string().nullable(),
  step: z.number().nullable(),
  created_at: z.string().datetime(),
});
