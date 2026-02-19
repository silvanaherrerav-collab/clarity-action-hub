import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

const CollaboratorWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Bienvenido a TP Lab
        </h1>

        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--signal-positive)/0.08)] text-[hsl(var(--signal-positive))]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-medium">Tu respuesta es completamente anónima</span>
        </div>

        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          El líder solo verá resultados agregados del equipo, nunca respuestas individuales.
        </p>

        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Tu respuesta ayuda a construir el diagnóstico del equipo.
          Responde con honestidad. Este diagnóstico nos permitirá detectar señales clave
          y ayudarte a intervenir donde más impacto puedes generar.
        </p>

        <p className="mt-4 text-sm text-muted-foreground">Tiempo estimado: 6–8 minutos</p>

        <button
          onClick={() => navigate("/collaborator/survey")}
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold text-lg
            bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)]
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Comenzar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CollaboratorWelcome;
