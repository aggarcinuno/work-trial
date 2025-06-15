"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteEntry(entryId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // First verify that the entry belongs to the current user
  const { data: entry, error: fetchError } = await supabase
    .from("entries")
    .select("user_id")
    .eq("entry_id", entryId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch entry: ${fetchError.message}`);
  }

  if (entry.user_id !== user.data.user?.id) {
    throw new Error("Unauthorized: You can only delete your own entries");
  }

  // Delete the entry
  const { error: deleteError } = await supabase
    .from("entries")
    .delete()
    .eq("entry_id", entryId);

  if (deleteError) {
    throw new Error(`Failed to delete entry: ${deleteError.message}`);
  }

  revalidatePath("/");
  return { success: true };
}
