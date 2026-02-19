import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

const CollaboratorWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6 animate-fade-in space-y-5">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Bienvenido a TP Lab
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--signal-positive)/0.08)] text-[hsl(var(--signal-positive))]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-medium">Tu respuesta es completamente anónima</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Tu líder solo verá resultados agregados del equipo, nunca respuestas individuales.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Responde con honestidad. Tu respuesta nos permitirá detectar señales clave
          y ayudar a intervenir donde más impacto se pueda generar y conseguir resultados de alto impacto.
        </p>

        <p className="text-xs text-muted-foreground">Tiempo estimado: 6–8 minutos</p>

        <button
          onClick={() => navigate("/collaborator/survey")}
          className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold text-base
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
