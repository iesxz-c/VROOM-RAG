# 🏎️ Vroom Bot

An AI chatbot that answers Formula 1 questions using RAG (Retrieval-Augmented Generation).

## 🛠️ How to Run

1. Clone the repo:
```bash
git clone https://github.com/iesxz-c/VROOM-RAG.git
cd VROOM-RAG
cd rag
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key
ASTRA_DB_API_ENDPOINT=your_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_token
ASTRA_DB_NAMESPACE=your_namespace
ASTRA_DB_COLLECTION=your_collection
```

4. Seed the database:

```bash
npm run seed
```

(This runs the `scripts/load_DB.ts` script to populate Astra DB.)

5. Start the dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

Powered by:

* React + Next.js
* Google Gemini (for generation)
* Astra DB (for retrieval)

MIT License.

