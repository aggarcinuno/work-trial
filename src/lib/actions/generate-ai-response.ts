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

  (async () => {
    try {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error("Google AI API key is not configured");
      }

      console.log("Initializing stream object...");
      const { partialObjectStream } = await streamObject({
        model: google("gemini-1.5-flash-latest"),
        system: `You are a helpful AI tutor that provides detailed explanations and solutions to multiple choice questions.
Your task is to:
1. Analyze the question and all answer choices
2. Determine the correct answer based on your knowledge
3. Explain why your chosen answer is correct
4. Explain why other options are incorrect
5. Provide a detailed solution process`,
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
          aiAnswerMultipleChoice: z
            .string()
            .describe("The letter (A, B, C, or D) of the correct answer"),
          explanation: z
            .string()
            .describe(
              "Detailed explanation of why the chosen answer is correct and why others are wrong"
            ),
          solution: z
            .string()
            .describe(
              "Step-by-step solution process to arrive at the correct answer"
            ),
          keyPoints: z
            .array(z.string())
            .describe("Key concepts and points to remember from this question"),
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
