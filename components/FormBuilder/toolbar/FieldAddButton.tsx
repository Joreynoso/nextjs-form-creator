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
            className="flex items-center gap-2.5 h-10 px-4 bg-primary/5 border border-primary/30 text-primary hover:-translate-y-[2px] hover:shadow-md hover:shadow-primary/30 transition-all duration-300 rounded-md"
        >
            <div className="opacity-100">
                {icon}
            </div>
            <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">{label}</span>
        </Button>
    )
}
