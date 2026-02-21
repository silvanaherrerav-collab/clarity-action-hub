import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const CollaboratorThanks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6 animate-fade-in space-y-5">
        <div className="w-14 h-14 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-[hsl(var(--signal-positive))]" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Gracias. Tu respuesta fue registrada.
        </h1>
        <p className="text-base text-muted-foreground">
          Recuerda: es completamente anónima.
        </p>
        <button
          onClick={() => navigate("/collaborator/week")}
          className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base
            bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white
            transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Ir a mi semana en TP Lab
        </button>
      </div>
    </div>
  );
};

export default CollaboratorThanks;
