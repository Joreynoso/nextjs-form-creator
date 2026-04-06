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

// prompt del sistema
const SYSTEM_PROMPT = `Eres un asistente para médicos y doctores. Tienes acceso a tools para gestionar formularios clínicos.
REGLAS:
- Cuando el doctor quiera crear un formulario, SIEMPRE usa la tool createForm. Nunca lo hagas en texto.
- Cuando el doctor quiera buscar un formulario, SIEMPRE usa la tool findForm.
- Extrae el título y descripción del mensaje del doctor de forma concisa.
- Confirma al doctor cuando una acción se completó exitosamente.`

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

    // llamar a groq
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      tools,
      tool_choice: 'auto',
    })

    // obtener respuesta
    const responseMessage = response.choices[0].message
    const toolCalls = responseMessage.tool_calls

    // verificar si hay tools
    if (toolCalls) {
      messages.push(responseMessage)

      const toolResults: { name: string, data: any }[] = []

      // ejecutar tools
      for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments)
        const executor = toolExecutors[toolCall.function.name]  // ← enrutamiento automático
        const result = await executor(args, doctor.id)

        toolResults.push({ name: toolCall.function.name, data: result })

        // agregar tool result al historial
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      // llamar a groq de nuevo
      const finalResponse = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.2,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
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