import { useCallback, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { useDeepCompareEffect } from "use-deep-compare";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { z } from "zod";
import { EntryFormSchema } from "../form/entry-form-schema";

type UseFormAutoSaveProps = {
  entry: z.infer<typeof EntryFormSchema>;
};

export const useFormAutoSave = ({ entry }: UseFormAutoSaveProps) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { control } = useFormContext();
  const { isDirty, dirtyFields } = useFormState({ control });

  const watchedData = useWatch({
    control: control,
    defaultValue: entry,
  });

  const debouncedSave = useCallback(
    debounce(async (data: z.infer<typeof EntryFormSchema>) => {
      try {
        setIsSaving(true);
        // TODO: Implement your save logic here
        // For now, we'll just simulate a save
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLastSaved(new Date());
        toast.success("Changes saved automatically");
      } catch (error) {
        toast.error("Error auto-saving form, please try again.");
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  useDeepCompareEffect(() => {
    if (isDirty || Object.keys(dirtyFields).length > 0) {
      debouncedSave(watchedData);
    }
  }, [watchedData]);

  return { isSaving, lastSaved };
}; 