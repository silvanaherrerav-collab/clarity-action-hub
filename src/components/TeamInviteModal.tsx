import { useState } from "react";
import { X, Mail, Plus } from "lucide-react";

interface TeamMember {
  nombre: string;
  cargo: string;
  correo: string;
}

interface TeamInviteModalProps {
  open: boolean;
  onClose: () => void;
}

const TeamInviteModal = ({ open, onClose }: TeamInviteModalProps) => {
  const [members, setMembers] = useState<TeamMember[]>([
    { nombre: "", cargo: "", correo: "" },
  ]);

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { nombre: "", cargo: "", correo: "" }]);
  };

  const handleSubmit = () => {
    const valid = members.filter((m) => m.nombre.trim() && m.correo.trim());
    if (valid.length === 0) return;
    localStorage.setItem("tp_team_members", JSON.stringify(valid));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-[560px] mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-7">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Header */}
          <p className="text-[11px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-2">
            Diagnóstico del equipo
          </p>
          <h2 className="text-xl font-bold text-foreground mb-1">
            ¿Quién ejecuta este proceso?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Invita a las personas clave — recibirán acceso por correo.
          </p>

          {/* Members */}
          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="rounded-xl border border-border p-5 space-y-4">
                {/* Role pill */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.1)] border border-[hsl(var(--signal-positive)/0.25)] rounded-full px-3 py-1">
                    {index === 0 ? "Responsable principal" : `Persona ${index + 1}`}
                  </span>
                  {index === 0 && (
                    <span className="text-xs text-muted-foreground">
                      La persona que más conoce el proceso
                    </span>
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.12em] text-foreground/70 uppercase block mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María González"
                    value={member.nombre}
                    onChange={(e) => updateMember(index, "nombre", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive)/0.5)] transition-colors"
                  />
                </div>

                {/* Cargo + Correo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold tracking-[0.12em] text-foreground/70 uppercase block mb-1.5">
                      Cargo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Gerente comercial"
                      value={member.cargo}
                      onChange={(e) => updateMember(index, "cargo", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive)/0.5)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-[0.12em] text-foreground/70 uppercase block mb-1.5">
                      Correo
                    </label>
                    <input
                      type="email"
                      placeholder="maria@empresa.com"
                      value={member.correo}
                      onChange={(e) => updateMember(index, "correo", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive)/0.5)] transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add person */}
          <button
            onClick={addMember}
            className="w-full mt-4 rounded-xl border-2 border-dashed border-[hsl(var(--signal-positive)/0.35)] py-3 text-sm font-medium text-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.04)] transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Agregar otra persona (opcional)
          </button>

          {/* Info box */}
          <div className="mt-5 rounded-xl border border-[hsl(var(--signal-positive)/0.2)] bg-[hsl(var(--signal-positive)/0.04)] p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--signal-positive)/0.12)] flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-[hsl(var(--signal-positive))]" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Les enviaremos un acceso personalizado para responder el diagnóstico desde su perspectiva. Sus respuestas son confidenciales y se integran de forma agregada.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-7">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, hsl(152,76%,40%) 0%, hsl(180,60%,45%) 50%, hsl(200,80%,55%) 100%)",
              }}
            >
              Enviar acceso al equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInviteModal;
