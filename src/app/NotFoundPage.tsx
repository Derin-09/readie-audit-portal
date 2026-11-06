import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { SUPPORTED_CAMPAIGN_IDS } from "../features/campaigns/constants";

export function NotFoundPage() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="The evaluation workspace route you requested does not exist. Return to a supported campaign to continue reviewing candidate evidence."
      action={
        <Link
          to={`/jobs/campaign/${SUPPORTED_CAMPAIGN_IDS[0]}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Return to Campaign {SUPPORTED_CAMPAIGN_IDS[0]}
        </Link>
      }
    />
  );
}
