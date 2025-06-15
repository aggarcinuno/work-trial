"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, title: "Entry Details", short: "Details" },
  { id: 2, title: "AI Review", short: "Review" },
  { id: 3, title: "Step-by-Step Solution", short: "Step-by-Step" },
];

interface EntryProgressProps {
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export function EntryProgress({
  currentStep,
  onStepChange,
}: EntryProgressProps) {
  const goToStep = (step: number) => {
    // Only allow going to current or previous steps
    if (onStepChange && step <= currentStep) {
      onStepChange(step);
    }
  };

  return (
    <div className="w-full">
      {/* Tab-style Progress Navigator */}
      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {steps.map((step) => {
            const isFutureStep = step.id > currentStep;
            const isCurrentStep = step.id === currentStep;
            const isPastStep = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                disabled={isFutureStep}
                className={`relative flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrentStep
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : isPastStep
                    ? "text-green-600 hover:text-green-700 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isPastStep
                        ? "bg-green-500 text-white"
                        : isCurrentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isPastStep ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.short}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
