"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";
import { useEntryForm } from "@/lib/form/use-entry-form";
import { useFormAutoSave } from "@/lib/hooks/use-form-auto-save";
import { Clock } from "lucide-react";
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
import { Controller } from "react-hook-form";

interface EntryFormProps {
  entry_id: string;
  entry: z.infer<typeof EntryFormSchema>;
  onComplete: (data: z.infer<typeof EntryFormSchema>) => void;
}

export function EntryForm({ entry_id, entry, onComplete }: EntryFormProps) {
  const form = useEntryForm(entry);
  const answerChoices = form.watch("answerChoices") || [];
  const image = form.watch("image");

  const handleSubmit = async () => {
    const values = form.getValues();
    onComplete(values);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-none">Entry Details</h1>
            <span className="text-sm text-gray-600 leading-none">
              (ID: {entry_id})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <FormContent
            form={form}
            entry_id={entry_id}
            answerChoices={answerChoices}
            onSubmit={handleSubmit}
          />
        </Form>
      </CardContent>
    </Card>
  );
}

function FormContent({
  form,
  entry_id,
  answerChoices,
  onSubmit,
}: {
  form: any;
  entry_id: string;
  answerChoices: string[];
  onSubmit: () => void;
}) {
  const { isSaving, lastSaved } = useFormAutoSave({ entry_id });

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between mb-4">
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

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Controller
          name="subject"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          initialImage={form.getValues("image")}
          onImageUpload={(url) => {
            form.setValue("image", url, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
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
                  defaultValue={answerChoices[index] || ""}
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("answerMultipleChoice", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  value={field.value ?? ""}
                  disabled={!answerChoices.every((choice) => choice?.trim())}
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
        className="w-full bg-blue-500 hover:bg-blue-200 text-white"
        onClick={onSubmit}
      >
        Continue to AI Review
      </Button>
    </form>
  );
}
