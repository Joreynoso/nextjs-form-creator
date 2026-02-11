import { NextResponse } from 'next/server'

interface Props {
    params: {
        token: string
    }
}

export async function POST(req: Request, { params }: Props) {
    try {
        const { token } = params
        return NextResponse.json({ message: `Formulario enviado correctamente con token: ${token}` })
    } catch (error) {
        console.error('Error enviando formulario:', error)
        return NextResponse.json(
            { error: 'Error al enviar formulario' },
            { status: 500 }
        )
    }
}
