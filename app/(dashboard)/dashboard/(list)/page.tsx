// import breadcrumb components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// imports
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getOrCreateDoctor } from "@/actions/doctors/sync"
import { prisma } from '@/lib/prisma'
import FormEmpty from '@/components/Dashboard/FormEmpty'
import FormCard from '@/components/Dashboard/FormCard'
import CreateFormButton from '@/components/Dashboard/createFormButton'
import StatisticList from '@/components/Dashboard/StatisticList'

export default async function DashboardPage() {

    const { userId } = await auth()

    if (!userId) {
        redirect("/")
    }

    const doctor = await getOrCreateDoctor()

    // estadisticas
    const totalForms = await prisma.form.count({
        where: {
            doctorId: doctor.id
        }
    })

    // total de envios
    const totalSubmissions = await prisma.formSubmission.count({
        where: {
            form: {
                doctorId: doctor.id
            }
        }
    })

    // total de formularios abiertos (públicos)
    const totalOpenForms = await prisma.form.count({
        where: {
            doctorId: doctor.id,
            isPublicOpen: true
        }
    })

    // total de formularios cerrados (privados)
    const totalClosedForms = await prisma.form.count({
        where: {
            doctorId: doctor.id,
            isPublicOpen: false
        }
    })

    // buscar formularios
    const forms = await prisma.form.findMany({
        where: {
            doctorId: doctor.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    // render return
    return (
        <div className="w-full py-5">
            <Breadcrumb className='mb-5'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* titulo y crear nuevo formulario */}
            <div className="w-full mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <p className="text-base text-muted-foreground leading-relaxed mb-4 sm:mb-0">
                    Administra tus formularios y respuestas.
                </p>

                {/* client component */}
                <CreateFormButton />
            </div>

            {/* estadisticas */}
            <div className="flex items-center gap-4 py-10">
                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/60 whitespace-nowrap">Estadísticas Globales</span>
                <div className="h-px w-full bg-linear-to-r from-border/40 to-transparent" />
            </div>
            
            <StatisticList 
            totalForms={totalForms}
            totalSubmissions={totalSubmissions}
            totalActiveForms={totalOpenForms}
            totalInactiveForms={totalClosedForms}
            />

            {/* lista de formularios */}
            <div className="flex items-center gap-4 py-10">
                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary/60 whitespace-nowrap">Mis Formularios</span>
                <div className="h-px w-full bg-linear-to-r from-border/40 to-transparent" />
            </div>

            {forms.length === 0 ? <FormEmpty /> :
                (<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {forms.map((form) => (
                        <FormCard key={form.id} form={form} />
                    ))}
                </div>)}
        </div>
    )
}