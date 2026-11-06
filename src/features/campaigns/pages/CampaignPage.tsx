import { SearchX, ShieldQuestionMark } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { getApiErrorMessage, getApiErrorTitle } from "../../../utils/apiError";
import { CandidateTable } from "../components/CandidateTable";
import { CampaignHeader } from "../components/CampaignHeader";
import { CampaignMetrics } from "../components/CampaignMetrics";
import { CampaignSkeleton } from "../components/CampaignSkeleton";
import { CampaignToolbar } from "../components/CampaignToolbar";
import {
  parseCampaignId,
  SUPPORTED_CAMPAIGN_IDS,
  type SupportedCampaignId,
} from "../constants";
import { useCampaign } from "../hooks/useCampaign";
import type {
  CampaignSortDirection,
  CampaignStatusFilter,
} from "../types/campaignView";
import {
  calculateCampaignMetrics,
  countCandidatesByStatus,
  filterAndSortCandidates,
  toCandidateEvaluationView,
} from "../utils/campaignRecords";

function InvalidCampaignState() {
  return (
    <EmptyState
      icon={SearchX}
      title="Campaign not available"
      description="This campaign is not part of the evaluation workspace. Choose one of the supported campaigns to continue."
      action={
        <Link
          to={`/jobs/campaign/${SUPPORTED_CAMPAIGN_IDS[0]}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Return to Campaign {SUPPORTED_CAMPAIGN_IDS[0]}
        </Link>
      }
    />
  );
}

interface CampaignContentProps {
  campaignId: SupportedCampaignId;
}

function CampaignContent({ campaignId }: CampaignContentProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignStatusFilter>("ALL");
  const [direction, setDirection] =
    useState<CampaignSortDirection>("desc");

  const campaignQuery = useCampaign(campaignId);
  const records = useMemo(
    () => campaignQuery.data ?? [],
    [campaignQuery.data],
  );

  const candidates = useMemo(
    () => records.map(toCandidateEvaluationView),
    [records],
  );
  const metrics = useMemo(() => calculateCampaignMetrics(records), [records]);
  const statusCounts = useMemo(
    () => countCandidatesByStatus(candidates),
    [candidates],
  );
  const visibleCandidates = useMemo(
    () =>
      filterAndSortCandidates(candidates, {
        search,
        status,
        direction,
      }),
    [candidates, search, status, direction],
  );

  const jobTitle = records.find((record) => record.campaignJobTitle?.trim())
    ?.campaignJobTitle;

  function clearFilters() {
    setSearch("");
    setStatus("ALL");
  }

  return (
    <div className="space-y-6">
      <CampaignHeader
        campaignId={campaignId}
        jobTitle={jobTitle}
        isRefreshing={campaignQuery.isFetching}
        onRefresh={() => {
          void campaignQuery.refetch();
        }}
      />

      {campaignQuery.isPending ? <CampaignSkeleton /> : null}

      {campaignQuery.isError ? (
        <ErrorState
          title={getApiErrorTitle(campaignQuery.error)}
          description={getApiErrorMessage(campaignQuery.error)}
          onRetry={() => {
            void campaignQuery.refetch();
          }}
          isRetrying={campaignQuery.isFetching}
        />
      ) : null}

      {!campaignQuery.isPending &&
      !campaignQuery.isError &&
      records.length === 0 ? (
        <EmptyState
          icon={ShieldQuestionMark}
          title="No evaluation records"
          description="This campaign does not contain any candidate evaluation records yet. Records will appear here when the campaign receives submissions."
        />
      ) : null}

      {!campaignQuery.isPending &&
      !campaignQuery.isError &&
      records.length > 0 ? (
        <>
          <CampaignMetrics metrics={metrics} />
          <CampaignToolbar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            direction={direction}
            onToggleDirection={() =>
              setDirection((current) => (current === "desc" ? "asc" : "desc"))
            }
            statusCounts={statusCounts}
            totalCount={candidates.length}
            visibleCount={visibleCandidates.length}
            onClearFilters={clearFilters}
          />

          {visibleCandidates.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No candidates match these filters"
              description="Try a different email search or reset the analytics status filter to see all records in this campaign."
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <CandidateTable candidates={visibleCandidates} />
          )}
        </>
      ) : null}
    </div>
  );
}

export function CampaignPage() {
  const { campaignId: campaignIdParam } = useParams();
  const campaignId = parseCampaignId(campaignIdParam);

  if (!campaignId) {
    return <InvalidCampaignState />;
  }

  return <CampaignContent key={campaignId} campaignId={campaignId} />;
}
