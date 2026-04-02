import { Loader2 } from "lucide-react"

export function Spinner({ className }: { className?: string }) {
    return (
        <div className="flex flex-1 h-[60vh] w-full flex-col items-center justify-center animate-in fade-in duration-500">
            <Loader2 className={`h-10 w-10 animate-spin text-primary/40 ${className}`} strokeWidth={1.5} />
        </div>
    )
}
