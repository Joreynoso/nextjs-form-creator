import { z } from 'zod'

// definicion de esquemas de validacion para los tipos de campos del formulario
export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'section']),
  label: z.string(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  allowOther: z.boolean().optional(),
  required: z.boolean().optional(),
  showIf: z.object({
    fieldId: z.string(),
    operator: z.enum(['equals', 'includes', 'notEmpty']),
    value: z.union([z.string(), z.array(z.string())])
  }).optional()
})

// validacion de un array de campos
export const FormFieldsSchema = z.array(FormFieldSchema)

// exportamos el tipo de dato
export type FormFieldInput = z.infer<typeof FormFieldSchema>

// schema para el body de la peticion
export const CreateFormBodySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(300).optional(),
  fields: FormFieldsSchema
})

// exportamos el tipo de dato
export type CreateFormBodyInput = z.infer<typeof CreateFormBodySchema>
