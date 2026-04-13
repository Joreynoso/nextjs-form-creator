import { v4 as uuidv4 } from 'uuid'
import { FormField } from '@/types/form.types'

export const generateFormTool = {
  type: 'function' as const,
  function: {
    name: 'generateForm',
    description: 'Genera una lista de preguntas para un formulario clínico. DEBES generar tú mismo los campos en el parámetro fields basándote en el topic y questionCount. NO guarda nada, solo genera un preview para que el doctor revise.', parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título del formulario',
          maxLength: 60
        },
        description: {
          type: 'string',
          description: 'Descripción breve del formulario',
          maxLength: 100
        },
        topic: {
          type: 'string',
          description: 'Temática o especialidad médica del formulario',
          maxLength: 100
        },
        questionCount: {
          type: 'number',
          description: 'Cantidad de preguntas a generar, entre 5 y 20',
        },
        fields: {
          type: 'array',
          description: 'OBLIGATORIO: Generá vos mismo este array con las preguntas del formulario. Usá variedad de tipos: text, number, textarea, select, radio, checkbox, section.',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'section'],
                description: 'Tipo de campo'
              },
              label: {
                type: 'string',
                description: 'Texto de la pregunta o etiqueta del campo'
              },
              placeholder: {
                type: 'string',
                description: 'Texto de ayuda dentro del campo, solo para text, number, textarea'
              },
              options: {
                type: 'array',
                items: { type: 'string' },
                description: 'Opciones para select, radio o checkbox'
              },
              required: {
                type: 'boolean',
                description: 'Si el campo es obligatorio'
              }
            },
            required: ['type', 'label'],
            additionalProperties: false
          }
        }
      },
      required: ['title', 'description', 'topic', 'fields'],
      additionalProperties: false
    }
  },
  execute: async ({ title, description, topic, fields }: {
    title: string
    description: string
    topic: string

    // omit sirve para decir que no se espera el id
    fields: Omit<FormField, 'id'>[]
  }) => {
    // agregar id único a cada campo
    const fieldsWithIds: FormField[] = fields.map(field => ({
      ...field,
      id: uuidv4()
    }))

    return {
      success: true,
      preview: true,
      title,
      description,
      topic,
      fields: fieldsWithIds
    }
  }
}