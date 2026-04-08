/**
 * Single source of truth for the active process name.
 * All components must use this function instead of reading localStorage directly.
 */
export function getProcessName(): string {
  try {
    const raw = localStorage.getItem("tp_process_intake");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.processName?.trim()) return data.processName.trim();
    }
  } catch { /* ignore */ }

  try {
    const raw = localStorage.getItem("tp_process_intake_simple");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.processName?.trim()) return data.processName.trim();
    }
  } catch { /* ignore */ }

  try {
    const raw = localStorage.getItem("tp_process_selection");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.process?.trim()) return data.process.trim();
    }
  } catch { /* ignore */ }

  return "Sin proceso";
}
