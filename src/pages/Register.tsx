import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

type Role = "leader" | "collaborator" | null;

interface FormData {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: string;
  city: string;
}

const TOTAL_STEPS = 4;

const Register = () => {
  const navigate = useNavigateWithTransition();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<FormData>({
    role: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
    city: "",
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return form.role !== null;
      case 2: return form.firstName.trim().length > 0 && form.lastName.trim().length > 0 && form.email.trim().length > 0;
      case 3: return form.password.length >= 6 && form.password === form.confirmPassword;
      case 4: return form.birthDate.trim().length > 0 && form.gender.trim().length > 0 && form.city.trim().length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      localStorage.setItem("tp_register_data", JSON.stringify(form));
      if (form.role) {
        localStorage.setItem("tp_user_role", form.role);
      }
      navigate("/account-confirmation");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < step;
        const isActive = stepNum === step;
        return (
          <div key={stepNum} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                isCompleted
                  ? "bg-[hsl(var(--signal-positive))] text-white"
                  : isActive
                  ? "bg-[hsl(var(--signal-positive))] text-white ring-4 ring-[hsl(var(--signal-positive)/0.15)]"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < TOTAL_STEPS && (
              <div
                className={cn(
                  "w-12 sm:w-16 h-[2px] transition-colors duration-300",
                  stepNum < step ? "bg-[hsl(var(--signal-positive))]" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const inputClass =
    "flex h-11 w-full rounded-xl border border-border/80 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.4)] focus:border-[hsl(var(--signal-positive))] transition-all";

  return (
    <PageTransition>
    <div id="page-transition-root" className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] animate-fade-in">
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-8">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>

          <ProgressBar />

          <div className="min-h-[260px]">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">¿Cuál es tu rol?</h2>
                  <p className="text-sm text-muted-foreground">Selecciona cómo participarás</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => update("role", "leader")}
                    className={cn(
                      "relative flex flex-col items-start gap-1.5 p-5 rounded-xl border-2 transition-all duration-200 text-left",
                      form.role === "leader"
                        ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)]"
                        : "border-border/80 hover:border-[hsl(var(--signal-positive)/0.4)]"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        form.role === "leader"
                          ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive))]"
                          : "border-border"
                      )}
                    >
                      {form.role === "leader" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p className="font-semibold text-sm text-foreground">Líder</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Diseña y gestiona la estrategia organizacional
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => update("role", "collaborator")}
                    className={cn(
                      "relative flex flex-col items-start gap-1.5 p-5 rounded-xl border-2 transition-all duration-200 text-left",
                      form.role === "collaborator"
                        ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)]"
                        : "border-border/80 hover:border-[hsl(var(--signal-positive)/0.4)]"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        form.role === "collaborator"
                          ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive))]"
                          : "border-border"
                      )}
                    >
                      {form.role === "collaborator" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p className="font-semibold text-sm text-foreground">Colaborador</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Participa en diagnósticos y comparte tu perspectiva
                    </p>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Información básica</h2>
                  <p className="text-sm text-muted-foreground">¿Cómo te llamamos?</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Nombre</label>
                    <input
                      type="text"
                      placeholder="María"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Apellidos</label>
                    <input
                      type="text"
                      placeholder="González Herrera"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Correo electrónico</label>
                    <input
                      type="email"
                      placeholder="tu@empresa.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Seguridad</h2>
                  <p className="text-sm text-muted-foreground">Crea tu contraseña</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Confirmar contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={form.confirmPassword}
                        onChange={(e) => update("confirmPassword", e.target.value)}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Información adicional</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Fecha de nacimiento</label>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => update("birthDate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Género</label>
                    <div className="flex gap-2">
                      {["Masculino", "Femenino", "Prefiero no decir"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => update("gender", g)}
                          className={cn(
                            "flex-1 py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all duration-200",
                            form.gender === g
                              ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.04)] text-foreground"
                              : "border-border/80 text-muted-foreground hover:border-[hsl(var(--signal-positive)/0.4)]"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Ciudad</label>
                    <input
                      type="text"
                      placeholder="Bogotá"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                canAdvance()
                  ? "bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(170,55%,42%)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {step === TOTAL_STEPS ? "Crear mi cuenta" : "Continuar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-[hsl(var(--signal-positive))] hover:underline font-semibold"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
    </PageTransition>
  );
};

export default Register;
