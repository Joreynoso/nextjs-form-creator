import { ExternalLink } from "lucide-react"
import Link from "next/link"

type Form = {
    id: string
    name: string
    description?: string
    editUrl: string
}

type ToolResult = {
    name: string
    data: {
        forms?: Form[]
    }
}

type FormCardProps = {
    toolResult: ToolResult
}

export default function FormCard({ toolResult }: FormCardProps) {

    if (toolResult.name !== 'findForm' || !toolResult.data.forms?.length) return null

    return (
        <div className="flex flex-col gap-2 mt-2 max-w-[90%] sm:max-w-[75%] w-full">
            {toolResult.data.forms.map((form) => (
                <Link
                    key={form.id}
                    href={form.editUrl}
                    target="_blank"
                    className="relative group rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors px-5 py-3 flex flex-col gap-0.5"
                >
                    <ExternalLink className="absolute top-3 right-3 w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-primary">{form.name}</span>
                </Link>
            ))}
        </div>
    )
}