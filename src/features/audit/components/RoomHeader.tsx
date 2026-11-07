import {
  ExternalLink,
  Mail,
  Play,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { RoomIdentifier } from "../../../components/ui/RoomIdentifier";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { getInitials } from "../../../utils/name";
import { isSafeHttpUrl } from "../../../utils/url";
import type { CampaignRecording } from "../types/room";
import {
  formatAnalyticsCompletionLabel,
  formatDispositionLabel,
  formatRecordingStatusLabel,
} from "../utils/labels";
import {
  getRoomCandidateEmail,
  getRoomCandidateLabel,
  getRoomDisposition,
  getRoomHumanReviewRequired,
} from "../utils/recording";
import {
  getDispositionTone,
  getRecordingStatusTone,
} from "../utils/statusTone";

interface RoomHeaderProps {
  recording: CampaignRecording;
  recordingsCount: number;
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 bg-slate-50/80 px-4 py-3">
      <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function RoomHeader({ recording, recordingsCount }: RoomHeaderProps) {
  const candidateLabel = getRoomCandidateLabel(recording);
  const candidateEmail = getRoomCandidateEmail(recording);
  const disposition = getRoomDisposition(recording);
  const humanReview = getRoomHumanReviewRequired(recording);
  const analyticsCompleted =
    typeof recording.analyticsCompleted === "string" &&
    recording.analyticsCompleted.toUpperCase() === "Y";
  const hasRecordingUrl = isSafeHttpUrl(recording.finalUrl);
  const campaignLabel =
    typeof recording.campaignId === "number"
      ? `#${recording.campaignId}`
      : "Not available";

  return (
    <section className="overflow-hidden rounded-xl  bg-white ">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm md:text-base md:text-base font-bold tracking-wide text-slate-600"
          >
            {getInitials(candidateLabel)}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] md:text-base font-semibold tracking-[0.12em] text-slate-400 uppercase">
              <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
              Candidate evaluation room
            </p>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-950">
              {candidateLabel}
            </h1>
            <p
              title={candidateEmail}
              className="mt-1 flex max-w-xl items-center gap-1.5 truncate text-sm md:text-base text-slate-500"
            >
              <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{candidateEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full  bg-slate-50 px-2.5 py-1 text-[11px] md:text-base font-medium text-slate-500">
            Campaign {campaignLabel}
          </span>
          {hasRecordingUrl ? (
            <a
              href={recording.finalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs md:text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
            >
              <Play aria-hidden="true" className="h-3.5 w-3.5" />
              Open recording
              <ExternalLink aria-hidden="true" className="h-3 w-3 text-slate-400" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-4">
        <Fact label="Campaign">
          <p className="font-mono text-sm md:text-base font-semibold text-slate-800">
            {campaignLabel}
          </p>
        </Fact>
        <Fact label="Recording status">
          <StatusBadge
            label={formatRecordingStatusLabel(recording.status)}
            tone={getRecordingStatusTone(recording.status)}
          />
        </Fact>
        <Fact label="Analytics completion">
          <StatusBadge
            label={formatAnalyticsCompletionLabel(recording.analyticsCompleted)}
            tone={analyticsCompleted ? "positive" : "caution"}
          />
        </Fact>
        <Fact label="Room artifacts">
          <p className="text-sm md:text-base font-semibold text-slate-800">
            {recordingsCount}{" "}
            <span className="font-normal text-slate-500">
              {recordingsCount === 1 ? "recording" : "recordings"}
            </span>
          </p>
        </Fact>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
            Room identifier
          </p>
          <RoomIdentifier
            value={recording.roomName}
            wrap
            className="mt-1 text-[11px] md:text-base text-slate-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
              Overall disposition
            </p>
            <div className="mt-1.5">
              <StatusBadge
                label={
                  disposition
                    ? formatDispositionLabel(disposition)
                    : "Not available"
                }
                tone={disposition ? getDispositionTone(disposition) : "neutral"}
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
              Human review
            </p>
            <div className="mt-1.5">
              <StatusBadge
                label={
                  humanReview === null
                    ? "Not available"
                    : humanReview
                      ? "Required"
                      : "Not required"
                }
                tone={
                  humanReview === null
                    ? "neutral"
                    : humanReview
                      ? "caution"
                      : "positive"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
