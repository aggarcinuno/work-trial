"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EntryFormSchema } from "../form/entry-form-schema";
import { z } from "zod";

export async function createEntry() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const entryData: z.infer<typeof EntryFormSchema> = {
    question: "",
    answerLong: "",
    answerMultipleChoice: "",
    hint: "",
    image: "",
    subject: "",
    answerChoices: [],
    status: "in_progress",
  };

  const { data, error } = await supabase
    .from("entries")
    .insert([{ ...entryData, user_id: user.data.user?.id }])
    .select("entry_id")
    .single();

  if (error) {
    throw new Error(`Failed to create entry: ${error.message}`);
  }

  revalidatePath("/");
  return { success: true, entryId: data.entry_id };
}
