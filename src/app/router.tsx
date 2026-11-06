import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { RoomPage } from "../features/audit/pages/RoomPage";
import { SUPPORTED_CAMPAIGN_IDS } from "../features/campaigns/constants";
import { CampaignPage } from "../features/campaigns/pages/CampaignPage";
import { NotFoundPage } from "./NotFoundPage";

const defaultCampaignPath = `/jobs/campaign/${SUPPORTED_CAMPAIGN_IDS[0]}`;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to={defaultCampaignPath} replace />,
      },
      {
        path: "jobs",
        element: <Navigate to={defaultCampaignPath} replace />,
      },
      {
        path: "jobs/campaign/:campaignId",
        element: <CampaignPage />,
      },
      {
        path: "jobs/room/:roomName",
        element: <RoomPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
