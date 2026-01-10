import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  signal: "positive" | "warning" | "critical" | "neutral";
  label: string;
  value?: string | number;
  className?: string;
}

const signalConfig = {
  positive: {
    bg: "bg-signal-positive/10",
    text: "text-signal-positive",
    dot: "bg-signal-positive",
  },
  warning: {
    bg: "bg-signal-warning/10",
    text: "text-signal-warning",
    dot: "bg-signal-warning",
  },
  critical: {
    bg: "bg-signal-critical/10",
    text: "text-signal-critical",
    dot: "bg-signal-critical",
  },
  neutral: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export const SignalBadge = ({ signal, label, value, className }: SignalBadgeProps) => {
  const config = signalConfig[signal];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      <span>{label}</span>
      {value !== undefined && (
        <span className="font-semibold">{value}</span>
      )}
    </div>
  );
};
