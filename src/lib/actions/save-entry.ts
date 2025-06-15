"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EntryFormSchema } from "../form/entry-form-schema";
import { z } from "zod";

export async function saveEntry(
  entryId: string,
  data: z.infer<typeof EntryFormSchema>
) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  console.log("data", data);

  // First verify that the entry belongs to the current user
  const { data: existingEntry, error: fetchError } = await supabase
    .from("entries")
    .select("user_id")
    .eq("entry_id", entryId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch entry: ${fetchError.message}`);
  }

  if (existingEntry.user_id !== user.data.user?.id) {
    throw new Error("Unauthorized: You can only update your own entries");
  }

  // Update the entry
  const { error: updateError } = await supabase
    .from("entries")
    .update(data)
    .eq("entry_id", entryId);

  if (updateError) {
    throw new Error(`Failed to update entry: ${updateError.message}`);
  }

  revalidatePath(`/home/${entryId}`);
  return { success: true };
}
