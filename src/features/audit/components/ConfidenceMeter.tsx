import { ProgressBar } from "../../../components/ui/ProgressBar";
import { formatConfidence, normalizeConfidence } from "../../../utils/number";

interface ConfidenceMeterProps {
  value: number;
  label?: string;
  tone?: "info" | "positive" | "caution" | "danger";
}

export function ConfidenceMeter({
  value,
  label = "Confidence",
  tone = "info",
}: ConfidenceMeterProps) {
  const normalized = normalizeConfidence(value);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs font-semibold text-slate-800">
          {formatConfidence(value)}
        </span>
      </div>
      <ProgressBar value={normalized} tone={tone} label={label} />
    </div>
  );
}
