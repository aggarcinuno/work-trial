"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateSubmissionParams {
  entryId: string;
  status: string;
}

export async function createSubmission({
  entryId,
  status,
}: CreateSubmissionParams) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

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
    throw new Error(
      "Unauthorized: You can only create submissions for your own entries"
    );
  }

  // Create the submission
  const { data, error } = await supabase
    .from("submissions")
    .insert([
      {
        entry_id: entryId,
        status: status, // pending, processing, completed, failed
        user_id: user.data.user?.id,
      },
    ])
    .select("submission_id")
    .single();

  if (error) {
    throw new Error(`Failed to create submission: ${error.message}`);
  }

  revalidatePath(`/home/${entryId}`);
  return { success: true, submissionId: data.submission_id };
}
