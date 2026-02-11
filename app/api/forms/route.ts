import { NextResponse, NextRequest } from 'next/server'
import { getOrCreateDoctor } from '@/lib/get-or-create-doctor'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    return NextResponse.json({message: 'Formularios obtenidos correctamente'})
  } catch (error) {
    console.error('Error obteniendo formularios:', error)
    return NextResponse.json(
      { error: 'Error al obtener formularios' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    return NextResponse.json({message: 'Formulario creado correctamente'})
  } catch (error) {
    console.error('Error creando formulario:', error)
    return NextResponse.json(
      { error: 'Error al crear formulario' },
      { status: 500 }
    )
  }
}