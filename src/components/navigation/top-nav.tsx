"use client";

import { BreadcrumbNav } from "./breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { createEntry } from "@/lib/actions/create-entry";
import { useCreateEntry } from "@/lib/hooks/use-create-entry";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopNav() {
  const router = useRouter();
  const { createEntry, isCreatingEntry } = useCreateEntry();

  const handleCreateEntry = async () => {
    const result = await createEntry();
    if (result.success && result.entryId) {
      router.push(`/home/${result.entryId}`);
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 border-b">
      <BreadcrumbNav />
      <Button
        size="sm"
        className="flex items-center gap-2"
        onClick={handleCreateEntry}
        disabled={isCreatingEntry}
        loading={isCreatingEntry}
      >
        <Plus className="h-4 w-4" />
        New Entry
      </Button>
    </div>
  );
}
