// PrompSuggestionButton.tsx
interface PSbuttonProps {
  text: string;
  onClick: () => void;
}

const PSbutton = ({ text, onClick }: PSbuttonProps) => {
  return (
    <button className="prompt-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default PSbutton;
