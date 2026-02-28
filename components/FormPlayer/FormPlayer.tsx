'use client'

import { useState } from "react"
import { Button } from '../ui/button'
import FieldRenderer from "./FieldRenderer"
import { FormField } from "@/@types/types"

interface FormPlayerProps {
    fields: FormField[]
}

export default function FormPlayer({ fields }: FormPlayerProps) {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [error, setError] = useState<string | null>(null)
    const [isFinished, setIsFinished] = useState(false)

    // guards
    if (!fields || fields.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Este formulario aún no tiene preguntas
            </div>
        )
    }

    if (isFinished) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-2">Gracias 🙌</h2>
                <p>Formulario finalizado</p>
            </div>
        )
    }

    const currentField = fields?.[step]
    const isLast = step === fields.length - 1

    if (!currentField) {
        return null
    }

    function validate(field: FormField) {
        if (!field.required) return true

        const value = answers[field.id]

        if (field.type === "checkbox") {
            return Array.isArray(value) && value.length > 0
        }

        return value !== undefined && value !== ""
    }

    function handleNext() {
        if (!validate(currentField)) {
            setError("Este campo es obligatorio")
            return
        }

        setError(null)

        // protección final
        if (step + 1 >= fields.length) {
            setIsFinished(true)
            return
        }

        setStep(prev => prev + 1)
    }

    function handleBack() {
        setError(null)
        setStep(prev => Math.max(prev - 1, 0))
    }

    function setValue(value: any) {
        setAnswers(prev => ({
            ...prev,
            [currentField.id]: value
        }))
    }

    return (
        <div className="max-w-xl mx-auto">

            <h2 className="text-2xl font-serif mb-6">
                {currentField.label}
            </h2>

            <FieldRenderer
                field={currentField}
                value={answers[currentField.id]}
                onChange={setValue}
            />

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
            )}

            <div className="flex justify-between mt-8">
                {step > 0 && (
                    <Button variant="ghost" onClick={handleBack}>
                        Atrás
                    </Button>
                )}

                <Button onClick={handleNext}>
                    {isLast ? "Finalizar" : "Siguiente"}
                </Button>
            </div>

        </div>
    )
}