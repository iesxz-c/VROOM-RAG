import { GoogleGenAI } from "@google/genai";
import { google } from "@ai-sdk/google"
import { DataAPIClient } from "@datastax/astra-db-ts";
import "dotenv/config";
import { generateText } from "ai";

const { ASTRA_DB_NAMESPACE,
     ASTRA_DB_COLLECTION, 
     ASTRA_DB_API_ENDPOINT,
      ASTRA_DB_APPLICATION_TOKEN,
       OPENAI_API_KEY ,
         GEMINI_API_KEY
    } = process.env;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages?.[messages.length - 1]?.content;

    if (!latestMessage) {
      return new Response(JSON.stringify({ error: "No message found" }), { status: 400 });
    }

    // Generate embedding using Gemini
    const response = await ai.models.embedContent({
      model: "models/gemini-embedding-exp-03-07",
      contents: {
        parts: [{ text: latestMessage }],
        role: "user"
      },
    });

    // Extract the embedding values from the first (and typically only) embedding
    const embedding = response.embeddings.values()[0].values;
    let docContext = "";

    // Search for similar vectors in Astra DB
    try {
        const collection = await db.collection(ASTRA_DB_COLLECTION);
        const cursor = collection.find(null, {
            sort: {
                $vector: embedding
            },
            limit: 10
        });
        
        const documents = await cursor.toArray();
        const docsMap = documents?.map((doc) => doc.text);
        docContext = JSON.stringify(docsMap);
        
    } catch (error) {
        console.log("Error fetching collection:", error);
        docContext = "";
    }

    // Generate response using AI SDK with Google
    const result = await generateText({
        model: google("gemini-1.5-flash"),
        messages: [
            {
                role: "system",
                content: `You are an AI assistant who knows everything about Formula One. Use the below context to augment what you know about Formula One racing. The context will provide you with the most recent page data from wikipedia, the official F1 website and others. If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include. Format responses using markdown where applicable and don't return images.
-------------
START CONTEXT
${docContext}
END CONTEXT
-------------`
            },
            {
                role: "user", 
                content: latestMessage
            }
        ]
    });

    return new Response(JSON.stringify({ 
        success: true, 
        message: result.text,
        context: docContext 
    }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("❌ Error in POST request:", error);
    return new Response(JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
    }), { status: 500 });
  }
}