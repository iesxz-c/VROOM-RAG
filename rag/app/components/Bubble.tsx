// components/Bubble.tsx
interface BubbleProps {
  role: "user" | "system";
  message: string;
}

const Bubble = ({ role, message }: BubbleProps) => {
  return (
    <div className={`bubble ${role}`}>
      {message}
    </div>
  );
};

export default Bubble;