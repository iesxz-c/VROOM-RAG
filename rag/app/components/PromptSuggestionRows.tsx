// PromptSuggestionRows.tsx
import PSbutton from "./PrompSuggestionButton";

interface PSrProps {
  setInput: (value: string) => void;
}

const PSr = ({ setInput }: PSrProps) => {
  const prompts = [
    "What is the history of Formula 1?",
    "Who is the highest-paid F1 driver?",
    "What are the rules of F1?",
    "What is the fastest lap ever recorded in F1?",
    "Who will be the driver of Ferrari?"
  ];

  return (
    <div className="prompt">
      {prompts.map((prompt, index) => (
        <PSbutton key={index} text={prompt} onClick={() => setInput(prompt)} />
      ))}
    </div>
  );
};

export default PSr;
