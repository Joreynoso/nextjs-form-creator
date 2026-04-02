import { FormWithSubmissions, FormField } from "@/types/form.types"
import { FormResponse, SubmissionStatusInfo } from "@/types/submission.types"
import { FormSubmission } from '@/lib/generated/prisma'
import SubmissionActions from "./SubmissionActions"

interface SubmissionCardProps {
    sub: FormSubmission
    form: FormWithSubmissions
    index: number
    status: SubmissionStatusInfo
    responses: FormResponse | null
    date: string
}   

const isCompleted = (label: string) => label === "✓ Completado"

export default function SubmissionCard({ sub, form, index, status, responses, date }: SubmissionCardProps) {
    const completed = isCompleted(status.label)
    const fields = (form.fields as unknown as FormField[]).map(f => ({ id: f.id, label: f.label }))

    // Solo los campos que tienen valor
    const filledFields = completed && responses
        ? fields.filter(f => {
            const v = responses[f.id]
            return v !== undefined && v !== null && v !== ''
        })
        : []
    return (
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden transition-shadow hover:shadow-md">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-muted/15">

                {/* Left: número + badge */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
                        #{form.submissions.length - index}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none shrink-0 ${status.class}`}>
                        {status.label}
                    </span>
                </div>

                {/* Right: fecha + acciones */}
                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                    <time className="hidden sm:block text-xs text-muted-foreground font-sans tabular-nums">
                        {date}
                    </time>
                    <SubmissionActions
                        canCopy={completed && !!responses}
                        responses={responses ?? {}}
                        fields={fields}
                        submissionId={sub.id}
                        formId={form.id}
                    />
                </div>
            </div>

            {/* ── Date (mobile only) ─────────────────────────────── */}
            <div className="sm:hidden px-4 pt-2.5 pb-0">
                <time className="text-xs text-muted-foreground font-sans tabular-nums">{date}</time>
            </div>

            {/* ── Body ───────────────────────────────────────────── */}
            {completed && responses && filledFields.length > 0 ? (
                <dl className="divide-y divide-border/20">
                    {filledFields.map(field => {
                        const value = responses[field.id]
                        const displayValue = Array.isArray(value) ? value.join(", ") : String(value)

                        return (
                            <div
                                key={field.id}
                                className="flex flex-col sm:grid sm:grid-cols-[minmax(120px,1fr)_2fr] gap-0.5 sm:gap-x-6 px-4 sm:px-5 py-4 transition-colors"
                            >
                                <dt className="text-sm text-muted-foreground font-sans font-normal truncate">
                                    {field.label}
                                </dt>
                                <dd className="text-sm text-foreground font-sans font-medium wrap-break-word">
                                    {displayValue}
                                </dd>
                            </div>
                        )
                    })}
                </dl>
            ) : (
                <p className="px-4 sm:px-5 py-4 text-sm text-muted-foreground font-sans italic">
                    {completed
                        ? "Esta respuesta no contiene campos con datos."
                        : "El paciente aún no ha completado este formulario."}
                </p>
            )}
        </div>
    )
}