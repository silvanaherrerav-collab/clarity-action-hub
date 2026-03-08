import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "tp_team_setup";

interface TeamMember {
  id: string;
  role: string;
  email: string;
}

const TeamSetup = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [{ id: crypto.randomUUID(), role: "", email: "" }];
  });

  const save = (updated: TeamMember[]) => {
    setMembers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addMember = () => {
    save([...members, { id: crypto.randomUUID(), role: "", email: "" }]);
  };

  const updateMember = (id: string, field: "role" | "email", value: string) => {
    save(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const removeMember = (id: string) => {
    if (members.length > 1) save(members.filter((m) => m.id !== id));
  };

  const validMembers = members.filter((m) => m.role.trim() && m.email.trim());

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    navigate("/leader/transition");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-8">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center">
            <Users className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Configura tu equipo
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Define los roles de tu equipo y asigna el correo de cada miembro.
            </p>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_40px] gap-3 px-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rol</Label>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Correo electrónico</Label>
          <span />
        </div>

        {/* Members */}
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="grid grid-cols-[1fr_1fr_40px] gap-3 items-center">
              <Input
                value={member.role}
                onChange={(e) => updateMember(member.id, "role", e.target.value)}
                placeholder="Ej. Auxiliar RH"
                className="h-11"
              />
              <Input
                type="email"
                value={member.email}
                onChange={(e) => updateMember(member.id, "email", e.target.value)}
                placeholder="correo@empresa.com"
                className="h-11"
              />
              {members.length > 1 ? (
                <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="h-9 w-9">
                  <Trash2 className="w-4 h-4" />
                </Button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addMember}>
          <Plus className="w-4 h-4 mr-1" /> Agregar miembro
        </Button>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button variant="ghost" onClick={() => navigate("/leader/context")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
          </Button>
          <Button
            onClick={handleContinue}
            disabled={validMembers.length === 0}
            className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white"
          >
            Continuar <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;
