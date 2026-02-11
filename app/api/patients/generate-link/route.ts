import { NextResponse } from 'next/server'

export async function POST() {
    try {
        return NextResponse.json({ message: 'Enlace generado correctamente' })
    } catch (error) {
        console.error('Error generando enlace:', error)
        return NextResponse.json(
            { error: 'Error al generar enlace' },
            { status: 500 }
        )
    }
}
