"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntryForm } from "./entry-form";
import { createSubmission } from "@/lib/actions/create-submission";
import { toast } from "sonner";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";
import { SubmissionFormSchema } from "@/lib/form/submission-form-schema";
import { z } from "zod";
import { EntryProgress } from "./entry-progress";
import { SubmissionForm } from "./submission-form";
import { SolutionForm } from "./solution-form";

interface EntryClientProps {
  entry: z.infer<typeof EntryFormSchema>;
  submissions: z.infer<typeof SubmissionFormSchema>[];
}

export function EntryClient({ entry, submissions }: EntryClientProps) {
  const router = useRouter();
  console.log("submissions", submissions);

  const [currentStep, setCurrentStep] = useState(() => {
    if (!submissions) return 1;
    const maxStep = submissions.reduce((max, submission) => {
      return submission.step && submission.step > max ? submission.step : max;
    }, 0);
    return maxStep + 1;
  });

  const handleFormComplete = async () => {
    if (!entry.entry_id) {
      toast.error("Entry ID is missing");
      return;
    }

    try {
      await createSubmission({
        entryId: entry.entry_id,
        status: "pending",
      });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Error creating submission:", error);
      toast.error("Failed to create submission. Please try again.");
    }
  };

  const handleSubmissionComplete = async () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSolutionSubmit = async (data: any) => {
    console.log("data", data);
    router.push("/home");
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  if (!entry.entry_id) {
    return null;
  }

  return (
    <>
      <EntryProgress
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
      {currentStep === 1 && (
        <EntryForm entry={entry} onComplete={handleFormComplete} />
      )}
      {currentStep === 2 && (
        <SubmissionForm
          entry={entry}
          submission={submissions[currentStep - 1]}
          onComplete={handleSubmissionComplete}
        />
      )}
      {currentStep === 3 && (
        <SolutionForm
          onSubmit={handleSolutionSubmit}
          entryId={entry.entry_id}
          entry={entry}
        />
      )}
    </>
  );
}
