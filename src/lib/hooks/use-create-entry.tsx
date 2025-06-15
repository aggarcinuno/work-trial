import { createEntry } from "../actions/create-entry";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateEntry = () => {
  const { isPending: isCreatingEntry, mutate: createEntryAction } = useMutation(
    {
      mutationFn: createEntry,
      onSuccess: async (response) => {
        toast.success("Entry has been created.");
      },
      onError: (error) => {
        console.log("error in usePostListing", error);
        toast.error("Error creating entry.");
      },
    }
  );

  return { createEntry, isCreatingEntry };
};
