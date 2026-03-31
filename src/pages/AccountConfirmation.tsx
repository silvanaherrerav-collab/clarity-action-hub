import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const AccountConfirmation = () => {
  const navigate = useNavigateWithTransition();
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0a0f1e 0%, #0d1a2a 40%, #0f2030 70%, #0a1520 100%)"
      }}
    >
      {/* Subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[hsl(var(--signal-positive)/0.04)] rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-lg space-y-8 animate-fade-in">
        {/* Brand */}
        <div className="inline-block px-6 py-2 border border-white/10 rounded-lg">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-white/50 uppercase">
            Talent Performance Lab
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Tu cuenta está
          </h1>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(190,60%,50%)] bg-clip-text text-transparent">
              casi lista.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base text-white/40 max-w-md mx-auto leading-relaxed">
          Te enviamos la confirmación a tu correo. Revisa tu bandeja de entrada
          y activa tu cuenta para comenzar
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white
            bg-gradient-to-r from-[hsl(var(--signal-positive))] to-[hsl(170,55%,42%)]
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          Ir al inicio de sesión
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Resend */}
        <p className="text-sm text-white/30">
          ¿No recibiste tu correo?{" "}
          <button
            onClick={handleResend}
            className="text-white/60 hover:text-white underline underline-offset-2 transition-colors"
          >
            {resent ? "¡Enviado!" : "Reenviar confirmación"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AccountConfirmation;
