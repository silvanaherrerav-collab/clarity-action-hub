import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const CollaboratorThanks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-xl mx-auto px-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[hsl(var(--signal-positive))]" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          ¡Gracias! Tu respuesta fue enviada.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Cuando el diagnóstico esté listo, tu líder podrá ver los resultados.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg
            bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Volver al inicio
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CollaboratorThanks;
