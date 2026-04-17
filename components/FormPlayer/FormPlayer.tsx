'use client'

import { useState } from "react"
import { Button } from '../ui/button'
import FieldRenderer from "./FieldRenderer"
import { FormField } from "@/types/form.types"
import { validateField } from "@/lib/validators/submission.validator"
import { ArrowRight, ArrowLeft, Check, PartyPopper } from "lucide-react"
import { toast } from "sonner"


interface FormPlayerProps {
    fields: FormField[]
    submissionToken: string
}

type asnwerValue = string | number | boolean | string[] | undefined | null

export default function FormPlayer({ fields, submissionToken }: FormPlayerProps) {

    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, asnwerValue>>({})
    const [error, setError] = useState<string | null>(null)
    const [isFinished, setIsFinished] = useState(false)
    const [loading, setLoading] = useState(false)

    // guard: sin preguntas
    if (!fields || fields.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Este formulario aún no tiene preguntas
            </div>
        )
    }

    // guard: terminado 
    if (isFinished) {
        return (
            <div className="max-w-xl mx-auto px-6 min-h-[80vh] flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                    <PartyPopper className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-serif text-foreground/90 mb-3">
                    ¡Gracias por completar el formulario!
                </h2>
                <p className="text-muted-foreground text-lg max-w-sm">
                    Tus respuestas han sido enviadas correctamente. Ya puedes cerrar esta ventana.
                </p>
            </div>
        )
    }

    const currentField = fields[step]
    const isLast = step === fields.length - 1

    if (!currentField) return null

    async function handleNext() {

        if (loading) return

        if (!validateField(currentField, answers[currentField.id])) {
            setError("Este campo es obligatorio")
            return
        }

        setError(null)

        const isLastStep = step + 1 >= fields.length

        // avanzar
        if (!isLastStep) {
            setStep(prev => prev + 1)
            return
        }

        // 🚀 SUBMIT FINAL
        try {

            setLoading(true)

            const res = await fetch(`/api/public/submissions/${submissionToken}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    responses: answers
                })
            })

            if (!res.ok) {
                throw new Error()
            }

            setIsFinished(true)

        } catch {
            setError("No se pudo enviar el formulario")
            toast.error('Error al enviar el formulario')
        } finally {
            setLoading(false)
        }
    }

    function handleBack() {
        if (loading) return
        setError(null)
        setStep(prev => Math.max(prev - 1, 0))
    }

    function setValue(value: asnwerValue) {
        setAnswers(prev => ({
            ...prev,
            [currentField.id]: value
        }))
    }

    return (
        <div className="max-w-xl mx-auto px-6 py-10 min-h-[80vh] flex flex-col justify-center">

            <div key={step} className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
                <div className="flex items-start gap-3 mb-6">
                    <span className="flex items-center justify-center min-w-6 h-6 bg-primary text-primary-foreground text-[10px] rounded-sm mt-1.5 font-mono">
                        {step + 1}
                    </span>
                    <h2 className="text-2xl font-serif text-foreground/90 leading-snug">
                        {currentField.label}
                        {currentField.required && <span className="text-primary ml-1">*</span>}
                    </h2>
                </div>

                <div className="pl-9">
                    <FieldRenderer
                        field={currentField}
                        value={answers[currentField.id]}
                        onChange={setValue}
                    />

                    {error && (
                        <p className="text-destructive text-sm mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <span className="w-1 h-1 rounded-full bg-destructive" />
                            {error}
                        </p>
                    )}

                    <div className="flex items-center gap-3 mt-10">
                        {step > 0 && (
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={handleBack}
                                disabled={loading}
                                className="text-foreground/80 hover:text-foreground px-6 py-5 text-base rounded-md transition-all active:scale-95 border border-transparent hover:border-border hover:bg-accent/40"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
                            </Button>
                        )}

                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base rounded-md transition-all active:scale-95 shadow-md shadow-primary/10"
                        >
                            {loading ? (
                                "Enviando..."
                            ) : isLast ? (
                                <span className="flex items-center gap-2">Finalizar <Check className="w-4 h-4" /></span>
                            ) : (
                                <span className="flex items-center gap-2">Siguiente <ArrowRight className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="fixed bottom-0 left-0 w-full h-0.5 bg-border/20">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${((step + 1) / fields.length) * 100}%` }}
                />
            </div>

        </div>
    )
}