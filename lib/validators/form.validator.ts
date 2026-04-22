import { FormFieldsSchema } from '@/lib/schemas/form.schema'
import { ZodError } from 'zod'

// funcion para validar los campos del formulario
export function validateFormFields(fields: unknown): {
  success: boolean
  data?: any
  error?: string
} {
  try {
    const validated = FormFieldsSchema.parse(fields)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: `Campos inválidos: ${error.issues.map(e => e.message).join(', ')}`
      }
    }
    return { success: false, error: 'Error de validación desconocido' }
  }
}