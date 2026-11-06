import { USE_MOCKS } from "../../../services/mockMode";
import { fetchCampaignFromApi } from "./campaignApi";
import { fetchCampaignFromMock } from "./campaignMock";

export const campaignService = USE_MOCKS
  ? fetchCampaignFromMock
  : fetchCampaignFromApi;
