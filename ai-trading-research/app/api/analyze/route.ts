import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import type { Experiment } from "@/app/types/experiment";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const experimentSchema = {
    type: "object",
    properties: {
        question: {
            type: "string",
            description: "The original research question from the user.",
        },
        instrument: {
            type: ["string", "null"],
            description: "Market instrument mentioned by the user.",
        },
        timeframe: {
            type: ["string", "null"],
            description: "Timeframe mentioned by the user, such as daily or hourly.",
        },
        entryCondition: {
            type: ["string", "null"],
            description: "The condition for entering the trade.",
        },
        exitCondition: {
            type: ["string", "null"],
            description: "The condition for exiting the trade.",
        },
        holdingPeriod: {
            type: ["string", "null"],
            description: "How long the position should be held.",
        },
        filters: {
            type: "array",
            items: {
                type: "string",
            },
            description: "Variables, filters, or additional conditions mentioned.",
        },
        objective: {
            type: ["string", "null"],
            description: "What the user is trying to find out.",
        },
        missingInformation: {
            type: "array",
            items: {
                type: "string",
            },
            description:
                "Important information missing from the question that should be clarified before testing.",
        },
    },
    required: [
        "question",
        "instrument",
        "timeframe",
        "entryCondition",
        "exitCondition",
        "holdingPeriod",
        "filters",
        "objective",
        "missingInformation",
    ],
};

const systemPrompt = `
You are an AI trading research assistant.

Your job is to convert a user's natural-language trading research question
into a structured experiment.

IMPORTANT RULES:

1. Extract only information that is explicitly stated or strongly implied.
2. Never invent important trading parameters.
3. If an important parameter is missing, return null for that field.
4. Add the missing parameter to missingInformation.
5. Do not provide financial advice.
6. Do not claim that a strategy works or does not work.
7. Your task is only to structure the research question.
8. Return valid JSON matching the provided schema.

Important fields include:
- instrument
- timeframe
- entry condition
- exit condition
- holding period
- filters
- objective
- missing information
`;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const question = body.question;

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Question is required." },
                { status: 400 }
            );
        }

        const models = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash"];
        let response;
        let lastError: unknown;

        for (const model of models) {
            try {
                response = await ai.models.generateContent({
                    model,
                    contents: `${systemPrompt}

User question:
${question}`,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: experimentSchema,
                    },
                });

                if (response.text) break;
            } catch (err) {
                lastError = err;
                console.warn(`Model ${model} unavailable, trying fallback...`);
            }
        }

        if (!response?.text) {
            throw lastError || new Error("AI returned an empty response.");
        }

        const experiment: Experiment = JSON.parse(response.text);

        return NextResponse.json({
            success: true,
            experiment,
        });
    } catch (error) {
        console.error("Analyze API error:", error);

        return NextResponse.json(
            { error: "Failed to analyze the question." },
            { status: 500 }
        );
    }
}