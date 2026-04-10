/**
 * Shared helper to load the collaborator's identity from localStorage.
 */
export function getCollaboratorIdentity() {
  try {
    const data = localStorage.getItem("tp_register_data");
    if (data) {
      const parsed = JSON.parse(data);
      const first = parsed.firstName || parsed.nombre || "";
      const last = parsed.lastName || parsed.apellidos || "";
      const fullName = `${first} ${last}`.trim() || "Colaborador";
      const initials = `${first.charAt(0) || ""}${last.charAt(0) || ""}`.toUpperCase() || "C";
      return { firstName: first || "Colaborador", fullName, initials };
    }
  } catch {}
  return { firstName: "Colaborador", fullName: "Colaborador", initials: "C" };
}
