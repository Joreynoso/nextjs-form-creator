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

    return (
        <div className="w-full py-5">
            <Breadcrumb className="mb-5">
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

            <div className="w-full mb-5">
                <p className="text-base text-muted-foreground leading-relaxed">
                    Administra tus formularios y respuestas.
                </p>
            </div>

            {/* lista de formularios */}
            { forms.length === 0 ? <FormEmpty /> : 
            (<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
                {forms.map((form) => (
                    <div key={form.id} className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <p className='text-primary font-semibold'>{form.name}</p>
                        <p className='text-foreground text-sm'>{form.description}</p>
                        <p className='text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1 max-w-fit'>
                            Creado: {form.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>) }
        </div>
    )
}