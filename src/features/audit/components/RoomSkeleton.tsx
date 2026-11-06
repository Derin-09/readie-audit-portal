import { Skeleton } from "../../../components/ui/Skeleton";

export function RoomSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading evaluation room">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-40" />
              <Skeleton className="h-7 w-56 max-w-full" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-slate-50 px-4 py-3">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="mt-2 h-5 w-24" />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 p-5">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="mt-2 h-3 w-full max-w-lg" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-52" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-3 w-64" />
        <div className="mt-6 space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[5.5rem_2.5rem_1fr]">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
