import { MOCK_CAMPAIGNS } from "../../../mocks/campaignFixtures";
import { waitForMockResponse } from "../../../mocks/mockDelay";
import type { CampaignEvaluationResponse } from "../types/campaign";

export async function fetchCampaignFromMock(
  campaignId: number,
  signal?: AbortSignal,
): Promise<CampaignEvaluationResponse> {
  await waitForMockResponse(420, signal);
  return MOCK_CAMPAIGNS.filter(
    (record) => record.campaignId === campaignId,
  );
}
