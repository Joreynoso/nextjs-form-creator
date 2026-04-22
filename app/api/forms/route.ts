import { NextResponse } from 'next/server'
import { getOrCreateDoctor } from '@/actions/doctors/sync'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// Import schema
import { CreateFormBodySchema } from '@/lib/schemas/form.schema'

// endpoint para crear formulario
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

    // Validar body
    const validation = CreateFormBodySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", message: validation.error.errors },
        { status: 400 }
      )
    }

    // Extraer datos
    const { name, description, fields } = validation.data

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