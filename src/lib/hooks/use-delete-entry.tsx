import { deleteEntry } from "../actions/delete-entry";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useDeleteEntry = () => {
  const router = useRouter();
  const { isPending: isDeletingEntry, mutate: deleteEntryAction } = useMutation(
    {
      mutationFn: deleteEntry,
      onSuccess: async () => {
        toast.success("Entry has been deleted.");
        router.refresh();
      },
      onError: (error) => {
        console.error("Error deleting entry:", error);
        toast.error("Error deleting entry.");
      },
    }
  );

  return { deleteEntry: deleteEntryAction, isDeletingEntry };
};
