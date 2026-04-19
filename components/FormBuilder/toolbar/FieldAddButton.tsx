import { Button } from '@/components/ui/button'

interface FieldAddButtonProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

export function FieldAddButton({ icon, label, onClick }: FieldAddButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="flex items-center gap-2.5 h-10 px-4 bg-muted/10 border border-border/10 hover:border-primary/30 hover:bg-primary/5 text-muted-foreground/70 hover:text-primary transition-all duration-300 rounded-md group shadow-xs"
        >
            <div className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {icon}
            </div>
            <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">{label}</span>
        </Button>
    )
}
