import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
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

const PAGE_SIZE = 10

interface Props {
    params: Promise<{ formId: string }>
    searchParams: Promise<{ page?: string }>
}

export default async function FormDetailPage({ params, searchParams }: Props) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/")
    }

    const { formId } = await params
    const { page } = await searchParams
    const currentPage = Math.max(1, parseInt(page ?? "1", 10))
    const skip = (currentPage - 1) * PAGE_SIZE

    const doctor = await getOrCreateDoctor()

    if (!doctor) {
        redirect("/unauthorized")
    }

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

    // Cargar las submissions con paginación
    const [submissions, totalCount] = await Promise.all([
        prisma.formSubmission.findMany({
            where: { formId },
            orderBy: { createdAt: "desc" },
            take: PAGE_SIZE,
            skip
        }),
        prisma.formSubmission.count({ where: { formId } })
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

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
                <>
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
                                    index={index + skip}
                                    totalSubmissions={totalSub}
                                    status={status}
                                    responses={responses}
                                    date={date}
                                />  
                            )
                        })}
                    </div>

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {hasPrevPage ? (
                                <Link
                                    href={`/dashboard/${formId}?page=${currentPage - 1}`}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                >
                                    Anterior
                                </Link>
                            ) : (
                                <span className="px-4 py-2 text-sm text-muted-foreground/50">Anterior</span>
                            )}

                            <span className="px-3 py-1 text-sm text-muted-foreground">
                                {currentPage} / {totalPages}
                            </span>

                            {hasNextPage ? (
                                <Link
                                    href={`/dashboard/${formId}?page=${currentPage + 1}`}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                >
                                    Siguiente
                                </Link>
                            ) : (
                                <span className="px-4 py-2 text-sm text-muted-foreground/50">Siguiente</span>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}