import { useEffect, useState, ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  microText?: string;
}

const PageTransition = ({ children, microText }: PageTransitionProps) => {
  const [phase, setPhase] = useState<"micro" | "content">(microText ? "micro" : "content");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay then fade in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "micro" && microText) {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setPhase("content");
          setTimeout(() => setVisible(true), 50);
        }, 300);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [phase, microText]);

  if (phase === "micro" && microText) {
    return (
      <div
        className="min-h-screen bg-[#f5f5f0] flex items-center justify-center transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)" }}
      >
        <p className="text-sm text-muted-foreground/70">{microText}</p>
      </div>
    );
  }

  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
