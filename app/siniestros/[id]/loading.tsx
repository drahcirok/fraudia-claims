import { Skeleton } from "@/components/ui/skeleton";

export default function SiniestroLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3 w-full">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <Skeleton className="h-4 w-36 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 rounded-full w-full" />
              <Skeleton className="h-3 rounded-full w-4/5" />
              <Skeleton className="h-3 rounded-full w-11/12" />
              <Skeleton className="h-3 rounded-full w-3/4" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <Skeleton className="h-4 w-28 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
