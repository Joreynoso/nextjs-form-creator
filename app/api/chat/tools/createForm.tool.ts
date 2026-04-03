import { createForm } from '@/actions/forms/crud'

export const createFormTool = {
  type: 'function' as const,
  function: {
    name: 'createForm',
    description: `Crea un formulario vacío con título y descripción. 
    Úsala cuando el doctor quiera crear un nuevo formulario. El título 
    no debe superar las 5 palabaras, lo mismo para la descripción.`,
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título del formulario',
          maxLength: 70
        },
        description: {
          type: 'string',
          description: 'Descripción breve del formulario',
          maxLength: 70
        }
      },
      required: ['title', 'description'],
      additionalProperties: false
    }
  },

  // ejecutar la tool
  execute: async ({ title, description }: { title: string, description: string }) => {
    return await createForm(title, description)
  }
}