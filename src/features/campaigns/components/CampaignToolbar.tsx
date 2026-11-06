import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type {
  AnalyticsStatus,
  CampaignSortDirection,
  CampaignStatusFilter,
} from "../types/campaignView";
import { getAnalyticsStatusLabel } from "../utils/campaignRecords";

interface CampaignToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: CampaignStatusFilter;
  onStatusChange: (value: CampaignStatusFilter) => void;
  direction: CampaignSortDirection;
  onToggleDirection: () => void;
  statusCounts: Record<AnalyticsStatus, number>;
  totalCount: number;
  visibleCount: number;
  onClearFilters: () => void;
}

export function CampaignToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  direction,
  onToggleDirection,
  statusCounts,
  totalCount,
  visibleCount,
  onClearFilters,
}: CampaignToolbarProps) {
  const filtersActive = search.trim().length > 0 || status !== "ALL";

  const statusOptions: Array<{
    value: CampaignStatusFilter;
    label: string;
    count: number;
  }> = [
    { value: "ALL", label: "All records", count: totalCount },
    {
      value: "COMPLETED",
      label: getAnalyticsStatusLabel("COMPLETED"),
      count: statusCounts.COMPLETED,
    },
    {
      value: "IN_PROGRESS",
      label: getAnalyticsStatusLabel("IN_PROGRESS"),
      count: statusCounts.IN_PROGRESS,
    },
  ];

  if (statusCounts.FAILED > 0) {
    statusOptions.push({
      value: "FAILED",
      label: getAnalyticsStatusLabel("FAILED"),
      count: statusCounts.FAILED,
    });
  }

  return (
    <section
      aria-label="Candidate record controls"
      className="rounded-xl  bg-white p-3  sm:p-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Search candidates by email</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by candidate email"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-9 pl-9 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
                className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-500"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </label>

          <div className="flex items-center gap-2">
            <SlidersHorizontal
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400"
            />
            <label className="relative">
              <span className="sr-only">Filter by analytics status</span>
              <select
                value={status}
                onChange={(event) =>
                  onStatusChange(event.target.value as CampaignStatusFilter)
                }
                className="h-10 min-w-44 appearance-none rounded-lg border border-slate-300 bg-white py-0 pr-9 pl-3 text-sm font-medium text-slate-700 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleDirection}
            aria-label={`Sort by submission timestamp ${
              direction === "desc" ? "oldest first" : "newest first"
            }`}
          >
            {direction === "desc" ? (
              <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {direction === "desc" ? "Newest first" : "Oldest first"}
          </Button>
          {filtersActive ? (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : null}
          <p
            aria-live="polite"
            className="ml-auto text-xs font-medium text-slate-500"
          >
            Showing <span className="text-slate-900">{visibleCount}</span> of{" "}
            {totalCount}
          </p>
        </div>
      </div>
    </section>
  );
}
