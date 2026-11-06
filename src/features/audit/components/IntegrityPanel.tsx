import {
  AudioWaveform,
  CircleQuestionMark,
  Radio,
  ShieldExclamationPoint,
  UserCheck,
  UserRound,
  UserRoundX,
  Video,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { StatusTone } from "../../../utils/tone";
import type { CampaignRecording, RiskAssessment } from "../types/room";
import {
  formatDispositionLabel,
  formatRiskLabel,
} from "../utils/labels";
import { getDeepfakePhase2 } from "../utils/recording";
import {
  getDispositionTone,
  getRiskTone,
} from "../utils/statusTone";
import { LimitationsList } from "./LimitationsList";
import { RiskAssessmentCard } from "./RiskAssessmentCard";
import { UnknownDataList } from "./UnknownDataList";

interface IntegrityPanelProps {
  recording: CampaignRecording;
}

interface SummaryCardProps {
  label: string;
  value: string;
  description: string;
  tone: StatusTone;
  icon: LucideIcon;
}

const summaryIconStyles: Record<StatusTone, string> = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-600",
  caution: "border-amber-200 bg-amber-50 text-amber-600",
  danger: "border-rose-200 bg-rose-50 text-rose-600",
  info: "border-sky-200 bg-sky-50 text-sky-600",
  neutral: "border-slate-200 bg-slate-50 text-slate-500",
};

function SummaryCard({
  label,
  value,
  description,
  tone,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl  bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.1em] text-slate-400 uppercase">
            {label}
          </p>
          <div className="mt-2">
            <StatusBadge label={value} tone={tone} />
          </div>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${summaryIconStyles[tone]}`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export function IntegrityPanel({ recording }: IntegrityPanelProps) {
  const phase2 = getDeepfakePhase2(recording);

  if (!phase2) {
    return (
      <EmptyState
        icon={ShieldExclamationPoint}
        title="Integrity analysis unavailable"
        description="The room response does not include Phase 2 integrity and proctoring data for this recording."
      />
    );
  }

  const gemini = phase2.gemini;

  if (!gemini) {
    return (
      <EmptyState
        icon={ShieldExclamationPoint}
        title="Integrity analysis unavailable"
        description="Phase 2 data is present, but the automated analysis payload is missing."
      />
    );
  }

  const overallRisk =
    typeof gemini.overallRisk === "string" &&
    gemini.overallRisk.trim().length > 0
      ? gemini.overallRisk
      : null;
  const disposition =
    typeof phase2.disposition === "string" &&
    phase2.disposition.trim().length > 0
      ? phase2.disposition
      : null;
  const humanReview =
    typeof phase2.humanReviewRequired === "boolean"
      ? phase2.humanReviewRequired
      : null;

  const riskAssessments: Array<{
    title: string;
    description: string;
    assessment: RiskAssessment | null | undefined;
    icon: LucideIcon;
  }> = [
    {
      title: "Synthetic video",
      description: "Frame and texture signals associated with generated media.",
      assessment: gemini.syntheticVideo,
      icon: Video,
    },
    {
      title: "Person continuity",
      description: "Consistency of the candidate's identity through the session.",
      assessment: gemini.personContinuity,
      icon: UserRound,
    },
    {
      title: "Audio-video consistency",
      description: "Alignment between spoken audio and visible mouth movement.",
      assessment: gemini.audioVideoConsistency,
      icon: AudioWaveform,
    },
    {
      title: "Possible off-screen assistance",
      description: "Signals of external voices, coaching or second-screen activity.",
      assessment: gemini.possibleOffScreenAssistance,
      icon: Radio,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryCard
          label="Overall risk"
          value={overallRisk ? `${formatRiskLabel(overallRisk)} risk` : "Not available"}
          description="Combined Phase 2 automated risk level across all categories."
          tone={overallRisk ? getRiskTone(overallRisk) : "neutral"}
          icon={ShieldExclamationPoint}
        />
        <SummaryCard
          label="Disposition"
          value={disposition ? formatDispositionLabel(disposition) : "Not available"}
          description="Automated recommendation to support the human review decision."
          tone={disposition ? getDispositionTone(disposition) : "neutral"}
          icon={CircleQuestionMark}
        />
        <SummaryCard
          label="Human review"
          value={
            humanReview === null
              ? "Not available"
              : humanReview
                ? "Required"
                : "Not required"
          }
          description="Whether a reviewer must examine this room before disposition."
          tone={
            humanReview === null ? "neutral" : humanReview ? "caution" : "positive"
          }
          icon={humanReview ? UserRoundX : UserCheck}
        />
      </div>

      <section aria-label="Risk assessments">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Risk assessments
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Category-level automated findings. Each signal includes confidence
              and supporting observations.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {riskAssessments.map((item) => (
            <RiskAssessmentCard
              key={item.title}
              title={item.title}
              description={item.description}
              assessment={item.assessment}
              icon={item.icon}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-xl  bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Suspicious time ranges
          </h3>
          <p className="mt-1 mb-3 text-xs leading-5 text-slate-500">
            Ranges returned by the analysis service for reviewer attention.
          </p>
          <UnknownDataList
            items={gemini.suspiciousTimeRanges}
            itemLabel="Time range"
            emptyMessage="No suspicious time ranges were returned for this recording."
          />
        </section>

        <section className="rounded-xl  bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Specialist results
          </h3>
          <p className="mt-1 mb-3 text-xs leading-5 text-slate-500">
            Additional model findings returned alongside the primary analysis.
          </p>
          <UnknownDataList
            items={phase2.specialistResults}
            itemLabel="Result"
            emptyMessage="No specialist model results were returned for this recording."
          />
        </section>
      </div>

      <LimitationsList limitations={gemini.limitations} />
    </div>
  );
}
