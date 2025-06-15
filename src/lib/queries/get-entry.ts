"use server";

import { createClient } from "@/lib/supabase/server";

export async function getEntryById(entryId: string) {
  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("entry_id", entryId)
    .single();

  if (error) {
    console.error("Error fetching entry:", error);
    return null;
  }

  return entry;
}
