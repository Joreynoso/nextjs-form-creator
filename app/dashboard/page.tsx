// import breadcrumb components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// import dropdown menu components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// imports
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getOrCreateDoctor } from "@/lib/get-or-create-doctor"
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, Ghost } from 'lucide-react'
import Link from 'next/link'
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
                (<div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {forms.map((form) => (
                        <div key={form.id} className="relative group border rounded-xl bg-card p-5 space-y-2">

                            {/* menu desplegable */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'ghost'} size="icon-sm" className='absolute top-2 right-2'>
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="end">
                                    <DropdownMenuItem>
                                        <Link href={`/dashboard/${form.id}`}>
                                            Ver respuestas
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Editar formulario
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Eliminar formulario
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <p className='text-foreground font-semibold '>{form.name}</p>
                            <p className='text-muted-foreground text-sm'>{form.description}</p>
                            <p className='text-muted-foreground text-sm'>{form.isActive ? 'Activo' : 'Inactivo'}</p>
                            <p className='text-muted-foreground text-sm'>Generar link</p>
                            <p className='inline-block text-muted-foreground/70 text-xs bg-secondary/30 border border-secondary/40 rounded-full px-3 py-1'>
                                Creado: {form.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>)}
        </div>
    )
}