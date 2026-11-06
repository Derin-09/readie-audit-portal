import { ArrowLeft, SearchX } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { RoomIdentifier } from "../../../components/ui/RoomIdentifier";
import { getApiErrorMessage, getApiErrorTitle } from "../../../utils/apiError";
import {
  SUPPORTED_CAMPAIGN_IDS,
  type SupportedCampaignId,
} from "../../campaigns/constants";
import { IdentityPanel } from "../components/IdentityPanel";
import { IntegrityPanel } from "../components/IntegrityPanel";
import { RoomHeader } from "../components/RoomHeader";
import { RoomSkeleton } from "../components/RoomSkeleton";
import { RoomTabs } from "../components/RoomTabs";
import { TranscriptPanel } from "../components/TranscriptPanel";
import { useRoom } from "../hooks/useRoom";
import type { CampaignRecording } from "../types/room";
import {
  parseRoomTab,
  ROOM_TAB_LABELS,
  type RoomTab,
} from "../types/roomTab";
import { getPrimaryRecording } from "../utils/recording";

function resolveCampaignId(campaignId: number | undefined): SupportedCampaignId {
  return (
    SUPPORTED_CAMPAIGN_IDS.find((supportedId) => supportedId === campaignId) ??
    SUPPORTED_CAMPAIGN_IDS[0]
  );
}

function BackToCampaign({ campaignId }: { campaignId: SupportedCampaignId }) {
  return (
    <Link
      to={`/jobs/campaign/${campaignId}`}
      className="inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
    >
      <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
      Back to Campaign {campaignId}
    </Link>
  );
}

function renderTab(activeTab: RoomTab, recording: CampaignRecording) {
  if (activeTab === "identity") {
    return <IdentityPanel recording={recording} />;
  }

  if (activeTab === "integrity") {
    return <IntegrityPanel recording={recording} />;
  }

  return <TranscriptPanel recording={recording} />;
}

export function RoomPage() {
  const { roomName } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = parseRoomTab(searchParams.get("tab"));
  const roomQuery = useRoom(roomName);
  const recordings = roomQuery.data ?? [];
  const primaryRecording = getPrimaryRecording(recordings);
  const campaignId = resolveCampaignId(primaryRecording?.campaignId);

  if (!roomName) {
    return (
      <EmptyState
        icon={SearchX}
        title="Room not provided"
        description="The evaluation room URL does not contain a room identifier."
      />
    );
  }

  if (roomQuery.isPending) {
    return (
      <div className="space-y-5">
        <BackToCampaign campaignId={campaignId} />
        <RoomSkeleton />
      </div>
    );
  }

  if (roomQuery.isError) {
    return (
      <div className="space-y-5">
        <BackToCampaign campaignId={campaignId} />
        <ErrorState
          title={getApiErrorTitle(roomQuery.error)}
          description={getApiErrorMessage(roomQuery.error)}
          onRetry={() => {
            void roomQuery.refetch();
          }}
          isRetrying={roomQuery.isFetching}
        />
      </div>
    );
  }

  if (!primaryRecording) {
    return (
      <div className="space-y-4">
        <BackToCampaign campaignId={campaignId} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
            Requested room
          </p>
          <RoomIdentifier value={roomName} wrap className="mt-1.5 text-slate-700" />
        </div>
        <EmptyState
          icon={SearchX}
          title="No recording found"
          description="The room endpoint returned no recording artifacts for this room identifier. The recording may not exist yet, or the identifier may be incomplete."
          action={<BackToCampaign campaignId={campaignId} />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BackToCampaign campaignId={campaignId} />
      <RoomHeader
        recording={primaryRecording}
        recordingsCount={recordings.length}
      />
      <RoomTabs roomName={roomName} activeTab={activeTab} />
      <section
        id={`room-panel-${activeTab}`}
        aria-label={ROOM_TAB_LABELS[activeTab]}
      >
        {renderTab(activeTab, primaryRecording)}
      </section>
    </div>
  );
}
