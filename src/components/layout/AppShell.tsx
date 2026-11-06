import {
  CircleDot,
  Database,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { SUPPORTED_CAMPAIGN_IDS } from "../../features/campaigns/constants";
import { USE_MOCKS } from "../../services/mockMode";
import { cn } from "../../utils/cn";

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-100">
     

      <div className="flex w-full  flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
          <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-4 lg:py-6">
            <div className="mb-3 flex items-center gap-2 px-1">
              <img loading="lazy" decoding="async" src="/readie-ai-logo.png" className="w-6 h-6"/>
              <h2 className="text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Readie AI
              </h2>
            </div>
            <nav
              aria-label="Campaign navigation"
              className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {SUPPORTED_CAMPAIGN_IDS.map((campaignId) => (
                <NavLink
                  key={campaignId}
                  to={`/jobs/campaign/${campaignId}`}
                  className={({ isActive }) =>
                    cn(
                      "group flex min-w-fit items-center justify-between gap-4 rounded-lg border px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500",
                      isActive
                        ? "border-slate-300 bg-slate-950 text-white shadow-sm"
                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="font-medium">Campaign {campaignId}</span>
                      <span
                        className={cn(
                          "hidden font-mono text-[10px] lg:inline",
                          isActive ? "text-slate-400" : "text-slate-400",
                        )}
                      >
                        #{campaignId}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto hidden pt-8 lg:block">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Review standard
                  </p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Automated signals support human review. Identity, transcript
                  and proctoring evidence should be examined together before a
                  final decision.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 max-w-[1600px] mx-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
