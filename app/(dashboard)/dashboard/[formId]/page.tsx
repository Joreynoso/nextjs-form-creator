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
import { Form } from "@/types/form.types"
import StatisticCard from "@/components/Dashboard/StatisticCard"
import { Send, CheckCircle2, Clock, XCircle } from "lucide-react"

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

    // Cargar el form (sin todas las submissions de golpe para optimizar)
    const form = await prisma.form.findUnique({
        where: { id: formId }
    })

    if (!form || form.doctorId !== doctor.id) {
        notFound()
    }

    // Estadísticas del formulario en particular
    const [totalSub, completedSub, pendingSub, expiredSub] = await Promise.all([
        prisma.formSubmission.count({ where: { formId } }),
        prisma.formSubmission.count({ where: { formId, status: "completed" } }),
        prisma.formSubmission.count({ where: { formId, status: "pending" } }),
        prisma.formSubmission.count({ where: { formId, status: "expired" } }),
    ])

    // Cargar las submissions reales para la lista (paginado o limitado si fuera necesario, por ahora mantenemos la lista)
    const submissions = await prisma.formSubmission.findMany({
        where: { formId },
        orderBy: { createdAt: "desc" }
    })

    // render return
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

            {/* Estadísticas Visuales del Formulario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatisticCard
                    title="Total de Envíos"
                    value={totalSub.toString()}
                    description="Intentos totales recibidos"
                    icon={Send}
                />
                <StatisticCard
                    title="Completados"
                    value={completedSub.toString()}
                    description="Respuestas finalizadas"
                    icon={CheckCircle2}
                />
                <StatisticCard
                    title="Pendientes"
                    value={pendingSub.toString()}
                    description="En proceso de llenado"
                    icon={Clock}
                />
                <StatisticCard
                    title="Expirados"
                    value={expiredSub.toString()}
                    description="No completados a tiempo"
                    icon={XCircle}
                />
            </div>

            {/* Submissions o estado vacío */}
            {submissions.length === 0 ? (
                <EmptySubmission />
            ) : (
                <div className="flex flex-col gap-4">
                    {submissions.map((sub, index) => {
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
                                form={form as unknown as Form}
                                index={index}
                                totalSubmissions={totalSub}
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