"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { createEntry } from "@/lib/actions/create-entry";

interface QAPair {
  id: string;
  question: string;
  answer: string;
  category?: string;
  timestamp: string;
}

export default function QADataCollector() {
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      toast("Error", {
        description: "Both question and answer are required.",
      });
      return;
    }

    const newQAPair: QAPair = {
      id: Date.now().toString(),
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    setQAPairs((prev) => [newQAPair, ...prev]);
    setQuestion("");
    setAnswer("");
    setCategory("");

    toast("Success", { description: "Q&A pair added successfully!" });
  };

  const handleDelete = (id: string) => {
    setQAPairs((prev) => prev.filter((pair) => pair.id !== id));
    toast("Deted", {
      description: "Q&A pair removed.",
    });
  };

  const categories = Array.from(
    new Set(
      qaPairs.filter((pair) => pair.category).map((pair) => pair.category)
    )
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Q&A Data Collector</h1>
        <p className="text-muted-foreground">
          Collect question-answer pairs for reinforcement learning and
          supervised fine-tuning
        </p>
      </div>

      <Tabs defaultValue="collect" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collect">Collect Data</TabsTrigger>
          <TabsTrigger value="manage">
            Manage Data ({qaPairs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collect">
          <Button
            loading={false}
            onClick={() => {
              createEntry();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Blank Q&A Pair
          </Button>
        </TabsContent>

        <TabsContent value="manage">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Collected Data</h2>
                <p className="text-muted-foreground">
                  {qaPairs.length} Q&A pairs collected
                </p>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Categories:</span>
                {categories.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            {qaPairs.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <p>No Q&A pairs collected yet.</p>
                    <p className="text-sm mt-1">
                      Switch to the "Collect Data" tab to get started.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {qaPairs.map((pair) => (
                  <Card key={pair.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {pair.category && (
                              <Badge variant="outline">{pair.category}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(pair.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pair.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-blue-600">
                              Question:
                            </Label>
                            <p className="mt-1 text-sm bg-blue-50 p-3 rounded-md border">
                              {pair.question}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-green-600">
                              Answer:
                            </Label>
                            <p className="mt-1 text-sm bg-green-50 p-3 rounded-md border">
                              {pair.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
