import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

type Role = "leader" | "collaborator";

const Login = () => {
  const navigate = useNavigateWithTransition();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("tp_user_role") as Role | null;
    if (savedRole === "leader" || savedRole === "collaborator") {
      setSelectedRole(savedRole);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "leader") {
      navigate("/leader/welcome");
    } else {
      navigate("/collaborator/welcome");
    }
  };

  return (
    <PageTransition>
    <div id="page-transition-root" className="min-h-screen flex">
      {/* Left Panel - Dark Hero */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(145deg, #0a0f1e 0%, #0d1a2a 40%, #0f2030 70%, #0a1520 100%)",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--signal-positive)/0.6)] to-transparent" />

        <div>
          <span className="text-[11px] font-semibold tracking-[0.25em] text-white/50 uppercase">
            Talent Performance Lab
          </span>
        </div>

        <div className="space-y-6 relative z-10 max-w-lg">
          <h1 className="text-[2.8rem] xl:text-[3.8rem] font-extrabold text-white leading-[1.08] tracking-tight">
            <span className="block whitespace-nowrap">Donde la{" "}<span className="text-[hsl(var(--signal-positive))]">estrategia</span></span>
            <span className="block whitespace-nowrap text-[hsl(170,65%,55%)]">y la cultura</span>
            <span className="block">se encuentran.</span>
          </h1>
          <p className="text-base text-white/40 max-w-sm leading-relaxed">
            Convierte a tu equipo en tu mayor
            <br />
            ventaja competitiva.
          </p>
        </div>

        <div />
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex-1 bg-[#f8f9fa] flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[420px] animate-fade-in">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8 space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
              Talent Performance Lab
            </span>
            <h2 className="text-xl font-bold text-foreground">
              Donde la estrategia y la cultura se encuentran.
            </h2>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Bienvenido</h2>
              <p className="text-muted-foreground mt-1 text-sm">Inicia sesión para continuar</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tu rol</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("leader")}
                  className={cn(
                    "relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedRole === "leader"
                      ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)]"
                      : "border-border/80 hover:border-[hsl(var(--signal-positive)/0.4)] bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedRole === "leader"
                        ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive))]"
                        : "border-border"
                    )}
                  >
                    {selectedRole === "leader" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">Líder</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">Gestión estratégica</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("collaborator")}
                  className={cn(
                    "relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedRole === "collaborator"
                      ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)]"
                      : "border-border/80 hover:border-[hsl(var(--signal-positive)/0.4)] bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedRole === "collaborator"
                        ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive))]"
                        : "border-border"
                    )}
                  >
                    {selectedRole === "collaborator" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">Colaborador</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">Participar y opinar</p>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border/80 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.4)] focus:border-[hsl(var(--signal-positive))] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Contraseña</label>
                  <button type="button" className="text-xs text-[hsl(var(--signal-positive))] hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border/80 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.4)] focus:border-[hsl(var(--signal-positive))] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!selectedRole}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200",
                  selectedRole
                    ? "bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(170,55%,42%)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Acceder a la plataforma
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[hsl(var(--signal-positive))] hover:underline font-semibold"
            >
              Crear cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Login;
