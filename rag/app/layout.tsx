import "./global.css";

export const metadata = {
  title: "Vroom",
  description: "The ultimate place for f1 newbies and their stupid questions about the sport and its history",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;