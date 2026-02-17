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
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 p-12 flex-col justify-between">
        <div>
          <span className="text-lg font-semibold text-foreground tracking-tight">
            Talent Performance Lab
          </span>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold text-foreground leading-tight">
            Mira lo que está pasando.<br />
            Decide mejor.<br />
            Lidera con inteligencia.
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Conecta los objetivos del negocio con el trabajo diario y las señales reales de comportamiento. Aprende dónde intervenir primero para mejorar el rendimiento sin quemar a tu equipo.
          </p>
        </div>

        <div />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <span className="text-lg font-semibold text-foreground tracking-tight">
              Talent Performance Lab
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground mt-2">Inicia sesión para continuar</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Soy...</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("leader")}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                  selectedRole === "leader"
                    ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.05)]"
                    : "border-border hover:border-[hsl(var(--signal-positive)/0.5)] hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  selectedRole === "leader" ? "bg-[hsl(var(--signal-positive)/0.1)]" : "bg-muted"
                )}>
                  <Users className={cn(
                    "w-6 h-6",
                    selectedRole === "leader" ? "text-[hsl(var(--signal-positive))]" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className={cn(
                    "font-medium",
                    selectedRole === "leader" ? "text-[hsl(var(--signal-positive))]" : "text-foreground"
                  )}>Líder</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Gestiona equipos y objetivos</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("collaborator")}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                  selectedRole === "collaborator"
                    ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.05)]"
                    : "border-border hover:border-[hsl(var(--signal-positive)/0.5)] hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  selectedRole === "collaborator" ? "bg-[hsl(var(--signal-positive)/0.1)]" : "bg-muted"
                )}>
                  <UserCircle className={cn(
                    "w-6 h-6",
                    selectedRole === "collaborator" ? "text-[hsl(var(--signal-positive))]" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className={cn(
                    "font-medium",
                    selectedRole === "collaborator" ? "text-[hsl(var(--signal-positive))]" : "text-foreground"
                  )}>Colaborador</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Da seguimiento a su trabajo y responde el diagnóstico</p>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white" 
              disabled={!selectedRole}
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button className="text-primary hover:underline font-medium">
              Solicitar acceso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
