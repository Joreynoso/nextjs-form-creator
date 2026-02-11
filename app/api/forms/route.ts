import { NextResponse, NextRequest } from 'next/server'
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    console.log('obteniendo doctor...')
    const doctor = await getOrCreateDoctor()

    console.log('obteniendo datos del formulario...')
    const { name, description, fields } = await req.json()

    console.log('creando formulario...')
    const form = await prisma.form.create({
      data: {
        doctorId: doctor.id,
        name,
        description,
        fields
      }
    })

    console.log('formulario creado...')
    return NextResponse.json(form)
  } catch (error) {
    console.error('Error creando formulario:', error)
    return NextResponse.json(
      { error: 'Error al crear formulario' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const doctor = await getOrCreateDoctor()

    const forms = await prisma.form.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error obteniendo formularios:', error)
    return NextResponse.json(
      { error: 'Error al obtener formularios' },
      { status: 500 }
    )
  }
}