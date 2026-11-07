import { cn } from "../../utils/cn";
import type { StatusTone } from "../../utils/tone";

const toneStyles: Record<StatusTone, { container: string; dot: string }> = {
  positive: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  caution: {
    container: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
  },
  danger: {
    container: "border-rose-200 bg-rose-50 text-rose-800",
    dot: "bg-rose-500",
  },
  info: {
    container: "border-sky-200 bg-sky-50 text-sky-800",
    dot: "bg-sky-500",
  },
  neutral: {
    container: "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-400",
  },
};

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  const styles = toneStyles[tone];

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full  px-2.5 py-1 text-[11px] md:text-base font-semibold tracking-[0.04em] uppercase",
        styles.container,
        className,
      )}
    >
      {/* {showDot ? (
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", styles.dot)}
        />
      ) : null} */}
      <span className="truncate">{label}</span>
    </span>
  );
}
