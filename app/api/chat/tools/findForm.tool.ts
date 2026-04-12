import { findForm } from '@/actions/forms/crud'

export const findFormTool = {
  type: 'function' as const,
  function: {
    name: 'findForm',
    description: 'Busca formularios por nombre o temática. Úsala cuando el doctor quiera encontrar un formulario existente o quiera listar sus formularios',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Término de búsqueda opcional. Si no se proporciona, devuelve todos los formularios.',
          maxLength: 120
        }
      },
      required: [],
      additionalProperties: false
    }
  },
  execute: async ({ query, doctorId }: { query?: string, doctorId: string }) => {
    return await findForm(doctorId, query)
  }
}