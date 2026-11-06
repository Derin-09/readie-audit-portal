import { useQuery } from "@tanstack/react-query";
import { roomService } from "../services/roomService";

export function useRoom(roomName: string | undefined) {
  return useQuery({
    queryKey: ["room", roomName ?? ""],
    queryFn: ({ signal }) => {
      if (!roomName) {
        return Promise.resolve([]);
      }

      return roomService(roomName, signal);
    },
    enabled: Boolean(roomName),
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
