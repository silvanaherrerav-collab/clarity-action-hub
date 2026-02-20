export type ActionStatus = "pending" | "accepted" | "snoozed" | "completed";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface RecommendedAction {
  actionId: string;
  title: string;
  status: ActionStatus;
  acceptedAt?: string;
  snoozeUntil?: string;
  completedAt?: string;
  checklist: ChecklistItem[];
  evidenceNote: string;
  updatedPlanLink: string;
}

export interface AnonymousPulse {
  actionId: string;
  answer: "yes" | "no" | "na";
  submittedAt: string;
}

const ACTIONS_KEY = "tp_recommended_actions";
const PULSES_KEY = "tp_anonymous_pulses";

const DEFAULT_ONE_ON_ONE: RecommendedAction = {
  actionId: "one_on_one_calibration",
  title: "Reunión 1:1 — Revisión del plan de trabajo",
  status: "pending",
  checklist: [
    { id: "review_roles", label: "Revisar plan por rol", done: false },
    { id: "adjust_dates", label: "Ajustar fechas y dependencias", done: false },
    { id: "confirm_kpis", label: "Confirmar KPIs", done: false },
    { id: "align_done", label: "Alinear definición de \"hecho\"", done: false },
  ],
  evidenceNote: "",
  updatedPlanLink: "",
};

export function getActions(): RecommendedAction[] {
  try {
    const raw = localStorage.getItem(ACTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecommendedAction[];
  } catch {
    return [];
  }
}

export function saveActions(actions: RecommendedAction[]): void {
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
}

export function getActionById(actionId: string): RecommendedAction | undefined {
  return getActions().find((a) => a.actionId === actionId);
}

export function upsertAction(action: RecommendedAction): void {
  const actions = getActions();
  const idx = actions.findIndex((a) => a.actionId === action.actionId);
  if (idx >= 0) {
    actions[idx] = action;
  } else {
    actions.push(action);
  }
  saveActions(actions);
}

export function acceptAction(actionId: string): void {
  const actions = getActions();
  const existing = actions.find((a) => a.actionId === actionId);
  if (existing) {
    existing.status = "accepted";
    existing.acceptedAt = new Date().toISOString();
    saveActions(actions);
  } else {
    const newAction: RecommendedAction = {
      ...DEFAULT_ONE_ON_ONE,
      actionId,
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    };
    saveActions([...actions, newAction]);
  }
}

export function snoozeAction(actionId: string): void {
  const actions = getActions();
  const existing = actions.find((a) => a.actionId === actionId);
  const snoozeUntil = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  if (existing) {
    existing.status = "snoozed";
    existing.snoozeUntil = snoozeUntil;
    saveActions(actions);
  } else {
    const newAction: RecommendedAction = {
      ...DEFAULT_ONE_ON_ONE,
      actionId,
      status: "snoozed",
      snoozeUntil,
    };
    saveActions([...actions, newAction]);
  }
}

export function updateActionChecklist(
  actionId: string,
  checklist: ChecklistItem[],
  evidenceNote: string,
  updatedPlanLink: string
): void {
  const actions = getActions();
  const action = actions.find((a) => a.actionId === actionId);
  if (action) {
    action.checklist = checklist;
    action.evidenceNote = evidenceNote;
    action.updatedPlanLink = updatedPlanLink;
    saveActions(actions);
  }
}

export function completeAction(actionId: string): void {
  const actions = getActions();
  const action = actions.find((a) => a.actionId === actionId);
  if (action) {
    action.status = "completed";
    action.completedAt = new Date().toISOString();
    saveActions(actions);
  }
}

export function activateAction(actionId: string): void {
  const actions = getActions();
  const action = actions.find((a) => a.actionId === actionId);
  if (action) {
    action.status = "accepted";
    action.acceptedAt = new Date().toISOString();
    action.snoozeUntil = undefined;
    saveActions(actions);
  }
}

// Anonymous pulses
export function getPulses(): AnonymousPulse[] {
  try {
    const raw = localStorage.getItem(PULSES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnonymousPulse[];
  } catch {
    return [];
  }
}

export function addPulse(pulse: AnonymousPulse): void {
  const pulses = getPulses();
  pulses.push(pulse);
  localStorage.setItem(PULSES_KEY, JSON.stringify(pulses));
}

export function getPulseAggregates(actionId: string): { yes: number; no: number; na: number } {
  const pulses = getPulses().filter((p) => p.actionId === actionId);
  return {
    yes: pulses.filter((p) => p.answer === "yes").length,
    no: pulses.filter((p) => p.answer === "no").length,
    na: pulses.filter((p) => p.answer === "na").length,
  };
}

export { DEFAULT_ONE_ON_ONE };
