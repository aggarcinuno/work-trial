"use client";

import { EntryForm } from "./entry-form";
import { EntryProgress } from "./entry-progress";
import { useState } from "react";
import { z } from "zod";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";
import { useRouter } from "next/navigation";
import { createSubmission } from "@/lib/actions/create-submission";

interface EntryClientProps {
  entry: z.infer<typeof EntryFormSchema>;
}

export function EntryClient({ entry }: EntryClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleFormComplete = async (data: z.infer<typeof EntryFormSchema>) => {
    try {
      // Create a new submission
      const result = await createSubmission({
        entryId: entry.entry_id!,
        question: data.question,
        answerChoices: data.answerChoices || [],
        diagram: data.image,
      });

      if (result.success && result.submissionId) {
        // Navigate to the submission page
        router.push(`/home/${entry.entry_id}/${result.submissionId}`);
      }
    } catch (error) {
      console.error("Error creating submission:", error);
    }
  };

  const handleStepChange = (step: number) => {
    // Only allow going back to previous steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <EntryProgress
        currentStep={currentStep}
        totalSteps={5}
        onStepChange={handleStepChange}
      />

      {currentStep === 1 && (
        <EntryForm
          entry_id={entry.entry_id!}
          entry={entry}
          onComplete={handleFormComplete}
        />
      )}
    </div>
  );
}
