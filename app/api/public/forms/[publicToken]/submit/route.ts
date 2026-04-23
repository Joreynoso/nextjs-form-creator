import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(
  request: Request,
  context: { params: Promise<{ publicToken: string }> }
) {
  try {
    const { publicToken } = await context.params

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

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'Respuestas inválidas' }, { status: 400 })
    }

    // Crear y completar la submission en una sola operación atómica
    const submission = await prisma.formSubmission.create({
      data: {
        token: nanoid(),
        formId: form.id,
        doctorId: form.doctorId,
        responses,
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
