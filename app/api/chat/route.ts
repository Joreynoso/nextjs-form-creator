import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getOrCreateDoctor } from '@/actions/doctors/sync'
import { tools, toolExecutors } from './tools'  // ← único import de tools

// instanciar groq
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// definir el modelo
const MODEL = 'llama-3.3-70b-versatile'

type FrontendMessage = {
  role: string
  content: string
  toolResult?: {
    name: string
    data: unknown
  }
}

// prompt del sistema
const SYSTEM_PROMPT = `Eres un asistente para médicos y doctores. Tienes acceso a tools para gestionar formularios clínicos.
REGLAS:
- Cuando el doctor quiera crear un formulario VACÍO o en blanco sin preguntas, usa la tool createForm.
- Cuando el doctor quiera crear o generar un formulario CON PREGUNTAS, sobre una temática, o con un número específico de preguntas, SIEMPRE usa la tool generateForm. NUNCA uses createForm para esto.
- Cuando el doctor quiera buscar, listar o encontrar formularios, SIEMPRE usa la tool findForm.
- Para findForm: extrae SOLO la palabra clave relevante, sin artículos ni preposiciones.
- Extrae el título y descripción de forma concisa. Máximo 10 palabras para el título, 15 para la descripción.
- Después de usar generateForm, confirma que se generó un PREVIEW para revisar, NO que se creó el formulario.
- Responde siempre en texto plano, sin markdown, sin asteriscos, sin numeración especial.
- REGLA CRÍTICA: NUNCA menciones los nombres técnicos de tus herramientas (como createForm, generateForm, findForm) al hablar con el usuario. Si te preguntan qué puedes hacer o qué herramientas tienes, responde siempre usando lenguaje natural y descriptivo (ej. "Puedo crear un formulario vacío, generar uno con preguntas basadas en un tema, o buscar formularios que ya hayas creado").`


// endpoint de chat
export async function POST(req: Request) {
  try {

    // verificar session id del usuario
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // obtener doctor
    const doctor = await getOrCreateDoctor()  // ← guardamos doctor

    // obtener mensajes del body
    const { messages } = await req.json()

    // limpiar propiedades que Groq no entiende
    const cleanMessages = messages.map(({ role, content }: FrontendMessage) => ({
      role,
      content
    }))

    // llamar a groq
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...cleanMessages],
      tools,
      tool_choice: 'auto',
    })

    // obtener respuesta
    const responseMessage = response.choices[0].message
    const toolCalls = responseMessage.tool_calls

    // verificar si hay tools
    if (toolCalls) {
      cleanMessages.push(responseMessage)

      const toolResults: { name: string, data: any }[] = []

      // ejecutar tools
      for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments)
        console.log('tool args completos:', JSON.stringify(args, null, 2))  // ← agregá esto
        const executor = toolExecutors[toolCall.function.name]  // ← enrutamiento automático
        const result = await executor(args, doctor.id)

        toolResults.push({ name: toolCall.function.name, data: result })

        // agregar tool result al historial
        cleanMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      // llamar a groq de nuevo
      const finalResponse = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.2,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...cleanMessages],
      })

      // devolver respuesta final
      return NextResponse.json({
        message: finalResponse.choices[0].message.content,
        toolResult: toolResults[0] ?? null
      })
    }


    // devolver respuesta normal
    return NextResponse.json({
      message: responseMessage.content
    })

  } catch (error) {
    console.error('Error en /api/chat:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}