import { z } from 'zod'

const FieldValueSchema = z.union([
  z.string().max(5000, 'El valor excede los 5000 caracteres'),
  z.number(),
  z.boolean(),
  z.array(z.string().max(5000)).max(100, 'Demasiadas opciones'),
  z.null()
])

export const SubmissionResponsesSchema = z.record(
  z.string().min(1),
  FieldValueSchema
)

export type SubmissionResponsesInput = z.infer<typeof SubmissionResponsesSchema>
