import {
  ExternalLink,
  MessageSquareText,
  Play,
} from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { getInitials } from "../../../utils/name";
import { isSafeHttpUrl } from "../../../utils/url";
import type { CampaignRecording } from "../types/room";
import { getTranscript } from "../utils/recording";

interface TranscriptPanelProps {
  recording: CampaignRecording;
}

const speakerStyles = [
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-violet-200 bg-violet-50 text-violet-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-amber-200 bg-amber-50 text-amber-700",
  "border-rose-200 bg-rose-50 text-rose-700",
];

function getSpeakerStyle(speaker: string): string {
  let hash = 0;

  for (let index = 0; index < speaker.length; index += 1) {
    hash = (hash * 31 + speaker.charCodeAt(index)) | 0;
  }

  return (
    speakerStyles[Math.abs(hash) % speakerStyles.length] ?? speakerStyles[0]
  );
}

export function TranscriptPanel({ recording }: TranscriptPanelProps) {
  const transcript = getTranscript(recording);

  if (!transcript) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Transcript unavailable"
        description="The room response does not include transcript data for this recording. It may still be processing."
      />
    );
  }

  const entries = Array.isArray(transcript.entries) ? transcript.entries : [];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
            <MessageSquareText aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Interview transcript
            </h2>
            <p className="text-xs text-slate-500">
              Speaker-separated evidence with source timestamps.
            </p>
          </div>
        </div>
        <p className="text-xs font-medium text-slate-500">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyState
            icon={MessageSquareText}
            title="No transcript entries"
            description="Transcript data is present for this recording, but it does not contain any captured entries."
            compact
          />
        </div>
      ) : (
        <ol className="divide-y divide-slate-100">
          {entries.map((entry, index) => {
            const hasVideo = isSafeHttpUrl(entry.videoUrl);
            const style = getSpeakerStyle(entry.speaker || "Unknown speaker");

            return (
              <li
                key={`${entry.timestamp}-${index}`}
                className="grid gap-3 px-4 py-4 sm:grid-cols-[5.5rem_2.5rem_minmax(0,1fr)] sm:px-5"
              >
                <div className="sm:pt-0.5">
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600">
                    {entry.timestamp || "No time"}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className={`hidden h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold tracking-wide sm:flex ${style}`}
                >
                  {getInitials(entry.speaker || "?")}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {entry.speaker || "Speaker not provided"}
                    </p>
                    {hasVideo ? (
                      <a
                        href={entry.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                      >
                        <Play aria-hidden="true" className="h-3 w-3" />
                        View clip
                        <ExternalLink
                          aria-hidden="true"
                          className="h-3 w-3 text-sky-500"
                        />
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm leading-6 break-words text-slate-600">
                    {entry.text || "No transcript text was provided for this entry."}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
