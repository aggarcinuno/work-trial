import { z } from "zod";

export const EntryFormSchema = z.object({
  subject: z.string().min(1, { message: "Subject required" }),
  question: z.string().min(1, { message: "Question required" }),
  image: z.string().min(1, { message: "Image required" }),
  answerLong: z.string().min(1, { message: "Answer required" }),
  answerMultipleChoice: z.string().min(1, { message: "Answer required" }),
  hint: z.string().min(1, { message: "Hint required" }),
  entry_id: z.string().optional(),
  created_at: z.string().optional(),
  user_id: z.string().optional(),
  answerChoices: z.array(z.string()).optional(),
});
