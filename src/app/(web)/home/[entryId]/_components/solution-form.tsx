"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveEntry } from "@/lib/actions/save-entry";
import { toast } from "sonner";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";

const SolutionFormSchema = z.object({
  answerLong: z.string().min(1, "Solution is required"),
});

type SolutionFormValues = z.infer<typeof SolutionFormSchema>;

interface SolutionFormProps {
  onSubmit: (data: SolutionFormValues) => void;
  initialData?: Partial<SolutionFormValues>;
  entryId: string;
  entry: z.infer<typeof EntryFormSchema>;
}

export function SolutionForm({
  onSubmit,
  initialData,
  entryId,
  entry,
}: SolutionFormProps) {
  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(SolutionFormSchema),
    defaultValues: {
      answerLong: initialData?.answerLong || "",
    },
  });

  const handleSubmit = async (data: SolutionFormValues) => {
    try {
      await saveEntry(entryId, {
        ...entry,
        answerLong: data.answerLong,
        status: "submitted",
      });

      onSubmit(data);
      toast.success("Solution saved successfully");
    } catch (error) {
      console.error("Error saving solution:", error);
      toast.error("Failed to save solution. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Step by Step Solution</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="answerLong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your step by step solution..."
                      className="min-h-[200px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit Solution
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
