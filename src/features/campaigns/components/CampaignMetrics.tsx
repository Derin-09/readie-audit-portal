import {
  CircleCheck,
  Clock3,
  Gauge,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { formatPercentage } from "../../../utils/number";
import type { CampaignMetrics as CampaignMetricsData } from "../types/campaignView";

interface CampaignMetricsProps {
  metrics: CampaignMetricsData;
}

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accentClassName: string;
  children?: ReactNode;
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accentClassName,
  children,
}: MetricCardProps) {
  return (
    <div className="rounded-xl  bg-white p-4  sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] md:text-base font-semibold tracking-[0.1em] text-slate-500 uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accentClassName}`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs md:text-sm leading-5 text-slate-500">{detail}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export function CampaignMetrics({ metrics }: CampaignMetricsProps) {
  const completionShare =
    metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : null;

  return (
    <section aria-label="Campaign summary metrics">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Evaluation records"
          value={String(metrics.total)}
          detail="Unique candidate rooms in this campaign."
          icon={Users}
          accentClassName="bg-sky-50 text-sky-600"
        />
        <MetricCard
          label="Analytics completed"
          value={String(metrics.completed)}
          detail="Records where the analytics pipeline has finished."
          icon={CircleCheck}
          accentClassName="bg-emerald-50 text-emerald-600"
        >
          <ProgressBar
            value={completionShare}
            label="Completed analytics share"
            tone="positive"
          />
        </MetricCard>
        <MetricCard
          label="Pending analytics"
          value={String(metrics.pending)}
          detail="Records still processing or awaiting analysis."
          icon={Clock3}
          accentClassName="bg-amber-50 text-amber-600"
        />
        <MetricCard
          label="Average completion"
          value={formatPercentage(metrics.averageCompletion)}
          detail="Mean analytics completion across returned records."
          icon={Gauge}
          accentClassName="bg-slate-100 text-slate-600"
        >
          <ProgressBar
            value={metrics.averageCompletion}
            label="Average analytics completion"
          />
        </MetricCard>
      </div>
    </section>
  );
}
