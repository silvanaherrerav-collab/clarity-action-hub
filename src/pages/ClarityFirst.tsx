import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClarityFirst = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 py-12 animate-fade-in space-y-8">

        {/* Branding */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
            Antes de intervenir la cultura, construyamos claridad.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Muchos problemas del día a día nacen de objetivos difusos, roles poco claros o prioridades cambiantes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Vamos a estructurar el trabajo para que el equipo ejecute mejor.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/leader/process-intake")}
          className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
        >
          Definir claridad del trabajo
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ClarityFirst;
