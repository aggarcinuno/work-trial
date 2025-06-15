import { getEntryById } from "@/lib/queries/get-entry";
import { getEntrySubmissions } from "@/lib/queries/get-entry-submissions";
import { notFound } from "next/navigation";
import { EntryClient } from "./_components/entry-client";

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default async function EntryPage({ params }: PageProps) {
  const { entryId } = await params;
  const [entry, submissions] = await Promise.all([
    getEntryById(entryId),
    getEntrySubmissions(entryId),
  ]);

  if (!entry) {
    notFound();
  }

  return <EntryClient entry={entry} submissions={submissions || []} />;
}
