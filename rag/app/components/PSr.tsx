import { on } from "process"
import PSbutton from "./PSbutton"

const PSr = ({onPromptClick}) => {
  const prompts = [
    "What is the history of Formula 1?",
    "Who is the highest-paid F1 driver?",
    "What are the rules of F1?",
    "What is the fastest lap ever recorded in F1?",
    "Who will be the driver of Ferrari?"
  ]
  return (
    <div className="prompt">
      {prompts.map((prompt, index) => (
        <PSbutton key={`suggest-${index}`} text={prompt}
         onclick={() => onPromptClick(prompt)} />
      ))}
    </div>
  )
}

export default PSr