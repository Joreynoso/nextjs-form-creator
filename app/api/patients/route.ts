import { NextResponse } from 'next/server'

export async function GET() {
    try {
        return NextResponse.json({ message: 'Listado de pacientes obtenido' })
    } catch (error) {
        console.error('Error obteniendo pacientes:', error)
        return NextResponse.json(
            { error: 'Error al obtener pacientes' },
            { status: 500 }
        )
    }
}

export async function POST() {
    try {
        return NextResponse.json({ message: 'Paciente creado correctamente' })
    } catch (error) {
        console.error('Error creando paciente:', error)
        return NextResponse.json(
            { error: 'Error al crear paciente' },
            { status: 500 }
        )
    }
}
