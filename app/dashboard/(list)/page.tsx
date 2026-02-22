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
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"
import { prisma } from '@/lib/prisma'
import FormEmpty from '@/components/Dashboard/FormEmpty'
import FormCard from '@/components/Dashboard/FormCard'
import CreateFormButton from '@/components/Dashboard/createFormButton'

export default async function DashboardPage() {

    const { userId } = await auth()

    if (!userId) {
        redirect("/")
    }

    const doctor = await getOrCreateDoctor()

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
            <div className="w-full mb-5 flex items-center justify-between">
                <p className="text-base text-muted-foreground leading-relaxed">
                    Administra tus formularios y respuestas.
                </p>

                {/* client component */}
                <CreateFormButton />
            </div>

            {/* lista de formularios */}
            {forms.length === 0 ? <FormEmpty /> :
                (<div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {forms.map((form) => (
                        <FormCard key={form.id} form={form} />
                    ))}
                </div>)}
        </div>
    )
}