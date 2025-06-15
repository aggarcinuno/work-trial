import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";

export const useEntryForm = (entry: z.infer<typeof EntryFormSchema>) => {
  const form = useForm<z.infer<typeof EntryFormSchema>>({
    resolver: zodResolver(EntryFormSchema),
    mode: "onChange",
    defaultValues: {
      subject: entry.subject || "",
      question: entry.question || "",
      image: entry.image || "",
      answerLong: entry.answerLong || "",
      answerMultipleChoice: entry.answerMultipleChoice || "",
      hint: entry.hint || "",
      entry_id: entry.entry_id,
      created_at: entry.created_at,
      user_id: entry.user_id,
      answerChoices: entry.answerChoices || [],
      lastSaved: entry.lastSaved || "",
    },
    values: entry,
  });
  return form;
};
