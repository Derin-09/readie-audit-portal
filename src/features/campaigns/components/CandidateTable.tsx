import { ChevronRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { RoomIdentifier } from "../../../components/ui/RoomIdentifier";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { getRoomPath } from "../../../utils/roomUrl";
import type { CandidateEvaluationView } from "../types/campaignView";
import {
  getAnalyticsStatusLabel,
  getAnalyticsStatusTone,
  getCandidateInitials,
} from "../utils/campaignRecords";

interface CandidateTableProps {
  candidates: CandidateEvaluationView[];
}

function progressTone(status: CandidateEvaluationView["status"]) {
  if (status === "COMPLETED") {
    return "positive" as const;
  }

  if (status === "FAILED") {
    return "danger" as const;
  }

  return "info" as const;
}

function CandidateAvatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[11px] font-bold tracking-wide text-slate-600"
    >
      {getCandidateInitials(name)}
    </span>
  );
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const navigate = useNavigate();

  function openRoom(roomName: string) {
    navigate(getRoomPath(roomName));
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl  bg-white  md:block">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/90 text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Candidate name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Room identifier
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Submitted
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Verification status
                  <span className="mt-0.5 block text-[9px] font-medium tracking-[0.08em] text-slate-400">
                    Analytics pipeline
                  </span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Analytics progress
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => {
                const roomPath = getRoomPath(candidate.record.roomName);

                return (
                  <tr
                    key={candidate.key}
                    tabIndex={0}
                    onClick={() => openRoom(candidate.record.roomName)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openRoom(candidate.record.roomName);
                      }
                    }}
                    aria-label={`Open evaluation room for ${candidate.displayName}`}
                    className="group cursor-pointer border-t border-slate-100 transition hover:bg-slate-50/80 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-400"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <CandidateAvatar name={candidate.displayName} />
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                            {candidate.displayName}
                          </p>
                          {candidate.record.candidateId ? (
                            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                              {candidate.record.candidateId}
                            </p>
                          ) : (
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Candidate ID unavailable
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        title={candidate.email}
                        className="flex max-w-[230px] items-center gap-1.5 truncate text-sm text-slate-600"
                      >
                        <Mail
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 text-slate-400"
                        />
                        <span className="truncate">{candidate.email}</span>
                      </span>
                    </td>
                    <td className="max-w-[250px] px-4 py-3.5">
                      <RoomIdentifier value={candidate.record.roomName} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-sm font-medium text-slate-700">
                        {candidate.submittedAt.date}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {candidate.submittedAt.time}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge
                        label={getAnalyticsStatusLabel(candidate.status)}
                        tone={getAnalyticsStatusTone(candidate.status)}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="w-32">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-slate-500">
                            {candidate.analyticsPercentage === null
                              ? "Not available"
                              : `${Math.round(candidate.analyticsPercentage)}%`}
                          </span>
                        </div>
                        <ProgressBar
                          value={candidate.analyticsPercentage}
                          label={`Analytics progress for ${candidate.displayName}`}
                          tone={progressTone(candidate.status)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        to={roomPath}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        aria-label={`Open evaluation room for ${candidate.displayName}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 transition group-hover:text-slate-950 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                      >
                        Review
                        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {candidates.map((candidate) => {
          const roomPath = getRoomPath(candidate.record.roomName);

          return (
            <Link
              key={candidate.key}
              to={roomPath}
              aria-label={`Open evaluation room for ${candidate.displayName}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <CandidateAvatar name={candidate.displayName} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {candidate.displayName}
                    </p>
                    <p
                      title={candidate.email}
                      className="mt-0.5 truncate text-xs text-slate-500"
                    >
                      {candidate.email}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  label={getAnalyticsStatusLabel(candidate.status)}
                  tone={getAnalyticsStatusTone(candidate.status)}
                  showDot={false}
                />
              </div>

              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2">
                <RoomIdentifier value={candidate.record.roomName} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
                    Submitted
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {candidate.submittedAt.date}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {candidate.submittedAt.time}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
                    Analytics
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {candidate.analyticsPercentage === null
                      ? "Not available"
                      : `${Math.round(candidate.analyticsPercentage)}% complete`}
                  </p>
                  <ProgressBar
                    className="mt-1.5"
                    value={candidate.analyticsPercentage}
                    label={`Analytics progress for ${candidate.displayName}`}
                    tone={progressTone(candidate.status)}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600">
                Open evaluation room
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
