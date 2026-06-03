import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { SubmissionResponsesSchema } from '@/lib/schemas/submission.schema'
import { rateLimit, getClientIp } from '@/lib/rate-limiter'

export async function POST(
  request: Request,
  context: { params: Promise<{ publicToken: string }> }
) {
  try {
    const { publicToken } = await context.params

    // rate limiting: 5 requests por minuto por IP
    const ip = getClientIp(request)
    const limit = rateLimit(`submit:${publicToken}:${ip}`, 5, 60 * 1000)
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetIn / 1000)) } }
      )
    }

    // Buscar el formulario por publicToken
    const form = await prisma.form.findUnique({
      where: { publicToken }
    })

    if (!form) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
    }

    if (!form.isActive) {
      return NextResponse.json({ error: 'Formulario desactivado' }, { status: 403 })
    }

    if (!form.isPublicOpen) {
      return NextResponse.json({ error: 'Formulario cerrado' }, { status: 403 })
    }

    // Leer y validar body
    const body = await request.json()
    const { responses } = body

    const parsed = SubmissionResponsesSchema.safeParse(responses)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Respuestas inválidas', details: parsed.error.issues },
        { status: 400 }
      )
    }

    // Crear y completar la submission en una sola operación atómica
    const submission = await prisma.formSubmission.create({
      data: {
        token: nanoid(),
        formId: form.id,
        doctorId: form.doctorId,
        responses: parsed.data,
        status: 'completed',
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Formulario enviado correctamente',
      status: submission.status
    })

  } catch (error) {
    console.error('POST /api/public/forms/[publicToken]/submit error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
