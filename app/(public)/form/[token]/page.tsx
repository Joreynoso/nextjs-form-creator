import { prisma } from '@/lib/prisma'
import FormPlayer from '@/components/FormPlayer/FormPlayer'

export default async function FormPage(
    { params }: { params: Promise<{ token: string }> }
) {

    const { token } = await params

    const form = await prisma.form.findFirst({
        where: {
            publicToken: token
        }
    })

    if (!form) {
        return <div>Formulario no encontrado</div>
    }

    return (
        <div className="w-full py-5">
            <FormPlayer fields={form.fields as any} />
        </div>
    )
}