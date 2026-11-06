import { apiClient } from "../../../services/apiClient";
import { getRoomApiPath } from "../../../utils/roomUrl";
import type { CampaignRecordingsResponse } from "../types/room";

export async function fetchRoomFromApi(
  roomName: string,
  signal?: AbortSignal,
): Promise<CampaignRecordingsResponse> {
  const response = await apiClient.get<CampaignRecordingsResponse>(
    getRoomApiPath(roomName),
    { signal },
  );

  if (!Array.isArray(response.data)) {
    throw new Error(
      "The room evaluation service returned an unexpected response format.",
    );
  }

  return response.data;
}
