'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Form, FormField } from "@/types/form.types"
import { FormResponse, SubmissionStatusInfo } from "@/types/submission.types"
import { FormSubmission } from '@/lib/generated/prisma'
import SubmissionActions from "./SubmissionActions"

interface SubmissionCardProps {
    sub: FormSubmission
    form: Form
    index: number
    totalSubmissions: number
    status: SubmissionStatusInfo
    responses: FormResponse | null
    date: string
}   

const isCompleted = (label: string) => label === "✓ Completado"

export default function SubmissionCard({ sub, form, index, totalSubmissions, status, responses, date }: SubmissionCardProps) {
    const [isOpen, setIsOpen] = useState(false)
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
        <div className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">

            {/* ── Header ─────────────────────────────────────────── */}
            <div 
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors select-none"
                onClick={() => setIsOpen(!isOpen)}
            >

                {/* Left: chevron + número + badge */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <button className="p-0.5 hover:bg-muted rounded-md text-muted-foreground transition-colors">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <span className="font-mono text-xs text-foreground tabular-nums shrink-0 font-medium">
                        {totalSubmissions > 0 ? `#${totalSubmissions - index}` : ""}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none shrink-0 ${status.class}`}>
                        {status.label}
                    </span>
                </div>

                {/* Right: fecha + acciones */}
                <div 
                    className="flex items-center gap-1 sm:gap-2 ml-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <time className="hidden sm:block text-xs text-foreground font-sans tabular-nums font-medium">
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
            <div className="sm:hidden px-4 pt-2.5 pb-2 border-b border-border/10">
                <time className="text-xs text-foreground font-sans tabular-nums font-medium">{date}</time>
            </div>

            {/* ── Body ───────────────────────────────────────────── */}
            {isOpen && (
                <div className="bg-card/50 hover:bg-card backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-top-2 fade-in">
                    {completed && responses && filledFields.length > 0 ? (
                        <dl className="divide-y divide-border/20">
                            {filledFields.map(field => {
                                const value = responses[field.id]
                                const displayValue = Array.isArray(value) ? value.join(", ") : String(value)

                                return (
                                    <div
                                        key={field.id}
                                        className="flex flex-col sm:grid sm:grid-cols-[minmax(120px,1fr)_2fr] gap-0.5 sm:gap-x-6 px-4 sm:px-5 py-4 transition-colors hover:bg-muted/5"
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
                                : "El usuario aún no ha completado este formulario."}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}