import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CollaboratorWelcome = () => {
  const navigate = useNavigate();

  let firstName = "Colaborador";
  try {
    const data = localStorage.getItem("tp_register_data");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.firstName) {
        firstName = parsed.firstName.trim().split(" ")[0];
      } else if (parsed.fullName) {
        firstName = parsed.fullName.trim().split(" ")[0];
      }
    }
  } catch {}

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <span className="text-[11px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
          Talent Performance Lab
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mt-6">
          <span className="text-foreground">Hola </span>
          <span className="text-primary">{firstName}.</span>
        </h1>

        <p className="text-2xl md:text-3xl font-medium text-[hsl(var(--signal-positive)/0.85)] leading-snug">
          Eres una pieza clave del equipo
        </p>

        <p className="text-base text-muted-foreground leading-relaxed max-w-[650px]">
          Estamos aquí para construir contigo{" "}
          <span className="font-semibold text-foreground">una mejor forma de trabajar</span>{" "}
          y contribuir al logro de mejores resultados.
        </p>

        <button
          onClick={() => navigate("/collaborator/survey")}
          className="mt-4 inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-base
            bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(var(--primary))]
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          Comenzar diagnóstico
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CollaboratorWelcome;
