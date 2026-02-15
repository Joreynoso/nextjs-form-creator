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

            <div className="w-full mb-5">
                <p className="text-base text-muted-foreground leading-relaxed">
                    Administra tus formularios y respuestas.
                </p>
            </div>

            {/* lista de formularios */}
            {forms.length === 0 ? <FormEmpty /> :
                (<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    {forms.map((form) => (
                        <div key={form.id} 
                        className="group
                                   border
                                   rounded-xl
                                   bg-card
                                   p-5
                                   transition-all
                                   duration-300
                                   ease-out
                                   hover:shadow-lg
                                   hover:-translate-y-1
                                   hover:border-primary/30
                                   space-y-2">
                            <p className='text-foreground font-semibold '>{form.name}</p>
                            <p className='text-muted-foreground text-sm'>{form.description}</p>
                            <p className='inline-block text-muted-foreground/70 text-xs bg-secondary/30 border border-secondary/40 rounded-full px-3 py-1'>
                                Creado: {form.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>)}
        </div>
    )
}