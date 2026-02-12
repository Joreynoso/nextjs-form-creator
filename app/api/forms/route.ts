import { NextResponse, NextRequest } from 'next/server'
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    return NextResponse.json({ message: 'Formularios obtenidos correctamente' })
  } catch (error) {
    console.error('Error obteniendo formularios:', error)
    return NextResponse.json(
      { error: 'Error al obtener formularios' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    //  Verificar sesión
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    // Obtener doctor
    const doctor = await getOrCreateDoctor()

    // Leer body
    const body = await req.json()

    const { name, description, fields } = body

    // Crear formulario
    const form = await prisma.form.create({
      data: {
        doctorId: doctor.id,
        name,
        description,
        fields
      }
    })

    // Respuesta
    return NextResponse.json(form, { status: 201 })

  } catch (error) {
    console.error("POST /api/forms error:", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}