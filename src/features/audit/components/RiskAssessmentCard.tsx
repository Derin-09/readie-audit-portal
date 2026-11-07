import {
  Clock3,
  Radio,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { StatusTone } from "../../../utils/tone";
import type { RiskAssessment } from "../types/room";
import { formatRiskLabel } from "../utils/labels";
import { getRiskTone } from "../utils/statusTone";
import { ConfidenceMeter } from "./ConfidenceMeter";

interface RiskAssessmentCardProps {
  title: string;
  description: string;
  assessment: RiskAssessment | null | undefined;
  icon: LucideIcon;
}

function toProgressTone(
  tone: StatusTone,
): "info" | "positive" | "caution" | "danger" {
  return tone === "neutral" ? "info" : tone;
}

export function RiskAssessmentCard({
  title,
  description,
  assessment,
  icon: Icon,
}: RiskAssessmentCardProps) {
  const tone = getRiskTone(assessment?.risk ?? "Unknown");
  const observations = Array.isArray(assessment?.observations)
    ? assessment.observations
    : [];

  return (
    <article className="rounded-xl  bg-white p-4  sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg  bg-slate-50 text-slate-500">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs md:text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
        <StatusBadge
          label={
            assessment?.risk
              ? `${formatRiskLabel(assessment.risk)} risk`
              : "Unavailable"
          }
          tone={tone}
        />
      </div>

      {assessment ? (
        <>
          <div className="mt-4">
            <ConfidenceMeter
              value={assessment.confidence}
              tone={toProgressTone(tone)}
            />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <h4 className="text-[10px] font-semibold tracking-[0.1em] text-slate-400 uppercase">
              Observations
            </h4>
            {observations.length === 0 ? (
              <p className="mt-2 text-xs md:text-sm leading-5 text-slate-500">
                No observations were returned for this risk category.
              </p>
            ) : (
              <ul className="mt-2.5 space-y-3">
                {observations.map((observation, index) => (
                  <li
                    key={`${observation.timestamp}-${observation.source}-${index}`}
                    className="rounded-lg  bg-slate-50/60 p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      {observation.timestamp ? (
                        <span className="inline-flex items-center gap-1 rounded-md  bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                          <Clock3
                            aria-hidden="true"
                            className="h-3 w-3 text-slate-400"
                          />
                          {observation.timestamp}
                        </span>
                      ) : null}
                      {observation.source ? (
                        <span className="inline-flex items-center gap-1 rounded-m bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700">
                          <Radio
                            aria-hidden="true"
                            className="h-3 w-3 text-sky-500"
                          />
                          {observation.source}
                        </span>
                      ) : null}
                      {observation.category ? (
                        <span className="inline-flex items-center gap-1 rounded-md  bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                          <Tag
                            aria-hidden="true"
                            className="h-3 w-3 text-slate-400"
                          />
                          {observation.category}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm md:text-base leading-6 text-slate-700">
                      {observation.observation || "No description provided."}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-lg border border- bg-slate-50/70 px-3 py-3 text-xs md:text-sm leading-5 text-slate-500">
          This risk assessment was not returned for the room.
        </div>
      )}
    </article>
  );
}
