import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="w-full py-5">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-5">
        <Skeleton className="h-4 w-12" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header skeleton */}
      <div className="w-full mb-5 flex items-center justify-between">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Grid of form cards skeletons */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-xl bg-card p-5 min-h-[160px] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>

              <div className="flex gap-2 pt-1">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
