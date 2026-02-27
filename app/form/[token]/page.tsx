import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

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

            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{form.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='flex flex-col'>
                <p className='text-base text-muted-foreground leading-relaxed'>
                    {form.name}
                </p>
            </div>

            <form className="space-y-4">
                {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium">
                            {field.label}
                            {field.required && " *"}
                        </label>

                        {field.type === "text" && (
                            <input
                                type="text"
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 border border-border rounded-md"
                            />
                        )}

                        {field.type === "textarea" && (
                            <textarea
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 border border-border rounded-md"
                            />
                        )}

                        {field.type === "number" && (
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-border rounded-md"
                            />
                        )}
                    </div>
                ))}
            </form>

        </div>
    )
}