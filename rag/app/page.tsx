// Home.tsx
"use client";

import { useState } from "react";
import Bubble from "./components/Bubble";
import Lb from "./components/Loading";
import PSr from "./components/PromptSuggestionRows";
import VroomTitle from "./components/VroomIntro";

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!input.trim()) return;

  setMessages((prev) => [...prev, { role: "user", message: input }]);
  setInput(""); // ✅ clear immediately for UX
  setLoading(true);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: input }),
  });

  const data = await res.json();
  setMessages((prev) => [...prev, { role: "system", message: data.answer }]);
  setLoading(false);
};

  return (
    <main>
          <VroomTitle />

      <section className="chat-section">
        {messages.length ? (
          messages.map((m, i) => <Bubble key={i} message={m.message} role={m.role} />)
        ) : (
          <>
            <p className="starter">
              Vroom knows Red Bull wins, Ferrari fumbles, and McLaren clocks in once a month. New to F1? Cute. Ask anything—we’ll pretend you always knew what an undercut was (we won’t).
            </p>
            <br />
            <PSr setInput={setInput} />
          </>
        )}
        {loading && <Lb />}
      </section>

      <form onSubmit={handleSubmit}>
        <input
          className="qsbox"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me smth......"
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;