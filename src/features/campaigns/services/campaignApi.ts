import { apiClient } from "../../../services/apiClient";
import type { CampaignEvaluationResponse } from "../types/campaign";

export async function fetchCampaignFromApi(
  campaignId: number,
  signal?: AbortSignal,
): Promise<CampaignEvaluationResponse> {
  const response = await apiClient.get<CampaignEvaluationResponse>(
    `/campaignHACKATHON/${campaignId}`,
    { signal },
  );

  if (!Array.isArray(response.data)) {
    throw new Error(
      "The campaign evaluation service returned an unexpected response format.",
    );
  }

  return response.data;
}
