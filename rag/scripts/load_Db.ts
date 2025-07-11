import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import OpenAI from "openai";
import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenAI } from "@google/genai";

//gpt-4o-mini

type SimilarityMetric = "cosine" | "dot_product" | "euclidean";

const { ASTRA_DB_NAMESPACE,
     ASTRA_DB_COLLECTION, 
     ASTRA_DB_API_ENDPOINT,
      ASTRA_DB_APPLICATION_TOKEN,
       OPENAI_API_KEY ,
         GEMINI_API_KEY
    } = process.env;

//const openai = new OpenAI({
  //apiKey: OPENAI_API_KEY,
//});

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


const f1Data =[
'https://en.wikipedia.org/wiki/Formula_One',
 "https://www.statsf1.com",
  "https://racefans.net",
  "https://www.crash.net/f1",
  "https://gpfans.com/en/f1-news/",
  "https://f1technical.net",
  "https://old.reddit.com/r/formula1/",
  "https://www.formula1-dictionary.net",
  "http://en.espn.co.uk/f1/"
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT,{
    namespace: ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") =>{
    const res  = await db.createCollection(ASTRA_DB_COLLECTION,{
        vector: {
            dimension: 768,
            metric: similarityMetric
        }
    });
    console.log(res);
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    for await (const url of f1Data) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        for await (const chunk of chunks) {

            const embedding = await ai.models.embedContent({
                model: "text-embedding-004",
                contents: {
            parts: [{ text: chunk }],
            role: "user"
          },
            })
            const vector = embedding.embeddings.values;

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })
            console.log(res);
        }
    }
        
}

const scrapePage = async(url:string)=>{
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,
        },
        gotoOptions: {
            waitUntil: "domcontentloaded",
        },
        evaluate: async (page,browser) => {
            const result = await page.evaluate(() => 
                document.body.innerHTML
            );
            await browser.close();
            return result;
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>/gm, '');
}

createCollection().then(() => loadSampleData())