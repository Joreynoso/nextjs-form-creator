import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { auth } from '@clerk/nextjs/server'
import { getOrCreateDoctor } from '@/actions/doctors/sync'
import { createFormTool } from './tools/createForm.tool'


// crear cliente groq
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// definir el modelo
const MODEL = 'llama-3.1-8b-instant'

// prompt del sistema
const SYSTEM_PROMPT = `Eres un asistente para médicos y doctores. Tienes acceso a tools para gestionar formularios clínicos.
REGLAS:
- Cuando el doctor quiera crear un formulario, SIEMPRE usa la tool createForm. Nunca lo hagas en texto.
- Extrae el título y descripción del mensaje del doctor de forma concisa.
- Confirma al doctor cuando una acción se completó exitosamente.`

// endpoint de chat
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await getOrCreateDoctor()

    const { messages } = await req.json()

    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      tools: [createFormTool],
      tool_choice: 'required',
    })

    const responseMessage = response.choices[0].message
    const toolCalls = responseMessage.tool_calls

    console.log('toolCalls:', JSON.stringify(toolCalls, null, 2))
    console.log('finish_reason:', response.choices[0].finish_reason)

    if (toolCalls) {
      messages.push(responseMessage)

      for (const toolCall of toolCalls) {
        const args = JSON.parse(toolCall.function.arguments)
        console.log('ejecutando tool con args:', args)
        const result = await createFormTool.execute(args)
        console.log('resultado de la tool:', result)

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      const finalResponse = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.2,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      })

      return NextResponse.json({
        message: finalResponse.choices[0].message.content
      })
    }

    return NextResponse.json({
      message: responseMessage.content
    })

  } catch (error) {
    console.error('Error en /api/chat:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}