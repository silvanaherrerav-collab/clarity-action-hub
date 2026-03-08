import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const DiagnosticProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/leader/plan-review");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6 py-12 animate-fade-in space-y-8 text-center">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Talent Performance Lab
        </p>

        <Loader2 className="w-12 h-12 text-[hsl(var(--signal-positive))] animate-spin mx-auto" />

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Estamos analizando la información del proceso
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          TP Lab está estructurando el plan de trabajo para mejorar este proceso.
        </p>
      </div>
    </div>
  );
};

export default DiagnosticProcessing;
