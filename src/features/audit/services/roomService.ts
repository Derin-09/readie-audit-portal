import { USE_MOCKS } from "../../../services/mockMode";
import { fetchRoomFromApi } from "./roomApi";
import { fetchRoomFromMock } from "./roomMock";

export const roomService = USE_MOCKS ? fetchRoomFromMock : fetchRoomFromApi;
