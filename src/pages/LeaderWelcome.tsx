import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const LeaderWelcome = () => {
  const navigate = useNavigateWithTransition();

  return (
    <PageTransition>
    <div id="page-transition-root" className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto space-y-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase">
          Talent Performance Lab
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">
            Tu equipo es tu mayor ventaja competitiva
          </p>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-foreground tracking-tight leading-[1.1]">
            Mejora cómo trabaja
          </h1>
          <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-[hsl(200,60%,50%)] tracking-tight leading-[1.1]">
            tu equipo.
          </h1>
          <h2 className="text-3xl md:text-[2.8rem] font-light text-foreground/80 tracking-tight leading-[1.1]">
            Actúa con claridad
          </h2>
        </div>

        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Conecta tu estrategia y cultura en tiempo real.
        </p>

        <button
          onClick={() => navigate("/leader/context")}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-base
            bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(200,50%,55%)]
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Comenzar diagnóstico
        </button>
      </div>
    </div>
    </PageTransition>
  );
};

export default LeaderWelcome;
