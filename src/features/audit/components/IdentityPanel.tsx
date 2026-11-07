import {
  CircleCheck,
  CircleQuestionMark,
  CircleX,
  ScanFace,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { StatusTone } from "../../../utils/tone";
import type { CampaignRecording } from "../types/room";
import {
  formatDecisionLabel,
  formatVideoQualityLabel,
} from "../utils/labels";
import { getIdentityPhase1 } from "../utils/recording";
import {
  getDecisionTone,
  getVideoQualityTone,
} from "../utils/statusTone";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { LimitationsList } from "./LimitationsList";
import { UnknownDataList } from "./UnknownDataList";

interface IdentityPanelProps {
  recording: CampaignRecording;
}

const bannerStyles: Record<StatusTone, string> = {
  positive: "border-emerald-200 bg-emerald-50",
  caution: "border-amber-200 bg-amber-50",
  danger: "border-rose-200 bg-rose-50",
  info: "border-sky-200 bg-sky-50",
  neutral: "border-slate-200 bg-slate-50",
};

const iconStyles: Record<StatusTone, string> = {
  positive: "border-emerald-200 bg-white text-emerald-600",
  caution: "border-amber-200 bg-white text-amber-600",
  danger: "border-rose-200 bg-white text-rose-600",
  info: "border-sky-200 bg-white text-sky-600",
  neutral: "border-slate-200 bg-white text-slate-500",
};

const decisionIcons: Record<StatusTone, LucideIcon> = {
  positive: CircleCheck,
  caution: CircleQuestionMark,
  danger: CircleX,
  info: ScanFace,
  neutral: ScanFace,
};

function QualityCard({
  label,
  quality,
}: {
  label: string;
  quality: string | null | undefined;
}) {
  const hasQuality = typeof quality === "string" && quality.trim().length > 0;
  const tone = hasQuality ? getVideoQualityTone(quality) : "neutral";

  return (
    <div className="rounded-lg  bg-slate-50/60 p-3.5">
      <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
        {label}
      </p>
      <div className="mt-2">
        <StatusBadge
          label={hasQuality ? formatVideoQualityLabel(quality) : "Not available"}
          tone={tone}
        />
      </div>
    </div>
  );
}

export function IdentityPanel({ recording }: IdentityPanelProps) {
  const identity = getIdentityPhase1(recording);

  if (!identity) {
    return (
      <EmptyState
        icon={ScanFace}
        title="Identity verification unavailable"
        description="The room response does not include a Phase 1 identity verification result. The analysis may still be processing."
      />
    );
  }

  const decision =
    typeof identity.decision === "string" && identity.decision.trim().length > 0
      ? identity.decision
      : null;
  const tone = decision ? getDecisionTone(decision) : "neutral";
  const DecisionIcon = decisionIcons[tone];
  const matchingEvidence = Array.isArray(identity.matchingEvidence)
    ? identity.matchingEvidence
    : [];
  const conflictingEvidence = Array.isArray(identity.conflictingEvidence)
    ? identity.conflictingEvidence
    : [];
  const multiplePeopleKnown =
    typeof identity.multiplePeopleDetected === "boolean";
  const multiplePeople = identity.multiplePeopleDetected === true;

  return (
    <div className="space-y-4">
      <section
        className={`rounded-xl border p-4  sm:p-5 ${bannerStyles[tone]}`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${iconStyles[tone]}`}
            >
              <DecisionIcon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] md:text-base font-semibold tracking-[0.12em] text-slate-500 uppercase">
                Phase 1 identity decision
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                {decision ? formatDecisionLabel(decision) : "Not available"}
              </h2>
              <p className="mt-1 text-xs md:text-sm leading-5 text-slate-600">
                Automated identity comparison between the reference and
                interview video.
              </p>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-lg border border-white/70 bg-white/70 p-3">
            {typeof identity.confidence === "number" ? (
              <ConfidenceMeter
                value={identity.confidence}
                label="Decision confidence"
                tone={
                  tone === "neutral"
                    ? "info"
                    : tone === "positive"
                      ? "positive"
                      : tone === "danger"
                        ? "danger"
                        : "caution"
                }
              />
            ) : (
              <p className="text-xs md:text-sm text-slate-500">
                Confidence value not available.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl  bg-white p-4  sm:p-5">
        <div className="flex items-center gap-2">
          <Video aria-hidden="true" className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs md:text-sm font-semibold tracking-[0.08em] text-slate-500 uppercase">
            Verification signals
          </h3>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QualityCard
            label="Reference video quality"
            quality={identity.referenceVideoQuality}
          />
          <QualityCard
            label="Interview video quality"
            quality={identity.interviewVideoQuality}
          />
          <div className="rounded-lg  bg-slate-50/60 p-3.5">
            <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
              Multiple people detected
            </p>
            <div className="mt-2">
              <StatusBadge
                label={
                  multiplePeopleKnown
                    ? multiplePeople
                      ? "Yes"
                      : "No"
                    : "Not available"
                }
                tone={
                  multiplePeopleKnown
                    ? multiplePeople
                      ? "danger"
                      : "positive"
                    : "neutral"
                }
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-xl  bg-white p-4  sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Users aria-hidden="true" className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm md:text-base font-semibold text-slate-900">
              Matching evidence
            </h3>
          </div>
          <UnknownDataList
            items={matchingEvidence}
            itemLabel="Evidence item"
            emptyMessage="No matching evidence was returned for this identity check."
          />
        </section>

        <section className="rounded-xl  bg-white p-4  sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <CircleQuestionMark
              aria-hidden="true"
              className="h-4 w-4 text-slate-400"
            />
            <h3 className="text-sm md:text-base font-semibold text-slate-900">
              Conflicting evidence
            </h3>
          </div>
          <UnknownDataList
            items={conflictingEvidence}
            itemLabel="Evidence item"
            emptyMessage="No conflicting evidence was returned for this identity check."
          />
        </section>
      </div>

      <LimitationsList limitations={identity.limitations} />
    </div>
  );
}
