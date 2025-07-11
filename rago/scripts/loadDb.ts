import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/text_splitter";
