import { getEntryById } from "@/lib/queries/get-entry";
import { EntryForm } from "./_components/entry-form";

interface EntryPageProps {
  params: {
    entryId: string;
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { entryId } = await params;
  console.log(entryId);
  const entry = await getEntryById(entryId);
  console.log(entry);
  if (!entry) {
    return <div>Entry not found</div>;
  }
  return (
    <div>
      <EntryForm {...entry} />
    </div>
  );
}
