import { useQuery } from "@tanstack/react-query";
import type { SupportedCampaignId } from "../constants";
import { campaignService } from "../services/campaignService";

export function useCampaign(campaignId: SupportedCampaignId) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: ({ signal }) => campaignService(campaignId, signal),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
