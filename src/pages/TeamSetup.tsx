import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus, Trash2, Send, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "tp_team_setup";

interface TeamRole {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  email: string;
  roleId: string;
  invited: boolean;
  invitedAt?: string;
}

interface TeamSetupData {
  teamSize: string;
  roles: TeamRole[];
  members: TeamMember[];
}

const defaultData: TeamSetupData = {
  teamSize: "",
  roles: [{ id: crypto.randomUUID(), name: "" }],
  members: [{ id: crypto.randomUUID(), email: "", roleId: "", invited: false }],
};

const TeamSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TeamSetupData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  const save = (updated: TeamSetupData) => {
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Step 0: Team size
  // Step 1: Define roles
  // Step 2: Assign emails & invite

  const addRole = () => {
    save({ ...data, roles: [...data.roles, { id: crypto.randomUUID(), name: "" }] });
  };

  const updateRole = (id: string, name: string) => {
    save({ ...data, roles: data.roles.map((r) => (r.id === id ? { ...r, name } : r)) });
  };

  const removeRole = (id: string) => {
    if (data.roles.length > 1) {
      save({
        ...data,
        roles: data.roles.filter((r) => r.id !== id),
        members: data.members.map((m) => (m.roleId === id ? { ...m, roleId: "" } : m)),
      });
    }
  };

  const addMember = () => {
    save({
      ...data,
      members: [...data.members, { id: crypto.randomUUID(), email: "", roleId: "", invited: false }],
    });
  };

  const updateMember = (id: string, field: "email" | "roleId", value: string) => {
    save({ ...data, members: data.members.map((m) => (m.id === id ? { ...m, [field]: value } : m)) });
  };

  const removeMember = (id: string) => {
    if (data.members.length > 1) {
      save({ ...data, members: data.members.filter((m) => m.id !== id) });
    }
  };

  const inviteMember = (id: string) => {
    save({
      ...data,
      members: data.members.map((m) =>
        m.id === id ? { ...m, invited: true, invitedAt: new Date().toISOString() } : m
      ),
    });
  };

  const inviteAll = () => {
    save({
      ...data,
      members: data.members.map((m) =>
        m.email.trim() && m.roleId
          ? { ...m, invited: true, invitedAt: new Date().toISOString() }
          : m
      ),
    });
  };

  const validRoles = data.roles.filter((r) => r.name.trim());
  const validMembers = data.members.filter((m) => m.email.trim() && m.roleId);

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    navigate("/leader/process-intake");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-8">
        {/* Branding */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center">
            <Users className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Configura tu equipo
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {["Tamaño", "Roles", "Invitaciones"].map((label, i) => (
            <div key={i} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${
                  i <= step ? "bg-[hsl(var(--signal-positive))]" : "bg-border"
                }`}
              />
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Step 0: Team size */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-foreground">¿Cuántas personas tiene tu equipo?</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Incluye a todas las personas que participarán en este proceso.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Número de miembros</Label>
              <Input
                type="number"
                value={data.teamSize}
                onChange={(e) => save({ ...data, teamSize: e.target.value })}
                placeholder="Ej. 8"
                className="h-11"
                min="1"
              />
            </div>
          </div>
        )}

        {/* Step 1: Define roles */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Define los roles del equipo</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Crea los roles que existen dentro de este proceso. Los colaboradores seleccionarán el suyo al aceptar la invitación.
              </p>
            </div>
            <div className="space-y-3">
              {data.roles.map((role) => (
                <div key={role.id} className="flex gap-2">
                  <Input
                    value={role.name}
                    onChange={(e) => updateRole(role.id, e.target.value)}
                    placeholder="Nombre del rol (Ej. Coordinador, Analista)"
                    className="h-11"
                  />
                  {data.roles.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeRole(role.id)} className="shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addRole}>
                <Plus className="w-4 h-4 mr-1" /> Agregar rol
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Assign emails & invite */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Asigna correos e invita a tu equipo</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Cada persona recibirá una invitación, verá el área asignada y seleccionará su rol.
              </p>
            </div>

            <div className="space-y-4">
              {data.members.map((member) => (
                <div key={member.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Miembro</span>
                    <div className="flex items-center gap-2">
                      {member.invited && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--signal-positive))]">
                          <CheckCircle2 className="w-3 h-3" /> Invitado
                        </span>
                      )}
                      {data.members.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(member.id, "email", e.target.value)}
                    placeholder="correo@empresa.com"
                    className="h-11"
                    disabled={member.invited}
                  />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Rol asignado</Label>
                    <select
                      value={member.roleId}
                      onChange={(e) => updateMember(member.id, "roleId", e.target.value)}
                      className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled={member.invited}
                    >
                      <option value="">Seleccionar rol</option>
                      {validRoles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  {!member.invited && member.email.trim() && member.roleId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => inviteMember(member.id)}
                      className="text-[hsl(var(--signal-positive))]"
                    >
                      <Send className="w-3 h-3 mr-1" /> Enviar invitación
                    </Button>
                  )}
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addMember}>
                <Plus className="w-4 h-4 mr-1" /> Agregar miembro
              </Button>
            </div>

            {validMembers.length > 0 && validMembers.some((m) => !m.invited) && (
              <Button variant="outline" onClick={inviteAll} className="w-full">
                <Send className="w-4 h-4 mr-2" /> Invitar a todos
              </Button>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 0) navigate("/leader/process-selection");
              else setStep(step - 1);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
          </Button>

          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 0 && !data.teamSize.trim()) ||
                (step === 1 && validRoles.length === 0)
              }
              className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white"
            >
              Continuar <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white"
            >
              Continuar al intake <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;
