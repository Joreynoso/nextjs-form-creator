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
import { EllipsisVertical, FileText, Copy, ExternalLink, Eye, Calendar, Ghost } from 'lucide-react'
import Link from 'next/link'
import FormEmpty from '@/components/Dashboard/FormEmpty'
import { Badge } from '@/components/ui/badge'

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
                        <div key={form.id} className="relative flex flex-col justify-between border rounded-xl bg-card p-5 min-h-[160px]">

                            <div className="space-y-3">
                                <div className="flex justify-between items-start pr-8">
                                    <p className='text-foreground font-semibold line-clamp-1'>{form.name}</p>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={'ghost'} size="icon-xs" className='absolute top-3 right-3 opacity-70 hover:opacity-100'>
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-40" align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/${form.id}`} className="flex items-center gap-2 cursor-pointer">
                                                    <Eye className="size-4" />
                                                    Ver respuestas
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                <FileText className="size-4" />
                                                Editar formulario
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer">
                                                <Ghost className="size-4 text-destructive" />
                                                Eliminar formulario
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <p className='text-muted-foreground text-sm line-clamp-2 leading-snug'>
                                    {form.description || "Sin descripción"}
                                </p>

                                <div className="flex flex-wrap gap-2 items-center pt-1">
                                    <Badge variant={form.isActive ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                                        {form.isActive ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                    <Button variant="ghost" size="xs" className="h-6 text-[11px] text-muted-foreground hover:text-primary gap-1 px-1.5">
                                        <Copy className="size-3" />
                                        Link
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-muted-foreground/80 text-[11px]">
                                    <Calendar className="size-3" />
                                    {form.createdAt.toLocaleDateString()}
                                </span>
                                <Link
                                    href={`/dashboard/${form.id}`}
                                    className="text-[11px] font-medium text-primary flex items-center gap-1 hover:underline"
                                >
                                    Ver todas <ExternalLink className="size-2.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>)}
        </div>
    )
}