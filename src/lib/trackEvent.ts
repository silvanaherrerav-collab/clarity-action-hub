/**
 * Simple MVP event tracking to localStorage.
 * Events are stored for later analysis / export.
 */

export interface TrackedEvent {
  event: string;
  timestamp: string;
  data?: Record<string, string | number | boolean>;
}

const STORAGE_KEY = "tp_events";

export function trackEvent(event: string, data?: Record<string, string | number | boolean>) {
  try {
    const existing: TrackedEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push({
      event,
      timestamp: new Date().toISOString(),
      data,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // silently fail
  }
}

export function getEvents(): TrackedEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getEventCount(event: string): number {
  return getEvents().filter((e) => e.event === event).length;
}
