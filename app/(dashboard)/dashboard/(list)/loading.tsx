import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="w-full py-5">
      {/* Breadcrumb skeleton matches Breadcrumb component structure */}
      <div className="flex items-center gap-2 mb-5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-2" /> {/* separator */}
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header skeleton matches page.tsx layout */}
      <div className="w-full mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <Skeleton className="h-5 w-64 mb-4 sm:mb-0" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Grid of form cards skeletons matches FormCard.tsx styles */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between border border-border/40 rounded-lg bg-card p-6 min-h-[180px] shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start pr-8 relative">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-6 w-6 rounded-md absolute top-[-4px] right-[-12px]" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="flex gap-2 pt-1 items-center">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

