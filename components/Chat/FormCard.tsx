'use client'

import { ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { saveGeneratedForm } from "@/actions/forms/crud"

type Form = {
    id: string
    name: string
    description?: string
    editUrl: string
}

type GeneratedField = {
    id: string
    type: string
    label: string
    options?: string[]
    required?: boolean
    placeholder?: string
}

type ToolResult = {
    name: string
    data: {
        forms?: Form[]
        title?: string
        description?: string
        fields?: GeneratedField[]
    }
}

type FormCardProps = {
    toolResult: ToolResult
}

// mapa de types para mejor lectura
const fieldTypeLabels: Record<string, string> = {
    text: 'Texto corto',
    number: 'Número',
    textarea: 'Texto largo',
    select: 'Selección única',
    radio: 'Opción única',
    checkbox: 'Selección múltiple',
    section: 'Sección'
}

export default function FormCard({ toolResult }: FormCardProps) {

    const [saving, setSaving] = useState(false)
    const [savedForm, setSavedForm] = useState<Form | null>(null)
    const [cancelled, setCancelled] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const handleSave = async () => {
        if (!toolResult.data.title || !toolResult.data.fields) return
        setSaving(true)
        setSaveError(null)
        try {
            const result = await saveGeneratedForm(
                toolResult.data.title,
                toolResult.data.description ?? '',
                toolResult.data.fields as any,
            )
            if (result.success && result.form) {
                setSavedForm(result.form)
            } else {
                setSaveError('No se pudo guardar el formulario. El contenido generado no es compatible. Intentá generarlo nuevamente.')
            }
        } catch (error) {
            console.error('Error al guardar:', error)
            setSaveError('Ocurrió un error inesperado. Por favor, intentá de nuevo.')
        } finally {
            setSaving(false)
        }
    }

    // findForm
    if (toolResult.name === 'findForm' && toolResult.data.forms?.length) {
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

    // generateForm
    if (toolResult.name === 'generateForm' && toolResult.data.fields?.length) {

        if (cancelled) {
            return (
                <div className="mt-2 max-w-[90%] sm:max-w-[75%] rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-3 flex items-center justify-between text-sm text-destructive/80">
                    <span>Generación de formulario descartada.</span>
                </div>
            )
        }

        return (
            <div className="mt-2 max-w-[90%] sm:max-w-[75%] w-full rounded-xl border border-primary/40 bg-primary/5 p-4 flex flex-col gap-3">


                {/* Header */}
                <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-primary">{toolResult.data.title}</span>
                        <span className="text-xs text-muted-foreground">{toolResult.data.description}</span>
                    </div>
                </div>

                {/* Lista de preguntas */}
                <div className="flex flex-col gap-1.5 border-t border-primary/10 pt-3">
                    {toolResult.data.fields.map((field, idx) => (
                        <div key={field.id} className="flex items-start gap-2 text-xs">
                            <span className="text-primary/50 shrink-0 w-4">{idx + 1}.</span>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-foreground/80">{field.label}</span>
                                <span className="text-muted-foreground/60">
                                    {fieldTypeLabels[field.type] ?? field.type}
                                    {field.options ? ` · ${field.options.join(', ')}` : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Guardado exitoso */}
                {savedForm && (
                    <Link
                        href={savedForm.editUrl}
                        target="_blank"
                        className="relative group rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors px-5 py-3 flex flex-col gap-0.5"
                    >
                        <ExternalLink className="absolute top-3 right-3 w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-primary">{savedForm.name}</span>
                        <span className="text-xs text-muted-foreground">Formulario guardado correctamente</span>
                    </Link>
                )}

                {/* Error al guardar */}
                {saveError && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive/80">
                        <span className="shrink-0 mt-0.5">⚠️</span>
                        <span>{saveError}</span>
                    </div>
                )}

                {/* Botón guardar */}
                {!savedForm && !cancelled && (
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                            {saving ? 'Guardando...' : 'Guardar formulario'}
                        </button>
                        <button
                            onClick={() => setCancelled(true)}
                            disabled={saving}
                            className="rounded-full border border-border/50 bg-card text-foreground px-4 py-1.5 text-xs font-medium hover:bg-muted/30 transition-colors disabled:opacity-40"
                        >
                            Desechar
                        </button>
                    </div>
                )}

            </div>
        )
    }

    return null
}