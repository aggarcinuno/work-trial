import { createClient } from "@/lib/supabase/server";

export async function getUserEntries() {
  const supabase = await createClient();
  const { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return null;
  }

  return entries;
}
