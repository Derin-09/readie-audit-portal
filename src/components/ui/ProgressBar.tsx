import { cn } from "../../utils/cn";
import { normalizePercentage } from "../../utils/number";

type ProgressTone = "info" | "positive" | "caution" | "danger";

const toneStyles: Record<ProgressTone, string> = {
  info: "bg-sky-500",
  positive: "bg-emerald-500",
  caution: "bg-amber-500",
  danger: "bg-rose-500",
};

interface ProgressBarProps {
  value: number | null;
  label?: string;
  tone?: ProgressTone;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  tone = "info",
  className,
}: ProgressBarProps) {
  const normalized = normalizePercentage(value);

  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-200", className)}
      role="progressbar"
      aria-label={label ?? "Progress"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalized === null ? undefined : Math.round(normalized)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          normalized === null ? "bg-transparent" : toneStyles[tone],
        )}
        style={{ width: `${normalized ?? 0}%` }}
      />
    </div>
  );
}
