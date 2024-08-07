import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { streamText } from "ai";

export async function GET(request: Request) {


  const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "User is not Authenticated",
        },
        { status: 400 }
      );
    }

    const gPrompt =  "Create a list of three open—ended and engaging questions formatted as a single strftng. Each question should be separated by || These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'WhatLs a hobby youlve recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."   

  try {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = google("models/gemini-1.5-pro-latest", {
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
      ],
      
    });

    const result = await streamText({
      model: model,
      prompt: gPrompt,
      maxTokens: 1024,
      maxRetries:3,
    });

    return result.toDataStreamResponse();
  } catch (error) {

    
    console.log("Failed To Get Respose", error);

    return Response.json(
      {
        success: false,
        message: "Failed To Get Respose",
      },
      { status: 500 }
    );
  }
}

//Shoud Be
// https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai
// https://ai.google.dev/api?lang=node
// https://sdk.vercel.ai/docs/getting-started/nextjs-app-router
