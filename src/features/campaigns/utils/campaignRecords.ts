import { formatTimestamp } from "../../../utils/date";
import { getInitials } from "../../../utils/name";
import { normalizePercentage } from "../../../utils/number";
import type { StatusTone } from "../../../utils/tone";
import type {
  CampaignEvaluationRecord,
  CampaignEvaluationResponse,
} from "../types/campaign";
import type {
  AnalyticsStatus,
  CampaignMetrics,
  CampaignTableOptions,
  CandidateEvaluationView,
} from "../types/campaignView";

export function resolveAnalyticsStatus(
  record: CampaignEvaluationRecord,
): AnalyticsStatus {
  return record.analyticsCompleted ? "COMPLETED" : "IN_PROGRESS";
}

export function getAnalyticsStatusLabel(status: AnalyticsStatus): string {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In progress";
    case "FAILED":
      return "Failed";
    default:
      return "Unknown";
  }
}

export function getAnalyticsStatusTone(status: AnalyticsStatus): StatusTone {
  switch (status) {
    case "COMPLETED":
      return "positive";
    case "IN_PROGRESS":
      return "caution";
    case "FAILED":
      return "danger";
    default:
      return "neutral";
  }
}

export function getCandidateDisplayName(
  record: CampaignEvaluationRecord,
): string {
  const candidateName = record.candidateName?.trim();
  const candidateEmail = record.candidateEmail?.trim();

  return candidateName || candidateEmail || "Unnamed candidate";
}

export function getCandidateInitials(displayName: string): string {
  return getInitials(displayName);
}

export function toCandidateEvaluationView(
  record: CampaignEvaluationRecord,
): CandidateEvaluationView {
  return {
    key: record.roomName,
    record,
    displayName: getCandidateDisplayName(record),
    email: record.candidateEmail?.trim() || "Email not available",
    status: resolveAnalyticsStatus(record),
    analyticsPercentage: normalizePercentage(
      record.percentageAnalyticCompleted,
    ),
    submittedAt: formatTimestamp(record.candidateDateCreated),
  };
}

export function calculateCampaignMetrics(
  records: CampaignEvaluationResponse,
): CampaignMetrics {
  const completed = records.filter((record) => record.analyticsCompleted).length;
  const percentages = records
    .map((record) => normalizePercentage(record.percentageAnalyticCompleted))
    .filter((value): value is number => value !== null);

  const averageCompletion =
    percentages.length > 0
      ? percentages.reduce((sum, value) => sum + value, 0) / percentages.length
      : null;

  return {
    total: records.length,
    completed,
    pending: records.length - completed,
    averageCompletion,
  };
}

export function filterAndSortCandidates(
  candidates: CandidateEvaluationView[],
  options: CampaignTableOptions,
): CandidateEvaluationView[] {
  const search = options.search.trim().toLowerCase();

  const filtered = candidates.filter((candidate) => {
    const matchesSearch =
      search.length === 0 ||
      (candidate.record.candidateEmail ?? "").toLowerCase().includes(search);
    const matchesStatus =
      options.status === "ALL" || candidate.status === options.status;

    return matchesSearch && matchesStatus;
  });

  return [...filtered].sort((left, right) => {
    const leftTimestamp = left.submittedAt.value ?? 0;
    const rightTimestamp = right.submittedAt.value ?? 0;
    const difference = leftTimestamp - rightTimestamp;

    if (difference !== 0) {
      return options.direction === "asc" ? difference : -difference;
    }

    return left.displayName.localeCompare(right.displayName);
  });
}

export function countCandidatesByStatus(
  candidates: CandidateEvaluationView[],
): Record<AnalyticsStatus, number> {
  return candidates.reduce<Record<AnalyticsStatus, number>>(
    (counts, candidate) => {
      counts[candidate.status] += 1;
      return counts;
    },
    {
      COMPLETED: 0,
      IN_PROGRESS: 0,
      FAILED: 0,
    },
  );
}
