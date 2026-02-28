import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FormPlayer from '@/components/FormPlayer/FormPlayer'

export default async function FormPage({ params }: { params: { token: string } }) {

    const { token } = params

    const form = await prisma.form.findFirst({
        where: {
            publicToken: token,
            isPublicOpen: true
        }
    })

    if (!form) {
        notFound()
    }

    const fields = form.fields as any[]

    return (
        <div className='"w-full py-5'>
            <FormPlayer fields={fields} />
        </div>
    )
}