import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StatisticCard({
    title,
    value,
    description,
    icon: Icon,
    trend
}: {
    title: string,
    value: string,
    description: string,
    icon: LucideIcon,
    trend?: {
        label: string,
        isPositive: boolean
    }
}) {
    return (
        <div className="relative flex flex-col justify-between border border-border/40 rounded-2xl bg-linear-to-br from-card to-muted/10 p-6 min-h-[160px] shadow-sm hover:shadow-md transition-[box-shadow,background-color,border-color] duration-300 backdrop-blur-sm">

            <div className="space-y-3">
                <div className="flex items-start justify-between">
                    <h3 className="text-[0.65rem] font-medium text-muted-foreground/80 uppercase tracking-[0.12em] flex items-center gap-1.5">
                        <Icon className="size-3 opacity-70" />
                        {title}
                    </h3>

                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            trend.isPositive
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        )}>
                            {trend.isPositive ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                            {trend.label}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-[2.5rem] font-serif font-semibold text-foreground tracking-tight leading-none mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {value}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/10 flex items-center justify-between font-variant">
                <span className="text-muted-foreground/40 text-[0.65rem] font-medium uppercase tracking-[0.12em]">
                    Datos actualizados
                </span>
                <TrendingUp className="size-3 text-primary/40" />
            </div>
        </div>
    )
}