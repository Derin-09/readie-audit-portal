export const ROOM_TABS = ["transcript", "identity", "integrity"] as const;

export type RoomTab = (typeof ROOM_TABS)[number];

export const DEFAULT_ROOM_TAB: RoomTab = "transcript";

export const ROOM_TAB_LABELS: Record<RoomTab, string> = {
  transcript: "Transcript",
  identity: "Identity Verification",
  integrity: "Integrity & Proctoring Audit",
};

export function parseRoomTab(value: string | null): RoomTab {
  const match = ROOM_TABS.find((tab) => tab === value);
  return match ?? DEFAULT_ROOM_TAB;
}
