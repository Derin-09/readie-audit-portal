import { Skeleton } from "../../../components/ui/Skeleton";

export function CampaignSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading campaign records">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl  bg-white p-5 "
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-7 w-14" />
              </div>
              <Skeleton className="h-9 w-9" />
            </div>
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
        ))}
      </div>

      <div className="rounded-xl  bg-white p-4 ">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full sm:w-96" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl  bg-white ">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <Skeleton className="h-3 w-full max-w-xl" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-5"
            >
              <div className="flex items-center gap-3 sm:col-span-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-48" />
                </div>
              </div>
              <Skeleton className="h-3 w-40 sm:mt-2" />
              <Skeleton className="h-3 w-24 sm:mt-2" />
              <Skeleton className="h-3 w-28 sm:mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
