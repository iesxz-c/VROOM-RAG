import { GoogleGenAI } from "@google/genai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";

// Environment variables
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

// Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Astra DB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

// API route handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userQuery = body.query;

    if (!userQuery) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Step 1: Embed the user query
    const embedRes = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: {
        parts: [{ text: userQuery }],
        role: "user",
      },
    });

    const vector = embedRes.embeddings.values;

    // Step 2: Query Astra DB
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    const results: any[] = [];
const cursor = collection.find({
  sort: "$vector",
  vector,
  limit: 5,
});

for await (const doc of cursor) {
  results.push(doc);
}

    const contextText = results.map((r: any) => r.text).join("\n\n");

    // Step 3: Generate an answer using Gemini
    const chatRes = await ai.models.generateContent({
      model: "gemini-2.0-flash", // 
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI assistant who knows everything about Formula One. 
Use the below context to augment what you know about Formula One racing. 
The context will provide you with the most recent page data from Wikipedia, 
the official F1 website and others. If the context doesn't include the information
you need, answer based on your existing knowledge and don't mention the source of your 
information or what the context does or doesn't include. Format responses using markdown 
where applicable and don't return images. Use the following context to answer the query:
              \n\n${contextText}\n\nQuery: ${userQuery}`,
            },
          ],
        },
      ],
    });

    const answer = chatRes.text;

    return NextResponse.json({
      query: userQuery,
      answer,
      sources: results,
    });
  } catch (err: any) {
    console.error("Error in ask route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
