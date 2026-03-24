import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Role = "leader" | "collaborator";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "leader") {
      navigate("/leader/welcome");
    } else {
      navigate("/collaborator/welcome");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Dark Hero */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0a0f1e] p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--signal-positive))] via-[hsl(152,76%,40%,0.4)] to-transparent" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[hsl(var(--signal-positive)/0.05)] rounded-full blur-3xl" />

        <div>
          <span className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
            Talent Performance Lab
          </span>
        </div>

        <div className="space-y-6 relative z-10">
          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Donde la estrategia
            <br />
            y la cultura
            <br />
            <span className="text-[hsl(var(--signal-positive))]">se encuentran.</span>
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-white/50 max-w-md leading-relaxed">
              Entiende qué está pasando en tu equipo.
            </p>
            <p className="text-lg text-white/50 max-w-md leading-relaxed">
              Y cómo llevarlo a su máximo potencial.
            </p>
          </div>
        </div>

        <div />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          {/* Mobile branding */}
          <div className="lg:hidden text-center space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Talent Performance Lab
            </span>
            <h2 className="text-2xl font-bold text-foreground">
              Donde la estrategia y la cultura se encuentran.
            </h2>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Bienvenido</h2>
            <p className="text-muted-foreground mt-1 text-sm">Inicia sesión para continuar</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("leader")}
              className={cn(
                "flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200",
                selectedRole === "leader"
                  ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)]"
                  : "border-border hover:border-[hsl(var(--signal-positive)/0.4)]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                selectedRole === "leader" ? "bg-[hsl(var(--signal-positive)/0.1)]" : "bg-muted"
              )}>
                <Users className={cn(
                  "w-5 h-5",
                  selectedRole === "leader" ? "text-[hsl(var(--signal-positive))]" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className={cn(
                  "font-semibold text-sm",
                  selectedRole === "leader" ? "text-[hsl(var(--signal-positive))]" : "text-foreground"
                )}>Líder</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Gestiona equipos y objetivos</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("collaborator")}
              className={cn(
                "flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all duration-200",
                selectedRole === "collaborator"
                  ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)]"
                  : "border-border hover:border-[hsl(var(--signal-positive)/0.4)]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                selectedRole === "collaborator" ? "bg-[hsl(var(--signal-positive)/0.1)]" : "bg-muted"
              )}>
                <UserCircle className={cn(
                  "w-5 h-5",
                  selectedRole === "collaborator" ? "text-[hsl(var(--signal-positive))]" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className={cn(
                  "font-semibold text-sm",
                  selectedRole === "collaborator" ? "text-[hsl(var(--signal-positive))]" : "text-foreground"
                )}>Colaborador</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Responde el diagnóstico</p>
              </div>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium">Contraseña</Label>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white font-semibold"
              disabled={!selectedRole}
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button className="text-foreground hover:underline font-medium">
              Solicitar acceso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
