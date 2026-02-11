import { NextResponse } from 'next/server'

interface Props {
    params: {
        token: string
    }
}

export async function GET(req: Request, { params }: Props) {
    try {
        const { token } = params
        return NextResponse.json({ message: `Formulario público obtenido con token: ${token}` })
    } catch (error) {
        console.error('Error obteniendo formulario público:', error)
        return NextResponse.json(
            { error: 'Error al obtener formulario público' },
            { status: 500 }
        )
    }
}
