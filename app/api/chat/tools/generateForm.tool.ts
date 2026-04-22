import { v4 as uuidv4 } from 'uuid'
import Groq from 'groq-sdk'
import { FormField } from '@/types/form.types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const generateFormTool = {
  type: 'function' as const,
  function: {
    name: 'generateForm',
    description: 'Genera un formulario clínico con preguntas basándose en una temática. NO guarda nada, solo genera un preview para que el doctor revise.',
    parameters: {
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
          description: 'Temática o especialidad del formulario',
          maxLength: 100
        },
        questionCount: {
          type: 'number',
          description: 'Cantidad de preguntas interactivas a generar entre 5 y 20. Los campos "section" son separadores adicionales y NO cuentan.',
        }
      },
      required: ['title', 'description', 'topic', 'questionCount'],
      additionalProperties: false
    }
  },

  execute: async ({ title, description, topic, questionCount }: {
    title: string
    description: string
    topic: string
    questionCount: number
  }) => {

    // llamada dedicada a Groq para generar los campos
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Eres un experto en formularios clínicos. Generás arrays de preguntas en formato JSON.
Tipos disponibles: text, number, textarea, select, radio, checkbox, section.
- "section" es un separador visual entre grupos, NO cuenta como pregunta interactiva.
- select, radio y checkbox DEBEN tener un array "options" con al menos 2 opciones.
- Respondé SOLO con JSON válido, sin texto adicional.`
        },
        {
          role: 'user',
          content: `Generá exactamente ${questionCount} preguntas interactivas sobre "${topic}".
Usá variedad de tipos. Si hay múltiples subtemas, separalos con campos "section".
Respondé con este formato exacto:
{
  "fields": [
    { "type": "section", "label": "Datos personales" },
    { "type": "text", "label": "Nombre completo", "required": true },
    { "type": "number", "label": "Edad", "required": false },
    { "type": "select", "label": "Objetivo principal", "options": ["Perder peso", "Ganar masa", "Mantener peso"], "required": true },
    { "type": "textarea", "label": "Observaciones adicionales", "required": false }
  ]
}`
        }
      ]
    })

    const content = response.choices[0].message.content ?? '{}'
    let parsed: { fields?: unknown[] }
    try {
      parsed = JSON.parse(content)
    } catch {
      return { success: false, error: 'La respuesta de la IA no pudo procesarse. Intentá de nuevo.' }
    }

    const rawFields: Omit<FormField, 'id'>[] = (parsed.fields ?? []) as Omit<FormField, 'id'>[]

    const fieldsWithIds: FormField[] = rawFields.map(field => ({
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