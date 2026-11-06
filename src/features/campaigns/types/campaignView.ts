import type { CampaignEvaluationRecord } from "./campaign";
import type { FormattedTimestamp } from "../../../utils/date";

export type AnalyticsStatus = "COMPLETED" | "IN_PROGRESS" | "FAILED";

export interface CandidateEvaluationView {
  key: string;
  record: CampaignEvaluationRecord;
  displayName: string;
  email: string;
  status: AnalyticsStatus;
  analyticsPercentage: number | null;
  submittedAt: FormattedTimestamp;
}

export interface CampaignMetrics {
  total: number;
  completed: number;
  pending: number;
  averageCompletion: number | null;
}

export type CampaignStatusFilter = "ALL" | AnalyticsStatus;
export type CampaignSortDirection = "asc" | "desc";

export interface CampaignTableOptions {
  search: string;
  status: CampaignStatusFilter;
  direction: CampaignSortDirection;
}
