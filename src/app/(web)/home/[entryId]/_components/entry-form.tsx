"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";
import { useEntryForm } from "@/lib/form/use-entry-form";
import { useFormAutoSave } from "@/lib/hooks/use-form-auto-save";
import { Clock, Plus } from "lucide-react";
import { z } from "zod";
import { FileUploadDirectUploadDemo } from "../../_components/file-upload";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";

export function EntryForm(entry: z.infer<typeof EntryFormSchema>) {
  const form = useEntryForm(entry);
  const { isSaving, lastSaved } = useFormAutoSave({ entry });
  const answerChoices = form.watch("answerChoices") || [];
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Watch the image field
  const image = form.watch("image");
  useEffect(() => {
    console.log("Image field updated:", image);
  }, [image]);

  const handleSubmitToAI = async () => {
    setIsLoading(true);
    try {
      const question = form.getValues("question");
      const diagram = form.getValues("image");

      const { text } = await generateText({
        model: google("gemini-pro"),
        prompt: `Given the following question and diagram, provide a detailed explanation and solution:
        
Question: ${question}
${diagram ? `Diagram: ${diagram}` : ""}`,
      });

      setAiResponse(text);
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-none">Entry Details</h1>
            <span className="text-sm text-gray-600 leading-none">
              (ID: {entry.entry_id})
            </span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Last saved at {lastSaved.toLocaleTimeString()}
                {isSaving && " (Saving...)"}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Controller
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geometry">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          Geometry
                        </div>
                      </SelectItem>
                      <SelectItem value="math">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          Math
                        </div>
                      </SelectItem>
                      <SelectItem value="biology">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Biology
                        </div>
                      </SelectItem>
                      <SelectItem value="physics">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          Physics
                        </div>
                      </SelectItem>
                      <SelectItem value="chemistry">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          Chemistry
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your question"
                {...form.register("question")}
              />
            </div>

            <div className="space-y-2">
              <Label>Diagram</Label>
              <FileUploadDirectUploadDemo
                onImageUpload={(url) => {
                  form.setValue("image", url);
                }}
              />
            </div>

            <div className="space-y-4">
              <Label>Answer Choices</Label>
              <div className="grid gap-4">
                {["A", "B", "C", "D"].map((label, index) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-medium">{label}.</span>
                    <div className="flex-1">
                      <Textarea
                        {...form.register(`answerChoices.${index}`)}
                        defaultValue={entry.answerChoices?.[index] || ""}
                        className="min-h-[40px] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Correct Answer</Label>
              <div className="flex items-center gap-3 w-full">
                <span className="font-medium">Answer:</span>
                <div className="flex-1">
                  <Controller
                    name="answerMultipleChoice"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={
                          !answerChoices.every((choice) => choice?.trim())
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {["A", "B", "C", "D"].map((label, index) => (
                            <SelectItem key={label} value={label}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{label}.</span>
                                <span>{answerChoices[index] || "(Empty)"}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                const values = form.getValues();
                console.log("Form Values:", {
                  subject: values.subject,
                  question: values.question,
                  answerChoices: values.answerChoices,
                  answerMultipleChoice: values.answerMultipleChoice,
                  image: values.image,
                });
              }}
            >
              Debug Form Values
            </Button>

            <Button
              type="button"
              className="w-full"
              onClick={handleSubmitToAI}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit to AI
                </>
              )}
            </Button>

            {aiResponse && (
              <div className="space-y-4">
                <Label>AI Response</Label>
                <div className="rounded-lg border bg-card p-4">
                  <div className="prose prose-sm max-w-none">{aiResponse}</div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
