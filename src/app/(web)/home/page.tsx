import * as React from "react";
import { EntryTable } from "./_components/entry-table";
import { getUserEntries } from "@/lib/queries/get-user-entries";

export default async function HomePage() {
  const entries = await getUserEntries();
  if (!entries) {
    return <div>No entries found</div>;
  }
  return <EntryTable entries={entries} />;
}
