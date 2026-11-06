export function normalizePercentage(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.min(100, Math.max(0, value));
}

export function formatPercentage(value: number | null | undefined): string {
  const normalized = normalizePercentage(value);
  return normalized === null ? "Not available" : `${Math.round(normalized)}%`;
}

export function normalizeConfidence(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const percentage = value >= 0 && value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, percentage));
}

export function formatConfidence(value: number | null | undefined): string {
  const normalized = normalizeConfidence(value);
  return normalized === null ? "Not available" : `${Math.round(normalized)}%`;
}
