"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateAIResponse } from "@/lib/actions/generate-ai-response";
import { readStreamableValue } from "ai/rsc";
import { updateSubmission } from "@/lib/actions/update-submission";

export function SubmissionForm({ submission, entry, onComplete }: any) {
  console.log("entry", entry);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    answerMultipleChoice: string;
    answerLong: string;
  } | null>(null);

  async function handleGenerateReview() {
    if (!entry?.question || !entry?.answerChoices) return;

    setIsGenerating(true);
    setAiResponse(null);

    try {
      const { object } = await generateAIResponse(
        entry.question,
        entry.answerChoices,
        entry.image
      );

      let currentResponse = {
        answerMultipleChoice: "",
        answerLong: "",
      };

      for await (const chunk of readStreamableValue(object)) {
        if (chunk.answerMultipleChoice) {
          currentResponse.answerMultipleChoice = chunk.answerMultipleChoice;
        }
        if (chunk.answerLong) {
          currentResponse.answerLong = chunk.answerLong;
        }
        setAiResponse({ ...currentResponse });
      }

      // After the AI response is fully generated, update the submission
      if (submission?.submission_id) {
        await updateSubmission({
          submissionId: submission.submission_id,
          aiAnswerMc: currentResponse.answerMultipleChoice,
          aiAnswerLong: currentResponse.answerLong,
          status: "completed",
        });
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAiResponse({
        answerMultipleChoice: "Error",
        answerLong: "Error generating review. Please try again.",
      });

      // Update submission with error status if something goes wrong
      if (submission?.submission_id) {
        await updateSubmission({
          submissionId: submission.submission_id,
          aiAnswerMc: "Error",
          aiAnswerLong: "Error generating review. Please try again.",
          status: "failed",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">AI Review</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry?.image && (
            <div className="space-y-2">
              <Label>Diagram</Label>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <img
                  src={entry.image}
                  alt="Question diagram"
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              value={entry?.question}
              className="resize-none"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label>Answer Choices</Label>
            <div className="grid gap-4">
              {["A", "B", "C", "D"].map((label, index) => {
                const isCorrectAnswer =
                  aiResponse &&
                  !isGenerating &&
                  entry?.answerMultipleChoice === label;
                const isAIWrongAnswer =
                  aiResponse &&
                  !isGenerating &&
                  aiResponse.answerMultipleChoice === label &&
                  label !== entry?.answerMultipleChoice;

                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-medium">{label}.</span>
                    <div className="flex-1">
                      <Input
                        value={entry?.answerChoices?.[index] || ""}
                        readOnly
                        className={`w-full transition-colors ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50"
                            : isAIWrongAnswer
                            ? "border-red-500 bg-red-50"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGenerateReview}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating Review..." : "Generate AI Review"}
            </Button>
          </div>

          {aiResponse && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>AI Multiple Choice Answer</Label>
                <Input
                  value={aiResponse.answerMultipleChoice}
                  readOnly
                  className={`w-full font-medium transition-colors ${
                    aiResponse &&
                    !isGenerating &&
                    entry?.answerMultipleChoice ===
                      aiResponse.answerMultipleChoice
                      ? "border-green-500 bg-green-50"
                      : aiResponse &&
                        !isGenerating &&
                        entry?.answerMultipleChoice !==
                          aiResponse.answerMultipleChoice
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label>AI Long Answer</Label>
                <Textarea
                  value={aiResponse.answerLong}
                  className="min-h-[200px] resize-none"
                  readOnly
                />
              </div>

              {!isGenerating && (
                <div className="mt-6 space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">Conclusion</h3>
                  {!isGenerating &&
                  aiResponse.answerMultipleChoice ===
                    entry?.answerMultipleChoice ? (
                    <div className="space-y-4">
                      <p className="text-red-600">
                        Unfortunately, this is not a valid entry. Please go back
                        and revise until the AI gets the wrong answer.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-green-600">
                        Great! The AI got the wrong answer. You can proceed to
                        the next step.
                      </p>
                      <Button
                        onClick={() => {
                          onComplete();
                        }}
                        className="w-full"
                      >
                        Proceed to Next Step
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
