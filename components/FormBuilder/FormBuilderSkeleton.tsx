export default function FormBuilderSkeleton() {
    return (
        <div className="space-y-6 w-full py-5 animate-pulse">

            {/* isDirty bar skeleton */}
            <div className="w-full bg-card border border-border/40 shadow-sm p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/60" />
                    <div className="h-3.5 w-28 rounded bg-muted/60" />
                </div>
                <div className="h-9 w-24 rounded-md bg-secondary/60" />
            </div>

            {/* name & description skeleton */}
            <div className="flex flex-col p-6 gap-4 border border-border/40 rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted/50" />
                    <div className="h-5 w-2/3 rounded bg-muted/60" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted/40" />
                    <div className="h-4 w-1/2 rounded bg-muted/40" />
                </div>
            </div>

            {/* toolbar skeleton */}
            <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center px-1 gap-4">
                    <div className="h-2.5 w-20 rounded bg-muted/40" />
                    <div className="h-px flex-1 bg-border/20" />
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-9 w-24 rounded-md bg-secondary/40"
                        />
                    ))}
                </div>
            </div>

            {/* field cards skeleton */}
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border/40 rounded-lg p-5 shadow-sm space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-1/3 rounded bg-muted/50" />
                            <div className="flex gap-2">
                                <div className="h-7 w-7 rounded bg-muted/40" />
                                <div className="h-7 w-7 rounded bg-muted/40" />
                            </div>
                        </div>
                        <div className="h-10 w-full rounded-md bg-muted/30" />
                    </div>
                ))}
            </div>

        </div>
    )
}
