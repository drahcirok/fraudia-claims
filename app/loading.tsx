import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-52" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-white/[0.08] bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="mt-1 h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monto + filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Card className="border-white/[0.08] bg-white/[0.03] sm:flex-none">
          <CardHeader className="flex flex-row items-center gap-3 py-3 px-4">
            <Skeleton className="h-4 w-4 rounded" />
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-1 h-5 w-20" />
            </div>
          </CardHeader>
        </Card>
        <Skeleton className="h-7 w-72 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <Card className="border-white/[0.08] bg-white/[0.03]">
        <CardHeader className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-3 border-b border-white/[0.04]"
            >
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24 hidden md:block" />
              <Skeleton className="h-3 w-16 ml-auto hidden sm:block" />
              <Skeleton className="h-5 w-10 ml-auto" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-4 ml-auto" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="border-white/[0.08] bg-white/[0.03] lg:col-span-3">
          <CardHeader className="pb-3 px-5 pt-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="border-white/[0.08] bg-white/[0.03] lg:col-span-2">
          <CardHeader className="pb-3 px-5 pt-4 border-b border-white/[0.06]">
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent className="p-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.04]"
              >
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-8 ml-auto" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
