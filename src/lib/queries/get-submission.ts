"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSubmissionById(submissionId: string) {
  const supabase = await createClient();
  const { data: submission, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("submission_id", submissionId)
    .single();

  if (error) {
    console.error("Error fetching submission:", error);
    return null;
  }

  return submission;
} 