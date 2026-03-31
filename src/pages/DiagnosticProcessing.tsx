import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DiagnosticProcessing = () => {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setOpacity(0), 2000);
    const navTimer = setTimeout(() => navigate("/leader/plan-review"), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-[#f5f5f0] flex items-center justify-center transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="max-w-lg w-full mx-auto px-6 text-center space-y-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Generando plan
        </p>

        {/* Dots loader */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "0ms" }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "300ms" }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "600ms" }} />
        </div>

        <h1 className="text-3xl font-bold text-foreground tracking-tight leading-snug">
          Estamos creando tu plan de trabajo
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          Estamos analizando cómo funciona tu proceso para proponerte acciones concretas.
        </p>
      </div>
    </div>
  );
};

export default DiagnosticProcessing;
