"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface UpdateSubmissionParams {
  submissionId: string;
  aiAnswerMc: string;
  aiAnswerLong: string;
  status: "pending" | "processing" | "completed" | "failed";
}

export async function updateSubmission({
  submissionId,
  aiAnswerMc,
  aiAnswerLong,
  status,
}: UpdateSubmissionParams) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // First verify that the submission belongs to the current user
  const { data: submission, error: fetchError } = await supabase
    .from("submissions")
    .select("entry_id, entries!inner(user_id)")
    .eq("submission_id", submissionId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch submission: ${fetchError.message}`);
  }

  if (submission.entries[0].user_id !== user.data.user?.id) {
    throw new Error("Unauthorized: You can only update your own submissions");
  }

  // Update the submission
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      ai_answer_mc: aiAnswerMc,
      ai_answer_long: aiAnswerLong,
      status,
    })
    .eq("submission_id", submissionId);

  if (updateError) {
    throw new Error(`Failed to update submission: ${updateError.message}`);
  }

  revalidatePath(`/home/${submission.entry_id}/${submissionId}`);
  return { success: true };
}
