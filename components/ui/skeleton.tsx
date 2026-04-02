
import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-full bg-muted/20", className)}
            {...props}
        />
    )
}

export { Skeleton }
