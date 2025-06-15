"use server";

import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

export async function generateAIResponse(
  question: string,
  answerChoices: string[],
  diagram?: string
) {
  const stream = createStreamableValue();
  console.log("Starting AI response generation...");
  console.log("question", question);
  console.log("answerChoices", answerChoices);
  console.log("diagram", diagram);

  (async () => {
    try {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error("Google AI API key is not configured");
      }

      console.log("Initializing stream object...");
      const { partialObjectStream } = await streamObject({
        model: google("gemini-2.5-pro-preview-05-06"),
        system: `You are a helpful AI tutor that provides detailed explanations and solutions to multiple choice questions.
Your task is to:
1. Analyze the question and all answer choices
2. Determine the correct answer based on your knowledge
3. Provide a detailed explanation of your reasoning
4. Include the correct answer letter (A, B, C, or D) in your explanation`,
        messages: [
          {
            role: "user",
            content: diagram
              ? [
                  {
                    type: "text",
                    text: `Given the following multiple choice question and options, determine the correct answer and provide a detailed explanation:

Question: ${question}

Answer Choices:
${answerChoices
  .map((choice, index) => `${String.fromCharCode(65 + index)}. ${choice}`)
  .join("\n")}`,
                  },
                  {
                    type: "image",
                    image: new URL(diagram),
                  },
                ]
              : `Given the following multiple choice question and options, determine the correct answer and provide a detailed explanation:

Question: ${question}

Answer Choices:
${answerChoices
  .map((choice, index) => `${String.fromCharCode(65 + index)}. ${choice}`)
  .join("\n")}`,
          },
        ],
        schema: z.object({
          answerMultipleChoice: z
            .string()
            .describe("The letter (A, B, C, or D) of the correct answer"),
          answerLong: z
            .string()
            .describe("Detailed explanation including the correct answer and reasoning"),
        }),
      });

      console.log("Stream initialized, starting to process chunks...");
      for await (const partialObject of partialObjectStream) {
        console.log("Received chunk:", JSON.stringify(partialObject, null, 2));
        stream.update(partialObject);
      }

      console.log("Stream completed, calling done()");
      stream.done();
    } catch (error) {
      console.error("Error in stream processing:", error);
      stream.error(error);
    }
  })();

  return { object: stream.value };
}
