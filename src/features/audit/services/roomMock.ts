import { waitForMockResponse } from "../../../mocks/mockDelay";
import { MOCK_ROOM_RECORDINGS } from "../../../mocks/roomFixtures";
import type { CampaignRecordingsResponse } from "../types/room";

export async function fetchRoomFromMock(
  roomName: string,
  signal?: AbortSignal,
): Promise<CampaignRecordingsResponse> {
  await waitForMockResponse(480, signal);
  return MOCK_ROOM_RECORDINGS.filter(
    (recording) => recording.roomName === roomName,
  );
}
