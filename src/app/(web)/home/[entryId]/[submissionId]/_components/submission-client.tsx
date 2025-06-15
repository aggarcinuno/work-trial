"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateAIResponse } from "@/lib/actions/generate-ai-response";
import { readStreamableValue } from "ai/rsc";
import { toast } from "sonner";
import { updateSubmission } from "@/lib/actions/update-submission";
import { useRouter } from "next/navigation";
import { EntryProgress } from "../../_components/entry-progress";

interface SubmissionClientProps {
  entry: {
    entry_id: string;
    question: string;
    answerChoices: string[];
    image?: string;
  };
  submission: {
    submission_id: string;
    status: "pending" | "processing" | "completed" | "failed";
    ai_answer_mc?: string;
    ai_answer_long?: string;
  };
}

export function SubmissionClient({ entry, submission }: SubmissionClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    aiAnswerMultipleChoice: string;
    explanation: string;
    solution: string;
    keyPoints: string[];
  } | null>(null);

  const handleGenerateAIResponse = async () => {
    setIsLoading(true);
    try {
      const { object } = await generateAIResponse(
        entry.question,
        entry.answerChoices,
        entry.image
      );
      
      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          setAiResponse(prev => ({
            aiAnswerMultipleChoice: partialObject.aiAnswerMultipleChoice || prev?.aiAnswerMultipleChoice || "",
            explanation: partialObject.explanation || prev?.explanation || "",
            solution: partialObject.solution || prev?.solution || "",
            keyPoints: partialObject.keyPoints || prev?.keyPoints || [],
          }));
        }
      }
      
      if (aiResponse) {
        // Update the submission with the AI response
        await updateSubmission({
          submissionId: submission.submission_id,
          aiAnswerMc: aiResponse.aiAnswerMultipleChoice,
          aiAnswerLong: aiResponse.explanation,
          status: "completed"
        });

        // Refresh the page to show the updated submission
        router.refresh();
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate AI response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <EntryProgress
        currentStep={2}
        totalSteps={5}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold leading-none">AI Review</h1>
              <span className="text-sm text-gray-600 leading-none">
                (Submission ID: {submission.submission_id})
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {entry.question}
              </div>
            </div>

            <div>
              <Label>Answer Choices</Label>
              <div className="mt-1 space-y-2">
                {entry.answerChoices.map((choice, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md ${
                      String.fromCharCode(65 + index) === aiResponse?.aiAnswerMultipleChoice
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>{" "}
                    {choice}
                  </div>
                ))}
              </div>
            </div>

            {entry.image && (
              <div>
                <Label>Diagram</Label>
                <div className="mt-1">
                  <img 
                    src={entry.image} 
                    alt="Question diagram" 
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          {submission.status === "pending" && (
            <Button
              onClick={handleGenerateAIResponse}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Processing...
                </div>
              ) : (
                "Generate AI Review"
              )}
            </Button>
          )}

          {submission.status === "completed" && aiResponse && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">AI's Answer</h3>
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  Option {aiResponse.aiAnswerMultipleChoice}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Explanation</h3>
                <div className="prose prose-sm max-w-none">{aiResponse.explanation}</div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Solution</h3>
                <div className="prose prose-sm max-w-none">{aiResponse.solution}</div>
              </div>
              {aiResponse.keyPoints && aiResponse.keyPoints.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {aiResponse.keyPoints.map((point, index) => (
                      <li key={index} className="prose prose-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 