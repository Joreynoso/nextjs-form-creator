import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"

// import breacumb
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Props {
    params: Promise<{ formId: string }>
}

export default async function FormDetailPage({ params }: Props) {

    const { userId } = await auth()

    if (!userId) {
        redirect("/")
    }

    const { formId } = await params

    const doctor = await getOrCreateDoctor()

    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
            submissions: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!form || form.doctorId !== doctor.id) {
        notFound()
    }

    return (
        <div className="w-full py-5">
            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{form.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full mb-5">
                <p className="text-base text-muted-foreground leading-relaxed">
                    Aquí puedes ver las respuestas de tu formulario {form.name}.
                </p>
            </div>

            {/* {form.submissions.map(sub => (
                <div key={sub.id} className="border rounded-lg p-4">

                    {sub.status === "completed" && sub.responses && (
                        <table className="w-full text-sm">
                            <tbody>
                                {(form.fields as any[]).map(field => {
                                    const value = (sub.responses as any)[field.id]

                                    if (!value) return null

                                    return (
                                        <tr key={field.id} className="border-t">
                                            <td className="py-2 pr-4 font-medium text-muted-foreground">
                                                {field.label}
                                            </td>
                                            <td className="py-2">
                                                {String(value)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}

                </div>
            ))} */}
        </div>
    )
}