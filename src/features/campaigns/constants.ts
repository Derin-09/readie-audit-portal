export const SUPPORTED_CAMPAIGN_IDS = [119, 120, 122, 123] as const;

export type SupportedCampaignId = (typeof SUPPORTED_CAMPAIGN_IDS)[number];

export function parseCampaignId(
  value: string | undefined,
): SupportedCampaignId | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return null;
  }

  const match = SUPPORTED_CAMPAIGN_IDS.find((campaignId) => campaignId === parsed);
  return match ?? null;
}
