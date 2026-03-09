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
import EmptySubmission from "@/components/Submissions/EmptySubmission"
import SubmissionActions from "@/components/Submissions/SubmissionActions"
import { expireOldSubmissions } from "@/actions/forms/forms"
import getSubmissionStatus from '@/lib/utils'

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

    //  return {
    // success: true,
    // count: expired.count
    // }

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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
                            {completedCount} completada{completedCount !== 1 ? "s" : ""}
                        </span>
                        <span>de {form.submissions.length} enviada{form.submissions.length !== 1 ? "s" : ""}</span>
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
                        const responses = sub.responses as Record<string, any> | null
                        const date = new Date(sub.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                        })

                        return (
                            <div    
                                key={sub.id}
                                className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-muted/40">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-muted-foreground">
                                            #{form.submissions.length - index}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.class}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <time className="text-xs text-muted-foreground font-sans">{date}</time>
                                        <SubmissionActions
                                            canCopy={status.label === "✓ Completado" && !!responses}
                                            responses={responses ?? {}}
                                            fields={(form.fields as any[]).map(f => ({ id: f.id, label: f.label }))}
                                            submissionId={sub.id}
                                            formId={form.id}
                                        />
                                    </div>
                                </div>

                                {/* Card body */}
                                {status.label === "✓ Completado" && responses ? (
                                    <dl className="divide-y divide-border/60">
                                        {(form.fields as any[]).map(field => {
                                            const value = responses[field.id]
                                            if (value === undefined || value === null || value === "") return null

                                            const displayValue = Array.isArray(value)
                                                ? value.join(", ")
                                                : String(value)

                                            return (
                                                <div key={field.id} className="grid grid-cols-[1fr_2fr] gap-x-6 px-5 py-3 hover:bg-accent/30 transition-colors">
                                                    <dt className="text-sm text-muted-foreground font-sans self-start pt-px truncate">
                                                        {field.label}
                                                    </dt>
                                                    <dd className="text-sm text-foreground font-sans">
                                                        {displayValue}
                                                    </dd>
                                                </div>
                                            )
                                        })}
                                    </dl>
                                ) : (
                                    <p className="px-5 py-4 text-sm text-muted-foreground font-sans italic">
                                        El paciente aún no ha completado este formulario.
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}