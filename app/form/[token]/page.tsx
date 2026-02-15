import { notFound } from 'next/navigation'

async function getForm(token: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/public/submissions/${token}`,
        { cache: "no-store" }
    )
    if (!res.ok) return null
    return res.json()
}

export default async function FormPage({ params }: { params: Promise<{ token: string }> }) {

    // get token from params
    const { token } = await params

    // get form from token
    const form = await getForm(token)

    // console
    console.log('token', token)
    console.log('form', form)

    if (!form) {
        notFound()
    }

    console.log('formulario obtenido desde el token', form)

    // render return
    return (
        <main className="w-full min-h-screen flex justify-center items-center">
            <h1 className="text-2xl font-bold mb-2">{form.name}</h1>
            <p className="mb-6 text-muted-foreground">
                {form.description}
            </p>

            {/* render form fields Client component */}
            <div className="w-full max-w-2xl mx-auto">
                {form.fields.map((field: any) => (
                    <div key={field.id} className="mb-4">
                        <label className="block text-sm font-medium mb-2">{field.label}</label>
                        <input type="text" className="w-full px-3 py-2 border border-border rounded-md" />
                    </div>
                ))}
            </div>
        </main>
    )
}