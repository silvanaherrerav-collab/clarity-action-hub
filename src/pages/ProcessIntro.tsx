import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const ProcessIntro = () => {
  const navigate = useNavigateWithTransition();

  return (
    <PageTransition>
    <div id="page-transition-root" className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto space-y-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase">
          Talent Performance Lab
        </p>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-[3.2rem] font-extrabold text-foreground tracking-tight leading-[1.1]">
            Aquí es donde conectamos
          </h1>
          <h1 className="text-4xl md:text-[3.2rem] font-extrabold tracking-tight leading-[1.1]">
            <span className="text-[hsl(145,60%,45%)]">estrategia</span>
            {" "}
            <span className="text-foreground/80">con</span>
            {" "}
            <span className="text-[hsl(200,50%,55%)]">ejecución</span>
          </h1>
        </div>

        <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Analizaremos cómo funciona realmente el trabajo en
          <br />
          tu equipo para identificar oportunidades de mejora
        </p>

        <button
          onClick={() => navigate("/leader/diagnostic-hub")}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-base
            bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(200,50%,55%)]
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Continuar
        </button>
      </div>
    </div>
    </PageTransition>
  );
};

export default ProcessIntro;
