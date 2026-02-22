'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Página no encontrada</h1>
            <p className="text-lg text-muted-foreground mt-4 text-center">La página que estás buscando no existe o ha sido movida.</p>
            <Link href="/" className="mt-4">
                <Button variant="default">Volver al inicio</Button>
            </Link>
        </div>
    )
}