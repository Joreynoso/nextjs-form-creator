import { FormField } from "@/types/form.types"
import type { FieldValue, FormResponse } from "@/types/submission.types"

// Valida un solo campo (útil para el step-by-step en frontend)
export function validateField(field: FormField, value: FieldValue): boolean {
    if (!field.required) return true

    if (field.type === "checkbox") {
        return Array.isArray(value) && value.length > 0
    }

    return value !== undefined && value !== null && value !== ""
}

// Valida todos los campos simultáneamente (útil para el backend)
export function validateSubmission(fields: FormField[], responses: FormResponse): { isValid: boolean, errors: Record<string, string> } {
    const errors: Record<string, string> = {}
    let isValid = true

    for (const field of fields) {
        if (!validateField(field, responses[field.id])) {
            errors[field.id] = "Este campo es obligatorio"
            isValid = false
        }
    }

    return { isValid, errors }
}
