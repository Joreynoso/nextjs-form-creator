import { Skeleton } from "@/components/ui/skeleton"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function DashboardLoading() {
    return (
        <div className="w-full py-5">
            {/* ── Breadcrumb ── */}
            <Breadcrumb className="mb-5">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-12 opacity-60" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-20 opacity-60" />
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* ── Header ── */}
            <div className="w-full mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                    <Skeleton className="h-6 w-80 opacity-60 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-44 rounded-full opacity-60" />
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton 
                        key={`stat-${i}`}
                        className="h-[160px] w-full rounded-2xl border border-border/40 opacity-60 shadow-sm"
                    />
                ))}
            </div>

            {/* ── Forms Grid ── */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton 
                        key={`form-${i}`}
                        className="h-[187px] w-full rounded-2xl border border-border/40 opacity-60 shadow-sm"
                    />
                ))}
            </div>
        </div>
    )
}
