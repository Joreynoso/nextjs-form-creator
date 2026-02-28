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

    // helpers
    const currentField = fields[step]
    const isLast = step === fields.length - 1

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
        setStep(prev => prev + 1)
    }

    function handleBack() {
        setError(null)
        setStep(prev => prev - 1)
    }

    function setValue(value: any) {
        setAnswers(prev => ({
            ...prev,
            [currentField.id]: value
        }))
    }

    // render return
    return (
        <>
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
        </>
    )
}