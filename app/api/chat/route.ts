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
- NUNCA menciones los nombres técnicos de tus tools (como createForm, generateForm, o findForm) en tus respuestas al usuario. Si te preguntan qué puedes hacer, explícalo SIEMPRE en lenguaje natural (ej. "Puedo ayudarte a crear formularios vacíos, generar formularios con preguntas, o buscar formularios").
- Cuando el doctor quiera crear un formulario VACÍO o en blanco sin preguntas, usa la tool createForm.
- Cuando el doctor quiera crear o generar un formulario CON PREGUNTAS, sobre una temática, o con un número específico de preguntas, SIEMPRE usa la tool generateForm. NUNCA uses createForm para esto.
- Cuando el doctor quiera buscar, listar o encontrar formularios, SIEMPRE usa la tool findForm.
- Para findForm: extrae SOLO la palabra clave relevante, sin artículos ni preposiciones.
- Extrae el título y descripción de forma concisa. Máximo 10 palabras para el título, 15 para la descripción.
- Después de usar generateForm, confirma que se generó un PREVIEW para revisar, NO que se creó el formulario.
- Responde siempre en texto plano, sin markdown, sin asteriscos, sin numeración especial.

ANÁLISIS POST-TOOL:
- Cuando el usuario responde después de ver un resultado de tool, analiza su reacción:
  * Si expresa satisfacción ("perfecto", "me gusta", "gracias", "estoy de acuerdo", etc.) → confirma la acción, ofrece ayuda adicional
  * Si expresa insatisfacción ("no me gusta", "cámbialo", "está mal", "le faltan cosas", etc.) → pregunta qué ajustar específicamente
  * Si hace una nueva solicitud o pide cambios específicos → procesa como nueva tarea usando tools si es necesario
  * Si asks for clarification → explica el resultado claramente
- Usa el contexto de la tool ejecutada previamente para dar respuestas coherentes.`

// endpoint de chat
export async function POST(req: Request) {
  try {

    // verificar session id del usuario
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // obtener doctor
    const doctor = await getOrCreateDoctor()

    // obtener mensajes del body
    const { messages } = await req.json()

    // detectar si hay un toolResult previo en el historial
    const lastToolMsg = messages.findLast((msg: FrontendMessage) => 
      msg.role === 'assistant' && msg.toolResult
    )

    // crear contexto dinámico para el modelo
    const contextPrompt = lastToolMsg 
      ? `\n\nCONTEXTO: La última vez ejecutaste la tool "${lastToolMsg.toolResult.name}" y el usuario acaba de ver el resultado. Antes de usar otra tool, analiza si el usuario está satisfecho o si necesita ajustes. Solo usa tools si el usuario hace una NUEVA solicitud clara.`
      : ''

    // limpiar historial: conservar solo mensajes del usuario, o del asistente con contenido real
    // esto previene el "tool loop" al no mandar historiales fantasma ni json gigantes de tools anteriores
    const cleanMessages = messages
      .filter((msg: FrontendMessage) => 
        msg.role === 'user' || 
        (msg.role === 'assistant' && msg.content && msg.content.trim().length > 0)
      )
      .map(({ role, content }: FrontendMessage) => ({
        role,
        content
      }))

    // llamar a groq con contexto adicional si hay tool previa
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [{ role: 'system', content: SYSTEM_PROMPT + contextPrompt }, ...cleanMessages],
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
        console.log('tool args completos:', JSON.stringify(args, null, 2))
        const executor = toolExecutors[toolCall.function.name]
        const result = await executor(args, doctor.id)

        toolResults.push({ name: toolCall.function.name, data: result })

        cleanMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      // DEVUELVE resultado directamente SIN segunda llamada al modelo
      // El modelo analizar el mensaje del usuario en la próxima interacción
      const initialResponse = responseMessage.content || 'Aquí está el resultado. ¿Estás conforme?'
      
      return NextResponse.json({
        message: initialResponse,
        toolResult: toolResults[0] ?? null,
        needsUserConfirmation: true
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