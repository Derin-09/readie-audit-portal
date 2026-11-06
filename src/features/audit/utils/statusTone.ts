import type { StatusTone } from "../../../utils/tone";
import type {
  Decision,
  Disposition,
  RiskLevel,
  RecordingStatus,
  VideoQuality,
} from "../types/room";

export function getRiskTone(risk: RiskLevel | null | undefined): StatusTone {
  switch (typeof risk === "string" ? risk.toUpperCase() : "") {
    case "LOW":
      return "positive";
    case "MEDIUM":
      return "caution";
    case "HIGH":
      return "danger";
    default:
      return "neutral";
  }
}

export function getDecisionTone(
  decision: Decision | null | undefined,
): StatusTone {
  switch (typeof decision === "string" ? decision.toUpperCase() : "") {
    case "PASS":
      return "positive";
    case "FAIL":
      return "danger";
    case "INCONCLUSIVE":
      return "caution";
    default:
      return "neutral";
  }
}

export function getDispositionTone(
  disposition: Disposition | null | undefined,
): StatusTone {
  switch (
    typeof disposition === "string" ? disposition.toUpperCase() : ""
  ) {
    case "PASS_WITH_LOW_RISK":
      return "positive";
    case "REVIEW_REQUIRED":
      return "caution";
    case "FAIL":
      return "danger";
    default:
      return "neutral";
  }
}

export function getVideoQualityTone(
  quality: VideoQuality | null | undefined,
): StatusTone {
  switch (typeof quality === "string" ? quality.toUpperCase() : "") {
    case "GOOD":
      return "positive";
    case "POOR":
      return "danger";
    case "UNKNOWN":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getRecordingStatusTone(
  status: RecordingStatus | null | undefined,
): StatusTone {
  return typeof status === "string" && status.toUpperCase() === "PERSISTED"
    ? "positive"
    : "caution";
}

export function formatStatusLabel(value: string | null | undefined): string {
  if (!value || !value.trim()) {
    return "Not available";
  }

  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
