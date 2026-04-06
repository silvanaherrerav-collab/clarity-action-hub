import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CollaboratorWelcome = () => {
  const navigate = useNavigate();

  // Get first name from registration data
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
    <div className="min-h-screen bg-[#f4f5f6] flex flex-col items-center justify-center px-6 text-center">
      <div className="animate-fade-in space-y-6 max-w-lg">
        <span className="text-[11px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
          Talent Performance Lab
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight mt-12">
          Hola{" "}
          <span className="text-[hsl(var(--signal-positive))]">{firstName}.</span>
        </h1>

        <p className="text-2xl md:text-3xl font-medium text-[hsl(var(--signal-positive)/0.7)] leading-snug">
          Eres una pieza clave del equipo
        </p>

        <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed mt-4">
          Estamos aquí para construir contigo{" "}
          <span className="font-semibold text-foreground">una mejor forma de trabajar</span>{" "}
          y contribuir al logro de mejores resultados.
        </p>

        <button
          onClick={() => navigate("/collaborator/survey")}
          className="mt-6 inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-base
            bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(190,50%,45%)]
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          Comenzar diagnóstico
        </button>
      </div>
    </div>
  );
};

export default CollaboratorWelcome;
