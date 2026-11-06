import type {
  AnalyticsCompleted,
  Decision,
  Disposition,
  RiskLevel,
  VideoQuality,
} from "../types/room";
import { formatStatusLabel } from "./statusTone";

export function formatDispositionLabel(
  disposition: Disposition | null | undefined,
): string {
  switch (
    typeof disposition === "string" ? disposition.toUpperCase() : ""
  ) {
    case "PASS_WITH_LOW_RISK":
      return "Pass with low risk";
    case "REVIEW_REQUIRED":
      return "Review required";
    case "FAIL":
      return "Fail";
    default:
      return formatStatusLabel(disposition);
  }
}

export function formatDecisionLabel(
  decision: Decision | null | undefined,
): string {
  switch (typeof decision === "string" ? decision.toUpperCase() : "") {
    case "PASS":
      return "Pass";
    case "FAIL":
      return "Fail";
    case "INCONCLUSIVE":
      return "Inconclusive";
    default:
      return formatStatusLabel(decision);
  }
}

export function formatRiskLabel(risk: RiskLevel | null | undefined): string {
  return formatStatusLabel(risk);
}

export function formatVideoQualityLabel(
  quality: VideoQuality | null | undefined,
): string {
  return formatStatusLabel(quality);
}

export function formatAnalyticsCompletionLabel(
  value: AnalyticsCompleted | null | undefined,
): string {
  switch (typeof value === "string" ? value.toUpperCase() : "") {
    case "Y":
      return "Analytics complete";
    case "N":
      return "Analytics pending";
    default:
      return formatStatusLabel(value);
  }
}

export function formatRecordingStatusLabel(
  status: string | null | undefined,
): string {
  return formatStatusLabel(status);
}
