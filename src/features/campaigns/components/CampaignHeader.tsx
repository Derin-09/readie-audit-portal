import { RefreshCw, ScanSearch } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { SupportedCampaignId } from "../constants";

interface CampaignHeaderProps {
  campaignId: SupportedCampaignId;
  jobTitle?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function CampaignHeader({
  campaignId,
  jobTitle,
  isRefreshing,
  onRefresh,
}: CampaignHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500">
          <ScanSearch aria-hidden="true" className="h-4 w-4" />
          <span>Campaign evaluation records</span>
          <span aria-hidden="true" className="text-slate-300">
            /
          </span>
          <span className="font-mono text-slate-600">#{campaignId}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Campaign {campaignId}
        </h1>
        <p className="mt-2 max-w-2xl text-sm md:text-base leading-6 text-slate-500">
          Review candidate assessment records, analytics progress and room-level
          evidence for this campaign.
          {jobTitle ? (
            <span className="mt-1 block text-slate-600">
              Assessment role:{" "}
              <span className="font-medium text-slate-800">{jobTitle}</span>
            </span>
          ) : null}
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="self-start"
      >
        <RefreshCw
          aria-hidden="true"
          className={isRefreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"}
        />
        {isRefreshing ? "Refreshing" : "Refresh data"}
      </Button>
    </div>
  );
}
