import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DiagnosticFinalProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/leader/diagnostic-result");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            Generando diagnóstico integrado
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estamos integrando la información del proceso, la autoevaluación del líder y la perspectiva del equipo.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Esto puede tardar unos segundos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticFinalProcessing;
