export function getRoomPath(roomName: string): string {
  return `/jobs/room/${encodeURIComponent(roomName)}`;
}

export function getRoomApiPath(roomName: string): string {
  return `/roomsHACKATHON/${encodeURIComponent(roomName)}`;
}