"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, title: "Entry Details", short: "Details" },
  { id: 2, title: "AI Review 1", short: "Review 1" },
  { id: 3, title: "AI Review 2", short: "Review 2" },
  { id: 4, title: "AI Review 3", short: "Review 3" },
  { id: 5, title: "AI Review 4", short: "Review 4" },
];

interface EntryProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
}

export function EntryProgress({
  currentStep,
  totalSteps,
  onStepChange,
}: EntryProgressProps) {
  const goToStep = (step: number) => {
    if (onStepChange) {
      onStepChange(step);
    }
  };

  return (
    <div className="w-full">
      {/* Tab-style Progress Navigator */}
      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`relative flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                step.id === currentStep
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : step.id < currentStep
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.short}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
