"use server";

import { createClient } from "@/lib/supabase/server";

export async function getEntrySubmissions(entryId: string) {
  const supabase = await createClient();
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("entry_id", entryId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    return null;
  }

  return submissions;
}
