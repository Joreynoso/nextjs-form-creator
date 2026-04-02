import { Skeleton } from "@/components/ui/skeleton"

export default function FormBuilderSkeleton() {
    return (
        <div className="w-full py-5 space-y-6">

            {/* ── Status Bar ── */}
            <div className="flex items-center justify-between gap-4 mb-8">
                {/* Unified Badge Style - No custom backgrounds, just skeleton weight */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/20">
                    <Skeleton className="size-3 rounded-full opacity-60" />
                    <Skeleton className="h-2.5 w-16 opacity-60" />
                </div>
                {/* Main Action Button */}
                <Skeleton className="h-10 w-44 rounded-full opacity-60" />
            </div>

            {/* ── Editorial Header ── */}
            <div className="flex flex-col gap-4 py-8 border-b border-border/10 mb-8">
                {/* Main Title - Standard opacity-60 */}
                <Skeleton className="h-12 w-2/3 opacity-60 rounded-lg" />
                <div className="border-l-2 border-primary/10 pl-6">
                    {/* Description - Same standard opacity-60 */}
                    <Skeleton className="h-8 w-full opacity-60 rounded-md" />
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex flex-col gap-4 py-8">
                <div className="flex items-center gap-4">
                    {/* Toolbar Label - Standard opacity-60 */}
                    <Skeleton className="h-2.5 w-24 opacity-60 uppercase tracking-widest" />
                    <div className="h-px flex-1 bg-border/20" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Add Field Buttons - All opacity-60 */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton 
                            key={i}
                            className="h-10 w-32 rounded-full border border-border/30 opacity-60"
                        />
                    ))}
                </div>
            </div>

            {/* ── Field Cards List ── */}
            <div className="space-y-4">
                {/* Field Cards - Match precisely with opacity-60 */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton 
                        key={i}
                        className="h-[280px] w-full rounded-[2rem] border border-border/40 opacity-60 shadow-sm"
                    />
                ))}
            </div>

        </div>
    )
}
