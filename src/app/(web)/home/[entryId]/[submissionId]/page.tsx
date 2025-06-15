import { getEntryById } from "@/lib/queries/get-entry";
import { getSubmissionById } from "@/lib/queries/get-submission";
import { notFound } from "next/navigation";
import { SubmissionClient } from "./_components/submission-client";

interface PageProps {
  params: { 
    entryId: string;
    submissionId: string;
  };
}

export default async function SubmissionPage({ params }: PageProps) {
  const [entry, submission] = await Promise.all([
    getEntryById(params.entryId),
    getSubmissionById(params.submissionId)
  ]);
  
  if (!entry || !submission) {
    notFound();
  }

  return <SubmissionClient entry={entry} submission={submission} />;
}
