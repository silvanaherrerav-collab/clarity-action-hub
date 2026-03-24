import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ProcessIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-6 animate-fade-in space-y-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Talent Performance Lab
        </p>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.15]">
            Aquí es donde todo
            <br />
            <span className="text-[hsl(var(--signal-positive))]">se conecta.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            Entender cómo funciona tu proceso es el primer paso para alinear estrategia, equipo y resultados.
          </p>
        </div>

        <button
          onClick={() => navigate("/leader/process-intake")}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-base
            bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)]
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Continuar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProcessIntro;
