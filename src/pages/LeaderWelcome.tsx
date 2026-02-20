import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LeaderWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-xl mx-auto px-6 animate-fade-in space-y-6">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Talent Performance Lab
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Bienvenido a TP Lab
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Entiende cómo funciona tu equipo, aprende dónde intervenir
          y convierte el talento en tu mayor ventaja competitiva.
        </p>
        <button
          onClick={() => navigate("/leader/survey")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold text-lg
            bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)]
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Comenzar diagnóstico
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LeaderWelcome;
