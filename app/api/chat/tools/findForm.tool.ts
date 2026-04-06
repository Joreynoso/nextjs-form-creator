import { findForm } from '@/actions/forms/crud'

export const findFormTool = {
  type: 'function' as const,
  function: {
    name: 'findForm',
    description: 'Busca formularios por nombre o temática. Úsala cuando el doctor quiera encontrar un formulario existente.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Término de búsqueda, puede ser el nombre o temática del formulario',
          maxLength: 60
        }
      },
      required: ['query'],
      additionalProperties: false
    }
  },
  execute: async ({ query, doctorId }: { query: string, doctorId: string }) => {
    return await findForm(query, doctorId)
  }
}