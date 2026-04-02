import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateDoctor } from "@/actions/doctors/sync"

// import breacumb
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import EmptySubmission from "@/components/Submissions/EmptySubmission"
import { expireOldSubmissions } from "@/actions/forms/submissions"
import getSubmissionStatus from '@/lib/utils'
import SubmissionCard from '@/components/Submissions/SubmissionCard'
import { FormResponse } from "@/types/submission.types"

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

    // Expirar submissions viejas de ESTE form
    await expireOldSubmissions(formId)

    // Cargar el form sin basura
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

    const completedCount = form.submissions.filter(s => s.status === "completed").length

    return (
        <div className="w-full py-5">

            {/* Breadcrumb */}
            <Breadcrumb className='mb-6'>
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

            {/* Header con nombre + contador */}
            <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-serif text-2xl text-foreground">{form.name}</h1>
                    {form.description && (
                        <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
                    )}
                </div>
                {form.submissions.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[0.8rem] font-sans text-muted-foreground">
                        <span>{completedCount} completada{completedCount !== 1 ? "s" : ""}</span>
                        <span>de</span>
                        <span>{form.submissions.length} enviada{form.submissions.length !== 1 ? "s" : ""}</span>
                    </div>
                )}
            </div>

            {/* Submissions o estado vacío */}
            {form.submissions.length === 0 ? (
                <EmptySubmission />
            ) : (
                <div className="flex flex-col gap-4">
                    {form.submissions.map((sub, index) => {
                        const status = getSubmissionStatus(sub.status)
                        const responses = sub.responses as FormResponse | null
                        const date = new Date(sub.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                        })

                        return (
                            <SubmissionCard
                                key={sub.id}
                                sub={sub}
                                form={form}
                                index={index}
                                status={status}
                                responses={responses}
                                date={date}
                            />  
                        )
                    })}
                </div>
            )}
        </div>
    )
}