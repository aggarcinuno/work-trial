import { useCallback, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { useDeepCompareEffect } from "use-deep-compare";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { z } from "zod";
import { EntryFormSchema } from "../form/entry-form-schema";
import { saveEntry } from "../actions/save-entry";

type FormData = z.infer<typeof EntryFormSchema>;

type UseFormAutoSaveProps = {
  entry_id: string;
};

const defaultFormData: FormData = {
  subject: "",
  question: "",
  image: "",
  answerLong: "",
  answerMultipleChoice: "",
  hint: "",
  answerChoices: [],
};

export const useFormAutoSave = ({ entry_id }: UseFormAutoSaveProps) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { control } = useFormContext<FormData>();
  const { isDirty, dirtyFields } = useFormState({ control });

  const watchedData = useWatch<FormData>({
    control: control,
    defaultValue: defaultFormData,
  });

  // Watch specific fields to ensure they trigger auto-save
  useWatch({
    control,
    name: "image",
  });

  const debouncedSave = useCallback(
    debounce(async (data: Partial<FormData>) => {
      try {
        setIsSaving(true);
        // Merge with default values to ensure all required fields are present
        const completeData = {
          ...defaultFormData,
          ...data,
          lastSaved: new Date().toISOString(),
        };
        console.log("Saving entry:", completeData);

        await saveEntry(entry_id, completeData);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error auto-saving:", error);
        toast.error("Error auto-saving form, please try again.");
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [entry_id]
  );

  useDeepCompareEffect(() => {
    if (isDirty || Object.keys(dirtyFields).length > 0) {
      debouncedSave(watchedData);
    }
  }, [watchedData]);

  return { isSaving, lastSaved };
};
