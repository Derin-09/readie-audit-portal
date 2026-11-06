import {
  MessageSquareText,
  ScanFace,
  ShieldExclamationPoint,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";
import { getRoomPath } from "../../../utils/roomUrl";
import {
  ROOM_TABS,
  ROOM_TAB_LABELS,
  type RoomTab,
} from "../types/roomTab";

interface RoomTabsProps {
  roomName: string;
  activeTab: RoomTab;
}

const tabIcons: Record<RoomTab, LucideIcon> = {
  transcript: MessageSquareText,
  identity: ScanFace,
  integrity: ShieldExclamationPoint,
};

export function RoomTabs({ roomName, activeTab }: RoomTabsProps) {
  return (
    <nav
      aria-label="Room evaluation sections"
      className="border-b border-slate-200"
    >
      <div className="scrollbar-thin flex gap-1 overflow-x-auto">
        {ROOM_TABS.map((tab) => {
          const Icon = tabIcons[tab];
          const isActive = tab === activeTab;

          return (
            <Link
              key={tab}
              to={`${getRoomPath(roomName)}?tab=${tab}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-500",
                isActive
                  ? "border-slate-950 text-slate-950"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800",
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-slate-700" : "text-slate-400",
                )}
              />
              {ROOM_TAB_LABELS[tab]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
