import { EntryForm } from "./_components/entry-form";
import { EntryProgress } from "./_components/entry-progress";
import { getEntryById } from "@/lib/queries/get-entry";
import { notFound } from "next/navigation";
import { EntryClient } from "./_components/entry-client";

interface PageProps {
  params: { entryId: string };
}

export default async function EntryPage({ params }: PageProps) {
  const entry = await getEntryById(params.entryId);
  
  if (!entry) {
    notFound();
  }

  return <EntryClient entry={entry} />;
}
